import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AtmInput from '../components/AtmInput';
import AtmButton from '../components/AtmButton';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await api.post("/login", {
        mobile,
        pincode
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/region');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 from-blue-600 to-blue-950 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-3xl p-10 shadow-2xl border border-blue-800">
        <h1 className="text-5xl font-bold text-center text-white mb-10 tracking-widest">ATM</h1>
        
        <AtmInput
          label="Registered Phone Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          maxLength={10}
          placeholder="98xxxxxxxx"
        />
        
        <AtmInput
          label="4-Digit PIN"
          type="password"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          maxLength={4}
          placeholder="••••"
        />

        {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mt-10">
          <AtmButton label="Cancel" onClick={() => {setMobile(''); setPincode('');}} color="gray" />
          <AtmButton label="Enter" onClick={handleLogin} color="green" />
          <p 
            className="text-sm text-center mt-4 text-white cursor-pointer hover:underline">
          You don't have account?{" "}
          <span
            className="text-center text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >SignUp
          </span>
        </p>
        </div>
      </div>
    </div>
  );
}
