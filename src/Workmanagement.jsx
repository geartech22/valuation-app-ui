import Navigation from "./components/Navigation";
import Box from '@mui/material/Box';
import { Typography } from './components/Typography';
import Button from './components/Button';
import Datagrid from './components/Datagrid';
import { bankRecords } from './constants/bankData';
import { Avatar } from "@mui/material";
import DynamicFormDialog from "./Addbill";
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
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
const formFields = [
    { name: 'id', label: 'ID' },
    { name: 'address', label: 'Address' },
    {
        name: 'bank',
        label: 'Bank',
        component: 'autocomplete',
        options: ['SBI', 'Canara Bank', 'Federal Bank', 'Axis Bank', 'HDFC Bank', 'Kerala Bank']
    },
    {
        name: 'branch',
        label: 'Branch',
        component: 'autocomplete',
        options: ['Thrissur Branch', 'Alappuzha Branch', 'Pazhayannur Branch', 'Shoranur Branch']
    },
    { name: 'manager', label: 'Manager' },
    { name: 'employee', label: 'Employee' }
];
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

const Workmanagement = () => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);
    const [formData, setFormData] = useState({
        id: '',
        address: '',
        bank: '',
        branch: '',
        manager: '',
        employee: ''
    });
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'address', headerName: 'Address', width: 300 },
        { field: 'bank', headerName: 'Bank', width: 100 },
        { field: 'branch', headerName: 'Branch', width: 200 },
        { field: 'manager', headerName: 'Manager', width: 180 },
        { field: 'employee', headerName: 'Employee', width: 160 },
        {
            field: 'actions', headerName: 'Actions', width: 100, renderCell: (params) => {
                const handleEditClick = () => {
                    setFormData({
                        id: params.row.id,
                        address: params.row.address,
                        bank: params.row.bank,
                        branch: params.row.branch,
                        manager: params.row.manager,
                        employee: params.row.employee
                    });
                    setOpenDialog(true);

                };
                return (
                    <IconButton onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                );
            }
        }
    ];

    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>
                <Box style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation selectedItem="WorkManagement" />
                    <Box style={classes.content}>
                        <Box style={classes.header}>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>
                                Work Management
                            </Typography>
                            <Avatar />
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
                            <Button
                                onClick={() => {
                                    setFormData({
                                        id: '',
                                        address: '',
                                        bank: '',
                                        branch: '',
                                        manager: '',
                                        employee: ''
                                    });
                                    handleOpen();
                                }}
                                variant="contained"
                                color="primary"
                            >
                                Add New Entry +
                            </Button>
                        </Box>
                        <Paper elevation={0} style={{ border: '1px solid #e0e0e0', minWidth: '100%', width: '700px' }}>
                            <Datagrid
                                rows={bankRecords}
                                columns={columns}
                            />
                        </Paper>
                    </Box>
                </Box>
            </Paper>
            <DynamicFormDialog open={openDialog}
                onClose={() => setOpenDialog(false)}
                fields={formFields}
                onSubmit={(data) => console.log(data)}
                title="Add Work Entry"
                values={formData || {
                    id: '',
                    address: '',
                    bank: '',
                    branch: '',
                    manager: '',
                    employee: ''
                }}
            />
        </Box>
    )
}
export default Workmanagement;