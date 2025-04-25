// Variável global
export let currentCurrency = '€';

// Formatação de valores
export const formatValue = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${currentCurrency}0.00`;
    
    const absoluteValue = Math.abs(numericValue);
    const formattedValue = `${currentCurrency}${absoluteValue.toFixed(2)}`;
    
    return numericValue < 0 ? `-${formattedValue}` : formattedValue;
}

// Alternar moeda
export function toggleCurrency(currencyToggleElement) {
    currentCurrency = currentCurrency === '€' ? 'R$' : '€';
    currencyToggleElement.textContent = `${currentCurrency} → ${currentCurrency === '€' ? 'R$' : '€'}`;
    return currentCurrency;
}