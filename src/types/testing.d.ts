
/// <reference types="@testing-library/jest-dom" />

// Configuration des types pour les tests
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

// Export vide pour faire de ce fichier un module
export {};
