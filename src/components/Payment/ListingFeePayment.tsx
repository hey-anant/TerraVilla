import { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface ListingFeePaymentProps {
  plotId: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export default function ListingFeePayment({ plotId, onPaymentComplete, onCancel }: ListingFeePaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const listingFee = 500;

  const handlePayment = async () => {
    setPaymentStatus('processing');

    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        {paymentStatus === 'idle' && (
          <>
            <div className="text-center mb-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Listing Fee Payment</h2>
              <p className="text-slate-600">Complete payment to publish your listing</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Listing Fee</span>
                <span className="text-2xl font-bold text-slate-900">₹{listingFee}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-600">
                    <p className="font-medium text-slate-900 mb-1">What you get:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Property listed on TerraVilla marketplace</li>
                      <li>Verified badge for your listing</li>
                      <li>Access to interested buyers</li>
                      <li>30-day premium visibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Payment Notice</p>
                  <p className="text-blue-700">
                    Your listing will only be published after successful payment verification. This is a one-time fee per property listing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                Pay ₹{listingFee}
              </button>
            </div>
          </>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Processing Payment</h3>
            <p className="text-slate-600">Please wait while we process your payment...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">Payment Successful!</h3>
            <p className="text-slate-600 mb-4">Your listing is now live on TerraVilla</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-800">
                Your property will be visible to potential buyers immediately.
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-8">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">Payment Failed</h3>
            <p className="text-slate-600 mb-6">There was an error processing your payment. Please try again.</p>
            <button
              onClick={() => setPaymentStatus('idle')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
