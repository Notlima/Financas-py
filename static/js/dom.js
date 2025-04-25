import { formatValue } from './utils.js';
import { addTransaction } from './api.js';
import { loadTransactions } from './main.js';
import { currentCurrency } from './utils.js';

// Mapeamento de categorias
const CATEGORY_MAP = {
    'academia': 'Academia',
    'alimentacao': 'Alimentação',
    'moradia': 'Moradia',
    'salario': 'Salário',
    'restaurante': 'Restaurante',
    'transporte': 'Transporte'
};

// Elementos DOM
export const DOM = {
    valorInput: () => document.getElementById("valor"),
    categoriaSelect: () => document.getElementById("categoria"),
    dataInput: () => document.getElementById("data"),
    transactionsContainer: () => document.getElementById("transacoes"),
    currentMonthDisplay: () => document.getElementById("currentMonth"),
    totalEntradas: () => document.getElementById("total-entradas"),
    totalSaidas: () => document.getElementById("total-saidas"),
    saldoDisplay: () => document.getElementById("saldo"),
    currencyToggle: () => document.querySelector('.currency-toggle')
};

// Funções de renderização
export function renderTransactions(transactions) {
    const container = DOM.transactionsContainer();
    container.innerHTML = "<h2>Últimas Transações</h2>";
    
    transactions.forEach(transacao => {
        const valorNumerico = parseFloat(transacao.valor);
        const valueClass = valorNumerico < 0 ? 'negative-value' : 'positive-value';
        
        container.innerHTML += `
            <div class="transacao">
                <span>${CATEGORY_MAP[transacao.categoria] || transacao.categoria}</span>
                <span class="${valueClass}">${formatValue(valorNumerico)}</span>
                <span>${new Date(transacao.data).toLocaleDateString()}</span>
            </div>
        `;
    });
}

export function updateSummary(balance) {
    DOM.totalEntradas().textContent = `+${currentCurrency}${balance.entradas.toFixed(2)}`;
    DOM.totalSaidas().textContent = `-${currentCurrency}${balance.saidas.toFixed(2)}`;
    
    const saldoElement = DOM.saldoDisplay();
    const formattedBalance = balance.saldo < 0 
        ? `-${currentCurrency}${Math.abs(balance.saldo).toFixed(2)}`
        : `${currentCurrency}${balance.saldo.toFixed(2)}`;
    
    saldoElement.textContent = formattedBalance;
    saldoElement.classList.toggle("negative", balance.saldo < 0);
}

export function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

export function updateCurrentMonth() {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const today = new Date();
    DOM.currentMonthDisplay().textContent = `${months[today.getMonth()]} ${today.getFullYear()}`;
}

export function resetForm() {
    DOM.valorInput().value = "";
    DOM.dataInput().value = new Date().toISOString().split('T')[0];
}

export const handleAddTransaction = async () => {
    const valor = DOM.valorInput().value;
    const categoria = DOM.categoriaSelect().value;

    if (!valor || isNaN(valor)) {
        showFeedback("Por favor, insira um valor!", 'error');
        return;
    }

    if (!categoria){
        showFeedback("Por favor, selecione uma categoria!", 'error');
        return;
    }

    try {
        const transactionData = {
            valor: parseFloat(valor),
            categoria: DOM.categoriaSelect().value,
            data: DOM.dataInput().value
        };

        const response = await addTransaction(transactionData);
        
        if (response.status === 'success') {
            showFeedback('Transação adicionada com sucesso!');
            resetForm();
            await loadTransactions();
        } else {
            showFeedback("Erro ao adicionar transação", 'error');
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        showFeedback("Erro ao adicionar transação", 'error');
    }
};