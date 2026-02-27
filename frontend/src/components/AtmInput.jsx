export default function AtmInput({ label, value, onChange, type = 'text', maxLength, placeholder }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full bg-gray-900 text-white text-2xl p-4 rounded-xl border border-gray-700 focus:border-blue-500 outline-none"
      />
    </div>
  );
}