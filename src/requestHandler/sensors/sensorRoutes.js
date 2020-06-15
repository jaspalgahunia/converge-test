/**
 * Sensor Routes
 * Handles all routes for Sensors
 */

/**
 * @module Routes:sensorRoutes * */

import {
  saveSensorSchema, getSensorQuerySchema, addSensorThresholdSchema, getSensorThresholdQuerySchema
} from './requestSchema/sensorSchemas';
import {
  saveSensorData, getSensorData, saveSensorThreshold, checkSensorThreshold
} from '../../sensors/sensors';

/**
 * @summary sensorRoutes
 *
 * @param {fastify} fastify
 */
const sensorRoutes = async (fastify) => {

  /**
  * @example <caption>PUT /data - Save sensor data</caption>
  */
  fastify.put('/data',
    {
      schema: {
        body: saveSensorSchema,
      },
    },
    saveSensorData,
  );

  /**
  * @example <caption>GET /data - Get sensor data</caption>
  */
  fastify.get('/data/:sensorId/:since/:until',
    {
      schema: {
        querystring: getSensorQuerySchema,
      },
    },
    getSensorData,
  );

  /**
  * @example <caption>PATCH /data - Patch sensor thresholds</caption>
  */
  fastify.patch('/data',
    {
      schema: {
        body: addSensorThresholdSchema,
      },
    },
    saveSensorThreshold,
  );

  /**
  * @example <caption>GET /threshold - Has the sensor hit the threshold</caption>
  */
  fastify.get('/threshold/:sensorId',
    {
      schema: {
        querystring: getSensorThresholdQuerySchema,
      },
    },
    checkSensorThreshold,
  );
};

export default sensorRoutes;
