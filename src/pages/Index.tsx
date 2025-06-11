
import { useState } from "react";
import { Check, Shield, FileText, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingModal from "@/components/PricingModal";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [showPricing, setShowPricing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofStack</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => handleAuthClick('login')}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>
              <Button 
                onClick={() => handleAuthClick('register')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Professional
            <span className="text-blue-600 block">Payment Proofs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate verified payment documentation for visa applications, rent, taxes, and contracts. 
            Trusted by freelancers, students, and remote workers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleAuthClick('register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Create Your First Proof
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowPricing(true)}
              className="px-8 py-3"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for payment verification
            </h2>
            <p className="text-lg text-gray-600">
              Professional documentation that's accepted worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional PDFs</h3>
              <p className="text-gray-600">
                Generate clean, professional payment proof documents with auto-generated reference IDs
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Verified</h3>
              <p className="text-gray-600">
                Timestamp verification and secure document generation for legal compliance
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Support</h3>
              <p className="text-gray-600">
                Support for major payment platforms including PayPal, Flutterwave, and Binance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free, upgrade when you need more
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0</div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Watermarked PDFs
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Basic templates
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white transform scale-105">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 mr-1" />
                <h3 className="text-lg font-semibold">One-time</h3>
              </div>
              <div className="text-3xl font-bold mb-4">$3</div>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Clean PDF export
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Single download
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$9<span className="text-sm">/mo</span></div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited exports
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Cloud storage
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
              </ul>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowPricing(true)}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Full Pricing
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to create your first payment proof?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust ProofStack for their documentation needs
          </p>
          <Button 
            size="lg"
            onClick={() => handleAuthClick('register')}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6" />
              <span className="text-xl font-bold">ProofStack</span>
            </div>
            <p className="text-gray-400">
              Professional payment proof generation for global users
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
