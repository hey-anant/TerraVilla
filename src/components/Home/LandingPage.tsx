import { Shield, TrendingDown, FileCheck, Zap, MapPin, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onViewChange: (view: string) => void;
}

export default function LandingPage({ onViewChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Save up to 6% in broker fees
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Buy & Sell Land<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Without Brokers
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Direct peer-to-peer land transactions with AI-verified documents, government database checks, and blockchain security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onViewChange('search')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Properties
            </button>
            <button
              onClick={() => onViewChange('seller')}
              className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-medium text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all"
            >
              List Your Property
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl inline-block mb-4">
              <TrendingDown className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Zero Broker Fees</h3>
            <p className="text-slate-600 mb-4">
              Save 1-6% of your transaction value. On a ₹1 crore property, that's up to ₹6 lakhs saved.
            </p>
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Traditional: ₹1 Cr + ₹6L broker fee = ₹1.06 Cr
              </p>
              <p className="text-sm text-emerald-800 font-medium mt-2">
                TerraVilla: ₹1 Cr only = Save ₹6 Lakhs
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-xl inline-block mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">100% Secure</h3>
            <p className="text-slate-600 mb-4">
              AI document verification, government database cross-checks, and blockchain-recorded ownership.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-700">AI fraud detection</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-700">Government API verification</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-700">Blockchain certificate</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 rounded-xl inline-block mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Verified Listings</h3>
            <p className="text-slate-600 mb-4">
              Every property undergoes rigorous verification. Only legitimate, dispute-free land gets listed.
            </p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">
                Reduces fraud risk by 60% compared to traditional methods
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Seller Uploads</h4>
              <p className="text-slate-300 text-sm">Property details and documents submitted</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">AI + Gov Verify</h4>
              <p className="text-slate-300 text-sm">Automated checks against fraud databases</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Buyer Searches</h4>
              <p className="text-slate-300 text-sm">Browse verified listings by location</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Direct Deal</h4>
              <p className="text-slate-300 text-sm">Connect directly, save money</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
            <Zap className="w-10 h-10 text-emerald-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-2">Lightning Fast</h4>
            <p className="text-slate-600 text-sm">List your property in under 10 minutes with our streamlined process</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
            <MapPin className="w-10 h-10 text-blue-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-2">Nationwide Coverage</h4>
            <p className="text-slate-600 text-sm">Search verified plots anywhere in India with location-based filters</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
            <BarChart3 className="w-10 h-10 text-purple-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-2">Market Insights</h4>
            <p className="text-slate-600 text-sm">Real-time price comparisons to ensure fair market value</p>
          </div>
        </div>

        <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Join Thousands of Smart Property Buyers & Sellers
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Start your journey towards transparent, broker-free land transactions today.
          </p>
          <button
            onClick={() => onViewChange('search')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-medium text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
