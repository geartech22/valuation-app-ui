export const entryfields = [
  { id: 'date', name: 'date', label: 'Bill Date', type: 'date', required: true },
  { id: 'id', name: 'id', label: 'Bill Number', type: 'number', required: true },
  { id: 'address', name: 'address', label: 'Property Details', type: 'text', required: true },
  { id: 'bank', name: 'bank', label: 'Bank', component: 'autocomplete', options: [], required: true },
  { id: 'branch', name: 'branch', label: 'Branch', component: 'autocomplete', options: [], required: true },
  { id: 'value', name: 'value', label: 'Property Value(₹)', type: 'number', required: true },
  { id: 'fee', name: 'fee', label: 'Bill Amount(₹)', type: 'number', required: true },
  { id: 'status', name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'], required: true },
  { id: 'comments', name: 'comments', label: 'Comments', type: 'text', required: false },
];

export const pdfFields = [
  { field: 'id', headerName: 'Bill No', width: 80 },
  { field: 'address', headerName: 'Property Details', width: 300 },
  { field: 'bank', headerName: 'Bank', width: 100 },
  { field: 'branch', headerName: 'Branch', width: 250 },
  { field: 'value', headerName: 'Property Value', width: 180 },
  { field: 'fee', headerName: 'Bill Amount', width: 130 },
];

export const valuationFields = [
  { id: 'id', name: 'id', label: 'Valuation Number', type: 'number', required: true },
  { id: 'address', name: 'address', label: 'Property Details', type: 'text', required: true },
  { id: 'bank', name: 'bank', label: 'Bank', component: 'autocomplete', options: [], required: true },
  { id: 'branch', name: 'branch', label: 'Branch', component: 'autocomplete', options: [], required: true },
  { id: 'valuation_contact', name: 'valuation_contact', label: 'Valuation Contact', component: 'autocomplete', type: 'text', required: true, options: [] },
  { id: 'site_investigator', name: 'site_investigator', label: 'Site Investigator', component: 'autocomplete', required: true, options: [] },
  { id: 'documented_by', name: 'documented_by', label: 'Documented By', component: 'autocomplete', required: true, options: [] },
  { id: 'status', name: 'status', label: 'Status', component: 'autocomplete', type: "chip", options: ['In Progress', 'Dispatched', 'Completed', 'Blocked'], required: true },
  { id: 'comments', name: 'comments', label: 'Comments', type: 'text', required: false },
]

export const downloadFields = [
  { id: 'bank', name: 'bank', label: 'Bank', component: 'autocomplete', options: [] },
  { id: 'branch', name: 'branch', label: 'Branch', component: 'autocomplete', options: [] },
  { id: 'status', name: 'status', label: 'Status', component: 'autocomplete', options: ['Paid', 'Unpaid'] }
]

// create an array for permissions for admin
export const adminPermissions = ['Dashboard','Employees','Valuations','Bills'];
export const userPermissions = ['Dashboard','Valuations','Bills'];