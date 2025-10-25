import { LogOut, User, Plus, Search, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onViewChange('home')}
              className="flex items-center space-x-2 font-bold text-xl text-slate-900"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">TerraVilla</span>
            </button>

            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onViewChange('search')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'search'
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search Plots</span>
              </button>

              {(user?.user_type === 'seller' || user?.user_type === 'both') && (
                <button
                  onClick={() => onViewChange('seller')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'seller'
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Sell Property</span>
                </button>
              )}

              <button
                onClick={() => onViewChange('market')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'market'
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Market Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{user?.full_name}</div>
                <div className="text-xs text-slate-500 capitalize">{user?.user_type}</div>
              </div>
              {user?.kyc_status === 'verified' ? (
                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  KYC Verified
                </div>
              ) : (
                <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                  KYC Pending
                </div>
              )}
            </div>

            <button
              onClick={() => onViewChange('profile')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'profile'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
