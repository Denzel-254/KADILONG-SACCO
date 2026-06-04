import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiTrendingUp, FiClock, FiArrowRight, FiPlus } from 'react-icons/fi';
import { loanAPI, savingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loanSummary, setLoanSummary] = useState(null);
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, savingsRes, loansRes] = await Promise.all([
        loanAPI.getLoanSummary(),
        savingsAPI.getMyAccounts(),
        loanAPI.getMyLoans(),
      ]);
      setLoanSummary(summaryRes.data);
      setSavingsAccounts(savingsRes.data);
      setRecentLoans(loansRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Borrowed',
      value: `KES ${loanSummary?.summary?.total_borrowed?.toLocaleString() || '0'}`,
      icon: FiCreditCard,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Repaid',
      value: `KES ${loanSummary?.summary?.total_repaid?.toLocaleString() || '0'}`,
      icon: FiTrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Outstanding Balance',
      value: `KES ${loanSummary?.summary?.total_outstanding?.toLocaleString() || '0'}`,
      icon: FiDollarSign,
      color: 'bg-orange-500',
    },
    {
      title: 'Savings Balance',
      value: `KES ${savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}`,
      icon: FiClock,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your financial activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Loan Portfolio</h2>
              <Link to="/loans" className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                View All <FiArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Repayment Progress</span>
                <span className="text-gray-900 font-semibold">{loanSummary?.summary?.repayment_progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${loanSummary?.summary?.repayment_progress || 0}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {loanSummary?.upcoming_payments?.slice(0, 2).map((payment, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Installment {payment.installment_number}</p>
                    <p className="text-xs text-gray-500">Due: {payment.due_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">KES {payment.amount_due.toLocaleString()}</p>
                    <p className="text-xs text-orange-600">{payment.days_until_due} days left</p>
                  </div>
                </div>
              ))}
              {(!loanSummary?.upcoming_payments || loanSummary.upcoming_payments.length === 0) && (
                <p className="text-gray-500 text-center py-4">No upcoming payments</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/loans/apply" className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-blue-700">Apply for Loan</span>
              <FiPlus className="w-5 h-5 text-blue-700" />
            </Link>
            <Link to="/savings/deposit" className="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <span className="text-green-700">Make a Deposit</span>
              <FiDollarSign className="w-5 h-5 text-green-700" />
            </Link>
            <Link to="/repayments" className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <span className="text-purple-700">Make a Payment</span>
              <FiCreditCard className="w-5 h-5 text-purple-700" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;