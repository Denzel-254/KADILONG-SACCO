import { useState } from 'react';
import { FiBarChart2, FiDownload, FiCalendar, FiDollarSign, FiUsers, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { reportAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  const [asAtDate, setAsAtDate] = useState(new Date().toISOString().split('T')[0]);
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [activeReport, setActiveReport] = useState('kpi');

  const fetchIncomeStatement = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getIncomeStatement(dateRange.start_date, dateRange.end_date);
      setIncomeStatement(response.data);
      setActiveReport('income');
    } catch (error) {
      toast.error('Failed to load income statement');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceSheet = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getBalanceSheet(asAtDate);
      setBalanceSheet(response.data);
      setActiveReport('balance');
    } catch (error) {
      toast.error('Failed to load balance sheet');
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIDashboard = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getKPIDashboard(asAtDate);
      setKpiData(response.data);
      setActiveReport('kpi');
    } catch (error) {
      toast.error('Failed to load KPI dashboard');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    // Simple CSV export - you can enhance this
    console.log('Export to CSV:', data);
    toast.success('Export feature coming soon');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Financial reports and performance analytics</p>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={fetchKPIDashboard}
          className={`px-4 py-2 font-medium transition ${activeReport === 'kpi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiTrendingUp className="inline w-4 h-4 mr-2" /> KPI Dashboard
        </button>
        <button
          onClick={fetchIncomeStatement}
          className={`px-4 py-2 font-medium transition ${activeReport === 'income' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiDollarSign className="inline w-4 h-4 mr-2" /> Income Statement
        </button>
        <button
          onClick={fetchBalanceSheet}
          className={`px-4 py-2 font-medium transition ${activeReport === 'balance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiBarChart2 className="inline w-4 h-4 mr-2" /> Balance Sheet
        </button>
      </div>

      {/* Date Range Selector (for Income Statement) */}
      {activeReport === 'income' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={fetchIncomeStatement}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {/* As At Date Selector (for Balance Sheet & KPI) */}
      {(activeReport === 'balance' || activeReport === 'kpi') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">As At Date</label>
              <input
                type="date"
                value={asAtDate}
                onChange={(e) => setAsAtDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={activeReport === 'balance' ? fetchBalanceSheet : fetchKPIDashboard}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* KPI Dashboard */}
      {!loading && activeReport === 'kpi' && kpiData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{kpiData.total_members}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-blue-600">{kpiData.active_loans}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-600">Loan Portfolio</p>
              <p className="text-2xl font-bold text-green-600">KES {kpiData.total_loan_portfolio?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-purple-600">KES {kpiData.total_savings?.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Loan Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Repayment Rate</span>
                    <span className="font-semibold">{kpiData.loan_repayment_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: `${kpiData.loan_repayment_rate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Portfolio at Risk</span>
                    <span className="font-semibold text-red-600">{kpiData.portfolio_at_risk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: `${Math.min(kpiData.portfolio_at_risk, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-2">
                {kpiData.kpis?.map((kpi, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{kpi.name}</span>
                    <span className="font-semibold">{kpi.value} {kpi.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income Statement */}
      {!loading && activeReport === 'income' && incomeStatement && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Income Statement</h2>
            <button onClick={() => exportToCSV(incomeStatement, 'income_statement')} className="text-blue-600 hover:text-blue-700">
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Income</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Income</span>
                  <span className="font-medium">KES {incomeStatement.total_interest_income?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee Income</span>
                  <span className="font-medium">KES {incomeStatement.total_fee_income?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Income</span>
                  <span>KES {incomeStatement.total_income?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Expenses</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Expense</span>
                  <span className="font-medium">KES {incomeStatement.total_interest_expense?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Expenses</span>
                  <span className="font-medium">KES {incomeStatement.total_operating_expense?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provision Expense</span>
                  <span className="font-medium">KES {incomeStatement.total_provision_expense?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Expenses</span>
                  <span>KES {incomeStatement.total_expenses?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Net Income</span>
                <span className={`${incomeStatement.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {incomeStatement.net_income?.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Period: {new Date(dateRange.start_date).toLocaleDateString()} - {new Date(dateRange.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {!loading && activeReport === 'balance' && balanceSheet && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Balance Sheet</h2>
            <button onClick={() => exportToCSV(balanceSheet, 'balance_sheet')} className="text-blue-600 hover:text-blue-700">
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Assets</h3>
              <div className="space-y-2">
                {balanceSheet.assets_details && Object.entries(balanceSheet.assets_details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium">KES {value?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Assets</span>
                  <span>KES {balanceSheet.total_assets?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Liabilities & Equity</h3>
              <div className="space-y-2">
                {balanceSheet.liabilities_details && Object.entries(balanceSheet.liabilities_details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium">KES {value?.toLocaleString()}</span>
                  </div>
                ))}
                {balanceSheet.equity_details && Object.entries(balanceSheet.equity_details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium">KES {value?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Liabilities & Equity</span>
                  <span>KES {(balanceSheet.total_liabilities + balanceSheet.total_equity)?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
            As at: {new Date(asAtDate).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;