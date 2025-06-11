
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Check, DollarSign, Users, Download, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import PricingModal from "@/components/PricingModal";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofStack</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Payment
            <span className="text-blue-600 block">Proof Generator</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create verified, professional payment proofs for visa applications, rent payments, 
            contracts, and compliance. Trusted by thousands worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Creating Proofs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPricing(true)}
              className="text-lg px-8 py-3"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              <span>50,000+ Proofs Generated</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Professional Payment Proofs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate official-looking payment documentation for any purpose with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Professional Templates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose from multiple professionally designed templates that meet international standards for various use cases.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure & Compliant</h3>
                <p className="text-gray-600 leading-relaxed">
                  All documents are generated with security features and meet compliance requirements for official submissions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Download</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate and download your payment proofs instantly in high-quality PDF format ready for submission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect For</h2>
            <p className="text-lg text-gray-600">Trusted by professionals worldwide for various documentation needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Visa Applications",
              "Rent Payments", 
              "Contract Documentation",
              "Tax Compliance",
              "Freelance Payments",
              "Business Expenses",
              "Insurance Claims",
              "Legal Documentation"
            ].map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">{useCase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Professional Payment Proofs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust ProofStack for their documentation needs
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
      
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </div>
  );
};

export default Index;
