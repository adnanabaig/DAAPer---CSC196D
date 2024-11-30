import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import web3 from '../web3';
import CertManagerABI from '../contracts/CertManager.json';

const Dashboard = () => {
    const [stats, setStats] = useState({
        issued: 0,
        verified: 0,
        shared: 0,
    });
    const [certManager, setCertManager] = useState(null);
    const [account, setAccount] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'info'});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function loadBlockchainData() {
            try {
                const accounts = await web3.eth.getAccounts();
                if(accounts.length === 0) {
                    setSnackbar({open: true, message: 'Please connect to MetaMask.', severity: 'warning'});
                } else {
                    setAccount(accounts[0]);
                }

                const networkId = await web3.eth.net.getId();
                if(CertManagerABI.networks[networkId]) {
                    const certManagerAddress = CertManagerABI.networks[networkId].address;
                    const contract = new web3.eth.Contract(CertManagerABI.abi, certManagerAddress);
                    setCertManager(contract);
                } else {
                    console.error('Contract not deployed on this network.');
                    setSnackbar({open: true, message: 'Contract not deployed on the current network.', severity: 'error' });
                }
            } catch (error) {
                console.error("Failed to load blockchain data", error);
                setSnackbar({open: true, message: 'Failed to connect MetaMask or load contract. Please try again.', severity: 'error'});
            }
        }

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                    setSnackbar({open: true, message: 'Please connect to MetaMask.', severity: 'warning'});
                }
            });
        }

        loadBlockchainData();
    }, []);
    
    useEffect(() => {
        if (certManager) {
            const fetchStats = async () => {
                try {
                    setLoading(true);
                    let issued = await certManager.methods.countIssued().call();
                    let verified = await certManager.methods.countVerified().call();
                    let shared = await certManager.methods.countShares().call();
        
                    setStats({
                        issued,
                        verified,
                        shared,
                    });
                } catch (error) {
                    console.error("Error fetching stats:", error);
                    setSnackbar({ open: true, message: 'Error fetching statistics from the blockchain.', severity: 'error' });
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [certManager]);
    

    const statsVariants = {
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' },
    };

    return (
        <Grid container spacing={3}>
            {[
                {label: 'Certificates Issued', value: stats.issued},
                {label: 'Certificates Verified', value: stats.verified},
            ].map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <Tooltip title={`Details about ${stat.label}`} arrow>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                transition: 'transform 0.2s ease',
                            }}
                            component={motion.div}
                            whileHover={statsVariants.hover}
                        >
                            <CardContent>
                                <Typography variant="h6">{stat.label}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Tooltip>
                </Grid>
            ))}
        </Grid>
    );
};

export default Dashboard;
