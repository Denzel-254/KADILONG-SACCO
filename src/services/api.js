import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),

};

// Member APIs
export const memberAPI = {
  getMyProfile: () => api.get('/members/me'),
  createProfile: (data) => api.post('/members/', data),
  getAllMembers: () => api.get('/members/'),
  registerUser: (data) => api.post('/auth/register', data),
  updateProfile: (memberId, data) => api.put(`/members/${memberId}`, data),
  getUserById: (userId) => api.get(`/users/${userId}`), // You'll need to add this endpoint or use auth/me
  getAllMembersWithUsers: () => api.get('/members/admin/all-members'),



};

// Loan APIs
export const loanAPI = {
  getProducts: () => api.get('/loans/products'),
  createProduct: (data) => api.post('/loans/products', data),
  updateProduct: (productId, data) => api.put(`/loans/products/${productId}`, data),
  applyForLoan: (data) => api.post('/loans/apply', data),
  getMyLoans: () => api.get('/loans/my-loans'),
  getPendingApplications: () => api.get('/loans/applications/pending'),
  approveLoan: (loanId, data) => api.post(`/loans/applications/${loanId}/approve`, data),
  disburseLoan: (loanId, params) => api.post(`/loans/applications/${loanId}/disburse`, null, { params }),
  getRepaymentSchedule: (loanId) => api.get(`/loans/${loanId}/repayment-schedule`),
  makePayment: (loanId, params) => api.post(`/loans/${loanId}/pay`, null, { params }),
  getLoanSummary: () => api.get('/loans/my-summary'),
  getAllActiveLoans: () => api.get('/loans/admin/active-loans'),

};

// Savings APIs
export const savingsAPI = {
  createAccount: (data) => api.post('/savings/accounts', data),
  getMyAccounts: () => api.get('/savings/accounts/my'),
  deposit: (data) => api.post('/savings/deposit', data),
  withdraw: (data) => api.post('/savings/withdraw', data),
  getTransactions: (accountId, limit = 50) => api.get(`/savings/transactions/account/${accountId}?limit=${limit}`),
  getStatement: (accountId, startDate, endDate) => api.get(`/savings/statement/${accountId}?start_date=${startDate}&end_date=${endDate}`),
  getDashboard: () => api.get('/savings/dashboard/summary'),
  getAllAccounts: () => api.get('/savings/admin/all-accounts'),
  getAdminDashboard: () => api.get('/savings/admin/dashboard'),
};

// Admin APIs
export const adminAPI = {
  getPendingMembers: () => api.get('/admin/members/pending'),
  activateMember: (memberId) => api.patch(`/admin/members/${memberId}/activate`),
  suspendMember: (memberId, reason) => api.patch(`/admin/members/${memberId}/suspend?reason=${reason || ''}`),
  getPendingLoans: () => api.get('/loans/applications/pending'),
  getOverdueLoans: () => api.get('/loans/overdue'),
  getDefaulters: () => api.get('/penalty/defaulters'),
  getOverdueSummary: () => api.get('/penalty/overdue/summary'),
  calculatePenalties: () => api.post('/penalty/calculate'),
  getPenaltySettings: () => api.get('/penalty/settings/active'),
  updatePenaltySettings: (data) => api.put('/penalty/settings/1', data),
  getCollectionCases: () => api.get('/collection/cases'),
  getPaymentPlans: () => api.get('/collection/payment-plans'),
  getPaymentPlans: () => api.get('/collection/payment-plans'),
  getCollectionCases: () => api.get('/collection/cases'),
  createPaymentPlan: (data) => api.post('/collection/payment-plans', data),
  updatePaymentPlan: (planId, data) => api.put(`/collection/payment-plans/${planId}`, data),
  getDefaulters: () => api.get('/penalty/defaulters'),
  deleteMember: (memberId) => api.delete(`/members/${memberId}`),



};

// Report APIs
export const reportAPI = {
  getIncomeStatement: (startDate, endDate) => api.get(`/reports/income-statement?start_date=${startDate}&end_date=${endDate}`),
  getBalanceSheet: (asAtDate) => api.get(`/reports/balance-sheet?as_at_date=${asAtDate}`),
  getLoanPortfolio: (asAtDate) => api.get(`/reports/loan-portfolio?as_at_date=${asAtDate}`),
  getSavingsReport: (asAtDate) => api.get(`/reports/savings-report?as_at_date=${asAtDate}`),
  getKPIDashboard: (asAtDate) => api.get(`/reports/kpi-dashboard?as_at_date=${asAtDate}`),
};

export default api;