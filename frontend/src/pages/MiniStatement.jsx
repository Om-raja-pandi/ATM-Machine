import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MiniStatement() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.post('http://localhost:5000/api/ministatement')
      .then(res => setTransactions(res.data.transactions))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black p-4">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-3xl p-8">
        <h1 className="text-white text-3xl font-bold text-center mb-8">Mini Statement</h1>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400">No transactions yet</p>
          ) : (
            transactions.map((t, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold">{t.type.toUpperCase()} • {t.accountType}</p>
                  <p className="text-sm text-gray-400">{new Date(t.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={t.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}>
                    {t.type === 'withdraw' ? '-' : '+'}₹{t.amount}
                  </p>
                  <p className="text-xs text-gray-500">Bal: ₹{t.resultingBalance}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="mt-10 w-full bg-blue-600 py-5 rounded-xl text-xl font-bold"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}