
import { useState } from 'react';
import { Plus, Download, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/DashboardHeader';
import CreateProofForm from '@/components/CreateProofForm';
import { usePaymentProofs } from '@/hooks/usePaymentProofs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { proofs, loading, downloadProof } = usePaymentProofs();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (proof: any) => {
    if (!proof.is_paid) {
      toast({
        title: "Payment Required",
        description: "Please complete payment to download your proof.",
        variant: "destructive",
      });
      return;
    }

    setDownloadingId(proof.id);
    try {
      const pdfBlob = await downloadProof(proof);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment-proof-${proof.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: "PDF downloaded successfully!",
        });
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePayment = async (proofId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { proofId }
      });

      if (error) throw error;

      if (data.success && data.payment_link) {
        window.open(data.payment_link, '_blank');
        toast({
          title: "Payment Link Generated",
          description: "Complete your payment in the new tab to generate your PDF.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (proof: any) => {
    if (proof.is_paid) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    }
    
    if (proof.payment_status === 'pending') {
      return <Badge variant="outline" className="border-yellow-200 text-yellow-800">Payment Pending</Badge>;
    }
    
    return <Badge variant="secondary">Awaiting Payment</Badge>;
  };

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
            <p className="text-gray-600 mt-2">Create and manage your professional payment documentation</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
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
                onClick={() => setShowCreateModal(true)}
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
                    <CardTitle className="text-lg truncate">{proof.purpose || proof.proof_type}</CardTitle>
                    {getStatusBadge(proof)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div>
                      <span className="font-medium">From:</span> {proof.sender_name}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {proof.receiver_name}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {proof.currency || 'USD'} {proof.amount}
                    </div>
                    <div>
                      <span className="font-medium">Method:</span> {proof.payment_method}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(proof.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    {proof.is_paid ? (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleDownload(proof)}
                        disabled={downloadingId === proof.id}
                      >
                        {downloadingId === proof.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Downloading...
                          </div>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    ) : proof.payment_status === 'pending' ? (
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-yellow-600 hover:bg-yellow-700" 
                          variant="outline"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Payment Processing
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Complete your payment to generate PDF
                        </p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handlePayment(proof.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Pay $3 & Generate PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateProofForm 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
