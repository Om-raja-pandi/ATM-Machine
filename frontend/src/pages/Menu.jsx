import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AtmButton from '../components/AtmButton';
import api from '../services/api';

export default function Menu() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [updating, setUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUserDetails();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowEditProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await api.post('/userdetails');
      setUserData(res.data);
      setProfileForm({
        name: res.data.user?.name || '',
        email: res.data.user?.email || ''
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      console.log('Sending update request with:', profileForm);
      
      const res = await api.post('/updateprofile', profileForm);
      console.log('Update response:', res.data);
      
      await fetchUserDetails();
      setShowEditProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      alert('Error updating profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const buttons = [
    { label: 'Withdraw', path: '/withdraw', color: 'green' },
    { label: 'Deposit', path: '/deposit', color: 'green' },
    { label: 'Mini Statement', path: '/mini-statement', color: 'blue' },
    { label: 'Balance Inquiry', path: '/balance', color: 'blue' },
    { label: 'Change PIN', path: '/pin-change', color: 'blue' },
    { label: 'Exit', path: '/exit', color: 'red' },
  ];

  const getInitial = (value) => {
    if (value && value.length > 0) {
      return value.charAt(0).toUpperCase();
    }
    return '?';
  };

  const maskMobile = (mobile) => {
    return mobile ? `xxxxxx${mobile.slice(-4)}` : '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl p-10">
        {/* Header with user info - Main Menu heading on left, avatar on right */}
        <div className="flex items-center justify-between mb-12">
          {/* Left side - Main Menu heading */}
          <h1 className="text-4xl font-bold text-white">Main Menu</h1>
          
          {/* Right side - Avatar with dropdown */}
          {!loading && userData && (
            <div className="relative" ref={dropdownRef}>
              {/* Clickable Avatar Button */}
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {userData.user.name || maskMobile(userData.user.mobile)}
                  </p>
                  <p className="text-blue-300 text-xs">₹{userData.user.balance?.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white cursor-pointer">
                  {userData.user.name ? getInitial(userData.user.name) : getInitial(userData.user.mobile)}
                </div>
              </button>

              {/* Dropdown Panel */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
{/* Edit Profile Form */}
                  {showEditProfile ? (
                    <div className="p-4 bg-gray-800" onClick={(e) => e.stopPropagation()}>
                      <h3 className="text-white font-bold mb-3">Edit Profile</h3>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowEditProfile(false); }}
                          className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateProfile(); }}
                          disabled={updating}
                          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                        >
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                            {userData.user.name ? getInitial(userData.user.name) : getInitial(userData.user.mobile)}
                          </div>
                          <div className="text-white">
                            <p className="font-semibold text-lg">{maskMobile(userData.user.mobile)}</p>
                            {userData.user.name ? (
                              <p className="text-blue-200 text-sm">{userData.user.name}</p>
                            ) : (
                              <button 
                                onClick={() => setShowEditProfile(true)}
                                className="text-blue-300 text-xs underline hover:text-blue-200"
                              >
                                + Add Name
                              </button>
                            )}
                            {userData.user.email ? (
                              <p className="text-blue-200 text-xs">{userData.user.email}</p>
                            ) : (
                              <button 
                                onClick={() => setShowEditProfile(true)}
                                className="text-blue-300 text-xs underline hover:text-blue-200"
                              >
                                + Add Email
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-white text-2xl font-bold mt-3">₹{userData.user.balance?.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Edit Profile Button */}
                      <div className="p-2 bg-gray-800 border-b border-gray-700">
                        <button
                          onClick={() => setShowEditProfile(true)}
                          className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          ✏️ Edit Profile
                        </button>
                      </div>

                      {/* Transactions List */}
                      <div className="p-3 bg-gray-900 max-h-48 overflow-y-auto">
                        <p className="text-gray-400 text-xs font-semibold uppercase mb-2 px-1">Last 5 Transactions</p>
                        {userData.transactions && userData.transactions.length > 0 ? (
                          <div className="space-y-2">
                            {userData.transactions.map((transaction, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {transaction.type === 'deposit' ? '↓' : '↑'}
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium capitalize">{transaction.type}</p>
                                    <p className="text-gray-500 text-xs">{formatDate(transaction.createdAt)}</p>
                                  </div>
                                </div>
                                <span className={`font-bold ${
                                  transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
                        )}
                      </div>

                      {/* Close Button */}
                      <div className="p-2 bg-gray-800 border-t border-gray-700">
                        <button
                          onClick={() => setShowDropdown(false)}
                          className="w-full py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {loading && (
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {buttons.map((btn, i) => (
            <AtmButton
              key={i}
              label={btn.label}
              onClick={() => navigate(btn.path)}
              color={btn.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
