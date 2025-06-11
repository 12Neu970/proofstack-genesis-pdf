
import { X, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="border rounded-xl p-6 relative">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-1">$0</div>
              <p className="text-gray-600 mb-6">Perfect for trying out</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Watermarked PDFs</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Manual download</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Community support</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Current Plan
              </Button>
            </div>

            {/* One-time Plan */}
            <div className="border-2 border-blue-500 rounded-xl p-6 relative bg-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">One-time Export</h3>
              <div className="text-3xl font-bold mb-1">$3</div>
              <p className="text-gray-600 mb-6">Single clean export</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Clean PDF (no watermark)</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Professional templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Instant download</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Pay with Flutterwave
              </Button>
              <Button variant="outline" className="w-full mt-2">
                Pay with Binance
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border rounded-xl p-6 relative">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-1">$9<span className="text-lg text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-6">For power users</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Unlimited clean exports</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Cloud storage</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Advanced templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Subscribe Monthly
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>All plans include secure payment processing and 24/7 document generation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
