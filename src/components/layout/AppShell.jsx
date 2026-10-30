import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import DemoModeBanner from './DemoModeBanner';
import ControlBar from './ControlBar';
import BottomNav from './BottomNav';

export default function AppShell({
  activeTab,
  onTabChange,
  district,
  date,
  onDistrictChange,
  onDateChange,
  blendedValue,
  confidence,
  regime,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Mobile Top Header (Fixed at top of screen on mobile screens) */}
      <MobileHeader onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* Desktop Left Sidebar & Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Top Operational Command Banner */}
        <DemoModeBanner />

        {/* Real-time KPI & Interactive Filter Control Toolbar */}
        <ControlBar
          district={district}
          date={date}
          onDistrictChange={onDistrictChange}
          onDateChange={onDateChange}
          blendedValue={blendedValue}
          confidence={confidence}
          regime={regime}
          onTabChange={handleTabChange}
        />

        {/* Scrollable View Surface Area */}
        <main className="flex-1 overflow-y-auto touch-scroll min-h-0 p-3 sm:p-4 lg:p-5 pb-20 lg:pb-6 bg-slate-950">
          <div className="max-w-[1600px] mx-auto min-w-0">
            {children}
          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />
    </div>
  );
}
