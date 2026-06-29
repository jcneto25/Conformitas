import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { crudHandlers } from './handlers/crud';

export const server = setupServer(...authHandlers, ...crudHandlers);
