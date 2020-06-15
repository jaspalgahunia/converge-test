/**
 * Sensor Operations
 */

/**
 * @module sensorOperations * */

import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage('./sensorData');

/**
 * Check the Sensor thresholds
 *
 * @param {fastifyRequest} request - Fastify request object
 * @param {string} sensorId
 * @param {object} sensorData
 */
const checkSensorThresholds = (request, sensorId, sensorData) => {
  if (!sensorData.lowThreshold && !sensorData.highThreshold) return false;

  request.log.debug(
    `Checking thresholds '${sensorData.lowThreshold} - ${sensorData.highThreshold}' for sensor '${sensorId}'`
  );

  const sensorFilter = sensorData.values.filter((data) =>
    data.value < sensorData.lowThreshold || data.value > sensorData.highThreshold);

  if (sensorFilter.length) {
    // @TODO: Implement email/sns alert
    request.log.error(`Sensor '${sensorId}' has hit the threshold`);
    return true;
  }

  return false;
};

/**
 * Entry point for API
 *
 * @param {fastifyRequest} request - Fastify request object
 * @param {fastifyResponse} reply - Fastify response object
 * @returns {object} - {success: true}
 * @throws {Error}
 */
const saveSensorData = async (request, reply) => {
  const { body } = request;

  request.log.debug(`Checking current sensor data for '${body.sensorId}'`);

  let sensorData = { lowThreshold: null, highThreshold: null, values: [] };

  const sensorDataString = localStorage.getItem(body.sensorId);

  if (sensorDataString) {
    sensorData = JSON.parse(sensorDataString);

    const sensorDataResults = sensorData.values.find((data) => data.time === body.time);

    if (sensorDataResults && sensorDataResults.time) {
      const error = new Error(`Error duplicate reading for Sensor Id '${body.sensorId}' at the time '${body.time}'`);
      error.statusCode = 409;
      throw error;
    }
  }

  request.log.debug(`Saving data for Sensor '${body.sensorId}'`);

  sensorData.values.push({
    time: body.time,
    value: body.value
  });

  localStorage.setItem(body.sensorId, JSON.stringify(sensorData));

  checkSensorThresholds(request, body.sensorId, sensorData);

  return reply.code(209).send({ sucess: true });
};

/**
 * Entry point for API
 *
 * @param {fastifyRequest} request - Fastify request object
 * @param {fastifyResponse} reply - Fastify response object
 * @returns {object} - {success: true}
 */
const getSensorData = async (request, reply) => {
  const { sensorId, since, until } = request.params;

  request.log.debug(`Returning sensor data for '${sensorId}'`);

  const sensorDataString = localStorage.getItem(sensorId);

  if (!sensorDataString) {
    return reply.code(209).send([]);
  }

  const sensorData = JSON.parse(sensorDataString);
  const sensorFilter = sensorData.values.filter((data) => data.time >= since && data.time <= until);

  return reply.code(209).send({ ...sensorData, values: sensorFilter });
}

/**
 * Entry point for API
 *
 * @param {fastifyRequest} request - Fastify request object
 * @param {fastifyResponse} reply - Fastify response object
 * @returns {object} - {success: true}
 */
const saveSensorThreshold = async (request, reply) => {
  const { body } = request;

  request.log.debug(`Setting thresholds '${body.lowThreshold} - ${body.highThreshold}' for sensor '${body.sensorId}'`);

  const sensorDataString = localStorage.getItem(body.sensorId);

  if (!sensorDataString) {
    const error = new Error(`Error cannot find Sensor '${body.sensorId}' to set threshold`);
    error.statusCode = 404;
    throw error;
  }

  const sensorData = JSON.parse(sensorDataString);
  sensorData.lowThreshold = body.lowThreshold;
  sensorData.highThreshold = body.highThreshold;
  localStorage.setItem(body.sensorId, JSON.stringify(sensorData));

  checkSensorThresholds(request, body.sensorId, sensorData);

  return reply.code(200).send({ sucess: true });
}

/**
 * Entry point for API
 *
 * @param {fastifyRequest} request - Fastify request object
 * @param {fastifyResponse} reply - Fastify response object
 * @returns {object} - {success: true}
 */
const checkSensorThreshold = async (request, reply) => {
  const { sensorId } = request.params;

  const sensorDataString = localStorage.getItem(sensorId);

  if (!sensorDataString) {
    const error = new Error(`Error cannot find Sensor '${sensorId}' to get threshold`);
    error.statusCode = 404;
    throw error;
  }

  const sensorData = JSON.parse(sensorDataString);
  const threshold = checkSensorThresholds(request, sensorId, sensorData);
  return reply.code(200).send({ threshold });
}

export { saveSensorData, getSensorData, saveSensorThreshold, checkSensorThreshold };