import React from 'react';
import { Grid, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const statsVariants = {
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' },
    };

    const stats = [
        { label: 'Certificates Issued', value: '120' },
        { label: 'Certificates Verified', value: '95' },
        { label: 'Certificates Shared', value: '80' },
    ];

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
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
