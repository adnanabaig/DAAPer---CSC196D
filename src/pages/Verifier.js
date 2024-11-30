import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import Web3 from 'web3';
import CertManagerArtifact from '../contracts/CertManager.json'; // Import the artifact JSON file

const Verifier = () => {
    const [certificateId, setCertificateId] = useState('');
    const [errors, setErrors] = useState({ certificateId: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [web3, setWeb3] = useState(null);
    const [certManager, setCertManager] = useState(null);
    const [account, setAccount] = useState('');

    useEffect(() => {
        async function loadBlockchainData() {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);

                const networkId = await web3Instance.eth.net.getId();
                const deployedNetwork = CertManagerArtifact.networks[networkId];

                if (deployedNetwork) {
                    const contract = new web3Instance.eth.Contract(
                        CertManagerArtifact.abi,
                        deployedNetwork.address // Fetch the address based on the network ID
                    );
                    setCertManager(contract);
                } else {
                    window.alert('Smart contract not deployed to detected network.');
                }
            } else {
                window.alert('Please install MetaMask to use this feature.');
            }
        }

        loadBlockchainData();
    }, []);

    const handleVerify = async () => {
        if (!certManager) {
            setSnackbar({ open: true, message: 'Contract is not yet loaded. Please wait.', severity: 'error' });
            return;
        }

        const newErrors = { certificateId: certificateId === '' };
        setErrors(newErrors);

        if (!newErrors.certificateId) {
            try {
                console.log("Attempting to verify certificate with ID:", certificateId);

                // Change to .send() to ensure blockchain state changes
                await certManager.methods.verifyCertificate(certificateId)
                    .send({ from: account, gas: 300000 }) // Adding a gas limit for send
                    .on('transactionHash', (hash) => {
                        console.log('Verification transaction hash:', hash);
                        setSnackbar({ open: true, message: 'Verification transaction sent, waiting for confirmation...', severity: 'info' });
                    })
                    .on('receipt', (receipt) => {
                        setSnackbar({ open: true, message: `Certificate ${certificateId} verified successfully!`, severity: 'success' });
                        console.log('Verification receipt:', receipt);
                    })
                    .on('error', (error) => {
                        console.error("Error during verification:", error);
                        setSnackbar({ open: true, message: 'Error verifying certificate. Please check the console.', severity: 'error' });
                    });
            } catch (error) {
                console.error("Error during verification:", error);
                setSnackbar({ open: true, message: 'Error verifying certificate.', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please enter a Certificate ID.', severity: 'error' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Grid container spacing={3} style={{ padding: '20px' }}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3} style={{ borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                                Verify Certificate
                            </Typography>
                            <TextField
                                label="Certificate ID"
                                fullWidth
                                margin="normal"
                                value={certificateId}
                                onChange={(e) => setCertificateId(e.target.value)}
                                error={errors.certificateId}
                            />
                            {errors.certificateId && <FormHelperText error>Certificate ID is required.</FormHelperText>}
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '10px',
                                }}
                                onClick={handleVerify}
                            >
                                Verify Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};

export default Verifier;
