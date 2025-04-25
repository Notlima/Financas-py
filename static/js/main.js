import { 
  fetchTransactions, 
  addTransaction, 
  fetchSummary 
} from './api.js';

import { 
  renderTransactions,
  handleAddTransaction, 
  updateSummary, 
  showFeedback,
  updateCurrentMonth,
  resetForm,
  DOM
} from './dom.js';

import { currentCurrency, toggleCurrency } from './utils.js';

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  DOM.dataInput().value = new Date().toISOString().split('T')[0];
  updateCurrentMonth();
  await loadTransactions();
  setupEventListeners();
});

// Funções principais
export async function loadTransactions() {
  try {
      const transactions = await fetchTransactions();
      renderTransactions(transactions);
      const balance = await fetchSummary();
      updateSummary(balance);
  } catch (error) {
      console.error("Erro:", error);
      showFeedback("Erro ao carregar transações", 'error');
  }
}

// Event Listeners
export function setupEventListeners() {
  document.querySelector('.currency-toggle').addEventListener('click', async () => {
      toggleCurrency(DOM.currencyToggle());
      await loadTransactions();
  });
  
  document.getElementById('btn-adicionar').addEventListener('click', handleAddTransaction);
}
