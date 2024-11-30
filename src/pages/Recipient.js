import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import web3 from '../web3';
import CertManagerABI from '../contracts/CertManager.json';
const Recipient = () => {
    const [certificateId, setCertificateId] = useState('');
    const [sharedWith, setSharedWith] = useState('');
    const [errors, setErrors] = useState({ certificateId: false, sharedWith: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [account, setAccount] = useState('');
    const [certManager, setCertManager] = useState(null);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
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
    setCertificateId({ ...certificateId, [name]: value });
};
  const handleView = async () => {
    const newErrors = { id: certificateId === '' };
    setErrors(newErrors);

    if (!newErrors.id) {
        try {
            const details = await certManager.methods.getCertDetails(certificateId).call({ from: account });

            const { owner, recipient, revoked, title } = details;

            setSnackbar({ 
                open: true, 
                message: `Certificate Details:\nOwner: ${owner}\nRecipient: ${recipient}\nTitle: ${title}\nRevoked: ${revoked ? 'Yes' : 'No' }`, 
                severity: 'info' 
            });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to retrieve certificate details', severity: 'error' });
        }
    } else {
        setSnackbar({ open: true, message: 'Please enter a Certificate ID.', severity: 'error' });
    }
};



    const handleShare = () => {
        const isAddressValid = web3.utils.isAddress(sharedWith);
        const isEmailValid = emailRegex.test(sharedWith);
        const newErrors = { sharedWith: sharedWith === '' || (!isAddressValid && !isEmailValid)};
        setErrors(newErrors);

        if (!newErrors.sharedWith) {
            try{
                setSnackbar({ open: true, message: `Certificate shared with: ${sharedWith}`, severity: 'success' });
            } catch (error) {
                console.error(error);
                setSnackbar({open: true, message: 'Failed to share certificate.', severity: 'error'});
            }
        } else {
            setSnackbar({ open: true, message: 'Please enter a recipient address.', severity: 'error' });
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
                                View Certificate
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
                                onClick={handleView}
                            >
                                View Certificate
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};

export default Recipient;
