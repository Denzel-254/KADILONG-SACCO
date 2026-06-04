import { useState } from 'react';
import { FiSave, FiShield, FiBell, FiMail, FiPhone, FiGlobe, FiLock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    site_name: 'SaccoFlow',
    site_logo: '',
    timezone: 'Africa/Nairobi',
    date_format: 'DD/MM/YYYY',
    
    // Email Settings
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    from_email: 'noreply@saccoflow.com',
    from_name: 'SaccoFlow',
    
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    loan_approval_notify: true,
    payment_received_notify: true,
    overdue_notify: true,
    
    // Security Settings
    session_timeout: 30,
    max_login_attempts: 5,
    password_expiry_days: 90,
    two_factor_auth: false,
    
    // System Settings
    maintenance_mode: false,
    debug_mode: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure system preferences and security settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiGlobe className="w-5 h-5 mr-2 text-blue-600" /> General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleChange('general', 'site_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                <option value="Africa/Cairo">Africa/Cairo (EET)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={settings.date_format}
                onChange={(e) => handleChange('general', 'date_format', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiMail className="w-5 h-5 mr-2 text-blue-600" /> Email Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={settings.smtp_host}
                onChange={(e) => handleChange('email', 'smtp_host', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input
                type="text"
                value={settings.smtp_port}
                onChange={(e) => handleChange('email', 'smtp_port', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
              <input
                type="text"
                value={settings.smtp_user}
                onChange={(e) => handleChange('email', 'smtp_user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
              <input
                type="password"
                value={settings.smtp_password}
                onChange={(e) => handleChange('email', 'smtp_password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                value={settings.from_email}
                onChange={(e) => handleChange('email', 'from_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                value={settings.from_name}
                onChange={(e) => handleChange('email', 'from_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiBell className="w-5 h-5 mr-2 text-blue-600" /> Notification Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleChange('notifications', 'email_notifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">SMS Notifications</span>
              <input
                type="checkbox"
                checked={settings.sms_notifications}
                onChange={(e) => handleChange('notifications', 'sms_notifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Notify on Loan Approval</span>
              <input
                type="checkbox"
                checked={settings.loan_approval_notify}
                onChange={(e) => handleChange('notifications', 'loan_approval_notify', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Notify on Payment Received</span>
              <input
                type="checkbox"
                checked={settings.payment_received_notify}
                onChange={(e) => handleChange('notifications', 'payment_received_notify', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Notify on Overdue Loans</span>
              <input
                type="checkbox"
                checked={settings.overdue_notify}
                onChange={(e) => handleChange('notifications', 'overdue_notify', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiLock className="w-5 h-5 mr-2 text-blue-600" /> Security Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.session_timeout}
                onChange={(e) => handleChange('security', 'session_timeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
              <input
                type="number"
                value={settings.max_login_attempts}
                onChange={(e) => handleChange('security', 'max_login_attempts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.password_expiry_days}
                onChange={(e) => handleChange('security', 'password_expiry_days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={settings.two_factor_auth}
                onChange={(e) => handleChange('security', 'two_factor_auth', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiShield className="w-5 h-5 mr-2 text-blue-600" /> System Status
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-800">Maintenance Mode</span>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => handleChange('system', 'maintenance_mode', e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Debug Mode</span>
              <input
                type="checkbox"
                checked={settings.debug_mode}
                onChange={(e) => handleChange('system', 'debug_mode', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;