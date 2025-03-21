const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const loader = document.getElementById("loader");
const errorDiv = document.getElementById("error");
const cryptoTableBody = document.getElementById("cryptoTableBody");

searchButton.addEventListener("click", fetchCryptoData);

async function fetchCryptoData() {
    const query = searchBar.value.trim();
    if (!query) {
        errorDiv.textContent = "Please enter a cryptocurrency symbol or name (e.g., BTC or bitcoin)";
        errorDiv.classList.remove("hidden");
        return;
    }

    loader.classList.remove("hidden");
    errorDiv.classList.add("hidden");
    cryptoTableBody.innerHTML = ""; // Clear previous results

    try {
        const response = await fetch(`/api/crypto?query=${query}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        const cryptoData =
            data.data[query.toUpperCase()] || Object.values(data.data)[0]; // Handle both symbol and slug

        if (!cryptoData || !cryptoData.quote || !cryptoData.quote.USD) {
            throw new Error(`No data found for cryptocurrency "${query}"`);
        }

        displayCryptoData(cryptoData);
    } catch (error) {
        console.error(error.message);
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    } finally {
        loader.classList.add("hidden");
    }
}

function displayCryptoData(crypto) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${crypto.name}</td>
        <td>${crypto.symbol}</td>
        <td>$${crypto.quote.USD.price.toFixed(2)}</td>
        <td>${crypto.quote.USD.percent_change_24h.toFixed(2)}%</td>
    `;
    cryptoTableBody.appendChild(row);
}
