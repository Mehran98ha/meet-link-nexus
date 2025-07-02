
import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const Saved = () => {
  // This is a placeholder component - in a real implementation, we would have a backend system
  // for users to save/bookmark links they want to access frequently.
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Links</h1>
            <p className="text-gray-500">Bookmark important meeting links for quick access</p>
          </div>
        </div>
      </div>

      {/* Main Content - placeholder for future implementation */}
      <div className="container py-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <Bookmark className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 text-lg">No saved links yet</h3>
          <p className="text-gray-500 mt-2 mb-6">
            Start bookmarking important meeting links for quick access
          </p>
          <Button>Browse Meetings</Button>
        </div>

        {/* Example of what saved links could look like */}
        <div className="mt-8 border-t pt-8 pb-4">
          <h3 className="font-medium text-gray-500">Preview of saved links functionality</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-gray-900">Weekly Team Meeting</h3>
                <p className="text-sm text-gray-500">by John Doe</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Our regular weekly sync to discuss project progress and upcoming tasks
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button disabled className="inline-flex items-center">
                  <span>Join</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-gray-900">Client Presentation</h3>
                <p className="text-sm text-gray-500">by Jane Smith</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Monthly presentation with our key client to review deliverables
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button disabled className="inline-flex items-center">
                  <span>Join</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Saved;
