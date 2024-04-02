const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // selecting USD by default as FROM currency and NPR as TO currency
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "NPR" ? "selected" : "";
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // calling loadFlag with passing target element as an argument
    });
}
function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();
});
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate(); // calling getExchangeRate
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/6adba2f67e9d4b29072f023f/latest/${fromCurrency.value}`;
    
    fetch(url)
    .then(response => response.json())
    .then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]; 
        let convertedAmount = (amountVal * exchangeRate).toFixed(4); 
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} converted to ${convertedAmount} ${toCurrency.value}. Exchange Rate: ${exchangeRate}`;
    })
    .catch(() => { // if user is offline or any other error occured while fetching data then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });
}



document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');
    const flagsDiv = document.getElementById('flags');

    // Function to fetch and populate currency options
    async function populateCurrencies() {
        try {
            const response = await fetch('https://www.exchangerate-api.com/docs/supported-currencies');
            const data = await response.json();
            
            const fromCurrencySelect = document.getElementById('from-currency');
            const toCurrencySelect = document.getElementById('to-currency');
    
            for (const currencyCode in data) {
                const currencyName = data[currencyCode];
                const fromOption = new Option(`${currencyCode} - ${currencyName}`, currencyCode);
                const toOption = new Option(`${currencyCode} - ${currencyName}`, currencyCode);
    
                fromCurrencySelect.add(fromOption);
                toCurrencySelect.add(toOption);
            }
        } catch (error) {
            console.error('Error fetching currency data:', error);
        }
    }
    
    
    document.addEventListener('DOMContentLoaded', function() {
        populateCurrencies();
    });

    // Function to fetch and display country flags
    async function displayFlags(currency) {
        const response = await fetch('https://gist.githubusercontent.com/manishtiwari25/d3984385b1cb200b98bcde6902671599/raw/95d79b499a4a2b3d748b6f72cfa7a049d6bf2da2/country-flags.json');
        const flagsData = await response.json();

        flagsDiv.innerHTML = ''; // Clear previous flags

        for (const [code, info] of Object.entries(flagsData)) {
            if (info.currency_code === currency) {
                const flagImg = document.createElement('img');
                flagImg.src = info.flag;
                flagImg.alt = info.country_name;
                flagImg.title = info.country_name;
                flagImg.classList.add('flag');
                flagsDiv.appendChild(flagImg);
            }
        }
    }

    // Function to handle form submission
   async function convertCurrency(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    const response = await fetch(`https://v6.exchangerate-api.com/v6/6adba2f67e9d4b29072f023f/pair/${fromCurrency}/${toCurrency}`);
    const data = await response.json();

    if (data.result === 'success') {
        const convertedAmount = (amount * data.conversion_rate).toFixed(4);
        const exchangeRate = data.conversion_rate.toFixed(4);
        resultDiv.textContent = `${amount} ${fromCurrency} converted to ${convertedAmount} ${toCurrency}. Exchange Rate: ${exchangeRate}`;
        displayFlags(toCurrency); // Display flags for the 'to' currency
    } else {
        resultDiv.textContent = 'Failed to convert currency. Please try again later.';
    }
}

    // Function to switch 'from' and 'to' currencies
    function switchCurrencies() {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;

        document.getElementById('from-currency').value = toCurrency;
        document.getElementById('to-currency').value = fromCurrency;
    }

    // Event listeners
    form.addEventListener('submit', convertCurrency);
    document.getElementById('switch').addEventListener('click', switchCurrencies);

    // Populate currency options on page load
    populateCurrencies();
});
