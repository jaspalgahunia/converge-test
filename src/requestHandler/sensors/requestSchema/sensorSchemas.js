/**
 * Sensor Schemas
 */

import {
  getSensorQuery, saveSensorPayload, addSensorThresholdPayload, checkSensorThresholdPayload
} from '../requestPayloads/sensorPayloads';

const getSensorQuerySchema = {
  $id: 'getSensorQuerySchema',
  schema: {
    querystring: {
      type: 'object',
      required: Object.keys(getSensorQuery),
      properties: getSensorQuery,
    },
  },
};

const saveSensorSchema = {
  $id: 'saveSensorSchema',
  type: 'object',
  required: Object.keys(saveSensorPayload),
  properties: saveSensorPayload,
};

const addSensorThresholdSchema = {
  $id: 'sensorThresholdSchema',
  type: 'object',
  required: Object.keys(addSensorThresholdPayload),
  properties: addSensorThresholdPayload,
};

const getSensorThresholdQuerySchema = {
  $id: 'getSensorThresholdQuerySchema',
  schema: {
    querystring: {
      type: 'object',
      required: Object.keys(checkSensorThresholdPayload),
      properties: checkSensorThresholdPayload,
    },
  },
};

export {
  saveSensorSchema, getSensorQuerySchema, addSensorThresholdSchema, getSensorThresholdQuerySchema
};
