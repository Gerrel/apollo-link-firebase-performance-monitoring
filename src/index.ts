import { ApolloLink } from 'apollo-link';
import formatMessage from './formatMessage';
import logging from './logging';
import * as firebase from 'firebase/app';

const createFPMLink = (perf: () => (firebase.performance.Performance | undefined), debug: boolean = false) => {
  return new ApolloLink((operation, forward) => {
    if (forward === undefined) {
      return null;
    }
    const def: any = operation.query.definitions.length > 0 ? operation.query.definitions[0] : undefined;
    let operationType: string;
    if (def !== undefined) {
      const operationTypeString: string = typeof def.operation === 'string' ? def.operation : undefined;
      operationType = operationTypeString.length > 0 ? operationTypeString : 'req';
    } else {
      operationType = 'req';
    }
    const perfObj = perf();
    const startTime = new Date().getTime();

    let trace: firebase.performance.Trace | undefined;
    if (perfObj !== undefined && operationType !== 'subscription') {
      let traceName = `${operation.operationName}`.trim();
      if (traceName.length > 32) {
        traceName = traceName.substr(0, 32);
      } else if (traceName.length === 0) {
        traceName = 'unknown';
      }
      if (traceName.charAt(0) === '_') {
        traceName = traceName.substr(1, traceName.length - 1).trim();
        if (traceName.length === 0) {
          traceName = 'unknown';
        }
      }
      if (traceName.charAt(traceName.length - 1) === '_') {
        traceName = traceName.substr(0, traceName.length - 1).trim();
        if (traceName.length === 0 || traceName === '_') {
          traceName = 'unknown';
        }
      }
      try {
        trace = perfObj.trace(traceName);
        trace.start();
      } catch (e) {
        if (debug) {
          // tslint:disable-next-line: no-console
          console.error('Unable to start FPM trace', e);
        }
      }
    }

    return forward(operation).map(result => {
      if (trace !== undefined) {
        try {
          trace.stop();
          trace = undefined;
        } catch (e) {
          if (debug) {
            // tslint:disable-next-line: no-console
            console.error('Unable to stop FPM trace', e);
          }
        }
      }
      if (debug) {
        const ellapsed = new Date().getTime() - startTime;

        const group = formatMessage(operationType, operation, ellapsed);

        logging.groupCollapsed(...group);

        logging.log('REQ', operation);
        logging.log('RES', result);

        logging.groupEnd(...group);
      }
      return result;
    });
  });
};

export default createFPMLink;
