
import { useState } from "react";
import { Plus, FileText, Download, Calendar, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/DashboardHeader";
import NewProofModal from "@/components/NewProofModal";
import PricingModal from "@/components/PricingModal";
import { usePaymentProofs } from "@/hooks/usePaymentProofs";
import { format } from "date-fns";

const Dashboard = () => {
  const [showNewProof, setShowNewProof] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const { proofs, loading } = usePaymentProofs();
  
  const totalProofs = proofs.length;
  const paidProofs = proofs.filter(proof => proof.is_paid).length;
  const thisMonthProofs = proofs.filter(proof => {
    const proofDate = new Date(proof.created_at);
    const now = new Date();
    return proofDate.getMonth() === now.getMonth() && proofDate.getFullYear() === now.getFullYear();
  }).length;

  const handleDownload = (proof: any) => {
    if (!proof.is_paid) {
      setShowPricing(true);
      return;
    }
    
    // Handle PDF download for paid proofs
    if (proof.proof_pdf) {
      window.open(proof.proof_pdf, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Proofs</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProofs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{paidProofs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{thisMonthProofs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-2xl font-bold text-gray-900">Free</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Payment Proofs</h1>
          <Button 
            onClick={() => setShowNewProof(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Proof
          </Button>
        </div>

        {/* Proofs Grid */}
        {proofs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proofs yet</h3>
              <p className="text-gray-600 mb-6">Create your first payment proof to get started</p>
              <Button 
                onClick={() => setShowNewProof(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Proof
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((proof) => (
              <Card key={proof.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{proof.sender_name} → {proof.receiver_name}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{proof.proof_type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      proof.is_paid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proof.is_paid ? 'Paid' : 'Free'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${proof.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{proof.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {format(new Date(proof.payment_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View
                    </Button>
                    {proof.is_paid ? (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleDownload(proof)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        onClick={() => setShowPricing(true)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <NewProofModal 
        isOpen={showNewProof} 
        onClose={() => setShowNewProof(false)} 
      />
      
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </div>
  );
};

export default Dashboard;
