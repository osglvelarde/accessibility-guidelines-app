import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export const GlossaryHeader = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4">
          
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://www.section508.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Official Section 508
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://www.w3.org/WAI/WCAG22/quickref/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                WCAG Overview
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://www.w3.org/TR/WCAG22/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                WCAG 2.2 Specs
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
