import React from 'react';
import { KhabarProvider, useKhabar } from './context/KhabarContext';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { LocationModal } from './components/layout/LocationModal';
import { FoodDetailModal } from './components/modals/FoodDetailModal';
import { CartDrawer } from './components/modals/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { ReviewModal } from './components/modals/ReviewModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { Toast } from './components/common/Toast';
import { RoleGateModal } from './components/modals/RoleGateModal';

// Views
import { HomeView } from './components/views/HomeView';
import { RestaurantsView } from './components/views/RestaurantsView';
import { RestaurantDetailView } from './components/views/RestaurantDetailView';
import { OffersView } from './components/views/OffersView';
import { CheckoutView } from './components/views/CheckoutView';
import { OrderTrackingView } from './components/views/OrderTrackingView';
import { ReservationView } from './components/views/ReservationView';
import { OrdersHistoryView } from './components/views/OrdersHistoryView';
import { FavoritesView } from './components/views/FavoritesView';
import { ProfileView } from './components/views/ProfileView';
import { HelpCenterView } from './components/views/HelpCenterView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { RestaurantPartnerView } from './components/views/RestaurantPartnerView';
import { RiderDeliveryView } from './components/views/RiderDeliveryView';

const MainAppContent: React.FC = () => {
  const { currentView, portalMode, roleGateState, setRoleGateState, handleRoleGateSuccess } = useKhabar();

  const isCustomerPortal = portalMode === 'customer' && !['admin', 'partner', 'rider'].includes(currentView);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'restaurants':
        return <RestaurantsView />;
      case 'restaurant-detail':
        return <RestaurantDetailView />;
      case 'offers':
        return <OffersView />;
      case 'checkout':
        return <CheckoutView />;
      case 'tracking':
        return <OrderTrackingView />;
      case 'reservations':
        return <ReservationView />;
      case 'orders':
        return <OrdersHistoryView />;
      case 'favorites':
        return <FavoritesView />;
      case 'profile':
        return <ProfileView />;
      case 'help-center':
        return <HelpCenterView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'partner':
        return <RestaurantPartnerView />;
      case 'rider':
        return <RiderDeliveryView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Alert */}
      <Toast />

      {/* Top Customer Navigation (shown when in customer mode) */}
      {isCustomerPortal && <Header />}

      {/* Dynamic View Body */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Customer Footer */}
      {isCustomerPortal && <Footer />}

      {/* Modals & Slide-out Drawers */}
      <LocationModal />
      <FoodDetailModal />
      <CartDrawer />
      <AuthModal />
      <ReviewModal />
      <NotificationDrawer />

      {/* Role Gate Authentication Modal for Privileged Portals */}
      <RoleGateModal
        isOpen={roleGateState.isOpen}
        targetRole={roleGateState.targetRole}
        onClose={() => setRoleGateState({ isOpen: false, targetRole: 'CUSTOMER' })}
        onSuccess={handleRoleGateSuccess}
      />

      {/* Mobile Bottom Navigation Bar (customer mode only) */}
      {isCustomerPortal && <MobileBottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <KhabarProvider>
      <MainAppContent />
    </KhabarProvider>
  );
};
