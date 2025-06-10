import React from 'react';
import { Alert, AlertTitle, Box, IconButton } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

export default function MaintenanceBanner({ title, variant = 'maintenance', subtitle }) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };
    const selectColor = (variant) => {
        switch (variant) {
            case 'info':
                // Blue background, dark blue text
                return {
                    bgcolor: '#bfdbfe',        // light blue background (like Tailwind's blue-200)
                    color: '#1e3a8a',          // deep blue text (like blue-900)
                    icon: <InfoIcon />
                };// Amber background, dark text
            case 'maintenance':
                return { bgcolor: '#fde68a', color: '#1f2937', icon: <ConstructionIcon /> }; // Green background, dark green text
            default:
                return { bgcolor: '#facc15ba', color: '#1f2937', icon: <ConstructionIcon /> }; // Default to Amber, dark text
        }
    }
    return (
        open && (
            <Box sx={{ my: 2 }}>
                <Alert
                    icon={selectColor(variant).icon}
                    variant="filled"
                    sx={{
                        bgcolor: selectColor(variant).bgcolor, // Amber background
                        color: selectColor(variant).color,      // Dark text
                        fontWeight: 'bold',
                        alignItems: 'flex-start',
                    }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <AlertTitle>{title || 'Page Under Maintenance'}</AlertTitle>
                    {subtitle || `We’re working on some improvements. You can still view some parts of the page, but certain features might be temporarily unavailable.`}
                </Alert>
            </Box>
        )
    );
}