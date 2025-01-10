import React from 'react';
import { Settings, HelpCircle, User, Menu, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
      >
        <div className="w-16 h-full flex flex-col items-center py-8 space-y-8">
          <div className="mt-12">
            <button className="p-3 rounded-full hover:bg-violet-100 transition-colors duration-200">
              <User size={24} className="text-gray-700" />
            </button>
          </div>
          <button className="p-3 rounded-full hover:bg-violet-100 transition-colors duration-200">
            <HelpCircle size={24} className="text-gray-700" />
          </button>
          <button className="p-3 rounded-full hover:bg-violet-100 transition-colors duration-200">
            <Settings size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;