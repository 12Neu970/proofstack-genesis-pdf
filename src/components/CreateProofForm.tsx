
import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePaymentProofs } from "@/hooks/usePaymentProofs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateProofFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProofFormData {
  payer_name: string;
  receiver_name: string;
  amount: string;
  currency: string;
  purpose: string;
  payment_method: string;
  payment_date: Date | undefined;
}

const CreateProofForm = ({ isOpen, onClose }: CreateProofFormProps) => {
  const [formData, setFormData] = useState<ProofFormData>({
    payer_name: "",
    receiver_name: "",
    amount: "",
    currency: "USD",
    purpose: "",
    payment_method: "",
    payment_date: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [submittedProofId, setSubmittedProofId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const { createProof } = usePaymentProofs();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_date) {
      toast({
        title: "Error",
        description: "Please select a payment date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const proofData = {
        sender_name: formData.payer_name,
        receiver_name: formData.receiver_name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        purpose: formData.purpose,
        payment_method: formData.payment_method,
        payment_date: format(formData.payment_date, 'yyyy-MM-dd'),
        proof_type: 'Other' as const,
      };

      const result = await createProof(proofData);
      if (result) {
        setSubmittedProofId(result.id);
        toast({
          title: "Success",
          description: "Proof created successfully! You can now proceed with payment.",
        });
      }
    } catch (error) {
      console.error('Error creating proof:', error);
      toast({
        title: "Error",
        description: "Failed to create proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!submittedProofId) return;
    
    setPaymentLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { proofId: submittedProofId }
      });

      if (error) throw error;

      if (data.success && data.payment_link) {
        // Open payment in new tab
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
    } finally {
      setPaymentLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      payer_name: "",
      receiver_name: "",
      amount: "",
      currency: "USD",
      purpose: "",
      payment_method: "",
      payment_date: undefined,
    });
    setSubmittedProofId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Payment Proof</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!submittedProofId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payer_name">Payer Name</Label>
                  <Input
                    id="payer_name"
                    value={formData.payer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, payer_name: e.target.value }))}
                    placeholder="Who made the payment"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="receiver_name">Receiver Name</Label>
                  <Input
                    id="receiver_name"
                    value={formData.receiver_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, receiver_name: e.target.value }))}
                    placeholder="Who received the payment"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1000"
                    required
                  />
                </div>
                
                <div>
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="NGN">NGN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flutterwave">Flutterwave</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Binance">Binance</SelectItem>
                      <SelectItem value="Wise">Wise</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Purpose/Description</Label>
                  <Textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="What was this payment for?"
                    className="min-h-[80px]"
                    required
                  />
                </div>
                
                <div>
                  <Label>Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.payment_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.payment_date ? format(formData.payment_date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.payment_date}
                        onSelect={(date) => setFormData(prev => ({ ...prev, payment_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating...' : 'Create Proof'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Proof Created Successfully!</h3>
                <p className="text-green-700 mb-4">
                  Your payment proof has been created. To generate and download your professional PDF certificate, 
                  please complete the payment of $3.
                </p>
                <Button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                >
                  {paymentLoading ? 'Generating Payment Link...' : 'Pay $3 & Generate PDF'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Proof Details:</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
                  <div><strong>Payer:</strong> {formData.payer_name}</div>
                  <div><strong>Receiver:</strong> {formData.receiver_name}</div>
                  <div><strong>Amount:</strong> {formData.currency} {formData.amount}</div>
                  <div><strong>Purpose:</strong> {formData.purpose}</div>
                  <div><strong>Payment Method:</strong> {formData.payment_method}</div>
                  <div><strong>Date:</strong> {formData.payment_date ? format(formData.payment_date, "PPP") : "N/A"}</div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProofForm;
