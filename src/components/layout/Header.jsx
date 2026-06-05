import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiHome, FiCreditCard, FiDollarSign, FiShield, 
  FiUsers, FiBell, FiSettings, FiBarChart2, FiBriefcase, FiFileText, FiLogOut, FiUser
} from 'react-icons/fi';

const Header = ({ isAuthenticated, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userRole = user?.role || 'member';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const publicLinks = [
    { name: 'Home', href: '/', isScroll: false },
    { name: 'Features', href: 'features', isScroll: true },
    { name: 'How It Works', href: 'how-it-works', isScroll: true },
    { name: 'About', href: 'about', isScroll: true },
    { name: 'Pricing', href: 'pricing', isScroll: true },
  ];

  const memberLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'My Loans', href: '/loans', icon: FiCreditCard },
    { name: 'My Savings', href: '/savings', icon: FiDollarSign },
    { name: 'Repayments', href: '/repayments', icon: FiCreditCard },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: FiShield },
    { name: 'Member Management', href: '/admin/members', icon: FiUsers },
    { name: 'Loan Approvals', href: '/admin/loan-approvals', icon: FiBell },
    { name: 'Reports', href: '/admin/reports', icon: FiBarChart2 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  // Smooth scroll function for anchor links
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      default: return 'Member';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">SaccoFlow</span>
            {isAuthenticated && (
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}>
                {getRoleDisplayName()}
              </span>
            )}
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Beta</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              publicLinks.map((link) => (
                link.isScroll ? (
                  <button
                    key={link.name}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                )
              ))
            ) : (
              <>
                {memberLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                ))}
                {isAdmin && adminLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                    <FiShield className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">
                      {userRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {getInitials()}
                    </div>
                    <span className="text-sm text-gray-700 hidden lg:inline">{user?.full_name?.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRoleBadgeColor()}`}>
                          {getRoleDisplayName()}
                        </span>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <FiUser className="w-4 h-4 mr-2" /> Profile Settings
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t max-h-[80vh] overflow-y-auto">
            {!isAuthenticated ? (
              <>
                {publicLinks.map((link) => (
                  link.isScroll ? (
                    <button
                      key={link.name}
                      onClick={(e) => {
                        handleScrollToSection(e, link.href);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-gray-600 hover:text-blue-600"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block py-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                <div className="pt-4 space-y-2">
                  <Link to="/login" className="block border border-gray-300 text-center py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="block bg-blue-600 text-white text-center py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 pb-4 border-b mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {getInitials()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {memberLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    <link.icon className="w-4 h-4" /><span>{link.name}</span>
                  </Link>
                ))}
                {isAdmin && adminLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    <link.icon className="w-4 h-4" /><span>{link.name}</span>
                  </Link>
                ))}
                <Link to="/profile" className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  <FiUser className="w-4 h-4" /><span>Profile Settings</span>
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-2 w-full mt-4 pt-4 border-t text-red-600">
                  <FiLogOut className="w-4 h-4" /><span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;