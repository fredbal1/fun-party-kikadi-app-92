
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { User, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'KIKADI',
  showBackButton = false,
  onBack
}) => {
  const { user, logout } = useAuthStore();
  const { openModal } = useUIStore();

  const handleProfileClick = () => {
    openModal('profile', user);
  };

  const handleSettingsClick = () => {
    openModal('settings');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              ←
            </Button>
          )}
          
          <motion.h1
            className="text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {title}
          </motion.h1>
        </div>

        {/* Right section */}
        {user && (
          <div className="flex items-center space-x-3">
            {/* User info */}
            <div className="hidden md:block text-white text-sm">
              <div className="font-medium">{user.pseudo}</div>
              <div className="text-white/70">
                Niveau {user.niveau} • {user.pieces} 🪙
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="text-white hover:bg-white/10"
              >
                <User className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettingsClick}
                className="text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};
