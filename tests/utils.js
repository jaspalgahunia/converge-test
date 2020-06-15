import axios from 'axios';
import mlog from 'mocha-logger';
import app from '../src/index';

// Debug
const log = {
  error: (msg) => console.log(msg),
  warn: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  debug: (msg) => console.log(msg),
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const sensorId = 'test-sensor-1';

const setup = async (delayMs = 3000) => {
  mlog.log('Loading fastify app');
  await app.ready();
  mlog.log(`delay - ${delayMs}`);
  return delay(delayMs);
};

const makeGetRequest = async (url) => axios.get(url);
const makePutRequest = async (url, data) => axios.put(url, data);
const makePatchRequest = async (url, data) => axios.patch(url, data);

const localBaseUrl = 'http://localhost:3000';
const getRequest = async (url) => makeGetRequest(`${localBaseUrl}${url}`);
const putRequest = async (url, data) => makePutRequest(`${localBaseUrl}${url}`, data);
const patchRequest = async (url, data) => makePatchRequest(`${localBaseUrl}${url}`, data);

export {
  log,
  delay,
  setup,
  sensorId,
  getRequest,
  putRequest,
  patchRequest
};
