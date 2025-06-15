// Add the required imports
import React, { useEffect, useState } from 'react';
import { Typography } from './Typography';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import Logo from "../assets/logo2.png";
import { useLoginStore } from '../store/useLoginStore';

const makeStyles = (styles) => () => styles;
const version = __APP_VERSION__;

const List = ({ children, style }) => <div style={style}>{children}</div>;
const useStyles = makeStyles({
    mainContainer: {
        minHeight: '100vh',
    },
    paper: {
        overflow: 'hidden',
        borderRadius: 'none'
    },
    sidebar: {
        backgroundColor: '#1f3d5a',
        paddingBottom: '20px',
        borderRight: '1px solid #e0e0e0',
        width: '220px',
        borderTopLeftRadius: 0,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px'
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        marginLeft: '16px'
    },
    content: {
        flex: 1,
        padding: '32px'
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
    searchContainer: {
        marginBottom: '24px'
    },
    statusChip: {
        minWidth: '60px',
        textAlign: 'center'
    }
});

const ListItem = ({ children, onClick, style, selected = false }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            backgroundColor: selected ? '#f1f5f9' : 'transparent',
            margin: '4px 0',
            transition: 'background-color 0.2s ease',
            ...style
        }}
    >
        {children}
    </div>
);

const ListItemIcon = ({ children, style }) => (
    <div style={{ marginRight: '16px', ...style }}>{children}</div>
);

const ListItemText = ({ primary, style }) => (
    <div style={{ fontSize: '16px', fontWeight: 500, ...style }}>{primary}</div>
);

const Icon = ({ name, style }) => {
    const icons = {
        bills: <ReceiptLongIcon />,
        work: <WorkIcon />,
        dashboard: <DashboardIcon />,
        people: <GroupIcon />
    };

    return <span style={{ fontSize: '20px', ...style }}>{icons[name] || name}</span>;
};

const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'Bills', label: 'Bills', icon: 'bills' },
    { id: 'Valuations', label: 'Valuations', icon: 'work' },
    { id: 'Employees', label: 'Employees', icon: 'people' }
];

const Navigation = ({ selectedItem }) => {
    const classes = useStyles();
    const [selectedMenuItem, setSelectedMenuItem] = useState(selectedItem);
    const navigate = useNavigate();
    const { user } = useLoginStore();

    useEffect(() => {
        setSelectedMenuItem(selectedItem);
    }, [selectedItem]);

    return (
        <Box
            style={{
                ...classes.sidebar,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100vh',
            }}
        >
            <div>
                <Box style={classes.logo}>
                    <Box
                        component="img"
                        src={Logo}
                        alt="Logo"
                        sx={{
                            width: 190,
                            height: 'auto',
                            display: 'block',
                            mx: 'auto',
                        }}
                    />
                </Box>

                <List>
                    {menuItems?.map((item) => {
                        const isSelected = selectedMenuItem === item.id;
                        return (
                            <ListItem
                                key={item.id.toLowerCase()}
                                selected={isSelected}
                                onClick={() => {
                                    setSelectedMenuItem(item.id);
                                    navigate(`/${item.id.toLowerCase()}`);
                                }}
                                style={{
                                    alignItems: 'normal',
                                    background: isSelected
                                        ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                                        : 'transparent',
                                    borderRight: isSelected ? '4px solid rgba(255,255,255,0.85)' : '4px solid transparent',
                                    color: isSelected ? '#dbeafe' : '#e2e8f0',
                                    borderRadius: '4px 0 0 4px',
                                    margin: '4px 0',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isSelected ? 'inset 0 0 6px rgba(255,255,255,0.2)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = isSelected
                                        ? 'linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.07) 100%)'
                                        : 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isSelected
                                        ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                                        : 'transparent';
                                }}
                            >
                                <ListItemIcon>
                                    <Icon name={item.icon} style={{ color: isSelected ? '#dbeafe' : '#e5e7eb' }} />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        );
                    })}
                </List>
            </div>

            <Box
                style={{
                    padding: '12px 16px',
                    fontSize: '16px',
                    color: '#94a3b8',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    marginTop: 'auto',
                }}
            >
                Version <strong style={{ color: '#dbeafe' }}>{version}</strong>
            </Box>
        </Box>
    );
};

export default Navigation;