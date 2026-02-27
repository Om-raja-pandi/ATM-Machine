import { useNavigate } from 'react-router-dom';
import AtmButton from '../components/AtmButton';

export default function RegionSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-3xl p-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-12">Select Region</h1>
        <div className="space-y-6">
          <AtmButton label="🇮🇳 Domestic" onClick={() => navigate('/menu')} color="green" />
          <AtmButton label="🌍 International" onClick={() => navigate('/menu')} color="blue" />
        </div>
      </div>
    </div>
  );
}