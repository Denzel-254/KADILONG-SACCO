import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiDollarSign, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { loanAPI } from '../services/api';
import toast from 'react-hot-toast';

const MyLoans = () => {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  

  const fetchLoans = async () => {
    try {
      const response = await loanAPI.getMyLoans();
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };



  const viewSchedule = async (loanId) => {
    try {
      const response = await loanAPI.getRepaymentSchedule(loanId);
      setSchedule(response.data);
      setSelectedLoan(loanId);
    } catch (error) {
      toast.error('Failed to load repayment schedule');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
        <p className="text-gray-600 mt-1">View and manage your loan applications</p>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loans yet</h3>
            <p className="text-gray-500 mb-6">Apply for your first loan today</p>
            <Link to="/loans/apply" className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Apply for Loan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disbursed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repayment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KES {loan.amount_approved?.toLocaleString() || loan.amount_applied?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.disbursed_date ? new Date(loan.disbursed_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.remaining_balance > 0 ? `KES ${loan.remaining_balance.toLocaleString()}` : 'Fully Paid'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewSchedule(loan.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEye className="w-4 h-4 mr-1" /> View Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Repayment Schedule Modal */}
      {schedule && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSchedule(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Repayment Schedule</h2>
                <button onClick={() => setSchedule(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-gray-600 text-sm mt-1">Loan: {schedule.loan_number}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Total Installments</p>
                  <p className="text-lg font-bold text-gray-900">{schedule.total_installments}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Paid Installments</p>
                  <p className="text-lg font-bold text-gray-900">{schedule.paid_installments}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Total Paid</p>
                  <p className="text-lg font-bold text-gray-900">KES {schedule.total_paid?.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Remaining</p>
                  <p className="text-lg font-bold text-gray-900">KES {schedule.total_due?.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                {schedule.schedule?.map((inst) => (
                  <div key={inst.installment_number} className={`flex justify-between items-center p-3 rounded-lg ${inst.is_paid ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div>
                      <p className="font-medium text-gray-900">Installment {inst.installment_number}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(inst.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">KES {inst.amount_due?.toLocaleString()}</p>
                      {inst.is_paid ? (
                        <span className="text-xs text-green-600 flex items-center"><FiCheckCircle className="w-3 h-3 mr-1" /> Paid</span>
                      ) : (
                        <span className="text-xs text-orange-600 flex items-center"><FiClock className="w-3 h-3 mr-1" /> Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;