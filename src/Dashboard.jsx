import Navigation from "./components/Navigation";
import Box from '@mui/material/Box';
import { Typography } from './components/Typography';
import { Avatar } from "@mui/material";
import Lottie from 'lottie-react';
import emptyData from './assets/empty.json';
const makeStyles = (styles) => () => styles;
const Paper = ({ children, style, elevation = 1 }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: elevation === 1 ? '0 2px 4px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.15)',
        ...style
    }}>
        {children}
    </div>
);
const useStyles = makeStyles({

    mainContainer: {
        minHeight: '100vh',

    },
    paper: {
        borderRadius: '16px',
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
const Dashboard = () => {
    const classes = useStyles();
    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>
                <Box style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation selectedItem="Dashboard" />
                    <Box style={classes.content}>
                        <Box style={classes.header}>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>
                                Dashboard
                            </Typography>
                            <Avatar />
                        </Box>


                    </Box>

                </Box>
                <div style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)', width: '500px', height: '150px' }}>
                    <Lottie animationData={emptyData} loop={true} />
                </div>
            </Paper>
        </Box>
    )
}
export default Dashboard;