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
    const [certificateDetails, setCertificateDetails] = useState(null);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const certManagerAddress = '0x94B4b7feD72d030c89aF4A18F7848969b82Bf34D';
    const certManager = new web3.eth.Contract(CertManagerABI.abi, certManagerAddress);

    useEffect(() => {
      async function loadAccount() {
          try {
              const accounts = await web3.eth.getAccounts();
              if (accounts.length === 0) {
                  setSnackbar({ open: true, message: 'Please connect to MetaMask.', severity: 'warning' });
              } else {
                  setAccount(accounts[0]);
              }
          } catch (error) {
              console.error("Failed to load accounts from MetaMask", error);
              setSnackbar({ open: true, message: 'Failed to connect MetaMask. Please try again.', severity: 'error' });
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

      loadAccount();
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

            const { owner, recipient, revoked } = details;

            setSnackbar({ 
                open: true, 
                message: `Certificate Details:\nOwner: ${owner}\nRecipient: ${recipient}\nRevoked: ${revoked ? 'Yes' : 'No'}`, 
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
                <Grid item xs={12} md={6}>
                    <Card elevation={3} style={{ borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                                Share Certificate
                            </Typography>
                            <TextField
                                label="Share With (Email/Address)"
                                fullWidth
                                margin="normal"
                                value={sharedWith}
                                onChange={(e) => setSharedWith(e.target.value)}
                                error={errors.sharedWith}
                            />
                            {errors.sharedWith && <FormHelperText error>Recipient Address is required.</FormHelperText>}
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '10px',
                                }}
                                onClick={handleShare}
                            >
                                Share Certificate
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

export default Recipient;
