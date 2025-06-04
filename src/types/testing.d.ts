
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

// Suppression de la référence incorrecte à testing-library__jest-dom
declare module '@testing-library/jest-dom/matchers' {
  export * from '@testing-library/jest-dom';
}

// Export vide pour faire de ce fichier un module
export {};
