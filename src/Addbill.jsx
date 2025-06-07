import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    Stack,
} from '@mui/material';
import Button from "./components/Button";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';



const DynamicFormDialog = ({ open, onClose, fields, onSubmit, title = "Add New Entry", values, saveText, cancelText }) => {
    const [formData, setFormData] = useState({
        ...fields.reduce((acc, field) => {
            acc[field.name] = values ? values[field.name] || '' : '';
            return acc;
        }, {})
    });

    useEffect(() => {
        if (values) {
            setFormData({
                ...fields.reduce((acc, field) => {
                    acc[field.name] = values[field.name] || '';
                    return acc;
                }, {})
            });
        }
    }, [values]);

    const handleChange = (key) => (e) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    const handleAutocompleteChange = (key) => (e, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>{title}
                <IconButton onClick={onClose} style={{ color: 'inherit' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {fields.map((field) => {
                        if (field.component === 'autocomplete') {
                            return (
                                <Autocomplete
                                    id={field.name}
                                    key={field.name}
                                    options={field.options || []}
                                    value={formData[field.name]}
                                    onChange={handleAutocompleteChange(field.name)}
                                    renderInput={(params) => <TextField {...params} label={field.label} />}
                                />
                            );
                        }
                        return (
                            <TextField
                                id={field.name}
                                key={field.name}
                                label={field.label}
                                type={field.type || 'text'}
                                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                                value={formData[field.name]}
                                onChange={handleChange(field.name)}
                            />
                        );
                    })}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">{cancelText || 'Cancel'}</Button>
                <Button onClick={handleSubmit} variant="contained">{saveText || 'Save'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DynamicFormDialog;