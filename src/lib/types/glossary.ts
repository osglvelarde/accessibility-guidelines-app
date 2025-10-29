export type GlossaryCategory = 'wcag' | 'wave' | 'pdfua' | 'readability';

export interface GlossaryRow {
  id: string;
  category: GlossaryCategory;
  
  // Common fields
  columnName: string;
  explanation: string;
  remediationGuidelines?: string;
  helpLink?: string;
  
  // WCAG specific fields
  wcagTitle?: string;
  wcagSC?: string;
  wcagLevel?: 'A' | 'AA' | 'AAA';
  wcagFullCriterionText?: string;
  tags?: string[];
  
  // WAVE specific fields
  waveType?: string;
  variable?: string;
  
  // PDF/UA specific fields
  pdfuaClause?: string;
  pdfuaCode?: string;
  pdfuaSeverity?: 'Error' | 'Warning' | 'Need Check Manual';
  pdfuaClauseDescription?: string;
  pdfuaFixingSuggestions?: string;
  
  // Readability specific fields
  readabilityMetric?: string;
  readabilityDescription?: string;
  readabilityThreshold?: string;
  readabilityFieldName?: string;
  readabilityScoreType?: string;
}

export interface TabData {
  id: string;
  name: string;
  description: string;
  rows: GlossaryRow[];
}

export interface SearchResult {
  row: GlossaryRow;
  tabName: string;
  matchedField: string;
  snippet: string;
}
