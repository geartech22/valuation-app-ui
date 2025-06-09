import { Alert, AlertTitle, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function MaintenanceBanner() {
    return (
        <Box sx={{ my: 2 }}>
            <Alert
                icon={<ConstructionIcon fontSize="inherit" />}
                severity="info"
                variant="filled"
                sx={{
                    bgcolor: '#facc15ba', // Amber
                    color: '#1f2937',   // Dark text
                    fontWeight: 'bold',
                }}
            >
                <AlertTitle>Page Under Maintenance</AlertTitle>
                We’re working on some improvements. You can still view some parts of the page, but certain features might be temporarily unavailable.
            </Alert>
        </Box>
    );
}