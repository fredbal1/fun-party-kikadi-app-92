
/// <reference types="@testing-library/jest-dom" />

// Fix for TypeScript looking for 'testing-library__jest-dom' instead of '@testing-library/jest-dom'
declare module 'testing-library__jest-dom' {
  // Re-export all types from the correct package
  export * from '@testing-library/jest-dom';
}
