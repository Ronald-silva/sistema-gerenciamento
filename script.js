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
    const transactionDate = document.getElementById('transactionDate').value;
    const profit = salePrice - purchasePrice;

    const newVehicle = { vehicle, purchasePrice, salePrice, profit, transactionDate };
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
    const expenseDate = document.getElementById('expenseDate').value;

    const newExpense = { expenseType, expenseAmount, expenseDate };
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
            <td>${v.transactionDate}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalProfit').innerText = `R$ ${totalProfit.toFixed(2)}`;
    document.getElementById('totalExpenses').innerText = `R$ ${totalExpenses.toFixed(2)}`;
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
    report += `<h4>Relatório de Veículos</h4><table><tr><th>Veículo</th><th>Compra</th><th>Venda</th><th>Lucro</th><th>Data</th></tr>`;
    vehicles.forEach((v) => {
        report += `<tr><td>${v.vehicle}</td><td>R$ ${v.purchasePrice.toFixed(2)}</td><td>R$ ${v.salePrice.toFixed(2)}</td><td>R$ ${v.profit.toFixed(2)}</td><td>${v.transactionDate}</td></tr>`;
    });
    report += `</table>`;

    // Relatório de Despesas
    report += `<h4>Relatório de Despesas</h4><table><tr><th>Tipo</th><th>Valor</th><th>Data</th></tr>`;
    expenses.forEach((e) => {
        report += `<tr><td>${e.expenseType}</td><td>R$ ${e.expenseAmount.toFixed(2)}</td><td>${e.expenseDate}</td></tr>`;
    });
    report += `</table>`;

    // Totalizadores
    report += `<h4>Total de Lucro: R$ ${totalProfit.toFixed(2)}</h4>`;
    report += `<h4>Total de Despesas: R$ ${totalExpenses.toFixed(2)}</h4>`;

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
            <td>${v.transactionDate}</td>
        `;
        tableBody.appendChild(row);
    });
});

// Inicializar tabelas
renderTable();
