import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const headingVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1 },
    };

    return (
        <Box
            sx={{
                textAlign: 'center',
                padding: '50px 20px',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                color: '#fff',
                borderRadius: '12px',
                marginBottom: '20px',
            }}
        >
            <motion.div
                variants={headingVariants}
                initial="initial"
                animate="animate"
            >
                <Typography variant="h3" sx={{ fontFamily: 'Poppins', fontWeight: '700' }}>
                    Welcome to Blockchain Certificate System
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Roboto', marginTop: '10px' }}>
                    Manage certificates with security and trust.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontFamily: 'Poppins',
                        fontWeight: '600',
                        borderRadius: '8px',
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                >
                    Get Started
                </Button>
            </motion.div>
        </Box>
    );
};

export default HeroSection;
