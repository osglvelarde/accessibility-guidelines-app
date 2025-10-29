import { TableRow, TableHead } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

interface TableHeaderRowProps {
  columns: string[];
  sortField: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  formatColumnHeader: (column: string) => string;
  category?: string;
}

export function TableHeaderRow({
  columns,
  sortField,
  sortOrder,
  handleSort,
  formatColumnHeader,
  category,
}: TableHeaderRowProps) {
  // Custom column names for different categories
  const waveColumnNames = ['WAVE Variable', 'WAVE Summary', 'WAVE Type'];
  const readabilityColumnNames = ['Readability Metric', 'Readability Description', 'Readability Threshold', 'Readability Field Name(s)'];
  const pdfuaColumnNames = ['PDF/UA Rule', 'PDF/UA Clause', 'PDF/UA Code', 'Severity'];

  return (
    <TableRow>
      {category === 'wave'
        ? (
          <>
            <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('columnName')}>
              <div className="flex items-center gap-2">
                {waveColumnNames[0]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'columnName' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[500px] cursor-pointer" onClick={() => handleSort('explanation')}>
              <div className="flex items-center gap-2">
                {waveColumnNames[1]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'explanation' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('waveType')}>
              <div className="flex items-center gap-2">
                {waveColumnNames[2]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'waveType' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
          </>
        )
        : category === 'readability'
        ? (
          <>
            <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort('columnName')}>
              <div className="flex items-center gap-2">
                {readabilityColumnNames[0]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'columnName' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[400px] cursor-pointer" onClick={() => handleSort('explanation')}>
              <div className="flex items-center gap-2">
                {readabilityColumnNames[1]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'explanation' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('readabilityThreshold')}>
              <div className="flex items-center gap-2">
                {readabilityColumnNames[2]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'readabilityThreshold' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort('readabilityFieldName')}>
              <div className="flex items-center gap-2">
                {readabilityColumnNames[3]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'readabilityFieldName' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
          </>
        )
        : category === 'pdfua'
        ? (
          <>
            <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort('columnName')}>
              <div className="flex items-center gap-2">
                {pdfuaColumnNames[0]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'columnName' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('pdfuaClause')}>
              <div className="flex items-center gap-2">
                {pdfuaColumnNames[1]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'pdfuaClause' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort('pdfuaCode')}>
              <div className="flex items-center gap-2">
                {pdfuaColumnNames[2]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'pdfuaCode' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="min-w-[100px] cursor-pointer" onClick={() => handleSort('pdfuaSeverity')}>
              <div className="flex items-center gap-2">
                {pdfuaColumnNames[3]}
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                {sortField === 'pdfuaSeverity' && (
                  <span className="text-xs opacity-70">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
          </>
        )
        : columns.map((column) => (
          <TableHead
            key={column}
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              column === 'explanation'
                ? 'min-w-[500px]'
                : (column === 'columnName' || column === 'wcagTitle' || column === 'wcagLevel')
                ? 'min-w-[150px]'
                : 'min-w-[120px]'
            }`}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center gap-2">
              {formatColumnHeader(column)}
              <ArrowUpDown className="h-4 w-4 opacity-50" />
              {sortField === column && (
                <span className="text-xs opacity-70">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </TableHead>
        ))}
      <TableHead className="w-[50px]" aria-label="Expand row"></TableHead>
    </TableRow>
  );
}
