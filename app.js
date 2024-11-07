// Connect to MetaMask
if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask is available!");
    var web3 = new Web3(window.ethereum);

    // Request access to MetaMask account
    window.ethereum.enable().catch((error) => {
        console.error("User denied account access");
    });
} else {
    alert("MetaMask is required to use this application!");
}

// Contract details (replace with your contract address and ABI)
const contractAddress = 'YOUR_CONTRACT_ADDRESS';  // Replace with your deployed contract address
const contractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "certificateID",
                "type": "string"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
    // Include other ABI functions if necessary
];

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Verify certificate function
async function verifyCertificate() {
    const certificateID = document.getElementById('certificateID').value;
    if (!certificateID) {
        alert("Please enter a certificate ID!");
        return;
    }

    // Call smart contract function
    try {
        const result = await contract.methods.verifyCertificate(certificateID).call();
        const message = result ? 'Certificate is verified!' : 'Certificate is not verified.';
        document.getElementById('verificationResult').innerText = message;
    } catch (error) {
        console.error(error);
        document.getElementById('verificationResult').innerText = 'Error verifying certificate.';
    }
}
