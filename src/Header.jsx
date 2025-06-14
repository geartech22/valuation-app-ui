import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Typography } from "./components/Typography";
import Button from "./components/Button";
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from './store/useLoginStore';

const Header = ({ name }) => {
    const navigate = useNavigate();
    const { logout, user, fetchUserById, userDetails, authSession } = useLoginStore();
    useEffect(() => {
        const fetchAndSettleUserDetails = async () => {
            if (user) {
                await fetchUserById(user.id);
            }
            else {
                await authSession();
            }

        }

        fetchAndSettleUserDetails();

    }, [user])

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
            <Box display='flex' sx={{ justifyContent: 'space-between', width: '18%', alignItems: 'center' }}>
                <Typography variant='body1'> <strong>Hi,&nbsp;</strong>{userDetails?.name}</Typography>
            <Button onClick={handleLogOut} variant="contained">Log Out</Button>
            </Box>
        </Box>
    );
};

export default Header;