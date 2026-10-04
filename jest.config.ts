// jest.config.ts
import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});
