
import React from 'react';
import { Home, List, Calendar, BookmarkPlus, UserCircle, Video, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const collapsed = state === 'collapsed';

  const navigationItems = [
    { 
      title: t('nav.browseMeetings'), 
      path: '/', 
      icon: Home 
    },
    { 
      title: t('nav.myLinks'), 
      path: '/my-links', 
      icon: List,
      protected: true
    },
    { 
      title: t('nav.joinMeetings'), 
      path: '/join', 
      icon: Calendar,
      protected: true
    },
    { 
      title: t('nav.savedLinks'), 
      path: '/saved', 
      icon: BookmarkPlus,
      protected: true
    },
    { 
      title: t('nav.profile'), 
      path: '/profile', 
      icon: UserCircle,
      protected: true
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  const filteredItems = navigationItems.filter(item => 
    !item.protected || isAuthenticated
  );

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-200`}>
      <SidebarHeader className="p-4">
        <Link to="/" className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shrink-0">
            <Video className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className={`text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('app.title')}
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && <LanguageSwitcher />}
          {collapsed && <LanguageSwitcher />}
        </div>
        
        {isAuthenticated && (
          <div className="space-y-2">
            {!collapsed && user && (
              <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                {user.username}
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className={`w-full ${collapsed ? 'px-2' : 'justify-start'}`}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('nav.logout')}</span>}
            </Button>
          </div>
        )}
        
        {!isAuthenticated && !collapsed && (
          <Link to="/auth">
            <Button size="sm" className="w-full">
              {t('nav.login')}
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
