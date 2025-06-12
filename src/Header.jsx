import React from 'react';
import { Box } from '@mui/material';
import { Typography } from "./components/Typography";
import Button from "./components/Button";
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from './store/useLoginStore';

const Header = ({ name }) => {
    const navigate = useNavigate();
    const { logout, user } = useLoginStore();

    const handleLogOut = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
        }}>
            <Typography variant="h4" style={{ fontWeight: 600 }}>
                {name}
            </Typography>
            <Button onClick={handleLogOut} variant="contained">Log Out</Button>
        </Box>
    );
};

export default Header;