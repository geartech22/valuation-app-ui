import React from 'react';
import { Box } from '@mui/material';
import { Typography } from "./components/Typography"
import Button from "./components/Button";
import { useNavigate } from 'react-router-dom';
import { supabase } from './store/index'; // Adjust the import path as needed
const Header = ({ name }) => {
    const navigate = useNavigate();

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            navigate('/login') // Redirect to login page
        }
    }
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
    )
}
export default Header;