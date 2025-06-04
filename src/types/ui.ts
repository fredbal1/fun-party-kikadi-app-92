
// Types pour l'interface utilisateur
export interface AnimationVariant {
  type: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  icon?: string;
}

export interface BackgroundTheme {
  variant: 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'rainbow';
  intensity: 'low' | 'medium' | 'high';
  animated: boolean;
}
