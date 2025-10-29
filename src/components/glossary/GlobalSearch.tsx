import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { TabData, SearchResult } from '@/lib/types/glossary';
import { Button } from '@/components/ui/button';

interface GlobalSearchProps {
  data: TabData[];
  onResultClick: (tabId: string, rowId: string) => void;
}

export const GlobalSearch = ({ data, onResultClick }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const searchData = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const searchResults: Map<string, SearchResult> = new Map();
    const lowerQuery = searchQuery.toLowerCase().trim();

    // Field priority: higher priority fields get ranked first
    const fieldPriority: Record<string, number> = {
      'columnName': 10,
      'id': 9,
      'wcagSC': 8,
      'pdfuaCode': 8,
      'pdfuaClause': 7,
      'waveType': 6,
      'readabilityMetric': 6,
      'variable': 5,
      'explanation': 4,
      'remediationGuidelines': 3,
      'pdfuaClauseDescription': 2,
      'pdfuaFixingSuggestions': 2,
    };

    data.forEach(tab => {
      tab.rows.forEach(row => {
        const searchableFields = [
          { field: 'columnName', value: row.columnName, priority: fieldPriority.columnName || 0 },
          { field: 'id', value: row.id, priority: fieldPriority.id || 0 },
          { field: 'explanation', value: row.explanation, priority: fieldPriority.explanation || 0 },
          { field: 'wcagSC', value: row.wcagSC || '', priority: fieldPriority.wcagSC || 0 },
          { field: 'pdfuaCode', value: row.pdfuaCode || '', priority: fieldPriority.pdfuaCode || 0 },
          { field: 'pdfuaClause', value: row.pdfuaClause || '', priority: fieldPriority.pdfuaClause || 0 },
          { field: 'variable', value: row.variable || '', priority: fieldPriority.variable || 0 },
          { field: 'remediationGuidelines', value: row.remediationGuidelines || '', priority: fieldPriority.remediationGuidelines || 0 },
          { field: 'waveType', value: row.waveType || '', priority: fieldPriority.waveType || 0 },
          { field: 'readabilityMetric', value: row.readabilityMetric || '', priority: fieldPriority.readabilityMetric || 0 },
          { field: 'pdfuaClauseDescription', value: row.pdfuaClauseDescription || '', priority: fieldPriority.pdfuaClauseDescription || 0 },
          { field: 'pdfuaFixingSuggestions', value: row.pdfuaFixingSuggestions || '', priority: fieldPriority.pdfuaFixingSuggestions || 0 },
        ];

        type BestMatch = { field: string; value: string; priority: number; snippet: string };
        let bestMatch: BestMatch | null = null;
        let bestPriority = -1;

        // Find the best match for this row
        searchableFields.forEach(({ field, value, priority }) => {
          if (!value) return;
          
          const lowerValue = value.toLowerCase();
          const index = lowerValue.indexOf(lowerQuery);
          
          if (index !== -1) {
            // Calculate match score: priority + exactness bonus
            const isExactMatch = value.toLowerCase() === lowerQuery;
            const isStartMatch = index === 0;
            const isWordBoundary = index === 0 || !/[a-z0-9]/.test(lowerValue[index - 1]);
            
            const matchScore = priority + 
              (isExactMatch ? 100 : 0) + 
              (isStartMatch ? 10 : 0) + 
              (isWordBoundary ? 5 : 0);

            if (matchScore > bestPriority) {
              const start = index;
              const end = start + lowerQuery.length;
              const snippet = value.length > 100 
                ? `${value.substring(Math.max(0, start - 30), start)}${value.substring(start, end)}${value.substring(end, Math.min(value.length, end + 30))}`
                : value;

              bestMatch = { field, value, priority: matchScore, snippet };
              bestPriority = matchScore;
            }
          }
        });

        // Only add one result per row (the best match)
        if (bestMatch !== null) {
          const resultKey = row.id;
          const match: BestMatch = bestMatch;
          
          // Store the result (will overwrite if same row appears in multiple tabs, keeping best match)
          searchResults.set(resultKey, {
            row,
            tabName: tab.name,
            matchedField: match.field,
            snippet: match.snippet
          });
        }
      });
    });

    // Convert to array, sort by relevance, and limit
    const sortedResults = Array.from(searchResults.values())
      .sort((a, b) => {
        // Sort by priority of matched field
        const priorityA = fieldPriority[a.matchedField as string] || 0;
        const priorityB = fieldPriority[b.matchedField as string] || 0;
        
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        
        // Secondary sort by column name for stability
        return a.row.columnName.localeCompare(b.row.columnName);
      })
      .slice(0, 20); // Limit to 20 results

    return sortedResults;
  }, [data]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const searchResults = searchData(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0 && query.trim() !== '');
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [query, searchData]);

  const handleResultClick = (result: SearchResult) => {
    // Map category to correct tab ID
    let tabId = result.row.category;
    if (result.row.category === 'wave') {
      tabId = 'wave';
    } else if (result.row.category === 'readability') {
      tabId = 'readability';
    }
    
    onResultClick(tabId, result.row.id);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.tabName]) {
      acc[result.tabName] = [];
    }
    acc[result.tabName].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tables (e.g., 'alt text', '1.4.3', 'contrast_low')"
          className="pl-10 pr-10"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              clearSearch();
            }
          }}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {results.length} results across {Object.keys(groupedResults).length} tables
              </h3>
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            {Object.entries(groupedResults).map(([tabName, tabResults]) => (
              <div key={tabName} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{tabName}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {tabResults.length} results
                  </span>
                </div>
                <div className="space-y-1">
                  {tabResults.map((result) => (
                    <button
                      key={`${result.tabName}-${result.row.id}-${result.matchedField}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="font-medium text-sm">{result.row.columnName}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {result.snippet}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
