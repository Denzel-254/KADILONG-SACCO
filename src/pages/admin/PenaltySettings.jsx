import { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiDollarSign, FiPercent, FiClock, FiCalendar } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PenaltySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: 'Standard Penalty Settings',
    daily_penalty_rate: 1.0,
    max_penalty_percentage: 50,
    warning_days: 7,
    defaulter_days: 30,
    critical_days: 60,
    blacklist_days: 90,
    admin_fee_for_default: 500,
    legal_fee_threshold_days: 60,
    legal_fee_amount: 2000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getPenaltySettings();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load penalty settings:', error);
      // Use default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updatePenaltySettings(settings);
      toast.success('Penalty settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save penalty settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: parseFloat(value) || 0 });
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
        <h1 className="text-2xl font-bold text-gray-900">Penalty Settings</h1>
        <p className="text-gray-600 mt-1">Configure late payment penalties and defaulter thresholds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Penalty Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Penalty Rates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Penalty Rate (%)</label>
                <div className="relative">
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={settings.daily_penalty_rate}
                    onChange={(e) => handleChange('daily_penalty_rate', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Applied daily on overdue amounts (e.g., 1% = 1% per day)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Penalty (% of amount)</label>
                <div className="relative">
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.max_penalty_percentage}
                    onChange={(e) => handleChange('max_penalty_percentage', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum penalty as percentage of amount due (e.g., 50% cap)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overdue Thresholds</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warning (Days)</label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.warning_days}
                    onChange={(e) => handleChange('warning_days', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Send warning after X days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Defaulter (Days)</label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.defaulter_days}
                    onChange={(e) => handleChange('defaulter_days', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Mark as defaulter after X days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Critical (Days)</label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.critical_days}
                    onChange={(e) => handleChange('critical_days', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Critical status after X days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blacklist (Days)</label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.blacklist_days}
                    onChange={(e) => handleChange('blacklist_days', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-blacklist after X days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fees Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Fee for Default (KES)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.admin_fee_for_default}
                    onChange={(e) => handleChange('admin_fee_for_default', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Action Threshold (Days)</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.legal_fee_threshold_days}
                    onChange={(e) => handleChange('legal_fee_threshold_days', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Fee Amount (KES)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={settings.legal_fee_amount}
                    onChange={(e) => handleChange('legal_fee_amount', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">How Penalties Work</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FiAlertCircle className="w-4 h-4 mt-0.5" />
                <span>Daily penalty calculated on overdue amount</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiAlertCircle className="w-4 h-4 mt-0.5" />
                <span>Penalty capped at maximum percentage of amount due</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiAlertCircle className="w-4 h-4 mt-0.5" />
                <span>Warning notifications sent before penalty starts</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiAlertCircle className="w-4 h-4 mt-0.5" />
                <span>Defaulters automatically flagged for collection</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Current Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-yellow-700">Daily Penalty:</span>
                <span className="font-semibold">{settings.daily_penalty_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-700">Max Penalty:</span>
                <span className="font-semibold">{settings.max_penalty_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-700">Defaulter after:</span>
                <span className="font-semibold">{settings.defaulter_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-700">Blacklist after:</span>
                <span className="font-semibold">{settings.blacklist_days} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltySettings;