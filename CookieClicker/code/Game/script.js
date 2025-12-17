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

cookieButton.addEventListener("click", function(e){
    const rect = cookieButton.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const radius = rect.width / 2;

    const precisionBonus = Math.max(0.2, 1 - dist / radius);
    cookies += multiplier * precisionBonus
    const cookieSize = rect.width;

    const maxX = window.innerWidth - cookieSize;
    const maxY = window.innerHeight - cookieSize;

    const randomX = Math.random() * maxX;   
    const randomY = Math.random() * maxY;

    cookieButton.style.left = randomX + "px";
    cookieButton.style.top = randomY + "px";

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

async function submitPayment() {
    const name = document.querySelector('#paymentForm input[type="text"]').value;
    const accountNumber = document.querySelectorAll('#paymentForm input[type="text"]')[1].value;

    if (!name || !accountNumber) {
        alert("Please fill in all fields!");
        return;
    }

    // Skryjeme formulář a ukážeme "Processing"
    document.getElementById("paymentForm").innerHTML = "<h2>Processing Transaction...</h2>";

    try {
        const response = await fetch("http://localhost:4000/buy-addon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerId: "player_account", // ID z bankovního serveru
                addonName: "AutoClicker Upgrade",
                price: autoClickerCost
            })
        });

        const data = await response.json();
        
        if (data.status === "PROCESSING") {
            // Zde by v reálné aplikaci byl WebSocket nebo Long Polling. 
            // Pro jednoduchost teď budeme simulovat úspěch po krátké pauze.
            setTimeout(() => {
                alert("Payment successful! Bank confirmed transaction.");
                paywallOverlay.style.display = "none";
                increaseAutoClicker();
                // Reset formuláře pro příště
                location.reload(); 
            }, 2500);
        }
    } catch (error) {
        console.error("Connection to GameShop failed", error);
        alert("Shop server is offline.");
        exitPayment();
    }
}

function exitPayment(){
    paywallOverlay.style.display = "none"
}