# Accessibility Guidelines & Resources

A standalone Next.js application providing comprehensive accessibility guidelines and resources for WCAG 2.2, Section 508, ADA Title II, PDF/UA compliance, and more.

## Features

- **WCAG 2.2 Guidelines**: Complete success criteria with remediation guidelines
- **PDF/UA Compliance**: PDF accessibility validation rules based on ISO 14289-1
- **WAVE Tool Reference**: WebAIM WAVE evaluation categories
- **Readability Metrics**: Plain language guidelines and readability scores
- **Global Search**: Search across all guidelines and resources
- **AI Assistant Integration**: Link to accessibility chatbot for support

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

This app is ready to deploy on Vercel:

1. **Push to GitHub**:
   - Push this repository to your GitHub account

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app
   - Click "Deploy"

No special configuration needed! Vercel will handle everything automatically.

### Or use Vercel CLI:
```bash
vercel
```

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main guidelines page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── glossary/        # Glossary components
│   │   └── ui/             # UI components
│   └── lib/
│       ├── types/           # TypeScript types
│       ├── glossary-data.ts # All guidelines data
│       ├── wcag-complete.ts # WCAG criteria data
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features

- ✅ No authentication required - completely public
- ✅ No external dependencies on other applications
- ✅ Self-contained with all necessary data
- ✅ Fully accessible and responsive design
- ✅ Dark mode support

## Dependencies

This app uses:
- **Next.js 15** for the React framework
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible UI components
- **React Markdown** for rendering guidelines content
- **React Syntax Highlighter** for code examples

## License

Same as the parent project.

## Support

For questions or issues, please open an issue on the repository.
