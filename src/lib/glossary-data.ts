import { WCAG_CRITERIA } from './wcag-complete';
import { GlossaryRow, TabData } from './types/glossary';

// Transform WCAG criteria to glossary format
const wcagRows: GlossaryRow[] = WCAG_CRITERIA.map((criterion) => ({
  id: `wcag-${criterion.wcagId}`,
  category: 'wcag' as const,
  columnName: criterion.wcagId,
  wcagTitle: criterion.title,
  wcagSC: criterion.principle,
  wcagLevel: criterion.level,
  explanation: criterion.howToTest,
  wcagFullCriterionText: `${criterion.title}: ${criterion.howToTest}`,
  remediationGuidelines: generateRemediationGuidelines(criterion),
  helpLink: criterion.understandingUrl,
  tags: [criterion.principle, criterion.wcagVersion]
}));

// Generate remediation guidelines based on WCAG criterion
function generateRemediationGuidelines(criterion: { wcagId: string; title: string; level: string; principle: string; howToTest: string; understandingUrl: string; wcagVersion: string }): string {
  const baseGuidelines = {
    '1.1.1': `## Non-text Content Remediation

- **Images**: Add meaningful alt text that describes the image's purpose
- **Decorative images**: Use empty alt="" or mark as presentational
- **Charts/graphs**: Provide data tables or text descriptions
- **Icons**: Use descriptive alt text or aria-label

\`\`\`html
<!-- Good: Meaningful alt text -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">

<!-- Good: Decorative image -->
<img src="decoration.png" alt="">

<!-- Good: Complex image -->
<img src="flowchart.png" alt="Process flowchart" longdesc="flowchart-description.html">
\`\`\``,

    '1.2.1': `## Audio/Video Content Remediation

- **Audio-only**: Provide text transcript
- **Video-only**: Provide audio track or text description
- **Transcripts**: Include speaker identification and sound effects

\`\`\`html
<!-- Audio with transcript -->
<audio controls>
  <source src="speech.mp3" type="audio/mpeg">
</audio>
<a href="transcript.txt">Transcript available</a>
\`\`\``,

    '1.3.1': `## Information Structure Remediation

- **Headings**: Use proper heading hierarchy (h1 → h2 → h3)
- **Lists**: Use semantic list elements (ul, ol, dl)
- **Tables**: Include proper headers and scope attributes
- **Forms**: Associate labels with form controls

\`\`\`html
<!-- Proper heading structure -->
<h1>Main Topic</h1>
  <h2>Subtopic</h2>
    <h3>Details</h3>

<!-- Proper table structure -->
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
    </tr>
  </tbody>
</table>
\`\`\``,

    '1.4.3': `## Color Contrast Remediation

- **Text**: Ensure 4.5:1 contrast ratio for normal text
- **Large text**: Ensure 3:1 contrast ratio for large text (18pt+)
- **Tools**: Use color contrast analyzers
- **Testing**: Test with color blindness simulators

\`\`\`css
/* Good contrast ratios */
.text-normal { color: #000000; background: #ffffff; } /* 21:1 */
.text-large { color: #333333; background: #ffffff; } /* 12.6:1 */
\`\`\``,

    '2.1.1': `## Keyboard Accessibility Remediation

- **Focus management**: Ensure all interactive elements are keyboard accessible
- **Tab order**: Logical tab sequence
- **Skip links**: Provide skip navigation links
- **Focus indicators**: Visible focus indicators

\`\`\`html
<!-- Skip link -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- Proper tab order -->
<button tabindex="1">First</button>
<input tabindex="2" type="text">
<button tabindex="3">Last</button>
\`\`\``,

    '2.4.1': `## Bypass Blocks Remediation

- **Skip links**: Provide skip navigation links
- **Landmarks**: Use semantic HTML5 landmarks
- **Headings**: Proper heading structure for navigation
- **ARIA**: Use ARIA landmarks when needed

\`\`\`html
<!-- Skip link -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- Landmarks -->
<nav aria-label="Main navigation">
<main id="main">
<aside aria-label="Sidebar">
\`\`\``,

    '3.1.1': `## Language Identification Remediation

- **Page language**: Set lang attribute on html element
- **Content language**: Set lang for content in different languages
- **Screen readers**: Helps with pronunciation
- **Translation tools**: Enables proper translation

\`\`\`html
<!-- Page language -->
<html lang="en">

<!-- Content in different language -->
<p lang="es">Hola, ¿cómo estás?</p>
\`\`\``,

    '4.1.1': `## Parsing Remediation

- **Valid HTML**: Ensure valid, well-formed markup
- **Nested elements**: Proper nesting of elements
- **Duplicate IDs**: No duplicate id attributes
- **Closing tags**: All elements properly closed

\`\`\`html
<!-- Valid HTML structure -->
<div>
  <p>Valid paragraph</p>
  <ul>
    <li>List item</li>
  </ul>
</div>
\`\`\``,

    '4.1.2': `## Name, Role, Value Remediation

- **Custom controls**: Ensure proper name, role, and value
- **ARIA attributes**: Use appropriate ARIA attributes
- **State changes**: Communicate state changes to assistive technology
- **Testing**: Test with screen readers

\`\`\`html
<!-- Custom button with proper ARIA -->
<button 
  role="button" 
  aria-label="Close dialog"
  aria-expanded="false"
  aria-controls="dialog">
  ×
</button>
\`\`\``
  };

  return baseGuidelines[criterion.wcagId as keyof typeof baseGuidelines] || `## ${criterion.title} Remediation

This criterion requires attention to ensure accessibility compliance. Please refer to the official WCAG documentation for detailed remediation guidance.

**Key areas to address:**
- Review the specific requirements for ${criterion.title}
- Test with assistive technologies
- Implement proper semantic markup
- Ensure programmatic access to all functionality

**Testing checklist:**
- [ ] Manual testing with screen reader
- [ ] Keyboard-only navigation
- [ ] Color contrast verification
- [ ] Semantic markup validation`;
}

// PDF/UA Rules based on ISO 14289-1 and Aspose PDF/UA Compliance Test
const pdfuaRows: GlossaryRow[] = [
  {
    id: 'pdfua-05-01',
    category: 'pdfua',
    columnName: 'PDF/UA Identifier Missing',
    pdfuaClause: '7.5',
    pdfuaCode: '05:01',
    pdfuaSeverity: 'Error',
    explanation: 'PDF/UA identifier must be present in document metadata (dc:identifier).',
    pdfuaClauseDescription: `## PDF/UA Identifier Missing (Code: 05:01)

**ISO 32000-2 Clause:** 14.8.2.2  
**ISO 14289-1 Clause:** 7.5

The PDF/UA identifier (PDF/UA-1) must be included in the document metadata to declare conformance with the PDF/UA standard. This identifier is essential for validators and assistive technologies to recognize the document as PDF/UA compliant.

**Requirements:**
- PDF/UA-1 identifier must be present in XMP metadata
- Must be included in the \`dc:identifier\` field
- Declaration must match PDF/UA-1 specification`,
    pdfuaFixingSuggestions: `## Fixing Missing PDF/UA Identifier

### Using Adobe Acrobat Pro

1. **Access Document Properties:**
   \`\`\`
   File → Properties → Advanced → XMP Metadata
   \`\`\`

2. **Add PDF/UA Identifier:**
   - In XMP metadata editor, locate \`dc:identifier\`
   - Add: \`PDF/UA-1\`
   - Or use this XMP code snippet:

\`\`\`xml
<rdf:Description>
  <dc:identifier>
    <rdf:Bag>
      <rdf:li>PDF/UA-1</rdf:li>
    </rdf:Bag>
  </dc:identifier>
</rdf:Description>
\`\`\`

### Using Command Line Tools

\`\`\`bash
# Using ExifTool
exiftool -XMP-dc:Identifier="PDF/UA-1" document.pdf

# Verify the identifier
exiftool -XMP-dc:Identifier document.pdf
\`\`\`

### Verification

After adding the identifier:
- ✅ Validate with PAC 2021 or Adobe Preflight
- ✅ Check XMP metadata using ExifTool or Acrobat
- ✅ Ensure identifier appears in document properties`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.1-tagged',
    category: 'pdfua',
    columnName: 'Document Not Marked as Tagged',
    pdfuaClause: '7.1',
    pdfuaCode: '7.1:1.1(14.8.1)',
    pdfuaSeverity: 'Error',
    explanation: 'Document must be tagged for accessibility. MarkInfo dictionary must have Marked = true.',
    pdfuaClauseDescription: `## Document Not Marked as Tagged (Code: 7.1:1.1)

**ISO 32000-2 Clause:** 14.8.2  
**ISO 14289-1 Clause:** 7.1

Tagged PDF must be used, and the document catalog must include a MarkInfo dictionary with \`Marked = true\`. This declares that the document uses tagged structure for accessibility.

**Requirements:**
- Document catalog must include MarkInfo dictionary
- MarkInfo must have \`Marked = true\`
- All content must be properly tagged`,
    pdfuaFixingSuggestions: `## Fixing Untagged Document

### Using Adobe Acrobat Pro

1. **Enable Tagging:**
   \`\`\`
   Tools → Accessibility → Add Tags to Document
   \`\`\`

2. **Verify MarkInfo:**
   - File → Properties → Advanced
   - Check "Tagged PDF" status
   - Should show "Yes"

### Using PDF Structure Verification

Check document catalog structure:

\`\`\`javascript
// PDF structure should include:
<<
  /Type /Catalog
  /MarkInfo <<
    /Marked true
  >>
  /StructTreeRoot ...
>>
\`\`\`

### Remediation Steps

1. **If document is untagged:**
   \`\`\`
   Tools → Accessibility → Add Tags to Document
   \`\`\`

2. **Review and fix tags:**
   - Open Tags panel (View → Show/Hide → Navigation Panes → Tags)
   - Verify all content is tagged
   - Fix any tagging errors

3. **Validate:**
   - Run Accessibility Check (Tools → Accessibility → Full Check)
   - Use PAC 2021 for validation`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.3-alt-missing',
    category: 'pdfua',
    columnName: 'Alternative Text Missing for Graphics',
    pdfuaClause: '7.3',
    pdfuaCode: '7.3:2',
    pdfuaSeverity: 'Error',
    explanation: 'Graphical elements must include alternative text to convey meaning to assistive technologies.',
    pdfuaClauseDescription: `## Alternative Text Missing for Graphics (Code: 7.3:2)

**ISO 32000-2 Clause:** 14.8.4.5  
**ISO 14289-1 Clause:** 7.2.3

All graphic elements must include alternative text (\`/Alt\`) that serves the same purpose as the graphic. This ensures users with visual impairments can understand the content.

**Requirements:**
- Every graphic element must have /Alt attribute
- Alt text must be meaningful and descriptive
- Decorative images should be marked as artifacts
- Complex images may need extended descriptions`,
    pdfuaFixingSuggestions: `## Fixing Missing Alternative Text

### Using Adobe Acrobat Pro

1. **Add Alt Text to Image:**
   \`\`\`
   Right-click image → Edit Object → Edit
   → Right-click in Tags panel → Properties
   → Enter text in "Alternate Text" field
   \`\`\`

2. **For Decorative Images:**
   \`\`\`
   Content panel → Select image → 
   Tags panel → Right-click → Find Tag → 
   Properties → Mark as Artifact
   \`\`\`

### Alt Text Best Practices

**Good Examples:**
\`\`\`
✅ "Bar chart showing quarterly sales: Q1 $50K, Q2 $65K, Q3 $75K, Q4 $80K"
✅ "Photo of team members working at conference table"
✅ "Logo of company name: Accessible Solutions Inc."
\`\`\`

**Bad Examples:**
\`\`\`
❌ "Chart" or "Image"
❌ "Photo" or "Picture"
❌ "Untitled-1.png"
\`\`\`

### For Complex Images

Use extended descriptions or actual text:

\`\`\`
/Alt "Simple description"
/ActualText "Detailed description of complex content"
/E (reference to separate description object)
\`\`\`

### Verification

- Test with screen reader (NVDA, JAWS, VoiceOver)
- Verify alt text appears in Tags panel
- Check that decorative images are marked as artifacts`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.4-heading-first',
    category: 'pdfua',
    columnName: 'First Heading Not on Level 1',
    pdfuaClause: '7.4.2',
    pdfuaCode: '7.4.2:1',
    pdfuaSeverity: 'Error',
    explanation: 'The logical structure must begin with a level-1 heading (H1) to reflect proper document outline.',
    pdfuaClauseDescription: `## First Heading Not on Level 1 (Code: 7.4.2:1)

**ISO 32000-2 Clause:** 14.8.4.4  
**ISO 14289-1 Clause:** 7.8.4

Document headings must begin at level 1 (<H1>) to establish a logical structure for assistive technologies. Skipping initial heading levels impairs navigability and breaks expected document hierarchy.

**Requirements:**
- First heading must be H1
- Headings should follow hierarchical order
- No skipped levels (e.g., H1 → H3)`,
    pdfuaFixingSuggestions: `## Fixing Heading Level Issues

### Correct Heading Structure

\`\`\`
Document
├── H1: Main Title
│   ├── H2: Section 1
│   │   ├── H3: Subsection 1.1
│   │   └── H3: Subsection 1.2
│   └── H2: Section 2
└── H1: Another Main Section (if applicable)
\`\`\`

### Using Adobe Acrobat Pro

1. **Fix First Heading:**
   \`\`\`
   Tags panel → Find first heading tag
   → Right-click → Properties
   → Change Type to "H1"
   \`\`\`

2. **Adjust Heading Hierarchy:**
   - Select heading text in document
   - Tags panel → Right-click → Find Tag
   - Change to appropriate level (H1, H2, H3, etc.)

3. **Verify Structure:**
   - View → Show/Hide → Navigation Panes → Bookmarks
   - Check heading hierarchy in bookmarks

### Example Structure

**Before (Incorrect):**
\`\`\`
H2: Introduction (should be H1)
  H3: Overview (should be H2)
\`\`\`

**After (Correct):**
\`\`\`
H1: Introduction
  H2: Overview
\`\`\`

### Verification

- ✅ First heading is H1
- ✅ No skipped levels
- ✅ Structure matches visual hierarchy
- ✅ Test with screen reader navigation`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.4-heading-skip',
    category: 'pdfua',
    columnName: 'Heading Level Skipped',
    pdfuaClause: '7.4.2',
    pdfuaCode: '7.4.2:2',
    pdfuaSeverity: 'Error',
    explanation: 'Numbered heading skips one or more heading levels (e.g., H1 followed by H3).',
    pdfuaClauseDescription: `## Heading Level Skipped (Code: 7.4.2:2)

**ISO 32000-2 Clause:** 14.8.4.4  
**ISO 14289-1 Clause:** 7.8.4

Heading levels must be nested logically (e.g., H1 followed by H2, not H1 followed by H3) to reflect document hierarchy accurately for users of screen readers. Skipping levels creates navigation confusion.

**Requirements:**
- Headings must follow sequential hierarchy
- H1 → H2 → H3 (no skipping)
- Maintain logical nesting`,
    pdfuaFixingSuggestions: `## Fixing Skipped Heading Levels

### Proper Heading Sequence

\`\`\`
✅ Correct: H1 → H2 → H3 → H4
❌ Incorrect: H1 → H3 (skipped H2)
❌ Incorrect: H2 → H4 (skipped H3)
\`\`\`

### Remediation Steps

1. **Identify Skipped Levels:**
   - Review Tags panel structure
   - Look for gaps in heading sequence
   - Note where levels jump (e.g., H1 → H3)

2. **Fix Heading Levels:**
   \`\`\`
   Tags panel → Select skipped heading
   → Right-click → Properties
   → Change Type to correct level
   \`\`\`

### Example Fix

**Before:**
\`\`\`
H1: Main Title
  H3: First Section (ERROR: skipped H2)
    H4: Subsection
\`\`\`

**After:**
\`\`\`
H1: Main Title
  H2: First Section
    H3: Subsection
\`\`\`

### Automated Fix

Use accessibility tools to automatically detect and fix:
- PAC 2021 can flag skipped headings
- Adobe Acrobat's Accessibility Checker identifies issues
- CommonLook PDF can auto-fix hierarchy`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.3',
    category: 'pdfua',
    columnName: 'Table Headers',
    pdfuaClause: '7.3',
    pdfuaCode: '7.3:1.3',
    pdfuaSeverity: 'Error',
    explanation: 'Data tables must have properly marked header cells.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.3 - Table Headers

Data tables in PDF documents must have properly marked header cells to ensure screen readers can understand the table structure.

**Requirements:**
- Table headers must be marked as such
- Use TH elements for header cells
- Associate data cells with headers
- Complex tables may need additional markup`,
    pdfuaFixingSuggestions: `## Fixing Table Headers

1. **Mark Header Cells:**
   - Select header cell → Properties
   - Set "Cell Type" to "Header"
   - Ensure proper scope (row/column)

2. **Table Structure:**
   - Use proper table markup
   - Associate data cells with headers
   - Test with screen reader

3. **Complex Tables:**
   - Use ID/Headers attributes
   - Provide table summary
   - Consider breaking into simpler tables`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.4',
    category: 'pdfua',
    columnName: 'Form Field Labels',
    pdfuaClause: '7.4',
    pdfuaCode: '7.4:1.4',
    pdfuaSeverity: 'Error',
    explanation: 'Form fields must have accessible names and labels.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.4 - Form Field Labels

Interactive form fields in PDF documents must have accessible names that describe their purpose to assistive technology users.

**Requirements:**
- Every form field needs a label
- Labels should be descriptive
- Use proper field names
- Associate labels with fields`,
    pdfuaFixingSuggestions: `## Fixing Form Field Labels

1. **Add Field Names:**
   - Right-click field → Properties
   - Enter descriptive name in "Name" field
   - Use clear, concise descriptions

2. **Tooltip Text:**
   - Add tooltip for additional context
   - Keep tooltips brief and helpful

3. **Testing:**
   - Test with screen reader
   - Verify field purpose is clear
   - Check tab order`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.5',
    category: 'pdfua',
    columnName: 'Language Specification',
    pdfuaClause: '7.5',
    pdfuaCode: '7.5:1.5',
    pdfuaSeverity: 'Warning',
    explanation: 'Document language must be specified for proper screen reader pronunciation.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.5 - Language Specification

PDF documents must specify the primary language to ensure screen readers use the correct pronunciation and voice.

**Requirements:**
- Set document language
- Specify language for content in different languages
- Use proper language codes
- Update when language changes`,
    pdfuaFixingSuggestions: `## Fixing Language Specification

1. **Document Language:**
   - File → Properties → Advanced
   - Set "Language" to appropriate code (e.g., "en" for English)
   - Use ISO 639-1 language codes

2. **Content Language Changes:**
   - Mark text in different languages
   - Use proper language attributes
   - Test pronunciation with screen reader

3. **Common Language Codes:**
   - English: "en"
   - Spanish: "es"
   - French: "fr"
   - German: "de"`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.8',
    category: 'pdfua',
    columnName: 'Bookmarks and Navigation',
    pdfuaClause: '7.8',
    pdfuaCode: '7.8:1.8',
    pdfuaSeverity: 'Warning',
    explanation: 'Document should have bookmarks for easy navigation.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.8 - Bookmarks and Navigation

PDF documents should include bookmarks that provide an outline of the document structure for easy navigation.

**Requirements:**
- Create bookmarks for major sections
- Use descriptive bookmark names
- Maintain logical hierarchy
- Test navigation functionality`,
    pdfuaFixingSuggestions: `## Adding Bookmarks

1. **Create Bookmarks:**
   - View → Navigation Panels → Bookmarks
   - Select text → Right-click → "Add Bookmark"
   - Use descriptive names

2. **Bookmark Structure:**
   - Match document outline
   - Use consistent naming
   - Test navigation

3. **Navigation Testing:**
   - Verify bookmarks work
   - Test with screen reader
   - Check keyboard navigation`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.6-li-parent',
    category: 'pdfua',
    columnName: 'List Item Not Child of List',
    pdfuaClause: '7.6',
    pdfuaCode: '7.6:1',
    pdfuaSeverity: 'Error',
    explanation: 'LI structure element must be a child of L (List) element.',
    pdfuaClauseDescription: `## List Item Not Child of List (Code: 7.6:1)

**ISO 32000-2 Clause:** 14.8.4.5  
**ISO 14289-1 Clause:** 7.8.5.1

According to ISO 14289-1 Clause 7.8.5.1, a list item (LI) must be contained within a list (L) structure element. This ensures that assistive technologies can properly interpret the semantics of the list structure.

**Requirements:**
- Every LI must be a direct child of an L element
- Lists must use proper L → LI nesting
- No orphaned list items`,
    pdfuaFixingSuggestions: `## Fixing List Structure

### Correct List Structure

\`\`\`
L (List)
├── LI (List Item)
│   ├── Lbl (Label/Bullet)
│   └── LBody (Content)
├── LI (List Item)
│   ├── Lbl
│   └── LBody
└── LI (List Item)
    ├── Lbl
    └── LBody
\`\`\`

### Using Adobe Acrobat Pro

1. **Fix List Structure:**
   \`\`\`
   Tags panel → Find orphaned LI
   → Right-click → Find Tag → Delete
   → Or drag LI under L parent
   \`\`\`

2. **Create Proper List:**
   - Select list content in document
   - Right-click → Tags → Create Tag → List
   - Ensure each item is tagged as List Item (LI)

3. **Verify Structure:**
   - Tags panel should show: L → LI → Lbl + LBody
   - Test with screen reader

### Example Fix

**Before (Incorrect):**
\`\`\`
P (Paragraph)  ❌ Wrong parent
  LI: First item
  LI: Second item
\`\`\`

**After (Correct):**
\`\`\`
L (List)  ✅ Correct parent
  LI: First item
    Lbl: •
    LBody: Item content
  LI: Second item
    Lbl: •
    LBody: Item content
\`\`\`

### Verification Checklist

- ✅ All LI elements have L as parent
- ✅ Each LI contains Lbl and LBody
- ✅ Structure matches visual appearance
- ✅ Screen reader announces "List with X items"`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.6-lbl-lbody',
    category: 'pdfua',
    columnName: 'List Item Missing Lbl or LBody',
    pdfuaClause: '7.6',
    pdfuaCode: '7.6:2',
    pdfuaSeverity: 'Error',
    explanation: 'Lbl and LBody structure elements must be children of LI element.',
    pdfuaClauseDescription: `## List Item Missing Lbl or LBody (Code: 7.6:2)

**ISO 32000-2 Clause:** 14.8.4.5  
**ISO 14289-1 Clause:** 7.8.5.2

As stated in Clause 7.8.5.2, each LI (list item) must include exactly one Lbl (label, e.g., bullet or number) and one LBody (the list item's content). This provides proper context and meaning to list structures for users of assistive technologies.

**Requirements:**
- Each LI must contain one Lbl element
- Each LI must contain one LBody element
- Lbl contains the bullet/number marker
- LBody contains the actual content`,
    pdfuaFixingSuggestions: `## Fixing List Item Structure

### Required Structure

Each list item (LI) must have:

\`\`\`
LI (List Item)
├── Lbl (Label)    ← Bullet, number, or marker
└── LBody (Body)   ← Actual content text
\`\`\`

### Using Adobe Acrobat Pro

1. **Add Missing Lbl or LBody:**
   \`\`\`
   Tags panel → Select LI
   → Right-click → New Tag
   → Add "Lbl" or "LBody" as needed
   \`\`\`

2. **Move Content:**
   - Select text content in LI
   - Move to LBody if it's not there
   - Ensure bullet/number is in Lbl

3. **Example Structure:**

\`\`\`
L
  LI
    Lbl: "1."  ← Number or bullet
    LBody: "First item text"  ← Content
  LI
    Lbl: "2."
    LBody: "Second item text"
\`\`\`

### For Bulleted Lists

\`\`\`
L
  LI
    Lbl: "•"  ← Bullet character
    LBody: "Item content"
\`\`\`

### Verification

- ✅ Every LI has exactly one Lbl
- ✅ Every LI has exactly one LBody
- ✅ Content is in LBody, not directly in LI
- ✅ Test with screen reader`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.1-xmp-missing',
    category: 'pdfua',
    columnName: 'XMP Metadata Missing',
    pdfuaClause: '7.1',
    pdfuaCode: '7.1:6.1',
    pdfuaSeverity: 'Error',
    explanation: 'Conforming PDF/UA files must contain XMP metadata, including identifier and conformance info.',
    pdfuaClauseDescription: `## XMP Metadata Missing (Code: 7.1:6.1)

**ISO 32000-2 Clause:** 14.8.2.3  
**ISO 14289-1 Clause:** 7.5

Conforming PDF/UA files must contain XMP metadata that conforms to the XMP schema. XMP metadata must be present and include document identification and conformance information.

**Requirements:**
- XMP metadata must be embedded in PDF
- Must include PDF/UA identifier
- Must conform to XMP schema
- Metadata must be valid XML`,
    pdfuaFixingSuggestions: `## Fixing Missing XMP Metadata

### Using Adobe Acrobat Pro

1. **Create XMP Metadata:**
   \`\`\`
   File → Properties → Advanced → XMP Metadata
   → Click "Edit" to open XMP editor
   \`\`\`

2. **Required XMP Structure:**

\`\`\`xml
<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:identifier>
        <rdf:Bag>
          <rdf:li>PDF/UA-1</rdf:li>
        </rdf:Bag>
      </dc:identifier>
      <dc:title>
        <rdf:Alt>
          <rdf:li xml:lang="x-default">Document Title</rdf:li>
        </rdf:Alt>
      </dc:title>
    </rdf:Description>
    <rdf:Description rdf:about=""
      xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/">
      <pdfuaid:part>1</pdfuaid:part>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
\`\`\`

### Using ExifTool

\`\`\`bash
# Add XMP metadata with PDF/UA identifier
exiftool -XMP-dc:Identifier="PDF/UA-1" \\
         -XMP-dc:Title="Document Title" \\
         -XMP-pdfuaid:Part="1" \\
         document.pdf
\`\`\`

### Verification

\`\`\`bash
# Check XMP metadata
exiftool -XMP:all document.pdf

# Or in Acrobat
File → Properties → Advanced → XMP Metadata
\`\`\`

### Required Fields

- ✅ \`dc:identifier\` with "PDF/UA-1"
- ✅ \`dc:title\` (document title)
- ✅ \`pdfuaid:part\` = "1"`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.7',
    category: 'pdfua',
    columnName: 'Link Accessibility',
    pdfuaClause: '7.7',
    pdfuaCode: '7.7:1.7',
    pdfuaSeverity: 'Error',
    explanation: 'Links must have accessible names that describe their purpose and destination.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.7 - Link Accessibility

Links in PDF documents must have accessible names that clearly describe their purpose and destination to assistive technology users.

**Requirements:**
- Every link must have an accessible name
- Link text should be descriptive
- Avoid generic text like "click here"
- Links should indicate when they open in new window
- Use proper Link annotation tags`,
    pdfuaFixingSuggestions: `## Fixing Link Accessibility

1. **Add Link Names:**
   - Right-click link → Properties
   - Set descriptive name in "Name" or "Alternate Text"
   - Ensure link text is meaningful

2. **Link Text Best Practices:**
   - Good: "Download accessibility guidelines"
   - Bad: "Click here" or "Link"
   - Include destination information

3. **Testing:**
   - Test with screen reader
   - Verify link purpose is clear
   - Check keyboard navigation`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.9',
    category: 'pdfua',
    columnName: 'Reading Order',
    pdfuaClause: '7.9',
    pdfuaCode: '7.9:1.9',
    pdfuaSeverity: 'Error',
    explanation: 'Document content must follow a logical reading order that matches the visual layout.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.9 - Reading Order

The reading order of PDF content must match the logical flow of the document as it appears visually. Screen readers rely on this order to present content coherently.

**Requirements:**
- Reading order must be logical
- Matches visual appearance
- No overlapping content order
- Proper sequence for multi-column layouts
- Test with screen reader`,
    pdfuaFixingSuggestions: `## Fixing Reading Order

1. **Check Reading Order:**
   - View → Tools → Accessibility → Reading Order
   - Verify order matches visual layout
   - Adjust order if needed

2. **Multi-Column Layouts:**
   - Ensure columns read in correct sequence
   - Use proper tagging structure
   - Test linear reading flow

3. **Complex Layouts:**
   - Break into logical sections
   - Use proper document structure
   - Verify with screen reader`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.10',
    category: 'pdfua',
    columnName: 'Document Metadata',
    pdfuaClause: '7.10',
    pdfuaCode: '7.10:1.10',
    pdfuaSeverity: 'Warning',
    explanation: 'Document must include proper metadata such as title, author, and subject.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.10 - Document Metadata

PDF documents should include complete and accurate metadata to help users identify and understand the document.

**Requirements:**
- Document title should be set
- Author information preferred
- Subject/keywords helpful
- Language specification required
- Creation/modification dates`,
    pdfuaFixingSuggestions: `## Adding Document Metadata

1. **Set Document Properties:**
   - File → Properties → Description
   - Enter document title
   - Add author name
   - Include subject/keywords

2. **Required Metadata:**
   - Title: Descriptive document title
   - Language: Primary language code
   - Other fields: Optional but recommended

3. **Best Practices:**
   - Use clear, descriptive titles
   - Keep metadata up to date
   - Include relevant keywords`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.11',
    category: 'pdfua',
    columnName: 'Color and Contrast',
    pdfuaClause: '7.11',
    pdfuaCode: '7.11:1.11',
    pdfuaSeverity: 'Error',
    explanation: 'Text and graphics must have sufficient color contrast. Information must not rely solely on color.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.11 - Color and Contrast

PDF documents must ensure sufficient contrast between text and background, and must not convey information solely through color.

**Requirements:**
- Text must meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Information must not depend solely on color
- Use additional indicators beyond color
- Test with color blindness simulators`,
    pdfuaFixingSuggestions: `## Fixing Color and Contrast Issues

1. **Improve Contrast:**
   - Increase difference between text and background
   - Use darker text on light backgrounds
   - Ensure 4.5:1 ratio minimum for normal text

2. **Beyond Color:**
   - Add text labels, icons, or patterns
   - Use shapes, lines, or textures
   - Don't rely only on color coding

3. **Testing:**
   - Use contrast checking tools
   - Test with color blindness simulators
   - Verify with screen reader`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.12',
    category: 'pdfua',
    columnName: 'Font Embedding',
    pdfuaClause: '7.12',
    pdfuaCode: '7.12:1.12',
    pdfuaSeverity: 'Warning',
    explanation: 'Fonts should be embedded to ensure consistent rendering and character availability.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.12 - Font Embedding

Fonts used in PDF documents should be embedded to ensure consistent rendering across different systems and assistive technologies.

**Requirements:**
- Fonts should be embedded when possible
- Ensure character encoding is correct
- Use Unicode-compatible fonts
- Verify font subsetting if needed`,
    pdfuaFixingSuggestions: `## Fixing Font Embedding

1. **Embed Fonts:**
   - File → Properties → Fonts
   - Check that fonts are embedded
   - Re-export if fonts are not embedded

2. **Font Considerations:**
   - Use standard, accessible fonts
   - Ensure Unicode support
   - Check character encoding

3. **Verification:**
   - View document properties
   - Check font list
   - Test on different systems`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.13',
    category: 'pdfua',
    columnName: 'Content Tagging',
    pdfuaClause: '7.13',
    pdfuaCode: '7.13:1.13',
    pdfuaSeverity: 'Error',
    explanation: 'All content must be properly tagged with semantic structure tags.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.13 - Content Tagging

All content in PDF documents must be properly tagged with appropriate semantic structure tags to enable assistive technologies to interpret the document correctly.

**Requirements:**
- All content must have tags
- Use appropriate semantic tags
- No untagged content in reading order
- Proper nesting and hierarchy
- Tags must match content type`,
    pdfuaFixingSuggestions: `## Fixing Content Tagging

1. **Tag All Content:**
   - View → Show/Hide → Navigation Panes → Tags
   - Verify all content is tagged
   - Auto-tag if needed (Accessibility panel)

2. **Semantic Tags:**
   - P for paragraphs
   - H1-H6 for headings
   - Table for tables
   - List for lists
   - Figure for images

3. **Verification:**
   - Check tags panel
   - Verify tag structure
   - Test with screen reader`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.14',
    category: 'pdfua',
    columnName: 'Artifacts and Decorative Content',
    pdfuaClause: '7.14',
    pdfuaCode: '7.14:1.14',
    pdfuaSeverity: 'Warning',
    explanation: 'Decorative elements must be marked as artifacts and excluded from the reading order.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.14 - Artifacts and Decorative Content

Decorative elements and page artifacts that don't convey meaningful information must be marked as artifacts and excluded from the reading order to avoid confusing screen reader users.

**Requirements:**
- Decorative images must be artifacts
- Page numbering, headers, footers can be artifacts
- Ornaments and decorative elements as artifacts
- Must not interfere with reading order
- Remove from accessibility tree`,
    pdfuaFixingSuggestions: `## Marking Content as Artifacts

1. **Mark Decorative Elements:**
   - Select decorative image/element
   - Right-click → Properties → Tag
   - Mark as "Artifact"
   - Or use Accessibility panel → "Remove from reading order"

2. **Common Artifacts:**
   - Decorative images
   - Page numbers
   - Headers/footers (if decorative)
   - Background decorations

3. **Verification:**
   - Check reading order
   - Test with screen reader
   - Ensure artifacts don't interfere`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.15',
    category: 'pdfua',
    columnName: 'Table Summary and Structure',
    pdfuaClause: '7.15',
    pdfuaCode: '7.15:1.15',
    pdfuaSeverity: 'Warning',
    explanation: 'Complex tables may require summaries and must have proper cell associations.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.15 - Table Summary and Structure

Complex tables should include summaries, and all tables must have proper cell associations to help screen reader users understand the table structure.

**Requirements:**
- Complex tables may need summaries
- Cell associations must be clear
- Headers must be properly associated
- Multi-level headers supported
- Use TH for header cells`,
    pdfuaFixingSuggestions: `## Improving Table Structure

1. **Add Table Summary:**
   - Select table → Properties
   - Add summary/description if complex
   - Explain table purpose and structure

2. **Cell Associations:**
   - Verify header cells are marked as TH
   - Check scope attributes
   - Test association with data cells

3. **Complex Tables:**
   - Consider breaking into simpler tables
   - Provide extended descriptions
   - Use proper ID/Headers markup`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.16',
    category: 'pdfua',
    columnName: 'Form Field Validation',
    pdfuaClause: '7.16',
    pdfuaCode: '7.16:1.16',
    pdfuaSeverity: 'Warning',
    explanation: 'Form fields should have validation messages that are accessible to assistive technologies.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.16 - Form Field Validation

Interactive form fields should provide accessible validation messages and error handling that can be perceived by assistive technology users.

**Requirements:**
- Validation messages must be accessible
- Error messages should be clear
- Required fields must be indicated
- Use proper form field types
- Provide helpful error guidance`,
    pdfuaFixingSuggestions: `## Improving Form Field Validation

1. **Accessible Validation:**
   - Ensure error messages are readable
   - Use tooltip or text for errors
   - Mark required fields clearly

2. **Field Types:**
   - Use appropriate field types
   - Add helpful descriptions
   - Provide format examples if needed

3. **Error Handling:**
   - Clear error messages
   - Indicate what needs fixing
   - Test with screen reader`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.17',
    category: 'pdfua',
    columnName: 'Document Security',
    pdfuaClause: '7.17',
    pdfuaCode: '7.17:1.17',
    pdfuaSeverity: 'Warning',
    explanation: 'Document security settings must not interfere with assistive technology access.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.17 - Document Security

PDF document security settings must not prevent assistive technologies from accessing the document content. Content extraction and text access should be allowed.

**Requirements:**
- Security settings must allow text extraction
- Assitive technology access must not be blocked
- No restrictions that prevent screen reader access
- Check security settings carefully`,
    pdfuaFixingSuggestions: `## Adjusting Document Security

1. **Review Security Settings:**
   - File → Properties → Security
   - Ensure text extraction is allowed
   - Allow content copying

2. **Accessibility Considerations:**
   - Screen readers need text access
   - Don't block content extraction
   - Test with assistive technology

3. **Verification:**
   - Try selecting text
   - Test with screen reader
   - Verify accessibility is not blocked`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  },
  {
    id: 'pdfua-7.18',
    category: 'pdfua',
    columnName: 'Nested Structure',
    pdfuaClause: '7.18',
    pdfuaCode: '7.18:1.18',
    pdfuaSeverity: 'Error',
    explanation: 'Document structure must be properly nested with correct parent-child relationships.',
    pdfuaClauseDescription: `## PDF/UA Clause 7.18 - Nested Structure

PDF document structure must have proper nesting with correct parent-child relationships between tags. Elements must be logically organized in the structure tree.

**Requirements:**
- Proper nesting of elements
- Correct parent-child relationships
- Logical structure hierarchy
- No orphaned elements
- Structure matches content layout`,
    pdfuaFixingSuggestions: `## Fixing Structure Nesting

1. **Check Tag Structure:**
   - View → Tags panel
   - Verify proper nesting
   - Check parent-child relationships

2. **Fix Nesting Issues:**
   - Drag tags to correct positions
   - Ensure logical hierarchy
   - Remove orphaned elements

3. **Verification:**
   - Review structure tree
   - Test with screen reader
   - Verify logical reading flow`,
    helpLink: 'https://www.iso.org/standard/64599.html'
  }
];

// WAVE Rules based on WebAIM's WAVE tool documentation
const waveRows: GlossaryRow[] = [
  {
    id: 'wave-alt-missing',
    category: 'wave',
    columnName: 'alt_missing',
    waveType: 'Error',
    explanation: 'Image alternative text is not present. Each image must have an alt attribute.',
    remediationGuidelines: `## Missing Alternative Text (alt_missing)

### What It Means

Image alternative text is not present.

### Why It Matters

Each image must have an alt attribute. Without alternative text, the content of an image will not be available to screen reader users or when the image is unavailable.

### What To Do

Add an alt attribute to the image. The attribute value should accurately and succinctly present the content and function of the image. If the content of the image is conveyed in the context or surroundings of the image, or if the image does not convey content or have a function, it should be given empty/null alternative text (\`alt=""\`).

### Examples

\`\`\`html
<!-- Informative image with descriptive alt text -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">
<img src="logo.png" alt="Accessible Solutions Inc. Logo">

<!-- Decorative image with empty alt -->
<img src="decoration.png" alt="" role="presentation">

<!-- Complex image with extended description -->
<img src="flowchart.png" alt="Process flowchart showing user registration steps">
\`\`\`

### Best Practices

- **Informative images**: Provide descriptive alt text that conveys content and purpose
- **Decorative images**: Use \`alt=""\` and optionally \`role="presentation"\`
- **Functional images** (buttons, links): Describe the function (e.g., "Submit form" not "Submit button")
- **Complex images**: Provide detailed description; consider longdesc or nearby text

### The Algorithm

An image does not have an alt attribute.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-link-missing',
    category: 'wave',
    columnName: 'alt_link_missing',
    waveType: 'Error',
    explanation: 'An image without alternative text results in an empty link.',
    remediationGuidelines: `## Linked Image Missing Alternative Text (alt_link_missing)

### What It Means

An image without alternative text results in an empty link.

### Why It Matters

Images that are the only thing within a link must have descriptive alternative text. If an image is within a link that contains no text and that image does not provide alternative text, a screen reader has no content to present to the user regarding the function of the link.

### What To Do

Add appropriate alternative text that presents the content of the image and/or the function of the link.

### Examples

\`\`\`html
<!-- Good: Image with descriptive alt text in link -->
<a href="/products">
  <img src="product-thumb.jpg" alt="View our product catalog">
</a>

<!-- Good: Image and text in same link (image can have empty alt) -->
<a href="/contact">
  <img src="envelope-icon.png" alt="">
  Contact Us
</a>

<!-- Good: Descriptive alt describing link function -->
<a href="/download">
  <img src="download-icon.png" alt="Download accessibility guidelines PDF">
</a>
\`\`\`

### Best Practices

- Describe the **link destination or function**, not just the image
- If link contains both image and text, image can have \`alt=""\`
- Alt text for linked images should include link purpose
- Avoid generic text like "link" or "click here"

### The Algorithm

An image without alternative text (missing alt attribute or an alt value that is null/empty or only space characters) or that is hidden is within a link that does not contain text or an image with alternative text.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-spacer-missing',
    category: 'wave',
    columnName: 'alt_spacer_missing',
    waveType: 'Error',
    explanation: 'A layout spacer image (which should have null/empty alternative text) does not have an alt attribute.',
    remediationGuidelines: `## Spacer Image Missing Alternative Text (alt_spacer_missing)

### What It Means

A layout spacer image (which should have null/empty alternative text) does not have an alt attribute.

### Why It Matters

Spacer images are used to maintain layout. They do not convey content and should be given null/empty alternative text (\`alt=""\`) so they are not presented to users and are ignored by screen readers.

### What To Do

If the image is a spacer image, give the image null/empty alternative text (\`alt=""\`). Alternatively, consider using CSS instead of spacer images to control positioning and layout.

### Examples

\`\`\`html
<!-- Spacer image with empty alt -->
<img src="spacer.gif" alt="" width="1" height="1">

<!-- Better: Use CSS instead -->
<div class="spacer" style="width: 1px; height: 1px;"></div>

/* CSS approach */
.spacer {
  width: 10px;
  height: 10px;
  display: inline-block;
}
\`\`\`

### Modern Approach

\`\`\`css
/* Replace spacer images with CSS */
.layout-spacing {
  margin: 10px;
  padding: 10px;
}

/* Use flexbox or grid instead */
.container {
  display: flex;
  gap: 20px;
}
\`\`\`

### The Algorithm

An image is missing an alt attribute and has a width or height of 3 pixels or less or has a file name starting with "spacer.*", "space.*", or "blank.*".

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-input-missing',
    category: 'wave',
    columnName: 'alt_input_missing',
    waveType: 'Error',
    explanation: 'Alternative text is not present for a form image button.',
    remediationGuidelines: `## Image Button Missing Alternative Text (alt_input_missing)

### What It Means

Alternative text is not present for a form image button.

### Why It Matters

Image buttons provide important functionality that must be presented in alternative text. Without alternative text, the function of an image button is not made available to screen reader users or when images are disabled or unavailable.

### What To Do

Add appropriate alternative text that presents the function of the image button.

### Examples

\`\`\`html
<!-- Image button with descriptive alt -->
<input type="image" src="search-button.gif" alt="Search">

<!-- Image button with function description -->
<input type="image" src="submit-icon.png" alt="Submit form">

<!-- Image button with clear action -->
<input type="image" src="save-button.jpg" alt="Save document">
\`\`\`

### Best Practices

- Describe the **button function**, not appearance
- Use action verbs (Submit, Search, Save, Delete)
- Be specific about what action occurs
- Example: "Search products" not "Search button image"

### The Algorithm

An image button (\`<input type="image">\`) does not have an alt attribute or has an alt value that is null/empty (\`alt=""\`) or only space characters.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-area-missing',
    category: 'wave',
    columnName: 'alt_area_missing',
    waveType: 'Error',
    explanation: 'Alternative text is not present for an image map area (hot spot).',
    remediationGuidelines: `## Image Map Area Missing Alternative Text (alt_area_missing)

### What It Means

Alternative text is not present for an image map area (hot spot).

### Why It Matters

Image map areas or clickable hot spots provide important functionality that must be provided in alternative text. Without alternative text, the function of the area is not made available to screen reader users or when images are unavailable.

### What To Do

Add a descriptive alt attribute value to each area element. Additionally, ensure that the area elements are listed in the code in a logical, intuitive order (e.g., matching the visual order, alphabetically, etc.).

### Examples

\`\`\`html
<!-- Image map with properly labeled areas -->
<img src="us-map.jpg" alt="United States map" usemap="#usamap">
<map name="usamap">
  <area shape="rect" coords="0,0,100,50" href="/northeast" alt="Northeast region">
  <area shape="rect" coords="100,0,200,50" href="/south" alt="South region">
  <area shape="rect" coords="0,50,100,100" href="/west" alt="West region">
</map>

<!-- Ensure logical order matches visual order -->
\`\`\`

### Best Practices

- Describe the **function or destination** of each hot spot
- List areas in logical order (visual order, left-to-right, top-to-bottom)
- Ensure main image has appropriate alt (usually empty if areas convey all content)

### The Algorithm

An area element does not have the alt attribute or has an alt value that is null/empty (\`alt=""\`) or only space characters.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-map-missing',
    category: 'wave',
    columnName: 'alt_map_missing',
    waveType: 'Error',
    explanation: 'An image that has hot spots does not have an alt attribute.',
    remediationGuidelines: `## Image Map Missing Alternative Text (alt_map_missing)

### What It Means

An image that has hot spots does not have an alt attribute.

### Why It Matters

Any content or function of an image that uses an image map (hot spots) and does not have an alt attribute will not be available to screen reader users or if the image is unavailable.

### What To Do

Add an alt attribute to the image. Ensure the alt attribute value for the image map image is appropriate. The alternative text is typically null/empty (\`alt=""\`), unless the image conveys content not conveyed in the hot spot areas.

### Examples

\`\`\`html
<!-- Image map with empty alt (content in areas) -->
<img src="navigation-map.jpg" alt="" usemap="#navmap">
<map name="navmap">
  <area shape="rect" coords="0,0,100,50" href="/home" alt="Go to homepage">
  <area shape="rect" coords="100,0,200,50" href="/about" alt="About us">
</map>

<!-- Image map with descriptive alt (additional content) -->
<img src="us-map.jpg" alt="Map of the United States" usemap="#usamap">
<map name="usamap">
  <area shape="rect" coords="0,0,100,50" href="/state/ny" alt="New York">
</map>
\`\`\`

### Best Practices

- Use \`alt=""\` if all content is in area elements
- Provide descriptive alt if image conveys additional information
- Example: "Map of the United States" for a geographic map

### The Algorithm

An image element has the usemap attribute and no alt attribute.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-link-empty',
    category: 'wave',
    columnName: 'link_empty',
    waveType: 'Error',
    explanation: 'A link contains no text.',
    remediationGuidelines: `## Empty Link (link_empty)

### What It Means

A link contains no text.

### Why It Matters

If a link contains no text, the function or purpose of the link will not be presented to the user. This can introduce confusion for keyboard and screen reader users.

### What To Do

Remove the empty link or provide text within the link that describes the functionality and/or target of that link.

### Examples

\`\`\`html
<!-- Add descriptive text content -->
<a href="/contact">Contact Us</a>
<a href="/help">Help and Support</a>

<!-- Icon-only link with aria-label -->
<a href="/help" aria-label="Help and Support">
  <span class="icon-help" aria-hidden="true"></span>
</a>

<!-- Image link with alt text -->
<a href="/products">
  <img src="products-icon.png" alt="View our products">
</a>

<!-- Link with visible and accessible text -->
<a href="/download">
  <span class="icon-download" aria-hidden="true"></span>
  Download PDF
</a>
\`\`\`

### Best Practices

- Provide visible text when possible
- Use \`aria-label\` for icon-only links
- Ensure alt text for linked images describes link purpose
- Avoid links with only decorative images

### The Algorithm

An anchor element has an href attribute, but contains no text (or only spaces) and no images with alternative text.

### Relevant WCAG 2.2 Success Criteria

- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-label-missing',
    category: 'wave',
    columnName: 'label_missing',
    waveType: 'Error',
    explanation: 'A form control does not have a corresponding label.',
    remediationGuidelines: `## Missing Form Label (label_missing)

### What It Means

A form control does not have a corresponding label.

### Why It Matters

If a form control does not have a properly associated text label, the function or purpose of that form control may not be presented to screen reader users. Form labels also provide visible descriptions and larger clickable targets for form controls.

### What To Do

If a text label for a form control is visible, use the \`<label>\` element to associate it with its respective form control. If there is no visible label, either provide an associated label, add a descriptive title attribute to the form control, or reference the label(s) using \`aria-labelledby\`. Labels are not required for image, submit, reset, button, or hidden form controls.

### Examples

\`\`\`html
<!-- Proper label association with 'for' attribute -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Label wrapping form control -->
<label>
  Email Address
  <input type="email" name="email">
</label>

<!-- Using aria-label -->
<input type="text" aria-label="Search products" placeholder="Search...">

<!-- Using aria-labelledby -->
<span id="email-label">Email Address</span>
<input type="email" aria-labelledby="email-label" name="email">

<!-- Using title (less preferred) -->
<input type="text" title="Enter your email address" name="email">
\`\`\`

### Best Practices

- **Preferred**: Use \`<label>\` with \`for\` attribute or wrapping
- **Fallback**: Use \`aria-label\` or \`aria-labelledby\`
- **Avoid**: Relying only on \`placeholder\` or \`title\`
- Ensure label text is descriptive and matches input purpose

### The Algorithm

An \`<input>\` (except types of image, submit, reset, button, or hidden), \`<select>\`, or \`<textarea>\` does not have a properly associated label. A properly associated label is:
- a non-hidden \`<label>\` element with a for attribute value that is equal to the id of a unique form control
- a \`<label>\` element that surrounds the form control
- a non-empty title attribute, or
- a non-empty \`aria-labelledby\` attribute

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-heading-missing',
    category: 'wave',
    columnName: 'heading_missing',
    waveType: 'Alert',
    explanation: 'The page has no headings.',
    remediationGuidelines: `## No Heading Structure (heading_missing)

### What It Means

The page has no headings.

### Why It Matters

Headings (\`<h1>\`-\`<h6>\`) provide important document structure, outlines, and navigation functionality to assistive technology users.

### What To Do

Provide a clear, consistent heading structure, generally one \`<h1>\` and sub-headings as appropriate. Except for very simple pages, most web pages should have a heading structure.

### Examples

\`\`\`html
<!-- Proper heading hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
      <h4>Details</h4>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>

<!-- Logical document outline -->
<h1>Accessibility Guidelines</h1>
  <h2>Introduction</h2>
  <h2>WCAG Requirements</h2>
    <h3>Level A</h3>
    <h3>Level AA</h3>
  <h2>Implementation</h2>
\`\`\`

### Best Practices

- Use one \`<h1>\` per page (main title)
- Maintain logical hierarchy (don't skip levels)
- Use headings to structure content, not for styling
- Headings should describe the content that follows

### The Algorithm

No \`<h1>\`-\`<h6>\` elements are present in the page.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-h1-missing',
    category: 'wave',
    columnName: 'h1_missing',
    waveType: 'Alert',
    explanation: 'A page does not have a first level heading.',
    remediationGuidelines: `## Missing First Level Heading (h1_missing)

### What It Means

A page does not have a first level heading.

### Why It Matters

Headings facilitate page navigation for users of many assistive technologies. They also provide semantic and visual meaning and structure to the document. A first level heading (\`<h1>\`) should be present on nearly all pages. It should contain the most important heading on the page (generally the document title).

### What To Do

If the page presents a main heading, place it within an \`<h1>\` element. Add other sub-headings as necessary.

### Examples

\`\`\`html
<!-- Single main heading -->
<h1>Welcome to Our Website</h1>
  <h2>About Us</h2>
  <h2>Our Services</h2>

<!-- Multiple h1s can be used per sectioning elements -->
<article>
  <h1>Main Article Title</h1>
</article>
<aside>
  <h1>Related Content</h1>
</aside>
\`\`\`

### Best Practices

- Use \`<h1>\` for the most important heading (page title)
- Only one \`<h1>\` per page (unless using HTML5 sectioning)
- \`<h1>\` should describe the page purpose
- Follow with \`<h2>\`, \`<h3>\`, etc. for subsections

### The Algorithm

A page does not have an \`<h1>\` element.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-contrast',
    category: 'wave',
    columnName: 'contrast',
    waveType: 'Error',
    explanation: 'Very low contrast between text and background colors.',
    remediationGuidelines: `## Very Low Contrast (contrast)

### What It Means

Very low contrast between text and background colors.

### Why It Matters

Adequate contrast of text is necessary for all users, especially users with low vision.

### What To Do

Increase the contrast between the foreground (text) color and the background color. Large text (larger than 18 point or 14 point bold) does not require as much contrast as smaller text.

### Examples

\`\`\`css
/* Good contrast ratios - Normal text (4.5:1 minimum) */
.good-contrast {
  color: #000000;        /* Black */
  background: #ffffff;   /* White - Ratio: 21:1 */
}

.good-contrast-alt {
  color: #333333;        /* Dark gray */
  background: #ffffff;   /* White - Ratio: 12.6:1 */
}

/* Large text (3:1 minimum) */
.large-text {
  color: #666666;        /* Medium gray */
  background: #ffffff;   /* White - Ratio: 5.74:1 */
  font-size: 18pt;       /* or 14pt bold */
}

/* Avoid low contrast */
.bad-contrast {
  color: #cccccc;        /* Light gray */
  background: #ffffff;   /* White - Ratio: 1.6:1 ❌ */
}
\`\`\`

### Contrast Requirements

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text

### Tools

- WebAIM Contrast Checker
- Colour Contrast Analyser
- Browser DevTools Accessibility panel

### The Algorithm

Text is present that has a contrast ratio less than 4.5:1, or large text (larger than 18 point or 14 point bold) has a contrast ratio less than 3:1.

### Relevant WCAG 2.2 Success Criteria

- **1.4.3 Contrast (Minimum)** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-language-missing',
    category: 'wave',
    columnName: 'language_missing',
    waveType: 'Error',
    explanation: 'The language of the document is not identified or a lang attribute value is invalid.',
    remediationGuidelines: `## Language Missing or Invalid (language_missing)

### What It Means

The language of the document is not identified or a lang attribute value is invalid.

### Why It Matters

Identifying the language of the page or page elements allows screen readers to read the content in the appropriate language. It also facilitates automatic translation of content.

### What To Do

Identify the document language using the \`<html lang>\` attribute with a valid value. Ensure that all lang attribute values are valid.

### Examples

\`\`\`html
<!-- Document language -->
<html lang="en">
<head>
  <title>My Page</title>
</head>
<body>
  <!-- Content in different language -->
  <p lang="es">Hola, ¿cómo estás?</p>
  
  <!-- Back to main language -->
  <p>This is English text again.</p>
</body>
</html>

<!-- Valid language codes -->
<html lang="en">      <!-- English -->
<html lang="en-US">   <!-- US English -->
<html lang="es">      <!-- Spanish -->
<html lang="fr">      <!-- French -->
<html lang="de">      <!-- German -->
\`\`\`

### Language Code Format

- Use ISO 639-1 two-letter codes (e.g., "en", "es", "fr")
- Can include region code (e.g., "en-US", "en-GB", "es-MX")
- Must be valid BCP 47 language tag

### Best Practices

- Always set \`lang\` on \`<html>\` element
- Use \`lang\` attribute on elements with different languages
- Use proper ISO language codes
- Update lang when language changes

### The Algorithm

The \`<html lang>\` attribute is missing or is empty, or a lang attribute value is not a valid language identifier.

### Relevant WCAG 2.2 Success Criteria

- **3.1.1 Language of Page** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-title-invalid',
    category: 'wave',
    columnName: 'title_invalid',
    waveType: 'Error',
    explanation: 'The page title is missing or not descriptive.',
    remediationGuidelines: `## Missing or Uninformative Page Title (title_invalid)

### What It Means

The page title is missing or not descriptive.

### Why It Matters

A descriptive title helps users understand a page's purpose or content. Without a proper title, many users (especially those using screen readers or other assistive technology) may have difficulty orienting themselves to the page.

### What To Do

Add a brief, descriptive page title.

### Examples

\`\`\`html
<!-- Descriptive page title -->
<title>Accessibility Guidelines - WCAG 2.2 Compliance Guide</title>

<!-- Good: Includes site and page context -->
<title>About Us - Accessible Solutions Inc.</title>

<!-- Good: Specific and descriptive -->
<title>Contact Us - Customer Support | OurCompany</title>

<!-- Bad: Generic or missing -->
<title>Untitled Document</title>
<title>Page 1</title>
<title></title>
\`\`\`

### Best Practices

- **Be specific**: Describe the page content
- **Be concise**: 50-60 characters recommended
- **Include context**: Site name and page name
- **Use title hierarchy**: Consistent format across site
- **Avoid generic**: No "Untitled" or "Page 1"

### Title Structure Examples

\`\`\`
✅ Good: "Products - Electronics | TechStore"
✅ Good: "Contact Us - Accessible Solutions"
✅ Bad: "Untitled"
✅ Bad: "Home"
\`\`\`

### The Algorithm

The page title is missing, empty, contains only whitespace characters, or begins with "untitled".

### Relevant WCAG 2.2 Success Criteria

- **2.4.2 Page Titled** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-label-empty',
    category: 'wave',
    columnName: 'label_empty',
    waveType: 'Error',
    explanation: 'A form label is present, but does not contain any content.',
    remediationGuidelines: `## Empty Form Label (label_empty)

### What It Means

A form label is present, but does not contain any content.

### Why It Matters

A \`<label>\` element that is associated to a form control but does not contain text will not present any information about the form control to the user.

### What To Do

Ensure that the form label contains text that describes the function of the associated form control. Labels are not required for image, submit, reset, button, or hidden form controls. If a label is not necessary visually, a descriptive title attribute may be added to the form control.

### Examples

\`\`\`html
<!-- Good: Label with text -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Bad: Empty label -->
<label for="email"></label>
<input type="email" id="email" name="email">

<!-- Fix: Add text to label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Alternative: Use aria-label if no visible label -->
<input type="email" aria-label="Email Address" name="email">
\`\`\`

### Best Practices

- Labels must contain descriptive text
- Text should clearly describe the input purpose
- If label text isn't visible, use aria-label instead
- Remove empty labels that aren't needed

### The Algorithm

A form label is present and associated with an existing form control (using for/id or surrounds the form control), but does not contain any text or images with alternative text.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-label-multiple',
    category: 'wave',
    columnName: 'label_multiple',
    waveType: 'Error',
    explanation: 'A form control has more than one label associated with it.',
    remediationGuidelines: `## Multiple Form Labels (label_multiple)

### What It Means

A form control has more than one label associated with it.

### Why It Matters

A form control should have at most one associated label element. If more than one label element is associated to the control, assistive technology may not read the appropriate label.

### What To Do

Ensure that at most one label element is associated to the form control. If multiple form labels are necessary, use \`aria-labelledby\`.

### Examples

\`\`\`html
<!-- Bad: Multiple labels for same control -->
<label for="email">Email</label>
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Good: Single label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Good: Multiple labels using aria-labelledby -->
<span id="email-label">Email</span>
<span id="email-required">(Required)</span>
<input type="email" aria-labelledby="email-label email-required" name="email">

<!-- Good: Single wrapping label -->
<label>
  Email Address
  <input type="email" name="email">
</label>
\`\`\`

### Best Practices

- Use only one \`<label>\` element per form control
- Use \`aria-labelledby\` to reference multiple text elements
- Combine label text when multiple labels exist
- Remove duplicate labels

### The Algorithm

Two or more \`<label>\`s are associated to a single \`<input>\` (except types of image, submit, reset, button, or hidden), \`<select>\`, or \`<textarea>\`.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-suspicious',
    category: 'wave',
    columnName: 'alt_suspicious',
    waveType: 'Warning',
    explanation: 'Alternative text is likely insufficient or contains extraneous information.',
    remediationGuidelines: `## Suspicious Alternative Text (alt_suspicious)

### What It Means

Alternative text is likely insufficient or contains extraneous information.

### Why It Matters

If the alternative text for an image does not provide the same content or information conveyed by the image, that content will not be available to screen reader users and when images are unavailable.

### What To Do

Ensure that the alternative text for the image or image input provides a succinct, yet equivalent alternative to the content and function of the image. Screen readers and browser presentation inform the user that the object is an image, so alternative text of "image of..." (and similar) should be avoided. If the image does not convey content or if the content is presented in nearby text (e.g., a caption), null/empty alternative text (\`alt=""\`) is appropriate.

### Examples

\`\`\`html
<!-- Bad: Contains "image of" or file name -->
<img src="chart.png" alt="image of chart">
<img src="photo.jpg" alt="photo.gif">
<img src="logo.png" alt="graphic">

<!-- Bad: Generic terms -->
<img src="chart.png" alt="image">
<img src="logo.png" alt="logo">

<!-- Good: Descriptive without redundant words -->
<img src="chart.png" alt="Quarterly sales chart showing 25% growth">
<img src="logo.png" alt="Accessible Solutions Inc.">
<img src="photo.jpg" alt="Team members working at conference table">

<!-- Good: Empty alt for decorative images -->
<img src="decoration.png" alt="">
\`\`\`

### Terms to Avoid

\`\`\`
❌ "image of", "graphic of", "bullet"
❌ "image", "graphic", "photo", "photograph"
❌ "drawing", "painting", "artwork"
❌ "logo", "button", "arrow"
❌ "more", "spacer", "blank"
❌ "chart", "table", "diagram", "graph"
❌ File names (e.g., "photo.gif")
\`\`\`

### The Algorithm

The alt text value of an image or image button begins with "graphic of", "bullet", or "image of"; ends with "image" or "graphic"; contains only space characters (\`alt=" "\`); is an image file name; or is one of the prohibited generic terms.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-redundant',
    category: 'wave',
    columnName: 'alt_redundant',
    waveType: 'Warning',
    explanation: 'The alternative text for an image is the same as nearby or adjacent text.',
    remediationGuidelines: `## Redundant Alternative Text (alt_redundant)

### What It Means

The alternative text for an image is the same as nearby or adjacent text.

### Why It Matters

Alternative text that is the same as nearby or adjacent text will be presented multiple times to screen readers or when images are unavailable.

### What To Do

Change either the alternative text or the adjacent text to eliminate the redundancy. In most cases, you can give the image empty/null alternative text (\`alt=""\`) because the content of the image is already provided in context through text. Linked images may often be combined with the adjacent text into one link, in which case the image may be given null/empty alternative text (\`alt=""\`).

### Examples

\`\`\`html
<!-- Bad: Redundant alt and text -->
<img src="logo.png" alt="Company Logo">
<h1>Company Logo</h1>

<!-- Good: Empty alt when text provides context -->
<img src="logo.png" alt="">
<h1>Company Logo</h1>

<!-- Bad: Alt same as caption -->
<img src="chart.png" alt="Sales increased 25%">
<p>Sales increased 25%</p>

<!-- Good: Image with empty alt, caption provides description -->
<img src="chart.png" alt="">
<figcaption>Sales increased 25% from Q1 to Q2</figcaption>

<!-- Bad: Linked image with redundant text -->
<a href="/products">
  <img src="product.jpg" alt="View Products">
  View Products
</a>

<!-- Good: Combine into one link, image has empty alt -->
<a href="/products">
  <img src="product.jpg" alt="">
  View Products
</a>
\`\`\`

### Best Practices

- If adjacent text describes the image, use \`alt=""\`
- For captions or nearby text, empty alt is appropriate
- Linked images with text can have empty alt
- Remove redundancy to avoid duplicate announcements

### The Algorithm

The alternative text is the same as text that is within 15 characters of the image.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-heading-empty',
    category: 'wave',
    columnName: 'heading_empty',
    waveType: 'Error',
    explanation: 'A heading contains no content.',
    remediationGuidelines: `## Empty Heading (heading_empty)

### What It Means

A heading contains no content.

### Why It Matters

Some users, especially keyboard and screen reader users, often navigate by heading elements. An empty heading will present no information and may introduce confusion.

### What To Do

Ensure that all headings contain informative content.

### Examples

\`\`\`html
<!-- Bad: Empty heading -->
<h2></h2>
<h3>   </h3> <!-- Only spaces -->

<!-- Good: Heading with content -->
<h2>Introduction to Accessibility</h2>
<h3>WCAG Guidelines</h3>

<!-- Good: Heading with text and image -->
<h2>
  <img src="icon.png" alt="">
  Section Title
</h2>

<!-- If heading not needed, remove it -->
<!-- Don't use headings for spacing -->
\`\`\`

### Best Practices

- All headings must contain text or images with alt text
- Remove headings used only for spacing
- Use CSS for visual spacing, not empty headings
- Headings should describe the content section

### The Algorithm

A heading element is present that contains no text (or only spaces) and no images with alternative text.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.1 Bypass Blocks** (Level A)
- **2.4.6 Headings and Labels** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-button-empty',
    category: 'wave',
    columnName: 'button_empty',
    waveType: 'Error',
    explanation: 'A button is empty or has no value text.',
    remediationGuidelines: `## Empty Button (button_empty)

### What It Means

A button is empty or has no value text.

### Why It Matters

When navigating to a button, descriptive text must be presented to screen reader users to indicate the function of the button.

### What To Do

Place text content within the \`<button>\` element or give the \`<input>\` element a value attribute.

### Examples

\`\`\`html
<!-- Good: Button with text content -->
<button>Submit</button>
<button>Save Changes</button>
<button>Cancel</button>

<!-- Good: Button with icon and text -->
<button>
  <span class="icon-save" aria-hidden="true"></span>
  Save Document
</button>

<!-- Good: Icon-only button with aria-label -->
<button aria-label="Close dialog">
  <span class="icon-close" aria-hidden="true"></span>
</button>

<!-- Good: Input button with value -->
<input type="button" value="Submit">
<input type="submit" value="Send Form">
<input type="reset" value="Clear Form">

<!-- Bad: Empty button -->
<button></button>

<!-- Bad: Input without value -->
<input type="submit">
<input type="button">
\`\`\`

### Best Practices

- Always provide visible text or aria-label
- Use descriptive action words (Submit, Save, Delete)
- For icon-only buttons, use aria-label
- Ensure button text is clear and specific

### The Algorithm

A \`<button>\` element is present that contains no text content (or alternative text), or an \`<input type="submit">\`, \`<input type="button">\`, or \`<input type="reset">\` has an empty or missing value attribute.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-heading-skipped',
    category: 'wave',
    columnName: 'heading_skipped',
    waveType: 'Alert',
    explanation: 'A heading level is skipped.',
    remediationGuidelines: `## Skipped Heading Level (heading_skipped)

### What It Means

A heading level is skipped.

### Why It Matters

Headings provide document structure and facilitate keyboard navigation by users of assistive technology. These users may be confused or experience difficulty navigating when heading levels are skipped.

### What To Do

Restructure the document headings to ensure that heading levels are not skipped.

### Examples

\`\`\`html
<!-- Bad: Skipped heading level -->
<h1>Main Title</h1>
<h3>Section Title</h3> <!-- ERROR: Skipped h2 -->
  <h4>Subsection</h4>

<!-- Good: Sequential heading levels -->
<h1>Main Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection</h3>
      <h4>Details</h4>

<!-- Good: Proper hierarchy -->
<h1>Accessibility Guidelines</h1>
  <h2>WCAG Requirements</h2>
    <h3>Level A Criteria</h3>
    <h3>Level AA Criteria</h3>
  <h2>Implementation</h2>
    <h3>HTML Structure</h3>
\`\`\`

### Best Practices

- Start with \`<h1>\` for main title
- Follow sequential order: H1 → H2 → H3 (no skipping)
- Maintain logical hierarchy
- Don't use headings for styling - use CSS

### The Algorithm

A heading level is skipped (e.g., an \`<h1>\` is followed by an \`<h3>\`, with no intermediate \`<h2>\`). Note that an \`<h1>\` is not required to be the first heading within the document.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.1 Bypass Blocks** (Level A)
- **2.4.6 Headings and Labels** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-aria',
    category: 'wave',
    columnName: 'aria',
    waveType: 'Feature',
    explanation: 'An ARIA role, state, or property is present.',
    remediationGuidelines: `## ARIA Landmark or Region (aria)

### What It Means

An ARIA role, state, or property is present.

### Why It Matters

ARIA provides enhanced semantics and accessibility for web content.

### What To Do

Ensure the ARIA role, state, or property is used correctly. Use standard HTML accessibility features when possible. Be aware that support for ARIA is limited in older browsers and assistive technologies.

### Examples

\`\`\`html
<!-- ARIA landmarks -->
<header role="banner">Site Header</header>
<nav role="navigation">Main Navigation</nav>
<main role="main">Main Content</main>
<aside role="complementary">Sidebar</aside>
<footer role="contentinfo">Footer</footer>

<!-- ARIA regions -->
<div role="region" aria-labelledby="section-heading">
  <h2 id="section-heading">Features</h2>
  <p>Content here...</p>
</div>

<!-- ARIA states and properties -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div id="menu" aria-hidden="true">Menu content</div>

<!-- Prefer semantic HTML when possible -->
<nav aria-label="Main navigation">...</nav>
<main>...</main>
\`\`\`

### Best Practices

- Use semantic HTML5 elements when possible
- Reserve ARIA for cases where HTML semantics are insufficient
- Ensure ARIA is properly implemented and tested
- Test with multiple screen readers

### The Algorithm

An ARIA role, state, or property is present, excluding landmark roles, aria-labelledby, or aria-describedby which are distinct WAVE items.

### Relevant WCAG 2.2 Success Criteria

- **4.1.2 Name, Role, Value** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-language',
    category: 'wave',
    columnName: 'language',
    waveType: 'Feature',
    explanation: 'The language of the document or a page element is identified.',
    remediationGuidelines: `## Language Specification (language)

### What It Means

The language of the document or a page element is identified.

### Why It Matters

Identifying the language of the page or portion of page (if different from the page itself) allows screen readers to read the content appropriately.

### What To Do

Ensure the language is properly identified for the page (e.g., \`<html lang="en">\`). If content within the page is in a language different than the page's language, identify it using a valid lang attribute value.

### Examples

\`\`\`html
<!-- Document language -->
<html lang="en">
<head>
  <title>My Page</title>
</head>
<body>
  <!-- Content in different language -->
  <p lang="es">Hola, ¿cómo estás?</p>
  
  <!-- Back to main language (inherits from html) -->
  <p>This is English text again.</p>
  
  <!-- Another language -->
  <blockquote lang="fr">Je ne sais pas</blockquote>
</body>
</html>

<!-- Valid language codes -->
<html lang="en">      <!-- English -->
<html lang="en-US">   <!-- US English -->
<html lang="es-MX">   <!-- Mexican Spanish -->
<html lang="fr">      <!-- French -->
\`\`\`

### Best Practices

- Always set \`lang\` on \`<html>\` element
- Mark language changes within content
- Use valid ISO 639-1 language codes
- Include region code when relevant (e.g., "en-US", "en-GB")

### The Algorithm

A document or an element has a valid lang attribute value.

### Relevant WCAG 2.2 Success Criteria

- **3.1.2 Language of Parts** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-link-suspicious',
    category: 'wave',
    columnName: 'link_suspicious',
    waveType: 'Warning',
    explanation: 'Link text contains extraneous text or may not make sense out of context.',
    remediationGuidelines: `## Suspicious Link Text (link_suspicious)

### What It Means

Link text contains extraneous text or may not make sense out of context.

### Why It Matters

Links, which are often read out of context, should clearly describe the destination or function of the link. Ambiguous text, text that does not make sense out of context, and extraneous text (such as "click here") can cause confusion and should be avoided.

### What To Do

Where appropriate, reword the link text so that it is more descriptive of its destination when read out of context. Remove any extraneous text (such as "click here").

### Examples

\`\`\`html
<!-- Bad: Generic or ambiguous text -->
<a href="/contact">click here</a>
<a href="/help">here</a>
<a href="/products">more</a>
<a href="/details">more details</a>
<a href="/link">link</a>
<a href="/button">button</a>

<!-- Good: Descriptive link text -->
<a href="/contact">Contact Us</a>
<a href="/help">Help and Support</a>
<a href="/products">View Our Products</a>
<a href="/details">Product Details</a>
<a href="/documentation">View Documentation</a>

<!-- Good: Link text describes destination -->
<a href="/privacy-policy.pdf">Privacy Policy (PDF)</a>
<a href="/contact">Email customer support</a>
\`\`\`

### Terms to Avoid

\`\`\`
❌ "click here", "click"
❌ "here", "more", "more...", "details"
❌ "more details", "link", "button"
❌ "this page", "continue", "continue reading"
❌ "read more"
\`\`\`

### Best Practices

- Make link text descriptive and self-contained
- Link text should make sense when read alone
- Describe destination or action, not appearance
- Include file type information when relevant

### The Algorithm

A link (including alt text of linked images) contains the phrase "click here" or "click", or the link text is one of the prohibited generic terms.

### Relevant WCAG 2.2 Success Criteria

- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-link-redundant',
    category: 'wave',
    columnName: 'link_redundant',
    waveType: 'Warning',
    explanation: 'Adjacent links go to the same URL.',
    remediationGuidelines: `## Redundant Link (link_redundant)

### What It Means

Adjacent links go to the same URL.

### Why It Matters

When adjacent links go to the same location (such as a linked product image and an adjacent linked product name that go to the same product page) this results in additional navigation and repetition for keyboard and screen reader users.

### What To Do

If possible, combine the redundant links into one link and remove any redundant text or alternative text (for example, if a product image and product name are in the same link, the image can usually be given \`alt=""\`).

### Examples

\`\`\`html
<!-- Bad: Redundant adjacent links -->
<a href="/products">
  <img src="product.jpg" alt="View Product">
</a>
<a href="/products">Product Name</a>

<!-- Good: Combined into one link -->
<a href="/products">
  <img src="product.jpg" alt="">
  Product Name
</a>

<!-- Bad: Multiple links to same page -->
<a href="/about">About</a>
<a href="/about">Learn More</a>

<!-- Good: Single descriptive link -->
<a href="/about">About Us</a>
\`\`\`

### Best Practices

- Combine redundant links into one
- Use empty alt for images in combined links
- Reduce navigation overhead
- Improve screen reader experience

### The Algorithm

Two adjacent links go to the same URL.

### Relevant WCAG 2.2 Success Criteria

- **2.4.4 Link Purpose (In Context)** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-longdesc-invalid',
    category: 'wave',
    columnName: 'longdesc_invalid',
    waveType: 'Error',
    explanation: 'The longdesc attribute is not a URL.',
    remediationGuidelines: `## Invalid Longdesc (longdesc_invalid)

### What It Means

The longdesc attribute is not a URL.

### Why It Matters

The longdesc attribute of an image must be a valid URL of a page that contains a description of the image content. A longdesc value that contains image description text will not provide any accessibility information. Due to poor support, a link to the long description content should be used instead of longdesc.

### What To Do

Remove the longdesc attribute and provide a link to the long description content. If the longdesc attribute is maintained, ensure the attribute value is a valid URL/filename.

### Examples

\`\`\`html
<!-- Bad: Invalid longdesc -->
<img src="complex-chart.png" longdesc="This is a complex chart showing...">

<!-- Better: Remove longdesc and use a link -->
<figure>
  <img src="complex-chart.png" alt="Quarterly sales data chart">
  <figcaption>
    <a href="/chart-description.html">View detailed chart description</a>
  </figcaption>
</figure>

<!-- If using longdesc, ensure it's a valid URL -->
<img src="chart.png" longdesc="/chart-description.html" alt="Sales chart">
\`\`\`

### Best Practices

- **Avoid longdesc**: Poor browser support; use links instead
- **Provide alternatives**: Include description in caption or nearby text
- **Use links**: Create separate page with detailed description
- **If using longdesc**: Ensure valid URL/filename

### The Algorithm

The longdesc attribute value is empty, is not a URL or filename, or is a URL or filename with an extension of .jpg, .gif, or .png.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-label-orphaned',
    category: 'wave',
    columnName: 'label_orphaned',
    waveType: 'Error',
    explanation: 'A form label is present, but it is not correctly associated with a form control.',
    remediationGuidelines: `## Orphaned Form Label (label_orphaned)

### What It Means

A form label is present, but it is not correctly associated with a form control.

### Why It Matters

An incorrectly associated label does not provide functionality or information about the form control to the user. It usually indicates a coding or other form labeling issues.

### What To Do

Properly associate the label with its corresponding form control. If there is no corresponding form control, remove the label. Labels are not appropriate for image, submit, reset, button, or hidden form controls.

### Examples

\`\`\`html
<!-- Bad: Label with no 'for' attribute and doesn't wrap control -->
<label>Email Address</label>
<input type="email" name="email">

<!-- Bad: Label references non-existent element -->
<label for="nonexistent">Email</label>
<input type="email" id="email" name="email">

<!-- Good: Proper association with 'for' attribute -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Good: Label wrapping the control -->
<label>
  Email Address
  <input type="email" name="email">
</label>
\`\`\`

### Best Practices

- Always associate labels with form controls
- Use \`for\` attribute matching input \`id\`
- Or wrap the control with the label
- Remove labels that can't be associated
- Don't label image, submit, reset, button, or hidden inputs

### The Algorithm

A \`<label>\` element does not surround a form control and the for attribute is missing/empty; references an element that is not present in the page; references an element that is not an \`<input>\`, \`<select>\` or \`<textarea>\` element; or references an \`<input>\` element with image, submit, reset, button, or hidden type.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-label-title',
    category: 'wave',
    columnName: 'label_title',
    waveType: 'Warning',
    explanation: 'A form control does not have a label, but has a title.',
    remediationGuidelines: `## Unlabeled Form Control with Title (label_title)

### What It Means

A form control does not have a label, but has a title.

### Why It Matters

The title attribute value for unlabeled form controls will be presented to screen reader users. However, a properly associated text label provides better usability and accessibility and should be used unless the purpose of the form control is intuitive without the label.

### What To Do

If a visible text label is available for the form control, associate the text label to the form control using the label element. This provides additional functionality for end users because if the label is clicked it will set focus to the form control. If the form control is intuitive without a \`<label>\`, the title attribute value may be used.

### Examples

\`\`\`html
<!-- Bad: Only title attribute, no label -->
<input type="text" title="Enter your email address" name="email">

<!-- Good: Add proper label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Good: Label wrapping control -->
<label>
  Email Address
  <input type="email" name="email">
</label>

<!-- Acceptable: Intuitive control with title -->
<input type="search" title="Search products" aria-label="Search products">
\`\`\`

### Best Practices

- Prefer \`<label>\` over \`title\` attribute
- Labels provide clickable target and better UX
- Use \`aria-label\` if label isn't visible
- Title may be acceptable for intuitive controls
- Test with screen readers

### The Algorithm

An \`<input>\` (except types of image, submit, reset, button, or hidden), \`<textarea>\`, or \`<select>\` element has a non-empty title attribute value and is missing a label or valid aria-labelledby reference.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-select-missing-label',
    category: 'wave',
    columnName: 'select_missing_label',
    waveType: 'Error',
    explanation: 'A select element does not have an associated label',
    remediationGuidelines: `## Select Missing Label (select_missing_label)

### What It Means

A select element does not have an associated label

### Why It Matters

\`<select>\` elements must provide descriptive text about their function. This is typically provided via associated label text. If visual label text is not present and if the default select option adequately presents the purpose of the select menu, then an associated label is not necessary.

### What To Do

Ensure that the default option of the select menu presents the purpose of the select menu. If visible label text is present, it is best to associate this text to the select menu.

### Examples

\`\`\`html
<!-- Bad: Select without label -->
<select name="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
</select>

<!-- Good: Select with label -->
<label for="country">Country</label>
<select id="country" name="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
</select>

<!-- Acceptable: First option describes purpose -->
<select name="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
</select>
\`\`\`

### Best Practices

- Associate label with select when visible label exists
- First option can describe purpose if no visible label
- Use descriptive option text
- Test with screen readers

### The Algorithm

A \`<select>\` element is present that does not have an associated label or ARIA label.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-fieldset-missing',
    category: 'wave',
    columnName: 'fieldset_missing',
    waveType: 'Error',
    explanation: 'A group of check boxes or radio buttons is not enclosed in a fieldset.',
    remediationGuidelines: `## Missing Fieldset (fieldset_missing)

### What It Means

A group of check boxes or radio buttons is not enclosed in a fieldset.

### Why It Matters

A fieldset provides a visual and structural grouping of related form elements. It is typically necessary for groups of check boxes or radio buttons where a higher level description (called a legend) is necessary to understand the function of the check boxes or radio buttons. The description will be identified by a screen reader only if provided in a fieldset legend.

### What To Do

Determine whether the grouping of check boxes or radio buttons has or needs text that explains the purpose of the check boxes or radio button grouping. If so, mark up the group within a fieldset and put the group description in a legend element.

### Examples

\`\`\`html
<!-- Bad: Radio buttons without fieldset -->
<input type="radio" name="gender" value="male" id="male">
<label for="male">Male</label>
<input type="radio" name="gender" value="female" id="female">
<label for="female">Female</label>

<!-- Good: Radio buttons with fieldset and legend -->
<fieldset>
  <legend>Gender</legend>
  <input type="radio" name="gender" value="male" id="male">
  <label for="male">Male</label>
  <input type="radio" name="gender" value="female" id="female">
  <label for="female">Female</label>
</fieldset>

<!-- Good: Checkboxes with fieldset -->
<fieldset>
  <legend>Interests (select all that apply)</legend>
  <input type="checkbox" id="sports" name="interests" value="sports">
  <label for="sports">Sports</label>
  <input type="checkbox" id="music" name="interests" value="music">
  <label for="music">Music</label>
</fieldset>
\`\`\`

### Best Practices

- Use fieldset for related radio buttons/checkboxes
- Add legend to describe the group
- Fieldset provides visual and programmatic grouping
- Screen readers announce legend with each control

### The Algorithm

Two or more checkbox or radio input elements within a form have the same name value, but are not enclosed in a fieldset.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-legend-missing',
    category: 'wave',
    columnName: 'legend_missing',
    waveType: 'Error',
    explanation: 'A fieldset does not have a legend.',
    remediationGuidelines: `## Fieldset Missing Legend (legend_missing)

### What It Means

A fieldset does not have a legend.

### Why It Matters

A fieldset legend presents a description of the form elements within a fieldset and is especially useful to screen reader users. A legend should be provided when a higher level description is necessary for groups of check boxes, radio buttons, or other form controls.

### What To Do

If a higher level description is necessary for the user to understand the function or purpose of the controls within the fieldset, provide this description within the \`<legend>\`. If this description or grouping is not necessary, the fieldset should probably be removed. Note that the legend is repeated to screen reader users for each form control within the fieldset.

### Examples

\`\`\`html
<!-- Bad: Fieldset without legend -->
<fieldset>
  <input type="radio" name="size" value="small" id="small">
  <label for="small">Small</label>
  <input type="radio" name="size" value="large" id="large">
  <label for="large">Large</label>
</fieldset>

<!-- Good: Fieldset with legend -->
<fieldset>
  <legend>Choose a size</legend>
  <input type="radio" name="size" value="small" id="small">
  <label for="small">Small</label>
  <input type="radio" name="size" value="large" id="large">
  <label for="large">Large</label>
</fieldset>
\`\`\`

### Best Practices

- Always include legend when fieldset is used
- Legend should describe the group purpose
- Keep legend text concise
- Remove fieldset if legend not needed

### The Algorithm

A fieldset does not have a legend or the legend is empty.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)
- **1.3.1 Info and Relationships** (Level A)
- **2.4.6 Headings and Labels** (Level AA)
- **3.3.2 Labels or Instructions** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-region-missing',
    category: 'wave',
    columnName: 'region_missing',
    waveType: 'Alert',
    explanation: 'No page regions or ARIA landmarks were found.',
    remediationGuidelines: `## No Page Regions (region_missing)

### What It Means

No page regions or ARIA landmarks were found.

### Why It Matters

Regions and ARIA landmarks identify significant page areas. Most web pages should have regions defined, particularly for the main content area.

### What To Do

If the page has visual regions or significant page areas, ensure the regions are defined with header, nav, main, footer, etc. elements.

### Examples

\`\`\`html
<!-- Good: Semantic HTML5 regions -->
<header>
  <h1>Site Title</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Page Title</h1>
  <p>Main content...</p>
</main>
<aside>
  <h2>Sidebar</h2>
  <p>Related content...</p>
</aside>
<footer>
  <p>Copyright information</p>
</footer>
\`\`\`

### Best Practices

- Use semantic HTML5 elements (\`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`)
- Add ARIA landmarks if HTML5 not available
- Ensure main content area is identified
- Regions aid screen reader navigation

### The Algorithm

No header, nav, main, footer, or aside HTML regions, or banner, navigation, main, or contentinfo landmark roles were present in the page.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.1 Bypass Blocks** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-heading-possible',
    category: 'wave',
    columnName: 'heading_possible',
    waveType: 'Alert',
    explanation: 'Text appears to be a heading but is not a heading element.',
    remediationGuidelines: `## Possible Heading (heading_possible)

### What It Means

Text appears to be a heading but is not a heading element.

### Why It Matters

Heading elements (\`<h1>\`-\`<h6>\`) provide important document structure, outlines, and navigation functionality to assistive technology users. If heading text is not a true heading, this information and functionality will not be available for that text.

### What To Do

If the paragraph is a section heading, use a heading element instead (\`<h1>\`-\`<h6>\`).

### Examples

\`\`\`html
<!-- Bad: Styled as heading but not a heading element -->
<p style="font-size: 24px; font-weight: bold;">Section Title</p>

<!-- Good: Use actual heading element -->
<h2>Section Title</h2>

<!-- Bad: Large bold text that should be a heading -->
<p style="font-size: 20px; font-weight: bold;">Subsection</p>

<!-- Good: Proper heading -->
<h3>Subsection</h3>
\`\`\`

### Best Practices

- Use semantic heading elements, not styled paragraphs
- Headings provide document structure and navigation
- Don't skip heading levels
- Style headings with CSS, not by making paragraphs look like headings

### The Algorithm

A \`<p>\` element contains less than 50 characters and is either 20 pixels or bigger, or 16 pixels or bigger and bold and/or italicized.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **2.4.1 Bypass Blocks** (Level A)
- **2.4.6 Headings and Labels** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-table-layout',
    category: 'wave',
    columnName: 'table_layout',
    waveType: 'Alert',
    explanation: 'A layout table is present.',
    remediationGuidelines: `## Layout Table (table_layout)

### What It Means

A layout table is present.

### Why It Matters

Layout tables exist merely to position content visually - to create columns, insert spacing, or align content neatly for sighted users. Their content is not at all tabular in nature. Layout tables should not be used in HTML5. They can introduce reading and navigation order issues. Screen readers may interpret them as data tables (i.e., announcing column and row numbers), especially if they contain table header (\`<th>\`) cells. This introduces significant overhead on screen reader users.

### What To Do

In almost every case, layout tables can be replaced with other HTML elements and styled with CSS to achieve the desired visual presentation. If the table contains tabular data, provide appropriate header (\`<th>\`) cells. If the layout table remains, verify that the reading and navigation order of table content (based on underlying source code order) is logical and give it \`role="presentation"\` to ensure it is not identified as a table to screen reader users.

### Examples

\`\`\`html
<!-- Bad: Layout table for positioning -->
<table>
  <tr>
    <td>Left column</td>
    <td>Right column</td>
  </tr>
</table>

<!-- Good: Use CSS for layout -->
<div style="display: flex; gap: 20px;">
  <div>Left column</div>
  <div>Right column</div>
</div>

<!-- If layout table must remain, mark as presentation -->
<table role="presentation">
  <tr>
    <td>Header</td>
  </tr>
  <tr>
    <td>Content</td>
  </tr>
</table>
\`\`\`

### CSS Layout Alternatives

\`\`\`css
/* Flexbox layout */
.container {
  display: flex;
  gap: 20px;
}

/* Grid layout */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
\`\`\`

### Best Practices

- Use CSS Flexbox or Grid instead of layout tables
- Only use tables for actual tabular data
- If layout table necessary, use \`role="presentation"\`
- Test reading order with screen reader

### The Algorithm

A \`<table>\` element is present that does not contain any header (\`<th>\`) cells.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **1.3.2 Meaningful Sequence** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-table-caption-possible',
    category: 'wave',
    columnName: 'table_caption_possible',
    waveType: 'Alert',
    explanation: 'Text appears to be a table caption, but is not a caption element.',
    remediationGuidelines: `## Possible Table Caption (table_caption_possible)

### What It Means

Text appears to be a table caption, but is not a caption element.

### Why It Matters

A table caption should be associated with a table using the \`<caption>\` element so it will be read by a screen reader with the table content.

### What To Do

If the text is a description of the table, associate the text with the table using the \`<caption>\` element (\`<caption>\` should be the first element within the \`<table>\`).

### Examples

\`\`\`html
<!-- Bad: Caption outside table -->
<p><strong>Monthly Sales Report</strong></p>
<table>
  <tr>
    <th>Month</th>
    <th>Sales</th>
  </tr>
</table>

<!-- Good: Caption inside table -->
<table>
  <caption>Monthly Sales Report</caption>
  <tr>
    <th>Month</th>
    <th>Sales</th>
  </tr>
</table>
\`\`\`

### Best Practices

- Use \`<caption>\` for table descriptions
- Place caption as first element in table
- Keep caption text concise and descriptive
- Caption is read with table content by screen readers

### The Algorithm

A data table (has at least one table header) that does not already have a caption has a colspan attribute value of 3 or greater on the first cell of the table, or a \`<p>\` element immediately before the table that contains less than 50 characters or contains less than 100 characters and is bold and/or centered.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-list-possible',
    category: 'wave',
    columnName: 'list_possible',
    waveType: 'Alert',
    explanation: 'Text is structured like a list but lacks proper list semantics.',
    remediationGuidelines: `## Possible List (list_possible)

### What It Means

Text is structured like a list but lacks proper list semantics.

### Why It Matters

Ordered and unordered lists, when properly defined, provide useful information to users, such as an indication of the list type and number of list items. When text alone is used to present list structures and content, these benefits are lost.

### What To Do

If list content is presented, use \`<ul>\` or \`<ol>\` markup to semantically define the list.

### Examples

\`\`\`html
<!-- Bad: List-like text without list markup -->
<p>* Item one</p>
<p>* Item two</p>
<p>* Item three</p>

<!-- Bad: Numbered text without list -->
<p>1. First item</p>
<p>2. Second item</p>

<!-- Good: Unordered list -->
<ul>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</ul>

<!-- Good: Ordered list -->
<ol>
  <li>First item</li>
  <li>Second item</li>
</ol>
\`\`\`

### Best Practices

- Use semantic list elements for list content
- Choose \`<ul>\` for unordered lists
- Choose \`<ol>\` for ordered/sequential lists
- Screen readers announce list structure

### The Algorithm

Text is used to present list-type content, such as:
- \`*\` text
- \`1.\` text
- \`a.\` text
- \`1)\` text
- \`a)\` text
- \`-\` text

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-link-internal-broken',
    category: 'wave',
    columnName: 'link_internal_broken',
    waveType: 'Error',
    explanation: 'A link to another location within the page is present but does not have a corresponding target.',
    remediationGuidelines: `## Broken Same-Page Link (link_internal_broken)

### What It Means

A link to another location within the page is present but does not have a corresponding target.

### Why It Matters

A link to jump to another position within the page assists users in navigating the web page, but only if the link target exists.

### What To Do

Ensure that the target for the link exists or remove the same-page link.

### Examples

\`\`\`html
<!-- Bad: Link to non-existent target -->
<a href="#nonexistent">Jump to section</a>

<!-- Good: Link to existing target -->
<a href="#section1">Jump to section</a>
<div id="section1">
  <h2>Section 1</h2>
</div>

<!-- Good: Ensure id matches href -->
<a href="#main-content">Skip to main content</a>
<main id="main-content">
  <h1>Main Content</h1>
</main>
\`\`\`

### Best Practices

- Ensure anchor targets exist with matching id
- Test all same-page links
- Use descriptive link text
- Verify targets are accessible

### The Algorithm

An in-page link has an href attribute (starting with a #), but does not match either the id value of another element or the name attribute value of an anchor element within the page.

### Relevant WCAG 2.2 Success Criteria

- **2.1.1 Keyboard** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-link-skip-broken',
    category: 'wave',
    columnName: 'link_skip_broken',
    waveType: 'Error',
    explanation: 'A skip navigation link exists, but the target for the link does not exist or the link is not keyboard accessible.',
    remediationGuidelines: `## Broken Skip Link (link_skip_broken)

### What It Means

A skip navigation link exists, but the target for the link does not exist or the link is not keyboard accessible.

### Why It Matters

A link to jump over navigation or jump to the main content of the page assists keyboard users only if the link is properly functioning and is keyboard accessible.

### What To Do

Ensure that the target for the link exists and that the link is not hidden with CSS display:none or visibility:hidden.

### Examples

\`\`\`html
<!-- Bad: Skip link with broken target -->
<a href="#main" class="skip-link">Skip to main content</a>
<!-- No element with id="main" -->

<!-- Bad: Hidden skip link -->
<a href="#main" class="skip-link" style="display: none;">Skip to main content</a>

<!-- Good: Working skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">
  <h1>Main Content</h1>
</main>

<!-- Good: Visually hidden but keyboard accessible -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
\`\`\`

### CSS for Skip Links

\`\`\`css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 0;
  top: 0;
}
\`\`\`

### Best Practices

- Ensure skip link target exists
- Don't hide skip link with display:none
- Make skip link visible on keyboard focus
- Test keyboard navigation

### The Algorithm

An in-page link contains the words "skip" or "jump" and is hidden with CSS display:none or visibility:hidden, or the link has an href attribute that does not match the id value of another element within the page or the name attribute value of an anchor element within the page.

### Relevant WCAG 2.2 Success Criteria

- **2.1.1 Keyboard** (Level A)
- **2.4.1 Bypass Blocks** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-th-empty',
    category: 'wave',
    columnName: 'th_empty',
    waveType: 'Error',
    explanation: 'A <th> (table header) contains no text.',
    remediationGuidelines: `## Empty Table Header (th_empty)

### What It Means

A \`<th>\` (table header) contains no text.

### Why It Matters

The \`<th>\` element helps associate table cells with the correct row/column headers. A \`<th>\` that contains no text may result in cells with missing or incorrect header information.

### What To Do

If the table cell is a header, provide text within the cell that describes the column or row. If the cell is not a header or must remain empty (such as the top-left cell in a data table), make the cell a \`<td>\` rather than a \`<th>\`.

### Examples

\`\`\`html
<!-- Bad: Empty header cell -->
<table>
  <tr>
    <th></th>
    <th>Column 1</th>
  </tr>
</table>

<!-- Good: Header with text -->
<table>
  <tr>
    <th>Category</th>
    <th>Value</th>
  </tr>
</table>

<!-- Good: Empty corner cell uses td -->
<table>
  <tr>
    <td></td>
    <th>Q1</th>
    <th>Q2</th>
  </tr>
</table>
\`\`\`

### Best Practices

- All header cells should have descriptive text
- Use \`<td>\` for empty cells that aren't headers
- Headers should clearly describe column/row content
- Test with screen readers

### The Algorithm

A \`<th>\` element does not contain any text (or contains only spaces) and no images with alternative text.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-blink',
    category: 'wave',
    columnName: 'blink',
    waveType: 'Error',
    explanation: 'Blinking content is present.',
    remediationGuidelines: `## Blinking Content (blink)

### What It Means

Blinking content is present.

### Why It Matters

Blinking content can be distracting and confusing to users, particularly those with certain cognitive disabilities.

### What To Do

Remove the blinking effect (\`<blink>\` element or text-decoration:blink style). Important text can be styled in other ways.

### Examples

\`\`\`html
<!-- Bad: Blink element (deprecated) -->
<blink>Important Notice</blink>

<!-- Bad: CSS blinking -->
<p style="text-decoration: blink;">New Alert</p>

<!-- Good: Alternative styling -->
<p style="color: red; font-weight: bold;">Important Notice</p>
<p class="highlight">New Alert</p>
\`\`\`

### CSS Alternatives

\`\`\`css
/* Instead of blinking */
.highlight {
  background-color: yellow;
  font-weight: bold;
}

.alert {
  border: 2px solid red;
  padding: 10px;
}
\`\`\`

### Best Practices

- Never use blinking effects
- Use color, borders, or other visual cues
- Avoid any rapid flashing (can trigger seizures)
- Make important content accessible

### The Algorithm

A non-empty \`<blink>\` element or other text has CSS text-decoration:blink styling.

### Relevant WCAG 2.2 Success Criteria

- **2.2.2 Pause, Stop, Hide** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-marquee',
    category: 'wave',
    columnName: 'marquee',
    waveType: 'Error',
    explanation: 'A <marquee> element is present.',
    remediationGuidelines: `## Marquee (marquee)

### What It Means

A \`<marquee>\` element is present.

### Why It Matters

A marquee element presents scrolling text that the user cannot stop. Scrolling animated content can be distracting and confusing to users, particularly for those with certain cognitive disabilities.

### What To Do

Remove the marquee element. If content must scroll, use an alternative scrolling mechanism that allows the user to pause or stop the animation.

### Examples

\`\`\`html
<!-- Bad: Marquee element (deprecated) -->
<marquee>Scrolling text that cannot be stopped</marquee>

<!-- Good: CSS animation with pause control -->
<div class="scrollable" aria-live="polite">
  <button onclick="pauseAnimation()">Pause</button>
  <p>Important information that can be paused</p>
</div>

<!-- Better: Static content -->
<p>Important information</p>
\`\`\`

### Modern Alternatives

\`\`\`css
.scrollable {
  animation: scroll 10s linear infinite;
}

.scrollable.paused {
  animation-play-state: paused;
}
\`\`\`

### Best Practices

- Never use marquee elements
- Provide pause/stop controls for animations
- Consider static content when possible
- Ensure content is accessible

### The Algorithm

A \`<marquee>\` element is present.

### Relevant WCAG 2.2 Success Criteria

- **2.2.2 Pause, Stop, Hide** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-meta-refresh',
    category: 'wave',
    columnName: 'meta_refresh',
    waveType: 'Error',
    explanation: 'The page is set to automatically change location or refresh using a <meta> tag.',
    remediationGuidelines: `## Page Refreshes or Redirects (meta_refresh)

### What It Means

The page is set to automatically change location or refresh using a \`<meta>\` tag.

### Why It Matters

Pages that automatically change location or refresh pose significant usability issues, particularly for screen reader and keyboard users.

### What To Do

Remove the \`<meta>\` refresh and give the user control over time-sensitive content changes.

### Examples

\`\`\`html
<!-- Bad: Auto-refresh meta tag -->
<meta http-equiv="refresh" content="5">

<!-- Bad: Auto-redirect -->
<meta http-equiv="refresh" content="0;url=/new-page.html">

<!-- Good: User-controlled refresh -->
<button onclick="location.reload()">Refresh Page</button>

<!-- Good: Manual navigation -->
<a href="/new-page.html">Go to new page</a>
\`\`\`

### Best Practices

- Never use meta refresh
- Give users control over page navigation
- Don't auto-redirect without user action
- Provide clear navigation options

### The Algorithm

A \`<meta http-equiv="refresh">\` tag is present.

### Relevant WCAG 2.2 Success Criteria

- **2.2.1 Timing Adjustable** (Level A)
- **2.2.2 Pause, Stop, Hide** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-aria-reference-broken',
    category: 'wave',
    columnName: 'aria_reference_broken',
    waveType: 'Error',
    explanation: 'An aria-labelledby or aria-describedby reference exists, but the target for the reference does not exist.',
    remediationGuidelines: `## Broken ARIA Reference (aria_reference_broken)

### What It Means

An aria-labelledby or aria-describedby reference exists, but the target for the reference does not exist.

### Why It Matters

ARIA labels and descriptions will not be presented if the element referenced does not exist in the page.

### What To Do

Ensure the element referenced in the aria-labelledby or aria-describedby attribute value is present within the page and presents a proper label or description.

### Examples

\`\`\`html
<!-- Bad: References non-existent element -->
<input type="text" aria-labelledby="nonexistent-label" name="email">

<!-- Bad: Broken reference -->
<button aria-describedby="missing-desc">Submit</button>

<!-- Good: Valid reference -->
<span id="email-label">Email Address</span>
<input type="email" aria-labelledby="email-label" name="email">

<!-- Good: Multiple valid references -->
<span id="username-label">Username</span>
<span id="username-help">Must be at least 6 characters</span>
<input type="text" aria-labelledby="username-label" aria-describedby="username-help" name="username">
\`\`\`

### Best Practices

- Ensure referenced elements exist
- IDs must match exactly (case-sensitive)
- Test ARIA references with screen readers
- Use proper IDs for referenced elements

### The Algorithm

An element has an aria-labelledby or aria-describedby value that does not match the id attribute value of another element in the page.

### Relevant WCAG 2.2 Success Criteria

- **1.3.1 Info and Relationships** (Level A)
- **4.1.2 Name, Role, Value** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-aria-menu-broken',
    category: 'wave',
    columnName: 'aria_menu_broken',
    waveType: 'Error',
    explanation: 'An ARIA menu does not contain required menu items.',
    remediationGuidelines: `## Broken ARIA Menu (aria_menu_broken)

### What It Means

An ARIA menu does not contain required menu items.

### Why It Matters

ARIA menus are application menus (like those used in software menu) with a specific keyboard interactions. They are NOT for navigation links on a web site and must contain at least one menuitem, menuitemcheckbox, or menuitemradio element.

### What To Do

Ensure that the menu is an application menu and has the appropriate keyboard interactions (menu items are navigated via the arrow keys, not via the Tab key) and internal menu items, otherwise remove the menu role.

### Examples

\`\`\`html
<!-- Bad: Menu without menu items -->
<div role="menu">
  <a href="/home">Home</a>
  <a href="/about">About</a>
</div>

<!-- Bad: Empty menu -->
<ul role="menu"></ul>

<!-- Good: Menu with proper menu items -->
<ul role="menu">
  <li role="menuitem">Cut</li>
  <li role="menuitem">Copy</li>
  <li role="menuitem">Paste</li>
</ul>

<!-- Better: Navigation should use nav, not menu -->
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
\`\`\`

### Best Practices

- ARIA menus are for application menus, not navigation
- Menus must contain menuitem elements
- Use \`<nav>\` for site navigation
- Implement proper keyboard interactions

### The Algorithm

An element with role="menu" does not contain at least one element with role="menuitem", role="menuitemcheckbox", or role="menuitemradio".

### Relevant WCAG 2.2 Success Criteria

- **2.1.1 Keyboard** (Level A)
- **4.1.2 Name, Role, Value** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-duplicate',
    category: 'wave',
    columnName: 'alt_duplicate',
    waveType: 'Warning',
    explanation: 'Two images near each other have the same alternative text.',
    remediationGuidelines: `## Nearby Image Has Same Alternative Text (alt_duplicate)

### What It Means

Two images near each other have the same alternative text.

### Why It Matters

When two images have the same alternative text, this often causes redundancy or indicates incorrect alternative text.

### What To Do

Ensure that the alternative text for each image or image button is appropriate while removing unnecessary redundancy. If the content of the image is already conveyed elsewhere (through text or the alternative text of a nearby image) or if the image does not convey content, the image may generally be given empty/null alternative text (\`alt=""\`). Image buttons always convey a specific function, and thus cannot be given null alternative text.

### Examples

\`\`\`html
<!-- Bad: Same alt text for different images -->
<img src="icon1.png" alt="icon">
<img src="icon2.png" alt="icon">

<!-- Good: Unique alt text -->
<img src="email-icon.png" alt="Email icon">
<img src="phone-icon.png" alt="Phone icon">

<!-- Good: Decorative images use empty alt -->
<img src="decoration1.png" alt="">
<img src="decoration2.png" alt="">

<!-- If images are redundant, use empty alt for one -->
<img src="product-image.jpg" alt="Product photo">
<p>Beautiful product photo showing all features</p>
<img src="product-thumb.jpg" alt=""> <!-- Content in nearby text -->
\`\`\`

### Best Practices

- Each image should have unique, descriptive alt text
- If images are decorative or redundant, use empty alt
- Image buttons cannot have empty alt
- Review alt text for uniqueness and accuracy

### The Algorithm

The same alternative text (case insensitive, but not null/empty) is present for two images or image buttons (\`<input type='image'>\`) near each other (no more than 2 other images separate them).

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-long',
    category: 'wave',
    columnName: 'alt_long',
    waveType: 'Warning',
    explanation: 'An image has very long alternative text.',
    remediationGuidelines: `## Long Alternative Text (alt_long)

### What It Means

An image has very long alternative text.

### Why It Matters

Alternative text should be succinct, yet descriptive of the content and function of an image. Lengthy alternative text (more than around 100 characters) often indicates that extraneous content or content that is not available to sighted users is being presented.

### What To Do

Ensure the alternative text is succinct, yet descriptive. Ensure that no content is being presented in alternative text that is not available to sighted users viewing the image. When possible, either shorten the alternative text or provide the text alternative via another method (e.g., in text near the image, through a separate description page, etc.).

### Examples

\`\`\`html
<!-- Bad: Very long alt text -->
<img src="chart.png" alt="This chart shows quarterly sales data for the years 2020, 2021, and 2022. In Q1 2020, sales were $100k, in Q2 they were $120k, in Q3 $110k, and Q4 $130k. In 2021, Q1 was $140k, Q2 $150k, Q3 $145k, Q4 $160k. And in 2022, Q1 $170k, Q2 $180k, Q3 $175k, and Q4 $190k.">

<!-- Good: Succinct alt text -->
<img src="chart.png" alt="Quarterly sales increased from $100k in Q1 2020 to $190k in Q4 2022">

<!-- Good: Brief alt with extended description elsewhere -->
<img src="chart.png" alt="Quarterly sales growth chart">
<figcaption>
  Sales increased consistently each quarter from Q1 2020 ($100k) through Q4 2022 ($190k).
</figcaption>
\`\`\`

### Best Practices

- Keep alt text under 100 characters when possible
- Use nearby text or captions for detailed descriptions
- Alt text should summarize, not duplicate content
- For complex images, provide description in context

### The Algorithm

The image's alt attribute value is more than 100 characters.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-longdesc',
    category: 'wave',
    columnName: 'longdesc',
    waveType: 'Warning',
    explanation: 'The longdesc attribute is present.',
    remediationGuidelines: `## Long Description (longdesc)

### What It Means

The longdesc attribute is present.

### Why It Matters

Because of poor support, the longdesc attribute should not be used.

### What To Do

Because of poor browser support for longdesc, it should not be used to provide the description of complex images. The description may be provided in the alt attribute (if possible - alt text should be succinct, generally no more than ~100 characters), in nearby text (e.g., a caption, data table, etc.), or via a link to a separate description page that contains an accurate and equivalent description.

### Examples

\`\`\`html
<!-- Bad: Using longdesc -->
<img src="complex-diagram.png" alt="System architecture" longdesc="diagram-description.html">

<!-- Good: Remove longdesc, use caption or link -->
<figure>
  <img src="complex-diagram.png" alt="System architecture diagram">
  <figcaption>
    <a href="/diagram-description.html">View detailed description</a>
  </figcaption>
</figure>

<!-- Good: Description in nearby text -->
<img src="chart.png" alt="Quarterly sales chart">
<p>This chart shows sales data from Q1 2020 ($100k) through Q4 2022 ($190k), with consistent growth each quarter.</p>
\`\`\`

### Best Practices

- Avoid longdesc due to poor support
- Use captions, nearby text, or links for descriptions
- Keep alt text succinct (under 100 characters)
- Provide detailed descriptions in accessible formats

### The Algorithm

An image has a longdesc attribute containing a valid URL.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-image-title',
    category: 'wave',
    columnName: 'image_title',
    waveType: 'Warning',
    explanation: 'An image has a title attribute value but no alt value.',
    remediationGuidelines: `## Image with Title (image_title)

### What It Means

An image has a title attribute value but no alt value.

### Why It Matters

The title attribute value for images that lack an alt attribute value will be presented to screen reader users. However, providing image content in the alt attribute typically provides better accessibility, and should be used in most cases. The title attribute will generate a mouse hover tooltip which may or may not be desired - this tooltip will not be presented to touch screen or keyboard users.

### What To Do

Ensure the title attribute value presents the content and function of the image. For better accessibility, the alt attribute should be used when possible.

### Examples

\`\`\`html
<!-- Bad: Title but no alt -->
<img src="chart.png" title="Quarterly sales chart">

<!-- Good: Use alt attribute instead -->
<img src="chart.png" alt="Quarterly sales chart">

<!-- Good: Both alt and title (title as additional info) -->
<img src="logo.png" alt="Company logo" title="Company logo - established 1995">
\`\`\`

### Best Practices

- Use \`alt\` attribute for image descriptions
- \`title\` creates hover tooltip (not accessible to keyboard users)
- \`alt\` is read by screen readers; prefer over title
- Title can complement alt for additional context

### The Algorithm

An image is present that does not have an alt attribute or alt attribute value, but does have a title attribute value.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-text-small',
    category: 'wave',
    columnName: 'text_small',
    waveType: 'Alert',
    explanation: 'Text is very small.',
    remediationGuidelines: `## Very Small Text (text_small)

### What It Means

Text is very small.

### Why It Matters

Text which is very small is difficult to read, particularly for those with low vision.

### What To Do

Increase the text to a more readable size.

### Examples

\`\`\`css
/* Bad: Very small text */
.tiny-text {
  font-size: 8px;
}

.small-text {
  font-size: 10px;
}

/* Good: Readable text sizes */
.readable-text {
  font-size: 16px; /* Minimum recommended */
}

.large-text {
  font-size: 18px;
}
\`\`\`

### Best Practices

- Use at least 12px (16px recommended) for body text
- Small text (under 10px) is difficult to read
- Consider users with low vision
- Allow text scaling in user preferences

### The Algorithm

Text is present that is sized 10 pixels or smaller.

### Relevant WCAG 2.2 Success Criteria

- **1.4.4 Resize Text** (Level AA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-text-justified',
    category: 'wave',
    columnName: 'text_justified',
    waveType: 'Alert',
    explanation: 'Fully justified text is present.',
    remediationGuidelines: `## Justified Text (text_justified)

### What It Means

Fully justified text is present.

### Why It Matters

Large blocks of justified text can negatively impact readability due to varying word/letter spacing and 'rivers of white' that flow through the text.

### What To Do

Remove the full justification from the text.

### Examples

\`\`\`css
/* Bad: Justified text */
.justified {
  text-align: justify;
}

/* Good: Left-aligned or other alignment */
.readable {
  text-align: left;
}

.centered {
  text-align: center;
}
\`\`\`

### Best Practices

- Avoid justify for body text
- Use left-align for better readability
- Justify can create spacing issues
- Consider readability over appearance

### The Algorithm

A \`<p>\`, \`<div>\`, or \`<td>\` element has more than 500 characters and is styled with text-align:justify.

### Relevant WCAG 2.2 Success Criteria

- **1.4.8 Visual Presentation** (Level AAA)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-underline',
    category: 'wave',
    columnName: 'underline',
    waveType: 'Alert',
    explanation: 'Underlined text is present.',
    remediationGuidelines: `## Underlined Text (underline)

### What It Means

Underlined text is present.

### Why It Matters

Underlines almost universally indicates linked text. Consider removing the underline from the non-link text. Other styling (e.g., bold or italics) can be used to differentiate the text.

### What To Do

Unless there is a distinct need for the underlined text, remove the underline from it.

### Examples

\`\`\`html
<!-- Bad: Underlined non-link text -->
<p style="text-decoration: underline;">Important notice</p>
<u>Important text</u>

<!-- Good: Use other styling -->
<p style="font-weight: bold;">Important notice</p>
<strong>Important text</strong>

<!-- Good: Underlines only for links -->
<a href="/page">Link text</a>
\`\`\`

### CSS Best Practices

\`\`\`css
/* Underlines only for links */
a {
  text-decoration: underline;
}

/* Remove underline from other elements */
.important {
  font-weight: bold;
  /* NOT text-decoration: underline; */
}
\`\`\`

### Best Practices

- Reserve underlines for links
- Use bold, italic, or color for emphasis
- Avoid confusing non-link underlined text
- Maintain visual consistency

### The Algorithm

A \`<u>\` element or element with text-decoration:underline styles is present.

### Relevant WCAG 2.2 Success Criteria

- **1.4.1 Use of Color** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-title-redundant',
    category: 'wave',
    columnName: 'title_redundant',
    waveType: 'Warning',
    explanation: 'Title attribute text is the same as text or alternative text.',
    remediationGuidelines: `## Redundant Title Text (title_redundant)

### What It Means

Title attribute text is the same as text or alternative text.

### Why It Matters

The title attribute value is used to provide advisory information. It typically appears when the users hovers the mouse over an element. The advisory information presented should not be identical to or very similar to the element text or alternative text.

### What To Do

In most cases the title attribute can be removed, otherwise modify it to provide advisory, but not redundant information. Note that the title text may or may not be read by a screen reader and is typically inaccessible to sighted keyboard users.

### Examples

\`\`\`html
<!-- Bad: Redundant title -->
<a href="/contact" title="Contact Us">Contact Us</a>
<img src="logo.png" alt="Company Logo" title="Company Logo">

<!-- Good: Remove redundant title -->
<a href="/contact">Contact Us</a>
<img src="logo.png" alt="Company Logo">

<!-- Good: Title provides additional info -->
<a href="/contact" title="Contact our support team">Contact</a>
<img src="logo.png" alt="Company Logo" title="Company logo - established 1995">
\`\`\`

### Best Practices

- Remove title if it duplicates visible text/alt
- Title should provide additional context if used
- Remember title tooltips aren't accessible to keyboard users
- Prefer visible labels over title attributes

### The Algorithm

A title attribute value is identical to element text or image alternative text.

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  },
  {
    id: 'wave-alt-longdesc',
    category: 'wave',
    columnName: 'alt_longdesc',
    waveType: 'Warning',
    explanation: 'An image has alternative text and a longdesc attribute.',
    remediationGuidelines: `## Image with Longdesc and Alt (alt_longdesc)

### What It Means

An image has both alternative text and a longdesc attribute. While both may be present, longdesc has poor browser support and should generally be avoided.

### Why It Matters

The longdesc attribute has poor support and should be avoided. Alternative descriptions should be provided in the alt attribute (for brief descriptions) or via other methods like captions or links.

### What To Do

Remove the longdesc attribute. Provide the description in the alt attribute if brief, or use a caption, nearby text, or a link to a detailed description page.

### Examples

\`\`\`html
<!-- Bad: Using longdesc -->
<img src="diagram.png" alt="System diagram" longdesc="description.html">

<!-- Good: Remove longdesc, use caption/link -->
<figure>
  <img src="diagram.png" alt="System architecture diagram">
  <figcaption>
    <a href="/description.html">View detailed description</a>
  </figcaption>
</figure>
\`\`\`

### Best Practices

- Avoid longdesc due to poor browser support
- Use alt for brief descriptions
- Use captions, nearby text, or links for detailed descriptions
- Test with multiple browsers and screen readers

### Relevant WCAG 2.2 Success Criteria

- **1.1.1 Non-text Content** (Level A)`,
    helpLink: 'https://wave.webaim.org/'
  }
];

// Readability Metrics
const readabilityRows: GlossaryRow[] = [
  {
    id: 'readability-rating',
    category: 'readability',
    columnName: 'Readability Rating',
    readabilityMetric: 'Rating',
    readabilityDescription: 'Proprietary readability score from A to E, where A is most readable and E is least readable',
    readabilityThreshold: 'A-B (Highly Readable)',
    readabilityFieldName: 'rating',
    readabilityScoreType: 'rating',
    explanation: 'Proprietary readability rating system. A = highly readable, B = readable, C = average, D = difficult, E = very difficult.',
    remediationGuidelines: `## Readability Rating Improvement

### What It Means

A proprietary readability score from A (most readable) to E (least readable).

### Why It Matters

The rating provides a quick overall assessment of text readability. Higher ratings (A-B) indicate content that is accessible to a wider audience.

### Target Rating

**Target:** A-B (Highly Readable)

### How to Improve

- **Aim for shorter sentences** (15-20 words average)
- **Use simpler vocabulary** (common words over complex terms)
- **Write in active voice** for clarity
- **Break up long paragraphs** into shorter sections
- **Avoid jargon** or explain technical terms
- **Use lists and headings** to organize content

### Examples

\`\`\`
✅ A Rating: "This guide helps you understand accessibility."
✅ B Rating: "This comprehensive guide provides detailed information."
❌ D Rating: "The implementation of comprehensive methodologies..."
\`\`\`

### Best Practices

- Keep sentences under 20 words
- Use everyday language
- Test with your target audience
- Review and simplify complex passages`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-flesch',
    category: 'readability',
    columnName: 'Flesch Reading Ease',
    readabilityMetric: 'Flesch Reading Ease',
    readabilityDescription: 'Measures readability based on sentence length and syllable count',
    readabilityThreshold: '60-70 (Plain English)',
    readabilityFieldName: 'flesch_reading_ease',
    readabilityScoreType: 'score_0_100',
    explanation: 'Score from 0-100 where higher scores indicate easier reading. Target range is 60-70 for plain English.',
    remediationGuidelines: `## Flesch Reading Ease Improvement

### What It Means

Measures readability based on sentence length and syllable count. Scores range from 0-100, with higher scores indicating easier reading.

### Why It Matters

Flesch Reading Ease provides a quick assessment of text accessibility. Higher scores (60-100) indicate content that is easier to read and understand.

### Target Score

**Target Range:** 60-70 (Plain English)

### How to Improve

- Use shorter sentences (15-20 words average)
- Use simpler words (fewer syllables)
- Write in active voice
- Avoid jargon and technical terms

### Examples

\`\`\`
✅ Good (65): "This method helps users understand the process."
❌ Poor (35): "The implementation of the aforementioned methodology will facilitate enhanced user engagement."
\`\`\`

### Score Interpretation

- **90-100**: Very Easy (5th grade level)
- **80-89**: Easy (6th grade level)
- **70-79**: Fairly Easy (7th grade level)
- **60-69**: Plain English (8th-9th grade level) ⭐ **Target**
- **50-59**: Fairly Difficult (10th-12th grade)
- **30-49**: Difficult (College level)
- **0-29**: Very Difficult (College graduate level)`,
    helpLink: 'https://readabilityformulas.com/flesch-reading-ease-readability-formula.php'
  },
  {
    id: 'readability-flesch-kincaid',
    category: 'readability',
    columnName: 'Flesch-Kincaid Grade Level',
    readabilityMetric: 'Flesch-Kincaid Grade Level',
    readabilityDescription: 'Indicates the U.S. grade level needed to understand the text',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'flesch_kincaid_grade_level',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level score where 6-8 is ideal for general audiences. Higher numbers indicate more complex text.',
    remediationGuidelines: `## Flesch-Kincaid Grade Level Improvement

### What It Means

Indicates the U.S. grade level needed to understand the text. Based on sentence length and syllable complexity.

### Why It Matters

Lower grade levels (6-8) mean your content is accessible to a wider audience. Higher grade levels require more education to understand.

### Target Grade Level

**Target:** 6-8 (Middle School level)

### How to Improve

- Use shorter sentences
- Choose simpler words
- Avoid complex sentence structures
- Write for your audience's reading level

### Word Complexity Examples

\`\`\`
Complex → Simple:
- "utilize" → "use"
- "facilitate" → "help"
- "implement" → "do"
- "approximately" → "about"
- "demonstrate" → "show"
\`\`\`

### Best Practices

- Aim for 15-20 words per sentence
- Prefer common words over technical terms
- Break complex ideas into multiple sentences
- Test readability after writing`,
    helpLink: 'https://readabilityformulas.com/flesch-kincaid-grade-level-readability-formula.php'
  },
  {
    id: 'readability-gunning-fog',
    category: 'readability',
    columnName: 'Gunning Fog Score',
    readabilityMetric: 'Gunning Fog Score',
    readabilityDescription: 'Measures readability based on sentence length and complex words (3+ syllables)',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'gunning_fog_score',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level based on sentence length and percentage of complex words. Target is 6-8 for general audiences.',
    remediationGuidelines: `## Gunning Fog Score Improvement

### What It Means

Measures readability based on sentence length and the percentage of complex words (words with 3 or more syllables).

### Why It Matters

The Gunning Fog Index estimates the years of formal education needed to understand a text. Lower scores indicate more accessible content.

### Target Score

**Target:** 6-8 (Middle School level)

### How to Improve

- **Reduce sentence length** (aim for 15-20 words)
- **Minimize complex words** (words with 3+ syllables)
- **Use everyday vocabulary** instead of technical terms
- **Break long sentences** into shorter ones

### Examples

\`\`\`
❌ Complex: "The implementation of comprehensive methodologies facilitates optimization."
✅ Simple: "This method improves results."
\`\`\`

### Best Practices

- Count syllables in key words
- Replace 3+ syllable words when possible
- Use shorter sentences
- Test with readability tools`,
    helpLink: 'https://readabilityformulas.com/gunning-fog-readability-formula.php'
  },
  {
    id: 'readability-smog',
    category: 'readability',
    columnName: 'SMOG Index',
    readabilityMetric: 'SMOG Index',
    readabilityDescription: 'Simple Measure of Gobbledygook - estimates years of education needed',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'smog_index',
    readabilityScoreType: 'grade_level',
    explanation: 'Estimates years of education needed to understand text. Target is 6-8 years (middle school level).',
    remediationGuidelines: `## SMOG Index Improvement

### What It Means

Simple Measure of Gobbledygook - estimates the years of education needed to understand a piece of writing.

### Why It Matters

The SMOG Index predicts readability by analyzing polysyllabic words (words with 3+ syllables). Lower scores mean more accessible content.

### Target Level

**Target:** 6-8 years of education

### How to Improve

- Use shorter sentences
- Avoid polysyllabic words when possible
- Write in simple, clear language
- Test with readability tools

### Sentence Length Examples

\`\`\`
❌ Too long: "The comprehensive analysis of the multifaceted aspects of the organizational structure reveals significant opportunities for optimization."

✅ Better: "The analysis shows ways to improve the organization."
\`\`\`

### Best Practices

- Replace complex words with simpler alternatives
- Keep sentences under 20 words
- Avoid unnecessary technical jargon
- Test readability regularly`,
    helpLink: 'https://readabilityformulas.com/smog-readability-formula.php'
  },
  {
    id: 'readability-coleman-liau',
    category: 'readability',
    columnName: 'Coleman-Liau Index',
    readabilityMetric: 'Coleman-Liau Index',
    readabilityDescription: 'Based on characters per word and sentences per 100 words',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'coleman_liau_index',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level based on character count and sentence structure. Target is 6-8 grade level.',
    remediationGuidelines: `## Coleman-Liau Index Improvement

### What It Means

Measures readability based on average characters per word and average sentences per 100 words. It doesn't rely on syllable counting.

### Why It Matters

The Coleman-Liau Index provides a grade level estimate using character and sentence counts. This makes it useful for automated analysis.

### Target Grade Level

**Target:** 6-8 grade level

### How to Improve

- Use shorter words (fewer characters)
- Write shorter sentences
- Avoid complex punctuation
- Use common vocabulary

### Word Length Examples

\`\`\`
Long → Short:
- "characteristics" (14 chars) → "traits" (6 chars)
- "approximately" (12 chars) → "about" (5 chars)
- "demonstration" (13 chars) → "proof" (4 chars)
\`\`\`

### Best Practices

- Prefer shorter, common words
- Keep sentences under 20 words
- Use simple sentence structures
- Review word choices for length`,
    helpLink: 'https://readabilityformulas.com/coleman-liau-readability-formula.php'
  },
  {
    id: 'readability-ari',
    category: 'readability',
    columnName: 'Automated Readability Index',
    readabilityMetric: 'ARI',
    readabilityDescription: 'Uses characters per word and words per sentence',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'automated_readability_index',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level based on character and word counts. Target is 6-8 grade level for general audiences.',
    remediationGuidelines: `## Automated Readability Index (ARI) Improvement

### What It Means

Calculates readability based on average number of characters per word and average number of words per sentence.

### Why It Matters

ARI provides a quick grade level estimate without requiring syllable counting, making it ideal for automated analysis.

### Target Grade Level

**Target:** 6-8 grade level

### How to Improve

- Reduce average word length
- Use shorter sentences
- Avoid technical jargon
- Write in active voice

### Sentence Structure Examples

\`\`\`
❌ Complex: "The methodology that was implemented by the team has resulted in improved outcomes."

✅ Simple: "The team's method improved results."
\`\`\`

### Best Practices

- Aim for shorter words (4-5 characters average)
- Keep sentences to 15-20 words
- Replace complex words with simpler ones
- Use active voice`,
    helpLink: 'https://readabilityformulas.com/automated-readability-index.php'
  },
  {
    id: 'readability-dale-chall',
    category: 'readability',
    columnName: 'Dale-Chall Readability Score',
    readabilityMetric: 'Dale-Chall Readability Score',
    readabilityDescription: 'Based on vocabulary familiarity using the Dale-Chall word list',
    readabilityThreshold: '4.9 or below (4th-9th grade)',
    readabilityFieldName: 'dale_chall_readability_score',
    readabilityScoreType: 'grade_level',
    explanation: 'Measures readability based on familiar vs. unfamiliar words. Score of 4.9 or below indicates 4th-9th grade level.',
    remediationGuidelines: `## Dale-Chall Readability Score Improvement

### What It Means

Measures readability based on vocabulary familiarity. Uses the Dale-Chall word list to identify difficult words that are not familiar to average readers.

### Why It Matters

The Dale-Chall score predicts whether readers will understand the vocabulary. Lower scores indicate more accessible vocabulary choices.

### Target Score

**Target:** 4.9 or below (4th-9th grade level)

### How to Improve

- Use familiar, everyday words
- Avoid words not on the Dale-Chall familiar word list
- Replace complex vocabulary with simpler alternatives
- Explain technical terms when necessary

### Vocabulary Examples

\`\`\`
Unfamiliar → Familiar:
- "utilize" → "use"
- "commence" → "start"
- "facilitate" → "help"
- "terminate" → "end"
\`\`\`

### Best Practices

- Prefer words from everyday vocabulary
- Avoid uncommon or technical terms
- Define specialized terms when used
- Test vocabulary choices with target audience`,
    helpLink: 'https://readabilityformulas.com/dale-chall-readability-formula.php'
  },
  {
    id: 'readability-spache',
    category: 'readability',
    columnName: 'Spache Readability Score',
    readabilityMetric: 'Spache Readability Score',
    readabilityDescription: 'Measures readability for elementary school texts using the Spache word list',
    readabilityThreshold: '3.0-5.0 (Elementary)',
    readabilityFieldName: 'spache_readability_score',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level estimate for elementary school texts. Uses the Spache word list to identify familiar words.',
    remediationGuidelines: `## Spache Readability Score Improvement

### What It Means

Measures readability specifically for elementary school level texts. Based on the Spache word list of familiar words.

### Why It Matters

The Spache formula is designed for younger readers (up to 4th grade). It helps ensure content is appropriate for elementary-level audiences.

### Target Score

**Target:** 3.0-5.0 (Elementary school level)

### How to Improve

- Use words from the Spache familiar word list
- Avoid complex vocabulary
- Keep sentences very short (10-15 words)
- Use simple sentence structures

### Best Practices

- Write for young readers when targeting elementary audience
- Use familiar, everyday words
- Short, simple sentences
- Avoid abstract concepts`,
    helpLink: 'https://readabilityformulas.com/spache-readability-formula.php'
  },
  {
    id: 'readability-forcast',
    category: 'readability',
    columnName: 'FORCAST Grade',
    readabilityMetric: 'FORCAST Grade',
    readabilityDescription: 'Forced-choice readability assessment - measures readability using single-syllable word percentage',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'forcast_grade',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level estimate based on percentage of single-syllable words. Target is 6-8 grade level.',
    remediationGuidelines: `## FORCAST Grade Improvement

### What It Means

FORCAST (Forced-choice readability assessment) estimates grade level based on the percentage of single-syllable words in text.

### Why It Matters

Higher percentages of single-syllable words indicate simpler, more accessible text. This method is useful for technical or scientific content.

### Target Grade Level

**Target:** 6-8 grade level

### How to Improve

- Increase percentage of single-syllable words
- Replace multi-syllable words with shorter alternatives
- Use simpler vocabulary
- Break complex words into simpler phrases

### Examples

\`\`\`
Multi-syllable → Single-syllable:
- "approximately" → "about"
- "demonstrate" → "show"
- "utilize" → "use"
- "approximately" → "near"
\`\`\`

### Best Practices

- Prefer one-syllable words when possible
- Replace complex words with simpler alternatives
- Test syllable distribution
- Aim for 60%+ single-syllable words`,
    helpLink: 'https://readabilityformulas.com/forcast-readability-formula.php'
  },
  {
    id: 'readability-lix',
    category: 'readability',
    columnName: 'LIX Score',
    readabilityMetric: 'LIX Score',
    readabilityDescription: 'Readability measure developed for Swedish text, based on sentence and word length',
    readabilityThreshold: '25-35 (Easy)',
    readabilityFieldName: 'lix_score',
    readabilityScoreType: 'score',
    explanation: 'LIX score ranges from 0-100+. Lower scores (25-35) indicate easier reading. Scores over 50 are difficult.',
    remediationGuidelines: `## LIX Score Improvement

### What It Means

LIX (Läsbarhetsindex) is a readability measure based on average sentence length and percentage of long words (6+ letters).

### Why It Matters

Lower LIX scores indicate easier reading. The formula is language-independent and works well for automated analysis.

### Target Score

**Target:** 25-35 (Easy reading)

### Score Interpretation

- **0-25**: Very Easy
- **25-35**: Easy ⭐ **Target**
- **35-45**: Medium
- **45-55**: Difficult
- **55+**: Very Difficult

### How to Improve

- Reduce sentence length
- Minimize long words (6+ letters)
- Use shorter, common words
- Break up complex sentences

### Best Practices

- Aim for sentences under 20 words
- Prefer words under 6 letters when possible
- Use simple sentence structures
- Test LIX score regularly`,
    helpLink: 'https://readable.com/blog/the-lix-formula/'
  },
  {
    id: 'readability-rix',
    category: 'readability',
    columnName: 'RIX Score',
    readabilityMetric: 'RIX Score',
    readabilityDescription: 'Readability index using percentage of long words and sentence length',
    readabilityThreshold: 'Low (Under 5)',
    readabilityFieldName: 'rix_score',
    readabilityScoreType: 'score',
    explanation: 'RIX score is based on average sentence length and percentage of long words (7+ letters). Lower scores are better.',
    remediationGuidelines: `## RIX Score Improvement

### What It Means

RIX (Readability Index) measures readability using the percentage of long words (7+ letters) and average sentence length.

### Why It Matters

Lower RIX scores indicate easier reading. The formula is simple and effective for automated readability assessment.

### Target Score

**Target:** Under 5 (Easy reading)

### How to Improve

- **Reduce long words**: Replace 7+ letter words with shorter alternatives
- **Shorten sentences**: Aim for 15-20 words average
- **Use common vocabulary**: Prefer everyday words
- **Simplify structure**: Use straightforward sentence patterns

### Examples

\`\`\`
Long words → Short words:
- "approximately" (12 letters) → "about" (5 letters)
- "demonstration" (13 letters) → "proof" (4 letters)
- "characteristics" (14 letters) → "traits" (6 letters)
\`\`\`

### Best Practices

- Minimize words with 7+ letters
- Keep sentences concise
- Use familiar vocabulary
- Test RIX score regularly`,
    helpLink: 'https://readable.com/blog/the-rix-formula/'
  },
  {
    id: 'readability-linsear-write',
    category: 'readability',
    columnName: 'Linsear Write Score',
    readabilityMetric: 'Linsear Write Score',
    readabilityDescription: 'Readability measure based on easy words vs. hard words and sentence length',
    readabilityThreshold: '70-80 (Easy Reading)',
    readabilityFieldName: 'lensear_write',
    readabilityScoreType: 'score_0_100',
    explanation: 'Score from 0-100 where higher scores indicate easier reading. Uses easy word list to categorize vocabulary.',
    remediationGuidelines: `## Linsear Write Score Improvement

### What It Means

Measures readability based on the ratio of easy words (from a predefined list) to hard words, plus sentence length.

### Why It Matters

Higher Linsear Write scores indicate easier reading. The formula uses a word list to identify familiar, easy words.

### Target Score

**Target:** 70-80 (Easy reading)

### How to Improve

- Use words from the easy word list
- Reduce sentence length
- Avoid complex vocabulary
- Prefer familiar, everyday words

### Best Practices

- Consult easy word lists when writing
- Keep sentences under 20 words
- Replace hard words with easy alternatives
- Test readability with target audience`,
    helpLink: 'https://readabilityformulas.com/linsear-write-formula.php'
  },
  {
    id: 'readability-fry',
    category: 'readability',
    columnName: 'Fry Grade',
    readabilityMetric: 'Fry Grade',
    readabilityDescription: 'Readability measure using sentence length and syllable count per 100 words',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'fry_grade',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level estimate based on average sentence length and average number of syllables per 100 words.',
    remediationGuidelines: `## Fry Grade Improvement

### What It Means

Estimates grade level using average sentence length and average syllables per 100 words. Uses a graph for calculation.

### Why It Matters

Lower Fry grades indicate more accessible content. The formula works well for a wide range of reading levels.

### Target Grade Level

**Target:** 6-8 grade level

### How to Improve

- Reduce sentence length (15-20 words)
- Minimize multi-syllable words
- Use simpler vocabulary
- Break up long sentences

### Examples

\`\`\`
Multi-syllable → Fewer syllables:
- "approximately" (5 syllables) → "about" (2 syllables)
- "demonstration" (4 syllables) → "proof" (1 syllable)
- "implementation" (5 syllables) → "use" (1 syllable)
\`\`\`

### Best Practices

- Aim for shorter words (fewer syllables)
- Keep sentences concise
- Use everyday language
- Test with Fry graph`,
    helpLink: 'https://readabilityformulas.com/fry-readability-graph.php'
  },
  {
    id: 'readability-raygor',
    category: 'readability',
    columnName: 'Raygor Grade',
    readabilityMetric: 'Raygor Grade',
    readabilityDescription: 'Readability estimate using sentence length and percentage of long words (6+ letters)',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'raygor_grade',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level estimate based on average sentence length and percentage of long words (6 or more letters).',
    remediationGuidelines: `## Raygor Grade Improvement

### What It Means

Estimates grade level using average sentence length and percentage of long words (6 or more letters).

### Why It Matters

Lower Raygor grades indicate easier reading. The formula uses word length as an indicator of complexity.

### Target Grade Level

**Target:** 6-8 grade level

### How to Improve

- Reduce percentage of long words (6+ letters)
- Shorten sentences (15-20 words)
- Use shorter, common words
- Replace long words with shorter alternatives

### Examples

\`\`\`
Long words → Short words:
- "characteristics" (14 letters) → "traits" (6 letters)
- "approximately" (12 letters) → "about" (5 letters)
- "demonstration" (13 letters) → "proof" (4 letters)
\`\`\`

### Best Practices

- Prefer words under 6 letters
- Keep sentences under 20 words
- Use common vocabulary
- Test readability regularly`,
    helpLink: 'https://readabilityformulas.com/raygor-readability-estimate.php'
  },
  {
    id: 'readability-powers-sumner-kearl',
    category: 'readability',
    columnName: 'Powers-Sumner-Kearl Score',
    readabilityMetric: 'Powers-Sumner-Kearl Score',
    readabilityDescription: 'Readability measure for elementary school texts using sentence and word length',
    readabilityThreshold: '3-6 (Elementary)',
    readabilityFieldName: 'powers_sumner_kearl_score',
    readabilityScoreType: 'grade_level',
    explanation: 'Grade level estimate for elementary school texts. Based on sentence length and word length.',
    remediationGuidelines: `## Powers-Sumner-Kearl Score Improvement

### What It Means

Readability measure specifically designed for elementary school texts (grades 3-6). Based on sentence and word length.

### Why It Matters

The Powers-Sumner-Kearl formula helps ensure content is appropriate for young readers in elementary school.

### Target Score

**Target:** 3-6 grade level

### How to Improve

- Use very short sentences (10-15 words)
- Use simple, short words
- Avoid complex vocabulary
- Write for young readers

### Best Practices

- Keep sentences very short
- Use familiar, everyday words
- Avoid abstract concepts
- Test with elementary-age readers`,
    helpLink: 'https://readabilityformulas.com/powers-sumner-kearl-formula.php'
  },
  {
    id: 'readability-cefr',
    category: 'readability',
    columnName: 'CEFR Level',
    readabilityMetric: 'CEFR Level',
    readabilityDescription: 'Common European Framework of Reference for Languages - indicates language proficiency level',
    readabilityThreshold: 'A2-B1 (Elementary-Intermediate)',
    readabilityFieldName: 'cefr_level',
    readabilityScoreType: 'level',
    explanation: 'CEFR levels range from A1 (Beginner) to C2 (Proficient). A2-B1 indicates elementary to intermediate level suitable for general audiences.',
    remediationGuidelines: `## CEFR Level Guidelines

### What It Means

Common European Framework of Reference (CEFR) indicates the language proficiency level needed to understand the text.

### Why It Matters

CEFR levels help ensure content is accessible to readers with different language proficiency levels. Lower levels indicate easier content.

### Target Level

**Target:** A2-B1 (Elementary to Intermediate)

### CEFR Level Guide

- **A1**: Beginner (Basic phrases)
- **A2**: Elementary ⭐ **Target lower range**
- **B1**: Intermediate ⭐ **Target upper range**
- **B2**: Upper Intermediate
- **C1**: Advanced
- **C2**: Proficient

### How to Improve

- Use simple sentence structures
- Employ everyday vocabulary
- Avoid complex grammatical structures
- Write for A2-B1 level proficiency

### Best Practices

- Test content at target CEFR level
- Use simple grammar structures
- Prefer common vocabulary
- Consider language learners' needs`,
    helpLink: 'https://www.coe.int/en/web/common-european-framework-reference-languages'
  },
  {
    id: 'readability-ielts',
    category: 'readability',
    columnName: 'IELTS Level',
    readabilityMetric: 'IELTS Level',
    readabilityDescription: 'International English Language Testing System - indicates English language proficiency level',
    readabilityThreshold: '4-5 (Moderate)',
    readabilityFieldName: 'ielts_level',
    readabilityScoreType: 'level',
    explanation: 'IELTS band scores range from 0-9. Band 4-5 indicates moderate user level suitable for general audiences.',
    remediationGuidelines: `## IELTS Level Guidelines

### What It Means

International English Language Testing System (IELTS) band score indicating the English proficiency level needed.

### Why It Matters

IELTS levels help writers target appropriate language complexity for their audience, especially for international or multilingual readers.

### Target Level

**Target:** 4-5 (Moderate User level)

### IELTS Band Guide

- **0-3**: Non-user to Extremely Limited
- **4**: Limited User (can understand basic situations)
- **5**: Modest User ⭐ **Target**
- **6**: Competent User
- **7-9**: Good to Expert User

### How to Improve

- Simplify sentence structure
- Use common vocabulary
- Avoid complex grammatical patterns
- Write for band 4-5 level

### Best Practices

- Test readability for target IELTS level
- Use straightforward grammar
- Prefer common words
- Consider international audience`,
    helpLink: 'https://www.ielts.org/'
  },
  {
    id: 'readability-average-grade',
    category: 'readability',
    columnName: 'Average Grade Level',
    readabilityMetric: 'Average Grade Level',
    readabilityDescription: 'Average of multiple grade-level readability scores',
    readabilityThreshold: '6-8 (Middle School)',
    readabilityFieldName: 'average_grade_level',
    readabilityScoreType: 'grade_level',
    explanation: 'Average of multiple grade-level readability algorithms. Target is 6-8 for general audiences. Note: This is a deprecated measure.',
    remediationGuidelines: `## Average Grade Level Improvement

### What It Means

An average measure of grade scores from multiple readability algorithms. **Note:** This is a deprecated measure and not recommended for new implementations.

### Why It Matters

While this measure is deprecated, it provides a general overview of text complexity across multiple readability formulas.

### Target Grade Level

**Target:** 6-8 (Middle School level)

### Recommendation

Use specific readability scores (Flesch-Kincaid, SMOG, etc.) rather than relying on this average measure.

### How to Improve

- Use shorter sentences (15-20 words)
- Use simpler vocabulary
- Write in active voice
- Avoid complex sentence structures

### Best Practices

- Focus on individual readability scores
- Don't rely solely on average grade level
- Test with target audience
- Use multiple readability measures`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-sentiment',
    category: 'readability',
    columnName: 'Sentiment',
    readabilityMetric: 'Sentiment',
    readabilityDescription: 'Emotional tone of the text - positive, negative, or neutral',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'sentiment',
    readabilityScoreType: 'sentiment',
    explanation: 'Sentiment analysis measures the emotional tone (positive, negative, neutral) with a score from 0-100, where 0 is very negative and 100 is very positive.',
    remediationGuidelines: `## Sentiment Analysis

### What It Means

Measures the emotional tone of the text - whether it's positive, negative, or neutral. Sentiment score ranges from 0 (very negative) to 100 (very positive).

### Why It Matters

Sentiment affects how readers perceive and respond to content. Consider your content goals when evaluating sentiment.

### Sentiment Scores

- **0-30**: Very Negative
- **31-45**: Negative
- **46-54**: Neutral
- **55-69**: Positive
- **70-100**: Very Positive

### How to Adjust

- **Increase positive sentiment**: Use positive words, focus on benefits
- **Decrease negative sentiment**: Avoid negative language, frame constructively
- **Maintain neutral**: Use objective, balanced language

### Best Practices

- Match sentiment to content purpose
- Be authentic in tone
- Consider audience expectations
- Balance positive and constructive feedback`,
    helpLink: 'https://readable.com/blog/sentiment-analysis/'
  },
  {
    id: 'readability-tone',
    category: 'readability',
    columnName: 'Tone',
    readabilityMetric: 'Tone',
    readabilityDescription: 'Formality level of the text - formal to informal',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'tone',
    readabilityScoreType: 'tone',
    explanation: 'Tone analysis measures formality from 0 (very formal) to 100 (very informal). Appropriate tone depends on context and audience.',
    remediationGuidelines: `## Tone (Formality) Guidelines

### What It Means

Measures the formality level of writing. Scores range from 0 (very formal) to 100 (very informal).

### Why It Matters

Appropriate tone depends on your audience and purpose. Match tone to context and reader expectations.

### Tone Scale

- **0-30**: Very Formal (Academic, Legal)
- **31-50**: Formal (Professional)
- **51-70**: Neutral ⭐ **General purpose**
- **71-85**: Informal (Conversational)
- **86-100**: Very Informal (Casual)

### How to Adjust

- **More formal**: Use complete sentences, avoid contractions, formal vocabulary
- **More informal**: Use contractions, conversational language, simpler structure
- **Neutral**: Balance formal and informal elements

### Best Practices

- Match tone to audience expectations
- Be consistent throughout document
- Consider content purpose
- Test with target audience`,
    helpLink: 'https://readable.com/blog/writing-tone/'
  },
  {
    id: 'readability-personal',
    category: 'readability',
    columnName: 'Personalism',
    readabilityMetric: 'Personalism',
    readabilityDescription: 'How personal or impersonal the writing is',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'personal',
    readabilityScoreType: 'personal',
    explanation: 'Measures personalism from 0 (very impersonal) to 100 (very personal). Higher scores indicate use of personal pronouns and direct address.',
    remediationGuidelines: `## Personalism Guidelines

### What It Means

Measures how personal or impersonal the writing is. Scores from 0 (very impersonal) to 100 (very personal).

### Why It Matters

Personalism affects reader connection and engagement. Choose based on content purpose and audience.

### Personalism Scale

- **0-30**: Very Impersonal (Technical, Academic)
- **31-50**: Impersonal (Formal Business)
- **51-70**: Neutral ⭐ **Balanced**
- **71-85**: Personal (Conversational)
- **86-100**: Very Personal (Intimate, Direct)

### How to Adjust

- **More personal**: Use "you", "we", personal pronouns, direct address
- **More impersonal**: Avoid personal pronouns, use passive voice, objective language

### Examples

\`\`\`
Impersonal: "It is recommended that users follow the guidelines."
Personal: "We recommend that you follow these guidelines."

Impersonal: "The document should be reviewed."
Personal: "You should review the document."
\`\`\`

### Best Practices

- Match personalism to content type
- Consider audience preferences
- Be consistent in approach
- Test with target readers`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-gender',
    category: 'readability',
    columnName: 'Gender',
    readabilityMetric: 'Gender',
    readabilityDescription: 'Gender bias analysis of the text',
    readabilityThreshold: 'Balanced (40-60)',
    readabilityFieldName: 'gender',
    readabilityScoreType: 'gender',
    explanation: 'Measures gender bias from 0 (very female-oriented) to 100 (very male-oriented). Balanced scores (40-60) indicate neutral gender representation.',
    remediationGuidelines: `## Gender Analysis Guidelines

### What It Means

Analyzes gender representation and bias in text. Scores from 0 (very female-oriented) to 100 (very male-oriented).

### Why It Matters

Gender-neutral content is more inclusive and accessible to all readers. Balanced representation is generally preferred.

### Target Score

**Target:** 40-60 (Balanced, gender-neutral)

### Gender Score Range

- **0-30**: Very Female-Oriented
- **31-45**: Female-Oriented
- **46-54**: Balanced ⭐ **Target**
- **55-69**: Male-Oriented
- **70-100**: Very Male-Oriented

### How to Improve Balance

- Use gender-neutral language
- Include diverse examples
- Avoid gender stereotypes
- Use inclusive pronouns

### Examples

\`\`\`
✅ Gender-neutral: "Users can access their accounts."
✅ Inclusive: "People" instead of "men and women"
✅ Diverse examples: Mix of names and pronouns
\`\`\`

### Best Practices

- Aim for balanced representation
- Use inclusive language
- Avoid gender assumptions
- Review for bias`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-word-count',
    category: 'readability',
    columnName: 'Word Count',
    readabilityMetric: 'Word Count',
    readabilityDescription: 'Total number of words in the text',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'word_count',
    readabilityScoreType: 'count',
    explanation: 'Total number of words in the analyzed text. Useful for understanding document length and complexity.',
    remediationGuidelines: `## Word Count Guidelines

### What It Means

Total number of words in your text.

### Why It Matters

Word count helps assess document length and complexity. Appropriate length depends on content purpose and audience.

### Considerations

- **Short content** (< 300 words): Concise, focused messages
- **Medium content** (300-1000 words): Standard articles, blog posts
- **Long content** (1000+ words): Comprehensive guides, documentation

### Best Practices

- Keep introductions brief (50-100 words)
- Break long documents into sections
- Use headings for longer content
- Consider reader attention span
- Remove unnecessary words

### Tips

- Write first, edit later
- Cut redundant phrases
- Use active voice to reduce word count
- Review for wordiness`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-sentence-count',
    category: 'readability',
    columnName: 'Sentence Count',
    readabilityMetric: 'Sentence Count',
    readabilityDescription: 'Total number of sentences in the text',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'sentence_count',
    readabilityScoreType: 'count',
    explanation: 'Total number of sentences. Combined with word count, helps calculate average words per sentence.',
    remediationGuidelines: `## Sentence Count Guidelines

### What It Means

Total number of sentences in your text.

### Why It Matters

Sentence count, combined with word count, helps calculate average sentence length - a key readability factor.

### Average Sentence Length

Calculate: Word Count ÷ Sentence Count

- **10-15 words**: Easy to read ⭐ **Target**
- **15-20 words**: Readable
- **20-25 words**: Moderate difficulty
- **25+ words**: Difficult to read

### How to Improve

- Break long sentences into shorter ones
- Aim for 15-20 words per sentence average
- Use punctuation effectively
- Vary sentence length for rhythm

### Best Practices

- Review sentence length distribution
- Mix short and medium sentences
- Avoid too many very short sentences
- Keep most sentences under 20 words`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-paragraph-count',
    category: 'readability',
    columnName: 'Paragraph Count',
    readabilityMetric: 'Paragraph Count',
    readabilityDescription: 'Total number of paragraphs in the text',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'paragraph_count',
    readabilityScoreType: 'count',
    explanation: 'Total number of paragraphs. Combined with sentence count, helps calculate average sentences per paragraph.',
    remediationGuidelines: `## Paragraph Count Guidelines

### What It Means

Total number of paragraphs in your text.

### Why It Matters

Paragraph structure affects readability and organization. Well-structured paragraphs improve comprehension.

### Average Paragraph Length

Calculate: Sentence Count ÷ Paragraph Count

- **3-5 sentences**: Ideal paragraph length ⭐ **Target**
- **5-7 sentences**: Acceptable
- **7+ sentences**: Too long - break up

### How to Improve

- Keep paragraphs to 3-5 sentences
- One main idea per paragraph
- Use shorter paragraphs for web content
- Break long paragraphs into multiple paragraphs

### Best Practices

- Start new paragraph for new ideas
- Keep paragraphs focused and concise
- Use white space effectively
- Test paragraph length visually`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-words-per-sentence',
    category: 'readability',
    columnName: 'Words Per Sentence',
    readabilityMetric: 'Words Per Sentence',
    readabilityDescription: 'Average number of words per sentence',
    readabilityThreshold: '15-20 (Ideal)',
    readabilityFieldName: 'words_per_sentence',
    readabilityScoreType: 'average',
    explanation: 'Average number of words per sentence. Target is 15-20 words for optimal readability.',
    remediationGuidelines: `## Words Per Sentence Improvement

### What It Means

Average number of words per sentence in your text.

### Why It Matters

Shorter sentences are easier to read and understand. This is one of the most important readability factors.

### Target Average

**Target:** 15-20 words per sentence

### Guidelines

- **10-15 words**: Very easy to read ⭐ **Excellent**
- **15-20 words**: Easy to read ⭐ **Target**
- **20-25 words**: Moderate difficulty
- **25-30 words**: Difficult to read
- **30+ words**: Very difficult

### How to Improve

- Break long sentences into shorter ones
- Remove unnecessary words
- Use punctuation effectively (commas, semicolons)
- Split complex sentences into multiple sentences

### Examples

\`\`\`
❌ Too long (35 words): "The comprehensive implementation of the new accessibility framework that we have developed over the past several months will facilitate improved user experiences for all visitors to our website."

✅ Better (18 words): "Our new accessibility framework improves user experiences. We developed it over several months."
\`\`\`

### Best Practices

- Aim for most sentences to be 15-20 words
- Occasional longer sentences are okay for variety
- Review and shorten sentences during editing
- Test readability regularly`,
    helpLink: 'https://readable.com/blog/how-many-words-per-sentence/'
  },
  {
    id: 'readability-sentences-per-paragraph',
    category: 'readability',
    columnName: 'Sentences Per Paragraph',
    readabilityMetric: 'Sentences Per Paragraph',
    readabilityDescription: 'Average number of sentences per paragraph',
    readabilityThreshold: '3-5 (Ideal)',
    readabilityFieldName: 'sentences_per_paragraph',
    readabilityScoreType: 'average',
    explanation: 'Average number of sentences per paragraph. Target is 3-5 sentences for optimal readability.',
    remediationGuidelines: `## Sentences Per Paragraph Improvement

### What It Means

Average number of sentences per paragraph.

### Why It Matters

Shorter paragraphs are easier to scan and understand. This is especially important for web content and digital reading.

### Target Average

**Target:** 3-5 sentences per paragraph

### Guidelines

- **3-5 sentences**: Ideal length ⭐ **Target**
- **5-7 sentences**: Acceptable
- **7+ sentences**: Too long - break up

### How to Improve

- Break long paragraphs into shorter ones
- One main idea per paragraph
- Use shorter paragraphs for web content
- Create visual breaks for readability

### Examples

\`\`\`
❌ Too long (8 sentences):
"The accessibility framework provides numerous benefits. It improves user experience. It ensures compliance with standards. It reduces legal risk. It increases user engagement. It supports diverse user needs. It enhances brand reputation. It demonstrates social responsibility."

✅ Better (split into 2 paragraphs):
"The accessibility framework provides numerous benefits. It improves user experience and ensures compliance with standards. It also reduces legal risk and increases user engagement.

The framework supports diverse user needs and enhances brand reputation. It demonstrates social responsibility."
\`\`\`

### Best Practices

- Keep most paragraphs to 3-5 sentences
- Break up dense content
- Use white space effectively
- Test visual appearance`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-reading-time',
    category: 'readability',
    columnName: 'Reading Time',
    readabilityMetric: 'Reading Time',
    readabilityDescription: 'Estimated time to read the text',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'reading_time',
    readabilityScoreType: 'time',
    explanation: 'Estimated reading time in format M:SS (e.g., "2:05" = 2 minutes 5 seconds). Based on average reading speed.',
    remediationGuidelines: `## Reading Time Guidelines

### What It Means

Estimated time for an average reader to read your text (based on ~200 words per minute reading speed).

### Why It Matters

Reading time helps readers understand content length and plan their time. It's useful for setting expectations.

### Considerations

- **Short**: < 1 minute (quick reads, summaries)
- **Medium**: 1-5 minutes (articles, blog posts)
- **Long**: 5+ minutes (comprehensive guides)

### How to Reduce Reading Time

- Write more concisely
- Remove redundant content
- Use bullet points and lists
- Break content into scannable sections

### Best Practices

- Display reading time for longer content
- Consider reader attention span
- Break long content into sections
- Provide summaries for longer pieces`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-speaking-time',
    category: 'readability',
    columnName: 'Speaking Time',
    readabilityMetric: 'Speaking Time',
    readabilityDescription: 'Estimated time to speak the text aloud',
    readabilityThreshold: 'Context-dependent',
    readabilityFieldName: 'speaking_time',
    readabilityScoreType: 'time',
    explanation: 'Estimated speaking time in format M:SS. Useful for presentations, videos, and audio content planning.',
    remediationGuidelines: `## Speaking Time Guidelines

### What It Means

Estimated time to speak your text aloud at average speaking pace (typically ~150 words per minute).

### Why It Matters

Speaking time helps plan presentations, videos, podcasts, and other spoken content.

### Use Cases

- **Presentations**: Plan slide timing
- **Videos**: Estimate video length
- **Audio content**: Plan podcast episodes
- **Accessibility**: Create audio versions

### Best Practices

- Plan content around speaking time limits
- Practice reading aloud for accurate timing
- Adjust pace for different audiences
- Consider pauses and emphasis`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-reach',
    category: 'readability',
    columnName: 'Reach',
    readabilityMetric: 'Reach',
    readabilityDescription: 'Percentage of addressable audience that can understand the content',
    readabilityThreshold: 'High (70%+)',
    readabilityFieldName: 'reach',
    readabilityScoreType: 'percentage',
    explanation: 'Reach indicates the percentage of your addressable audience that can understand the content. Higher reach means more accessible content.',
    remediationGuidelines: `## Reach Improvement

### What It Means

Percentage of your addressable audience that can understand the content.

### Why It Matters

Higher reach means your content is accessible to a larger portion of your audience. This improves engagement and effectiveness.

### Target Reach

**Target:** 70%+ (High reach)

### How to Improve Reach

- Simplify sentence structure
- Use common vocabulary
- Lower readability grade levels
- Test with target audience
- Remove complex jargon

### Best Practices

- Aim for high reach (70%+)
- Consider your audience's reading level
- Test content accessibility
- Monitor reach over time`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-reach-public',
    category: 'readability',
    columnName: 'Reach (General Public)',
    readabilityMetric: 'Reach (General Public)',
    readabilityDescription: 'Percentage of general public that can understand the content',
    readabilityThreshold: 'High (60%+)',
    readabilityFieldName: 'reach_public',
    readabilityScoreType: 'percentage',
    explanation: 'Reach indicates the percentage of the general public that can understand the content. Higher reach means broader accessibility.',
    remediationGuidelines: `## Public Reach Improvement

### What It Means

Percentage of the general public (not just your specific audience) that can understand the content.

### Why It Matters

Higher public reach ensures your content is accessible to a broader population, including those with different education levels.

### Target Reach

**Target:** 60%+ (Good public reach)

### How to Improve Public Reach

- Use simpler language
- Write at lower grade levels (6-8)
- Avoid specialized terminology
- Test with general public
- Focus on common vocabulary

### Best Practices

- Aim for broader accessibility
- Consider diverse audiences
- Test with general readers
- Simplify when possible`,
    helpLink: 'https://readable.com/'
  },
  {
    id: 'readability-plain-language',
    category: 'readability',
    columnName: 'Plain Language Guidelines',
    readabilityMetric: 'Plain Language',
    readabilityDescription: 'Guidelines for clear, accessible communication',
    readabilityThreshold: 'Follow all guidelines',
    readabilityFieldName: 'plain_language_score',
    readabilityScoreType: 'score',
    explanation: 'Comprehensive guidelines for writing in plain language that everyone can understand.',
    remediationGuidelines: `## Plain Language Guidelines

### What It Means

Writing principles for clear, accessible communication that everyone can understand.

### Why It Matters

Plain language improves comprehension, accessibility, and user experience. It ensures content is accessible to diverse audiences.

### Core Principles

1. **Use simple words** - Choose common words over complex ones
2. **Write short sentences** - Aim for 15-20 words average
3. **Use active voice** - "The team completed the task" not "The task was completed by the team"
4. **Avoid jargon** - Explain technical terms
5. **Use lists** - Break up complex information
6. **Test with users** - Get feedback from your audience

### Examples

\`\`\`
❌ Complex: "Utilize the aforementioned methodology to facilitate enhanced user engagement."

✅ Plain: "Use this method to help users engage more."
\`\`\`

### Best Practices

- Write for your audience's reading level
- Test content clarity
- Get user feedback
- Review and simplify regularly`,
    helpLink: 'https://www.plainlanguage.gov/guidelines/'
  }
];

export const GLOSSARY_DATA: TabData[] = [
  {
    id: 'wcag',
    name: 'WCAG 2.2',
    description: 'Web Content Accessibility Guidelines 2.2 success criteria for web accessibility compliance',
    rows: wcagRows
  },
  {
    id: 'pdfua',
    name: 'PDF/UA',
    description: 'PDF/Universal Accessibility validation rules based on ISO 14289-1 standard',
    rows: pdfuaRows
  },
  {
    id: 'wave',
    name: 'WAVE',
    description: 'WebAIM WAVE tool evaluation categories for web accessibility testing',
    rows: waveRows
  },
  {
    id: 'readability',
    name: 'Readability',
    description: 'Readability metrics and plain language guidelines for accessible content',
    rows: readabilityRows
  }
];
