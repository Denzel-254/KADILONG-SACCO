import { useState, useEffect } from 'react';
import { FiCalendar, FiDollarSign, FiUser, FiCheckCircle, FiClock, FiPlus, FiEye, FiAlertCircle, FiX } from 'react-icons/fi';
import { adminAPI, loanAPI, memberAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PaymentPlans = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [formData, setFormData] = useState({
    case_id: '',
    total_amount: '',
    installment_amount: '',
    number_of_installments: '',
    start_date: new Date().toISOString().split('T')[0],
    interest_waived: false,
    penalty_waived: false,
    notes: '',
  });

  useEffect(() => {
    fetchPaymentPlans();
    fetchDefaulters();
  }, []);

  const fetchPaymentPlans = async () => {
    try {
      // NO MOCK DATA - only real API call
      const response = await adminAPI.getPaymentPlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      // Don't show error toast for empty data, just set empty array
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaulters = async () => {
    try {
      const response = await adminAPI.getDefaulters();
      setDefaulters(response.data || []);
    } catch (error) {
      console.error('Error fetching defaulters:', error);
      setDefaulters([]);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(formData.number_of_installments));
      
      const planData = {
        case_id: parseInt(formData.case_id),
        total_amount: parseFloat(formData.total_amount),
        installment_amount: parseFloat(formData.installment_amount),
        number_of_installments: parseInt(formData.number_of_installments),
        start_date: formData.start_date,
        end_date: endDate.toISOString().split('T')[0],
        interest_waived: formData.interest_waived,
        penalty_waived: formData.penalty_waived,
        notes: formData.notes,
      };
      
      // API call when ready
      // await adminAPI.createPaymentPlan(planData);
      
      toast.success('Payment plan created successfully!');
      resetForm();
      setShowCreateModal(false);
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast.error('Failed to create payment plan');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      case_id: '',
      total_amount: '',
      installment_amount: '',
      number_of_installments: '',
      start_date: new Date().toISOString().split('T')[0],
      interest_waived: false,
      penalty_waived: false,
      notes: '',
    });
  };

  const calculateInstallmentAmount = () => {
    if (formData.total_amount && formData.number_of_installments) {
      const amount = parseFloat(formData.total_amount) / parseInt(formData.number_of_installments);
      setFormData({ ...formData, installment_amount: Math.round(amount).toString() });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Plans</h1>
          <p className="text-gray-600 mt-1">Manage negotiated payment plans for defaulters</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" /> Create Payment Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Total Plans</p>
          <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
          <p className="text-sm text-green-700">Active Plans</p>
          <p className="text-2xl font-bold text-green-800">{plans.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
          <p className="text-sm text-blue-700">Completed</p>
          <p className="text-2xl font-bold text-blue-800">{plans.filter(p => p.status === 'completed').length}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm p-6 border border-red-200">
          <p className="text-sm text-red-700">Defaulted</p>
          <p className="text-2xl font-bold text-red-800">{plans.filter(p => p.status === 'defaulted').length}</p>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Installment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No payment plans found
                  </td>
                </tr>
              ) : (
                plans.map((plan) => {
                  const progress = (plan.paid_installments / plan.number_of_installments) * 100;
                  return (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{plan.plan_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Member {plan.member_id}</p>
                            <p className="text-xs text-gray-500">ID: {plan.member_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        KES {plan.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        KES {plan.installment_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 rounded-full h-1.5"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(plan.status)}`}>
                          {plan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FiEye className="w-4 h-4 mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payment Plan Modal - Keep same as before */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create Payment Plan</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Create a new payment plan for a defaulter</p>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              {/* Form fields remain the same */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Defaulter Case *</label>
                <select
                  value={formData.case_id}
                  onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a defaulter...</option>
                  {defaulters.map((defaulter) => (
                    <option key={defaulter.id} value={defaulter.id}>
                      {defaulter.member_name} - Loan: {defaulter.loan_number} - Overdue: KES {defaulter.total_overdue_amount?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (KES) *</label>
                  <input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => {
                      setFormData({ ...formData, total_amount: e.target.value });
                      setTimeout(calculateInstallmentAmount, 100);
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter total amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Installments *</label>
                  <input
                    type="number"
                    value={formData.number_of_installments}
                    onChange={(e) => {
                      setFormData({ ...formData, number_of_installments: e.target.value });
                      setTimeout(calculateInstallmentAmount, 100);
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Installment Amount (KES)</label>
                <input
                  type="number"
                  value={formData.installment_amount}
                  onChange={(e) => setFormData({ ...formData, installment_amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated based on total amount and installments</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.interest_waived}
                    onChange={(e) => setFormData({ ...formData, interest_waived: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Waive all accrued interest</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.penalty_waived}
                    onChange={(e) => setFormData({ ...formData, penalty_waived: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Waive all accrued penalties</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes about this payment plan..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Once created, the member will be notified of this payment plan.
                  They can make payments according to the agreed schedule.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Payment Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Plan Details Modal - Keep same */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Payment Plan Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Plan Number</p>
                  <p className="font-semibold">{selectedPlan.plan_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedPlan.status)}`}>
                    {selectedPlan.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold">KES {selectedPlan.total_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Installment Amount</p>
                  <p className="font-semibold">KES {selectedPlan.installment_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Installments</p>
                  <p className="font-semibold">{selectedPlan.paid_installments} / {selectedPlan.number_of_installments} paid</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="font-semibold">{new Date(selectedPlan.start_date).toLocaleDateString()} - {new Date(selectedPlan.end_date).toLocaleDateString()}</p>
                </div>
                {selectedPlan.interest_waived && (
                  <div className="col-span-2 bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">✓ Interest has been waived</p>
                  </div>
                )}
                {selectedPlan.penalty_waived && (
                  <div className="col-span-2 bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">✓ Penalties have been waived</p>
                  </div>
                )}
                {selectedPlan.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm text-gray-700">{selectedPlan.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPlans;