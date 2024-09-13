let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalProfit = parseFloat(localStorage.getItem('totalProfit')) || 0;
let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

// Função para adicionar veículo
document.getElementById('vehicleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const vehicle = document.getElementById('vehicle').value;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const salePrice = parseFloat(document.getElementById('salePrice').value);
    const profit = salePrice - purchasePrice;

    const newVehicle = { vehicle, purchasePrice, salePrice, profit };
    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));

    totalProfit += profit;
    localStorage.setItem('totalProfit', totalProfit);

    renderTable();
    document.getElementById('vehicleForm').reset();
});

// Função para adicionar despesas
document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const expenseType = document.getElementById('expenseType').value;
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);

    const newExpense = { expenseType, expenseAmount };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    totalExpenses += expenseAmount;
    localStorage.setItem('totalExpenses', totalExpenses);

    renderTable();
    document.getElementById('expenseForm').reset();
});

// Função para renderizar tabela de veículos e despesas
function renderTable() {
    const tableBody = document.getElementById('vehicleTableBody');
    tableBody.innerHTML = '';
    vehicles.forEach((v) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.vehicle}</td>
            <td>R$ ${v.purchasePrice.toFixed(2)}</td>
            <td>R$ ${v.salePrice.toFixed(2)}</td>
            <td>R$ ${v.profit.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalProfit').innerText = `R$ ${totalProfit.toFixed(2)}`;
    document.getElementById('totalExpenses').innerText = `R$ ${totalExpenses.toFixed(2)}`;
}

// Função para gerar relatórios
function generateReport(type) {
    const reportSection = document.getElementById('reportSection');
    let report = '';

    if (type === 'monthly') {
        report = `<p>Relatório Mensal: <br> Lucro: R$ ${totalProfit.toFixed(2)}, Despesas: R$ ${totalExpenses.toFixed(2)}</p>`;
    } else if (type === 'quarterly') {
        report = `<p>Relatório Trimestral: <br> Lucro: R$ ${totalProfit.toFixed(2)}, Despesas: R$ ${totalExpenses.toFixed(2)}</p>`;
    }

    reportSection.innerHTML = report;
}

// Função para buscar veículos
document.getElementById('searchBar').addEventListener('input', function(event) {
    const searchQuery = event.target.value.toLowerCase();
    const filteredVehicles = vehicles.filter((v) =>
        v.vehicle.toLowerCase().includes(searchQuery)
    );

    const tableBody = document.getElementById('vehicleTableBody');
    tableBody.innerHTML = '';
    filteredVehicles.forEach((v) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.vehicle}</td>
            <td>R$ ${v.purchasePrice.toFixed(2)}</td>
            <td>R$ ${v.salePrice.toFixed(2)}</td>
            <td>R$ ${v.profit.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
});

// Inicializar tabelas
renderTable();
