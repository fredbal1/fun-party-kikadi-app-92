
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VisualEffect, AnimationVariant } from '@/types';

interface UIState {
  // Animation state
  currentAnimation: AnimationVariant;
  isAnimating: boolean;
  
  // Visual effects
  activeEffects: VisualEffect[];
  showConfetti: boolean;
  
  // Loading states
  isPageLoading: boolean;
  loadingMessage: string;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;
  
  // Modal states
  activeModal: string | null;
  modalData: any;
  
  // Actions
  setAnimation: (variant: AnimationVariant) => void;
  triggerEffect: (effect: VisualEffect, duration?: number) => void;
  showConfettiEffect: (duration?: number) => void;
  setPageLoading: (loading: boolean, message?: string) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  clearAllEffects: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentAnimation: 'blue',
      isAnimating: false,
      activeEffects: [],
      showConfetti: false,
      isPageLoading: false,
      loadingMessage: '',
      notifications: [],
      activeModal: null,
      modalData: null,
      
      // Actions
      setAnimation: (variant) => {
        set({ 
          currentAnimation: variant,
          isAnimating: true 
        });
        
        // Auto-reset animation state
        setTimeout(() => {
          set({ isAnimating: false });
        }, 1000);
      },
      
      triggerEffect: (effect, duration = 3000) => {
        set((state) => ({
          activeEffects: [...state.activeEffects, effect]
        }));
        
        // Auto-remove effect after duration
        setTimeout(() => {
          set((state) => ({
            activeEffects: state.activeEffects.filter(e => e !== effect)
          }));
        }, duration);
      },
      
      showConfettiEffect: (duration = 3000) => {
        set({ showConfetti: true });
        
        setTimeout(() => {
          set({ showConfetti: false });
        }, duration);
      },
      
      setPageLoading: (loading, message = '') => {
        set({ 
          isPageLoading: loading,
          loadingMessage: message 
        });
      },
      
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto-remove after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      openModal: (modalId, data = null) => {
        set({ 
          activeModal: modalId,
          modalData: data 
        });
      },
      
      closeModal: () => {
        set({ 
          activeModal: null,
          modalData: null 
        });
      },
      
      clearAllEffects: () => {
        set({
          activeEffects: [],
          showConfetti: false,
          isAnimating: false
        });
      }
    }),
    { name: 'ui-store' }
  )
);
