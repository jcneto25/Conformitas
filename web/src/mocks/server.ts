import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { crudHandlers, qualidadeWorkflowHandlers, governancaWorkflowHandlers } from './handlers/crud';

export const server = setupServer(...authHandlers, ...crudHandlers, ...qualidadeWorkflowHandlers, ...governancaWorkflowHandlers);
