import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mlog from 'mocha-logger';
import fs from 'fs';
import moment from 'moment';
import { setup, sensorId, delay, getRequest, putRequest, patchRequest } from './utils';

chai.use(chaiAsPromised);
const { expect } = chai;

const testSetup = () => {
  setup();
  mlog.log('Removing the test files');
  try {
    console.log(__dirname);
    fs.unlinkSync(`./sensorData/${sensorId}`)
  } catch (err) {
    console.log('No test files'); sensorId
  }
}

describe('integration tests', () => {
  before(() => testSetup());
  after(() => testSetup());

  describe('sensors', () => {
    describe('add sensors values and thresholds', () => {

      const sensorTimes = [];
      const startTime = moment().subtract(1, 'h').valueOf();
      const endTime = moment().add(1, 'h').valueOf();

      it('should find no sensors', async () => {
        const response = await getRequest(`/data/${sensorId}/${startTime}/${endTime}`);
        expect(response.data).to.deep.equal([]);
      });

      it('should throw an error when the request is wrong', async () => {
        try {
          await getRequest(`/data/${sensorId}/1`);
        } catch (err) {
          expect(err.response.status).to.equal(404);
          expect(err.response.statusText).to.equal('Not Found');
          expect(err.response.data.message).to.contain('Route GET:/data/test-sensor-1/1 not found');
        }
      });

      it('add sensor data', async () => {
        for (let i = 1; i < 4; i += 1) {
          const time = moment().valueOf();
          sensorTimes.push(time);

          const response = await putRequest('/data', {
            sensorId: sensorId,
            time,
            value: i
          });
          expect(response.data).to.deep.equal({ sucess: true });
          delay(1000);
        }
      });

      it('get sensor data', async () => {
        const response = await getRequest(`/data/${sensorId}/${startTime}/${endTime}`);

        expect(response.data).to.deep.equal({
          lowThreshold: null,
          highThreshold: null,
          values: [
            { time: sensorTimes[0], value: 1 },
            { time: sensorTimes[1], value: 2 },
            { time: sensorTimes[2], value: 3 }
          ]
        });
      });

      it('should throw an error when there is a duplicate reading', async () => {
        try {
          await putRequest('/data', {
            sensorId: sensorId,
            time: sensorTimes[0],
            value: 99
          });
        } catch (err) {
          expect(err.response.status).to.equal(409);
          expect(err.response.statusText).to.equal('Conflict');
          expect(err.response.data.message).to.contain("Error duplicate reading for Sensor Id 'test-sensor-1'");
        }
      });

      it('add sensor thresholds', async () => {
        const response = await patchRequest('/data', {
          sensorId: sensorId,
          lowThreshold: 0.5,
          highThreshold: 5
        });
        expect(response.data).to.deep.equal({ sucess: true });
      });

      it('should throw an error when adding a threshold to an unknown sensor', async () => {
        try {
          await patchRequest('/data', {
            sensorId: 'test',
            lowThreshold: 0.5,
            highThreshold: 5
          });
        } catch (err) {
          expect(err.response.status).to.equal(404);
          expect(err.response.statusText).to.equal('Not Found');
          expect(err.response.data.message).to.contain("Error cannot find Sensor 'test' to set threshold");
        }
      });

      it('get sensor data with thresholds', async () => {
        const response = await getRequest(`/data/${sensorId}/${startTime}/${endTime}`);

        expect(response.data).to.deep.equal({
          lowThreshold: 0.5,
          highThreshold: 5,
          values: [
            { time: sensorTimes[0], value: 1 },
            { time: sensorTimes[1], value: 2 },
            { time: sensorTimes[2], value: 3 }
          ]
        });
      });

      it('should return false when checking sensor threshold', async () => {
        const response = await getRequest(`/threshold/${sensorId}`);
        expect(response.data).to.deep.equal({ threshold: false });
      });

      it('should return true when checking sensor threshold', async () => {
        const time = moment().valueOf();
        sensorTimes.push(time);

        let response = await putRequest('/data', {
          sensorId: sensorId,
          time,
          value: 6
        });
        expect(response.data).to.deep.equal({ sucess: true });

        response = await getRequest(`/threshold/${sensorId}`);
        expect(response.data).to.deep.equal({ threshold: true });
      });

      it('should throw an error when adding a threshold to an unknown sensor', async () => {
        try {
          await getRequest('/threshold/test');
        } catch (err) {
          expect(err.response.status).to.equal(404);
          expect(err.response.statusText).to.equal('Not Found');
          expect(err.response.data.message).to.contain("Error cannot find Sensor 'test' to get threshold");
        }
      });
    });
  });
});
