import { ServiceAPIBase } from './service-api-base.ts';

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest('sum a + b. Use no libraries.', 'python', 'sum-a-b-python', true);
