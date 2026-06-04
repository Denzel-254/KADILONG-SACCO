import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiShield } from 'react-icons/fi';
import { savingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const OpenSavingsAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_type: 'regular',
    account_name: '',
    initial_deposit: '',
  });

  const accountTypes = [
    { value: 'regular', label: 'Regular Savings', icon: FiDollarSign, rate: '4% p.a.', min: 0 },
    { value: 'fixed_deposit', label: 'Fixed Deposit', icon: FiTrendingUp, rate: '8% p.a.', min: 10000 },
    { value: 'share_capital', label: 'Share Capital', icon: FiShield, rate: '12% p.a.', min: 5000 },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await savingsAPI.createAccount({
        account_type: formData.account_type,
        account_name: formData.account_name,
        initial_deposit: parseFloat(formData.initial_deposit) || 0,
      });
      toast.success('Savings account opened successfully!');
      navigate('/savings');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to open account');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = accountTypes.find(t => t.value === formData.account_type);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Open a Savings Account</h1>
        <p className="text-gray-600 mt-1">Choose the account type that best suits your needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="space-y-2">
                {accountTypes.map((type) => (
                  <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="account_type"
                      value={type.value}
                      checked={formData.account_type === type.value}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <type.icon className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.rate}</p>
                    </div>
                    {type.min > 0 && <p className="text-xs text-gray-400">Min: KES {type.min.toLocaleString()}</p>}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                required
                placeholder="e.g., My Primary Savings"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Deposit (KES)</label>
              <input
                type="number"
                name="initial_deposit"
                value={formData.initial_deposit}
                onChange={handleChange}
                min={selectedType?.min || 0}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {selectedType?.min > 0 && (
                <p className="text-xs text-gray-500 mt-1">Minimum deposit: KES {selectedType.min.toLocaleString()}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Opening Account...' : 'Open Account'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Why Save With Us?</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <FiDollarSign className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Competitive interest rates up to 12% p.a.</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiTrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Monthly compound interest</span>
            </li>
            <li className="flex items-start space-x-2">
              <FiShield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Deposits protected by the Deposit Guarantee Fund</span>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-blue-400">
            <p className="text-sm text-blue-100">Open an account today and start growing your wealth!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSavingsAccount;