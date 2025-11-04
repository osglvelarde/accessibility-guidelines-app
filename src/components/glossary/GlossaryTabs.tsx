import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabData } from '@/lib/types/glossary';
import { GlossaryTable } from './GlossaryTable';

interface GlossaryTabsProps {
  data: TabData[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  highlightedRowId?: string;
  onRowExpand: (rowId: string) => void;
  expandedRowId?: string;
}

export const GlossaryTabs = ({ 
  data, 
  activeTab, 
  onTabChange, 
  highlightedRowId,
  onRowExpand,
  expandedRowId
}: GlossaryTabsProps) => {
  
  const getTabColor = (tabId: string) => {
    const colorMap: Record<string, string> = {
      'wcag': 'data-[state=active]:text-tab-wcag data-[state=active]:border-tab-wcag hover:text-tab-wcag/80',
      'wave': 'data-[state=active]:text-tab-wave data-[state=active]:border-tab-wave hover:text-tab-wave/80',
      'readability': 'data-[state=active]:text-tab-readability data-[state=active]:border-tab-readability hover:text-tab-readability/80',
      'pdfua': 'data-[state=active]:text-tab-pdfua data-[state=active]:border-tab-pdfua hover:text-tab-pdfua/80',
    };
    return colorMap[tabId] || '';
  };
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="h-auto p-2 bg-muted/30 rounded-lg grid w-full grid-cols-4 lg:w-auto lg:flex lg:gap-2">
        {data.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className={`
              text-xs lg:text-sm font-medium transition-all duration-200 
              px-3 py-2.5 lg:px-4 lg:py-3 rounded-md
              border-2 border-transparent
              hover:bg-background/80 hover:shadow-sm
              data-[state=active]:bg-background 
              data-[state=active]:shadow-md
              data-[state=active]:border-current
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${getTabColor(tab.id)}
            `}
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {data.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{tab.name}</h2>
              <p className="text-muted-foreground">{tab.description}</p>
            </div>
            
            <GlossaryTable 
              rows={tab.rows}
              highlightedRowId={highlightedRowId}
              onRowExpand={onRowExpand}
              expandedRowId={expandedRowId}
              tableName={tab.name}
              category={tab.id}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
