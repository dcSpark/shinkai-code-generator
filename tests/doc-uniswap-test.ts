import { ServiceAPIBase } from './service-api-base.ts';

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest('fetch uniswap token prices, using uniswap-sdk library', 'typescript', 'uniswap-doc', false);
