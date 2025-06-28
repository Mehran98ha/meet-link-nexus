
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, UserCircle, LogIn, Menu, X, Video } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsSheetOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/auth');
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Trigger */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
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
                  <div className="flex-1 py-4 px-2">
                    <div className="space-y-2">
                      <Link
                        to="/"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-600"
                      >
                        <Home className="h-5 w-5" />
                        <span className="font-medium">Browse Meets</span>
                      </Link>
                      
                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/my-links"
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                          >
                            <UserCircle className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">My Account</span>
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start px-3 py-2 h-auto"
                          >
                            <LogIn className="h-5 w-5 text-gray-500 mr-3" />
                            <span className="font-medium">Logout</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={handleLoginClick}
                          className="w-full justify-start px-3 py-2 h-auto"
                        >
                          <LogIn className="h-5 w-5 text-gray-500 mr-3" />
                          <span className="font-medium">Login / Sign Up</span>
                        </Button>
                      )}
                    </div>
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <Link to="/my-links">
                  <Button variant="outline" size="sm">
                    <UserCircle className="h-4 w-4 mr-2" />
                    My Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleLoginClick} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container text-center text-sm text-gray-600">
          <p>© 2024 Meet Link Meetly. Share your meeting links with ease.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
