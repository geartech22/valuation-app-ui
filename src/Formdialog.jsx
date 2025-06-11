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
import Fade from '@mui/material/Fade';



const DynamicFormDialog = ({ open, onClose, formFields, onSubmit, title = "Add New Entry", values, saveText, cancelText, onComponentChange, disabledKey, disabledReference, onNewEntry }) => {
    const [formData, setFormData] = useState(values || []);
    useEffect(() => {
        if (values) {
            setFormData(values);
        }
    }, [values]);

    const handleChange = (key) => (e) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    const handleAutocompleteChange = (key) => (e, value) => {
        console.log("Autocomplete value changed:", key, value);

        setFormData((prev) => ({ ...prev, [key.id]: value }));
        onComponentChange?.(key.id, value);
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };


    console.log("Form Data:", formData);
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionComponent={Fade}
            transitionDuration={300}>
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>{title}
                <IconButton onClick={onClose} style={{ color: 'inherit' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={(e) => {
                e.preventDefault(); // prevent page reload
                handleSubmit();
            }}>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        {formFields?.map((field) => {
                            if (field.component === 'autocomplete') {
                                return (
                                    <Autocomplete
                                        required={field.required}
                                        id={field.name}
                                        key={field.id}
                                        freeSolo={true}
                                        options={field?.options || []}
                                        value={formData[field.name] || null}
                                        onChange={handleAutocompleteChange(field)}
                                        onInputChange={handleAutocompleteChange(field)}
                                        // disabled={(field.name === disabledKey) && formData[disabledReference]?.name === ""}
                                        getOptionLabel={(option) => {
                                            if (typeof option === 'string') return option;
                                            return option?.name || '';
                                        }}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={field.label}
                                                required={field.required}
                                            />
                                        )}
                                    />
                                );
                            }
                            return (
                                <TextField
                                    required={field.required}
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
                <DialogActions sx={{ marginRight: '2.5%' }}>
                    <Button onClick={onClose} color="inherit">{cancelText || 'Cancel'}</Button>
                    <Button type="submit" variant="contained">{saveText || 'Save'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DynamicFormDialog;