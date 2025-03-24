import { ServiceAPIBase } from './service-api-base.ts';

const serviceAPIBase = new ServiceAPIBase();
await serviceAPIBase.startTest('Scans twitter mentions and respond with a meme.', 'typescript', 'twitter-meme', true);

