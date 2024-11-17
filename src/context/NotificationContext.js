import React, { createContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const showNotification = (message, severity = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const closeNotification = () => {
        setNotification({ open: false, message: '', severity: 'info' });
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={closeNotification}
            >
                <Alert onClose={closeNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
