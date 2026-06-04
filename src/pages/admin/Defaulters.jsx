import { useState, useEffect } from 'react';
import { FiAlertCircle, FiUser, FiPhone, FiMail, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Defaulters = () => {
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState([]);
  const [overdueSummary, setOverdueSummary] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [defaultersRes, summaryRes] = await Promise.all([
        adminAPI.getDefaulters(),
        adminAPI.getOverdueSummary(),
      ]);
      setDefaulters(defaultersRes.data);
      setOverdueSummary(summaryRes.data);
    } catch (error) {
      toast.error('Failed to load defaulter data');
    } finally {
      setLoading(false);
    }
  };

  const getDefaulterCategoryBadge = (category) => {
    const badges = {
      warning: 'bg-yellow-100 text-yellow-800',
      defaulter: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
      legal_action: 'bg-purple-100 text-purple-800',
      blacklisted: 'bg-gray-100 text-gray-800',
    };
    return badges[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      warning: '⚠️ Warning',
      defaulter: '📋 Defaulter',
      critical: '🔴 Critical',
      legal_action: '⚖️ Legal Action',
      blacklisted: '⛔ Blacklisted',
    };
    return labels[category] || category;
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Defaulters Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage members with overdue loans</p>
      </div>

      {/* Summary Stats */}
      {overdueSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500">Total Overdue</p>
            <p className="text-xl font-bold text-gray-900">{overdueSummary.total_overdue_loans}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500">Overdue Amount</p>
            <p className="text-xl font-bold text-red-600">KES {overdueSummary.total_overdue_amount?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500">Penalties Accrued</p>
            <p className="text-xl font-bold text-orange-600">KES {overdueSummary.total_penalty_accrued?.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-sm p-4 border border-yellow-200">
            <p className="text-xs text-yellow-700">Warning</p>
            <p className="text-xl font-bold text-yellow-800">{overdueSummary.warning_count || 0}</p>
          </div>
          <div className="bg-red-50 rounded-xl shadow-sm p-4 border border-red-200">
            <p className="text-xs text-red-700">Critical</p>
            <p className="text-xl font-bold text-red-800">{overdueSummary.critical_count || 0}</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-xs text-gray-700">Legal Action</p>
            <p className="text-xl font-bold text-gray-800">{overdueSummary.legal_action_count || 0}</p>
          </div>
        </div>
      )}

      {/* Defaulters Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Defaulters List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty Accrued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {defaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No defaulters found
                  </td>
                </tr>
              ) : (
                defaulters.map((defaulter) => (
                  <tr key={defaulter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{defaulter.member_name}</p>
                          <p className="text-xs text-gray-500">{defaulter.member_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {defaulter.loan_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDefaulterCategoryBadge(defaulter.defaulter_category)}`}>
                        {getCategoryLabel(defaulter.defaulter_category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-red-600">{defaulter.days_overdue}</span> days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {defaulter.total_overdue_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                      KES {defaulter.total_penalty_accrued?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {defaulter.is_blacklisted ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-white">Blacklisted</span>
                      ) : defaulter.has_legal_action ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Legal Action</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Active</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <FiShield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Automatic Penalty Calculation</p>
            <p className="text-sm text-blue-700 mt-1">
              Penalties are calculated automatically at 1% per day on overdue amounts, capped at 50% of the amount due.
              Members are categorized based on days overdue: Warning (7+), Defaulter (30+), Critical (60+), Legal Action (60+), Blacklisted (90+).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Defaulters;