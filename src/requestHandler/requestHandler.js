/**
 * Request  Handler
 * Handles all pre-actions for a request
 */

import requestManager from './requestManager';

const requestHandler = async (fastify) => {
  fastify.register(requestManager);
};

export default requestHandler;
