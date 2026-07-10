import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../ui/Toast';
import CommandPalette from '../CommandPalette';
import { useKeyboard } from '../../hooks/useKeyboard';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useKeyboard([
    { key: 'k', ctrl: true, shift: false, handler: () => setCommandPaletteOpen((v) => !v) },
    { key: 'p', ctrl: true, shift: true, handler: () => setCommandPaletteOpen((v) => !v) },
    { key: '/', ctrl: false, handler: () => {
      const focused = document.activeElement;
      if (focused?.tagName !== 'INPUT' && focused?.tagName !== 'TEXTAREA') {
        setCommandPaletteOpen(true);
      }
    }},
    { key: 'Escape', ctrl: false, handler: () => setCommandPaletteOpen(false) },
  ]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const path = window.location.pathname;
        if (path.includes('/companies')) navigate('/companies/new');
        else if (path.includes('/properties')) navigate('/properties/new');
        else if (path.includes('/buildings')) navigate('/buildings/new');
        else if (path.includes('/units')) navigate('/units/new');
        else navigate('/companies/new');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
