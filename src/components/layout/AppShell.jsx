import React from 'react';
import Sidebar from './Sidebar';
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
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Desktop Left Sidebar & Mobile Drawer */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-14 lg:pb-0">
        
        {/* Top Operational Command Banner (ls-monitor style) */}
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
          onTabChange={onTabChange}
        />

        {/* View Surface Area */}
        <main className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 lg:p-5 bg-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
