import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AtmInput from '../components/AtmInput';
import AtmButton from '../components/AtmButton';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!amount || Number(amount) < 100) {
      setMessage('Please enter a valid amount (minimum Rs.100)');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('http://localhost:5000/api/withdraw', { amount: Number(amount) });
      setMessage(`₹${amount} withdrawn successfully! New balance: ₹${data.balance}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-3xl p-10">
        <h1 className="text-white text-3xl font-bold text-center mb-6">Cash Withdrawal</h1>
        
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Account Type</label>
          <select value={accountType} onChange={e => setAccountType(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-xl text-xl">
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>
        </div>

        <AtmInput
          label="Amount (₹)"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter amount (minimum Rs.100)"
        />

        {message && <p className="text-center text-green-400 font-bold mb-4">{message}</p>}

        <div className="grid grid-cols-3 gap-4">
          <AtmButton label="Cancel" onClick={() => navigate('/menu')} color="red" />
          <AtmButton label="Clear" onClick={() => setAmount('')} color="gray" />
          <AtmButton label="Enter" onClick={handleWithdraw} color="green" disabled={loading} />
        </div>
      </div>
    </div>
  );
}
