const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button")
let amount = document.querySelector(".amount input")
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg")


window.addEventListener("load", () => {
    updatedCurrency();
})

for (select of dropdowns) {
    for(let currency_code in country_List) {
        let newOptions = document.createElement("option");
        newOptions.value = currency_code;
        newOptions.innerText = currency_code;
        if(select.name == "from" && currency_code == "USD") {
            newOptions.selected = true;
        }else if(select.name == "to" && currency_code == "INR") {
            newOptions.selected = true;
        }
        select.appendChild(newOptions);    
}

    select.addEventListener("change", (evet) => {
           updateFlag(evet.target)
        //    console.log(evet.target.value);
           
        })
}

const updateFlag = (e) => {
    let currency_code = e.value;
    let country_code = country_List[currency_code];
    let newsrc = `https://flagsapi.com/${country_code}/flat/64.png`;
    let img = e.parentElement.querySelector("img");
    img.src = newsrc;
}

btn.addEventListener("click", (eve) => {
    eve.preventDefault();
       
})

const updatedCurrency = async () => {

    let amntVal = amount.value;
    if(amntVal === "" || amntVal < 1) {
        amntVal = 1;
        amount.value = "1"
    }
    
    let URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    const res = await fetch(URL);
    const data = await res.json();

    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let currencyConverter = amntVal * rate;
    
    msg.innerText = `${amntVal} ${fromCurr.value} = ${currencyConverter} ${toCurr.value}`
}