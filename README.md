# DAAPer---CSC196D 
# Blockchain Certificate System DApp

Prerequisites and Dependencies

Node.js (v14 or above)
Ganache - for local Ethereum blockchain
MetaMask - for interacting with the blockchain in your browser
Truffle - development framework for Ethereum
npm - package manager

# Install Dependencies 

    npm Install
    npm install -g truffle
    npm install -g ganache-cli
    Install Metamask through chrome

# MetaMask Configuration
    Network Name: Localhost 8545
    Default RPC URL: http://127.0.0.1:8545
    Chain ID: 1337 (commonly used with Ganache)
    Currency Symbol: ETH


# How to Run DApp

    1. first start ganache on the command prompt: ganache-cli
    2. Then copy any of the private keys to the metamask extension on chrome
    3. open another terminal and run truffle compile, then truffle migrate --reset
    4. delete the contracts folder in src
    5. copy the contracts folder in the build folder and paste it in the src folder
    6. run npm start
    7. Test contracts Issuer, Verifier and Recipient Succefully 