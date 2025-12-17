const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const SHARED_SECRET = "password"

// fictional accounts
const accounts = {
  game_account: {
    id: "game_account",
    balance: 0,
  },
  player_account: {
    id: "player_account",
    balance: 1000000000,
  },
};

// send webhook to game server
function sendWebhook(callbackUrl, payload) {
  const body = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", SHARED_SECRET)
    .update(body, "utf8")
    .digest("hex");

  return fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
    body,
  });
}

app.post("/transfer", async (req, res) => {
  const { transactionId, from, to, amount, callbackUrl } = req.body;

  console.log(`New transfer: ${transactionId}`);

  // validation
  if (!transactionId || !from || !to || !amount || !callbackUrl) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (!accounts[from] || !accounts[to]) {
    return res.status(400).json({ error: "Unknown account" });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // confirmation response
  res.status(202).json({ status: "ACCEPTED" });

  // bank processing delay
  setTimeout(async () => {
    // check funds
    if (accounts[from].balance < amount) {
      console.log(`${transactionId}: Not enough funds (${from} balance: ${accounts[from].balance})`);

      await sendWebhook(callbackUrl, {
        transactionId,
        status: "FAILED",
        reason: "INSUFFICIENT_FUNDS",
      });

      return;
    }

    // transfer
    accounts[from].balance -= amount;
    accounts[to].balance += amount;

    console.log(
      `${transactionId}: ${amount} transfered (${from} → ${to})`
    );

    // success webhook
    await sendWebhook(callbackUrl, {
      transactionId,
      status: "SUCCESS",
      amount,
      from,
      to,
      balances: {
        player: accounts.player_account.balance,
        game: accounts.game_account.balance,
      },
    });
  }, 2000);
});

// check account balances
app.get("/accounts", (req, res) => {
  res.json(accounts);
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
