import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, Search, MessageSquare, ExternalLink } from 'lucide-react';

export const OnboardingTip = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 p-4 bg-primary/5 border-primary/20">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <h3 className="font-medium text-sm">Getting Started</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Search className="h-3 w-3" />
              <span>Type to search across all accessibility guidelines</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              <span>Click any row to see details and ask the AI assistant questions</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              <span>Need help? Chat with our AI assistant for personalized guidance</span>
            </div>
          </div>
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a 
                href="https://iaccessible.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-3 w-3" />
                Open AI Assistant
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
