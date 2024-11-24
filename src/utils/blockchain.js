import Web3 from 'web3';
import CertificateSystem from './CertificateSystem.json';

const getBlockchain = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = CertificateSystem.networks[networkId];
    const contract = new web3.eth.Contract(
        CertificateSystem.abi,
        deployedNetwork && deployedNetwork.address
    );
    return { web3, contract };
};

export default getBlockchain;
