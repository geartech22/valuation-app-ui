import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';

// Import icons

import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BlockIcon from '@mui/icons-material/Block';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from './Button';
import CircularProgress from '@mui/material/CircularProgress';
import { GridOverlay } from '@mui/x-data-grid';

const paginationModel = { page: 0, pageSize: 10 };

// Map status to chip colors and icons
const statusColors = {
    Paid: {
        color: 'success',
        icon: <CurrencyRupeeIcon fontSize="small" />
    },
    Unpaid: {
        color: 'error',
        icon: <MoneyOffIcon fontSize="small" />
    },
    'In Progress': {
        color: 'info',
        icon: <HourglassTopIcon fontSize="small" />
    },
    Dispatched: {
        color: 'secondary',
        icon: <LocalShippingIcon fontSize="small" />
    },
    Completed: {
        color: 'success',
        icon: <AssignmentTurnedInIcon fontSize="small" />
    },
    Blocked: {
        color: 'error',
        icon: <BlockIcon fontSize="small" />
    }
};
function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <Box position="absolute" top="50%" left="50%">
                <CircularProgress />
            </Box>
        </GridOverlay>
    );
}

export default function DataTable({ rows, columns, loadData, loading }) {
    // Add custom renderCell for status column
    const updatedColumns = columns.map((col) => {
        if (col.type === 'chip') {
            return {
                ...col,
                renderCell: (params) => {
                    const value = params.value;
                    const status = statusColors[value] || {};
                    return (
                        <Chip
                            label={value}
                            color={status.color || 'default'}
                            icon={status.icon || null}
                            size="medium"
                            sx={{
                                width: '100%',
                            }}
                        />
                    );
                },
            };
        }
        else if (col.dataType === 'object') {
            return {
                ...col,
                renderCell: (params) => {
                    const value = params.value;
                    return (
                        value.name
                    );
                },
            };
        }
        else {
            return col;
        }
    })

    return (
        <Box>
            <Box display="flex" sx={{ border: '' }} >
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadData}
                    size="small"
                >Refresh
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                loading={loading}
                columns={updatedColumns}
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 15]}
                sx={{
                    border: 0,
                    fontFamily: 'Inter, Roboto, sans-serif',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9fafb',
                        color: '#1f2937',
                        fontWeight: 600,
                        fontSize: 16,
                        borderBottom: '1px solid #e5e7eb',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '600',
                        textTransform: 'capitalize',
                    },
                    '& .MuiDataGrid-cell': {
                        color: '#111827',
                        fontSize: 14,
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f3f4f6',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: '#f9fafb',
                        borderTop: '1px solid #e5e7eb',
                    },
                    '& .MuiTablePagination-root': {
                        fontSize: 13,
                        color: '#4b5563',
                    },
                }}
            />
        </Box>
    );
}