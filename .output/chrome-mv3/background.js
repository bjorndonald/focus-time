var _background = function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  function defineBackground(arg) {
    if (typeof arg === "function") return { main: arg };
    return arg;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      {
        factory(module);
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function(module2) {
      var _a, _b;
      if (!((_b = (_a = globalThis.chrome) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id)) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = (extensionAPIs) => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = void 0) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          const isThenable = (value) => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = /* @__PURE__ */ Object.create(null);
            let handlers = {
              has(proxyTarget2, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget2, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return void 0;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value2) {
                      target[prop] = value2;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget2, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget2, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget2, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          const wrapEvent = (wrapperMap) => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(
                req,
                {},
                {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                }
              );
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise((resolve) => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result2;
              try {
                result2 = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result2 = Promise.reject(err);
              }
              const isResultThenable = result2 !== true && isThenable(result2);
              if (result2 !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = (promise) => {
                promise.then((msg) => {
                  sendResponse(msg);
                }, (error) => {
                  let message2;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message2 = error.message;
                  } else {
                    message2 = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message: message2
                  });
                }).catch((err) => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result2);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module2.exports = wrapAPIs(chrome);
      } else {
        module2.exports = globalThis.browser;
      }
    });
  })(browserPolyfill);
  var browserPolyfillExports = browserPolyfill.exports;
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  var browser$1 = originalBrowser;
  const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  let idbProxyableTypes;
  let cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  const transactionDoneMap = /* @__PURE__ */ new WeakMap();
  const transformCache = /* @__PURE__ */ new WeakMap();
  const reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  let idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(this.request);
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  const unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  const writeMethods = ["put", "add", "delete", "clear"];
  const cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  const advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
  const methodMap = {};
  const advanceResults = /* @__PURE__ */ new WeakMap();
  const ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
  const cursorIteratorTraps = {
    get(target, prop) {
      if (!advanceMethodProps.includes(prop))
        return target[prop];
      let cachedFunc = methodMap[prop];
      if (!cachedFunc) {
        cachedFunc = methodMap[prop] = function(...args) {
          advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
        };
      }
      return cachedFunc;
    }
  };
  async function* iterate(...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  }
  function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
      if (isIteratorProp(target, prop))
        return iterate;
      return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
      return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    }
  }));
  function openExtensionDatabase() {
    return openDB("time-database", 1, {
      upgrade(database) {
        database.createObjectStore("timedata", { keyPath: "hostname" });
        database.createObjectStore("sessiondata", { keyPath: "day" });
        database.createObjectStore("timelimits", { keyPath: "hostname" });
        database.createObjectStore("watches", { keyPath: "hostname" });
      }
    });
  }
  _background;
  const list = [
    // Native ES errors https://262.ecma-international.org/12.0/#sec-well-known-intrinsic-objects
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    // Built-in errors
    globalThis.DOMException,
    // Node-specific errors
    // https://nodejs.org/api/errors.html
    globalThis.AssertionError,
    globalThis.SystemError
  ].filter(Boolean).map(
    (constructor) => [constructor.name, constructor]
  );
  const errorConstructors = new Map(list);
  class NonError extends Error {
    constructor(message) {
      super(NonError._prepareSuperMessage(message));
      __publicField(this, "name", "NonError");
    }
    static _prepareSuperMessage(message) {
      try {
        return JSON.stringify(message);
      } catch {
        return String(message);
      }
    }
  }
  const commonProperties = [
    {
      property: "name",
      enumerable: false
    },
    {
      property: "message",
      enumerable: false
    },
    {
      property: "stack",
      enumerable: false
    },
    {
      property: "code",
      enumerable: true
    },
    {
      property: "cause",
      enumerable: false
    }
  ];
  const toJsonWasCalled = /* @__PURE__ */ new WeakSet();
  const toJSON = (from) => {
    toJsonWasCalled.add(from);
    const json = from.toJSON();
    toJsonWasCalled.delete(from);
    return json;
  };
  const getErrorConstructor = (name) => errorConstructors.get(name) ?? Error;
  const destroyCircular = ({
    from,
    seen,
    to,
    forceEnumerable,
    maxDepth,
    depth,
    useToJSON,
    serialize
  }) => {
    if (!to) {
      if (Array.isArray(from)) {
        to = [];
      } else if (!serialize && isErrorLike(from)) {
        const Error2 = getErrorConstructor(from.name);
        to = new Error2();
      } else {
        to = {};
      }
    }
    seen.push(from);
    if (depth >= maxDepth) {
      return to;
    }
    if (useToJSON && typeof from.toJSON === "function" && !toJsonWasCalled.has(from)) {
      return toJSON(from);
    }
    const continueDestroyCircular = (value) => destroyCircular({
      from: value,
      seen: [...seen],
      forceEnumerable,
      maxDepth,
      depth,
      useToJSON,
      serialize
    });
    for (const [key, value] of Object.entries(from)) {
      if (value && value instanceof Uint8Array && value.constructor.name === "Buffer") {
        to[key] = "[object Buffer]";
        continue;
      }
      if (value !== null && typeof value === "object" && typeof value.pipe === "function") {
        to[key] = "[object Stream]";
        continue;
      }
      if (typeof value === "function") {
        continue;
      }
      if (!value || typeof value !== "object") {
        try {
          to[key] = value;
        } catch {
        }
        continue;
      }
      if (!seen.includes(from[key])) {
        depth++;
        to[key] = continueDestroyCircular(from[key]);
        continue;
      }
      to[key] = "[Circular]";
    }
    for (const { property, enumerable } of commonProperties) {
      if (typeof from[property] !== "undefined" && from[property] !== null) {
        Object.defineProperty(to, property, {
          value: isErrorLike(from[property]) ? continueDestroyCircular(from[property]) : from[property],
          enumerable: forceEnumerable ? true : enumerable,
          configurable: true,
          writable: true
        });
      }
    }
    return to;
  };
  function serializeError(value, options = {}) {
    const {
      maxDepth = Number.POSITIVE_INFINITY,
      useToJSON = true
    } = options;
    if (typeof value === "object" && value !== null) {
      return destroyCircular({
        from: value,
        seen: [],
        forceEnumerable: true,
        maxDepth,
        depth: 0,
        useToJSON,
        serialize: true
      });
    }
    if (typeof value === "function") {
      return `[Function: ${value.name || "anonymous"}]`;
    }
    return value;
  }
  function deserializeError(value, options = {}) {
    const { maxDepth = Number.POSITIVE_INFINITY } = options;
    if (value instanceof Error) {
      return value;
    }
    if (isMinimumViableSerializedError(value)) {
      const Error2 = getErrorConstructor(value.name);
      return destroyCircular({
        from: value,
        seen: [],
        to: new Error2(),
        maxDepth,
        depth: 0,
        serialize: false
      });
    }
    return new NonError(value);
  }
  function isErrorLike(value) {
    return Boolean(value) && typeof value === "object" && "name" in value && "message" in value && "stack" in value;
  }
  function isMinimumViableSerializedError(value) {
    return Boolean(value) && typeof value === "object" && "message" in value && !Array.isArray(value);
  }
  var __defProp2 = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __async$1 = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  function defineGenericMessanging(config) {
    let removeRootListener;
    let perTypeListeners = {};
    function cleanupRootListener() {
      if (Object.entries(perTypeListeners).length === 0) {
        removeRootListener == null ? void 0 : removeRootListener();
        removeRootListener = void 0;
      }
    }
    let idSeq = Math.floor(Math.random() * 1e4);
    function getNextId() {
      return idSeq++;
    }
    return {
      sendMessage(type, data, ...args) {
        return __async$1(this, null, function* () {
          var _a2, _b, _c, _d;
          const _message = {
            id: getNextId(),
            type,
            data,
            timestamp: Date.now()
          };
          const message = (_b = yield (_a2 = config.verifyMessageData) == null ? void 0 : _a2.call(config, _message)) != null ? _b : _message;
          (_c = config.logger) == null ? void 0 : _c.debug(`[messaging] sendMessage {id=${message.id}} ─ᐅ`, message, ...args);
          const response = yield config.sendMessage(message, ...args);
          const { res, err } = response != null ? response : { err: new Error("No response") };
          (_d = config.logger) == null ? void 0 : _d.debug(`[messaging] sendMessage {id=${message.id}} ᐊ─`, { res, err });
          if (err != null)
            throw deserializeError(err);
          return res;
        });
      },
      onMessage(type, onReceived) {
        var _a2, _b, _c;
        if (removeRootListener == null) {
          (_a2 = config.logger) == null ? void 0 : _a2.debug(
            `[messaging] "${type}" initialized the message listener for this context`
          );
          removeRootListener = config.addRootListener((message) => {
            var _a3, _b2;
            if (typeof message.type != "string" || typeof message.timestamp !== "number") {
              if (config.breakError) {
                return;
              }
              const err = Error(
                `[messaging] Unknown message format, must include the 'type' & 'timestamp' fields, received: ${JSON.stringify(
                  message
                )}`
              );
              (_a3 = config.logger) == null ? void 0 : _a3.error(err);
              throw err;
            }
            (_b2 = config == null ? void 0 : config.logger) == null ? void 0 : _b2.debug("[messaging] Received message", message);
            const listener = perTypeListeners[message.type];
            if (listener == null)
              return;
            const res = listener(message);
            return Promise.resolve(res).then((res2) => {
              var _a4, _b3;
              return (_b3 = (_a4 = config.verifyMessageData) == null ? void 0 : _a4.call(config, res2)) != null ? _b3 : res2;
            }).then((res2) => {
              var _a4;
              (_a4 = config == null ? void 0 : config.logger) == null ? void 0 : _a4.debug(`[messaging] onMessage {id=${message.id}} ─ᐅ`, { res: res2 });
              return { res: res2 };
            }).catch((err) => {
              var _a4;
              (_a4 = config == null ? void 0 : config.logger) == null ? void 0 : _a4.debug(`[messaging] onMessage {id=${message.id}} ─ᐅ`, { err });
              return { err: serializeError(err) };
            });
          });
        }
        if (perTypeListeners[type] != null) {
          const err = Error(
            `[messaging] In this JS context, only one listener can be setup for ${type}`
          );
          (_b = config.logger) == null ? void 0 : _b.error(err);
          throw err;
        }
        perTypeListeners[type] = onReceived;
        (_c = config.logger) == null ? void 0 : _c.log(`[messaging] Added listener for ${type}`);
        return () => {
          delete perTypeListeners[type];
          cleanupRootListener();
        };
      },
      removeAllListeners() {
        Object.keys(perTypeListeners).forEach((type) => {
          delete perTypeListeners[type];
        });
        cleanupRootListener();
      }
    };
  }
  function defineExtensionMessaging(config) {
    return defineGenericMessanging(__spreadProps(__spreadValues({}, config), {
      sendMessage(message, tabId) {
        if (tabId == null)
          return originalBrowser.runtime.sendMessage(message);
        return originalBrowser.tabs.sendMessage(tabId, message);
      },
      addRootListener(processMessage) {
        const listener = (message, sender) => {
          if (typeof message === "object")
            return processMessage(__spreadProps(__spreadValues({}, message), { sender }));
          else
            return processMessage(message);
        };
        originalBrowser.runtime.onMessage.addListener(listener);
        return () => originalBrowser.runtime.onMessage.removeListener(listener);
      }
    }));
  }
  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  var isobject = function isObject2(val) {
    return val != null && typeof val === "object" && Array.isArray(val) === false;
  };
  /*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */
  const isObject = isobject;
  var getValue = function(target, path, options) {
    if (!isObject(options)) {
      options = { default: options };
    }
    if (!isValidObject(target)) {
      return typeof options.default !== "undefined" ? options.default : target;
    }
    if (typeof path === "number") {
      path = String(path);
    }
    const isArray = Array.isArray(path);
    const isString = typeof path === "string";
    const splitChar = options.separator || ".";
    const joinChar = options.joinChar || (typeof splitChar === "string" ? splitChar : ".");
    if (!isString && !isArray) {
      return target;
    }
    if (isString && path in target) {
      return isValid(path, target, options) ? target[path] : options.default;
    }
    let segs = isArray ? path : split(path, splitChar, options);
    let len = segs.length;
    let idx = 0;
    do {
      let prop = segs[idx];
      if (typeof prop === "number") {
        prop = String(prop);
      }
      while (prop && prop.slice(-1) === "\\") {
        prop = join([prop.slice(0, -1), segs[++idx] || ""], joinChar, options);
      }
      if (prop in target) {
        if (!isValid(prop, target, options)) {
          return options.default;
        }
        target = target[prop];
      } else {
        let hasProp = false;
        let n = idx + 1;
        while (n < len) {
          prop = join([prop, segs[n++]], joinChar, options);
          if (hasProp = prop in target) {
            if (!isValid(prop, target, options)) {
              return options.default;
            }
            target = target[prop];
            idx = n - 1;
            break;
          }
        }
        if (!hasProp) {
          return options.default;
        }
      }
    } while (++idx < len && isValidObject(target));
    if (idx === len) {
      return target;
    }
    return options.default;
  };
  function join(segs, joinChar, options) {
    if (typeof options.join === "function") {
      return options.join(segs);
    }
    return segs[0] + joinChar + segs[1];
  }
  function split(path, splitChar, options) {
    if (typeof options.split === "function") {
      return options.split(path);
    }
    return path.split(splitChar);
  }
  function isValid(key, target, options) {
    if (typeof options.isValid === "function") {
      return options.isValid(key, target);
    }
    return true;
  }
  function isValidObject(val) {
    return isObject(val) || Array.isArray(val) || typeof val === "function";
  }
  const get2 = /* @__PURE__ */ getDefaultExportFromCjs(getValue);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  function isBackground() {
    if (!canAccessExtensionApi())
      return false;
    const manifest = originalBrowser.runtime.getManifest();
    if (!manifest.background)
      return false;
    return manifest.manifest_version === 3 ? isBackgroundServiceWorker() : isBackgroundPage();
  }
  function canAccessExtensionApi() {
    var _a;
    return !!((_a = originalBrowser.runtime) == null ? void 0 : _a.id);
  }
  var KNOWN_BACKGROUND_PAGE_PATHNAMES = [
    // Firefox
    "/_generated_background_page.html"
  ];
  function isBackgroundPage() {
    return typeof window !== "undefined" && KNOWN_BACKGROUND_PAGE_PATHNAMES.includes(location.pathname);
  }
  function isBackgroundServiceWorker() {
    return typeof window === "undefined";
  }
  function defineProxyService(name, init, config) {
    let service;
    const messageKey = `proxy-service.${name}`;
    const { onMessage, sendMessage } = defineExtensionMessaging(config);
    function createProxy(path) {
      const wrapped = () => {
      };
      const proxy = new Proxy(wrapped, {
        // Executed when the object is called as a function
        apply(_target, _thisArg, args) {
          return __async(this, null, function* () {
            const res = yield sendMessage(messageKey, {
              path,
              args
            });
            return res;
          });
        },
        // Executed when accessing a property on an object
        get(target, propertyName, receiver) {
          if (propertyName === "__proxy" || typeof propertyName === "symbol") {
            return Reflect.get(target, propertyName, receiver);
          }
          return createProxy(path == null ? propertyName : `${path}.${propertyName}`);
        }
      });
      proxy.__proxy = true;
      return proxy;
    }
    return [
      function registerService(...args) {
        service = init(...args);
        onMessage(messageKey, ({ data }) => {
          const method = data.path == null ? service : get2(service != null ? service : {}, data.path);
          if (method)
            return Promise.resolve(method.bind(service)(...data.args));
        });
        return service;
      },
      function getService() {
        if (!isBackground())
          return createProxy();
        if (service == null) {
          throw Error(
            `Failed to get an instance of ${name}: in background, but registerService has not been called. Did you forget to call registerService?`
          );
        }
        return service;
      }
    ];
  }
  function createTimedataService(_db) {
    return {
      async getAll() {
        const db = await _db;
        return await db.getAll("timedata");
      },
      async getAllByDay(day) {
        const db = await _db;
        const timeDataArr = await db.getAll("timedata");
        const dayData = timeDataArr.filter((timeData) => timeData.day === day);
        return dayData;
      },
      async getFirstOfDay(day, hostname) {
        const db = await _db;
        const timeDataArr = await db.getAll("timedata");
        timeDataArr.filter((timeData) => timeData.day === day && timeData.hostname === hostname);
        return await timeDataArr[0];
      },
      async getLast(hostname) {
        const db = await _db;
        const timeDataArr = await db.getAll("timedata");
        const data = timeDataArr.filter((timeData) => timeData.hostname === hostname);
        return data[data.length - 1];
      },
      async get(hostname, day) {
        const db = await _db;
        const list2 = await db.getAll("timedata");
        const filtered = list2.filter((timeData) => timeData.day === day && timeData.hostname === hostname);
        return filtered[0];
      },
      async create(info) {
        const db = await _db;
        if (await db.get("timedata", info.hostname)) {
          const response = await db.put("timedata", info);
          console.log(response);
        } else {
          const response = await db.add("timedata", info);
          console.log(response);
        }
      },
      async update(info) {
        const db = await _db;
        await db.put("timedata", info);
      }
    };
  }
  const [registerTimedataService, getTimedataService] = defineProxyService(
    "timedata-service",
    createTimedataService
  );
  _background;
  function toArray(a) {
    return Array.isArray(a) ? a : [a];
  }
  var has = Object.prototype.hasOwnProperty;
  function dequal(foo, bar) {
    var ctor, len;
    if (foo === bar) return true;
    if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
      if (ctor === Date) return foo.getTime() === bar.getTime();
      if (ctor === RegExp) return foo.toString() === bar.toString();
      if (ctor === Array) {
        if ((len = foo.length) === bar.length) {
          while (len-- && dequal(foo[len], bar[len])) ;
        }
        return len === -1;
      }
      if (!ctor || typeof foo === "object") {
        len = 0;
        for (ctor in foo) {
          if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
          if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
        }
        return Object.keys(bar).length === len;
      }
    }
    return foo !== foo && bar !== bar;
  }
  var browser = originalBrowser;
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  var storage = createStorage();
  function createStorage() {
    const drivers = {
      local: createDriver("local"),
      session: createDriver("session"),
      sync: createDriver("sync"),
      managed: createDriver("managed")
    };
    const getDriver = (area) => {
      const driver = drivers[area];
      if (driver == null) {
        const areaNames = Object.keys(drivers).join(", ");
        throw Error(`Invalid area "${area}". Options: ${areaNames}`);
      }
      return driver;
    };
    const resolveKey = (key) => {
      const deliminatorIndex = key.indexOf(":");
      const driverArea = key.substring(0, deliminatorIndex);
      const driverKey = key.substring(deliminatorIndex + 1);
      if (driverKey == null)
        throw Error(
          `Storage key should be in the form of "area:key", but received "${key}"`
        );
      return {
        driverArea,
        driverKey,
        driver: getDriver(driverArea)
      };
    };
    const getMetaKey = (key) => key + "$";
    const getValueOrDefault = (value, defaultValue) => value ?? defaultValue ?? null;
    const getMetaValue = (properties) => typeof properties === "object" && !Array.isArray(properties) ? properties : {};
    const getItem = async (driver, driverKey, opts) => {
      const res = await driver.getItem(driverKey);
      return getValueOrDefault(res, opts == null ? void 0 : opts.defaultValue);
    };
    const getMeta = async (driver, driverKey) => {
      const metaKey = getMetaKey(driverKey);
      const res = await driver.getItem(metaKey);
      return getMetaValue(res);
    };
    const setItem = async (driver, driverKey, value) => {
      await driver.setItem(driverKey, value ?? null);
    };
    const setMeta = async (driver, driverKey, properties) => {
      const metaKey = getMetaKey(driverKey);
      const existingFields = getMetaValue(await driver.getItem(metaKey));
      const newFields = { ...existingFields };
      Object.entries(properties).forEach(([key, value]) => {
        if (value == null) {
          delete newFields[key];
        } else {
          newFields[key] = value;
        }
      });
      await driver.setItem(metaKey, newFields);
    };
    const removeItem = async (driver, driverKey, opts) => {
      await driver.removeItem(driverKey);
      if (opts == null ? void 0 : opts.removeMeta) {
        const metaKey = getMetaKey(driverKey);
        await driver.removeItem(metaKey);
      }
    };
    const removeMeta = async (driver, driverKey, properties) => {
      const metaKey = getMetaKey(driverKey);
      if (properties == null) {
        await driver.removeItem(metaKey);
      } else {
        const newFields = getMetaValue(await driver.getItem(metaKey));
        toArray(properties).forEach((field) => delete newFields[field]);
        await driver.setItem(metaKey, newFields);
      }
    };
    const watch = (driver, driverKey, cb) => {
      return driver.watch(driverKey, cb);
    };
    const storage2 = {
      getItem: async (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        return await getItem(driver, driverKey, opts);
      },
      getItems: async (keys) => {
        const areaToKeyMap = /* @__PURE__ */ new Map();
        const keyToOptsMap = /* @__PURE__ */ new Map();
        keys.forEach((key) => {
          let keyStr;
          let opts;
          if (typeof key === "string") {
            keyStr = key;
          } else {
            keyStr = key.key;
            opts = key.options;
          }
          const { driverArea, driverKey } = resolveKey(keyStr);
          const keys2 = areaToKeyMap.get(driverArea) ?? [];
          areaToKeyMap.set(driverArea, keys2.concat(driverKey));
          keyToOptsMap.set(keyStr, opts);
        });
        const results = await Promise.all(
          Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys2]) => {
            const driverResults = await drivers[driverArea].getItems(keys2);
            return driverResults.map((driverResult) => {
              var _a;
              const key = `${driverArea}:${driverResult.key}`;
              const value = getValueOrDefault(
                driverResult.value,
                (_a = keyToOptsMap.get(key)) == null ? void 0 : _a.defaultValue
              );
              return { key, value };
            });
          })
        );
        return results.flat();
      },
      getMeta: async (key) => {
        const { driver, driverKey } = resolveKey(key);
        return await getMeta(driver, driverKey);
      },
      setItem: async (key, value) => {
        const { driver, driverKey } = resolveKey(key);
        await setItem(driver, driverKey, value);
      },
      setItems: async (values) => {
        const areaToKeyValueMap = /* @__PURE__ */ new Map();
        values.forEach(({ key, value }) => {
          const { driverArea, driverKey } = resolveKey(key);
          const values2 = areaToKeyValueMap.get(driverArea) ?? [];
          areaToKeyValueMap.set(
            driverArea,
            values2.concat({ key: driverKey, value })
          );
        });
        await Promise.all(
          Array.from(areaToKeyValueMap.entries()).map(
            async ([driverArea, values2]) => {
              const driver = getDriver(driverArea);
              await driver.setItems(values2);
            }
          )
        );
      },
      setMeta: async (key, properties) => {
        const { driver, driverKey } = resolveKey(key);
        await setMeta(driver, driverKey, properties);
      },
      removeItem: async (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        await removeItem(driver, driverKey, opts);
      },
      removeItems: async (keys) => {
        const areaToKeysMap = /* @__PURE__ */ new Map();
        keys.forEach((key) => {
          let keyStr;
          let opts;
          if (typeof key === "string") {
            keyStr = key;
          } else {
            keyStr = key.key;
            opts = key.options;
          }
          const { driverArea, driverKey } = resolveKey(keyStr);
          const areaKeys = areaToKeysMap.get(driverArea) ?? [];
          areaKeys.push(driverKey);
          if (opts == null ? void 0 : opts.removeMeta) {
            areaKeys.push(getMetaKey(driverKey));
          }
          areaToKeysMap.set(driverArea, areaKeys);
        });
        await Promise.all(
          Array.from(areaToKeysMap.entries()).map(async ([driverArea, keys2]) => {
            const driver = getDriver(driverArea);
            await driver.removeItems(keys2);
          })
        );
      },
      removeMeta: async (key, properties) => {
        const { driver, driverKey } = resolveKey(key);
        await removeMeta(driver, driverKey, properties);
      },
      snapshot: async (base, opts) => {
        var _a;
        const driver = getDriver(base);
        const data = await driver.snapshot();
        (_a = opts == null ? void 0 : opts.excludeKeys) == null ? void 0 : _a.forEach((key) => {
          delete data[key];
          delete data[getMetaKey(key)];
        });
        return data;
      },
      restoreSnapshot: async (base, data) => {
        const driver = getDriver(base);
        await driver.restoreSnapshot(data);
      },
      watch: (key, cb) => {
        const { driver, driverKey } = resolveKey(key);
        return watch(driver, driverKey, cb);
      },
      unwatch() {
        Object.values(drivers).forEach((driver) => {
          driver.unwatch();
        });
      },
      defineItem: (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        const { version: targetVersion = 1, migrations = {} } = opts ?? {};
        if (targetVersion < 1) {
          throw Error(
            "Storage item version cannot be less than 1. Initial versions should be set to 1, not 0."
          );
        }
        const migrate = async () => {
          var _a;
          const driverMetaKey = getMetaKey(driverKey);
          const [{ value }, { value: meta }] = await driver.getItems([
            driverKey,
            driverMetaKey
          ]);
          if (value == null) return;
          const currentVersion = (meta == null ? void 0 : meta.v) ?? 1;
          if (currentVersion > targetVersion) {
            throw Error(
              `Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`
            );
          }
          logger$1.debug(
            `Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`
          );
          const migrationsToRun = Array.from(
            { length: targetVersion - currentVersion },
            (_, i) => currentVersion + i + 1
          );
          let migratedValue = value;
          for (const migrateToVersion of migrationsToRun) {
            migratedValue = await ((_a = migrations == null ? void 0 : migrations[migrateToVersion]) == null ? void 0 : _a.call(migrations, migratedValue)) ?? migratedValue;
          }
          await driver.setItems([
            { key: driverKey, value: migratedValue },
            { key: driverMetaKey, value: { ...meta, v: targetVersion } }
          ]);
          logger$1.debug(
            `Storage migration completed for ${key} v${targetVersion}`,
            { migratedValue }
          );
        };
        const migrationsDone = (opts == null ? void 0 : opts.migrations) == null ? Promise.resolve() : migrate().catch((err) => {
          logger$1.error(`Migration failed for ${key}`, err);
        });
        const getDefaultValue = () => (opts == null ? void 0 : opts.defaultValue) ?? null;
        return {
          get defaultValue() {
            return getDefaultValue();
          },
          getValue: async () => {
            await migrationsDone;
            return await getItem(driver, driverKey, opts);
          },
          getMeta: async () => {
            await migrationsDone;
            return await getMeta(driver, driverKey);
          },
          setValue: async (value) => {
            await migrationsDone;
            return await setItem(driver, driverKey, value);
          },
          setMeta: async (properties) => {
            await migrationsDone;
            return await setMeta(driver, driverKey, properties);
          },
          removeValue: async (opts2) => {
            await migrationsDone;
            return await removeItem(driver, driverKey, opts2);
          },
          removeMeta: async (properties) => {
            await migrationsDone;
            return await removeMeta(driver, driverKey, properties);
          },
          watch: (cb) => watch(
            driver,
            driverKey,
            (newValue, oldValue) => cb(newValue ?? getDefaultValue(), oldValue ?? getDefaultValue())
          ),
          migrate
        };
      }
    };
    return storage2;
  }
  function createDriver(storageArea) {
    const getStorageArea = () => {
      if (browser.runtime == null) {
        throw Error(
          [
            "'wxt/storage' must be loaded in a web extension environment",
            "\n - If thrown during a build, see https://github.com/wxt-dev/wxt/issues/371",
            " - If thrown during tests, mock 'wxt/browser' correctly. See https://wxt.dev/guide/go-further/testing.html\n"
          ].join("\n")
        );
      }
      if (browser.storage == null) {
        throw Error(
          "You must add the 'storage' permission to your manifest to use 'wxt/storage'"
        );
      }
      const area = browser.storage[storageArea];
      if (area == null)
        throw Error(`"browser.storage.${storageArea}" is undefined`);
      return area;
    };
    const watchListeners = /* @__PURE__ */ new Set();
    return {
      getItem: async (key) => {
        const res = await getStorageArea().get(key);
        return res[key];
      },
      getItems: async (keys) => {
        const result2 = await getStorageArea().get(keys);
        return keys.map((key) => ({ key, value: result2[key] ?? null }));
      },
      setItem: async (key, value) => {
        if (value == null) {
          await getStorageArea().remove(key);
        } else {
          await getStorageArea().set({ [key]: value });
        }
      },
      setItems: async (values) => {
        const map = values.reduce(
          (map2, { key, value }) => {
            map2[key] = value;
            return map2;
          },
          {}
        );
        await getStorageArea().set(map);
      },
      removeItem: async (key) => {
        await getStorageArea().remove(key);
      },
      removeItems: async (keys) => {
        await getStorageArea().remove(keys);
      },
      snapshot: async () => {
        return await getStorageArea().get();
      },
      restoreSnapshot: async (data) => {
        await getStorageArea().set(data);
      },
      watch(key, cb) {
        const listener = (changes) => {
          const change = changes[key];
          if (change == null) return;
          if (dequal(change.newValue, change.oldValue)) return;
          cb(change.newValue ?? null, change.oldValue ?? null);
        };
        getStorageArea().onChanged.addListener(listener);
        watchListeners.add(listener);
        return () => {
          getStorageArea().onChanged.removeListener(listener);
          watchListeners.delete(listener);
        };
      },
      unwatch() {
        watchListeners.forEach((listener) => {
          getStorageArea().onChanged.removeListener(listener);
        });
        watchListeners.clear();
      }
    };
  }
  let startTime = null;
  const definition = defineBackground(() => {
    var stopWatchTime = 0;
    var timeSpent = 0;
    const db = openExtensionDatabase();
    const timedataService = registerTimedataService(db);
    browser$1.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await browser$1.tabs.get(activeInfo.tabId);
      createTimeData(tab);
    });
    async function updateTimeData(tab) {
      const endTime = Date.now();
      const url = tab.url ?? tab.pendingUrl;
      const faviconUrl = tab.favIconUrl;
      if (!url || !faviconUrl) return;
      const hostname = new URL(url).hostname;
      const timeData = await timedataService.getLast(hostname);
      if (!timeData) return;
      const lastData = await timedataService.getFirstOfDay(formatDate(/* @__PURE__ */ new Date()), hostname);
      if (!lastData) return;
      const timeSpent2 = endTime - (startTime || Date.now());
      await timedataService.update({
        ...timeData,
        updated_at: Date.now(),
        timeSpent: timeSpent2
        // session: timeData.session
      });
      browser$1.tabs.sendMessage(
        tab.id,
        {
          timeData: timeSpent2,
          timeLimits: 0
        }
      );
    }
    async function createTimeData(tab) {
      const url = tab.url ?? tab.pendingUrl;
      const faviconUrl = tab.favIconUrl;
      if (!url || !faviconUrl) return;
      const hostname = new URL(url).hostname;
      const timeData = await timedataService.getLast(hostname);
      console.group("timeData");
      console.log("timeData", timeData);
      console.groupEnd();
      const timeSpent2 = Date.now() - (startTime || Date.now());
      await timedataService.create({
        created_at: Date.now(),
        updated_at: Date.now(),
        hostname,
        day: formatDate(/* @__PURE__ */ new Date()),
        faviconUrl,
        timeSpent: timeSpent2
      });
      startTime = Date.now();
    }
    browser$1.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        createTimeData(tab);
      }
    });
    browser$1.alarms.create("checkTimeLimits", { periodInMinutes: 1 / 60 });
    browser$1.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === "checkTimeLimits") {
        const timeData = await storage.getItem("local:timeData");
        const timeLimits = await storage.getItem("local:timeLimits");
        const allTabs = await browser$1.tabs.query({});
        allTabs.map(async (tab) => {
          if (tab.active)
            updateTimeData(tab);
        });
        if (!timeData || !timeLimits) return;
        for (const [url, timeSpent2] of Object.entries(timeData)) {
          if (timeLimits && timeLimits[url] && timeSpent2 > timeLimits[url]) {
            browser$1.notifications.create({
              type: "basic",
              iconUrl: "icon.png",
              title: "Time Limit Exceeded",
              message: `You've exceeded your time limit for ${url}`
            });
          }
        }
      }
    });
    browser$1.runtime.onMessage.addListener(async (message) => {
      if (message.type == "startStopWatch") {
        stopWatchTime = message.timestamp;
        timeSpent = 0;
        return { timeSpent };
      }
      if (message.type == "pauseStopWatch") {
        timeSpent = (/* @__PURE__ */ new Date()).getTime() - stopWatchTime;
        return { timeSpent };
      }
      if (message.type == "checkStopWatch") {
        timeSpent = (/* @__PURE__ */ new Date()).getTime() - stopWatchTime;
        return { timeSpent };
      }
      if (message.type == "getTimeDataList") {
        const timeDataList = await timedataService.getAllByDay(formatDate(/* @__PURE__ */ new Date()));
        return timeDataList;
      }
      return { timeSpent };
    });
  });
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  _background;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  var ws;
  function getDevServerWebSocket() {
    if (ws == null) {
      const serverUrl = `${"ws:"}//${"localhost"}:${3e3}`;
      logger.debug("Connecting to dev server @", serverUrl);
      ws = new WebSocket(serverUrl, "vite-hmr");
      ws.addWxtEventListener = ws.addEventListener.bind(ws);
      ws.sendCustom = (event, payload) => ws == null ? void 0 : ws.send(JSON.stringify({ type: "custom", event, payload }));
      ws.addEventListener("open", () => {
        logger.debug("Connected to dev server");
      });
      ws.addEventListener("close", () => {
        logger.debug("Disconnected from dev server");
      });
      ws.addEventListener("error", (event) => {
        logger.error("Failed to connect to dev server", event);
      });
      ws.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data);
          if (message.type === "custom") {
            ws == null ? void 0 : ws.dispatchEvent(
              new CustomEvent(message.event, { detail: message.data })
            );
          }
        } catch (err) {
          logger.error("Failed to handle message", err);
        }
      });
    }
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser$1.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser$1.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser$1.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser$1.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser$1.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser$1.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      var _a, _b;
      const hasJs = (_a = contentScript.js) == null ? void 0 : _a.find((js) => {
        var _a2;
        return (_a2 = cs.js) == null ? void 0 : _a2.includes(js);
      });
      const hasCss = (_b = contentScript.css) == null ? void 0 : _b.find((css) => {
        var _a2;
        return (_a2 = cs.css) == null ? void 0 : _a2.includes(css);
      });
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser$1.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser$1.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url) return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(
      matchingTabs.map(async (tab) => {
        try {
          await browser$1.tabs.reload(tab.id);
        } catch (err) {
          logger.warn("Failed to reload tab:", err);
        }
      })
    );
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws2 = getDevServerWebSocket();
      ws2.addWxtEventListener("wxt:reload-extension", () => {
        browser$1.runtime.reload();
      });
      ws2.addWxtEventListener("wxt:reload-content-script", (event) => {
        reloadContentScript(event.detail);
      });
      if (true) {
        ws2.addEventListener(
          "open",
          () => ws2.sendCustom("wxt:background-initialized")
        );
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser$1.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser$1.runtime.reload();
      }
    });
  }
  var result;
  try {
    initPlugins();
    result = definition.main();
    if (result instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
  var background_entrypoint_default = result;
  return background_entrypoint_default;
}();
_background;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9saWIvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3Qvc2FuZGJveC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NodW5rLUZOVEUyTDI3LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC9pbmRleC5qcyIsIi4uLy4uL3V0aWxzL2RhdGFiYXNlLnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3NlcmlhbGl6ZS1lcnJvci9lcnJvci1jb25zdHJ1Y3RvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvc2VyaWFsaXplLWVycm9yL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tZXNzYWdpbmcvbGliL2NodW5rLUJRTEZTRkZaLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tZXNzYWdpbmcvbGliL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2lzb2JqZWN0L2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2dldC12YWx1ZS9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ad2ViZXh0LWNvcmUvcHJveHktc2VydmljZS9saWIvaW5kZXguanMiLCIuLi8uLi91dGlscy90aW1lZGF0YS1zZXJ2aWNlLnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NodW5rLUJFUlBOUEVaLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2RlcXVhbC9saXRlL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zdG9yYWdlLmpzIiwiLi4vLi4vZW50cnlwb2ludHMvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvaW5kZXgudHNcbnZhciBfTWF0Y2hQYXR0ZXJuID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcbiAgICBpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuICAgICAgdGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uX01hdGNoUGF0dGVybi5QUk9UT0NPTFNdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gXCIqXCI7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBcIipcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ3JvdXBzID0gLyguKik6XFwvXFwvKC4qPykoXFwvLiopLy5leGVjKG1hdGNoUGF0dGVybik7XG4gICAgICBpZiAoZ3JvdXBzID09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgXCJJbmNvcnJlY3QgZm9ybWF0XCIpO1xuICAgICAgY29uc3QgW18sIHByb3RvY29sLCBob3N0bmFtZSwgcGF0aG5hbWVdID0gZ3JvdXBzO1xuICAgICAgdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKTtcbiAgICAgIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSk7XG4gICAgICB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcbiAgICB9XG4gIH1cbiAgaW5jbHVkZXModXJsKSB7XG4gICAgaWYgKHRoaXMuaXNBbGxVcmxzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuICAgIHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcbiAgICB9KTtcbiAgfVxuICBpc0h0dHBNYXRjaCh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0h0dHBzTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuICB9XG4gIGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcbiAgICBpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbXG4gICAgICB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLFxuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSlcbiAgICBdO1xuICAgIGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG4gICAgcmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuICB9XG4gIGlzRmlsZU1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmaWxlOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc0Z0cE1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGlzVXJuTWF0Y2godXJsKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IHVybjovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgY29udmVydFBhdHRlcm5Ub1JlZ2V4KHBhdHRlcm4pIHtcbiAgICBjb25zdCBlc2NhcGVkID0gdGhpcy5lc2NhcGVGb3JSZWdleChwYXR0ZXJuKTtcbiAgICBjb25zdCBzdGFyc1JlcGxhY2VkID0gZXNjYXBlZC5yZXBsYWNlKC9cXFxcXFwqL2csIFwiLipcIik7XG4gICAgcmV0dXJuIFJlZ0V4cChgXiR7c3RhcnNSZXBsYWNlZH0kYCk7XG4gIH1cbiAgZXNjYXBlRm9yUmVnZXgoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG4gIH1cbn07XG52YXIgTWF0Y2hQYXR0ZXJuID0gX01hdGNoUGF0dGVybjtcbk1hdGNoUGF0dGVybi5QUk9UT0NPTFMgPSBbXCJodHRwXCIsIFwiaHR0cHNcIiwgXCJmaWxlXCIsIFwiZnRwXCIsIFwidXJuXCJdO1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcbiAgICBzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuICB9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG4gIGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKFxuICAgICAgbWF0Y2hQYXR0ZXJuLFxuICAgICAgYCR7cHJvdG9jb2x9IG5vdCBhIHZhbGlkIHByb3RvY29sICgke01hdGNoUGF0dGVybi5QUk9UT0NPTFMuam9pbihcIiwgXCIpfSlgXG4gICAgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSkge1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpIHtcbiAgcmV0dXJuO1xufVxuZXhwb3J0IHtcbiAgSW52YWxpZE1hdGNoUGF0dGVybixcbiAgTWF0Y2hQYXR0ZXJuXG59O1xuIiwiLy8gc3JjL3NhbmRib3gvZGVmaW5lLXVubGlzdGVkLXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lVW5saXN0ZWRTY3JpcHQoYXJnKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtYmFja2dyb3VuZC50c1xuZnVuY3Rpb24gZGVmaW5lQmFja2dyb3VuZChhcmcpIHtcbiAgaWYgKHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG5cbi8vIHNyYy9zYW5kYm94L2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG4gIHJldHVybiBkZWZpbml0aW9uO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtd3h0LXBsdWdpbi50c1xuZnVuY3Rpb24gZGVmaW5lV3h0UGx1Z2luKHBsdWdpbikge1xuICByZXR1cm4gcGx1Z2luO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtYXBwLWNvbmZpZy50c1xuZnVuY3Rpb24gZGVmaW5lQXBwQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gY29uZmlnO1xufVxuXG4vLyBzcmMvc2FuZGJveC9pbmRleC50c1xuZXhwb3J0ICogZnJvbSBcIkB3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJuc1wiO1xuZXhwb3J0IHtcbiAgZGVmaW5lQXBwQ29uZmlnLFxuICBkZWZpbmVCYWNrZ3JvdW5kLFxuICBkZWZpbmVDb250ZW50U2NyaXB0LFxuICBkZWZpbmVVbmxpc3RlZFNjcmlwdCxcbiAgZGVmaW5lV3h0UGx1Z2luXG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCIsIFtcIm1vZHVsZVwiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KG1vZHVsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZCk7XG4gICAgZ2xvYmFsLmJyb3dzZXIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKG1vZHVsZSkge1xuICAvKiB3ZWJleHRlbnNpb24tcG9seWZpbGwgLSB2MC4xMC4wIC0gRnJpIEF1ZyAxMiAyMDIyIDE5OjQyOjQ0ICovXG5cbiAgLyogLSotIE1vZGU6IGluZGVudC10YWJzLW1vZGU6IG5pbDsganMtaW5kZW50LWxldmVsOiAyIC0qLSAqL1xuXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG5cbiAgLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICAgKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gICAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uICovXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGlmICghZ2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWU/LmlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLmJyb3dzZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbFRoaXMuYnJvd3NlcikgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjsgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gICAgLy8gb3B0aW1pemF0aW9uIGZvciBGaXJlZm94LiBTaW5jZSBTcGlkZXJtb25rZXkgZG9lcyBub3QgZnVsbHkgcGFyc2UgdGhlXG4gICAgLy8gY29udGVudHMgb2YgYSBmdW5jdGlvbiB1bnRpbCB0aGUgZmlyc3QgdGltZSBpdCdzIGNhbGxlZCwgYW5kIHNpbmNlIGl0IHdpbGxcbiAgICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gICAgLy8gaW4gRmlyZWZveCBuZWFybHkgZm9yIGZyZWUuXG5cbiAgICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgICAgLy8gTk9URTogYXBpTWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB0byB0aGUgY29udGVudCBvZiB0aGUgYXBpLW1ldGFkYXRhLmpzb24gZmlsZVxuICAgICAgLy8gYXQgYnVpbGQgdGltZSBieSByZXBsYWNpbmcgdGhlIGZvbGxvd2luZyBcImluY2x1ZGVcIiB3aXRoIHRoZSBjb250ZW50IG9mIHRoZVxuICAgICAgLy8gSlNPTiBmaWxlLlxuICAgICAgY29uc3QgYXBpTWV0YWRhdGEgPSB7XG4gICAgICAgIFwiYWxhcm1zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY2xlYXJBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJib29rbWFya3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q2hpbGRyZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTdWJUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgICAgXCJkaXNhYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzaW5nRGF0YVwiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDYWNoZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNvb2tpZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGb3JtRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUhpc3RvcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQYXNzd29yZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQbHVnaW5EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb21tYW5kc1wiOiB7XG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZXh0TWVudXNcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29va2llc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxDb29raWVTdG9yZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkZXZ0b29sc1wiOiB7XG4gICAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgICAgXCJldmFsXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhbmVsc1wiOiB7XG4gICAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbGVtZW50c1wiOiB7XG4gICAgICAgICAgICAgIFwiY3JlYXRlU2lkZWJhclBhbmVcIjoge1xuICAgICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgICBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRvd25sb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGaWxlSWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYXVzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZpbGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZXh0ZW5zaW9uXCI6IHtcbiAgICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgICBcImFkZFVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VmlzaXRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaTE4blwiOiB7XG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFjY2VwdExhbmd1YWdlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgICBcImxhdW5jaFdlYkF1dGhGbG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgICAgXCJxdWVyeVN0YXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0RW5hYmxlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVuaW5zdGFsbFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJub3RpZmljYXRpb25zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGVybWlzc2lvbkxldmVsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGFnZUFjdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgICBcImNvbnRhaW5zXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgIFwiZ2V0QmFja2dyb3VuZFBhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQbGF0Zm9ybUluZm9cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VW5pbnN0YWxsVVJMXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICAgIFwiZ2V0RGV2aWNlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudGx5Q2xvc2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtYW5hZ2VkXCI6IHtcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInN5bmNcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0YWJzXCI6IHtcbiAgICAgICAgICBcImNhcHR1cmVWaXNpYmxlVGFiXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkaXNjYXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXhlY3V0ZVNjcmlwdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29Gb3J3YXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInF1ZXJ5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wU2l0ZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViTmF2aWdhdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGcmFtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICAgIFwiaGFuZGxlckJlaGF2aW9yQ2hhbmdlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldExhc3RGb2N1c2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBBIFdlYWtNYXAgc3ViY2xhc3Mgd2hpY2ggY3JlYXRlcyBhbmQgc3RvcmVzIGEgdmFsdWUgZm9yIGFueSBrZXkgd2hpY2ggZG9lc1xuICAgICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAgICogb3RoZXJ3aXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAgICogICAgICAgIGtleSB3aGljaCBkb2VzIG5vdCBleGlzdCwgdGhlIGZpcnN0IHRpbWUgaXQgaXMgYWNjZXNzZWQuIFRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAgICovXG5cblxuICAgICAgY2xhc3MgRGVmYXVsdFdlYWtNYXAgZXh0ZW5kcyBXZWFrTWFwIHtcbiAgICAgICAgY29uc3RydWN0b3IoY3JlYXRlSXRlbSwgaXRlbXMgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdXBlcihpdGVtcyk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVJdGVtID0gY3JlYXRlSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5jcmVhdGVJdGVtKGtleSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoLCB3aGVuIGNhbGxlZCwgd2lsbCByZXNvbHZlIG9yIHJlamVjdFxuICAgICAgICogdGhlIGdpdmVuIHByb21pc2UgYmFzZWQgb24gaG93IGl0IGlzIGNhbGxlZDpcbiAgICAgICAqXG4gICAgICAgKiAtIElmLCB3aGVuIGNhbGxlZCwgYGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcmAgY29udGFpbnMgYSBub24tbnVsbCBvYmplY3QsXG4gICAgICAgKiAgIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIHdpdGggdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gSWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgcHJvbWlzZSBpc1xuICAgICAgICogICByZXNvbHZlZCB0byB0aGF0IHZhbHVlLlxuICAgICAgICogLSBPdGhlcndpc2UsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHRvIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZVxuICAgICAgICogICBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvbWlzZVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHV0aW9uIGFuZCByZWplY3Rpb24gZnVuY3Rpb25zIG9mIGFcbiAgICAgICAqICAgICAgICBwcm9taXNlLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZXNvbHZlXG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZXNvbHV0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZWplY3RcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlamVjdGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSB3cmFwcGVkIG1ldGhvZCB3aGljaCBoYXMgY3JlYXRlZCB0aGUgY2FsbGJhY2suXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAgICAgKiAgICAgICAgVGhlIGdlbmVyYXRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgY29uc3QgcGx1cmFsaXplQXJndW1lbnRzID0gbnVtQXJncyA9PiBudW1BcmdzID09IDEgPyBcImFyZ3VtZW50XCIgOiBcImFyZ3VtZW50c1wiO1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcEFzeW5jRnVuY3Rpb24gPSAobmFtZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgICAvLyBhbmQgc28gdGhlIHBvbHlmaWxsIHdpbGwgdHJ5IHRvIGNhbGwgaXQgd2l0aCBhIGNhbGxiYWNrIGZpcnN0LCBhbmQgaXQgd2lsbCBmYWxsYmFja1xuICAgICAgICAgICAgICAvLyB0byBub3QgcGFzc2luZyB0aGUgY2FsbGJhY2sgaWYgdGhlIGZpcnN0IGNhbGwgZmFpbHMuXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoY2JFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgKyBcImZhbGxpbmcgYmFjayB0byBjYWxsIGl0IHdpdGhvdXQgYSBjYWxsYmFjazogXCIsIGNiRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTsgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHVuc3VwcG9ydGVkIGNhbGxiYWNrIGFueW1vcmUuXG5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgICAqIGludGVyY2VwdGVkIGJ5IHRoZSBnaXZlbiB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBmdW5jdGlvbiByZWNlaXZlcyxcbiAgICAgICAqIGFzIGl0cyBmaXJzdCBhcmd1bWVudCwgdGhlIG9yaWdpbmFsIGB0YXJnZXRgIG9iamVjdCwgZm9sbG93ZWQgYnkgZWFjaCBvZlxuICAgICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZFxuICAgICAgICogICAgICAgIFRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC4gVGhpcyBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgdGhlIFByb3h5XG4gICAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gd3JhcHBlclxuICAgICAgICogICAgICAgIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiBhIGRpcmVjdCBpbnZvY2F0aW9uXG4gICAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxmdW5jdGlvbj59XG4gICAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gaXRzIHBsYWNlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcE1ldGhvZCA9ICh0YXJnZXQsIG1ldGhvZCwgd3JhcHBlcikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICAgIGFwcGx5KHRhcmdldE1ldGhvZCwgdGhpc09iaiwgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuY2FsbCh0aGlzT2JqLCB0YXJnZXQsIC4uLmFyZ3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICAgKiBiYXNlZCBvbiB0aGUgZ2l2ZW4gYHdyYXBwZXJzYCBhbmQgYG1ldGFkYXRhYCBvYmplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgdGFyZ2V0IG9iamVjdCB0byB3cmFwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBzcGVjaWFsIGNhc2VzLiBBbnlcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBwcmVzZW50IGluIHRoaXMgb2JqZWN0IHRyZWUgaXMgY2FsbGVkIGluIHBsYWNlIG9mIHRoZVxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciBtZXRob2RzIGFyZSBpbnZva2VkIGFzIGRlc2NyaWJlZCBpbiB7QHNlZSB3cmFwTWV0aG9kfS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyBtZXRhZGF0YSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVcbiAgICAgICAqICAgICAgICBQcm9taXNlLWJhc2VkIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhc3luY2hyb25vdXMuIEFueSBmdW5jdGlvbiBpblxuICAgICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAgICogICAgICAgIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgbWV0YWRhdGFgIHRyZWUgaXMgcmVwbGFjZWQgd2l0aCBhblxuICAgICAgICogICAgICAgIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24sIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxvYmplY3Q+fVxuICAgICAgICovXG5cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBnZXQocHJveHlUYXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbcHJvcF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG9iamVjdC4gQ2hlY2sgaWYgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcblxuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIGRlc2MpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoY2FjaGUsIHByb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICB9OyAvLyBQZXIgY29udHJhY3Qgb2YgdGhlIFByb3h5IEFQSSwgdGhlIFwiZ2V0XCIgcHJveHkgaGFuZGxlciBtdXN0IHJldHVybiB0aGVcbiAgICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgICAgLy8gbm9uLWNvbmZpZ3VyYWJsZS4gRm9yIHRoaXMgcmVhc29uLCB3ZSBjcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIHByb3RvdHlwZSBzZXQgdG8gYHRhcmdldGAgaW5zdGVhZCBvZiB1c2luZyBgdGFyZ2V0YCBkaXJlY3RseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgICAgLy8gYXJlIGRlY2xhcmVkIHJlYWQtb25seSBhbmQgbm9uLWNvbmZpZ3VyYWJsZSwgc3VjaCBhcyBgY2hyb21lLmRldnRvb2xzYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAgIC8vIGluc3RlYWQgb2YgdGhlIGBwcm94eVRhcmdldGAsIHNvIHRoYXQgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgYXJlXG4gICAgICAgIC8vIGRlcmVmZXJlbmNlZCB2aWEgdGhlIG9yaWdpbmFsIHRhcmdldHMuXG5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgc2V0IG9mIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBvYmplY3QsIHdoaWNoIGhhbmRsZXNcbiAgICAgICAqIHdyYXBwaW5nIG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0aGF0IHRob3NlIG1lc3NhZ2VzIGFyZSBwYXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQSBzaW5nbGUgd3JhcHBlciBpcyBjcmVhdGVkIGZvciBlYWNoIGxpc3RlbmVyIGZ1bmN0aW9uLCBhbmQgc3RvcmVkIGluIGFcbiAgICAgICAqIG1hcC4gU3Vic2VxdWVudCBjYWxscyB0byBgYWRkTGlzdGVuZXJgLCBgaGFzTGlzdGVuZXJgLCBvciBgcmVtb3ZlTGlzdGVuZXJgXG4gICAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgICAqIHByZXZpb3VzbHktYWRkZWQgbGlzdGVuZXIgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgICAqICAgICAgICBBIERlZmF1bHRXZWFrTWFwIG9iamVjdCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgd3JhcHBlclxuICAgICAgICogICAgICAgIGZvciBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHdoZW4gb25lIGRvZXMgbm90IGV4aXN0LCBhbmQgcmV0cmlldmVcbiAgICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICAgIGFkZExpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIsIC4uLmFyZ3MpIHtcbiAgICAgICAgICB0YXJnZXQuYWRkTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5oYXNMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYW4gb25SZXF1ZXN0RmluaXNoZWQgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCB3aWxsIHJldHVybiBhXG4gICAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjayBBUEkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAgICogICAgICAgIFRoZSBIQVIgZW50cnkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmV0d29yayByZXF1ZXN0LlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9XG4gICAgICAgICAgLyogd3JhcHBlcnMgKi9cbiAgICAgICAgICAsIHtcbiAgICAgICAgICAgIGdldENvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgICAgbWF4QXJnczogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCBvbk1lc3NhZ2VXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICAgIGxldCBzZW5kUmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGV0IHJlc3VsdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpc1Jlc3VsdFRoZW5hYmxlID0gcmVzdWx0ICE9PSB0cnVlICYmIGlzVGhlbmFibGUocmVzdWx0KTsgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG5vIHJlc3BvbnNlIHNlbnQgZnJvbSB0aGlzIGxpc3RlbmVyLlxuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gLy8gQSBzbWFsbCBoZWxwZXIgdG8gc2VuZCB0aGUgbWVzc2FnZSBpZiB0aGUgcHJvbWlzZSByZXNvbHZlc1xuICAgICAgICAgIC8vIGFuZCBhbiBlcnJvciBpZiB0aGUgcHJvbWlzZSByZWplY3RzIChhIHdyYXBwZWQgc2VuZE1lc3NhZ2UgaGFzXG4gICAgICAgICAgLy8gdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSByZXNvbHZlZCBwcm9taXNlIG9yIGEgcmVqZWN0ZWRcbiAgICAgICAgICAvLyBwcm9taXNlKS5cblxuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgaWYgKGVycm9yICYmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAvLyBQcmludCBhbiBlcnJvciBvbiB0aGUgY29uc29sZSBpZiB1bmFibGUgdG8gc2VuZCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07IC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG5cblxuICAgICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgIH0gLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuXG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlID0gKG5hbWUsIG1ldGFkYXRhLCBhcGlOYW1lc3BhY2VPYmosIC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3RhdGljV3JhcHBlcnMgPSB7XG4gICAgICAgIGRldnRvb2xzOiB7XG4gICAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgICAgb25SZXF1ZXN0RmluaXNoZWQ6IHdyYXBFdmVudChvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcnVudGltZToge1xuICAgICAgICAgIG9uTWVzc2FnZTogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBvbk1lc3NhZ2VFeHRlcm5hbDogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRhYnM6IHtcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAyLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzZXR0aW5nTWV0YWRhdGEgPSB7XG4gICAgICAgIGNsZWFyOiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGdldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGFwaU1ldGFkYXRhLnByaXZhY3kgPSB7XG4gICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZpY2VzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICB3ZWJzaXRlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB3cmFwT2JqZWN0KGV4dGVuc2lvbkFQSXMsIHN0YXRpY1dyYXBwZXJzLCBhcGlNZXRhZGF0YSk7XG4gICAgfTsgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAgIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3cmFwQVBJcyhjaHJvbWUpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5icm93c2VyO1xuICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyb3dzZXItcG9seWZpbGwuanMubWFwXG4iLCIvLyBzcmMvYnJvd3Nlci50c1xuaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG52YXIgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcblxuZXhwb3J0IHtcbiAgYnJvd3NlclxufTtcbiIsImNvbnN0IGluc3RhbmNlT2ZBbnkgPSAob2JqZWN0LCBjb25zdHJ1Y3RvcnMpID0+IGNvbnN0cnVjdG9ycy5zb21lKChjKSA9PiBvYmplY3QgaW5zdGFuY2VvZiBjKTtcblxubGV0IGlkYlByb3h5YWJsZVR5cGVzO1xubGV0IGN1cnNvckFkdmFuY2VNZXRob2RzO1xuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRJZGJQcm94eWFibGVUeXBlcygpIHtcbiAgICByZXR1cm4gKGlkYlByb3h5YWJsZVR5cGVzIHx8XG4gICAgICAgIChpZGJQcm94eWFibGVUeXBlcyA9IFtcbiAgICAgICAgICAgIElEQkRhdGFiYXNlLFxuICAgICAgICAgICAgSURCT2JqZWN0U3RvcmUsXG4gICAgICAgICAgICBJREJJbmRleCxcbiAgICAgICAgICAgIElEQkN1cnNvcixcbiAgICAgICAgICAgIElEQlRyYW5zYWN0aW9uLFxuICAgICAgICBdKSk7XG59XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkge1xuICAgIHJldHVybiAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgfHxcbiAgICAgICAgKGN1cnNvckFkdmFuY2VNZXRob2RzID0gW1xuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5hZHZhbmNlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWVQcmltYXJ5S2V5LFxuICAgICAgICBdKSk7XG59XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh3cmFwKHJlcXVlc3QucmVzdWx0KSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGV4aXN0IGluIHRyYW5zZm9ybUNhY2hlLiBUaGlzXG4gICAgLy8gaXMgYmVjYXVzZSB3ZSBjcmVhdGUgbWFueSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QuXG4gICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChwcm9taXNlLCByZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih0eCkge1xuICAgIC8vIEVhcmx5IGJhaWwgaWYgd2UndmUgYWxyZWFkeSBjcmVhdGVkIGEgZG9uZSBwcm9taXNlIGZvciB0aGlzIHRyYW5zYWN0aW9uLlxuICAgIGlmICh0cmFuc2FjdGlvbkRvbmVNYXAuaGFzKHR4KSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGRvbmUgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHR4LmVycm9yIHx8IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0RXJyb3InLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgfSk7XG4gICAgLy8gQ2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbC5cbiAgICB0cmFuc2FjdGlvbkRvbmVNYXAuc2V0KHR4LCBkb25lKTtcbn1cbmxldCBpZGJQcm94eVRyYXBzID0ge1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbikge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgdHJhbnNhY3Rpb24uZG9uZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnZG9uZScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uRG9uZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIE1ha2UgdHguc3RvcmUgcmV0dXJuIHRoZSBvbmx5IHN0b3JlIGluIHRoZSB0cmFuc2FjdGlvbiwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGFyZSBtYW55LlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdzdG9yZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1sxXVxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6IHJlY2VpdmVyLm9iamVjdFN0b3JlKHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEVsc2UgdHJhbnNmb3JtIHdoYXRldmVyIHdlIGdldCBiYWNrLlxuICAgICAgICByZXR1cm4gd3JhcCh0YXJnZXRbcHJvcF0pO1xuICAgIH0sXG4gICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaGFzKHRhcmdldCwgcHJvcCkge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24gJiZcbiAgICAgICAgICAgIChwcm9wID09PSAnZG9uZScgfHwgcHJvcCA9PT0gJ3N0b3JlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldDtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIHJlcGxhY2VUcmFwcyhjYWxsYmFjaykge1xuICAgIGlkYlByb3h5VHJhcHMgPSBjYWxsYmFjayhpZGJQcm94eVRyYXBzKTtcbn1cbmZ1bmN0aW9uIHdyYXBGdW5jdGlvbihmdW5jKSB7XG4gICAgLy8gRHVlIHRvIGV4cGVjdGVkIG9iamVjdCBlcXVhbGl0eSAod2hpY2ggaXMgZW5mb3JjZWQgYnkgdGhlIGNhY2hpbmcgaW4gYHdyYXBgKSwgd2VcbiAgICAvLyBvbmx5IGNyZWF0ZSBvbmUgbmV3IGZ1bmMgcGVyIGZ1bmMuXG4gICAgLy8gQ3Vyc29yIG1ldGhvZHMgYXJlIHNwZWNpYWwsIGFzIHRoZSBiZWhhdmlvdXIgaXMgYSBsaXR0bGUgbW9yZSBkaWZmZXJlbnQgdG8gc3RhbmRhcmQgSURCLiBJblxuICAgIC8vIElEQiwgeW91IGFkdmFuY2UgdGhlIGN1cnNvciBhbmQgd2FpdCBmb3IgYSBuZXcgJ3N1Y2Nlc3MnIG9uIHRoZSBJREJSZXF1ZXN0IHRoYXQgZ2F2ZSB5b3UgdGhlXG4gICAgLy8gY3Vyc29yLiBJdCdzIGtpbmRhIGxpa2UgYSBwcm9taXNlIHRoYXQgY2FuIHJlc29sdmUgd2l0aCBtYW55IHZhbHVlcy4gVGhhdCBkb2Vzbid0IG1ha2Ugc2Vuc2VcbiAgICAvLyB3aXRoIHJlYWwgcHJvbWlzZXMsIHNvIGVhY2ggYWR2YW5jZSBtZXRob2RzIHJldHVybnMgYSBuZXcgcHJvbWlzZSBmb3IgdGhlIGN1cnNvciBvYmplY3QsIG9yXG4gICAgLy8gdW5kZWZpbmVkIGlmIHRoZSBlbmQgb2YgdGhlIGN1cnNvciBoYXMgYmVlbiByZWFjaGVkLlxuICAgIGlmIChnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpLmluY2x1ZGVzKGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgICAgIGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKHRoaXMucmVxdWVzdCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5jb25zdCBhZHZhbmNlTWV0aG9kUHJvcHMgPSBbJ2NvbnRpbnVlJywgJ2NvbnRpbnVlUHJpbWFyeUtleScsICdhZHZhbmNlJ107XG5jb25zdCBtZXRob2RNYXAgPSB7fTtcbmNvbnN0IGFkdmFuY2VSZXN1bHRzID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGl0dHJQcm94aWVkQ3Vyc29yVG9PcmlnaW5hbFByb3h5ID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGN1cnNvckl0ZXJhdG9yVHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCkge1xuICAgICAgICBpZiAoIWFkdmFuY2VNZXRob2RQcm9wcy5pbmNsdWRlcyhwcm9wKSlcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgIGxldCBjYWNoZWRGdW5jID0gbWV0aG9kTWFwW3Byb3BdO1xuICAgICAgICBpZiAoIWNhY2hlZEZ1bmMpIHtcbiAgICAgICAgICAgIGNhY2hlZEZ1bmMgPSBtZXRob2RNYXBbcHJvcF0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGFkdmFuY2VSZXN1bHRzLnNldCh0aGlzLCBpdHRyUHJveGllZEN1cnNvclRvT3JpZ2luYWxQcm94eS5nZXQodGhpcylbcHJvcF0oLi4uYXJncykpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGVkRnVuYztcbiAgICB9LFxufTtcbmFzeW5jIGZ1bmN0aW9uKiBpdGVyYXRlKC4uLmFyZ3MpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdGhpcy1hc3NpZ25tZW50XG4gICAgbGV0IGN1cnNvciA9IHRoaXM7XG4gICAgaWYgKCEoY3Vyc29yIGluc3RhbmNlb2YgSURCQ3Vyc29yKSkge1xuICAgICAgICBjdXJzb3IgPSBhd2FpdCBjdXJzb3Iub3BlbkN1cnNvciguLi5hcmdzKTtcbiAgICB9XG4gICAgaWYgKCFjdXJzb3IpXG4gICAgICAgIHJldHVybjtcbiAgICBjdXJzb3IgPSBjdXJzb3I7XG4gICAgY29uc3QgcHJveGllZEN1cnNvciA9IG5ldyBQcm94eShjdXJzb3IsIGN1cnNvckl0ZXJhdG9yVHJhcHMpO1xuICAgIGl0dHJQcm94aWVkQ3Vyc29yVG9PcmlnaW5hbFByb3h5LnNldChwcm94aWVkQ3Vyc29yLCBjdXJzb3IpO1xuICAgIC8vIE1hcCB0aGlzIGRvdWJsZS1wcm94eSBiYWNrIHRvIHRoZSBvcmlnaW5hbCwgc28gb3RoZXIgY3Vyc29yIG1ldGhvZHMgd29yay5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb3hpZWRDdXJzb3IsIHVud3JhcChjdXJzb3IpKTtcbiAgICB3aGlsZSAoY3Vyc29yKSB7XG4gICAgICAgIHlpZWxkIHByb3hpZWRDdXJzb3I7XG4gICAgICAgIC8vIElmIG9uZSBvZiB0aGUgYWR2YW5jaW5nIG1ldGhvZHMgd2FzIG5vdCBjYWxsZWQsIGNhbGwgY29udGludWUoKS5cbiAgICAgICAgY3Vyc29yID0gYXdhaXQgKGFkdmFuY2VSZXN1bHRzLmdldChwcm94aWVkQ3Vyc29yKSB8fCBjdXJzb3IuY29udGludWUoKSk7XG4gICAgICAgIGFkdmFuY2VSZXN1bHRzLmRlbGV0ZShwcm94aWVkQ3Vyc29yKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc0l0ZXJhdG9yUHJvcCh0YXJnZXQsIHByb3ApIHtcbiAgICByZXR1cm4gKChwcm9wID09PSBTeW1ib2wuYXN5bmNJdGVyYXRvciAmJlxuICAgICAgICBpbnN0YW5jZU9mQW55KHRhcmdldCwgW0lEQkluZGV4LCBJREJPYmplY3RTdG9yZSwgSURCQ3Vyc29yXSkpIHx8XG4gICAgICAgIChwcm9wID09PSAnaXRlcmF0ZScgJiYgaW5zdGFuY2VPZkFueSh0YXJnZXQsIFtJREJJbmRleCwgSURCT2JqZWN0U3RvcmVdKSkpO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZiAoaXNJdGVyYXRvclByb3AodGFyZ2V0LCBwcm9wKSlcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRlO1xuICAgICAgICByZXR1cm4gb2xkVHJhcHMuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgIH0sXG4gICAgaGFzKHRhcmdldCwgcHJvcCkge1xuICAgICAgICByZXR1cm4gaXNJdGVyYXRvclByb3AodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5oYXModGFyZ2V0LCBwcm9wKTtcbiAgICB9LFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCLCB1bndyYXAsIHdyYXAgfTtcbiIsImltcG9ydCB7IERCU2NoZW1hLCBJREJQRGF0YWJhc2UsIG9wZW5EQiB9IGZyb20gXCJpZGJcIjtcbmltcG9ydCB7IEZhdmljb25JbmZvLCBTZXNzaW9uRGF0YSwgVGltZURhdGEsIFRpbWVMaW1pdHMsIFdhdGNoIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIEV4dGVuc2lvbkRhdGFiYXNlU2NoZW1hIGV4dGVuZHMgREJTY2hlbWEge1xuICAgdGltZWRhdGE6IHtcbiAgICAgICAga2V5OiBzdHJpbmc7XG4gICAgICAgIHZhbHVlOiBUaW1lRGF0YTtcbiAgICB9LFxuICAgIHNlc3Npb25kYXRhOiB7XG4gICAgICAgIGtleTogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogU2Vzc2lvbkRhdGE7XG4gICAgfSxcbiAgICB0aW1lbGltaXRzOiB7XG4gICAgICAgIGtleTogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogVGltZUxpbWl0cztcbiAgICAgICAgaW5kZXhlczoge1xuICAgICAgICAgICAgJ2J5LWhvc3RuYW1lJzogc3RyaW5nO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgd2F0Y2hlczoge1xuICAgICAgICBrZXk6IHN0cmluZztcbiAgICAgICAgdmFsdWU6IFdhdGNoO1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgRXh0ZW5zaW9uRGF0YWJhc2UgPSBJREJQRGF0YWJhc2U8RXh0ZW5zaW9uRGF0YWJhc2VTY2hlbWE+O1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkV4dGVuc2lvbkRhdGFiYXNlKCk6IFByb21pc2U8RXh0ZW5zaW9uRGF0YWJhc2U+IHtcbiAgICByZXR1cm4gb3BlbkRCPEV4dGVuc2lvbkRhdGFiYXNlU2NoZW1hPihcInRpbWUtZGF0YWJhc2VcIiwgMSwge1xuICAgICAgICB1cGdyYWRlKGRhdGFiYXNlKSB7XG4gICAgICAgICAgICBkYXRhYmFzZS5jcmVhdGVPYmplY3RTdG9yZShcInRpbWVkYXRhXCIsIHsga2V5UGF0aDogXCJob3N0bmFtZVwiIH0pO1xuICAgICAgICAgICAgZGF0YWJhc2UuY3JlYXRlT2JqZWN0U3RvcmUoXCJzZXNzaW9uZGF0YVwiLCB7IGtleVBhdGg6IFwiZGF5XCIgfSk7XG4gICAgXG4gICAgICAgICAgICBkYXRhYmFzZS5jcmVhdGVPYmplY3RTdG9yZShcInRpbWVsaW1pdHNcIiwgeyBrZXlQYXRoOiBcImhvc3RuYW1lXCIgfSk7XG4gICAgICAgICAgICBkYXRhYmFzZS5jcmVhdGVPYmplY3RTdG9yZShcIndhdGNoZXNcIiwgeyBrZXlQYXRoOiBcImhvc3RuYW1lXCIgfSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59IiwiY29uc3QgbGlzdCA9IFtcblx0Ly8gTmF0aXZlIEVTIGVycm9ycyBodHRwczovLzI2Mi5lY21hLWludGVybmF0aW9uYWwub3JnLzEyLjAvI3NlYy13ZWxsLWtub3duLWludHJpbnNpYy1vYmplY3RzXG5cdEV2YWxFcnJvcixcblx0UmFuZ2VFcnJvcixcblx0UmVmZXJlbmNlRXJyb3IsXG5cdFN5bnRheEVycm9yLFxuXHRUeXBlRXJyb3IsXG5cdFVSSUVycm9yLFxuXG5cdC8vIEJ1aWx0LWluIGVycm9yc1xuXHRnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbixcblxuXHQvLyBOb2RlLXNwZWNpZmljIGVycm9yc1xuXHQvLyBodHRwczovL25vZGVqcy5vcmcvYXBpL2Vycm9ycy5odG1sXG5cdGdsb2JhbFRoaXMuQXNzZXJ0aW9uRXJyb3IsXG5cdGdsb2JhbFRoaXMuU3lzdGVtRXJyb3IsXG5dXG5cdC8vIE5vbi1uYXRpdmUgRXJyb3JzIGFyZSB1c2VkIHdpdGggYGdsb2JhbFRoaXNgIGJlY2F1c2UgdGhleSBtaWdodCBiZSBtaXNzaW5nLiBUaGlzIGZpbHRlciBkcm9wcyB0aGVtIHdoZW4gdW5kZWZpbmVkLlxuXHQuZmlsdGVyKEJvb2xlYW4pXG5cdC5tYXAoXG5cdFx0Y29uc3RydWN0b3IgPT4gW2NvbnN0cnVjdG9yLm5hbWUsIGNvbnN0cnVjdG9yXSxcblx0KTtcblxuY29uc3QgZXJyb3JDb25zdHJ1Y3RvcnMgPSBuZXcgTWFwKGxpc3QpO1xuXG5leHBvcnQgZGVmYXVsdCBlcnJvckNvbnN0cnVjdG9ycztcbiIsImltcG9ydCBlcnJvckNvbnN0cnVjdG9ycyBmcm9tICcuL2Vycm9yLWNvbnN0cnVjdG9ycy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBOb25FcnJvciBleHRlbmRzIEVycm9yIHtcblx0bmFtZSA9ICdOb25FcnJvcic7XG5cblx0Y29uc3RydWN0b3IobWVzc2FnZSkge1xuXHRcdHN1cGVyKE5vbkVycm9yLl9wcmVwYXJlU3VwZXJNZXNzYWdlKG1lc3NhZ2UpKTtcblx0fVxuXG5cdHN0YXRpYyBfcHJlcGFyZVN1cGVyTWVzc2FnZShtZXNzYWdlKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHJldHVybiBTdHJpbmcobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSBbXG5cdHtcblx0XHRwcm9wZXJ0eTogJ25hbWUnLFxuXHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdtZXNzYWdlJyxcblx0XHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0fSxcblx0e1xuXHRcdHByb3BlcnR5OiAnc3RhY2snLFxuXHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdjb2RlJyxcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdjYXVzZScsXG5cdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdH0sXG5dO1xuXG5jb25zdCB0b0pzb25XYXNDYWxsZWQgPSBuZXcgV2Vha1NldCgpO1xuXG5jb25zdCB0b0pTT04gPSBmcm9tID0+IHtcblx0dG9Kc29uV2FzQ2FsbGVkLmFkZChmcm9tKTtcblx0Y29uc3QganNvbiA9IGZyb20udG9KU09OKCk7XG5cdHRvSnNvbldhc0NhbGxlZC5kZWxldGUoZnJvbSk7XG5cdHJldHVybiBqc29uO1xufTtcblxuY29uc3QgZ2V0RXJyb3JDb25zdHJ1Y3RvciA9IG5hbWUgPT4gZXJyb3JDb25zdHJ1Y3RvcnMuZ2V0KG5hbWUpID8/IEVycm9yO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuY29uc3QgZGVzdHJveUNpcmN1bGFyID0gKHtcblx0ZnJvbSxcblx0c2Vlbixcblx0dG8sXG5cdGZvcmNlRW51bWVyYWJsZSxcblx0bWF4RGVwdGgsXG5cdGRlcHRoLFxuXHR1c2VUb0pTT04sXG5cdHNlcmlhbGl6ZSxcbn0pID0+IHtcblx0aWYgKCF0bykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGZyb20pKSB7XG5cdFx0XHR0byA9IFtdO1xuXHRcdH0gZWxzZSBpZiAoIXNlcmlhbGl6ZSAmJiBpc0Vycm9yTGlrZShmcm9tKSkge1xuXHRcdFx0Y29uc3QgRXJyb3IgPSBnZXRFcnJvckNvbnN0cnVjdG9yKGZyb20ubmFtZSk7XG5cdFx0XHR0byA9IG5ldyBFcnJvcigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0byA9IHt9O1xuXHRcdH1cblx0fVxuXG5cdHNlZW4ucHVzaChmcm9tKTtcblxuXHRpZiAoZGVwdGggPj0gbWF4RGVwdGgpIHtcblx0XHRyZXR1cm4gdG87XG5cdH1cblxuXHRpZiAodXNlVG9KU09OICYmIHR5cGVvZiBmcm9tLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJyAmJiAhdG9Kc29uV2FzQ2FsbGVkLmhhcyhmcm9tKSkge1xuXHRcdHJldHVybiB0b0pTT04oZnJvbSk7XG5cdH1cblxuXHRjb25zdCBjb250aW51ZURlc3Ryb3lDaXJjdWxhciA9IHZhbHVlID0+IGRlc3Ryb3lDaXJjdWxhcih7XG5cdFx0ZnJvbTogdmFsdWUsXG5cdFx0c2VlbjogWy4uLnNlZW5dLFxuXHRcdGZvcmNlRW51bWVyYWJsZSxcblx0XHRtYXhEZXB0aCxcblx0XHRkZXB0aCxcblx0XHR1c2VUb0pTT04sXG5cdFx0c2VyaWFsaXplLFxuXHR9KTtcblxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhmcm9tKSkge1xuXHRcdGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSA9PT0gJ0J1ZmZlcicpIHtcblx0XHRcdHRvW2tleV0gPSAnW29iamVjdCBCdWZmZXJdJztcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IFVzZSBgc3RyZWFtLmlzUmVhZGFibGUoKWAgd2hlbiB0YXJnZXRpbmcgTm9kZS5qcyAxOC5cblx0XHRpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUucGlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dG9ba2V5XSA9ICdbb2JqZWN0IFN0cmVhbV0nO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG5cdFx0XHQvLyBHcmFjZWZ1bGx5IGhhbmRsZSBub24tY29uZmlndXJhYmxlIGVycm9ycyBsaWtlIGBET01FeGNlcHRpb25gLlxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9ba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSBjYXRjaCB7fVxuXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIXNlZW4uaW5jbHVkZXMoZnJvbVtrZXldKSkge1xuXHRcdFx0ZGVwdGgrKztcblx0XHRcdHRvW2tleV0gPSBjb250aW51ZURlc3Ryb3lDaXJjdWxhcihmcm9tW2tleV0pO1xuXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHR0b1trZXldID0gJ1tDaXJjdWxhcl0nO1xuXHR9XG5cblx0Zm9yIChjb25zdCB7cHJvcGVydHksIGVudW1lcmFibGV9IG9mIGNvbW1vblByb3BlcnRpZXMpIHtcblx0XHRpZiAodHlwZW9mIGZyb21bcHJvcGVydHldICE9PSAndW5kZWZpbmVkJyAmJiBmcm9tW3Byb3BlcnR5XSAhPT0gbnVsbCkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBwcm9wZXJ0eSwge1xuXHRcdFx0XHR2YWx1ZTogaXNFcnJvckxpa2UoZnJvbVtwcm9wZXJ0eV0pID8gY29udGludWVEZXN0cm95Q2lyY3VsYXIoZnJvbVtwcm9wZXJ0eV0pIDogZnJvbVtwcm9wZXJ0eV0sXG5cdFx0XHRcdGVudW1lcmFibGU6IGZvcmNlRW51bWVyYWJsZSA/IHRydWUgOiBlbnVtZXJhYmxlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKHZhbHVlLCBvcHRpb25zID0ge30pIHtcblx0Y29uc3Qge1xuXHRcdG1heERlcHRoID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuXHRcdHVzZVRvSlNPTiA9IHRydWUsXG5cdH0gPSBvcHRpb25zO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0cmV0dXJuIGRlc3Ryb3lDaXJjdWxhcih7XG5cdFx0XHRmcm9tOiB2YWx1ZSxcblx0XHRcdHNlZW46IFtdLFxuXHRcdFx0Zm9yY2VFbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0bWF4RGVwdGgsXG5cdFx0XHRkZXB0aDogMCxcblx0XHRcdHVzZVRvSlNPTixcblx0XHRcdHNlcmlhbGl6ZTogdHJ1ZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIFBlb3BsZSBzb21ldGltZXMgdGhyb3cgdGhpbmdzIGJlc2lkZXMgRXJyb3Igb2JqZWN0c+KAplxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gYEpTT04uc3RyaW5naWZ5KClgIGRpc2NhcmRzIGZ1bmN0aW9ucy4gV2UgZG8gdG9vLCB1bmxlc3MgYSBmdW5jdGlvbiBpcyB0aHJvd24gZGlyZWN0bHkuXG5cdFx0Ly8gV2UgaW50ZW50aW9uYWxseSB1c2UgYHx8YCBiZWNhdXNlIGAubmFtZWAgaXMgYW4gZW1wdHkgc3RyaW5nIGZvciBhbm9ueW1vdXMgZnVuY3Rpb25zLlxuXHRcdHJldHVybiBgW0Z1bmN0aW9uOiAke3ZhbHVlLm5hbWUgfHwgJ2Fub255bW91cyd9XWA7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXNlcmlhbGl6ZUVycm9yKHZhbHVlLCBvcHRpb25zID0ge30pIHtcblx0Y29uc3Qge21heERlcHRoID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSA9IG9wdGlvbnM7XG5cblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRpZiAoaXNNaW5pbXVtVmlhYmxlU2VyaWFsaXplZEVycm9yKHZhbHVlKSkge1xuXHRcdGNvbnN0IEVycm9yID0gZ2V0RXJyb3JDb25zdHJ1Y3Rvcih2YWx1ZS5uYW1lKTtcblx0XHRyZXR1cm4gZGVzdHJveUNpcmN1bGFyKHtcblx0XHRcdGZyb206IHZhbHVlLFxuXHRcdFx0c2VlbjogW10sXG5cdFx0XHR0bzogbmV3IEVycm9yKCksXG5cdFx0XHRtYXhEZXB0aCxcblx0XHRcdGRlcHRoOiAwLFxuXHRcdFx0c2VyaWFsaXplOiBmYWxzZSxcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBuZXcgTm9uRXJyb3IodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcnJvckxpa2UodmFsdWUpIHtcblx0cmV0dXJuIEJvb2xlYW4odmFsdWUpXG5cdCYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblx0JiYgJ25hbWUnIGluIHZhbHVlXG5cdCYmICdtZXNzYWdlJyBpbiB2YWx1ZVxuXHQmJiAnc3RhY2snIGluIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc01pbmltdW1WaWFibGVTZXJpYWxpemVkRXJyb3IodmFsdWUpIHtcblx0cmV0dXJuIEJvb2xlYW4odmFsdWUpXG5cdCYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblx0JiYgJ21lc3NhZ2UnIGluIHZhbHVlXG5cdCYmICFBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuZXhwb3J0IHtkZWZhdWx0IGFzIGVycm9yQ29uc3RydWN0b3JzfSBmcm9tICcuL2Vycm9yLWNvbnN0cnVjdG9ycy5qcyc7XG4iLCJ2YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZGVmUHJvcHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbnZhciBfX2dldE93blByb3BEZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xudmFyIF9fZ2V0T3duUHJvcFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19wcm9wSXNFbnVtID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBfX2RlZk5vcm1hbFByb3AgPSAob2JqLCBrZXksIHZhbHVlKSA9PiBrZXkgaW4gb2JqID8gX19kZWZQcm9wKG9iaiwga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlIH0pIDogb2JqW2tleV0gPSB2YWx1ZTtcbnZhciBfX3NwcmVhZFZhbHVlcyA9IChhLCBiKSA9PiB7XG4gIGZvciAodmFyIHByb3AgaW4gYiB8fCAoYiA9IHt9KSlcbiAgICBpZiAoX19oYXNPd25Qcm9wLmNhbGwoYiwgcHJvcCkpXG4gICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gIGlmIChfX2dldE93blByb3BTeW1ib2xzKVxuICAgIGZvciAodmFyIHByb3Agb2YgX19nZXRPd25Qcm9wU3ltYm9scyhiKSkge1xuICAgICAgaWYgKF9fcHJvcElzRW51bS5jYWxsKGIsIHByb3ApKVxuICAgICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gICAgfVxuICByZXR1cm4gYTtcbn07XG52YXIgX19zcHJlYWRQcm9wcyA9IChhLCBiKSA9PiBfX2RlZlByb3BzKGEsIF9fZ2V0T3duUHJvcERlc2NzKGIpKTtcbnZhciBfX29ialJlc3QgPSAoc291cmNlLCBleGNsdWRlKSA9PiB7XG4gIHZhciB0YXJnZXQgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpXG4gICAgaWYgKF9faGFzT3duUHJvcC5jYWxsKHNvdXJjZSwgcHJvcCkgJiYgZXhjbHVkZS5pbmRleE9mKHByb3ApIDwgMClcbiAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgaWYgKHNvdXJjZSAhPSBudWxsICYmIF9fZ2V0T3duUHJvcFN5bWJvbHMpXG4gICAgZm9yICh2YXIgcHJvcCBvZiBfX2dldE93blByb3BTeW1ib2xzKHNvdXJjZSkpIHtcbiAgICAgIGlmIChleGNsdWRlLmluZGV4T2YocHJvcCkgPCAwICYmIF9fcHJvcElzRW51bS5jYWxsKHNvdXJjZSwgcHJvcCkpXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xudmFyIF9fYXN5bmMgPSAoX190aGlzLCBfX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdmFyIGZ1bGZpbGxlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVqZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yLnRocm93KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzdGVwID0gKHgpID0+IHguZG9uZSA/IHJlc29sdmUoeC52YWx1ZSkgOiBQcm9taXNlLnJlc29sdmUoeC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTtcbiAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkoX190aGlzLCBfX2FyZ3VtZW50cykpLm5leHQoKSk7XG4gIH0pO1xufTtcblxuLy8gc3JjL2dlbmVyaWMudHNcbmltcG9ydCB7IHNlcmlhbGl6ZUVycm9yLCBkZXNlcmlhbGl6ZUVycm9yIH0gZnJvbSBcInNlcmlhbGl6ZS1lcnJvclwiO1xuZnVuY3Rpb24gZGVmaW5lR2VuZXJpY01lc3NhbmdpbmcoY29uZmlnKSB7XG4gIGxldCByZW1vdmVSb290TGlzdGVuZXI7XG4gIGxldCBwZXJUeXBlTGlzdGVuZXJzID0ge307XG4gIGZ1bmN0aW9uIGNsZWFudXBSb290TGlzdGVuZXIoKSB7XG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKHBlclR5cGVMaXN0ZW5lcnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmVtb3ZlUm9vdExpc3RlbmVyID09IG51bGwgPyB2b2lkIDAgOiByZW1vdmVSb290TGlzdGVuZXIoKTtcbiAgICAgIHJlbW92ZVJvb3RMaXN0ZW5lciA9IHZvaWQgMDtcbiAgICB9XG4gIH1cbiAgbGV0IGlkU2VxID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU0KTtcbiAgZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICAgIHJldHVybiBpZFNlcSsrO1xuICB9XG4gIHJldHVybiB7XG4gICAgc2VuZE1lc3NhZ2UodHlwZSwgZGF0YSwgLi4uYXJncykge1xuICAgICAgcmV0dXJuIF9fYXN5bmModGhpcywgbnVsbCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hMiwgX2IsIF9jLCBfZDtcbiAgICAgICAgY29uc3QgX21lc3NhZ2UgPSB7XG4gICAgICAgICAgaWQ6IGdldE5leHRJZCgpLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IChfYiA9IHlpZWxkIChfYTIgPSBjb25maWcudmVyaWZ5TWVzc2FnZURhdGEpID09IG51bGwgPyB2b2lkIDAgOiBfYTIuY2FsbChjb25maWcsIF9tZXNzYWdlKSkgIT0gbnVsbCA/IF9iIDogX21lc3NhZ2U7XG4gICAgICAgIChfYyA9IGNvbmZpZy5sb2dnZXIpID09IG51bGwgPyB2b2lkIDAgOiBfYy5kZWJ1ZyhgW21lc3NhZ2luZ10gc2VuZE1lc3NhZ2Uge2lkPSR7bWVzc2FnZS5pZH19IFxcdTI1MDBcXHUxNDA1YCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgY29uZmlnLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBjb25zdCB7IHJlcywgZXJyIH0gPSByZXNwb25zZSAhPSBudWxsID8gcmVzcG9uc2UgOiB7IGVycjogbmV3IEVycm9yKFwiTm8gcmVzcG9uc2VcIikgfTtcbiAgICAgICAgKF9kID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9kLmRlYnVnKGBbbWVzc2FnaW5nXSBzZW5kTWVzc2FnZSB7aWQ9JHttZXNzYWdlLmlkfX0gXFx1MTQwQVxcdTI1MDBgLCB7IHJlcywgZXJyIH0pO1xuICAgICAgICBpZiAoZXJyICE9IG51bGwpXG4gICAgICAgICAgdGhyb3cgZGVzZXJpYWxpemVFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbk1lc3NhZ2UodHlwZSwgb25SZWNlaXZlZCkge1xuICAgICAgdmFyIF9hMiwgX2IsIF9jO1xuICAgICAgaWYgKHJlbW92ZVJvb3RMaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgIChfYTIgPSBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2EyLmRlYnVnKFxuICAgICAgICAgIGBbbWVzc2FnaW5nXSBcIiR7dHlwZX1cIiBpbml0aWFsaXplZCB0aGUgbWVzc2FnZSBsaXN0ZW5lciBmb3IgdGhpcyBjb250ZXh0YFxuICAgICAgICApO1xuICAgICAgICByZW1vdmVSb290TGlzdGVuZXIgPSBjb25maWcuYWRkUm9vdExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgdmFyIF9hMywgX2IyO1xuICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS50eXBlICE9IFwic3RyaW5nXCIgfHwgdHlwZW9mIG1lc3NhZ2UudGltZXN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmJyZWFrRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIGBbbWVzc2FnaW5nXSBVbmtub3duIG1lc3NhZ2UgZm9ybWF0LCBtdXN0IGluY2x1ZGUgdGhlICd0eXBlJyAmICd0aW1lc3RhbXAnIGZpZWxkcywgcmVjZWl2ZWQ6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICApfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAoX2EzID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9hMy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICAoX2IyID0gY29uZmlnID09IG51bGwgPyB2b2lkIDAgOiBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2IyLmRlYnVnKFwiW21lc3NhZ2luZ10gUmVjZWl2ZWQgbWVzc2FnZVwiLCBtZXNzYWdlKTtcbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHBlclR5cGVMaXN0ZW5lcnNbbWVzc2FnZS50eXBlXTtcbiAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjb25zdCByZXMgPSBsaXN0ZW5lcihtZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcykudGhlbigocmVzMikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hNCwgX2IzO1xuICAgICAgICAgICAgcmV0dXJuIChfYjMgPSAoX2E0ID0gY29uZmlnLnZlcmlmeU1lc3NhZ2VEYXRhKSA9PSBudWxsID8gdm9pZCAwIDogX2E0LmNhbGwoY29uZmlnLCByZXMyKSkgIT0gbnVsbCA/IF9iMyA6IHJlczI7XG4gICAgICAgICAgfSkudGhlbigocmVzMikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hNDtcbiAgICAgICAgICAgIChfYTQgPSBjb25maWcgPT0gbnVsbCA/IHZvaWQgMCA6IGNvbmZpZy5sb2dnZXIpID09IG51bGwgPyB2b2lkIDAgOiBfYTQuZGVidWcoYFttZXNzYWdpbmddIG9uTWVzc2FnZSB7aWQ9JHttZXNzYWdlLmlkfX0gXFx1MjUwMFxcdTE0MDVgLCB7IHJlczogcmVzMiB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IHJlczogcmVzMiB9O1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTQ7XG4gICAgICAgICAgICAoX2E0ID0gY29uZmlnID09IG51bGwgPyB2b2lkIDAgOiBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2E0LmRlYnVnKGBbbWVzc2FnaW5nXSBvbk1lc3NhZ2Uge2lkPSR7bWVzc2FnZS5pZH19IFxcdTI1MDBcXHUxNDA1YCwgeyBlcnIgfSk7XG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IHNlcmlhbGl6ZUVycm9yKGVycikgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAocGVyVHlwZUxpc3RlbmVyc1t0eXBlXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVyciA9IEVycm9yKFxuICAgICAgICAgIGBbbWVzc2FnaW5nXSBJbiB0aGlzIEpTIGNvbnRleHQsIG9ubHkgb25lIGxpc3RlbmVyIGNhbiBiZSBzZXR1cCBmb3IgJHt0eXBlfWBcbiAgICAgICAgKTtcbiAgICAgICAgKF9iID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9iLmVycm9yKGVycik7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICAgIHBlclR5cGVMaXN0ZW5lcnNbdHlwZV0gPSBvblJlY2VpdmVkO1xuICAgICAgKF9jID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9jLmxvZyhgW21lc3NhZ2luZ10gQWRkZWQgbGlzdGVuZXIgZm9yICR7dHlwZX1gKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBwZXJUeXBlTGlzdGVuZXJzW3R5cGVdO1xuICAgICAgICBjbGVhbnVwUm9vdExpc3RlbmVyKCk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzKCkge1xuICAgICAgT2JqZWN0LmtleXMocGVyVHlwZUxpc3RlbmVycykuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBkZWxldGUgcGVyVHlwZUxpc3RlbmVyc1t0eXBlXTtcbiAgICAgIH0pO1xuICAgICAgY2xlYW51cFJvb3RMaXN0ZW5lcigpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgX19zcHJlYWRWYWx1ZXMsXG4gIF9fc3ByZWFkUHJvcHMsXG4gIF9fb2JqUmVzdCxcbiAgX19hc3luYyxcbiAgZGVmaW5lR2VuZXJpY01lc3Nhbmdpbmdcbn07XG4iLCJpbXBvcnQge1xuICBfX3NwcmVhZFByb3BzLFxuICBfX3NwcmVhZFZhbHVlcyxcbiAgZGVmaW5lR2VuZXJpY01lc3Nhbmdpbmdcbn0gZnJvbSBcIi4vY2h1bmstQlFMRlNGRlouanNcIjtcblxuLy8gc3JjL2V4dGVuc2lvbi50c1xuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuZnVuY3Rpb24gZGVmaW5lRXh0ZW5zaW9uTWVzc2FnaW5nKGNvbmZpZykge1xuICByZXR1cm4gZGVmaW5lR2VuZXJpY01lc3NhbmdpbmcoX19zcHJlYWRQcm9wcyhfX3NwcmVhZFZhbHVlcyh7fSwgY29uZmlnKSwge1xuICAgIHNlbmRNZXNzYWdlKG1lc3NhZ2UsIHRhYklkKSB7XG4gICAgICBpZiAodGFiSWQgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIEJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgIHJldHVybiBCcm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UpO1xuICAgIH0sXG4gICAgYWRkUm9vdExpc3RlbmVyKHByb2Nlc3NNZXNzYWdlKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IChtZXNzYWdlLCBzZW5kZXIpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiKVxuICAgICAgICAgIHJldHVybiBwcm9jZXNzTWVzc2FnZShfX3NwcmVhZFByb3BzKF9fc3ByZWFkVmFsdWVzKHt9LCBtZXNzYWdlKSwgeyBzZW5kZXIgfSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgfTtcbiAgICAgIEJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IEJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIH1cbiAgfSkpO1xufVxuZXhwb3J0IHtcbiAgZGVmaW5lRXh0ZW5zaW9uTWVzc2FnaW5nXG59O1xuIiwiLyohXG4gKiBpc29iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXNvYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkodmFsKSA9PT0gZmFsc2U7XG59O1xuIiwiLyohXG4gKiBnZXQtdmFsdWUgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2dldC12YWx1ZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxOCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuY29uc3QgaXNPYmplY3QgPSByZXF1aXJlKCdpc29iamVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgcGF0aCwgb3B0aW9ucykge1xuICBpZiAoIWlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgb3B0aW9ucyA9IHsgZGVmYXVsdDogb3B0aW9ucyB9O1xuICB9XG5cbiAgaWYgKCFpc1ZhbGlkT2JqZWN0KHRhcmdldCkpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMuZGVmYXVsdCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmRlZmF1bHQgOiB0YXJnZXQ7XG4gIH1cblxuICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgcGF0aCA9IFN0cmluZyhwYXRoKTtcbiAgfVxuXG4gIGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHBhdGgpO1xuICBjb25zdCBpc1N0cmluZyA9IHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJztcbiAgY29uc3Qgc3BsaXRDaGFyID0gb3B0aW9ucy5zZXBhcmF0b3IgfHwgJy4nO1xuICBjb25zdCBqb2luQ2hhciA9IG9wdGlvbnMuam9pbkNoYXIgfHwgKHR5cGVvZiBzcGxpdENoYXIgPT09ICdzdHJpbmcnID8gc3BsaXRDaGFyIDogJy4nKTtcblxuICBpZiAoIWlzU3RyaW5nICYmICFpc0FycmF5KSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyAmJiBwYXRoIGluIHRhcmdldCkge1xuICAgIHJldHVybiBpc1ZhbGlkKHBhdGgsIHRhcmdldCwgb3B0aW9ucykgPyB0YXJnZXRbcGF0aF0gOiBvcHRpb25zLmRlZmF1bHQ7XG4gIH1cblxuICBsZXQgc2VncyA9IGlzQXJyYXkgPyBwYXRoIDogc3BsaXQocGF0aCwgc3BsaXRDaGFyLCBvcHRpb25zKTtcbiAgbGV0IGxlbiA9IHNlZ3MubGVuZ3RoO1xuICBsZXQgaWR4ID0gMDtcblxuICBkbyB7XG4gICAgbGV0IHByb3AgPSBzZWdzW2lkeF07XG4gICAgaWYgKHR5cGVvZiBwcm9wID09PSAnbnVtYmVyJykge1xuICAgICAgcHJvcCA9IFN0cmluZyhwcm9wKTtcbiAgICB9XG5cbiAgICB3aGlsZSAocHJvcCAmJiBwcm9wLnNsaWNlKC0xKSA9PT0gJ1xcXFwnKSB7XG4gICAgICBwcm9wID0gam9pbihbcHJvcC5zbGljZSgwLCAtMSksIHNlZ3NbKytpZHhdIHx8ICcnXSwgam9pbkNoYXIsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChwcm9wIGluIHRhcmdldCkge1xuICAgICAgaWYgKCFpc1ZhbGlkKHByb3AsIHRhcmdldCwgb3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGVmYXVsdDtcbiAgICAgIH1cblxuICAgICAgdGFyZ2V0ID0gdGFyZ2V0W3Byb3BdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaGFzUHJvcCA9IGZhbHNlO1xuICAgICAgbGV0IG4gPSBpZHggKyAxO1xuXG4gICAgICB3aGlsZSAobiA8IGxlbikge1xuICAgICAgICBwcm9wID0gam9pbihbcHJvcCwgc2Vnc1tuKytdXSwgam9pbkNoYXIsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICgoaGFzUHJvcCA9IHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgIGlmICghaXNWYWxpZChwcm9wLCB0YXJnZXQsIG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5kZWZhdWx0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHRhcmdldFtwcm9wXTtcbiAgICAgICAgICBpZHggPSBuIC0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWhhc1Byb3ApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGVmYXVsdDtcbiAgICAgIH1cbiAgICB9XG4gIH0gd2hpbGUgKCsraWR4IDwgbGVuICYmIGlzVmFsaWRPYmplY3QodGFyZ2V0KSk7XG5cbiAgaWYgKGlkeCA9PT0gbGVuKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zLmRlZmF1bHQ7XG59O1xuXG5mdW5jdGlvbiBqb2luKHNlZ3MsIGpvaW5DaGFyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5qb2luID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuam9pbihzZWdzKTtcbiAgfVxuICByZXR1cm4gc2Vnc1swXSArIGpvaW5DaGFyICsgc2Vnc1sxXTtcbn1cblxuZnVuY3Rpb24gc3BsaXQocGF0aCwgc3BsaXRDaGFyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5zcGxpdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBvcHRpb25zLnNwbGl0KHBhdGgpO1xuICB9XG4gIHJldHVybiBwYXRoLnNwbGl0KHNwbGl0Q2hhcik7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWQoa2V5LCB0YXJnZXQsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmlzVmFsaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5pc1ZhbGlkKGtleSwgdGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZE9iamVjdCh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgfHwgQXJyYXkuaXNBcnJheSh2YWwpIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbic7XG59XG4iLCJ2YXIgX19hc3luYyA9IChfX3RoaXMsIF9fYXJndW1lbnRzLCBnZW5lcmF0b3IpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB2YXIgZnVsZmlsbGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciByZWplY3RlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcChnZW5lcmF0b3IudGhyb3codmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHN0ZXAgPSAoeCkgPT4geC5kb25lID8gcmVzb2x2ZSh4LnZhbHVlKSA6IFByb21pc2UucmVzb2x2ZSh4LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpO1xuICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseShfX3RoaXMsIF9fYXJndW1lbnRzKSkubmV4dCgpKTtcbiAgfSk7XG59O1xuXG4vLyBzcmMvaXNCYWNrZ3JvdW5kLnRzXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5mdW5jdGlvbiBpc0JhY2tncm91bmQoKSB7XG4gIGlmICghY2FuQWNjZXNzRXh0ZW5zaW9uQXBpKCkpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBtYW5pZmVzdCA9IEJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpO1xuICBpZiAoIW1hbmlmZXN0LmJhY2tncm91bmQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gbWFuaWZlc3QubWFuaWZlc3RfdmVyc2lvbiA9PT0gMyA/IGlzQmFja2dyb3VuZFNlcnZpY2VXb3JrZXIoKSA6IGlzQmFja2dyb3VuZFBhZ2UoKTtcbn1cbmZ1bmN0aW9uIGNhbkFjY2Vzc0V4dGVuc2lvbkFwaSgpIHtcbiAgdmFyIF9hO1xuICByZXR1cm4gISEoKF9hID0gQnJvd3Nlci5ydW50aW1lKSA9PSBudWxsID8gdm9pZCAwIDogX2EuaWQpO1xufVxudmFyIEtOT1dOX0JBQ0tHUk9VTkRfUEFHRV9QQVRITkFNRVMgPSBbXG4gIC8vIEZpcmVmb3hcbiAgXCIvX2dlbmVyYXRlZF9iYWNrZ3JvdW5kX3BhZ2UuaHRtbFwiXG5dO1xuZnVuY3Rpb24gaXNCYWNrZ3JvdW5kUGFnZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgS05PV05fQkFDS0dST1VORF9QQUdFX1BBVEhOQU1FUy5pbmNsdWRlcyhsb2NhdGlvbi5wYXRobmFtZSk7XG59XG5mdW5jdGlvbiBpc0JhY2tncm91bmRTZXJ2aWNlV29ya2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIjtcbn1cblxuLy8gc3JjL2RlZmluZVByb3h5U2VydmljZS50c1xuaW1wb3J0IHsgZGVmaW5lRXh0ZW5zaW9uTWVzc2FnaW5nIH0gZnJvbSBcIkB3ZWJleHQtY29yZS9tZXNzYWdpbmdcIjtcbmltcG9ydCBnZXQgZnJvbSBcImdldC12YWx1ZVwiO1xuZnVuY3Rpb24gZGVmaW5lUHJveHlTZXJ2aWNlKG5hbWUsIGluaXQsIGNvbmZpZykge1xuICBsZXQgc2VydmljZTtcbiAgY29uc3QgbWVzc2FnZUtleSA9IGBwcm94eS1zZXJ2aWNlLiR7bmFtZX1gO1xuICBjb25zdCB7IG9uTWVzc2FnZSwgc2VuZE1lc3NhZ2UgfSA9IGRlZmluZUV4dGVuc2lvbk1lc3NhZ2luZyhjb25maWcpO1xuICBmdW5jdGlvbiBjcmVhdGVQcm94eShwYXRoKSB7XG4gICAgY29uc3Qgd3JhcHBlZCA9ICgpID0+IHtcbiAgICB9O1xuICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHdyYXBwZWQsIHtcbiAgICAgIC8vIEV4ZWN1dGVkIHdoZW4gdGhlIG9iamVjdCBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvblxuICAgICAgYXBwbHkoX3RhcmdldCwgX3RoaXNBcmcsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIF9fYXN5bmModGhpcywgbnVsbCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBzZW5kTWVzc2FnZShtZXNzYWdlS2V5LCB7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgYXJnc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIC8vIEV4ZWN1dGVkIHdoZW4gYWNjZXNzaW5nIGEgcHJvcGVydHkgb24gYW4gb2JqZWN0XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IFwiX19wcm94eVwiIHx8IHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHJlY2VpdmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlUHJveHkocGF0aCA9PSBudWxsID8gcHJvcGVydHlOYW1lIDogYCR7cGF0aH0uJHtwcm9wZXJ0eU5hbWV9YCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJveHkuX19wcm94eSA9IHRydWU7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG4gIHJldHVybiBbXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKC4uLmFyZ3MpIHtcbiAgICAgIHNlcnZpY2UgPSBpbml0KC4uLmFyZ3MpO1xuICAgICAgb25NZXNzYWdlKG1lc3NhZ2VLZXksICh7IGRhdGEgfSkgPT4ge1xuICAgICAgICBjb25zdCBtZXRob2QgPSBkYXRhLnBhdGggPT0gbnVsbCA/IHNlcnZpY2UgOiBnZXQoc2VydmljZSAhPSBudWxsID8gc2VydmljZSA6IHt9LCBkYXRhLnBhdGgpO1xuICAgICAgICBpZiAobWV0aG9kKVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobWV0aG9kLmJpbmQoc2VydmljZSkoLi4uZGF0YS5hcmdzKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gZ2V0U2VydmljZSgpIHtcbiAgICAgIGlmICghaXNCYWNrZ3JvdW5kKCkpXG4gICAgICAgIHJldHVybiBjcmVhdGVQcm94eSgpO1xuICAgICAgaWYgKHNlcnZpY2UgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgRmFpbGVkIHRvIGdldCBhbiBpbnN0YW5jZSBvZiAke25hbWV9OiBpbiBiYWNrZ3JvdW5kLCBidXQgcmVnaXN0ZXJTZXJ2aWNlIGhhcyBub3QgYmVlbiBjYWxsZWQuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgcmVnaXN0ZXJTZXJ2aWNlP2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbiAgXTtcbn1cblxuLy8gc3JjL2ZsYXR0ZW5Qcm9taXNlLnRzXG5pbXBvcnQgZ2V0MiBmcm9tIFwiZ2V0LXZhbHVlXCI7XG5mdW5jdGlvbiBmbGF0dGVuUHJvbWlzZShwcm9taXNlKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZVByb3h5KGxvY2F0aW9uMikge1xuICAgIGNvbnN0IHdyYXBwZWQgPSAoKSA9PiB7XG4gICAgfTtcbiAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh3cmFwcGVkLCB7XG4gICAgICBhcHBseShfdGFyZ2V0LCBfdGhpc0FyZywgYXJncykge1xuICAgICAgICByZXR1cm4gX19hc3luYyh0aGlzLCBudWxsLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIGNvbnN0IHQgPSB5aWVsZCBwcm9taXNlO1xuICAgICAgICAgIGNvbnN0IHRoaXNBcmcgPSAobG9jYXRpb24yID09IG51bGwgPyB2b2lkIDAgOiBsb2NhdGlvbjIucGFyZW50UGF0aCkgPyBnZXQyKHQsIGxvY2F0aW9uMi5wYXJlbnRQYXRoKSA6IHQ7XG4gICAgICAgICAgY29uc3QgZm4gPSBsb2NhdGlvbjIgPyBnZXQyKHQsIGxvY2F0aW9uMi5wcm9wZXJ0eVBhdGgpIDogdDtcbiAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIC8vIEV4ZWN1dGVkIHdoZW4gYWNjZXNzaW5nIGEgcHJvcGVydHkgb24gYW4gb2JqZWN0XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IFwiX19wcm94eVwiIHx8IHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHJlY2VpdmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlUHJveHkoe1xuICAgICAgICAgIHByb3BlcnR5UGF0aDogbG9jYXRpb24yID09IG51bGwgPyBwcm9wZXJ0eU5hbWUgOiBgJHtsb2NhdGlvbjIucHJvcGVydHlQYXRofS4ke3Byb3BlcnR5TmFtZX1gLFxuICAgICAgICAgIHBhcmVudFBhdGg6IGxvY2F0aW9uMiA9PSBudWxsID8gdm9pZCAwIDogbG9jYXRpb24yLnByb3BlcnR5UGF0aFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm94eS5fX3Byb3h5ID0gdHJ1ZTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVByb3h5KCk7XG59XG5leHBvcnQge1xuICBkZWZpbmVQcm94eVNlcnZpY2UsXG4gIGZsYXR0ZW5Qcm9taXNlXG59O1xuIiwiaW1wb3J0IHsgZGVmaW5lUHJveHlTZXJ2aWNlIH0gZnJvbSBcIkB3ZWJleHQtY29yZS9wcm94eS1zZXJ2aWNlXCI7XG5pbXBvcnQgdHlwZSB7IFRpbWVEYXRhIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRXh0ZW5zaW9uRGF0YWJhc2UgfSBmcm9tIFwiLi9kYXRhYmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVEYXRhU2VydmljZSB7XG4gICAgZ2V0QWxsKCk6IFByb21pc2U8VGltZURhdGFbXT47XG4gICAgZ2V0TGFzdChob3N0bmFtZTogc3RyaW5nKTogUHJvbWlzZTxUaW1lRGF0YSB8IHVuZGVmaW5lZD47XG4gICAgZ2V0QWxsQnlEYXkoZGF5OiBzdHJpbmcpOiBQcm9taXNlPFRpbWVEYXRhW10+O1xuICAgIGdldEZpcnN0T2ZEYXkoZGF5OiBzdHJpbmcsIGhvc3RuYW1lOiBzdHJpbmcpOiBQcm9taXNlPFRpbWVEYXRhIHwgdW5kZWZpbmVkPjtcbiAgICBnZXQoaG9zdG5hbWU6IHN0cmluZywgZGF5OiBzdHJpbmcpOiBQcm9taXNlPFRpbWVEYXRhIHwgdW5kZWZpbmVkPjtcbiAgICBjcmVhdGUoaW5mbzogVGltZURhdGEpOiBQcm9taXNlPHZvaWQ+O1xuICAgIHVwZGF0ZShpbmZvOiBUaW1lRGF0YSk6IFByb21pc2U8dm9pZD47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbWVkYXRhU2VydmljZShfZGI6IFByb21pc2U8RXh0ZW5zaW9uRGF0YWJhc2U+KTogVGltZURhdGFTZXJ2aWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3luYyBnZXRBbGwoKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBkYi5nZXRBbGwoXCJ0aW1lZGF0YVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0QWxsQnlEYXkoZGF5OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuICAgICAgICAgICAgY29uc3QgdGltZURhdGFBcnIgPSBhd2FpdCBkYi5nZXRBbGwoXCJ0aW1lZGF0YVwiKVxuICAgICAgICAgICAgY29uc3QgZGF5RGF0YSA9IHRpbWVEYXRhQXJyLmZpbHRlcigodGltZURhdGEpID0+IHRpbWVEYXRhLmRheSA9PT0gZGF5KVxuXG4gICAgICAgICAgICByZXR1cm4gZGF5RGF0YTsgXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldEZpcnN0T2ZEYXkoZGF5OiBzdHJpbmcsIGhvc3RuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuICAgICAgICAgICAgY29uc3QgdGltZURhdGFBcnIgPSBhd2FpdCBkYi5nZXRBbGwoXCJ0aW1lZGF0YVwiKVxuICAgICAgICAgICAgdGltZURhdGFBcnIuZmlsdGVyKCh0aW1lRGF0YSkgPT4gdGltZURhdGEuZGF5ID09PSBkYXkgJiYgdGltZURhdGEuaG9zdG5hbWUgPT09IGhvc3RuYW1lKVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRpbWVEYXRhQXJyWzBdO1xuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXRMYXN0KGhvc3RuYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVEYXRhQXJyID0gYXdhaXQgZGIuZ2V0QWxsKFwidGltZWRhdGFcIik7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGltZURhdGFBcnIuZmlsdGVyKCh0aW1lRGF0YSkgPT4gdGltZURhdGEuaG9zdG5hbWUgPT09IGhvc3RuYW1lKVxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbZGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0KGhvc3RuYW1lOiBzdHJpbmcsIGRheTogc3RyaW5nKSB7IFxuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gYXdhaXQgZGIuZ2V0QWxsKFwidGltZWRhdGFcIilcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkID0gbGlzdC5maWx0ZXIoKHRpbWVEYXRhKSA9PiB0aW1lRGF0YS5kYXkgPT09IGRheSAmJiB0aW1lRGF0YS5ob3N0bmFtZSA9PT0gaG9zdG5hbWUpXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWRbMF07XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGNyZWF0ZShpbmZvKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoYXdhaXQgZGIuZ2V0KFwidGltZWRhdGFcIiwgaW5mby5ob3N0bmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRiLnB1dChcInRpbWVkYXRhXCIsIGluZm8pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRiLmFkZChcInRpbWVkYXRhXCIsIGluZm8pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgYXN5bmMgdXBkYXRlKGluZm8pIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuICAgICAgICAgICAgYXdhaXQgZGIucHV0KFwidGltZWRhdGFcIiwgaW5mbyk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFtyZWdpc3RlclRpbWVkYXRhU2VydmljZSwgZ2V0VGltZWRhdGFTZXJ2aWNlXSA9IGRlZmluZVByb3h5U2VydmljZShcbiAgICBcInRpbWVkYXRhLXNlcnZpY2VcIixcbiAgICBjcmVhdGVUaW1lZGF0YVNlcnZpY2UsXG4pOyIsIi8vIHNyYy9jb3JlL3V0aWxzL2FycmF5cy50c1xuZnVuY3Rpb24gZXZlcnkoYXJyYXksIHByZWRpY2F0ZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxuICAgIGlmICghcHJlZGljYXRlKGFycmF5W2ldLCBpKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaV0sIGkpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gdG9BcnJheShhKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGEpID8gYSA6IFthXTtcbn1cblxuZXhwb3J0IHtcbiAgZXZlcnksXG4gIHNvbWUsXG4gIHRvQXJyYXlcbn07XG4iLCJ2YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlcXVhbChmb28sIGJhcikge1xuXHR2YXIgY3RvciwgbGVuO1xuXHRpZiAoZm9vID09PSBiYXIpIHJldHVybiB0cnVlO1xuXG5cdGlmIChmb28gJiYgYmFyICYmIChjdG9yPWZvby5jb25zdHJ1Y3RvcikgPT09IGJhci5jb25zdHJ1Y3Rvcikge1xuXHRcdGlmIChjdG9yID09PSBEYXRlKSByZXR1cm4gZm9vLmdldFRpbWUoKSA9PT0gYmFyLmdldFRpbWUoKTtcblx0XHRpZiAoY3RvciA9PT0gUmVnRXhwKSByZXR1cm4gZm9vLnRvU3RyaW5nKCkgPT09IGJhci50b1N0cmluZygpO1xuXG5cdFx0aWYgKGN0b3IgPT09IEFycmF5KSB7XG5cdFx0XHRpZiAoKGxlbj1mb28ubGVuZ3RoKSA9PT0gYmFyLmxlbmd0aCkge1xuXHRcdFx0XHR3aGlsZSAobGVuLS0gJiYgZGVxdWFsKGZvb1tsZW5dLCBiYXJbbGVuXSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxlbiA9PT0gLTE7XG5cdFx0fVxuXG5cdFx0aWYgKCFjdG9yIHx8IHR5cGVvZiBmb28gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRsZW4gPSAwO1xuXHRcdFx0Zm9yIChjdG9yIGluIGZvbykge1xuXHRcdFx0XHRpZiAoaGFzLmNhbGwoZm9vLCBjdG9yKSAmJiArK2xlbiAmJiAhaGFzLmNhbGwoYmFyLCBjdG9yKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoIShjdG9yIGluIGJhcikgfHwgIWRlcXVhbChmb29bY3Rvcl0sIGJhcltjdG9yXSkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhiYXIpLmxlbmd0aCA9PT0gbGVuO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmb28gIT09IGZvbyAmJiBiYXIgIT09IGJhcjtcbn1cbiIsImltcG9ydCB7XG4gIHRvQXJyYXlcbn0gZnJvbSBcIi4vY2h1bmstQkVSUE5QRVouanNcIjtcbmltcG9ydCBcIi4vY2h1bmstUUdNNE0zTkkuanNcIjtcblxuLy8gc3JjL2Jyb3dzZXIudHNcbmltcG9ydCBvcmlnaW5hbEJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xudmFyIGJyb3dzZXIgPSBvcmlnaW5hbEJyb3dzZXI7XG5cbi8vIHNyYy9zdG9yYWdlLnRzXG5pbXBvcnQgeyBkZXF1YWwgfSBmcm9tIFwiZGVxdWFsL2xpdGVcIjtcblxuLy8gc3JjL3NhbmRib3gvdXRpbHMvbG9nZ2VyLnRzXG5mdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG52YXIgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuXG4vLyBzcmMvc3RvcmFnZS50c1xudmFyIHN0b3JhZ2UgPSBjcmVhdGVTdG9yYWdlKCk7XG5mdW5jdGlvbiBjcmVhdGVTdG9yYWdlKCkge1xuICBjb25zdCBkcml2ZXJzID0ge1xuICAgIGxvY2FsOiBjcmVhdGVEcml2ZXIoXCJsb2NhbFwiKSxcbiAgICBzZXNzaW9uOiBjcmVhdGVEcml2ZXIoXCJzZXNzaW9uXCIpLFxuICAgIHN5bmM6IGNyZWF0ZURyaXZlcihcInN5bmNcIiksXG4gICAgbWFuYWdlZDogY3JlYXRlRHJpdmVyKFwibWFuYWdlZFwiKVxuICB9O1xuICBjb25zdCBnZXREcml2ZXIgPSAoYXJlYSkgPT4ge1xuICAgIGNvbnN0IGRyaXZlciA9IGRyaXZlcnNbYXJlYV07XG4gICAgaWYgKGRyaXZlciA9PSBudWxsKSB7XG4gICAgICBjb25zdCBhcmVhTmFtZXMgPSBPYmplY3Qua2V5cyhkcml2ZXJzKS5qb2luKFwiLCBcIik7XG4gICAgICB0aHJvdyBFcnJvcihgSW52YWxpZCBhcmVhIFwiJHthcmVhfVwiLiBPcHRpb25zOiAke2FyZWFOYW1lc31gKTtcbiAgICB9XG4gICAgcmV0dXJuIGRyaXZlcjtcbiAgfTtcbiAgY29uc3QgcmVzb2x2ZUtleSA9IChrZXkpID0+IHtcbiAgICBjb25zdCBkZWxpbWluYXRvckluZGV4ID0ga2V5LmluZGV4T2YoXCI6XCIpO1xuICAgIGNvbnN0IGRyaXZlckFyZWEgPSBrZXkuc3Vic3RyaW5nKDAsIGRlbGltaW5hdG9ySW5kZXgpO1xuICAgIGNvbnN0IGRyaXZlcktleSA9IGtleS5zdWJzdHJpbmcoZGVsaW1pbmF0b3JJbmRleCArIDEpO1xuICAgIGlmIChkcml2ZXJLZXkgPT0gbnVsbClcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBgU3RvcmFnZSBrZXkgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIFwiYXJlYTprZXlcIiwgYnV0IHJlY2VpdmVkIFwiJHtrZXl9XCJgXG4gICAgICApO1xuICAgIHJldHVybiB7XG4gICAgICBkcml2ZXJBcmVhLFxuICAgICAgZHJpdmVyS2V5LFxuICAgICAgZHJpdmVyOiBnZXREcml2ZXIoZHJpdmVyQXJlYSlcbiAgICB9O1xuICB9O1xuICBjb25zdCBnZXRNZXRhS2V5ID0gKGtleSkgPT4ga2V5ICsgXCIkXCI7XG4gIGNvbnN0IGdldFZhbHVlT3JEZWZhdWx0ID0gKHZhbHVlLCBkZWZhdWx0VmFsdWUpID0+IHZhbHVlID8/IGRlZmF1bHRWYWx1ZSA/PyBudWxsO1xuICBjb25zdCBnZXRNZXRhVmFsdWUgPSAocHJvcGVydGllcykgPT4gdHlwZW9mIHByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcykgPyBwcm9wZXJ0aWVzIDoge307XG4gIGNvbnN0IGdldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuICAgIHJldHVybiBnZXRWYWx1ZU9yRGVmYXVsdChyZXMsIG9wdHM/LmRlZmF1bHRWYWx1ZSk7XG4gIH07XG4gIGNvbnN0IGdldE1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXkpID0+IHtcbiAgICBjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGRyaXZlci5nZXRJdGVtKG1ldGFLZXkpO1xuICAgIHJldHVybiBnZXRNZXRhVmFsdWUocmVzKTtcbiAgfTtcbiAgY29uc3Qgc2V0SXRlbSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpID0+IHtcbiAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbShkcml2ZXJLZXksIHZhbHVlID8/IG51bGwpO1xuICB9O1xuICBjb25zdCBzZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG4gICAgY29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcbiAgICBjb25zdCBleGlzdGluZ0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG4gICAgY29uc3QgbmV3RmllbGRzID0geyAuLi5leGlzdGluZ0ZpZWxkcyB9O1xuICAgIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgZGVsZXRlIG5ld0ZpZWxkc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RmllbGRzW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbShtZXRhS2V5LCBuZXdGaWVsZHMpO1xuICB9O1xuICBjb25zdCByZW1vdmVJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG4gICAgYXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0oZHJpdmVyS2V5KTtcbiAgICBpZiAob3B0cz8ucmVtb3ZlTWV0YSkge1xuICAgICAgY29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcbiAgICAgIGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKG1ldGFLZXkpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcmVtb3ZlTWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuICAgIGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG4gICAgaWYgKHByb3BlcnRpZXMgPT0gbnVsbCkge1xuICAgICAgYXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0obWV0YUtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5ld0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG4gICAgICB0b0FycmF5KHByb3BlcnRpZXMpLmZvckVhY2goKGZpZWxkKSA9PiBkZWxldGUgbmV3RmllbGRzW2ZpZWxkXSk7XG4gICAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbShtZXRhS2V5LCBuZXdGaWVsZHMpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgd2F0Y2ggPSAoZHJpdmVyLCBkcml2ZXJLZXksIGNiKSA9PiB7XG4gICAgcmV0dXJuIGRyaXZlci53YXRjaChkcml2ZXJLZXksIGNiKTtcbiAgfTtcbiAgY29uc3Qgc3RvcmFnZTIgPSB7XG4gICAgZ2V0SXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuICAgIH0sXG4gICAgZ2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG4gICAgICBjb25zdCBhcmVhVG9LZXlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICAgICAgY29uc3Qga2V5VG9PcHRzTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGxldCBrZXlTdHI7XG4gICAgICAgIGxldCBvcHRzO1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIGtleVN0ciA9IGtleTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXlTdHIgPSBrZXkua2V5O1xuICAgICAgICAgIG9wdHMgPSBrZXkub3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXlTdHIpO1xuICAgICAgICBjb25zdCBrZXlzMiA9IGFyZWFUb0tleU1hcC5nZXQoZHJpdmVyQXJlYSkgPz8gW107XG4gICAgICAgIGFyZWFUb0tleU1hcC5zZXQoZHJpdmVyQXJlYSwga2V5czIuY29uY2F0KGRyaXZlcktleSkpO1xuICAgICAgICBrZXlUb09wdHNNYXAuc2V0KGtleVN0ciwgb3B0cyk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgQXJyYXkuZnJvbShhcmVhVG9LZXlNYXAuZW50cmllcygpKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzMl0pID0+IHtcbiAgICAgICAgICBjb25zdCBkcml2ZXJSZXN1bHRzID0gYXdhaXQgZHJpdmVyc1tkcml2ZXJBcmVhXS5nZXRJdGVtcyhrZXlzMik7XG4gICAgICAgICAgcmV0dXJuIGRyaXZlclJlc3VsdHMubWFwKChkcml2ZXJSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke2RyaXZlckFyZWF9OiR7ZHJpdmVyUmVzdWx0LmtleX1gO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRWYWx1ZU9yRGVmYXVsdChcbiAgICAgICAgICAgICAgZHJpdmVyUmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICBrZXlUb09wdHNNYXAuZ2V0KGtleSk/LmRlZmF1bHRWYWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiB7IGtleSwgdmFsdWUgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0cy5mbGF0KCk7XG4gICAgfSxcbiAgICBnZXRNZXRhOiBhc3luYyAoa2V5KSA9PiB7XG4gICAgICBjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG4gICAgfSxcbiAgICBzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgYXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuICAgIH0sXG4gICAgc2V0SXRlbXM6IGFzeW5jICh2YWx1ZXMpID0+IHtcbiAgICAgIGNvbnN0IGFyZWFUb0tleVZhbHVlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICAgIHZhbHVlcy5mb3JFYWNoKCh7IGtleSwgdmFsdWUgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgICBjb25zdCB2YWx1ZXMyID0gYXJlYVRvS2V5VmFsdWVNYXAuZ2V0KGRyaXZlckFyZWEpID8/IFtdO1xuICAgICAgICBhcmVhVG9LZXlWYWx1ZU1hcC5zZXQoXG4gICAgICAgICAgZHJpdmVyQXJlYSxcbiAgICAgICAgICB2YWx1ZXMyLmNvbmNhdCh7IGtleTogZHJpdmVyS2V5LCB2YWx1ZSB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgQXJyYXkuZnJvbShhcmVhVG9LZXlWYWx1ZU1hcC5lbnRyaWVzKCkpLm1hcChcbiAgICAgICAgICBhc3luYyAoW2RyaXZlckFyZWEsIHZhbHVlczJdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkcml2ZXIgPSBnZXREcml2ZXIoZHJpdmVyQXJlYSk7XG4gICAgICAgICAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbXModmFsdWVzMik7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sXG4gICAgc2V0TWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgYXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG4gICAgfSxcbiAgICByZW1vdmVJdGVtOiBhc3luYyAoa2V5LCBvcHRzKSA9PiB7XG4gICAgICBjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG4gICAgICBhd2FpdCByZW1vdmVJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcbiAgICB9LFxuICAgIHJlbW92ZUl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuICAgICAgY29uc3QgYXJlYVRvS2V5c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBsZXQga2V5U3RyO1xuICAgICAgICBsZXQgb3B0cztcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBrZXlTdHIgPSBrZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAga2V5U3RyID0ga2V5LmtleTtcbiAgICAgICAgICBvcHRzID0ga2V5Lm9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5U3RyKTtcbiAgICAgICAgY29uc3QgYXJlYUtleXMgPSBhcmVhVG9LZXlzTWFwLmdldChkcml2ZXJBcmVhKSA/PyBbXTtcbiAgICAgICAgYXJlYUtleXMucHVzaChkcml2ZXJLZXkpO1xuICAgICAgICBpZiAob3B0cz8ucmVtb3ZlTWV0YSkge1xuICAgICAgICAgIGFyZWFLZXlzLnB1c2goZ2V0TWV0YUtleShkcml2ZXJLZXkpKTtcbiAgICAgICAgfVxuICAgICAgICBhcmVhVG9LZXlzTWFwLnNldChkcml2ZXJBcmVhLCBhcmVhS2V5cyk7XG4gICAgICB9KTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBBcnJheS5mcm9tKGFyZWFUb0tleXNNYXAuZW50cmllcygpKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzMl0pID0+IHtcbiAgICAgICAgICBjb25zdCBkcml2ZXIgPSBnZXREcml2ZXIoZHJpdmVyQXJlYSk7XG4gICAgICAgICAgYXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW1zKGtleXMyKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSxcbiAgICByZW1vdmVNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG4gICAgICBjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG4gICAgICBhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcbiAgICB9LFxuICAgIHNuYXBzaG90OiBhc3luYyAoYmFzZSwgb3B0cykgPT4ge1xuICAgICAgY29uc3QgZHJpdmVyID0gZ2V0RHJpdmVyKGJhc2UpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRyaXZlci5zbmFwc2hvdCgpO1xuICAgICAgb3B0cz8uZXhjbHVkZUtleXM/LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBkZWxldGUgZGF0YVtrZXldO1xuICAgICAgICBkZWxldGUgZGF0YVtnZXRNZXRhS2V5KGtleSldO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGJhc2UsIGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IGRyaXZlciA9IGdldERyaXZlcihiYXNlKTtcbiAgICAgIGF3YWl0IGRyaXZlci5yZXN0b3JlU25hcHNob3QoZGF0YSk7XG4gICAgfSxcbiAgICB3YXRjaDogKGtleSwgY2IpID0+IHtcbiAgICAgIGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgIHJldHVybiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgY2IpO1xuICAgIH0sXG4gICAgdW53YXRjaCgpIHtcbiAgICAgIE9iamVjdC52YWx1ZXMoZHJpdmVycykuZm9yRWFjaCgoZHJpdmVyKSA9PiB7XG4gICAgICAgIGRyaXZlci51bndhdGNoKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRlZmluZUl0ZW06IChrZXksIG9wdHMpID0+IHtcbiAgICAgIGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgIGNvbnN0IHsgdmVyc2lvbjogdGFyZ2V0VmVyc2lvbiA9IDEsIG1pZ3JhdGlvbnMgPSB7fSB9ID0gb3B0cyA/PyB7fTtcbiAgICAgIGlmICh0YXJnZXRWZXJzaW9uIDwgMSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBcIlN0b3JhZ2UgaXRlbSB2ZXJzaW9uIGNhbm5vdCBiZSBsZXNzIHRoYW4gMS4gSW5pdGlhbCB2ZXJzaW9ucyBzaG91bGQgYmUgc2V0IHRvIDEsIG5vdCAwLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBtaWdyYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBkcml2ZXJNZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuICAgICAgICBjb25zdCBbeyB2YWx1ZSB9LCB7IHZhbHVlOiBtZXRhIH1dID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKFtcbiAgICAgICAgICBkcml2ZXJLZXksXG4gICAgICAgICAgZHJpdmVyTWV0YUtleVxuICAgICAgICBdKTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcbiAgICAgICAgY29uc3QgY3VycmVudFZlcnNpb24gPSBtZXRhPy52ID8/IDE7XG4gICAgICAgIGlmIChjdXJyZW50VmVyc2lvbiA+IHRhcmdldFZlcnNpb24pIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgIGBWZXJzaW9uIGRvd25ncmFkZSBkZXRlY3RlZCAodiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259KSBmb3IgXCIke2tleX1cImBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICBgUnVubmluZyBzdG9yYWdlIG1pZ3JhdGlvbiBmb3IgJHtrZXl9OiB2JHtjdXJyZW50VmVyc2lvbn0gLT4gdiR7dGFyZ2V0VmVyc2lvbn1gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG1pZ3JhdGlvbnNUb1J1biA9IEFycmF5LmZyb20oXG4gICAgICAgICAgeyBsZW5ndGg6IHRhcmdldFZlcnNpb24gLSBjdXJyZW50VmVyc2lvbiB9LFxuICAgICAgICAgIChfLCBpKSA9PiBjdXJyZW50VmVyc2lvbiArIGkgKyAxXG4gICAgICAgICk7XG4gICAgICAgIGxldCBtaWdyYXRlZFZhbHVlID0gdmFsdWU7XG4gICAgICAgIGZvciAoY29uc3QgbWlncmF0ZVRvVmVyc2lvbiBvZiBtaWdyYXRpb25zVG9SdW4pIHtcbiAgICAgICAgICBtaWdyYXRlZFZhbHVlID0gYXdhaXQgbWlncmF0aW9ucz8uW21pZ3JhdGVUb1ZlcnNpb25dPy4obWlncmF0ZWRWYWx1ZSkgPz8gbWlncmF0ZWRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbXMoW1xuICAgICAgICAgIHsga2V5OiBkcml2ZXJLZXksIHZhbHVlOiBtaWdyYXRlZFZhbHVlIH0sXG4gICAgICAgICAgeyBrZXk6IGRyaXZlck1ldGFLZXksIHZhbHVlOiB7IC4uLm1ldGEsIHY6IHRhcmdldFZlcnNpb24gfSB9XG4gICAgICAgIF0pO1xuICAgICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgICAgYFN0b3JhZ2UgbWlncmF0aW9uIGNvbXBsZXRlZCBmb3IgJHtrZXl9IHYke3RhcmdldFZlcnNpb259YCxcbiAgICAgICAgICB7IG1pZ3JhdGVkVmFsdWUgfVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG1pZ3JhdGlvbnNEb25lID0gb3B0cz8ubWlncmF0aW9ucyA9PSBudWxsID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBtaWdyYXRlKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBsb2dnZXIuZXJyb3IoYE1pZ3JhdGlvbiBmYWlsZWQgZm9yICR7a2V5fWAsIGVycik7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGdldERlZmF1bHRWYWx1ZSA9ICgpID0+IG9wdHM/LmRlZmF1bHRWYWx1ZSA/PyBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0IGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbHVlOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgbWlncmF0aW9uc0RvbmU7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRNZXRhOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgbWlncmF0aW9uc0RvbmU7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWx1ZTogYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgYXdhaXQgbWlncmF0aW9uc0RvbmU7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IHNldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0TWV0YTogYXN5bmMgKHByb3BlcnRpZXMpID0+IHtcbiAgICAgICAgICBhd2FpdCBtaWdyYXRpb25zRG9uZTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZVZhbHVlOiBhc3luYyAob3B0czIpID0+IHtcbiAgICAgICAgICBhd2FpdCBtaWdyYXRpb25zRG9uZTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0czIpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuICAgICAgICAgIGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuICAgICAgICAgIHJldHVybiBhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2F0Y2g6IChjYikgPT4gd2F0Y2goXG4gICAgICAgICAgZHJpdmVyLFxuICAgICAgICAgIGRyaXZlcktleSxcbiAgICAgICAgICAobmV3VmFsdWUsIG9sZFZhbHVlKSA9PiBjYihuZXdWYWx1ZSA/PyBnZXREZWZhdWx0VmFsdWUoKSwgb2xkVmFsdWUgPz8gZ2V0RGVmYXVsdFZhbHVlKCkpXG4gICAgICAgICksXG4gICAgICAgIG1pZ3JhdGVcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICByZXR1cm4gc3RvcmFnZTI7XG59XG5mdW5jdGlvbiBjcmVhdGVEcml2ZXIoc3RvcmFnZUFyZWEpIHtcbiAgY29uc3QgZ2V0U3RvcmFnZUFyZWEgPSAoKSA9PiB7XG4gICAgaWYgKGJyb3dzZXIucnVudGltZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgW1xuICAgICAgICAgIFwiJ3d4dC9zdG9yYWdlJyBtdXN0IGJlIGxvYWRlZCBpbiBhIHdlYiBleHRlbnNpb24gZW52aXJvbm1lbnRcIixcbiAgICAgICAgICBcIlxcbiAtIElmIHRocm93biBkdXJpbmcgYSBidWlsZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93eHQtZGV2L3d4dC9pc3N1ZXMvMzcxXCIsXG4gICAgICAgICAgXCIgLSBJZiB0aHJvd24gZHVyaW5nIHRlc3RzLCBtb2NrICd3eHQvYnJvd3NlcicgY29ycmVjdGx5LiBTZWUgaHR0cHM6Ly93eHQuZGV2L2d1aWRlL2dvLWZ1cnRoZXIvdGVzdGluZy5odG1sXFxuXCJcbiAgICAgICAgXS5qb2luKFwiXFxuXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoYnJvd3Nlci5zdG9yYWdlID09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIllvdSBtdXN0IGFkZCB0aGUgJ3N0b3JhZ2UnIHBlcm1pc3Npb24gdG8geW91ciBtYW5pZmVzdCB0byB1c2UgJ3d4dC9zdG9yYWdlJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBhcmVhID0gYnJvd3Nlci5zdG9yYWdlW3N0b3JhZ2VBcmVhXTtcbiAgICBpZiAoYXJlYSA9PSBudWxsKVxuICAgICAgdGhyb3cgRXJyb3IoYFwiYnJvd3Nlci5zdG9yYWdlLiR7c3RvcmFnZUFyZWF9XCIgaXMgdW5kZWZpbmVkYCk7XG4gICAgcmV0dXJuIGFyZWE7XG4gIH07XG4gIGNvbnN0IHdhdGNoTGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXkpO1xuICAgICAgcmV0dXJuIHJlc1trZXldO1xuICAgIH0sXG4gICAgZ2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXlzKTtcbiAgICAgIHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiAoeyBrZXksIHZhbHVlOiByZXN1bHRba2V5XSA/PyBudWxsIH0pKTtcbiAgICB9LFxuICAgIHNldEl0ZW06IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoeyBba2V5XTogdmFsdWUgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRJdGVtczogYXN5bmMgKHZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgbWFwID0gdmFsdWVzLnJlZHVjZShcbiAgICAgICAgKG1hcDIsIHsga2V5LCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgbWFwMltrZXldID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIG1hcDI7XG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApO1xuICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQobWFwKTtcbiAgICB9LFxuICAgIHJlbW92ZUl0ZW06IGFzeW5jIChrZXkpID0+IHtcbiAgICAgIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG4gICAgfSxcbiAgICByZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcbiAgICAgIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleXMpO1xuICAgIH0sXG4gICAgc25hcHNob3Q6IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldCgpO1xuICAgIH0sXG4gICAgcmVzdG9yZVNuYXBzaG90OiBhc3luYyAoZGF0YSkgPT4ge1xuICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoZGF0YSk7XG4gICAgfSxcbiAgICB3YXRjaChrZXksIGNiKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IChjaGFuZ2VzKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoYW5nZXNba2V5XTtcbiAgICAgICAgaWYgKGNoYW5nZSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmIChkZXF1YWwoY2hhbmdlLm5ld1ZhbHVlLCBjaGFuZ2Uub2xkVmFsdWUpKSByZXR1cm47XG4gICAgICAgIGNiKGNoYW5nZS5uZXdWYWx1ZSA/PyBudWxsLCBjaGFuZ2Uub2xkVmFsdWUgPz8gbnVsbCk7XG4gICAgICB9O1xuICAgICAgZ2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgd2F0Y2hMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICB1bndhdGNoKCkge1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgZ2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICB3YXRjaExpc3RlbmVycy5jbGVhcigpO1xuICAgIH1cbiAgfTtcbn1cbmV4cG9ydCB7XG4gIHN0b3JhZ2Vcbn07XG4iLCJpbXBvcnQgeyBvcGVuRXh0ZW5zaW9uRGF0YWJhc2UgfSBmcm9tICdAL3V0aWxzL2RhdGFiYXNlJztcbmltcG9ydCB7IHJlZ2lzdGVyVGltZWRhdGFTZXJ2aWNlIH0gZnJvbSAnQC91dGlscy90aW1lZGF0YS1zZXJ2aWNlJztcbmltcG9ydCB7IFRhYnMgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG5pbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnd3h0L3N0b3JhZ2UnXG5cbmludGVyZmFjZSBUaW1lRGF0YSB7XG4gICAgW2tleTogc3RyaW5nXTogbnVtYmVyXG59XG5cbmxldCBjdXJyZW50VXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbFxubGV0IHN0YXJ0VGltZTogbnVtYmVyIHwgbnVsbCA9IG51bGxcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG4gICAgdmFyIHN0b3BXYXRjaFRpbWU6IG51bWJlciA9IDBcbiAgICB2YXIgdGltZVNwZW50ID0gMFxuICAgIGNvbnN0IGRiID0gb3BlbkV4dGVuc2lvbkRhdGFiYXNlKCk7XG4gICAgY29uc3QgdGltZWRhdGFTZXJ2aWNlID0gcmVnaXN0ZXJUaW1lZGF0YVNlcnZpY2UoZGIpXG4gICAgYnJvd3Nlci50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKGFzeW5jIChhY3RpdmVJbmZvKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhYiA9IGF3YWl0IGJyb3dzZXIudGFicy5nZXQoYWN0aXZlSW5mby50YWJJZClcbiAgICAgICBcbiAgICAgICAgY3JlYXRlVGltZURhdGEodGFiKVxuICAgICAgICBcbiAgICB9KVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGltZURhdGEodGFiOiBUYWJzLlRhYikge1xuXG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBEYXRlLm5vdygpXG4gICAgICAgIGNvbnN0IHVybCA9IHRhYi51cmwgPz8gdGFiLnBlbmRpbmdVcmw7XG4gICAgICAgIGNvbnN0IGZhdmljb25VcmwgPSB0YWIuZmF2SWNvblVybDtcbiAgICAgICAgaWYgKCF1cmwgfHwgIWZhdmljb25VcmwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBob3N0bmFtZSA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZTtcblxuICAgICAgICBjb25zdCB0aW1lRGF0YSA9IGF3YWl0IHRpbWVkYXRhU2VydmljZS5nZXRMYXN0KGhvc3RuYW1lKTtcbiAgICAgICAgaWYgKCF0aW1lRGF0YSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IGxhc3REYXRhID0gYXdhaXQgdGltZWRhdGFTZXJ2aWNlLmdldEZpcnN0T2ZEYXkoZm9ybWF0RGF0ZShuZXcgRGF0ZSgpKSwgaG9zdG5hbWUpO1xuICAgICAgICBpZiAoIWxhc3REYXRhKSByZXR1cm5cblxuICAgICAgICBjb25zdCB0aW1lU3BlbnQgPSBlbmRUaW1lIC0gKHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpKVxuXG4gICAgICAgIGF3YWl0IHRpbWVkYXRhU2VydmljZS51cGRhdGUoeyBcbiAgICAgICAgICAgIC4uLnRpbWVEYXRhLFxuICAgICAgICAgICAgdXBkYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWVTcGVudDogdGltZVNwZW50LFxuICAgICAgICAgICAgLy8gc2Vzc2lvbjogdGltZURhdGEuc2Vzc2lvblxuICAgICAgICB9KVxuICAgICAgICBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkISxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aW1lRGF0YTogdGltZVNwZW50LFxuICAgICAgICAgICAgICAgIHRpbWVMaW1pdHM6IDBcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRpbWVEYXRhKHRhYjogVGFicy5UYWIpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGFiLnVybCA/PyB0YWIucGVuZGluZ1VybDtcbiAgICAgICAgY29uc3QgZmF2aWNvblVybCA9IHRhYi5mYXZJY29uVXJsO1xuICAgICAgICBpZiAoIXVybCB8fCAhZmF2aWNvblVybCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lO1xuICAgICAgICBjb25zdCB0aW1lRGF0YSA9IGF3YWl0IHRpbWVkYXRhU2VydmljZS5nZXRMYXN0KGhvc3RuYW1lKTtcbiAgICAgICAgY29uc29sZS5ncm91cChcInRpbWVEYXRhXCIpXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGltZURhdGFcIiwgdGltZURhdGEpXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgICAgICBjb25zdCB0aW1lU3BlbnQgPSBEYXRlLm5vdygpIC0gKHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpKVxuICAgICAgICBhd2FpdCB0aW1lZGF0YVNlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB1cGRhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgaG9zdG5hbWUsXG4gICAgICAgICAgICBkYXk6IGZvcm1hdERhdGUobmV3IERhdGUoKSksXG4gICAgICAgICAgICBmYXZpY29uVXJsLFxuICAgICAgICAgICAgdGltZVNwZW50OiB0aW1lU3BlbnQsXG4gICAgICAgIH0pXG4gICAgICAgIHN0YXJ0VGltZSA9IERhdGUubm93KClcbiAgICB9XG5cbiAgICBicm93c2VyLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgY2hhbmdlSW5mbywgdGFiKSA9PiB7XG4gICAgICAgIGlmIChjaGFuZ2VJbmZvLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgY3JlYXRlVGltZURhdGEodGFiKVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRpbWVUcmFja2luZyh1cmw6IHN0cmluZywgdGFiSWQ6IG51bWJlcikge1xuICAgICAgICBpZiAoY3VycmVudFVybCkge1xuICAgICAgICAgICAgY29uc3QgZW5kVGltZSA9IERhdGUubm93KClcblxuICAgICAgICAgICAgY29uc3QgdGltZVNwZW50ID0gZW5kVGltZSAtIChzdGFydFRpbWUgfHwgZW5kVGltZSlcblxuICAgICAgICAgICAgYXdhaXQgdXBkYXRlU3RvcmVkVGltZShjdXJyZW50VXJsLCB0aW1lU3BlbnQsIHRhYklkKVxuICAgICAgICB9XG4gICAgICAgIGlmICghdXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuXG4gICAgICAgIGN1cnJlbnRVcmwgPSBuZXcgVVJMKHVybCkuaG9zdG5hbWVcbiAgICAgICAgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN0b3JlZFRpbWUodXJsOiBzdHJpbmcsIHRpbWVTcGVudDogbnVtYmVyLCB0YWJJZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlZERhdGEgPSBhd2FpdCBzdG9yYWdlLmdldEl0ZW0oJ2xvY2FsOnRpbWVEYXRhJykgYXMgeyB0aW1lRGF0YTogVGltZURhdGEgfVxuICAgICAgICBjb25zdCB0aW1lRGF0YSA9IHN0b3JlZERhdGE/LnRpbWVEYXRhIHx8IHt9XG4gICAgICAgIHRpbWVEYXRhW3VybF0gPSAodGltZURhdGFbdXJsXSB8fCAwKSArIHRpbWVTcGVudFxuICAgICAgICBhd2FpdCBzdG9yYWdlLnNldEl0ZW0oXCJsb2NhbDp0aW1lRGF0YVwiLCB7IHRpbWVEYXRhIH0pXG5cbiAgICAgICAgY29uc3Qgc3RvcmVkTGltaXRzID0gYXdhaXQgc3RvcmFnZS5nZXRJdGVtKCdsb2NhbDp0aW1lTGltaXRzJykgYXMgeyB0aW1lTGltaXRzOiBUaW1lRGF0YSB9XG4gICAgICAgIGNvbnN0IHRpbWVMaW1pdHMgPSBzdG9yZWRMaW1pdHM/LnRpbWVMaW1pdHMgfHwge31cbiAgICAgICAgdGltZUxpbWl0c1t1cmxdID0gdGltZUxpbWl0c1t1cmxdID8gdGltZUxpbWl0c1t1cmxdIC0gdGltZVNwZW50ID4gMCA/IHRpbWVMaW1pdHNbdXJsXSAtIHRpbWVTcGVudCA6IDAgOiAwXG4gICAgICAgIGF3YWl0IHN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsOnRpbWVMaW1pdHNcIiwgeyB0aW1lTGltaXRzIH0pXG5cbiAgICAgICAgYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCB7IHRpbWVEYXRhOiB0aW1lRGF0YVt1cmxdLCB0aW1lTGltaXRzOiB0aW1lTGltaXRzW3VybF0gfSwpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRpbWUgbGltaXRzIGV2ZXJ5IG1pbnV0ZVxuICAgIGJyb3dzZXIuYWxhcm1zLmNyZWF0ZSgnY2hlY2tUaW1lTGltaXRzJywgeyBwZXJpb2RJbk1pbnV0ZXM6IDEgLyA2MCB9KVxuXG4gICAgYnJvd3Nlci5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcihhc3luYyAoYWxhcm0pID0+IHtcbiAgICAgICAgaWYgKGFsYXJtLm5hbWUgPT09ICdjaGVja1RpbWVMaW1pdHMnKSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lRGF0YSA9IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWw6dGltZURhdGEnKSBhcyBUaW1lRGF0YVxuICAgICAgICAgICAgY29uc3QgdGltZUxpbWl0cyA9IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWw6dGltZUxpbWl0cycpIGFzIFRpbWVEYXRhXG4gICAgICAgICAgICBjb25zdCBhbGxUYWJzID0gYXdhaXQgYnJvd3Nlci50YWJzLnF1ZXJ5KHt9KTtcbiAgICAgICAgICAgIGFsbFRhYnMubWFwKGFzeW5jICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGFiLmFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZURhdGEodGFiKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKCF0aW1lRGF0YSB8fCAhdGltZUxpbWl0cykgcmV0dXJuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFt1cmwsIHRpbWVTcGVudF0gb2YgT2JqZWN0LmVudHJpZXModGltZURhdGEpKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGltZUxpbWl0cyAmJiB0aW1lTGltaXRzW3VybF0gJiYgdGltZVNwZW50ID4gdGltZUxpbWl0c1t1cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgbm90aWZpY2F0aW9uIG9yIHRha2UgYWN0aW9uIHdoZW4gdGltZSBsaW1pdCBpcyBleGNlZWRlZFxuXG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIubm90aWZpY2F0aW9ucy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jhc2ljJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25Vcmw6ICdpY29uLnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1RpbWUgTGltaXQgRXhjZWVkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFlvdSd2ZSBleGNlZWRlZCB5b3VyIHRpbWUgbGltaXQgZm9yICR7dXJsfWBcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihhc3luYyAobWVzc2FnZToge1xuICAgICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICAgIHRpbWVzdGFtcDogbnVtYmVyXG4gICAgfSkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09IFwic3RhcnRTdG9wV2F0Y2hcIil7XG4gICAgICAgICAgICBzdG9wV2F0Y2hUaW1lID0gbWVzc2FnZS50aW1lc3RhbXBcbiAgICAgICAgICAgIHRpbWVTcGVudCA9IDBcbiAgICAgICAgICAgIHJldHVybiB7IHRpbWVTcGVudCB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09IFwicGF1c2VTdG9wV2F0Y2hcIikge1xuICAgICAgICAgICAgdGltZVNwZW50ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdG9wV2F0Y2hUaW1lXG4gICAgICAgICAgICByZXR1cm4geyB0aW1lU3BlbnQgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcImNoZWNrU3RvcFdhdGNoXCIpIHtcbiAgICAgICAgICAgIHRpbWVTcGVudCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RvcFdhdGNoVGltZVxuICAgICAgICAgICAgcmV0dXJuIHsgdGltZVNwZW50IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJnZXRUaW1lRGF0YUxpc3RcIikge1xuICAgICAgICAgICAgY29uc3QgdGltZURhdGFMaXN0ID0gYXdhaXQgdGltZWRhdGFTZXJ2aWNlLmdldEFsbEJ5RGF5KGZvcm1hdERhdGUobmV3IERhdGUoKSkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aW1lRGF0YUxpc3RcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHRpbWVTcGVudCB9XG4gICAgfSlcbn0pO1xuXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGU6IERhdGUpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtb250aCA9IGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2RlZmF1bHQnLCB7IG1vbnRoOiAnc2hvcnQnIH0pO1xuICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICByZXR1cm4gYCR7ZGF5fSAke21vbnRofSAke3llYXJ9YDtcbn07Il0sIm5hbWVzIjpbImdsb2JhbCIsInRoaXMiLCJtb2R1bGUiLCJwcm94eVRhcmdldCIsInZhbHVlIiwicmVzdWx0IiwibWVzc2FnZSIsImJyb3dzZXIiLCJ0YXJnZXQiLCJFcnJvciIsIl9fZGVmUHJvcCIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fYXN5bmMiLCJCcm93c2VyIiwiaXNPYmplY3QiLCJyZXF1aXJlJCQwIiwiZ2V0IiwibGlzdCIsInByaW50IiwibG9nZ2VyIiwidGltZVNwZW50Il0sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE1BQUksZ0JBQWdCLE1BQU07QUFBQSxJQUN4QixZQUFZLGNBQWM7QUFDeEIsVUFBSSxpQkFB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ZUFBTyxFQUFFLFVBQVU7QUFBQSxNQUFBO0FBR25CLFVBQUEsUUFBUSxRQUFRLG1CQUFtQjtBQUM3QixjQUFBLGVBQWUsTUFBTSxnQkFBZ0IsWUFBWSxXQUFlLG9CQUFBLEtBQUEsQ0FBTSxDQUFDO0FBRXRFLGVBQUE7QUFBQSxNQUFBO0FBR1gsYUFBTyxFQUFFLFVBQVU7QUFBQSxJQUFBLENBQ3RCO0FBQUEsRUFDTCxDQUFDO0FBRUQsUUFBTSxhQUFhLENBQUMsU0FBdUI7QUFDakMsVUFBQSxNQUFNLEtBQUssUUFBUSxFQUFFLFdBQVcsU0FBUyxHQUFHLEdBQUc7QUFDckQsVUFBTSxRQUFRLEtBQUssZUFBZSxXQUFXLEVBQUUsT0FBTyxTQUFTO0FBQ3pELFVBQUEsT0FBTyxLQUFLLFlBQVk7QUFFOUIsV0FBTyxHQUFHLEdBQUcsSUFBSSxLQUFLLElBQUksSUFBSTtBQUFBLEVBQ2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsNiw3LDgsOSwxMCwxMSwxMiwxNCwxNSwxNl19
