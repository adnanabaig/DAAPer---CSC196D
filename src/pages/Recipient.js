import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import Web3 from 'web3';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let contract_address = '0xD18729dA669c86bFB0801A90F2071419CC09b6C0';

let abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "certificates",
      "outputs": [
        {
          "internalType": "string",
          "name": "cert_id",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "revoked",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "doesExist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
        }
      ],
      "name": "issueCert",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "revokeCert",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "verifyCertificate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "getCertDetails",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]

  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  const contract = new web3.eth.Contract(abi, contract_address);

const Recipient = () => {
    const [certificateId, setCertificateId] = useState('');
    const [sharedWith, setSharedWith] = useState('');
    const [errors, setErrors] = useState({ certificateId: false, sharedWith: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleView = async () => {
        const newErrors = { certificateId: certificateId === '' };
        setErrors(newErrors);

        if (!newErrors.certificateId) {
            try{
                const details = await contract.methods.getCertDetails(certificateId).call();
                setSnackbar({ open: true, message: `Certificate Owner: ${details.owner}, Recipient: ${details.recipient}`, severity: 'info' });
            } catch (error) {
                console.error(error);
                setSnackbar({open: true, message: 'Failed to retrieve certificate details', severity: 'error'});
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
