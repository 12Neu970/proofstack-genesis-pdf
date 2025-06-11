
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';
import { usePaymentProofs } from '@/hooks/usePaymentProofs';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { proofs, loading } = usePaymentProofs();
  const [showNewProofModal, setShowNewProofModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Proofs</h1>
            <p className="text-gray-600 mt-2">Manage your payment documentation</p>
          </div>
          <Button 
            onClick={() => setShowNewProofModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Proof
          </Button>
        </div>

        {proofs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proofs yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first payment proof to get started with professional documentation.
              </p>
              <Button 
                onClick={() => setShowNewProofModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Proof
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((proof) => (
              <Card key={proof.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{proof.proof_type}</CardTitle>
                    <Badge variant={proof.is_paid ? "default" : "secondary"}>
                      {proof.is_paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">From:</span> {proof.sender_name}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {proof.receiver_name}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ${proof.amount}
                    </div>
                    <div>
                      <span className="font-medium">Method:</span> {proof.payment_method}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(proof.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    {proof.is_paid ? (
                      <Button className="w-full" variant="outline">
                        Download PDF
                      </Button>
                    ) : (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Upgrade to Download ($3)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
