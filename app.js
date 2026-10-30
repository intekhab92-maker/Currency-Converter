
const ENDPOINTS = [
    (code) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${code}.json`,
    (code) => `https://latest.currency-api.pages.dev/v1/currencies/${code}.json`,
];

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const amount = document.querySelector(".amount input");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ---------- Populate dropdowns ----------
for (const select of dropdowns) {
    for (const currency_code in country_List) {
        const option = document.createElement("option");
        option.value = currency_code;
        option.innerText = currency_code;
        if (select.name === "from" && currency_code === "USD") option.selected = true;
        if (select.name === "to" && currency_code === "INR") option.selected = true;
        select.appendChild(option);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updatedCurrency(); // optional: auto-convert when a currency changes
    });
}

const updateFlag = (select) => {
    const country_code = country_List[select.value];
    const img = select.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${country_code}/flat/64.png`;
};

// ---------- API with fallback ----------
const fetchJSON = async (url, timeoutMs = 5000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
};

const getRates = async (base) => {
    base = base.toLowerCase();
    let lastError;
    for (const buildUrl of ENDPOINTS) {
        const url = buildUrl(base);
        try {
            const data = await fetchJSON(url);
            if (!data || typeof data[base] !== "object") {
                throw new Error("Unexpected response shape");
            }
            return data[base];
        } catch (err) {
            console.warn("Failed:", url, err.message);
            lastError = err;
        }
    }
    throw new Error(`All endpoints failed (${lastError?.message})`);
};


const updatedCurrency = async () => {
    let amntVal = parseFloat(amount.value);
    if (isNaN(amntVal) || amntVal <= 0) {
        amntVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value;
    const to = toCurr.value;
    msg.innerText = "Getting exchange rate...";

    try {
        const rates = await getRates(from);
        const rate = rates[to.toLowerCase()];
        if (typeof rate !== "number") {
            msg.innerText = `Rate for ${from} → ${to} is not available.`;
            return;
        }
        const result = (amntVal * rate).toFixed(2);
        msg.innerText = `${amntVal} ${from} = ${result} ${to}`;
    } catch (err) {
        console.error(err);
        msg.innerText = "Couldn't fetch the exchange rate. Please try again.";
    }
};


btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updatedCurrency();   // this line was missing
});

window.addEventListener("load", () => {
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updatedCurrency();
});