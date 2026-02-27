export default function ErrorMessage({ message, className = "" }) {
  if (!message) return null;

  return (
    <div
      className={`
        bg-red-900/40 
        border border-red-600/70 
        text-red-300 
        px-5 py-3 
        rounded-xl 
        text-center 
        text-base 
        font-medium 
        shadow-sm 
        mt-4 
        ${className}
      `}
      role="alert"
    >
      {message}
    </div>
  );
}