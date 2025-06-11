
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, TrendingUp } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

const AdminDashboard = () => {
  // Mock data - would come from Supabase
  const stats = {
    totalUsers: 1248,
    totalProofs: 5678,
    totalRevenue: 12450,
    monthlyGrowth: 23.5
  };

  const recentProofs = [
    { id: 1, user: "john@example.com", type: "Visa Application", amount: "$2,500", date: "2024-06-10" },
    { id: 2, user: "sarah@example.com", type: "Rent", amount: "$1,200", date: "2024-06-10" },
    { id: 3, user: "mike@example.com", type: "Tax", amount: "$800", date: "2024-06-09" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Proofs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProofs.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Proofs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payment Proofs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProofs.map((proof) => (
                    <tr key={proof.id} className="border-b">
                      <td className="py-3">{proof.user}</td>
                      <td className="py-3">{proof.type}</td>
                      <td className="py-3">{proof.amount}</td>
                      <td className="py-3">{proof.date}</td>
                      <td className="py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
