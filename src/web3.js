import Web3 from 'web3';

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error("User denied account access");
  }
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.warn(
    "Non-Ethereum browser detected. You should consider trying MetaMask!"
  );
}

export default web3;
