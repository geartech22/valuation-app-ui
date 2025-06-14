import React, { useState, useEffect } from 'react';
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Fade,
    Divider,
    ListItemIcon,
    Badge,
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
import SwitchAccount from '@mui/icons-material/SwitchAccount';
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from './store/useLoginStore';

const Header = ({ name }) => {
    const navigate = useNavigate();
    const { logout, user, fetchUserById, userDetails, authSession } = useLoginStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const settle = async () => {
            if (user) await fetchUserById(user.id);
            else await authSession();
        };
        settle();
    }, [user]);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight={600}>
                {name}
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1">
                    Hi,&nbsp; <strong>{userDetails?.name}</strong>
                </Typography>

                <Badge
                    color="error"
                    overlap="circular"
                    variant="dot"
                    invisible={!userDetails?.role || userDetails.role === 'OWNER'} // show badge only if role is not OWNER
                >
                    <Avatar
                        src={userDetails?.profile_image}
                        alt={userDetails?.name}
                        sx={{ width: 50, height: 50, cursor: 'pointer' }}
                        onClick={handleMenuOpen}
                    />
                </Badge>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                        elevation: 4,
                        sx: { width: 240, mt: 1 },
                    }}
                >
                    <Box px={2} py={1}>
                        <Typography fontWeight={600}>{userDetails?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userDetails?.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">
                            {userDetails?.role}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <MenuItem disabled>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>

                    <MenuItem disabled>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>

                    <MenuItem disabled>
                        <ListItemIcon>
                            <SwitchAccount fontSize="small" />
                        </ListItemIcon>
                        Switch Account
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Header;