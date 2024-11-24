import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Web3 from 'web3';

let contract_address = '0x09d79356E2Cb4522e6B3639A514A7b2F229ad2e6';
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


const Issuer = () => {
    const [certificateData, setCertificateData] = useState({ recipient: '', title: '' });
    const [errors, setErrors] = useState({ recipient: false, title: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData({ ...certificateData, [name]: value });
    };

    const handleSubmit = async () => {

        const newErrors = {
            recipient: certificateData.recipient === '',
            title: certificateData.title === '',
        };
        setErrors(newErrors);

        if (!newErrors.recipient && !newErrors.title) {
            setLoading(true);
            try{
             const recipient = certificateData.recipient ; 
             const account =  await web3.eth.getAccounts();
             await contract.methods.issueCert(certificateData.title, recipient).send({from: account[0]});  
             setLoading(false);
             setSnackbar({ open: true, message: 'Certificate Issued Successfully!', severity: 'success' });
            } catch (error){
                setSnackbar({ open: true, message: 'Failed to issue certificate', severity: 'success' });
                console.log(error)
            }
        } else {
            setSnackbar({ open: true, message: 'Please fill all fields correctly.', severity: 'error' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Grid container spacing={3} style={{ padding: '20px' }}>
                <Grid item xs={12}>
                    <Card
                        elevation={3}
                        style={{
                            borderRadius: '12px',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <CardContent>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                                Issue a Certificate
                            </Typography>
                            <TextField
                                label="Recipient Name"
                                name="recipient"
                                fullWidth
                                margin="normal"
                                value={certificateData.recipient}
                                onChange={handleChange}
                                error={errors.recipient}
                            />
                            {errors.recipient && <FormHelperText error>Recipient Name is required.</FormHelperText>}
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
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '10px',
                                }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Issue Certificate'}
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

export default Issuer;
