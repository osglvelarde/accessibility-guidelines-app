/**
 * Utility functions for table components (Glossary, WCAG, etc.)
 */

export function autoFormatMarkdown(text: string): string {
  if (!text) return '';
  let formatted = text;

  // Insert a newline before each dash that is likely a list item (not inside a word, not after a newline)
  formatted = formatted.replace(/(\S)\s*-\s/g, '$1\n- ');

  // Ensure each dash at the start of a line is a new list item
  formatted = formatted.replace(/([^\n])(- )/g, '$1\n- ');

  // Optionally, wrap HTML code snippets in triple backticks (very basic, for <button>...</button> etc.)
  formatted = formatted.replace(/(<[a-z][\s\S]*?>[\s\S]*?<\/[a-z]+>)/gi, '\n```\n$1\n```\n');

  // Remove accidental double newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted.trim();
}

export function getSeverityColor(severity?: string): "default" | "destructive" | "secondary" | "outline" {
  switch (severity) {
    case 'Critical':
    case 'Error':
      return 'destructive';
    case 'High':
    case 'Warning':
      return 'secondary';
    case 'Moderate':
      return 'outline';
    case 'Low':
    case 'Need Check Manual':
      return 'outline';
    default:
      return 'outline';
  }
}

export function getLevelBadgeVariant(level?: string): "default" | "destructive" | "secondary" | "outline" {
  switch (level) {
    case 'A':
      return 'default'; // Blue/Primary for Level A (basic accessibility)
    case 'AA':
      return 'secondary'; // Orange/Secondary for Level AA (standard compliance)
    case 'AAA':
      return 'outline'; // Green/Accent for Level AAA (enhanced accessibility)
    default:
      return 'outline';
  }
}

export function getLevelBadgeClassName(level?: string): string {
  switch (level) {
    case 'A':
      return 'badge-level-a';
    case 'AA':
      return 'badge-level-aa';
    case 'AAA':
      return 'badge-level-aaa';
    default:
      return '';
  }
}

// Get badge variant for readability score types with appropriate colors
export function getReadabilityScoreTypeVariant(scoreType?: string): "default" | "destructive" | "secondary" | "outline" {
  switch (scoreType) {
    case 'grade_level':
      return 'destructive'; // Red for grade level (important for accessibility)
    case 'score':
      return 'default'; // Blue for general scores
    case 'score_0_100':
      return 'default'; // Blue for 0-100 scores
    case 'count':
      return 'secondary'; // Gray for counts
    case 'percent':
      return 'secondary'; // Gray for percentages
    case 'ratio':
      return 'secondary'; // Gray for ratios
    case 'duration':
      return 'outline'; // Outline for time-based metrics
    case 'level':
      return 'destructive'; // Red for CEFR/IELTS levels (important for accessibility)
    case 'category':
      return 'outline'; // Outline for categorical data
    default:
      return 'secondary';
  }
}
