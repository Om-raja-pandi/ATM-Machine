export default function AtmButton({ label, onClick, color = 'blue', disabled = false }) {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    gray: 'bg-gray-600 hover:bg-gray-700',
    
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-5 text-xl font-bold text-white rounded-xl transition-all shadow-lg ${colors[color]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}