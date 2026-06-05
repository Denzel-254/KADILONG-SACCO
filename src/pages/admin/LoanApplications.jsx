import { useState, useEffect } from 'react';
import { FiEye, FiDollarSign, FiUser, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiCreditCard } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LoanApplications = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await adminAPI.getPendingLoans();
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load loan applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
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
        <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
        <p className="text-gray-600 mt-1">Review pending loan applications from members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm p-6 border border-yellow-200">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{applications.filter(a => a.status === 'pending').length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
          <p className="text-sm text-blue-700">Total Value</p>
          <p className="text-2xl font-bold text-blue-800">
            KES {applications.reduce((sum, a) => sum + (a.amount_applied || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No loan applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{app.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{app.member_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">
                            ID: {app.member_national_id || app.member_number || app.member_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KES {app.amount_applied?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.repayment_period_months} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEye className="w-4 h-4 mr-1" /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Loan Application Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Member Name</p>
                    <p className="font-semibold">{selectedApp.member_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Number</p>
                    <p className="font-semibold">{selectedApp.member_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">National ID</p>
                    <p className="font-semibold">{selectedApp.member_national_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Credit Score</p>
                    <p className="font-semibold">{selectedApp.credit_score || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly Income</p>
                    <p className="font-semibold">KES {selectedApp.monthly_income?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Loan Number</p>
                  <p className="font-semibold">{selectedApp.loan_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount Applied</p>
                  <p className="font-semibold">KES {selectedApp.amount_applied?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Repayment Period</p>
                  <p className="font-semibold">{selectedApp.repayment_period_months} months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interest Rate</p>
                  <p className="font-semibold">{selectedApp.interest_rate}% p.a.</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Processing Fee</p>
                  <p className="font-semibold">KES {selectedApp.processing_fee?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied Date</p>
                  <p className="font-semibold">{new Date(selectedApp.applied_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estimated Monthly Payment</p>
                  <p className="font-semibold text-blue-600">
                    KES {Math.round(selectedApp.amount_applied * (selectedApp.interest_rate / 100 / 12) * Math.pow(1 + selectedApp.interest_rate / 100 / 12, selectedApp.repayment_period_months) / (Math.pow(1 + selectedApp.interest_rate / 100 / 12, selectedApp.repayment_period_months) - 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplications;