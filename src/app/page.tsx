"use client";
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { GlossaryHeader } from '@/components/glossary/GlossaryHeader';
import { OnboardingTip } from '@/components/glossary/OnboardingTip';
import { GlobalSearch } from '@/components/glossary/GlobalSearch';
import { GlossaryTabs } from '@/components/glossary/GlossaryTabs';
import { GLOSSARY_DATA } from '@/lib/glossary-data';

export default function GuidelinesPage() {
  const [activeTab, setActiveTab] = useState('wcag');
  const [highlightedRowId, setHighlightedRowId] = useState<string | undefined>();
  const [expandedRowId, setExpandedRowId] = useState<string | undefined>();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setHighlightedRowId(undefined);
    setExpandedRowId(undefined);
  };

  const handleRowExpand = (rowId: string) => {
    if (expandedRowId === rowId) {
      setExpandedRowId(undefined);
    } else {
      setExpandedRowId(rowId);
    }
  };

  const handleResultClick = (tabId: string, rowId: string) => {
    setActiveTab(tabId);
    setHighlightedRowId(rowId);
    setExpandedRowId(rowId);
    
    // Scroll to the table after a brief delay to ensure tab switch completes
    setTimeout(() => {
      const element = document.getElementById(`row-${rowId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Guidelines & Resources</h1>
            <Badge variant="outline" className="text-sm">
              <BookOpen className="h-3 w-3 mr-1" />
              Knowledge Base
            </Badge>
          </div>
        </div>
      </div>

      <GlossaryHeader />
      
      <main className="container mx-auto px-4 py-6">
        <OnboardingTip />
        
        <div className="mb-6">
          <GlobalSearch 
            data={GLOSSARY_DATA}
            onResultClick={handleResultClick}
          />
        </div>
        
        <GlossaryTabs
          data={GLOSSARY_DATA}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          highlightedRowId={highlightedRowId}
          onRowExpand={handleRowExpand}
          expandedRowId={expandedRowId}
        />
      </main>
    </div>
  );
}

