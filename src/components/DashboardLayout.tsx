import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, FileText, Users, UserCog, Shield } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const { open } = useSidebar();

  const citizenLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/submit-complaint', label: 'Submit Complaint', icon: FileText },
  ];

  const officerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/my-complaints', label: 'My Complaints', icon: FileText },
  ];

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/all-complaints', label: 'All Complaints', icon: FileText },
    { to: '/officers', label: 'Manage Officers', icon: UserCog },
    { to: '/citizens', label: 'Manage Citizens', icon: Users },
  ];

  const links =
    user?.role === 'admin' ? adminLinks :
    user?.role === 'officer' ? officerLinks :
    citizenLinks;

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {open && <span className="font-bold text-lg">CMS</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={link.to}
                      end
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <link.icon className="h-4 w-4" />
                      {open && <span>{link.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="mb-3">
            {open && (
              <>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size={open ? 'default' : 'icon'}
            onClick={logout}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card flex items-center px-6">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold text-lg">Complaint Management System</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
