// Configurações globais
const API_BASE_URL = window.location.origin;

export async function fetchTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error("Erro ao carregar transações");
    return await response.json();
}

export async function addTransaction(transactionData) {
    try{
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData)
        });
        if (!response.ok) throw new Error ("Erro ao adcionar transação")
        return await response.json(); 
    } catch(error){
        console.error("Erro na requisição: ", error)
        throw error
    }
}

export async function fetchSummary() {
    const response = await fetch(`${API_BASE_URL}/transactions/summary`);
    if (!response.ok) throw new Error("Erro ao carregar resumo");
    return await response.json();
}