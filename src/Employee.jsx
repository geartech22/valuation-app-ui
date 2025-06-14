import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Avatar,
    Grid,
    Box,
    Paper,
} from '@mui/material';
import Navigation from './components/Navigation'; // Adjust path as needed
import Button from './components/Button';// Adjust if you use a different icon
import MaintenanceBanner from './components/Banners';
import { Typography } from './components/Typography';
import Header from './Header';
import useValuationsStore from './store/useValuationStore';// Adjust path as needed
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const makeStyles = (styles) => () => styles;
const useStyles = makeStyles({

    mainContainer: {
        minHeight: '100vh',

    },
    paper: {
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: '15px 32px 32px 32px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    tabs: {
        display: 'flex',
        gap: '16px'
    },
});
// const employees = [
//     {
//         name: 'Anil Kumar',
//         title: 'Valuation Contractor',
//         dob: 'Jun 5, 1978',
//         id: 'VK1001',
//         department: 'Valuations',
//         photo: '/images/anil.jpg',
//     },
//     {
//         name: 'Meera Nair',
//         title: 'Site Investigator',
//         dob: 'Mar 20, 1985',
//         id: 'VK1002',
//         department: 'Valuations',
//         photo: '/images/meera.jpg',
//     },
//     {
//         name: 'Deepa Menon',
//         title: 'Billing Specialist',
//         dob: 'Dec 15, 1989',
//         id: 'VK1005',
//         department: 'Bills',
//         photo: '/images/deepa.jpg',
//     },
//     {
//         name: 'Rahul Verma',
//         title: 'HR Manager',
//         dob: 'May 11, 1980',
//         id: 'VK1007',
//         department: 'Human Resources',
//         photo: '/images/rahul.jpg',
//     },
// ];

const EmployeeCard = ({ employee }) => (
    <Card sx={{
        width: 300,
        height: 350,
        mx: 'auto',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        backgroundColor: 'white',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
        }
    }}>
        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #e5e7eb',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px'
                }}
            >
                <Avatar
                    variant='circular'
                    alt={employee.name}
                    src={employee.profile_image}
                    sx={{
                        width: 100,
                        height: 100,
                        mb: 2,
                        backgroundColor: '#6b7280',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 600
                    }}
                >
                </Avatar>
                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 1,
                        color: '#111827'
                    }}
                >
                    {employee.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontWeight: 500
                    }}
                >
                    {employee.role}
                </Typography>
            </Box>

            <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 0.5,
                            display: 'block'
                        }}
                    >
                        Date of Birth
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{ fontSize: '0.9rem', color: '#111827' }}
                    >
                        {employee.dob}
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 0.5,
                            display: 'block'
                        }}
                    >
                        Employee ID
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{ fontSize: '0.9rem', color: '#111827' }}
                    >
                        {employee.id}
                    </Typography>
                </Box>


            </Box>
        </CardContent>
    </Card>
);

const EmployeeGrid = () => {
    const classes = useStyles();
    const { people, fetchPeople } = useValuationsStore();
    const [isLoading, setIsLoading] = useState(false);
    const fetchAndSettlePeople = async () => {
        await fetchPeople();
        setIsLoading(false);
    }
    useEffect(() => {

        if (people.length === 0) {
            setIsLoading(true);
            fetchAndSettlePeople();
        }
    }, []);

    console.log(people)
    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>
                <Box style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation selectedItem='Employees' />
                        <Box style={classes.content}>
                            <Header name="Employees" />
                            <MaintenanceBanner
                                bannerArray={[
                                    {
                                        variant: 'maintenance',
                                        title: 'Maintenance Mode',
                                        subtitle: 'This page is still under development. The data shown here is for demonstration purposes only.',
                                        rotate: true,
                                        duration: 10000
                                    }
                                ]}
                            />

                            <Box style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                // onClick={handleNewBill}
                                >
                                    Add New Employee +
                                </Button>
                            </Box>
                            <Grid container spacing={3} justifyContent="flex-start">
                            {people?.map((emp, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                        <EmployeeCard employee={emp} />
                                    </Grid>
                                ))}
                            </Grid>
                    </Box>
                </Box>
            </Paper>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default EmployeeGrid;