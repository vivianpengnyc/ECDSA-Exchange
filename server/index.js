const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const ec1 = new EC('secp256k1');
const ec2 = new EC('secp256k1');
const ec3 = new EC('secp256k1');

const key1 = ec1.genKeyPair();
const key2 = ec2.genKeyPair();
const key3 = ec3.genKeyPair();

let publicAddress1 = key1.getPublic().encode('hex');
let privateAdress1 = key1.getPrivate().toString(16);

let publicAddress2 = key2.getPublic().encode('hex');
let privateAdress2 = key2.getPrivate().toString(16);

let publicAddress3 = key3.getPublic().encode('hex');
let privateAdress3 = key3.getPrivate().toString(16);

const senderToPrivateaddress = {
  "1": privateAdress1,
  "2": privateAdress2,
  "3": privateAdress3,
}


const balances = {
  [publicAddress1]: 100,
  [publicAddress2]: 100,
  [publicAddress3]: 100,
}

for (const key in balances) {
  console.log(`The public key ${key}'s current balance: ${balances[key]}`);
}

const addresses = {
  [publicAddress1]: privateAdress1,
  [publicAddress2]: privateAdress2,
  [publicAddress3]: privateAdress3,
}

console.log("Private Keys")
console.log("===========")

for (const key in addresses) {
  console.log(`${addresses[key]}`);
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {

  const {sender, recipient, amount} = req.body;
  /*incorporate Digital Signatures to authenticate 
  the user has the private key to an address before 
  allowing them to make a transfer.
  */

  let senderAddress = senderToPrivateaddress[sender];
  if (not (balances.hasOwnProperty('senderAddress'))) {
    console.log("invalid sender");
  }
  
  if (balances[senderAddress] < amount) {
    console.log("not eough balance")
  }

  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
