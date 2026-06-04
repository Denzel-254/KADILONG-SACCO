import { useState, useEffect } from 'react';
import { FiEye, FiDollarSign, FiUser, FiCalendar, FiTrendingUp, FiDownload } from 'react-icons/fi';
import { loanAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ActiveLoans = () => {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      // Use the admin endpoint to get all active loans
      const response = await loanAPI.getAllActiveLoans();
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching active loans:', error);
      toast.error('Failed to load active loans');
    } finally {
      setLoading(false);
    }
  };

  const viewSchedule = async (loanId) => {
    try {
      const response = await loanAPI.getRepaymentSchedule(loanId);
      setSchedule(response.data);
      setSelectedLoan(loans.find(l => l.id === loanId));
      setShowScheduleModal(true);
    } catch (error) {
      toast.error('Failed to load repayment schedule');
    }
  };

  const calculateProgress = (loan) => {
    const totalLoanAmount = loan.amount_approved + (loan.total_interest_expected || 0);
    if (totalLoanAmount === 0) return 0;
    return Math.round((loan.total_paid / totalLoanAmount) * 100);
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
        <h1 className="text-2xl font-bold text-gray-900">Active Loans</h1>
        <p className="text-gray-600 mt-1">Monitor all active loan portfolios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Active Loans</p>
          <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Outstanding</p>
          <p className="text-2xl font-bold text-blue-600">
            KES {loans.reduce((sum, l) => sum + (l.remaining_balance || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Average Loan Size</p>
          <p className="text-2xl font-bold text-gray-900">
            KES {loans.length > 0 ? Math.round(loans.reduce((sum, l) => sum + l.amount_approved, 0) / loans.length).toLocaleString() : 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Repaid</p>
          <p className="text-2xl font-bold text-green-600">
            KES {loans.reduce((sum, l) => sum + (l.total_paid || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No active loans found
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{loan.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{loan.member_name}</p>
                          <p className="text-xs text-gray-500">{loan.member_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KES {loan.amount_approved.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {loan.interest_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">{calculateProgress(loan)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 rounded-full h-1.5"
                            style={{ width: `${calculateProgress(loan)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {loan.next_payment_date ? new Date(loan.next_payment_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {loan.status === 'active' ? 'Active' : 'Disbursed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewSchedule(loan.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEye className="w-4 h-4 mr-1" /> Schedule
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && schedule && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Repayment Schedule</h2>
                  <p className="text-sm text-gray-500">Loan: {selectedLoan.loan_number}</p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Total Installments</p>
                  <p className="text-lg font-bold text-gray-900">{schedule.total_installments}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Paid</p>
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
                      <p className="text-xs text-gray-500">{inst.is_paid ? '✓ Paid' : 'Pending'}</p>
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

export default ActiveLoans;