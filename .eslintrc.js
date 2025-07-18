module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Treat all ESLint warnings as warnings, not errors
    '@typescript-eslint/no-unused-vars': 'warn',
    'jsx-a11y/no-redundant-roles': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    // Add any other rules you want to treat as warnings
  },
  // This ensures ESLint warnings don't cause build failures
  ignorePatterns: ['build/', 'node_modules/']
}; 