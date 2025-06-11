
import { useState } from "react";
import { X, Upload, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewProofModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProofModal = ({ isOpen, onClose }: NewProofModalProps) => {
  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    amount: "",
    paymentMethod: "",
    proofType: "",
    date: undefined as Date | undefined,
    file: null as File | null
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Placeholder for Supabase integration
    console.log('Creating proof:', formData);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        senderName: "",
        receiverName: "",
        amount: "",
        paymentMethod: "",
        proofType: "",
        date: undefined,
        file: null
      });
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Payment Proof</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                  placeholder="Who sent the payment"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="receiverName">Receiver Name</Label>
                <Input
                  id="receiverName"
                  value={formData.receiverName}
                  onChange={(e) => setFormData(prev => ({ ...prev, receiverName: e.target.value }))}
                  placeholder="Who received the payment"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="$1,000"
                  required
                />
              </div>
              
              <div>
                <Label>Payment Method</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="wise">Wise</SelectItem>
                    <SelectItem value="remitly">Remitly</SelectItem>
                    <SelectItem value="worldremit">WorldRemit</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Proof Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, proofType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa-application">Visa Application</SelectItem>
                    <SelectItem value="rent">Rent Payment</SelectItem>
                    <SelectItem value="tax">Tax Documentation</SelectItem>
                    <SelectItem value="contract">Contract Payment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="file">Upload Screenshot/Receipt</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  {formData.file && (
                    <p className="text-sm text-green-600">✓ {formData.file.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
        </div>
      </div>
    </div>
  );
};

export default NewProofModal;
