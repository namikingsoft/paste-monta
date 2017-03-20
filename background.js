let storage;

const defaultStorage = {
  montas: '',
  styles: '',
};

function load(callback = () => {}) {
  chrome.storage.sync.get(defaultStorage, param => {
    storage = Object.assign({}, param);
    callback(param);
  });
};

function save(param, callback = () => {}) {
  storage = Object.assign({}, param);
  chrome.storage.sync.set(param, () => {
    callback(param);
  });
};

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request) {
    case 'getStorage': {
      sendResponse(Object.assign({}, storage));
    }
  }
});

load(param => storage = param);
