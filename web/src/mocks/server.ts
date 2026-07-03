import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { crudHandlers, qualidadeWorkflowHandlers } from './handlers/crud';

export const server = setupServer(...authHandlers, ...crudHandlers, ...qualidadeWorkflowHandlers);
