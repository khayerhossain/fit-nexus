import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Loading from "../../Pages/Loading/Loading";

const COLORS = ["#FF6384", "#36A2EB"];

const Balance = () => {
  // Fetch total revenue
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-balance"],
    queryFn: async () => {
      const res = await axios.get("/admin-stats");
      return res.data;
    },
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chart-stats"],
    queryFn: async () => {
      const res = await axios.get("/chart-stats");
      return res.data;
    },
  });

  if (statsLoading || chartLoading) return <Loading />;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-white">
        {/* Total Balance Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8 flex flex-col items-center space-y-4 text-center">
          <DollarSign size={40} className="text-green-400 mb-2" />
          <h2 className="text-2xl font-bold">Total Balance</h2>
          <p className="text-5xl font-extrabold text-green-400">
            ${statsData?.totalRevenue || 0}
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            Subscribers vs Paid Members
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive
                data={[
                  {
                    name: "Subscribers",
                    value: chartData?.subscribersCount || 0,
                  },
                  {
                    name: "Paid Members",
                    value: chartData?.paidMembersCount || 0,
                  },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last 6 Transactions */}
      <div className="max-w-4xl mx-auto mt-16 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Last 6 Transactions
        </h2>
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 space-y-4">
          {statsData?.lastSixPayments?.length > 0 ? (
            statsData.lastSixPayments.map((payment, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-white/10 px-4 py-3 rounded-lg hover:bg-white/20 transition"
              >
                <div>
                  <p className="font-medium">
                    {payment.userName || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-400">{payment.email}</p>
                </div>
                <p className="text-green-400 font-semibold">
                  ${payment.amount}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No transactions found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Balance;
