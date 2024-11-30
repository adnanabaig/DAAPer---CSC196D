import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import web3 from '../web3';
import CertManagerABI from '../contracts/CertManager.json';

const Issuer = () => {
    const [certificateData, setCertificateData] = useState({ id: '', recipient: '', title: '' });
    const [errors, setErrors] = useState({ id: false, recipient: false, title: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState('');
    const [certManager, setCertManager] = useState(null);

    useEffect(() => {
        async function loadBlockchainData() {
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length === 0) {
                    setSnackbar({ open: true, message: 'Please connect to MetaMask.', severity: 'warning' });
                } else {
                    setAccount(accounts[0]);
                }

                const networkId = await web3.eth.net.getId();
                if (CertManagerABI.networks[networkId]) {
                    const certManagerAddress = CertManagerABI.networks[networkId].address;
                    const contract = new web3.eth.Contract(CertManagerABI.abi, certManagerAddress);
                    setCertManager(contract);
                } else {
                    console.error('Contract not deployed on this network.');
                    setSnackbar({ open: true, message: 'Contract not deployed on the current network.', severity: 'error' });
                }
            } catch (error) {
                console.error("Failed to load blockchain data", error);
                setSnackbar({ open: true, message: 'Failed to connect MetaMask or load contract. Please try again.', severity: 'error' });
            }
        }

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                    setSnackbar({ open: true, message: 'Please connect to MetaMask.', severity: 'warning' });
                }
            });
        }

        loadBlockchainData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData({ ...certificateData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!certManager) {
            setSnackbar({ open: true, message: 'Contract is not yet loaded. Please wait.', severity: 'error' });
            return;
        }

        const newErrors = {
            id: certificateData.id === '',
            recipient: !web3.utils.isAddress(certificateData.recipient), // Validate address
            title: certificateData.title === '',
        };
        setErrors(newErrors);

        if (!newErrors.id && !newErrors.recipient && !newErrors.title) {
            setLoading(true);
            try {
                await certManager.methods.issueCert(certificateData.id, certificateData.recipient, certificateData.title)
                    .send({ from: account, gas: 3000000 }) // Adding a gas limit here
                    .on('transactionHash', (hash) => {
                        console.log('Transaction Hash:', hash);
                        setSnackbar({ open: true, message: 'Transaction sent, waiting for confirmation...', severity: 'info' });
                    })
                    .on('receipt', (receipt) => {
                        setLoading(false);
                        setSnackbar({ open: true, message: 'Certificate Issued Successfully!', severity: 'success' });
                        console.log('Transaction Receipt:', receipt);
                    })
                    .on('error', (error) => {
                        setLoading(false);
                        console.error("Error during transaction:", error);
                        setSnackbar({ open: true, message: 'Failed to issue certificate. Check console for details.', severity: 'error' });
                    });
            } catch (error) {
                setLoading(false);
                console.error("Error issuing certificate:", error);
                setSnackbar({ open: true, message: 'Failed to issue certificate. Check console for details.', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please fill all fields correctly.', severity: 'error' });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Grid container spacing={3} style={{ padding: '20px' }}>
                <Grid item xs={12}>
                    <Card elevation={3} style={{ borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                                Issue a Certificate
                            </Typography>
                            <TextField
                                label="Certificate ID"
                                name="id"
                                fullWidth
                                margin="normal"
                                value={certificateData.id}
                                onChange={handleChange}
                                error={errors.id}
                            />
                            {errors.id && <FormHelperText error>Certificate ID is required.</FormHelperText>}
                            <TextField
                                label="Recipient Address"
                                name="recipient"
                                fullWidth
                                margin="normal"
                                value={certificateData.recipient}
                                onChange={handleChange}
                                error={errors.recipient}
                            />
                            {errors.recipient && <FormHelperText error>Valid Recipient Address is required.</FormHelperText>}
                            <TextField
                                label="Certificate Title"
                                name="title"
                                fullWidth
                                margin="normal"
                                value={certificateData.title}
                                onChange={handleChange}
                                error={errors.title}
                            />
                            {errors.title && <FormHelperText error>Certificate Title is required.</FormHelperText>}
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '20px', width: '100%', borderRadius: '8px', padding: '10px' }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Issue Certificate'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};

export default Issuer;
