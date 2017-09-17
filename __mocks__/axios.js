/* eslint-env jest */
const axios = jest.genMockFromModule('axios');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockResponse = Object.create(null);
function __setMockResponseSuccess (newMockResponse) {
  mockResponse = {
    data: newMockResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {}
  };
}

function __setMockResponseFailure () {
  mockResponse = {
    data: null,
    status: 500,
    statusText: 'Internal Server Error',
    headers: {},
    config: {},
    request: {}
  };
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function get (url) {
  return Promise.resolve(mockResponse);
}

axios.__setMockResponseSuccess = __setMockResponseSuccess;
axios.__setMockResponseFailure = __setMockResponseFailure;
axios.get = get;

module.exports = axios;
