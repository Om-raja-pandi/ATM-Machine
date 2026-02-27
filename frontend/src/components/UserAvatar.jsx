import { useState, useEffect } from 'react';
import api from '../services/api';

export default function UserAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await api.post('/userdetails');
      setUserData(res.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
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

  const formatAmount = (amount, type) => {
    return type === 'deposit' ? `+₹${amount}` : `-₹${amount}`;
  };

  const getInitial = (name) => {
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const maskMobile = (mobile) => {
    return mobile ? `xxxxxx${mobile.slice(-4)}` : '';
  };

  if (loading) {
    return (
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-white"
      >
        {userData?.user?.name ? getInitial(userData.user.name) : (userData?.user?.mobile ? getInitial(userData.user.mobile) : '?')}
      </button>

      {/* Dropdown Panel */}
      {isOpen && userData && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                {userData?.user?.name ? getInitial(userData.user.name) : (userData?.user?.mobile ? getInitial(userData.user.mobile) : '?')}
              </div>
              <div className="text-white">
                <p className="font-semibold text-lg">
                  {userData.user.name || maskMobile(userData.user.mobile)}
                </p>
                {userData.user.email && (
                  <p className="text-blue-200 text-xs">{userData.user.email}</p>
                )}
                <p className="text-blue-200 text-xs">{maskMobile(userData.user.mobile)}</p>
              </div>
            </div>
            <p className="text-white text-2xl font-bold mt-3">₹{userData.user.balance.toLocaleString('en-IN')}</p>
          </div>

          {/* Transactions List */}
          <div className="p-3 bg-gray-900">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2 px-1">Last 5 Transactions</p>
            {userData.transactions && userData.transactions.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {userData.transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
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
                      {formatAmount(transaction.amount, transaction.type)}
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
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
