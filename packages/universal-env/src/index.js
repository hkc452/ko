export const isWeb = typeof navigator === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
export const isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
export const isWeex = typeof callNative === 'function' || typeof WXEnvironment === 'object';
export const isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';