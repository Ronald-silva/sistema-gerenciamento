const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Conectando ao MongoDB (altere a URL para seu próprio cluster MongoDB)
mongoose.connect('mongodb://localhost:27017/vehicle-management', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

// Modelos do MongoDB
const UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   role: String, // Ex: admin, staff
});

const VehicleSchema = new mongoose.Schema({
   vehicle: String,
   purchasePrice: Number,
   salePrice: Number,
   transactionDate: Date,
   profit: Number,
});

const ExpenseSchema = new mongoose.Schema({
   expenseType: String,
   expenseAmount: Number,
   expenseDate: Date,
});

const User = mongoose.model('User', UserSchema);
const Vehicle = mongoose.model('Vehicle', VehicleSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

// Rota para registrar um novo usuário (apenas admins devem fazer isso)
app.post('/register', async (req, res) => {
   const { username, password, role } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({ username, password: hashedPassword, role });
   await newUser.save();
   res.json({ message: 'Usuário registrado com sucesso' });
});

// Rota de login
app.post('/login', async (req, res) => {
   const { username, password } = req.body;
   const user = await User.findOne({ username });
   if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

   const isValidPassword = await bcrypt.compare(password, user.password);
   if (!isValidPassword) return res.status(401).json({ error: 'Senha incorreta' });

   const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });
   res.json({ token });
});

// Middleware para autenticação de rotas
const authenticate = (req, res, next) => {
   const token = req.headers['authorization'];
   if (!token) return res.status(401).json({ error: 'Token necessário' });

   jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Token inválido' });
      req.user = decoded;
      next();
   });
};

// Rota para adicionar veículos (somente usuários autorizados)
app.post('/vehicles', authenticate, async (req, res) => {
   const { vehicle, purchasePrice, salePrice, transactionDate } = req.body;
   const profit = salePrice - purchasePrice;
   const newVehicle = new Vehicle({ vehicle, purchasePrice, salePrice, transactionDate, profit });
   await newVehicle.save();
   res.json(newVehicle);
});

// Rota para adicionar despesas (somente usuários autorizados)
app.post('/expenses', authenticate, async (req, res) => {
   const { expenseType, expenseAmount, expenseDate } = req.body;
   const newExpense = new Expense({ expenseType, expenseAmount, expenseDate });
   await newExpense.save();
   res.json(newExpense);
});

// Rota para buscar todos os veículos
app.get('/vehicles', authenticate, async (req, res) => {
   const vehicles = await Vehicle.find();
   res.json(vehicles);
});

// Iniciando o servidor
app.listen(3000, () => {
   console.log('Servidor rodando na porta 3000');
});
