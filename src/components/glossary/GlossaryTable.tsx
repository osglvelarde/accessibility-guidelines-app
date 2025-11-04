import React, { useState, useEffect, useMemo } from 'react';
import { ExpandedRowDetails } from './ExpandedRowDetails';
import { TableRowComponent } from './TableRowComponent';
import { TableHeaderRow } from './TableHeaderRow';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import { GlossaryRow } from '@/lib/types/glossary';
import { exportToPDF, exportToCSV } from '@/lib/export-utils';

interface GlossaryTableProps {
  rows: GlossaryRow[];
  highlightedRowId?: string;
  onRowExpand: (rowId: string) => void;
  expandedRowId?: string;
  tableName: string;
  category: string;
}

export const GlossaryTable = ({
  rows,
  highlightedRowId,
  onRowExpand,
  expandedRowId,
  tableName,
  category
}: GlossaryTableProps) => {
  const [tableFilter, setTableFilter] = useState('');
  const [sortField, setSortField] = useState<string>('columnName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [tableFilter]);

  const filteredRows = rows.filter(row => {
    const matchesColumnName = row.columnName.toLowerCase().includes(tableFilter.toLowerCase());
    const matchesExplanation = row.explanation.toLowerCase().includes(tableFilter.toLowerCase());
    const matchesReadabilityMetric = row.readabilityMetric?.toLowerCase().includes(tableFilter.toLowerCase()) || false;
    const matchesReadabilityDescription = row.readabilityDescription?.toLowerCase().includes(tableFilter.toLowerCase()) || false;
    
    const matches = matchesColumnName || matchesExplanation || matchesReadabilityMetric || matchesReadabilityDescription;
    
    return matches;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aValue = (a as any)[sortField] || '';
    const bValue = (b as any)[sortField] || '';
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = sortedRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Get unique columns from the data
  const getTableColumns = () => {
    if (rows.length === 0) return [];

    const category = rows[0]?.category;
    
    if (category === 'readability') {
      return ['columnName', 'explanation', 'readabilityThreshold', 'readabilityFieldName'];
    }
    
    if (category === 'wave') {
      return ['columnName', 'explanation', 'waveType'];
    }

    if (category === 'pdfua') {
      return ['columnName', 'pdfuaClause', 'pdfuaCode', 'pdfuaSeverity'];
    }

    // WCAG columns
    const desiredColumns = ['columnName', 'wcagTitle', 'wcagLevel', 'wcagSC', 'explanation'];
    const allFields = new Set<string>();
    rows.forEach(row => {
      Object.keys(row).forEach(key => {
        if (desiredColumns.includes(key)) {
          allFields.add(key);
        }
      });
    });

    // Ensure 'explanation' (WCAG Description) is included
    if (!allFields.has('explanation')) {
      allFields.add('explanation');
    }

    // Return columns in the desired order
    const orderedFields: string[] = [];
    desiredColumns.forEach(field => {
      if (allFields.has(field)) {
        orderedFields.push(field);
      }
    });

    return orderedFields;
  };

  const columns = getTableColumns();

  const formatColumnHeader = (column: string) => {
    if (column === 'columnName') {
      const category = rows[0]?.category;
      if (category === 'readability') return 'Readability Metric';
      if (category === 'wave') return 'WAVE Variable';
      if (category === 'pdfua') return 'PDF/UA Rule';
      return 'WCAG Success Criteria';
    }
    if (column === 'explanation') {
      const category = rows[0]?.category;
      if (category === 'readability') return 'Readability Description';
      if (category === 'wave') return 'WAVE Summary';
      if (category === 'pdfua') return 'PDF/UA Description';
      return 'WCAG Description';
    }
    if (column === 'wcagSC') return 'WCAG Principle';
    if (column === 'readabilityThreshold') return 'Readability Threshold';
    if (column === 'readabilityFieldName') return 'Readability Field Name(s)';
    if (column === 'waveType') return 'WAVE Type';
    if (column === 'pdfuaClause') return 'PDF/UA Clause';
    if (column === 'pdfuaCode') return 'PDF/UA Code';
    if (column === 'pdfuaSeverity') return 'Severity';
    if (column === 'severity') return ''; // Hide severity column header
    return column.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/^Wcag/, 'WCAG');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Simple feedback - could be enhanced with toast later
    console.log(`${label} copied to clipboard`);
  };

  // Prepare expanded rows map for export
  const expandedRowsMap = useMemo(() => {
    const map = new Map<string, GlossaryRow>();
    if (expandedRowId) {
      const expandedRow = sortedRows.find(r => r.id === expandedRowId);
      if (expandedRow) {
        map.set(expandedRowId, expandedRow);
      }
    }
    return map;
  }, [expandedRowId, sortedRows]);

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      await exportToPDF(
        sortedRows, // Export all filtered/sorted rows, not just paginated
        columns,
        category,
        tableName,
        expandedRowsMap,
        tableFilter || undefined
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(
      sortedRows, // Export all filtered/sorted rows, not just paginated
      columns,
      category,
      tableName,
      expandedRowsMap
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            placeholder="Filter this table..."
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedRows.length} of {rows.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableHeaderRow
              columns={columns}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
              formatColumnHeader={formatColumnHeader}
              category={rows[0]?.category}
            />
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRowComponent
                  row={row}
                  columns={columns}
                  highlightedRowId={highlightedRowId}
                  expandedRowId={expandedRowId}
                  onRowExpand={onRowExpand}
                />
                {expandedRowId === row.id && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="p-0">
                      <ExpandedRowDetails
                        row={row}
                        copyToClipboard={copyToClipboard}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        
        {sortedRows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No matches found. Try different search terms.
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
