const server = require('../server');
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

async function signKey(privateKey) {
  const hash = keccak256(utf8ToBytes(""));
  const signature = secp.secp256k1.sign(hash, privateKey, { recovered: true });
  return signature;
}

async function recoverKey(signature, hash) {
  const publicKey = secp.secp256k1.recover(signature, hash, { recovered: true });
  return publicKey;
}