export default function Timer({ seconds }) {
  return <span className="text-red-400 font-bold">00:{seconds.toString().padStart(2, '0')}</span>;
}