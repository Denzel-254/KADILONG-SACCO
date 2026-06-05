import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiCreditCard, FiDollarSign, FiAlertCircle, 
  FiTrendingUp, FiClock, FiCheckCircle, FiRefreshCw 
} from 'react-icons/fi';
import { adminAPI, reportAPI, savingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [savingsStats, setSavingsStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showToast = false) => {
    setLoading(true);
    try {
      const [kpiRes, pendingLoansRes, overdueRes, savingsRes] = await Promise.all([
        reportAPI.getKPIDashboard(new Date().toISOString().split('T')[0]),
        adminAPI.getPendingLoans(),
        adminAPI.getOverdueLoans(),
        savingsAPI.getAdminDashboard(),
      ]);

      setKpiData(kpiRes.data);
      setPendingApprovals(pendingLoansRes.data || []);
      setOverdueLoans(overdueRes.data?.overdue_loans || []);
      setSavingsStats(savingsRes.data);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success('Dashboard refreshed successfully!');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (showToast) {
        toast.error('Failed to refresh dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
    setRefreshing(false);
  };

  const stats = [
    {
      title: 'Total Members',
      value: kpiData?.total_members?.toLocaleString() || '0',
      change: '+12%',
      icon: FiUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Loans',
      value: kpiData?.active_loans?.toLocaleString() || '0',
      change: '+5%',
      icon: FiCreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Loan Portfolio',
      value: `KES ${kpiData?.total_loan_portfolio?.toLocaleString() || '0'}`,
      change: '+8%',
      icon: FiDollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Savings',
      value: `KES ${savingsStats?.total_balance?.toLocaleString() || '0'}`,
      change: '+3%',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const getPendingCount = () => pendingApprovals.length;
  const getOverdueCount = () => overdueLoans.length;
  const getTotalOverdueAmount = () => overdueLoans.reduce((sum, loan) => sum + (loan.amount_overdue || 0), 0);

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your SACCO today.</p>
          <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Repayment Rate</p>
          <p className="text-3xl font-bold mt-2">{kpiData?.loan_repayment_rate || 0}%</p>
          <div className="mt-3 w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: `${kpiData?.loan_repayment_rate || 0}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Portfolio at Risk</p>
          <p className="text-3xl font-bold mt-2">{kpiData?.portfolio_at_risk || 0}%</p>
          <div className="mt-3 w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: `${Math.min(kpiData?.portfolio_at_risk || 0, 100)}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Pending Approvals</p>
          <p className="text-3xl font-bold mt-2">{getPendingCount()}</p>
          <p className="text-xs opacity-75 mt-1">Loan applications awaiting review</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90">Overdue Loans</p>
          <p className="text-3xl font-bold mt-2">{getOverdueCount()}</p>
          <p className="text-xs opacity-75 mt-1">KES {getTotalOverdueAmount().toLocaleString()} total</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Loan Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Pending Loan Applications</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{getPendingCount()} pending</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiCheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                No pending applications
              </div>
            ) : (
              pendingApprovals.slice(0, 5).map((loan) => (
                <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{loan.loan_number}</p>
                    <p className="text-sm text-gray-500">KES {loan.amount_applied?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{new Date(loan.applied_date).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Loans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Overdue Loans</h2>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{getOverdueCount()} overdue</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {overdueLoans.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiCheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                No overdue loans
              </div>
            ) : (
              overdueLoans.slice(0, 5).map((loan) => (
                <div key={loan.loan_id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{loan.loan_number}</p>
                    <p className="text-sm text-red-600">KES {loan.amount_overdue?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{loan.days_overdue} days overdue</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    loan.days_overdue > 90 ? 'bg-gray-800 text-white' :
                    loan.days_overdue > 60 ? 'bg-red-600 text-white' :
                    loan.days_overdue > 30 ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {loan.days_overdue > 90 ? 'Critical' :
                     loan.days_overdue > 60 ? 'Severe' :
                     loan.days_overdue > 30 ? 'Overdue' : 'Warning'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/admin/loan-approvals" className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition group">
              <span className="text-blue-700">Review Pending Loan Applications</span>
              <FiAlertCircle className="w-5 h-5 text-blue-700 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/admin/members" className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition group">
              <span className="text-green-700">Add New Member</span>
              <FiUsers className="w-5 h-5 text-green-700 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/admin/reports" className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition group">
              <span className="text-purple-700">Generate Reports</span>
              <FiTrendingUp className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/admin/defaulters" className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition group">
              <span className="text-red-700">View Overdue Loans</span>
              <FiClock className="w-5 h-5 text-red-700 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Savings Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Savings Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Total Accounts</p>
                <p className="text-xl font-bold text-blue-600">{savingsStats?.total_savings_accounts || 0}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600">Today's Deposits</p>
                <p className="text-xl font-bold text-green-600">KES {savingsStats?.total_deposits_today?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className="space-y-2">
              {savingsStats?.accounts_by_type && Object.entries(savingsStats.accounts_by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{count} accounts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Details */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpiData?.kpis?.map((kpi, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">{kpi.name}</p>
                <p className="text-xl font-bold text-gray-900">{kpi.value} {kpi.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;