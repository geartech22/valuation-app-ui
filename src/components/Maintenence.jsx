import React from 'react';
import { Alert, AlertTitle, Box, IconButton } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import CloseIcon from '@mui/icons-material/Close';

export default function MaintenanceBanner() {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        open && (
            <Box sx={{ my: 2 }}>
                <Alert
                    icon={<ConstructionIcon fontSize="inherit" />}
                    severity="info"
                    variant="filled"
                    sx={{
                        bgcolor: '#facc15ba', // Amber background
                        color: '#1f2937',      // Dark text
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
                    <AlertTitle>Page Under Maintenance</AlertTitle>
                    We’re working on some improvements. You can still view some parts of the page, but certain features might be temporarily unavailable.
                </Alert>
            </Box>
        )
    );
}