import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AtmButton from '../components/AtmButton';

export default function Balance() {
  const [accountType, setAccountType] = useState('savings');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkBalance = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('http://localhost:5000/api/balance');
      setBalance(data.balance);
    } catch (err) {
        console.error(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-bold mb-8">Balance Inquiry</h1>
        
        <select
          value={accountType}
          onChange={e => setAccountType(e.target.value)}
          className="w-full bg-gray-800 text-white p-4 rounded-xl text-xl mb-8"
        >
          <option value="savings">Savings Account</option>
          <option value="current">Current Account</option>
        </select>

        {balance != null && (
          <div className="bg-green-900/50 border border-green-500 p-8 rounded-2xl mb-8">
            <p className="text-green-400 text-sm">Available Balance</p>
            <p className="text-5xl font-bold text-green-400 mt-2">₹{balance}</p>
          </div>
        )}

        <AtmButton label={loading ? "Checking..." : "Check Balance"} onClick={checkBalance} disabled={loading} color="green" />
        
        <AtmButton label="Back to Menu" onClick={() => navigate('/menu')} color="gray" className="mt-4" />
      </div>
    </div>
  );
}
