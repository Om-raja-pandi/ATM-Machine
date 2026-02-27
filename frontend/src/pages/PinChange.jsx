import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AtmInput from '../components/AtmInput';
import AtmButton from '../components/AtmButton';

export default function PinChange() {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updatePin = async () => {
    if (newPin !== confirmPin) {
      setMessage('PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      setMessage('PIN must be 4 digits');
      return;
    }
    setLoading(true);
    try {
      await api.post('http://localhost:5000/api/changepin', { 
        oldPin, 
        newPin 
      });
      setMessage('PIN changed successfully!');
      setTimeout(() => navigate('/menu'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-3xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8">Change PIN</h1>

        <AtmInput 
          label="Current PIN" 
          value={oldPin} 
          onChange={e => setOldPin(e.target.value.replace(/\D/g, '').slice(0,4))} 
          maxLength={4} 
          placeholder="Enter current PIN"
        />
        <AtmInput 
          label="New PIN" 
          value={newPin} 
          onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0,4))} 
          maxLength={4} 
          placeholder="Enter new PIN"
        />
        <AtmInput 
          label="Confirm New PIN" 
          value={confirmPin} 
          onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0,4))} 
          maxLength={4} 
          placeholder="Confirm new PIN"
        />

        {message && <p className="text-center mt-6 text-lg font-semibold text-green-400">{message}</p>}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <AtmButton label="Cancel" onClick={() => navigate('/menu')} color="red" />
          <AtmButton label="Clear" onClick={() => {setOldPin(''); setNewPin(''); setConfirmPin(''); setMessage('');}} color="gray" />
          <AtmButton label="Update" onClick={updatePin} color="green" disabled={loading} />
        </div>
      </div>
    </div>
  );
}
