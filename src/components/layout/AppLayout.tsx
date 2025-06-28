
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, UserCircle, BookmarkPlus, Calendar, List, Menu, X, Video, LogOut } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      name: "Browse Meetings", 
      path: "/", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: "My Links", 
      path: "/my-links", 
      icon: <List className="h-5 w-5" /> 
    },
    { 
      name: "Join Meetings", 
      path: "/join", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: "Saved Links", 
      path: "/saved", 
      icon: <BookmarkPlus className="h-5 w-5" /> 
    },
    { 
      name: "Profile", 
      path: "/profile", 
      icon: <UserCircle className="h-5 w-5" /> 
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile Drawer Trigger */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-bold text-lg">Meet Link Meetly</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 py-4">
                    <nav className="flex flex-col gap-1 px-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                            isActivePath(item.path) 
                              ? "bg-blue-50 text-blue-600" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          <span className={isActivePath(item.path) ? "text-blue-600" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="justify-start px-3 py-2 h-auto mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                      </Button>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="font-semibold text-lg md:text-xl flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                Meet Link Meetly
              </span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-sm text-gray-600">
              Welcome, {user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r bg-white">
          <div className="p-4">
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200",
                    isActivePath(item.path) 
                      ? "bg-blue-50 text-blue-600" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full transition-all",
                    isActivePath(item.path) 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 z-30 w-full border-t bg-white shadow-sm">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span className={cn(
                "transition-colors", 
                isActivePath(item.path) ? "text-blue-600" : "text-gray-500"
              )}>
                {item.icon}
              </span>
              <span className={cn(
                "text-xs", 
                isActivePath(item.path) ? "text-blue-600 font-medium" : "text-gray-600"
              )}>
                {item.name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
