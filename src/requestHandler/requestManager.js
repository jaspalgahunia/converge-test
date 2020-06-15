/**
 * Request  Manager
 * Handles registering of different routes
 */

import sensorRoutes from './sensors/sensorRoutes';

const requestManager = async (fastify) => {
  fastify.register(sensorRoutes);
};

export default requestManager;
