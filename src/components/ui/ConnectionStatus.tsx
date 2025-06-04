
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export const ConnectionStatus = () => {
  const { isOnline, updateAvailable, activateUpdate } = useServiceWorker();

  return (
    <AnimatePresence>
      {(!isOnline || updateAvailable) && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          {!isOnline && (
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 mb-2">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Mode hors ligne</span>
            </div>
          )}
          
          {updateAvailable && (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Mise à jour disponible</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-blue-500 hover:bg-gray-100 text-xs"
                onClick={activateUpdate}
              >
                Mettre à jour
              </Button>
            </div>
          )}
          
          {isOnline && !updateAvailable && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg flex items-center space-x-1">
              <Wifi className="h-3 w-3" />
              <span className="text-xs">En ligne</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
