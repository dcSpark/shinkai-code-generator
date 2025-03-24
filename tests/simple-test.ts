import { ServiceAPIBase } from './service-api-base.ts';

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest('sum a + b using no libraries.', 'typescript', 'sum-a-b', false);
