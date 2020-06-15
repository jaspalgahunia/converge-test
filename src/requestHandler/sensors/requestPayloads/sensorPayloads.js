/**
 * Sensor Payloads
 */

const saveSensorPayload = Object.freeze({
  sensorId: { type: 'string', minLength: 1 },
  time: { type: 'integer' },
  value: { type: 'number' }
});

const getSensorQuery = Object.freeze({
  sensorId: { type: 'string', minLength: 1 },
  since: { type: 'integer' },
  until: { type: 'integer' },
});

const addSensorThresholdPayload = Object.freeze({
  sensorId: { type: 'string', minLength: 1 },
  lowThreshold: { type: 'number' },
  highThreshold: { type: 'number' }
});

const checkSensorThresholdPayload = Object.freeze({
  sensorId: { type: 'string', minLength: 1 },
});

export { saveSensorPayload, getSensorQuery, addSensorThresholdPayload, checkSensorThresholdPayload };
