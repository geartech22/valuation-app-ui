import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { NotoSansRegular } from '../assets/NotoSans-VariableFont_wdth,wght-normal'; // This should be the JS file exported from the font converter
import { pdfFields } from '../constants/bankData';
const useDownloadReport = () => {



    const downloadReport = (filename = 'valuation-report.pdf', rows = {}, data = [], setMessage) => {
        const { status, branch, bank } = rows || {};
        const unpaidRows = data?.filter(row =>
            (status !== "" ? row.status === status : true) &&
            (branch.name !== "" ? row?.branch?.name === branch?.name : true) &&
            (bank.name !== "" ? row?.bank?.name === bank?.name : true)
        );

        const doc = new jsPDF();

        // ✅ Register font
        doc.addFileToVFS('NotoSans-Regular.ttf', NotoSansRegular); // NotoSansRegular is from the .js file
        doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
        doc.setFont('NotoSans');

        if (unpaidRows?.length === 0) {
            setMessage({
                key: 'info',
                text: 'No unpaid bills found for the selected criteria.'
            });
            return;
        }

        autoTable(doc, {
            head: [pdfFields.map(col => col.headerName)],
            body: unpaidRows.map(row => pdfFields.map(col => row[col.field].name ? row[col.field].name : row[col.field])),
            startY: 15,
            margin: { top: 15, left: 10, right: 10 },
            styles: {
                font: 'NotoSans',
                fontSize: 9,
                cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
                overflow: 'linebreak',   // ensures text wraps to next line
                valign: 'middle',
            },
            headStyles: {
                fontSize: 10,
                fillColor: [34, 45, 50],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'left',
            },
            bodyStyles: {
                halign: 'left',
                font: 'NotoSans'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            columnStyles: {
                0: { cellWidth: 25 },  // Bill No
                1: { cellWidth: 45 },  // Property Details (will wrap)
                2: { cellWidth: 30 },  // Bank
                3: { cellWidth: 35 },  // Branch
                4: { cellWidth: 30 },  // Property Value(₹)
                5: { cellWidth: 25 },  // Bill Amount(₹)
            },
        });

        doc.save(filename);

        setMessage({
            key: 'success',
            text: 'Report downloaded successfully!'
        });
    };

    return [downloadReport];
};

export default useDownloadReport;