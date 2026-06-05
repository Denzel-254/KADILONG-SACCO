import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye, FiPlus, FiTrash2, FiUserX } from 'react-icons/fi';
import { adminAPI, memberAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MemberManagement = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    national_id: '',
    date_of_birth: '',
    occupation: '',
    monthly_income: '',
    employer: '',
    physical_address: '',
    postal_address: '',
    emergency_contact: '',
    emergency_contact_name: '',
    phone_number: '',
    email: '',
    has_smartphone: false,
  });

  useEffect(() => {
    fetchMembers();
    fetchPendingMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAllMembersWithUsers();
      setMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const response = await adminAPI.getPendingMembers();
      setPendingMembers(response.data?.members || []);
    } catch (error) {
      console.error('Failed to load pending members:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Check if member already exists by national_id
      const existingMembers = await memberAPI.getAllMembersWithUsers();
      const memberExists = existingMembers.data.some(
        m => m.national_id === formData.national_id
      );
      
      if (memberExists) {
        toast.error('Member with this National ID already exists!');
        setSubmitting(false);
        return;
      }
      
      // Register the user first
      const username = formData.national_id;
      const defaultPassword = formData.national_id.slice(-6);
      
      const userData = {
        username: username,
        email: formData.email || `${formData.national_id}@temp.sacco.com`,
        password: defaultPassword,
        full_name: formData.full_name,
        phone_number: formData.phone_number || formData.emergency_contact,
        role: 'member'
      };
      
      await memberAPI.registerUser(userData);
      
      // Then create member profile with ALL required fields
      const memberData = {
        national_id: formData.national_id,
        date_of_birth: formData.date_of_birth,
        occupation: formData.occupation || "Not specified",
        monthly_income: parseFloat(formData.monthly_income) || 0,
        employer: formData.employer || "Not specified",
        physical_address: formData.physical_address || "Not provided",
        postal_address: formData.postal_address || "Not provided",
        emergency_contact: formData.emergency_contact,
        emergency_contact_name: formData.emergency_contact_name,
        has_smartphone: formData.has_smartphone,
        phone_number: formData.phone_number || formData.emergency_contact,
        email: formData.email || `${formData.national_id}@temp.sacco.com`,
        full_name: formData.full_name
      };
      
      await memberAPI.createProfile(memberData);
      
      toast.success(`Member ${formData.full_name} added successfully! Default password: ${defaultPassword}`);
      setShowAddMemberModal(false);
      resetForm();
      fetchMembers();
      fetchPendingMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.detail;
        if (Array.isArray(errorMsg)) {
          const messages = errorMsg.map(err => err.msg).join(', ');
          toast.error(messages);
        } else {
          toast.error(errorMsg || 'Failed to add member. Please check all fields.');
        }
      } else if (error.response?.status === 409) {
        toast.error('Member with this information already exists');
      } else {
        toast.error('Failed to add member. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivateMember = async (memberId) => {
    try {
      await adminAPI.activateMember(memberId);
      toast.success('Member activated successfully');
      fetchMembers();
      fetchPendingMembers();
    } catch (error) {
      toast.error('Failed to activate member');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    setSubmitting(true);
    try {
      await adminAPI.deleteMember(memberToDelete.id);
      toast.success(`Member ${memberToDelete.full_name || memberToDelete.member_number} has been deleted successfully`);
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
      fetchMembers();
      fetchPendingMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      national_id: '',
      date_of_birth: '',
      occupation: '',
      monthly_income: '',
      employer: '',
      physical_address: '',
      postal_address: '',
      emergency_contact: '',
      emergency_contact_name: '',
      phone_number: '',
      email: '',
      has_smartphone: false,
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      blacklisted: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredMembers = members.filter(member => 
    member.member_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600 mt-1">Manage all SACCO members, activate accounts, and monitor member activity</p>
        </div>
        <button
          onClick={() => setShowAddMemberModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" /> Add New Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingMembers.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended/Deleted</p>
              <p className="text-2xl font-bold text-red-600">{members.filter(m => m.status === 'suspended').length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiUserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {pendingMembers.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Member Approvals</h2>
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-4 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Member {member.member_number}</p>
                  <p className="text-sm text-gray-600">National ID: {member.national_id}</p>
                </div>
                <button
                  onClick={() => handleActivateMember(member.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                >
                  <FiCheckCircle className="w-4 h-4 mr-2" /> Activate Member
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, member number or national ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">National ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{member.member_number?.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{member.full_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">ID: {member.member_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.member_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{member.national_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {member.monthly_income?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{member.credit_score || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.registration_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowMemberModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(member)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Member"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddMemberModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add New Member</h2>
                <button onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Fill in the member details below</p>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              {/* Full Name and National ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                  <input
                    type="text"
                    value={formData.national_id}
                    onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12345678"
                  />
                </div>
              </div>

              {/* Date of Birth and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0712345678"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="member@example.com"
                />
              </div>

              {/* Occupation and Monthly Income */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Teacher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (KES)</label>
                  <input
                    type="number"
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Employer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company name"
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0712345678"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={formData.physical_address}
                  onChange={(e) => setFormData({ ...formData, physical_address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Street address"
                />
              </div>

              {/* Postal Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Address</label>
                <input
                  type="text"
                  value={formData.postal_address}
                  onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="PO Box 123"
                />
              </div>

              {/* Has Smartphone */}
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.has_smartphone}
                  onChange={(e) => setFormData({ ...formData, has_smartphone: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Member has a smartphone (can use mobile app)</span>
              </label>

              {/* Info Note */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Default password will be the last 6 digits of the National ID.
                  Member can change password after first login.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding Member...' : 'Add Member'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMemberModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
                <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Member Number</p>
                  <p className="font-medium">{selectedMember.member_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium">{selectedMember.full_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">National ID</p>
                  <p className="font-medium">{selectedMember.national_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedMember.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedMember.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedMember.status)}`}>
                    {selectedMember.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Credit Score</p>
                  <p className="font-medium">{selectedMember.credit_score || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Income</p>
                  <p className="font-medium">KES {selectedMember.monthly_income?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Occupation</p>
                  <p className="font-medium">{selectedMember.occupation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employer</p>
                  <p className="font-medium">{selectedMember.employer || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registration Date</p>
                  <p className="font-medium">{new Date(selectedMember.registration_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Has Smartphone</p>
                  <p className="font-medium">{selectedMember.has_smartphone ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Emergency Contact</p>
                <p className="font-medium">{selectedMember.emergency_contact_name} - {selectedMember.emergency_contact}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Physical Address</p>
                <p className="font-medium">{selectedMember.physical_address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete member <strong>{memberToDelete.full_name || memberToDelete.member_number}</strong>?
              </p>
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone. The member's account will be permanently deleted.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteMember}
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Yes, Delete Member'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
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

export default MemberManagement;