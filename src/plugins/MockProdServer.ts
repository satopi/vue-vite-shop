import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import mockModule from '../../mock';

export function setupProdMockServer() {
  createProdMockServer([...mockModule]);
}
