const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SHARED_SECRET = "password";
const BANK_URL = "http://localhost:3000/transfer";


function callBankTransfer(payload) {
  const body = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", SHARED_SECRET)
    .update(body, "utf8")
    .digest("hex");

  return fetch(BANK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
    body,
  }).catch((err) =>
    console.error(`Transaction ${payload.transactionId}: Bank connection failed`, err)
  );
}


app.post("/buy-addon", (req, res) => {
  const { playerId, addonName, price } = req.body;
  const transactionId = `tx-${Date.now()}`;

  console.log(`New purchase request: ${addonName} for ${price} coins`);

  
  if (!playerId || !addonName || !price) {
    return res.status(400).json({ error: "Missing purchase data" });
  }


  res.status(202).json({ status: "PROCESSING", message: "Contacting bank..." });


  const bankPayload = {
    transactionId: transactionId,
    from: playerId,        
    to: "game_account",    
    amount: price,
    callbackUrl: "http://localhost:4000/payment-result"
  };

  callBankTransfer(bankPayload);
});

app.post("/payment-result", (req, res) => {
  const { transactionId, status, reason } = req.body;



  if (status === "SUCCESS") {
    console.log(`[${transactionId}] PAID!`);

  } else {
    console.log(`[${transactionId}] DECLINED! ${reason}`);

  }

  res.status(200).send("OK");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Game Shop running on http://localhost:${PORT}`));