import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getSeverityColor, getLevelBadgeVariant, getLevelBadgeClassName } from './tableUtils';
import { GlossaryRow } from '@/lib/types/glossary';

interface TableRowComponentProps {
  row: GlossaryRow;
  columns: string[];
  highlightedRowId?: string;
  expandedRowId?: string;
  onRowExpand: (rowId: string) => void;
}

export function TableRowComponent({
  row,
  columns,
  highlightedRowId,
  expandedRowId,
  onRowExpand,
}: TableRowComponentProps) {
  return (
    <TableRow
      key={row.id}
      className={`cursor-pointer transition-colors ${
        highlightedRowId === row.id ? 'bg-accent/50' : ''
      } hover:bg-muted/50`}
      onClick={() => onRowExpand(row.id)}
    >
      {row.category === 'wave'
        ? (
          <>
            <TableCell className="font-medium">{row.columnName}</TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.explanation || '').length > 100
                  ? `${String(row.explanation || '').substring(0, 100)}...`
                  : String(row.explanation || '')
                }
              </div>
            </TableCell>
            <TableCell>
              {row.waveType && (
                <Badge variant="outline" className="text-xs">
                  {row.waveType}
                </Badge>
              )}
            </TableCell>
          </>
        )
        : row.category === 'readability'
        ? (
          <>
            <TableCell className="font-medium">{row.columnName}</TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.explanation || '').length > 100
                  ? `${String(row.explanation || '').substring(0, 100)}...`
                  : String(row.explanation || '')
                }
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.readabilityThreshold || '')}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.readabilityFieldName || '')}
              </div>
            </TableCell>
          </>
        )
        : row.category === 'pdfua'
        ? (
          <>
            <TableCell className="font-medium">{row.columnName}</TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.pdfuaClause || '')}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {String(row.pdfuaCode || '')}
              </div>
            </TableCell>
            <TableCell>
              {row.pdfuaSeverity && (
                <Badge variant={getSeverityColor(row.pdfuaSeverity)} className="text-xs">
                  {row.pdfuaSeverity}
                </Badge>
              )}
            </TableCell>
          </>
        )
        : columns.map((column) => {
          const cellValue = (row as any)[column];
          return (
            <TableCell
              key={column}
              className={column === 'columnName' ? 'font-medium' : ''}
            >
              {(column === 'explanation' || column === 'wcagSC') ? (
                <div className="text-sm">
                  {String(cellValue || '').length > 100
                    ? `${String(cellValue || '').substring(0, 100)}...`
                    : String(cellValue || '')
                  }
                </div>
              ) : column === 'severity' ? (
                cellValue && (
                  <Badge variant={getSeverityColor(String(cellValue))} className="text-xs">
                    {String(cellValue)}
                  </Badge>
                )
              ) : column === 'wcagLevel' ? (
                cellValue && (
                  <Badge 
                    variant={getLevelBadgeVariant(String(cellValue))} 
                    className={`text-xs ${getLevelBadgeClassName(String(cellValue))}`}
                  >
                    {String(cellValue)}
                  </Badge>
                )
              ) : column === 'type' ? (
                cellValue && (
                  <Badge variant="outline" className="text-xs">
                    {String(cellValue)}
                  </Badge>
                )
              ) : column === 'variable' ? (
                cellValue && (
                  <code className="text-xs bg-muted px-1 rounded text-muted-foreground">
                    {String(cellValue)}
                  </code>
                )
              ) : (
                <div className="text-sm">
                  {String(cellValue || '')}
                </div>
              )}
            </TableCell>
          );
        })}
      <TableCell>
        <Button variant="ghost" size="sm" aria-label="Expand row details">
          {expandedRowId === row.id ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
