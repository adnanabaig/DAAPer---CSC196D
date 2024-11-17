import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleIcon from '@mui/icons-material/People';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './pages/Dashboard';
import Issuer from './pages/Issuer';
import Recipient from './pages/Recipient';
import Verifier from './pages/Verifier';
import Web3 from './web3';
import './styles.css';

const drawerWidth = 240;

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width:600px)');

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
        },
        typography: {
            fontFamily: 'Poppins, Arial, sans-serif',
            h4: { fontWeight: 700 },
            body1: { fontSize: '1rem' },
        },
    });

    const pageVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = Web3;
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error connecting to blockchain:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBlockchainData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex' }}>
                    {/* Header */}
                    <AppBar
                        position="fixed"
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            backgroundColor: theme.palette.primary.main,
                        }}
                    >
                        <Toolbar>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                Blockchain Certificate System
                            </Typography>
                            <Typography variant="body1" sx={{ marginRight: 2 }}>
                                {account || 'Not Connected'}
                            </Typography>
                            <Tooltip title="Toggle Light/Dark Mode">
                                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>

                    {/* Sidebar Navigation */}
                    <Drawer
                        variant={isMobile ? 'temporary' : 'permanent'}
                        open={!isMobile || drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        sx={{
                            width: isMobile ? '80%' : drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: isMobile ? '80%' : drawerWidth,
                            },
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ overflow: 'auto' }}>
                            <List>
                                <Tooltip title="Navigate to Dashboard" arrow>
                                    <ListItem button component={Link} to="/">
                                        <DashboardIcon sx={{ marginRight: '10px' }} />
                                        <ListItemText primary="Dashboard" />
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Navigate to Issuer Page" arrow>
                                    <ListItem button component={Link} to="/issuer">
                                        <AssignmentIndIcon sx={{ marginRight: '10px' }} />
                                        <ListItemText primary="Issuer" />
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Navigate to Recipient Page" arrow>
                                    <ListItem button component={Link} to="/recipient">
                                        <PeopleIcon sx={{ marginRight: '10px' }} />
                                        <ListItemText primary="Recipient" />
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Navigate to Verifier Page" arrow>
                                    <ListItem button component={Link} to="/verifier">
                                        <VerifiedUserIcon sx={{ marginRight: '10px' }} />
                                        <ListItemText primary="Verifier" />
                                    </ListItem>
                                </Tooltip>
                            </List>
                        </Box>
                    </Drawer>

                    {/* Main Content */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            marginTop: '64px',
                            backgroundColor: theme.palette.background.default,
                            minHeight: '100vh',
                        }}
                    >
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <motion.div
                                                variants={pageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.5 }}
                                            >
                                                <HeroSection />
                                                <Dashboard />
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        path="/issuer"
                                        element={
                                            <motion.div
                                                variants={pageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Issuer />
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        path="/recipient"
                                        element={
                                            <motion.div
                                                variants={pageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Recipient />
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        path="/verifier"
                                        element={
                                            <motion.div
                                                variants={pageVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Verifier />
                                            </motion.div>
                                        }
                                    />
                                </Routes>
                            </AnimatePresence>
                        )}
                    </Box>
                </Box>
                <Footer />
            </Router>
        </ThemeProvider>
    );
};

export default App;
