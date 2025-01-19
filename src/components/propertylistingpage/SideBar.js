import React from 'react';
import { LayoutDashboard, Building2, ClipboardList, Users2, Building, UserCog, Database, FileText } from 'lucide-react';

export function SideBar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Property Listings', path: '/properties', active: true },
    { icon: ClipboardList, label: 'Requests', path: '/requests' },
    { icon: Users2, label: 'Staff Assignment', path: '/staff' },
    { icon: Building, label: 'Communities', path: '/communities' },
    { icon: UserCog, label: 'User Management', path: '/users' },
    { icon: Database, label: 'DB Tables', path: '/db-tables' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#1e2837] text-gray-300">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-700/50 px-6">
        <div className="text-blue-500 font-bold text-2xl">
          Logo
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 py-4">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              item.active
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

