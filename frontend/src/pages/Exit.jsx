import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Exit() {
  const navigate = useNavigate();

  useEffect(() => {
    api.post('http://localhost:5000/api/exit')
      .then(() => {
        localStorage.removeItem('token');
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-400 mb-6">Thank You!</h1>
        <p className="text-2xl text-gray-300">Visit again soon</p>
        <p className="text-gray-500 mt-8">Redirecting to login...</p>
      </div>
    </div>
  );
}