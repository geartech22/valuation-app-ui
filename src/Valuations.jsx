import Navigation from "./components/Navigation";
import Box from '@mui/material/Box';
import { Typography } from './components/Typography';
import Button from './components/Button';
import Datagrid from './components/Datagrid';
import { Avatar } from "@mui/material";
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import useValuationsStore from "./store/useValuationStore";
import Lottie from 'lottie-react';
import loaderData from './assets/loader.json';
import { valuationFields } from "./constants/bankData";
import { useNavigate } from "react-router-dom";
import DynamicFormDialog from "./Formdialog";
import { supabase } from "./store/index"; // Import supabase client
// import { fetchBanks, fetchBranchByBank } from "./store/useBillStore";
import MaintenanceBanner from "./components/Maintenence";
import Header from "./Header";
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
    const { fetchValuations, fetchBanks, fetchBranchByBank, fetchPeople } = useValuationsStore();
    const [values, setValues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState(valuationFields);
    const [bankOptions, setBankOptions] = useState([]); // State to hold bank options

    const [title, setTitle] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState({ key: '', text: '' });
    const [people, setPeople] = useState([]);
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const [formData, setFormData] = useState({
        id: '',
        address: '',
        bank: '',
        branch: '',
        valuation_contact: '',
        site_investigator: '',
        documented_by: '',
        status: '',
        comments: '',
        date: new Date().toISOString().split('T')[0] // Default to today's date
    });

    const columns = [
        { field: 'id', headerName: 'Valuation Number', width: 90 },
        { field: 'address', headerName: 'Property Details', width: 200 },
        { field: 'bank', headerName: 'Bank', width: 120 },
        { field: 'branch', headerName: 'Branch', width: 150 },
        { field: 'valuation_contact', headerName: 'Valuation Contact', width: 150 },
        { field: 'site_investigator', headerName: 'Site Investigator', width: 150 },
        { field: 'documented_by', headerName: 'Documented By', width: 180 },
        { field: 'status', headerName: 'Status', width: 140 },
        { field: 'comments', headerName: 'Comments', width: 200 },
        {
            field: 'actions',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => handleEditClick(params.row)}>
                    <EditIcon />
                </IconButton>
            ),
        }
    ];
    const classes = useStyles();
    const fetchAndSetValuations = async () => {
        setIsLoading(true);
        const response = await fetchValuations();
        if (response.status === 'success') {
            setValues(response.data);
        } else {
            console.error('Error fetching valuations:', response.message);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchAndSetValuations();
        fetchAndSettlePeople();
        fetchAndSetBanks();

    }, [])

    const fetchAndSettlePeople = async () => {
        const response = await fetchPeople();
        if (response.status === 'success') {
            setPeople(response.data);
            // Update fields with fetched people data
            setFields(prevFields => prevFields.map(field => {
                if (['valuation_contact', 'site_investigator', 'documented_by'].includes(field.id)) {
                    return {
                        ...field,
                        options: response.data.map(person => ({ id: person.id, name: person.name }))
                    };
                }
                return field;
            }));
        } else {
            console.error('Error fetching people:', response.message);
        }
    }
    const fetchAndSetBanks = async () => {
        const response = await fetchBanks();
        if (response.status === 'success') {
            setFields(prevFields => prevFields.map(field => {
                if (field.id === 'bank') {
                    return {
                        ...field,
                        options: response.data.map(bank => ({ id: bank.id, name: bank.name }))
                    };
                }
                return field;
            }));
            setBankOptions(response.data); // Set bank options for autocomplete
        }
        else {
            console.error('Error fetching banks:', response.message);
        }
    }
    const handleNewValuation = async () => {
        setTitle('Add New Valuation');
        setSaveButtonText('Save');
        setOpenDialog(true);

    }
    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            navigate('/login') // Redirect to login page
        }
    }
    const handleSubmit = async (data) => {
        const { status, message } = await supabase.from('valuations').insert([{
            valuation_key: data.id,
            address: data.address,
            bank_id: data.bank,
            branch_id: data.branch,
            valuation_contact_id: data.valuation_contact,
            site_investigator_id: data.site_investigator,
            documented_by_id: data.documented_by,
            status: data.status,
            comments: data.comments
        }]);
        if (status === 'success') {
            setMessage({ key: 'success', text: 'Valuation added successfully!' });
            fetchAndSetValuations();
        } else {
            setMessage({ key: 'error', text: message });
        }
        setIsLoading(false);
        setOpenDialog(false);
    }
    const handleBankChange = async (key, value) => {
        if (key === 'bank') {
            const branchOptions = await fetchBranchByBank(value.id);
            setFields(prevFields => prevFields.map(field =>
                field.name === 'branch' ? { ...field, options: branchOptions.data } : field
            ));
        }
    }

    return (
        <Box style={classes.mainContainer}>
            <Paper style={classes.paper}>
                <Box style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation selectedItem="Valuations" />
                    {!isLoading ? <Box style={classes.content}>
                        <Header name="Valuations" />
                        <MaintenanceBanner />

                        <Box style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '24px' }}>
                            <Button variant="contained"
                                color="primary" onClick={() => {
                                    handleNewValuation();
                                }} >Add New Valuation +</Button>
                        </Box>
                        <Paper elevation={0} style={{ border: '1px solid #e0e0e0', minWidth: '100%', width: '700px' }}>

                            <Datagrid
                                rows={values}
                                columns={columns}
                                loading={isLoading}
                                loadData={fetchAndSetValuations}
                            />

                        </Paper>

                    </Box> :
                        <div style={{ margin: 'auto', width: '250px', height: '250px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Lottie animationData={loaderData} loop={true} />
                        </div>}


                </Box>

            </Paper>
            <DynamicFormDialog open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setFormData({
                        id: '',
                        address: '',
                        bank: '',
                        branch: '',
                        valuation_contact: '',
                        site_investigator: '',
                        documented_by: '',
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
        </Box>
    )
}
export default Valuations;