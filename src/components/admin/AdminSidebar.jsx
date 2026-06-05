import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiBriefcase, FiBell, FiBarChart2, 
  FiSettings, FiDollarSign, FiShield, FiFileText, 
  FiCreditCard, FiTarget, FiAlertCircle, FiLogOut,
  FiChevronDown, FiChevronRight
} from 'react-icons/fi';
import { useState } from 'react';

const AdminSidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    loans: true,
    collections: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { name: 'Member Management', path: '/admin/members', icon: FiUsers },
    {
      name: 'Loan Management',
      icon: FiBriefcase,
      submenu: true,
      menuKey: 'loans',
      items: [
        { name: 'Loan Products', path: '/admin/loan-products', icon: FiCreditCard },
        { name: 'Loan Applications', path: '/admin/loan-applications', icon: FiTarget },
        { name: 'Loan Approvals', path: '/admin/loan-approvals', icon: FiBell },
        { name: 'Active Loans', path: '/admin/active-loans', icon: FiDollarSign },
      ]
    },
    { name: 'Savings Management', path: '/admin/savings', icon: FiDollarSign },
    {
      name: 'Collection Management',
      icon: FiAlertCircle,
      submenu: true,
      menuKey: 'collections',
      items: [
        { name: 'Active Cases', path: '/admin/collections', icon: FiAlertCircle },
        { name: 'Payment Plans', path: '/admin/payment-plans', icon: FiFileText },
        { name: 'Defaulters', path: '/admin/defaulters', icon: FiAlertCircle },
      ]
    },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: FiBarChart2 },
    { name: 'Penalty Settings', path: '/admin/penalty-settings', icon: FiSettings },
    { name: 'System Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <aside className="w-72 bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0">
      {/* Admin Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiShield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-gray-400">SaccoFlow Administration</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{getInitials()}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{user?.full_name || 'Admin User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>

      {/* Navigation - with scroll only here */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</p>
        </div>
        
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.menuKey)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-gray-800 ${
                    expandedMenus[item.menuKey] ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {expandedMenus[item.menuKey] ? 
                    <FiChevronDown className="w-4 h-4" /> : 
                    <FiChevronRight className="w-4 h-4" />
                  }
                </button>
                {expandedMenus[item.menuKey] && (
                  <div className="bg-gray-800/50">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`flex items-center space-x-3 px-4 py-2 pl-12 text-sm transition-colors hover:bg-gray-700 ${
                          isActive(subItem.path) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors hover:bg-gray-800 ${
                  isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button - fixed at bottom */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;