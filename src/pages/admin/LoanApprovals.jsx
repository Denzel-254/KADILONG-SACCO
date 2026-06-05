import { useState, useEffect } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiDollarSign, FiUser, FiCalendar, FiClock, FiSend } from 'react-icons/fi';
import { adminAPI, loanAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LoanApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [approveAmount, setApproveAmount] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionType, setActionType] = useState(null);
  const [disburseData, setDisburseData] = useState({
    disbursement_method: 'mpesa',
    mpesa_receipt_number: '',
    bank_reference: '',
    notes: '',
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await adminAPI.getPendingLoans();
      const allLoans = response.data || [];
      setPendingLoans(allLoans.filter(loan => loan.status === 'pending'));
      setApprovedLoans(allLoans.filter(loan => loan.status === 'approved'));
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to load loans');
      setPendingLoans([]);
      setApprovedLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveAmount || parseFloat(approveAmount) <= 0) {
      toast.error('Please enter a valid approval amount');
      return;
    }

    try {
      await loanAPI.approveLoan(selectedLoan.id, {
        amount_approved: parseFloat(approveAmount),
        rejection_reason: null,
      });
      toast.success('Loan approved successfully!');
      setShowModal(false);
      setSelectedLoan(null);
      setApproveAmount('');
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Approval failed');
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await loanAPI.approveLoan(selectedLoan.id, {
        amount_approved: 0,
        rejection_reason: rejectReason,
      });
      toast.success('Loan rejected');
      setShowModal(false);
      setSelectedLoan(null);
      setRejectReason('');
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Rejection failed');
    }
  };

  const handleDisburse = async () => {
    try {
      await loanAPI.disburseLoan(selectedLoan.id, {
        disbursement_method: disburseData.disbursement_method,
        mpesa_receipt_number: disburseData.mpesa_receipt_number || null,
        bank_reference: disburseData.bank_reference || null,
        notes: disburseData.notes || null,
      });
      toast.success('Loan disbursed successfully!');
      setShowDisburseModal(false);
      setSelectedLoan(null);
      setDisburseData({
        disbursement_method: 'mpesa',
        mpesa_receipt_number: '',
        bank_reference: '',
        notes: '',
      });
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Disbursement failed');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
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
        <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
        <p className="text-gray-600 mt-1">Review, approve, and disburse loan applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <p className="text-sm text-yellow-700">Pending Approvals</p>
          <p className="text-3xl font-bold text-yellow-800">{pendingLoans.length}</p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <p className="text-sm text-green-700">Approved Ready for Disbursement</p>
          <p className="text-3xl font-bold text-green-800">{approvedLoans.length}</p>
          <p className="text-xs text-green-600 mt-1">Ready to disburse</p>
        </div>
      </div>

      {/* Pending Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Pending Applications ({pendingLoans.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No pending loan applications
                  </td>
                </tr>
              ) : (
                pendingLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{loan.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{loan.member_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{loan.member_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KES {loan.amount_applied?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {loan.repayment_period_months} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setApproveAmount(loan.amount_applied.toString());
                            setActionType('approve');
                            setShowModal(true);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-xs flex items-center"
                        >
                          <FiCheckCircle className="w-3 h-3 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setActionType('reject');
                            setShowModal(true);
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-xs flex items-center"
                        >
                          <FiXCircle className="w-3 h-3 mr-1" /> Reject
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

      {/* Approved Loans Table */}
      {approvedLoans.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Approved Loans Ready for Disbursement ({approvedLoans.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Approved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{loan.loan_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{loan.member_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{loan.member_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KES {loan.amount_approved?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setShowDisburseModal(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-xs flex items-center"
                      >
                        <FiSend className="w-3 h-3 mr-1" /> Disburse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {actionType === 'approve' ? 'Approve Loan Application' : 'Reject Loan Application'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Loan Number</p>
                <p className="font-semibold">{selectedLoan.loan_number}</p>
                <p className="text-sm text-gray-600 mt-2">Member</p>
                <p className="font-semibold">{selectedLoan.member_name}</p>
                <p className="text-sm text-gray-600 mt-2">Amount Applied</p>
                <p className="font-semibold">KES {selectedLoan.amount_applied.toLocaleString()}</p>
              </div>

              {actionType === 'approve' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approval Amount (KES)</label>
                    <input
                      type="number"
                      value={approveAmount}
                      onChange={(e) => setApproveAmount(e.target.value)}
                      max={selectedLoan.amount_applied}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max: KES {selectedLoan.amount_applied.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleApprove}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Confirm Approval
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                  <button
                    onClick={handleReject}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Confirm Rejection
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disbursement Modal - Same as before */}
      {showDisburseModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDisburseModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Disburse Loan</h2>
              <p className="text-sm text-gray-500 mt-1">Loan: {selectedLoan.loan_number}</p>
              <p className="text-sm text-gray-500">Member: {selectedLoan.member_name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-700">Amount to Disburse</p>
                <p className="text-2xl font-bold text-green-700">KES {selectedLoan.amount_approved.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Method</label>
                <select
                  value={disburseData.disbursement_method}
                  onChange={(e) => setDisburseData({ ...disburseData, disbursement_method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mpesa">M-PESA</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {disburseData.disbursement_method === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">M-PESA Receipt Number</label>
                  <input
                    type="text"
                    value={disburseData.mpesa_receipt_number}
                    onChange={(e) => setDisburseData({ ...disburseData, mpesa_receipt_number: e.target.value })}
                    placeholder="e.g., QWER123456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {disburseData.disbursement_method === 'bank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Reference Number</label>
                  <input
                    type="text"
                    value={disburseData.bank_reference}
                    onChange={(e) => setDisburseData({ ...disburseData, bank_reference: e.target.value })}
                    placeholder="Enter bank reference"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={disburseData.notes}
                  onChange={(e) => setDisburseData({ ...disburseData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleDisburse}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <FiSend className="w-4 h-4 mr-2" /> Confirm Disbursement
                </button>
                <button
                  onClick={() => setShowDisburseModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApprovals;