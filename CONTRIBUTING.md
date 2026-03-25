# Contributing to CardScannerApp

Thank you for considering contributing to CardScannerApp! Please read this guide to understand our development process and how you can contribute effectively.

## How to Contribute

### Reporting Bugs

- Use the GitHub Issues tracker
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots if applicable
- Label as "bug"

### Suggesting Features

- Use the GitHub Issues tracker
- Label as "enhancement"
- Describe the feature and its benefits
- Consider if it aligns with the project roadmap

### Submitting Changes

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure nothing is broken
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js v14 or later
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)
- Git

### Installation

```bash
git clone https://github.com/your-username/CardScannerApp.git
cd CardScannerApp
npm install
cd ios && pod install && cd ..
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (iOS)
npm run detox:test -- --configuration ios.sim

# E2E tests (Android)
npm run detox:test -- --configuration android.emu

# Linting
npm run lint

# TypeScript
npm run tsc --noEmit
```

## Coding Standards

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Prefer interfaces over types for object shapes
- Use functional components with hooks
- Export interfaces/types when they're public

### React Native

- Use StyleSheet.create() for styles
- Always provide accessibilityLabel for interactive elements
- Use Platform.OS for platform-specific code when needed
- Use FlatList for long lists of data

### Testing

- Write unit tests for utility functions
- Write E2E tests for user flows
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies appropriately

### Git

- Write clear, descriptive commit messages
- Reference issue numbers when applicable (e.g., "Fixes #123")
- Keep commits focused on single changes
- Use conventional commit format when possible

## Code Review Process

1. All PRs require at least one approval
2. CI must pass (tests, lint, build)
3. No breaking changes without discussion
4. Documentation updated when needed
5. Squash and merge preferred for feature branches

## Community

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Getting Help

If you need help:

- Check existing issues for similar problems
- Ask in the GitHub Discussions
- Refer to the documentation in /docs
- As a last resort, open a new issue

Thank you for contributing to CardScannerApp!
