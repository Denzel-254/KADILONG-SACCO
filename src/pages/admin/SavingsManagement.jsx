import { useState, useEffect } from 'react';
import { FiDollarSign, FiUsers, FiTrendingUp, FiEye, FiDownload, FiCalendar, FiSearch } from 'react-icons/fi';
import { savingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SavingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, accountsRes] = await Promise.all([
        savingsAPI.getAdminDashboard(),
        savingsAPI.getAllAccounts(),
      ]);
      setDashboard(dashboardRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Error fetching savings data:', error);
      toast.error('Failed to load savings data');
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      regular: 'Regular Savings',
      fixed_deposit: 'Fixed Deposit',
      share_capital: 'Share Capital',
    };
    return labels[type] || type;
  };

  const filteredAccounts = accounts.filter(account =>
    account.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.member_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Savings Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage member savings accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.total_savings_accounts || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-green-600">KES {dashboard?.total_balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deposits Today</p>
              <p className="text-2xl font-bold text-blue-600">KES {dashboard?.total_deposits_today?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Withdrawals Today</p>
              <p className="text-2xl font-bold text-orange-600">KES {dashboard?.total_withdrawals_today?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiCalendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts by Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboard?.accounts_by_type && Object.entries(dashboard.accounts_by_type).map(([type, count]) => (
          <div key={type} className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">{getAccountTypeLabel(type)}</p>
            <p className="text-2xl font-bold text-gray-900">{count} Accounts</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by account number, name, or member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No savings accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{account.account_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.member_name}</p>
                        <p className="text-xs text-gray-500">{account.member_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.account_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getAccountTypeLabel(account.account_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KES {account.balance?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {account.interest_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowAccountModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEye className="w-4 h-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details Modal */}
      {showAccountModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAccountModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                <button onClick={() => setShowAccountModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Member</p>
                  <p className="font-semibold">{selectedAccount.member_name}</p>
                  <p className="text-xs text-gray-400">{selectedAccount.member_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-semibold">{selectedAccount.account_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="font-semibold">{selectedAccount.account_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Type</p>
                  <p className="font-semibold capitalize">{selectedAccount.account_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${selectedAccount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedAccount.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Opened Date</p>
                  <p className="font-semibold">{new Date(selectedAccount.opened_date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">KES {selectedAccount.balance?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Deposits</p>
                  <p className="font-semibold">KES {selectedAccount.total_deposits?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Withdrawals</p>
                  <p className="font-semibold">KES {selectedAccount.total_withdrawals?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interest Earned</p>
                  <p className="font-semibold text-green-600">KES {selectedAccount.total_interest_earned?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interest Rate</p>
                  <p className="font-semibold">{selectedAccount.interest_rate}% p.a.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsManagement;