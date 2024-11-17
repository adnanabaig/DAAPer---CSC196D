import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, FormHelperText, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const Recipient = () => {
    const [certificateId, setCertificateId] = useState('');
    const [sharedWith, setSharedWith] = useState('');
    const [errors, setErrors] = useState({ certificateId: false, sharedWith: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleView = () => {
        const newErrors = { certificateId: certificateId === '' };
        setErrors(newErrors);

        if (!newErrors.certificateId) {
            setSnackbar({ open: true, message: `Viewing Certificate ID: ${certificateId}`, severity: 'info' });
        } else {
            setSnackbar({ open: true, message: 'Please enter a Certificate ID.', severity: 'error' });
        }
    };

    const handleShare = () => {
        const newErrors = { sharedWith: sharedWith === '' };
        setErrors(newErrors);

        if (!newErrors.sharedWith) {
            setSnackbar({ open: true, message: `Certificate shared with: ${sharedWith}`, severity: 'success' });
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
