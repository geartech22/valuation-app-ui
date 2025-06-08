// Add the required imports
import React, { useEffect, useState } from 'react';
import { Typography } from './Typography';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';

const makeStyles = (styles) => () => styles;

const List = ({ children, style }) => <div style={style}>{children}</div>;
const useStyles = makeStyles({

    mainContainer: {
        minHeight: '100vh',

    },
    paper: {
        borderRadius: '16px',
        overflow: 'hidden',
    },
    sidebar: {
        backgroundColor: '#fafafa',
        paddingTop: '20px',
        paddingBottom: '20px',
        borderRight: '1px solid #e0e0e0'
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
        borderRadius: '8px',
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
            borderRadius: '4px',
            margin: '4px 0',
            transition: 'background-color 0.2s ease',
            '&:hover': { backgroundColor: selected ? '#e2e8f0' : '#f8fafc' },
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
        dashboard: <DashboardIcon />
    };

    return <span style={{ fontSize: '20px', ...style }}>{icons[name] || name}</span>;
};
const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'Bills', label: 'Bills', icon: 'bills' },
    { id: 'WorkManagement', label: 'Work Management', icon: 'work' }

];
const Navigation = ({ selectedItem }) => {
    const classes = useStyles();
    const [selectedMenuItem, setSelectedMenuItem] = useState(selectedItem);
    const navigate = useNavigate();
    useEffect(() => {
        setSelectedMenuItem(selectedItem);
    }, [selectedItem]);


    return (
        <Box style={classes.sidebar}>
            <Box style={classes.logo}>
                <Box style={classes.logoIcon}>
                    <Typography variant="h6" style={{ color: 'white', fontWeight: 'bold' }}>
                        V
                    </Typography>
                </Box>
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                    Valuation
                </Typography>
            </Box>

            <List>
                {menuItems?.map((item) => (
                    <ListItem
                        key={item.id.toLowerCase()}
                        selected={selectedMenuItem === (item.id.toLowerCase())}
                        onClick={() => {
                            setSelectedMenuItem(item.id),
                                navigate(`/${item.id.toLowerCase()}`)

                        }}
                        style={{
                            background: selectedMenuItem === item.id
                                ? 'linear-gradient(90deg, rgb(55, 65, 81) -110.47%, rgba(55, 65, 81, 0) 86.39%)'
                                : 'transparent', borderRight: selectedMenuItem === item.id ? '3px solid #374151' : 'none', borderRadius: '0px'
                        }}
                    >
                        <ListItemIcon>
                            <Icon name={item.icon} />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
export default Navigation;