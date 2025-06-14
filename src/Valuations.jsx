import Navigation from "./components/Navigation";
import Box from '@mui/material/Box';
import { Typography } from './components/Typography';
import Button from './components/Button';
import Datagrid from './components/Datagrid';
import { Avatar } from "@mui/material";
import { use, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import useValuationsStore from "./store/useValuationStore";
import { valuationFields } from "./constants/bankData";
import { data, useNavigate } from "react-router-dom";
import DynamicFormDialog from "./components/Formdialog";
import { supabase } from "./store/index"; // Import supabase client
import MaintenanceBanner from "./components/Banners";
import Header from "./Header";
import useBillStore from "./store/useBillStore";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


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

const Valuations = () => {
    const { fetchValuations, fetchPeople, valuations, people, insertValuation, updateValuation, insertPeopleByName } = useValuationsStore();
    const { fetchBanks, fetchBranchByBank, banks, loading, insertBank, insertBranch } = useBillStore(); // Import the store functions
    const [values, setValues] = useState(valuations);
    const [isLoading, setIsLoading] = useState(loading);
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState(valuationFields);
    const [title, setTitle] = useState("");

    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ key: '', text: '' });
    const [formData, setFormData] = useState({
        id: '',
        address: '',
        bank: { id: '', name: '' },
        branch: { id: '', name: '' },
        valuation_contact: { id: '', name: '' },
        site_investigator: { id: '', name: '' },
        documented_by: { id: '', name: '' },
        status: '',
        comments: '',
        date: new Date().toISOString().split('T')[0] // Default to today's date
    });

    const columns = [
        { field: 'id', headerName: 'Valuation Number', width: 90, dataType: 'string' },
        { field: 'address', headerName: 'Property Details', width: 200, dataType: 'string' },
        { field: 'bank', headerName: 'Bank', width: 120, dataType: 'object', type: 'dropdown' },
        { field: 'branch', headerName: 'Branch', width: 150, dataType: 'object', type: 'dropdown' },
        { field: 'valuation_contact', headerName: 'Valuation Contact', width: 150, dataType: 'object', type: 'avatar' },
        { field: 'site_investigator', headerName: 'Site Investigator', width: 150, dataType: 'object', type: 'avatar' },
        { field: 'documented_by', headerName: 'Documented By', width: 150, dataType: 'object', type: 'avatar' },
        { field: 'status', headerName: 'Status', width: 140, dataType: 'string', type: 'chip' },
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
            ),
        }
    ];
    const classes = useStyles();
    const fetchAndSetValuations = async () => {
        if (valuations && valuations?.length == 0) {
        setIsLoading(true);
        const response = await fetchValuations();
        if (response.data) {
            setValues(response.data);
        }
        setIsLoading(false);
        }
        else {
            setValues(valuations);
        }
    }
    useEffect(() => {
        fetchAndSetBanks();
    }, [banks]);
    useEffect(() => {
        fetchAndSettlePeople();
    }, [people]);
    useEffect(() => {
        fetchAndSetValuations();
    }, []);

    const fetchAndSettlePeople = async () => {
        if (people?.length === 0) {
        const response = await fetchPeople();
        if (response.data)
            setFields(prevFields => prevFields.map(field => {
                if (['valuation_contact', 'site_investigator', 'documented_by'].includes(field.id)) {
                    return {
                        ...field,
                        options: response.data
                    };
                }
                return field;
            }));
        }
        else {
            setFields(prevFields => prevFields.map(field => {
                if (['valuation_contact', 'site_investigator', 'documented_by'].includes(field.id)) {
                    return {
                        ...field,
                        options: people
                    };
                }
                return field;
            }));

        }
    }

    const handleEditClick = async (row) => {
        setIsLoading(true)
        setTitle("Edit Valuation")
        setFormData({
            id: row.id,
            address: row.address,
            bank: row.bank,
            branch: row.branch,
            valuation_contact: row.valuation_contact,
            site_investigator: row.site_investigator,
            documented_by: row.documented_by,
            status: row.status,
            comments: row.comments,
            date: new Date().toISOString().split('T')[0]
        });
        const branches = await fetchBranchByBank(row.bank.id);
        setFields(prevFields =>
            prevFields.map(field =>
                field.name === 'branch'
                    ? { ...field, options: branches.data }
                    : { ...field }
            )
        );
        setSaveButtonText('Save');
        setOpenDialog(true);
        setIsLoading(false)
    };
    const fetchAndSetBanks = async () => {
        if (banks?.length === 0) {
            const response = await fetchBanks();
            if (response.data) {
                setFields(prevFields => prevFields.map(field => {
                    if (field.id === 'bank') {
                        return {
                            ...field,
                            options: response.data.map(bank => ({ id: bank.id, name: bank.name }))
                        };
                    }
                    return field;
                }));
            }
        }
        else {
            setFields(prevFields => prevFields.map(field => {
                if (field.id === 'bank') {
                    return {
                        ...field,
                        options: banks.map(bank => ({ id: bank.id, name: bank.name }))
                    };
                }
                return field;
            }));
        }
    }
    const handleNewValuation = async () => {
        setTitle("Add New Valuation")
        setSaveButtonText('Save');
        setOpenDialog(true);

    }

    const handleSubmit = async (data) => {
        setIsLoading(true);
        let bankId, branchId, valuation_contact, site_investigator, documented_by;

        // Insert bank if it's a string
        if (typeof data.bank === 'string' && data.bank !== '') {
            const response = await insertBank(data.bank);
            bankId = response.data[0].id;
        } else {
            bankId = data.bank.id;
        }

        // Insert branch if it's a string
        if (typeof data.branch === 'string' && data.branch !== '') {
            const response = await insertBranch(data.branch, bankId ?? data.bank.id);
            branchId = response.data[0].id;
        } else {
            branchId = data.branch.id || data.branch;
        }

        // Insert valuation contact if it's a string
        if (typeof data.valuation_contact === 'string' && data.valuation_contact !== '') {
            const response = await insertPeopleByName(data.valuation_contact);
            valuation_contact = response.data[0].id;
        } else {
            valuation_contact = data.valuation_contact.id || data.valuation_contact;
        }

        // Insert site investigator if it's a string
        if (typeof data.site_investigator === 'string' && data.site_investigator !== '') {
            const response = await insertPeopleByName(data.site_investigator);
            site_investigator = response.data[0].id;
        } else {
            site_investigator = data.site_investigator.id || data.site_investigator;
        }

        // Insert documented by if it's a string
        if (typeof data.documented_by === 'string' && data.documented_by !== '') {
            const response = await insertPeopleByName(data.documented_by);
            documented_by = response.data[0].id;
        } else {
            documented_by = data.documented_by.id || data.documented_by;
        }


        const newBill = {
            valuation_key: parseInt(data.id, 10),
            address: data.address,
            bank_id: bankId,
            branch_id: branchId,
            valuation_contact_id: valuation_contact,
            site_investigator_id: site_investigator,
            documented_by_id: documented_by,
            status: data.status,
            comments: data.comments
        };
        const id = parseInt(data.id, 10);
        if (title === "Edit Valuation") {
            await updateValuation(id, newBill);
        }
        else {
            await insertValuation(newBill);

        }
        setValues(valuations)
        setOpen(true)
        setIsLoading(false);
        setOpenDialog(false);
    };
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

    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>
                <Box style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation selectedItem="Valuations" />
                    <Box style={classes.content}>
                        <Header name="Valuations" />
                        <MaintenanceBanner
                            bannerArray={[
                                {
                                    variant: 'maintenance',
                                    title: 'Maintenance Mode',
                                    subtitle: 'This page is still under development. The data shown here is for demonstration purposes only.',
                                    rotate: true,
                                    duration: 10000
                                }
                            ]}
                        />

                        <Box style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
                            <Button variant="contained"
                                color="primary" onClick={() => {
                                    handleNewValuation();
                                }} >Add New Valuation +</Button>
                        </Box>
                        <Paper elevation={0} style={{ border: '1px solid #e0e0e0', minWidth: '100%', width: '700px' }}>

                            <Datagrid
                                rows={valuations}
                                columns={columns}
                                loading={isLoading}
                                loadData={fetchValuations}
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

            </Paper>
            <DynamicFormDialog open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setFormData({
                        id: '',
                        address: '',
                        bank: { id: '', name: '' },
                        branch: { id: '', name: '' },
                        valuation_contact: { id: '', name: '' },
                        site_investigator: { id: '', name: '' },
                        documented_by: { id: '', name: '' },
                        status: '',
                        comments: '',
                        date: new Date().toISOString().split('T')[0]
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}
export default Valuations;