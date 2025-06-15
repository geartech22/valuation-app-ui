import React from 'react';
import {
    Avatar,
    Box,
    Chip,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Tooltip
} from '@mui/material';
import {
    MailOutline,
    Phone,
    LocationOn,
    CalendarToday,
    AccessTime,
    Visibility,
    ChevronRight,
    Person
} from '@mui/icons-material';
import Button from './Button';

const EmployeeCard = ({ people}) => {


    return (

        <Card
            elevation={3}
            sx={{
                width: 350,
                borderRadius: 4,
                border: '1px solid #f3f4f6',
                overflow: 'visible',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
            }}
        >
            {/* Active status */}
            <Chip
                label="Active"
                size="small"
                color="success"
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    fontWeight: 600,
                }}
            />

            <CardContent sx={{ textAlign: 'center', pt: 2, pb: 2, px: 2}}>
                {/* Avatar with gradient ring */}
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Box
                        sx={{
                            width: 128,
                            height: 128,
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #1f3d5a, #a855f7)',
                            p: 0.7,
                            mx: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: '#e5e7eb',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            {people?.profile_image ? (
                                <Avatar
                                    src={people?.profile_image}
                                    alt={people?.name}
                                    sx={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Person sx={{ fontSize: 64, color: '#9ca3af' }} />
                            )}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 8,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'green',
                            border: '3px solid white',
                            boxShadow: 1,
                        }}
                    />
                </Box>

                {/* Name, Role, Department */}
                <Typography variant="h5" fontWeight="bold">
                    {people?.name}
                </Typography>
                <Typography variant="subtitle1" color="#1f3d5a" fontWeight="medium" >
                    {people?.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    {people?.department}
                </Typography>

                {/* Birth Date and Experience */}
                <Grid container spacing={4} justifyContent="center" mb={2}>
                    <Grid item xs={6} textAlign="center">
                        <Stack spacing={0.5} alignItems="center">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarToday fontSize="small" sx={{ color: 'text.disabled' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Birth Date
                                </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight="medium">
                                {people?.dob}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} textAlign="center">
                        <Stack spacing={0.5} alignItems="center">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTime fontSize="small" sx={{ color: 'text.disabled' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Experience
                                </Typography>
                            </Stack>
                            {/* <Typography variant="body2" fontWeight="medium">
                                5+ years
                            </Typography> */}
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
{console.log("people",people)}
                {/* Contact Info */}
                <Stack spacing={1.5} mb={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <MailOutline fontSize="small" sx={{ color: 'text.disabled' }} />
                        <Typography variant="body2" color="text.secondary">
                            {people?.email}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Phone fontSize="small" sx={{ color: 'text.disabled' }} />
                        <Typography variant="body2" color="text.secondary">
                            {people?.phone}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="left">
                        <LocationOn fontSize="small" sx={{ color: 'text.disabled' }} />
                        <Typography textAlign="left" variant="body2" color="text.secondary">
                            {people?.address}
                        </Typography>
                    </Stack>
                </Stack>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 3,
                        color: 'white',
                    }}
                    startIcon={<Visibility />}
                >
                    View Profile
                </Button>
            </CardContent>
        </Card>
    );
};

export default EmployeeCard;