const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const {keccak256} = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "030dfba17c6532cdb752e75a33d0b3348bde75289059b7047187893df1c86725c6": 100, //2635087c5cddbd480107be0bdcc476eb67c3409fdc7c37593626540a4e526aed
  "0226ce37f7aafbfa286f24829c68e567a04950c60128ef23cf584d8d80b1d5cf52": 50, //2be149a9840479b006b1becd51f33ca76f2cb3593ea3991130e8db9c2a607c56
  "0335ddea3ed3630b3f6e8ca99b09f6811b29c09114c6636d33df1dbbf85ada6a3c": 75, //e176b4f2bca513b2c4effe71a33a81bdbd59ee80a1921cede49c74e9d1b3e843
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, sig:sigStringed, msg } = req.body;
  const { recipient, amount } = msg;

  const sig = {
    ...sigStringed,
    r: BigInt(sigStringed.r),
    s: BigInt(sigStringed.s),
  }
  
  const hashMessage = (message) => keccak256(Uint8Array.from(message));
  const isValid = secp.secp256k1.verify(sig, hashMessage(message), publicKey) === true;
  if (!isValid) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
