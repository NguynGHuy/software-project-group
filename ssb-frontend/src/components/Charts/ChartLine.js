import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "T2", value: 30 },
  { name: "T3", value: 45 },
  { name: "T4", value: 50 },
  { name: "T5", value: 70 },
  { name: "T6", value: 60 },
  { name: "T7", value: 90 },
];

export default function ChartLine() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
      <h3 className="text-gray-400 text-sm mb-3">Hoạt động trong tuần</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
          <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
