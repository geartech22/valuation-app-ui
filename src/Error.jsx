import React, { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Card,
    CardContent,
    Stack,
    Link as MuiLink
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Button from './components/Button';
import Logo from "./assets/logo.png";
const version = __APP_VERSION__;

export default function ErrorPage() {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);

        setTimeout(() => {
            setIsRetrying(false);
            window.location.reload();
        }, 2000);
    };

    const handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
                p: 2
            }}
        >
            <Box maxWidth={400} width="100%">
                <Card sx={{ overflow: 'visible', borderTop: '4px solid #374151' }}>
                    <CardContent>
                        {/* Logo */}
                        <Box
                            component="img"
                            src={Logo}
                            alt="Logo"
                            sx={{
                                width: 180,
                                height: 'auto',
                                display: 'block',
                                mx: 'auto',
                            }}
                        />

                        {/* Error Icon */}
                        <Box textAlign="center" mt={1} mb={2}>
                            <Box
                                mx="auto"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="50%"
                                width={64}
                                height={64}
                                sx={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca' }}
                            >
                                <WarningAmberIcon color="error" fontSize="large" />
                            </Box>
                        </Box>

                        {/* Error Message */}
                        <Typography variant="h5" fontWeight="bold" color="text.primary" textAlign="center" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
                            We're experiencing technical difficulties. Our team has been notified and is working to resolve this issue.
                        </Typography>

                        {/* Error Details */}
                        <Box
                            sx={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: 2,
                                p: 2,
                                mb: 3
                            }}
                        >
                            <Typography variant="body2" color="primary">
                                <strong>Error Code:</strong> 500 - Internal Server Error
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Time: {new Date().toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Buttons */}
                        <Stack spacing={1.5} mb={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<ReplayIcon className={isRetrying ? 'spin' : ''} />}
                                disabled={isRetrying}
                                onClick={handleRetry}
                            >
                                {isRetrying ? 'Retrying...' : 'Try Again'}
                            </Button>

                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="contained"
                                    color='secondary'
                                    startIcon={<ArrowBackIcon />}
                                    fullWidth
                                    onClick={handleGoBack}
                                >
                                    Go Back
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "rgb(46, 125, 50)", '&:hover': { backgroundColor: "rgb(30, 90, 35)" } }}
                                    startIcon={<HomeIcon />}
                                    fullWidth
                                    onClick={handleGoHome}
                                >
                                    Dashboard
                                </Button>
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* Support */}
                        <Typography variant="body2" color="text.secondary" textAlign="center" mb={1}>
                            Need immediate assistance?
                        </Typography>
                        <Stack direction="row" justifyContent="center" spacing={2} mb={2}>
                            <MuiLink
                                href="mailto:support@paramountvaluations.com"
                                underline="hover"
                                color="text.primary"
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                            >
                                <MailOutlineIcon fontSize="small" />
                                Email Support
                            </MuiLink>
                            <Divider orientation="vertical" flexItem />
                            <MuiLink
                                href="tel:+1234567890"
                                underline="hover"
                                color="text.primary"
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                            >
                                <PhoneIcon fontSize="small" />
                                Call Support
                            </MuiLink>
                        </Stack>

                        <Typography variant="caption" display="block" textAlign="center" color="text.disabled">
                            Version {version}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Suggestions */}
                <Box
                    mt={2}
                    p={2}
                    borderRadius={2}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Error persisting? Try these steps:
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={2} mt={1}>
                        <Typography variant="caption" color="text.secondary">
                            • Clear browser cache
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            • Check internet connection
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            • Contact IT support
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}