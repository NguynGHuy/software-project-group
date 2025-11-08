export default function StatCard({ title, value }) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] hover:border-yellow-500 transition-all">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-semibold text-yellow-400">{value}</p>
    </div>
  );
}
