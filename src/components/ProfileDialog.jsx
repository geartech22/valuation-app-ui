import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Typography,
    Divider,
    Tabs,
    Tab,
    Button,
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    CalendarToday,
    Close,
} from '@mui/icons-material';

const ProfileDialog = ({ open, setOpen }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Dialog open={open} onClose={()=>{setOpen(false)}} fullWidth maxWidth="sm">
            {/* Dialog Title with close button */}
            <DialogTitle
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                Profile Details
                <IconButton onClick={()=>{setOpen(false)}} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            {/* Tabs */}
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ px: 3 }}
            >
                <Tab label="Overview" />
                <Tab label="Projects" />
                <Tab label="Performance" />
            </Tabs>

            <DialogContent dividers sx={{ backgroundColor: '#fff', px: 3 }}>
                {tabIndex === 0 && (
                    <>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ width: 60, height: 60, mr: 2 }} />
                            <Box>
                                <Typography variant="h6">Sreepriya MS</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Valuator
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Personal Info */}
                        <Typography variant="h6" gutterBottom>Personal Information</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12} display="flex" alignItems="center">
                                <CalendarToday sx={{ fontSize: 18, mr: 1 }} />
                                <Typography>Date of Birth: March 15, 1992</Typography>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="center">
                                <Email sx={{ fontSize: 18, mr: 1 }} />
                                <Typography>sreepriya.ms@paramount.com</Typography>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="center">
                                <Phone sx={{ fontSize: 18, mr: 1 }} />
                                <Typography>+91 98765 43210</Typography>
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="center">
                                <LocationOn sx={{ fontSize: 18, mr: 1 }} />
                                <Typography>123 Tech Park, Kochi, Kerala</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Employment Details */}
                        <Typography variant="h6" gutterBottom>Employment Details</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography><strong>Employee ID:</strong> 61e35f67–2821–4fc5–9d58–f24b98affbcb</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><strong>Department:</strong> Valuation Services</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><strong>Join Date:</strong> January 15, 2020</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><strong>Salary:</strong> ₹8,50,000</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><strong>Manager:</strong> Abhilash</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Skills */}
                        <Typography variant="h6" gutterBottom>Skills</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="Property Valuation" color="primary" variant="outlined" />
                            <Chip label="Market Analysis" color="primary" variant="outlined" />
                            <Chip label="Risk Assessment" color="primary" variant="outlined" />
                        </Box>
                    </>
                )}

                {tabIndex === 1 && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Projects section will be implemented here.
                    </Typography>
                )}

                {tabIndex === 2 && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Performance metrics will be displayed here.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={()=>{setOpen(false)}} color="primary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileDialog;