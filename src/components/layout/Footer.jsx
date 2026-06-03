import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">SaccoFlow</h3>
            <p className="text-sm">Empowering SACCOs with modern technology. Manage members, loans, savings, and more.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-400"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-blue-400"><FaTwitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-blue-400"><FaLinkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#about" className="hover:text-blue-400">About Us</a></li>
              <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Loan Management</a></li>
              <li><a href="#" className="hover:text-blue-400">Savings Accounts</a></li>
              <li><a href="#" className="hover:text-blue-400">MPESA Integration</a></li>
              <li><a href="#" className="hover:text-blue-400">Financial Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2"><MdPhone className="w-4 h-4" /><span>+254 700 000 000</span></li>
              <li className="flex items-center space-x-2"><MdEmail className="w-4 h-4" /><span>info@saccoflow.com</span></li>
              <li className="flex items-center space-x-2"><MdLocationOn className="w-4 h-4" /><span>Nairobi, Kenya</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} SaccoFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;