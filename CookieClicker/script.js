let cookieButton = document.getElementById("cookieButton");
let cookieDisplay = document.getElementById("cookieDisplay");

let upgradeButton = document.getElementById("upgradeButton");
let autoClickerButton =  document.getElementById("autoClicker");

let cookies = 0;
let multiplier = 1;
let multiplierCost = 25;
let autoClickers = 0;
let autoClickerCost = 1;

let cookieImage;

function displayCookiesAmount(){
    cookieDisplay.innerText = "You have " + Math.round(cookies *100)/100 + " cookies";
}

cookieButton.addEventListener("click", function(){
    cookies += multiplier;
    displayCookiesAmount();
})

upgradeButton.addEventListener("click", function(){
    if(cookies >= multiplierCost){
        cookies -= multiplierCost;
        multiplierCost *= 1.3;
        multiplier++;
        displayCookiesAmount();
        upgradeButton.innerText = "Upgrade clicker for "+ Math.round(multiplierCost*100)/100 + " cookies"
    }else{
        alert("Not enough cookies")
    }
})

setInterval(function(){
    cookies+= autoClickers*0.1;
    displayCookiesAmount();
}, 1000/6)


paywallOverlay = document.getElementById("paywallOverlay");

function showPaymentForm() {
    paywallOverlay.style.display = "flex";
    document.getElementById("paymentForm").style.display = "block";
    console.log("Showed payment form");
}

function increaseAutoClicker(){
    autoClickerCost*=1.5;
    autoClickers++;
    displayCookiesAmount();
    autoClickerButton.innerText = "Purchase upgrade for auto clicker:  " + Math.round(autoClickerCost*100)/100 + "$" 
}

function submitPayment() {
    alert("Payment successful! Upgrades unlocked.");
    paywallOverlay.style.display = "none";
    increaseAutoClicker();
    console.log("Bought an upgrade!!");
}

function exitPayment(){
    paywallOverlay.style.display = "none"
}