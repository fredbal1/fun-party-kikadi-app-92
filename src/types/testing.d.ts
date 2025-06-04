
/// <reference types="@testing-library/jest-dom" />

// Configuration des types pour les tests avec Vitest
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): T;
      toHaveClass(className: string): T;
      toHaveAttribute(attr: string, value?: string): T;
    }
  }
}

// Export vide pour faire de ce fichier un module
export {};
