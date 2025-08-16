import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Loading from "../../Pages/Loading/Loading";
import { format } from "date-fns";

const COLORS = ["#36A2EB", "#4CAF50"];

const Balance = () => {
  // Admin stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-balance"],
    queryFn: async () => {
      const res = await axios.get("/admin-stats");
      return res.data;
    },
  });

  // Subscribers & Paid Members
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chart-stats"],
    queryFn: async () => {
      const res = await axios.get("/chart-stats");
      return res.data;
    },
  });

  // Revenue history for line chart
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { data: revenueHistory, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-history"],
    queryFn: async () => {
      const res = await axios.get("/revenue-history");
      if (!Array.isArray(res.data)) return [];
      return res.data.map((item) => {
        const monthNum = item._id?.month; // check _id.month
        return {
          month:
            monthNum >= 1 && monthNum <= 12
              ? monthNames[monthNum - 1]
              : "Unknown",
          amount: item.amount || 0,
        };
      });
    },
  });

  if (statsLoading || chartLoading || revenueLoading) return <Loading />;

  return (
    <section className="py-16">
      {/* Stat Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-white">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <DollarSign className="text-green-400" size={32} />
            <span className="text-green-300 text-sm flex items-center gap-1">
              <TrendingUp size={14} />{" "}
              {revenueHistory?.length > 1
                ? `+${Math.round(
                    ((revenueHistory[revenueHistory.length - 1].amount -
                      revenueHistory[revenueHistory.length - 2].amount) /
                      revenueHistory[revenueHistory.length - 2].amount) *
                      100
                  )}%`
                : "+0%"}
            </span>
          </div>
          <h2 className="text-lg mt-3">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-400">
            ${statsData?.totalRevenue?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Subscribers */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <Users className="text-blue-400" size={32} />
          </div>
          <h2 className="text-lg mt-3">Subscribers</h2>
          <p className="text-3xl font-bold text-blue-400">
            {chartData?.subscribersCount || 0}
          </p>
        </div>

        {/* Paid Members */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <CreditCard className="text-purple-400" size={32} />
          </div>
          <h2 className="text-lg mt-3">Paid Members</h2>
          <p className="text-3xl font-bold text-purple-400">
            {chartData?.paidMembersCount || 0}
          </p>
        </div>
      </div>

      {/* Graphs */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mt-12">
        {/* Line Chart (Revenue Growth) */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueHistory || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#36A2EB"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Subscribers vs Paid Members
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
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

      {/* Transactions Table */}
      <div className="max-w-5xl mx-auto mt-16 text-white">
        <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10">
                <th className="p-3">Customer</th>
                <th className="p-3">Email</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {statsData?.lastSixPayments?.length > 0 ? (
                statsData.lastSixPayments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="p-3 font-medium">
                      {payment.userName || "Anonymous"}
                    </td>
                    <td className="p-3 text-gray-300">{payment.email}</td>
                    <td className="p-3 text-green-400">${payment.amount}</td>
                    <td className="p-3 text-gray-400">
                      {payment.createdAt
                        ? format(
                            new Date(payment.createdAt),
                            "MMM dd, yyyy · hh:mm a"
                          )
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        {payment.paymentStatus === "succeeded"
                          ? "Succeeded"
                          : payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Balance;
