import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AtmInput from '../components/AtmInput';
import AtmButton from '../components/AtmButton';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('http://localhost:5000/api/deposit', { amount: Number(amount) });
      setMessage(`₹${amount} deposited successfully! New balance: ₹${data.balance}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-700 w-full max-w-md rounded-3xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8">Cash Deposit</h1>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Account Type</label>
          <select value={accountType} onChange={e => setAccountType(e.target.value)}
            className="w-full bg-gray-800 text-white p-4 rounded-xl text-xl">
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>
        </div>

        <AtmInput
          label="Amount (₹)"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter amount (multiple of 100)"
        />

        {message && <p className="text-center text-green-400 font-bold mb-6">{message}</p>}

        <div className="grid grid-cols-3 gap-4">
          <AtmButton label="Cancel" onClick={() => navigate('/menu')} color="red" />
          <AtmButton label="Clear" onClick={() => setAmount('')} color="gray" />
          <AtmButton label="Confirm" onClick={handleDeposit} color="green" disabled={loading} />
        </div>
      </div>
    </div>
  );
}
