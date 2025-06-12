import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    AlertTitle,
    Box,
    IconButton,
    Stack,
    LinearProgress
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ConstructionIcon from '@mui/icons-material/Construction';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

const bannerVariants = {
    info: {
        bgcolor: '#bfdbfe',
        color: '#1e3a8a',
        icon: <InfoIcon />
    },
    maintenance: {
        bgcolor: '#fde68a',
        color: '#78350f',
        icon: <ConstructionIcon />
    },
    success: {
        bgcolor: '#bbf7d0',
        color: '#065f46',
        icon: <CheckCircleIcon />
    },
    notification: {
        bgcolor: '#e9d5ff',
        color: '#6b21a8',
        icon: <NotificationsIcon />
    }
};

export default function MaintenanceBanner({ bannerArray = [] }) {
    const [open, setOpen] = useState(true);
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef();
    const timeoutRef = useRef();

    const banner = bannerArray[current];
    const { variant = 'info', title, subtitle, duration = 8000, rotate = true } = banner || {};
    const content = bannerVariants[variant] || bannerVariants.info;

    const clearTimers = () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
    };

    const startProgress = () => {
        clearTimers();
        setProgress(0);

        if (rotate && bannerArray.length > 1) {
            let elapsed = 0;
            const step = 100; // ms
            const total = duration;

            intervalRef.current = setInterval(() => {
                elapsed += step;
                setProgress((elapsed / total) * 100);
            }, step);

            timeoutRef.current = setTimeout(() => {
                clearTimers();
                setCurrent((prev) => (prev + 1) % bannerArray.length);
            }, total);
        }
    };

    useEffect(() => {
        if (open) startProgress();
        return clearTimers;
    }, [current, open]);

    const handleDotClick = (index) => {
        if (index === current) return;
        clearTimers();
        setCurrent(index);
    };

    const handleClose = () => {
        clearTimers();
        setOpen(false);
    };

    if (!open || !banner) return null;

    return (
        <Box sx={{ my: 2 }}>
            <Box
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: content.bgcolor,
                    color: content.color,
                    px: 1,
                    py: 1
                }}
            >
                <Alert
                    icon={content.icon}
                    severity="info"
                    sx={{
                        bgcolor: 'transparent',
                        color: content.color,
                        fontWeight: 500,
                        pr: 6,
                        fill: content.color,
                        '& .MuiAlert-icon': {
                            color: content.color,
                            marginRight: 1
                        }
                    }}
                    action={
                        <IconButton
                            onClick={handleClose}
                            size="small"
                            sx={{ color: content.color, position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <AlertTitle sx={{ mb: 0.5 }}>{title}</AlertTitle>
                    {subtitle}
                </Alert>

                {/* Actual MUI LinearProgress */}
                {rotate && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: content.color
                            }
                        }}
                    />
                )}
            </Box>

            {bannerArray.length > 1 && (
                <Stack direction="row" justifyContent="center" mt={1.5} spacing={1}>
                    {bannerArray.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => handleDotClick(i)}
                            sx={{
                                width: i === current ? 24 : 8,
                                height: 8,
                                borderRadius: 5,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                bgcolor: i === current ? '#374151' : '#d1d5db',
                                '&:hover': { bgcolor: '#9ca3af' }
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
}