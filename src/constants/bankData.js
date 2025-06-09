export const entryfields = [
  { id: 'date', name: 'date', label: 'Valuation Date', type: 'date', required: true },
  { id: 'id', name: 'id', label: 'Bill Number', type: 'number', required: true },
  { id: 'address', name: 'address', label: 'Property Details', type: 'text', required: true },
  { id: 'bank', name: 'bank', label: 'Bank', component: 'autocomplete', options: [], required: true },
  { id: 'branch', name: 'branch', label: 'Branch', component: 'autocomplete', options: [], required: true },
  { id: 'value', name: 'value', label: 'Property Value(₹)', type: 'number', required: true },
  { id: 'fee', name: 'fee', label: 'Bill Amount(₹)', type: 'number', required: true },
  { id: 'status', name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'], required: true },
];

export const pdfFields = [
  { field: 'id', headerName: 'Bill No', width: 80 },
  { field: 'address', headerName: 'Property Details', width: 300 },
  { field: 'bank', headerName: 'Bank', width: 100 },
  { field: 'branch', headerName: 'Branch', width: 250 },
  { field: 'value', headerName: 'Property Value', width: 180 },
  { field: 'fee', headerName: 'Bill Amount', width: 130 },
];