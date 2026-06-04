import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiCreditCard, FiPhone, FiSmartphone, 
  FiCheckCircle, FiAlertCircle, FiHome 
} from 'react-icons/fi';
import { loanAPI } from '../services/api';
import toast from 'react-hot-toast';

const MakePayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('');

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    try {
      const response = await loanAPI.getMyLoans();
      const activeLoans = response.data.filter(loan => loan.status === 'active' || loan.status === 'disbursed');
      setLoans(activeLoans);
      if (activeLoans.length > 0) {
        setSelectedLoan(activeLoans[0]);
      }
    } catch (error) {
      toast.error('Failed to load loans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLoan) {
      toast.error('No active loan selected');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await loanAPI.makePayment(selectedLoan.id, {
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        mpesa_receipt: paymentMethod === 'mpesa' ? `MPESA${Date.now()}` : null,
      });
      toast.success(`Payment of KES ${parseFloat(amount).toLocaleString()} made successfully!`);
      navigate('/loans');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Make a Payment</h1>
        <p className="text-gray-600 mt-1">Repay your loan quickly and securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Loan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Loan</label>
              <select
                value={selectedLoan?.id || ''}
                onChange={(e) => {
                  const loan = loans.find(l => l.id === parseInt(e.target.value));
                  setSelectedLoan(loan);
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a loan...</option>
                {loans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loan_number} - Outstanding: KES {loan.remaining_balance?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={selectedLoan?.remaining_balance}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              {selectedLoan && (
                <p className="text-xs text-gray-500 mt-1">
                  Outstanding balance: KES {selectedLoan.remaining_balance?.toLocaleString()}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 border rounded-lg text-center transition ${paymentMethod === 'mpesa' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <FiSmartphone className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <span className="text-sm font-medium">M-PESA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 border rounded-lg text-center transition ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <FiHome className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 border rounded-lg text-center transition ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <FiCreditCard className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
              </div>
            </div>

            {/* M-PESA Number (if selected) */}
            {paymentMethod === 'mpesa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">M-PESA Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    placeholder="0712345678"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">You will receive an STK push on this number</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedLoan}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay KES ${parseFloat(amount || 0).toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Payment Information</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Instant payment processing</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Late payments incur 1% daily penalty</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Payment reflected immediately</span>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-blue-400">
            <p className="text-sm text-blue-100">Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;