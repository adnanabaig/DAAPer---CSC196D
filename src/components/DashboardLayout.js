import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const DashboardLayout = ({ title, children }) => {
    return (
        <Box>
            <Container>
                <Typography variant="h4" gutterBottom>
                    {title}
                </Typography>
                <Box>{children}</Box>
            </Container>
        </Box>
    );
};

export default DashboardLayout;
