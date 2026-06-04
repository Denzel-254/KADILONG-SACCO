import { useState, useEffect } from 'react';
import { FiBriefcase, FiUser, FiDollarSign, FiClock, FiAlertCircle, FiCheckCircle, FiPhone, FiMail, FiEye } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ActiveCases = () => {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await adminAPI.getCollectionCases();
      setCases(response.data || []);
    } catch (error) {
      console.error('Error fetching collection cases:', error);
      toast.error('Failed to load collection cases');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      written_off: 'bg-gray-100 text-gray-800',
      legal_action: 'bg-purple-100 text-purple-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Active Collection Cases</h1>
        <p className="text-gray-600 mt-1">Manage and track debt collection activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Cases</p>
              <p className="text-2xl font-bold text-yellow-600">{cases.filter(c => c.status === 'open').length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{cases.filter(c => c.status === 'in_progress').length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Debt</p>
              <p className="text-2xl font-bold text-red-600">
                KES {cases.reduce((sum, c) => sum + (c.current_debt_amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No active collection cases
                  </td>
                </tr>
              ) : (
                cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{caseItem.case_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Member</p>
                          <p className="text-xs text-gray-500">ID: {caseItem.member_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{caseItem.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      KES {caseItem.current_debt_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-red-600">{caseItem.days_overdue || 0}</span> days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(caseItem.priority)}`}>
                        {caseItem.priority || 'medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(caseItem.status)}`}>
                        {caseItem.status || 'open'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="Call">
                          <FiPhone className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800" title="Email">
                          <FiMail className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-800" title="Mark Resolved">
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Modal */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Collection Case Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Case Number</p>
                  <p className="font-semibold">{selectedCase.case_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Loan Number</p>
                  <p className="font-semibold">{selectedCase.loan_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityBadge(selectedCase.priority)}`}>
                    {selectedCase.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Original Debt</p>
                  <p className="font-semibold">KES {selectedCase.original_debt_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Debt</p>
                  <p className="font-semibold text-red-600">KES {selectedCase.current_debt_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Accrued Interest</p>
                  <p className="font-semibold">KES {selectedCase.accrued_interest?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Accrued Penalties</p>
                  <p className="font-semibold">KES {selectedCase.accrued_penalties?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Collection Fees</p>
                  <p className="font-semibold">KES {selectedCase.collection_fees?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Opened Date</p>
                  <p className="font-semibold">{new Date(selectedCase.opened_date).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedCase.has_payment_plan && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-2">Payment Plan Active</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-green-700">Installment Amount:</span>
                      <p className="font-semibold">KES {selectedCase.payment_plan_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Installments:</span>
                      <p className="font-semibold">{selectedCase.payment_plan_installments}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Start Date:</span>
                      <p className="font-semibold">{new Date(selectedCase.payment_plan_start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-green-700">End Date:</span>
                      <p className="font-semibold">{new Date(selectedCase.payment_plan_end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveCases;