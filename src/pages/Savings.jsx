import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiPlus, FiMinus, FiTrendingUp, FiEye, FiArrowRight } from 'react-icons/fi';
import { savingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Savings = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await savingsAPI.getMyAccounts();
      setAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccount(response.data[0]);
        fetchTransactions(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load savings accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId) => {
    try {
      const response = await savingsAPI.getTransactions(accountId);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!modalAmount || parseFloat(modalAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setModalLoading(true);
    try {
      await savingsAPI.deposit({
        account_id: selectedAccount.id,
        amount: parseFloat(modalAmount),
        payment_method: 'mpesa',
        description: 'Savings deposit',
      });
      toast.success(`KES ${parseFloat(modalAmount).toLocaleString()} deposited successfully!`);
      setShowDepositModal(false);
      setModalAmount('');
      fetchAccounts();
      if (selectedAccount) fetchTransactions(selectedAccount.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Deposit failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!modalAmount || parseFloat(modalAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(modalAmount) > selectedAccount?.available_balance) {
      toast.error('Insufficient funds');
      return;
    }

    setModalLoading(true);
    try {
      await savingsAPI.withdraw({
        account_id: selectedAccount.id,
        amount: parseFloat(modalAmount),
        payment_method: 'mpesa',
        description: 'Savings withdrawal',
      });
      toast.success(`KES ${parseFloat(modalAmount).toLocaleString()} withdrawn successfully!`);
      setShowWithdrawModal(false);
      setModalAmount('');
      fetchAccounts();
      if (selectedAccount) fetchTransactions(selectedAccount.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Withdrawal failed');
    } finally {
      setModalLoading(false);
    }
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'regular': return <FiDollarSign className="w-8 h-8 text-blue-600" />;
      case 'fixed_deposit': return <FiTrendingUp className="w-8 h-8 text-purple-600" />;
      default: return <FiDollarSign className="w-8 h-8 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Savings</h1>
          <p className="text-gray-600 mt-1">Manage your savings accounts and track your progress</p>
        </div>
        <Link to="/savings/open" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
          <FiPlus className="w-4 h-4 mr-2" /> Open New Account
        </Link>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12">
          <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No savings accounts yet</h3>
          <p className="text-gray-500 mb-6">Open your first savings account today</p>
          <Link to="/savings/open" className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Open an Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-gray-900 mb-3">Your Accounts</h2>
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  setSelectedAccount(account);
                  fetchTransactions(account.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAccount?.id === account.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getAccountTypeIcon(account.account_type)}
                    <div>
                      <p className="font-semibold text-gray-900">{account.account_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{account.account_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <FiEye className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">KES {account.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Interest: {account.interest_rate}% p.a.</p>
              </button>
            ))}
          </div>

          {/* Account Details */}
          {selectedAccount && (
            <div className="lg:col-span-2 space-y-6">
              {/* Account Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Current Balance</p>
                  <p className="text-2xl font-bold">KES {selectedAccount.balance.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Available Balance</p>
                  <p className="text-2xl font-bold">KES {selectedAccount.available_balance.toLocaleString()}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                >
                  <FiPlus className="w-5 h-5 mr-2" /> Deposit
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center"
                >
                  <FiMinus className="w-5 h-5 mr-2" /> Withdraw
                </button>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Transaction History</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No transactions yet</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {transactions.map((txn) => (
                        <div key={txn.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{txn.transaction_type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(txn.transaction_date).toLocaleDateString()} • {txn.payment_method || 'cash'}
                            </p>
                            {txn.description && <p className="text-xs text-gray-400 mt-1">{txn.description}</p>}
                          </div>
                          <div className={`text-right ${txn.transaction_type === 'deposit' || txn.transaction_type === 'interest' ? 'text-green-600' : 'text-red-600'}`}>
                            <p className="font-semibold">
                              {txn.transaction_type === 'deposit' || txn.transaction_type === 'interest' ? '+' : '-'} 
                              KES {txn.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Balance: KES {txn.balance_after.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Total Deposits</p>
                  <p className="text-xl font-bold text-gray-900">KES {selectedAccount.total_deposits?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Interest Earned</p>
                  <p className="text-xl font-bold text-green-600">KES {selectedAccount.total_interest_earned?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDepositModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Make a Deposit</h2>
            <p className="text-gray-600 mb-4">Account: {selectedAccount?.account_name}</p>
            <input
              type="number"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              placeholder="Enter amount (KES)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button onClick={handleDeposit} disabled={modalLoading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {modalLoading ? 'Processing...' : 'Deposit'}
              </button>
              <button onClick={() => setShowDepositModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>
            <p className="text-gray-600 mb-2">Account: {selectedAccount?.account_name}</p>
            <p className="text-sm text-gray-500 mb-4">Available Balance: KES {selectedAccount?.available_balance?.toLocaleString()}</p>
            <input
              type="number"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              placeholder="Enter amount (KES)"
              max={selectedAccount?.available_balance}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button onClick={handleWithdraw} disabled={modalLoading} className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50">
                {modalLoading ? 'Processing...' : 'Withdraw'}
              </button>
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;