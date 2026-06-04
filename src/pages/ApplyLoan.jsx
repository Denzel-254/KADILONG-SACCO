import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiCalendar, FiPercent, FiCheckCircle } from 'react-icons/fi';
import { loanAPI } from '../services/api';
import toast from 'react-hot-toast';

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    amount_applied: '',
    repayment_period_months: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await loanAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load loan products');
    }
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setFormData({ ...formData, product_id: productId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loanAPI.applyForLoan({
        product_id: formData.product_id,
        amount_applied: parseFloat(formData.amount_applied),
        repayment_period_months: parseInt(formData.repayment_period_months),
      });
      toast.success('Loan application submitted successfully!');
      navigate('/loans');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    if (!selectedProduct || !formData.amount_applied || !formData.repayment_period_months) return 0;
    const principal = parseFloat(formData.amount_applied);
    const months = parseInt(formData.repayment_period_months);
    const monthlyRate = selectedProduct.interest_rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
        <p className="text-gray-600 mt-1">Choose a loan product that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Loan Product</label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleProductChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.interest_rate}% p.a.
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                  <p className="text-sm text-gray-600 mb-1">Min: KES {selectedProduct.min_amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mb-1">Max: KES {selectedProduct.max_amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Processing Fee: KES {selectedProduct.processing_fee.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (KES)</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="amount_applied"
                      value={formData.amount_applied}
                      onChange={handleChange}
                      min={selectedProduct.min_amount}
                      max={selectedProduct.max_amount}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Period (Months)</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="repayment_period_months"
                      value={formData.repayment_period_months}
                      onChange={handleChange}
                      min={selectedProduct.min_repayment_period_months}
                      max={selectedProduct.max_repayment_period_months}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter months"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Application Summary</h3>
          {selectedProduct && formData.amount_applied && formData.repayment_period_months ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-semibold">KES {parseInt(formData.amount_applied).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span>{selectedProduct.interest_rate}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee:</span>
                <span>KES {selectedProduct.processing_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-blue-600">KES {calculateMonthlyPayment().toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Repayment:</span>
                  <span className="font-bold">KES {(calculateMonthlyPayment() * parseInt(formData.repayment_period_months)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">Select a product and enter amount to see summary</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;