import React, { useState, useEffect } from 'react';
import Datagrid from './components/Datagrid';
import Button from './components/Button';
import Navigation from './components/Navigation';
import { Alert, Box, Snackbar } from '@mui/material';
import DynamicFormDialog from './components/Formdialog';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import useDownloadReport from './components/Pdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Header from './Header';
import useBillStore from './store/useBillStore';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MaintenanceBanner from './components/Banners';
import { useLoginStore } from './store/useLoginStore';

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

export default function Bills() {

    const { fetchBanks, fetchBills, fetchBranchByBank, insertBill, updateBill, bills, banks, branches, loading,
        error, entryFields, downloadFields, insertBank, insertBranch } = useBillStore(); // Use the custom hook to fetch banks and branches
    const { user, authSession } = useLoginStore(); // Use the custom hook to get user information
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState();
    const [title, setTitle] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [pdfdownloader] = useDownloadReport();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ key: '', text: '' });
    const [isLoading, setIsLoading] = useState(loading);
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today's date
        id: '',
        address: '',
        bank: { name: '', id: '' }, // Default bank object
        branch: { name: '', id: '' }, // Default branch object
        value: '',
        fee: '',
        status: 'Unpaid',
        comments: '' // Default status
    });
    const checkSession = async () => {
        if (user) {
            navigate('/bills'); // Redirect to the bills page if user is already logged in
        }
        else {
            const user = await authSession();
            if (user?.data) {
                navigate('/bills'); // Redirect to the bills page if user is already logged in
            }
            else {
                navigate('/login'); // Redirect to the login page if no user is found
            }
        }
    }
    useEffect(() => {
        checkSession();
        if (bills.length === 0) {
            fetchBills();
        }
        if (banks.length === 0) {
            fetchBanks();
        }
    }, []);
    useEffect(() => {
        if (title === 'Edit Bill' || title === 'Add New Bill') {
            setFields(entryFields);

        }
        else if (title === 'Download Bills') {
            setFields(downloadFields);

        }
    }, [title])


    const handleDownload = async () => {
        setTitle('Download Bills');
        setSaveButtonText('Download');
        setOpenDialog(true);

    }
    const handleNewBill = () => {
        setTitle('Add New Bill');
        setSaveButtonText('Save');
        setOpenDialog(true);
    }
    const handleSubmit = async (data) => {
        setIsLoading(true);

        if (title === 'Download Bills') {
            pdfdownloader(`report-${new Date()
                .toLocaleString('en-GB')      // "07/06/2025, 14:45:32"
                .replace(', ', '/')}.pdf`, data, bills, setMessage);
            setOpen(true);
        }
        else {
            let bankId, branchId;
            if (typeof (data.bank) === 'string' && data.bank !== '') {
                const response = await insertBank(data.bank);
                bankId = response.data[0].id;
                await fetchBanks(); // Refresh banks after inserting a new bank
            }
            if (typeof (data.branch) === 'string' && data.branch !== '') {
                const response = await insertBranch(data.branch, bankId ? bankId : data.bank.id);
                branchId = response.data[0].id;
            }

            const newBill = {
                bill_key: data.id,
                date: data.date,
                property_details: data.address,
                property_value: data.value,
                bill_amount: data.fee,
                status: data.status,
                bank_id: data?.bank?.id ? data.bank.id : bankId,
                branch_id: data?.branch?.id ? data.branch.id : branchId,
                comments: data.comments || ''
            };
            if (title === 'Edit Bill') {
                await updateBill(data.id, newBill);
            }
            else {
                await insertBill(newBill);
            }
            setMessage({
                key: 'success',
                text: 'Bill saved successfully!'
            });
        }
        setFormData({
            date: new Date().toISOString().split('T')[0], // Reset to today's date
            id: '',
            address: '',
            bank: { name: '', id: '' }, // Reset bank and branch
            branch: { name: '', id: '' }, // Reset bank and branch
            value: '',
            fee: '',
            status: 'Unpaid',
            comments: '' // Reset status
        });
        setIsLoading(false);
        setOpen(true);
    }

    const columns = [
        { field: 'id', headerName: 'Bill No', width: 80, dataType: 'string' },
        { field: 'date', headerName: 'Bill Date', width: 150, dataType: 'string' },
        { field: 'address', headerName: 'Property Details', width: 300, dataType: 'string' },
        { field: 'bank', headerName: 'Bank', width: 100, dataType: 'object', type: 'dropdown' },
        { field: 'branch', headerName: 'Branch', width: 250, dataType: 'object', type: 'dropdown' },
        { field: 'value', headerName: 'Property Value(₹)', width: 180, dataType: 'string' },
        { field: 'fee', headerName: 'Bill Amount(₹)', width: 130, dataType: 'string' },
        { field: 'status', headerName: 'Status', width: 120, dataType: 'string', type: 'chip' },
        { field: 'comments', headerName: 'Comments', width: 200, dataType: 'string' },
        {
            field: 'actions',
            headerName: 'Edit',
            width: 100,
            dataType: 'string',
            renderCell: (params) => (
                <IconButton onClick={() => handleEditClick(params.row)}>
                    <EditIcon />
                </IconButton>
            )
        }
    ];
    const handleBankChange = async (key, value) => {
        if ((key === 'bank' && value?.id)) {
            setIsLoading(true);
            const branches = await fetchBranchByBank(value?.id);
            setFields(prevFields => prevFields.map(field =>
                field.name === 'branch' ? { ...field, options: branches.data } : field
            ));
            setIsLoading(false);
        }
    };

    const handleEditClick = async (row) => {
        setFormData({
            date: new Date(row.date).toISOString().split('T')[0],
            id: parseInt(row.id, 10),
            address: row.address,
            bank: row.bank,
            branch: row.branch,
            value: parseInt(row.value, 10),
            fee: parseInt(row.fee, 10),
            status: row.status,
            comments: row.comments || ''
        });
        setIsLoading(true);
        const branches = await fetchBranchByBank(row.bank.id);
        const updatedFields = entryFields.map(field =>
            field.name === 'branch'
                ? { ...field, options: branches.data }
                : { ...field } // force full clone to ensure re-render
        );
        setFields(updatedFields);
        setTitle('Edit Bill');
        setSaveButtonText('Save');
        setOpenDialog(true);
        setIsLoading(false);
    };
    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>

                <Box style={{ display: 'flex', minHeight: '100vh' }}>

                    <Navigation selectedItem='Bills' />
                    <Box style={classes.content}>

                        <Header name="Bills" />

                        <MaintenanceBanner
                            bannerArray={[
                                {
                                    variant: 'info',
                                    title: 'Branch Edit Info',
                                    subtitle: 'Before editing the branch field, please click on the bank first. This will load the correct list of branches. We’re working on improving this in the next update.',
                                    rotate: true,
                                    duration: 10000
                                },
                                {
                                    variant: 'info',
                                    title: 'Crash Notice',
                                    subtitle: 'In case of any issues, Please reload the page. Our expert team is working on it.',
                                    rotate: true,
                                    duration: 10000
                                },
                                {
                                    variant: 'info',
                                    title: 'Beta Version Notice',
                                    subtitle: 'This appliaction is still in beta. You may experience some bugs or issues.',
                                    rotate: true,
                                    duration: 10000
                                }
                            ]}
                        />
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
                                rows={bills}
                                columns={columns}
                                loadData={fetchBills}
                                loading={loading}
                            />

                        </Paper>

                        <Snackbar
                            open={open}
                            autoHideDuration={5000}
                            onClose={() => setOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                                {message?.text}
                            </Alert>
                        </Snackbar>

                    </Box>
                </Box>
            </Paper >
            <DynamicFormDialog open={openDialog}
                onClose={() => {
                    setFormData({
                        date: new Date().toISOString().split('T')[0], // Reset to today's date
                        id: '',
                        address: '',
                        bank: { name: '', id: '' }, // Reset bank and branch
                        branch: { name: '', id: '' }, // Reset bank and branch
                        value: '',
                        fee: '',
                        status: 'Unpaid',
                        comments: '' // Reset status
                    });
                    setOpenDialog(false);

                }}
                formFields={fields} // Fields for the form
                onSubmit={(data) => {
                    handleSubmit(data);
                }}
                title={title}
                saveText={saveButtonText}
                cancelText="Cancel"
                values={formData} // Pass the formData state to the dialog
                onComponentChange={(key, value) => { handleBankChange(key, value) }}
                disabledKey={'branch'}
                disabledReference={'bank'}
            // onNewEntry={(key, value) => { insertFields(key, value) }}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box >
    );
}