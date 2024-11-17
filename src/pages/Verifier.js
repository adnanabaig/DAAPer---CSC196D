import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const Verifier = () => {
    const [certificateId, setCertificateId] = useState('');
    const [errors, setErrors] = useState({ certificateId: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleVerify = () => {
        const newErrors = { certificateId: certificateId === '' };
        setErrors(newErrors);

        if (!newErrors.certificateId) {
            setSnackbar({ open: true, message: `Verifying Certificate ID: ${certificateId}`, severity: 'info' });
        } else {
            setSnackbar({ open: true, message: 'Please enter a Certificate ID.', severity: 'error' });
        }
    };

    const handleHistory = () => {
        setSnackbar({ open: true, message: 'Fetching Verification History...', severity: 'info' });
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
                <Grid item xs={12} md={6}>
                    <Card elevation={3} style={{ borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                                Verification History
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '10px',
                                }}
                                onClick={handleHistory}
                            >
                                View History
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
