import React, { useState, useEffect } from 'react';
import Datagrid from './components/Datagrid';
import Button from './components/Button';
import Navigation from './components/Navigation';
import { Typography } from './components/Typography';
import { Alert, Box, Snackbar } from '@mui/material';
import DynamicFormDialog from './Formdialog';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import useDownloadReport from './components/Pdf';
import { supabase } from './store/index'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { fetchBanks, fetchBills, fetchBranchByBank, insertBill, updateBill } from './store/bills'; // Import your fetchBills function
import { entryfields } from './constants/bankData';
import Lottie from 'lottie-react';
import loaderData from './assets/loader.json';
import MaintenanceBanner from './components/Maintenence';

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


    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState(entryfields);
    const [title, setTitle] = useState('');
    const [values, setValues] = useState([]);
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [pdfdownloader] = useDownloadReport();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ key: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [bankOptions, setBankOptions] = useState([]); // State to hold bank options
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today's date
        id: '',
        address: '',
        bank: '',
        branch: '',
        value: '',
        fee: '',
        status: 'Unpaid',
        comments: '' // Default status
    });
    const fetchAndSetBills = async () => {
        setIsLoading(true);
        const response = await fetchBills();
        if (response.status === 'success') {
            setValues(response.data);
        } else {
            console.error('Error fetching bills:', response.message);
        }
        setIsLoading(false);
    };
    useEffect(() => {

        fetchAndSetBills();
    }, [])

    useEffect(() => {
        const fetchBanksAndSettle = async () => {
            try {
                const response = await fetchBanks();
                if (response.status === 'success') {
                    setBankOptions(response.data);
                } else {
                    console.error('Error fetching banks:', response.message);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };
        fetchBanksAndSettle();
    }, []);
    useEffect(() => {
        const fetchAndSetFields = async () => {

            if (title === 'Download Bills') {
                setFields([
                    { name: 'bank', label: 'Bank', component: 'autocomplete', options: bankOptions || [] },
                    { name: 'branch', label: 'Branch', component: 'autocomplete', options: [] },
                    { name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'] }
                ]);
            } else if (title === 'Add New Bill' || title === 'Edit Bill') {
                setFields(entryfields.map(field =>
                    field.name === 'bank'
                        ? { ...field, options: bankOptions || [] }
                        : field
                ));
            }
        };
        fetchAndSetFields();
    }, [title]);


    const handleDownload = async () => {
        setTitle('Download Bills');
        setSaveButtonText('Download');
        setOpenDialog(true);

    }
    const handleNewBill = async () => {
        setTitle('Add New Bill');
        setSaveButtonText('Save');
        setOpenDialog(true);

    }
    const handleSubmit = async (data) => {
        if (title === 'Download Bills') {
            pdfdownloader(`report-${new Date()
                .toLocaleString('en-GB')      // "07/06/2025, 14:45:32"
                .replace(', ', '/')}.pdf`, data, values, setMessage);
            setOpen(true);
        }
        else {
            const selectedBank = fields.find(field => field.name === 'bank')?.options.find(option => option.name === data.bank);
            const branchOptions = await fetchBranchByBank(selectedBank.id);
            const selectedBranch = branchOptions?.data.find(option => option.name === data.branch);
            const newBill = {
                bill_key: data.id,
                date: data.date,
                property_details: data.address,
                property_value: data.value,
                bill_amount: data.fee,
                status: data.status,
                bank_id: selectedBank ? selectedBank.id : null,
                branch_id: selectedBranch ? selectedBranch.id : null,
                comments: data.comments || ''
            };
            if (title === 'Edit Bill') {
                const update = await updateBill(data.id, newBill);
                if (update.status === 'success') {
                    const getBills = await fetchBills();
                    if (getBills.status === 'success') {
                        setValues(getBills.data);
                    }
                }
            }
            else {
                const insert = await insertBill(newBill);
                if (insert.status === 'success') {
                    const getBills = await fetchBills();
                    if (getBills.status === 'success') {
                        setValues(getBills.data);
                    }
                }
            }
        }

        setFormData({
            date: new Date().toISOString().split('T')[0], // Reset to today's date
            id: '',
            address: '',
            bank: '',
            branch: '',
            value: '',
            fee: '',
            status: 'Unpaid',
            comments: '' // Reset status
        });

        setMessage({
            key: 'success',
            text: 'Bill saved successfully!'
        });
        setOpen(true);

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
        { field: 'date', headerName: 'Bill Date', width: 150 },
        { field: 'address', headerName: 'Property Details', width: 300 },
        { field: 'bank', headerName: 'Bank', width: 100 },
        { field: 'branch', headerName: 'Branch', width: 250 },
        { field: 'value', headerName: 'Property Value(₹)', width: 180 },
        { field: 'fee', headerName: 'Bill Amount(₹)', width: 130 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'comments', headerName: 'Comments', width: 200 },
        {
            field: 'actions', headerName: 'Edit', width: 100, renderCell: (params) => (
                <IconButton onClick={() => handleEditClick(params.row)}>
                    <EditIcon />
                </IconButton>
            )

        }
    ];
    const handleBankChange = async (key, value) => {
        if (key === 'bank') {
            const branchOptions = await fetchBranchByBank(value.id);
            setFields(prevFields => prevFields.map(field =>
                field.name === 'branch' ? { ...field, options: branchOptions.data } : field
            ));
        }
    }
    const handleEditClick = (row) => {
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
        setOpenDialog(true);
        setTitle('Edit Bill');
        setSaveButtonText('Save');
    };

    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>

                <Box style={{ display: 'flex', minHeight: '100vh' }}>

                    <Navigation selectedItem='Bills' />
                    {!isLoading ? <Box style={classes.content}>

                        <Box style={classes.header}>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>
                                Bills
                            </Typography>
                            <Button onClick={() => { handleLogOut() }} variant="contained">Log Out</Button>

                        </Box>
                        <MaintenanceBanner title={'Branch Edit Info'} variant='info' subtitle={`Before editing the branch field, please click on the bank first. This will load the correct list of branches. We’re working on improving this in the next update.`} />

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
                                loadData={fetchAndSetBills}
                                loading={isLoading}
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

                    </Box> :
                        <div style={{ margin: 'auto', width: '250px', height: '250px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Lottie animationData={loaderData} loop={true} />
                        </div>}
                </Box>
            </Paper >
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
                        status: 'Unpaid',
                        comments: '' // Reset status
                    });
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
            />
        </Box >
    );
}