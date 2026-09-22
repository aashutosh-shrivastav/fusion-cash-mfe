# P0-01: Manual Developer Guide — Jest Unit Testing Setup

## Overview
This guide provides step-by-step instructions to configure Jest unit testing in an Angular + Nx MFE workspace.

---

## 1. Install Dependencies

Run the following command in the workspace root:

```bash
npm install -D jest jest-preset-angular @types/jest ts-jest
```

---

## 2. Global Jest Config (`jest.config.ts`)

Create `jest.config.ts` in the workspace root:

```typescript
import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});
```

---

## 3. Library / Application Jest Config Setup

For each Angular app or lib (e.g. `apps/shell` or `libs/shared-core`):

1. Add `jest.config.ts` inside the project root (e.g. `apps/shell/jest.config.ts`):

```typescript
export default {
  displayName: 'shell',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/shell',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
```

2. Create `src/test-setup.ts` inside `apps/shell/src/test-setup.ts`:

```typescript
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
```

---

## 4. Run Tests

```bash
# Run tests for all affected projects
npx nx affected -t test

# Run tests for a specific project
npx nx test shell

# Run tests with coverage
npx nx test shell --coverage
```
