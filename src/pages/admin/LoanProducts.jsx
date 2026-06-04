import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiPercent, FiCalendar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { loanAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LoanProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_amount: '',
    max_amount: '',
    interest_rate: '',
    processing_fee: '',
    late_payment_penalty_rate: '5',
    min_repayment_period_months: '',
    max_repayment_period_months: '',
    requires_guarantor: false,
    min_credit_score: '300',
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        min_amount: parseFloat(formData.min_amount),
        max_amount: parseFloat(formData.max_amount),
        interest_rate: parseFloat(formData.interest_rate),
        processing_fee: parseFloat(formData.processing_fee),
        late_payment_penalty_rate: parseFloat(formData.late_payment_penalty_rate),
        min_repayment_period_months: parseInt(formData.min_repayment_period_months),
        max_repayment_period_months: parseInt(formData.max_repayment_period_months),
        min_credit_score: parseInt(formData.min_credit_score),
      };

      if (editingProduct) {
        // Update product
        await loanAPI.updateProduct(editingProduct.id, submitData);
        toast.success('Product updated successfully');
      } else {
        // Create product
        await loanAPI.createProduct(submitData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await loanAPI.updateProduct(product.id, { ...product, is_active: !product.is_active });
      toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      min_amount: '',
      max_amount: '',
      interest_rate: '',
      processing_fee: '',
      late_payment_penalty_rate: '5',
      min_repayment_period_months: '',
      max_repayment_period_months: '',
      requires_guarantor: false,
      min_credit_score: '300',
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      min_amount: product.min_amount,
      max_amount: product.max_amount,
      interest_rate: product.interest_rate,
      processing_fee: product.processing_fee,
      late_payment_penalty_rate: product.late_payment_penalty_rate,
      min_repayment_period_months: product.min_repayment_period_months,
      max_repayment_period_months: product.max_repayment_period_months,
      requires_guarantor: product.requires_guarantor,
      min_credit_score: product.min_credit_score,
    });
    setShowModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Loan Products</h1>
          <p className="text-gray-600 mt-1">Create and manage loan products offered to members</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" /> New Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.description || 'No description'}</p>
                </div>
                <button
                  onClick={() => handleToggleStatus(product)}
                  className={`p-2 rounded-lg ${product.is_active ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {product.is_active ? <FiToggleRight className="w-6 h-6" /> : <FiToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Range</span>
                  <span className="font-semibold">KES {product.min_amount.toLocaleString()} - {product.max_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-semibold text-blue-600">{product.interest_rate}% p.a.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold">KES {product.processing_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Repayment Period</span>
                  <span className="font-semibold">{product.min_repayment_period_months} - {product.max_repayment_period_months} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min Credit Score</span>
                  <span className="font-semibold">{product.min_credit_score}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  <FiEdit2 className="w-4 h-4 mr-2" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Emergency Loan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Product description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (KES)</label>
                  <input
                    type="number"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (KES)</label>
                  <input
                    type="number"
                    value={formData.max_amount}
                    onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.interest_rate}
                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee (KES)</label>
                  <input
                    type="number"
                    value={formData.processing_fee}
                    onChange={(e) => setFormData({ ...formData, processing_fee: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Period (Months)</label>
                  <input
                    type="number"
                    value={formData.min_repayment_period_months}
                    onChange={(e) => setFormData({ ...formData, min_repayment_period_months: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Period (Months)</label>
                  <input
                    type="number"
                    value={formData.max_repayment_period_months}
                    onChange={(e) => setFormData({ ...formData, max_repayment_period_months: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.late_payment_penalty_rate}
                    onChange={(e) => setFormData({ ...formData, late_payment_penalty_rate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Score</label>
                  <input
                    type="number"
                    value={formData.min_credit_score}
                    onChange={(e) => setFormData({ ...formData, min_credit_score: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.requires_guarantor}
                  onChange={(e) => setFormData({ ...formData, requires_guarantor: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Requires Guarantor</span>
              </label>
              
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanProducts;