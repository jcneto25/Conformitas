import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { crudHandlers } from './handlers/crud';

export const worker = setupWorker(...authHandlers, ...crudHandlers);
