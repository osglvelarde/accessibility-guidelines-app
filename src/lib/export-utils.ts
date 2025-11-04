import { GlossaryRow } from './types/glossary';

// Helper to strip HTML tags and convert markdown-like content to plain text
function stripMarkdown(text: string): string {
  if (!text) return '';
  
  // Remove markdown code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  // Remove markdown headers
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  // Remove markdown bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  // Remove markdown links
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}

// Get column headers based on category
function getColumnHeaders(category: string, columns: string[]): string[] {
  const headerMap: Record<string, string> = {
    'columnName': category === 'readability' ? 'Readability Metric' : 
                  category === 'wave' ? 'WAVE Variable' : 
                  category === 'pdfua' ? 'PDF/UA Rule' : 
                  'WCAG Success Criteria',
    'explanation': category === 'readability' ? 'Readability Description' : 
                   category === 'wave' ? 'WAVE Summary' : 
                   category === 'pdfua' ? 'PDF/UA Description' : 
                   'WCAG Description',
    'wcagSC': 'WCAG Principle',
    'wcagLevel': 'WCAG Level',
    'wcagTitle': 'WCAG Title',
    'readabilityThreshold': 'Readability Threshold',
    'readabilityFieldName': 'Readability Field Name(s)',
    'waveType': 'WAVE Type',
    'pdfuaClause': 'PDF/UA Clause',
    'pdfuaCode': 'PDF/UA Code',
    'pdfuaSeverity': 'Severity',
  };
  
  return columns.map(col => headerMap[col] || col);
}

// Get cell value for a row and column
function getCellValue(row: GlossaryRow, column: string): string {
  const value = (row as any)[column];
  if (value === null || value === undefined) return '';
  
  // Handle badges/special formatting - extract text content
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

// Export to CSV
export function exportToCSV(
  rows: GlossaryRow[],
  columns: string[],
  category: string,
  tableName: string,
  expandedRows: Map<string, GlossaryRow>
): void {
  const headers = getColumnHeaders(category, columns);
  
  // Add expanded details column if any rows are expanded
  const hasExpandedRows = expandedRows.size > 0;
  const finalHeaders = hasExpandedRows ? [...headers, 'Expanded Details'] : headers;
  
  // Convert rows to CSV format
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(finalHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
  
  // Add data rows
  rows.forEach(row => {
    const rowData = columns.map(col => {
      const value = getCellValue(row, col);
      // Escape quotes and wrap in quotes
      return `"${value.replace(/"/g, '""')}"`;
    });
    
    // Add expanded details if row is expanded
    if (hasExpandedRows && expandedRows.has(row.id)) {
      const expandedRow = expandedRows.get(row.id)!;
      let expandedContent = '';
      
      if (expandedRow.remediationGuidelines) {
        expandedContent += 'Remediation Guidelines:\n' + stripMarkdown(expandedRow.remediationGuidelines);
      }
      
      if (expandedRow.pdfuaClauseDescription) {
        expandedContent += (expandedContent ? '\n\n' : '') + 'PDF/UA Clause Description:\n' + stripMarkdown(expandedRow.pdfuaClauseDescription);
      }
      
      if (expandedRow.pdfuaFixingSuggestions) {
        expandedContent += (expandedContent ? '\n\n' : '') + 'Fixing Suggestions:\n' + stripMarkdown(expandedRow.pdfuaFixingSuggestions);
      }
      
      // Replace newlines with spaces for CSV (or use a special character)
      expandedContent = expandedContent.replace(/\n/g, ' | ').replace(/\s+/g, ' ').trim();
      rowData.push(`"${expandedContent.replace(/"/g, '""')}"`);
    } else if (hasExpandedRows) {
      rowData.push('""');
    }
    
    csvRows.push(rowData.join(','));
  });
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Sanitize filename
  const sanitizedTableName = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${sanitizedTableName}_export_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export to PDF
export async function exportToPDF(
  rows: GlossaryRow[],
  columns: string[],
  category: string,
  tableName: string,
  expandedRows: Map<string, GlossaryRow>,
  filterText?: string
): Promise<void> {
  // Dynamic import for client-side only
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);
  
  const doc = new jsPDF();
  
  // jspdf-autotable v5 exports as a default function
  // Try multiple ways to get the autoTable function
  let autoTableFunc: any;
  
  // Method 1: Check if it extends the prototype (older versions)
  if ((doc as any).autoTable && typeof (doc as any).autoTable === 'function') {
    autoTableFunc = (doc as any).autoTable;
  }
  // Method 2: Get default export (newer versions)
  else if ((autoTableModule as any).default && typeof (autoTableModule as any).default === 'function') {
    autoTableFunc = (autoTableModule as any).default;
  }
  // Method 3: Module itself is the function
  else if (typeof autoTableModule === 'function') {
    autoTableFunc = autoTableModule;
  }
  else {
    throw new Error('Could not load autoTable from jspdf-autotable. Please ensure it is properly installed.');
  }
  
  // Use autoTableFunc directly - it should be a function that takes (doc, options)
  const tableFunction = autoTableFunc;
  
  // Add title
  doc.setFontSize(16);
  doc.text(tableName, 14, 20);
  
  // Add filter info if filtered
  if (filterText) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Filtered by: "${filterText}"`, 14, 28);
    doc.text(`${rows.length} result(s)`, 14, 33);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${rows.length} total item(s)`, 14, 28);
    doc.setTextColor(0, 0, 0);
  }
  
  // Add export date
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);
  doc.setTextColor(0, 0, 0);
  
  const headers = getColumnHeaders(category, columns);
  
  // Prepare table data
  const tableData = rows.map(row => 
    columns.map(col => {
      const value = getCellValue(row, col);
      // Truncate very long values for table display
      return value.length > 100 ? value.substring(0, 100) + '...' : value;
    })
  );
  
  // Add main table - call autoTable with doc and options
  if (typeof tableFunction === 'function') {
    tableFunction(doc, {
    head: [headers],
    body: tableData,
    startY: filterText ? 38 : 33,
    styles: { 
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: filterText ? 38 : 33, left: 14, right: 14 },
    didParseCell: (data: any) => {
      // Auto-fit columns
      if (data.cell.text && data.cell.text.length > 0) {
        data.cell.styles.cellWidth = 'auto';
      }
    }
    });
  } else {
    throw new Error('autoTable function is not available');
  }
  
  // Add expanded details for expanded rows
  if (expandedRows.size > 0) {
    let yPos = (doc as any).lastAutoTable.finalY + 15;
    
    expandedRows.forEach((expandedRow, rowId) => {
      const originalRow = rows.find(r => r.id === rowId);
      if (!originalRow) return;
      
      // Check if we need a new page
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add separator
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, doc.internal.pageSize.width - 14, yPos);
      yPos += 10;
      
      // Add row title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const rowTitle = originalRow.wcagTitle || originalRow.columnName || originalRow.readabilityMetric || '';
      doc.text(rowTitle, 14, yPos);
      yPos += 8;
      
      // Add remediation guidelines
      if (expandedRow.remediationGuidelines) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Remediation Guidelines:', 14, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        const guidelines = stripMarkdown(expandedRow.remediationGuidelines);
        const splitGuidelines = doc.splitTextToSize(guidelines, doc.internal.pageSize.width - 28);
        
        splitGuidelines.forEach((line: string) => {
          if (yPos > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 14, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      
      // Add PDF/UA clause description
      if (expandedRow.pdfuaClauseDescription) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PDF/UA Clause Description:', 14, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        const description = stripMarkdown(expandedRow.pdfuaClauseDescription);
        const splitDescription = doc.splitTextToSize(description, doc.internal.pageSize.width - 28);
        
        splitDescription.forEach((line: string) => {
          if (yPos > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 14, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      
      // Add PDF/UA fixing suggestions
      if (expandedRow.pdfuaFixingSuggestions) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Fixing Suggestions:', 14, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        const suggestions = stripMarkdown(expandedRow.pdfuaFixingSuggestions);
        const splitSuggestions = doc.splitTextToSize(suggestions, doc.internal.pageSize.width - 28);
        
        splitSuggestions.forEach((line: string) => {
          if (yPos > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 14, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
      
      yPos += 10; // Space before next expanded row
    });
  }
  
  // Sanitize filename
  const sanitizedTableName = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Save PDF
  doc.save(`${sanitizedTableName}_export_${dateStr}.pdf`);
}

