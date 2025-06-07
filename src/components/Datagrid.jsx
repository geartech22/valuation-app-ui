import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';

const paginationModel = { page: 0, pageSize: 10 };

// Map status to chip colors
const statusColors = {
    Paid: 'success',
    Unpaid: 'error',
};

export default function DataTable({ rows, columns }) {
    // Add custom renderCell for status column
    const updatedColumns = columns.map((col) => {
        if (col.field === 'status') {
            return {
                ...col,
                renderCell: (params) => {
                    const value = params.value;
                    return (
                        <Chip
                            label={value}
                            color={statusColors[value] || 'default'}
                            size="medium"

                        />
                    );
                },
            };
        }
        return col;
    });

    return (
        <Box>
        <DataGrid
            rows={rows}
            columns={updatedColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
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