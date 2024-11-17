import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                padding: '20px',
                background: '#1976d2',
                color: '#fff',
                marginTop: '20px',
            }}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} Blockchain Certificate System. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
