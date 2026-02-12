import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/Auth/LoginForm';
import LandingPage from './components/Home/LandingPage';
import SearchPage from './components/Search/SearchPage';
import SellerDashboard from './components/Seller/SellerDashboard';
import MarketData from './components/Market/MarketData';
import ProfilePage from './components/Profile/ProfilePage';
import AdSidebar from './components/Ads/AdSidebar';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'search':
        return <SearchPage />;
      case 'seller':
        return <SellerDashboard />;
      case 'market':
        return <MarketData />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <LandingPage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
        <div className="w-[10%] min-w-[180px] max-w-[220px] hidden lg:block overflow-y-auto">
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
