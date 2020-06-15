/**
 * Index - Application Entrypoint
 */

import fastify from 'fastify';
import requestHandler from './requestHandler/requestHandler';

console.log('App starting with HTTP settings');
const app = fastify({ logger: { level: 'debug' } });

console.log('App registering request handler');
app.register(requestHandler);

const start = async () => {
  try {
    console.log('App is starting');
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();

export default app;