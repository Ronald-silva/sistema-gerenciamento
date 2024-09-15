// Inicializar variáveis
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalProfit = parseFloat(localStorage.getItem('totalProfit')) || 0;
let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

// Função para formatar o campo de input como moeda
function formatInputCurrency(input) {
    let value = input.value;
    // Remover todos os caracteres que não são números
    value = value.replace(/\D/g, '');
    value = (value / 100).toFixed(2); // Adicionar os centavos
    input.value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adicionar eventos de formatação de moeda para os inputs de preço
document.getElementById('purchasePrice').addEventListener('input', function() {
    formatInputCurrency(this);
});

document.getElementById('salePrice').addEventListener('input', function() {
    formatInputCurrency(this);
});

document.getElementById('expenseAmount').addEventListener('input', function() {
    formatInputCurrency(this);
});

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para adicionar veículo
document.getElementById('vehicleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const vehicle = document.getElementById('vehicle').value;
    const year = document.getElementById('year').value; // Capturar o ano
    const color = document.getElementById('color').value; // Capturar a cor
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value.replace(/\D/g, '')) / 100;
    const salePrice = parseFloat(document.getElementById('salePrice').value.replace(/\D/g, '')) / 100;
    const transactionDate = document.getElementById('transactionDate').value;
    const profit = salePrice - purchasePrice;

    const newVehicle = { vehicle, year, color, purchasePrice, salePrice, profit, transactionDate };
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
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value.replace(/\D/g, '')) / 100;
    const expenseDate = document.getElementById('expenseDate').value;

    const newExpense = { expenseType, expenseAmount, expenseDate };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    totalExpenses += expenseAmount;
    localStorage.setItem('totalExpenses', totalExpenses);

    renderTable();
    document.getElementById('expenseForm').reset();
});

// Função para renderizar a tabela de veículos e despesas
function renderTable() {
    const tableBody = document.getElementById('vehicleTableBody');
    tableBody.innerHTML = '';
    vehicles.forEach((v) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.vehicle}</td>
            <td>${v.year}</td>
            <td>${v.color}</td>
            <td>${formatCurrency(v.purchasePrice)}</td>
            <td>${formatCurrency(v.salePrice)}</td>
            <td>${formatCurrency(v.profit)}</td>
            <td>${v.transactionDate}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalProfit').innerText = formatCurrency(totalProfit);
    document.getElementById('totalExpenses').innerText = formatCurrency(totalExpenses);
}

// Função para gerar relatórios detalhados
function generateReport(type) {
    const reportSection = document.getElementById('reportSection');
    let report = '';

    if (type === 'monthly') {
        report += `<h3>Relatório Mensal</h3>`;
    } else if (type === 'quarterly') {
        report += `<h3>Relatório Trimestral</h3>`;
    }

    // Relatório de Veículos
    report += `<h4>Relatório de Veículos</h4><table><tr><th>Veículo</th><th>Ano</th><th>Cor</th><th>Compra</th><th>Venda</th><th>Lucro</th><th>Data</th></tr>`;
    vehicles.forEach((v) => {
        report += `<tr><td>${v.vehicle}</td><td>${v.year}</td><td>${v.color}</td><td>${formatCurrency(v.purchasePrice)}</td><td>${formatCurrency(v.salePrice)}</td><td>${formatCurrency(v.profit)}</td><td>${v.transactionDate}</td></tr>`;
    });
    report += `</table>`;

    // Relatório de Despesas
    report += `<h4>Relatório de Despesas</h4><table><tr><th>Tipo</th><th>Valor</th><th>Data</th></tr>`;
    expenses.forEach((e) => {
        report += `<tr><td>${e.expenseType}</td><td>${formatCurrency(e.expenseAmount)}</td><td>${e.expenseDate}</td></tr>`;
    });
    report += `</table>`;

    // Totalizadores
    report += `<h4>Total de Lucro: ${formatCurrency(totalProfit)}</h4>`;
    report += `<h4>Total de Despesas: ${formatCurrency(totalExpenses)}</h4>`;

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
            <td>${v.year}</td>
            <td>${v.color}</td>
            <td>${formatCurrency(v.purchasePrice)}</td>
            <td>${formatCurrency(v.salePrice)}</td>
            <td>${formatCurrency(v.profit)}</td>
            <td>${v.transactionDate}</td>
        `;
        tableBody.appendChild(row);
    });
});

// Inicializar tabelas ao carregar a página
renderTable();
