import React, { useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import Navigation from './components/Navigation';
import Button from './components/Button';
import MaintenanceBanner from './components/Banners';
import Header from './Header';
import useValuationsStore from './store/useValuationStore';
import EmployeeCard from './components/EmployeeCard';

const EmployeeGrid = () => {
    const { people, fetchPeople } = useValuationsStore();
    const [isLoading, setIsLoading] = useState(false);

    const fetchAndSettlePeople = async () => {
        await fetchPeople();
        setIsLoading(false);
    };

    useEffect(() => {
        if (people.length === 0) {
            setIsLoading(true);
            fetchAndSettlePeople();
        }
    }, []);

    return (
        <Box display="flex" height="100vh">
            {/* Sidebar */}
            <Navigation selectedItem="Employees" />

            {/* Scrollable Content */}
            <Box
                flex={1}
                overflow="auto"
                padding="32px"
                bgcolor="#f9fafb"
                display="flex"
                flexDirection="column"
            >
                <Header name="Employees" />

                <MaintenanceBanner
                    bannerArray={[
                        {
                            variant: 'maintenance',
                            title: 'Maintenance Mode',
                            subtitle: 'This page is still under development. The data shown here is for demonstration purposes only.',
                            rotate: true,
                            duration: 10000,
                        },
                    ]}
                />

                <Box display="flex" justifyContent="flex-end" mb={3}>
                    <Button variant="contained" color="primary">
                        Add New Employee +
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {people?.map((emp, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <EmployeeCard people={emp} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default EmployeeGrid;