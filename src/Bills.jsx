import React, { useState } from 'react';
import Datagrid from './components/Datagrid';
import Button from './components/Button';
import { valuationEntries } from './constants/tableData';
import Navigation from './components/Navigation';
import { Typography } from './components/Typography';
import { Alert, Box, Snackbar } from '@mui/material';
import DynamicFormDialog from './Addbill';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PdfDownloadTable from './components/Pdf';
import useDownloadReport from './components/Pdf';
import { supabase } from './store/index'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


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
const bankOptions = ['Kerala Bank', 'SBI', 'HDFC Bank', 'Federal Bank', 'Canara Bank', 'Axis Bank'];
const branchOptions = ['Pazhayannur Branch', 'Shoranur Branch', 'Alappuzha Branch', 'Thrikkakara Branch', 'Thrissur Branch'];

const entryfields = [
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'id', label: 'ID' },
    { name: 'address', label: 'Address' },
    { name: 'bank', label: 'Bank', component: 'autocomplete', options: bankOptions },
    { name: 'branch', label: 'Branch', component: 'autocomplete', options: branchOptions },
    { name: 'value', label: 'Value' },
    { name: 'fee', label: 'Fee' },
    { name: 'amountInWords', label: 'Amount in Words' },
    { name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'] },
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

export default function Bills() {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState(entryfields);
    const [title, setTitle] = useState('Add New Bill');
    const [values, setValues] = useState(valuationEntries);
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [pdfdownloader, message] = useDownloadReport();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today's date
        id: '',
        address: '',
        bank: '',
        branch: '',
        value: '',
        fee: '',
        amountInWords: '',
        status: 'Unpaid' // Default status
    });
    const handleDownload = () => {
        setOpenDialog(true);
        setFields([
            { name: 'bank', label: 'Bank', component: 'autocomplete', options: bankOptions },
            { name: 'branch', label: 'Branch', component: 'autocomplete', options: branchOptions },
            { name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'] }
        ]);
        setTitle('Download Bills');
        setSaveButtonText('Download');
    }
    const handleNewBill = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0], // Default to today's date
            id: '',
            address: '',
            bank: '',
            branch: '',
            value: '',
            fee: '',
            amountInWords: '',
            status: 'Unpaid' // Default status
        });
        setOpenDialog(true);
        setFields(fields);
        setTitle('Add New Bill');
    }
    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            navigate('/login') // Redirect to login page
        }
    }
    const columns = [
        { field: 'id', headerName: 'Bill No', width: 80 },
        { field: 'date', headerName: 'Valuation Date', width: 150 },
        { field: 'address', headerName: 'Property Details', width: 300 },
        { field: 'bank', headerName: 'Bank', width: 100 },
        { field: 'branch', headerName: 'Branch', width: 250 },
        { field: 'value', headerName: 'Property Value(₹)', width: 180 },
        { field: 'fee', headerName: 'Bill Amount(₹)', width: 130 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'actions', headerName: 'Edit', width: 100, renderCell: (params) => {
                const handleEditClick = () => {
                    setFormData({
                        date: params.row.date,
                        id: params.row.id,
                        address: params.row.address,
                        bank: params.row.bank,
                        branch: params.row.branch,
                        value: params.row.value,
                        fee: params.row.fee,
                        amountInWords: params.row.amountInWords,
                        status: params.row.status
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

                    <Navigation selectedItem='Bills' />
                    <Box style={classes.content}>

                        <Box style={classes.header}>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>
                                Bills
                            </Typography>
                            <Button onClick={() => { handleLogOut() }} variant="contained">Log Out</Button>

                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
                            <Button onClick={() => handleDownload()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                                color="primary"
                            >
                                Download
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="contained"
                                color="primary" onClick={() => {
                                    handleNewBill();
                                }} >Add New Bill +</Button>
                        </Box>

                        <Paper elevation={0} style={{ border: '1px solid #e0e0e0', minWidth: '100%', width: '700px' }}>

                            <Datagrid
                                rows={values}
                                columns={columns}
                            />

                        </Paper>

                        <Snackbar
                            open={open}
                            autoHideDuration={5000}
                            onClose={() => setOpen(false)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <Alert
                                size="medium"
                                severity={message?.key}
                                sx={{
                                    fontSize: '1.2rem',     // Increase text size
                                    padding: '20px',        // Increase padding
                                    alignItems: 'center',   // Vertically center content
                                    '& .MuiAlert-icon': {
                                        fontSize: '2rem'      // Make icon bigger
                                    }
                                }}

                                onClose={() => setOpen(false)}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => setOpen(false)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                {message?.message}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </Paper>
            <DynamicFormDialog open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setFormData({
                        date: new Date().toISOString().split('T')[0], // Reset to today's date
                        id: '',
                        address: '',
                        bank: '',
                        branch: '',
                        value: '',
                        fee: '',
                        amountInWords: '',
                        status: 'Unpaid' // Reset status
                    });
                }}
                fields={fields}
                onSubmit={(data) => {
                    setOpen(true);
                    pdfdownloader(`report-${new Date()
                        .toLocaleString('en-GB')      // "07/06/2025, 14:45:32"
                        .replace(', ', '/')}.pdf`, data, values);
                }}
                title={title}
                saveText={saveButtonText}
                cancelText="Cancel"
                values={formData || {
                    date: new Date().toISOString().split('T')[0], // Default to today's date
                    id: '',
                    address: '',
                    bank: '',
                    branch: '',
                    value: '',
                    fee: '',
                    amountInWords: '',
                    status: 'Unpaid' // Default status
                }}
            />
        </Box>
    );
}