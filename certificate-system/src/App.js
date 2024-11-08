import React, { useEffect, useState } from 'react';
import Web3 from './web3';
import SimpleStorage from './contracts/SimpleStorage.json';

function App() {
  const [data, setData] = useState(null);
  const [input, setInput] = useState('');
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = Web3;
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(instance);

      const storedData = await instance.methods.data().call();
      setData(storedData);
    };
    loadBlockchainData();
  }, []);

  const updateData = async () => {
    await contract.methods.setData(input).send({ from: accounts[0] });
    const storedData = await contract.methods.data().call();
    setData(storedData);
  };

  return (
    <div>
      <h1>Simple Storage DApp</h1>
      <p>Stored Data: {data}</p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={updateData}>Set Data</button>
    </div>
  );
}

export default App;
