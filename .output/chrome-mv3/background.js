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
      sendMessage(message, arg) {
        if (arg == null) {
          return originalBrowser.runtime.sendMessage(message);
        }
        const options = typeof arg === "number" ? { tabId: arg } : arg;
        return originalBrowser.tabs.sendMessage(
          options.tabId,
          message,
          // Pass frameId if specified
          options.frameId != null ? { frameId: options.frameId } : void 0
        );
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
  function createTimeLimitsService(_db) {
    return {
      async getAll() {
        const db = await _db;
        return await db.getAll("timelimits");
      },
      async get(id) {
        const db = await _db;
        return await db.get("timelimits", id ?? "");
      },
      async create(info) {
        const db = await _db;
        await db.add("timelimits", info);
      },
      async update(info) {
        const db = await _db;
        await db.put("timelimits", info);
      },
      async delete(hostname) {
        const db = await _db;
        await db.delete("timelimits", hostname);
      }
    };
  }
  const [registerTimeLimitsService, getTimeLimitsService] = defineProxyService(
    "timelimits-service",
    createTimeLimitsService
  );
  _background;
  var browser = originalBrowser;
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
        const pageviews = database.createObjectStore("pageviews", {
          keyPath: "id"
        });
        pageviews.createIndex("idx_page_views_app_id", "appId", {
          unique: true
        });
        pageviews.createIndex("idx_page_views_startedAt", "startedAt");
        const sessiondata = database.createObjectStore("sessiondata", { keyPath: "startedAt" });
        sessiondata.createIndex("idx_session_startedAt", "startedAt");
        sessiondata.createIndex("idx_session_app_id", "appId");
        database.createObjectStore("timelimits", { keyPath: "id" });
        database.createObjectStore("favicons", { keyPath: "hostname" });
        const watches = database.createObjectStore("watches", { keyPath: "id" });
        watches.createIndex("idx_watches_endedAt", "endedAt");
        watches.createIndex("idx_watches_startedAt", "startedAt");
        watches.createIndex("idx_watches_day", "day");
      }
    });
  }
  _background;
  function createPageViewService(_db) {
    return {
      async create(info) {
        const db = await _db;
        await db.put("pageviews", info);
      },
      async getByAppId(appId) {
        const db = await _db;
        const transaction = db.transaction("pageviews", "readonly");
        const objectStore = transaction.objectStore("pageviews");
        await objectStore.get(IDBKeyRange.only(appId));
        var result2 = void 0;
        var index = objectStore.index("idx_page_views_app_id");
        var cursor = await index.openKeyCursor(appId, "prev");
        if (!!(cursor == null ? void 0 : cursor.key)) {
          result2 = await index.get(cursor == null ? void 0 : cursor.key);
        }
        return result2;
      },
      async get(id) {
        const db = await _db;
        return await db.get("pageviews", id);
      },
      async getAllToday(day) {
        const db = await _db;
        const transaction = db.transaction("pageviews", "readonly");
        const objectStore = transaction.objectStore("pageviews");
        const index = objectStore.index("idx_page_views_startedAt");
        return await index.getAll(IDBKeyRange.bound(day - 1, Date.now(), true, true));
      },
      async getCountByAppId(appId) {
        const db = await _db;
        const transaction = db.transaction("pageviews", "readonly");
        const objectStore = transaction.objectStore("pageviews");
        const index = objectStore.index("idx_page_views_app_id");
        const count = await index.count(appId);
        return count;
      },
      async getAllApps() {
        const db = await _db;
        const transaction = db.transaction("pageviews", "readonly");
        const objectStore = transaction.objectStore("pageviews");
        const index = objectStore.index("idx_page_views_app_id");
        const all = await index.getAll();
        const set = /* @__PURE__ */ new Set();
        const result2 = [];
        all.map((x, i) => {
          if (!set.has(x.appId)) {
            result2.push(x);
          }
          set.add(x.appId);
        });
        return result2;
      }
    };
  }
  const [registerPageViewService, getPageViewService] = defineProxyService(
    "pageview-service",
    createPageViewService
  );
  _background;
  function createWatchService(_db) {
    return {
      async create(info) {
        const db = await _db;
        await db.add("watches", info);
      },
      async update(info) {
        const db = await _db;
        await db.put("watches", info);
      },
      async get(id) {
        const db = await _db;
        return await db.get("watches", id);
      }
      // async getAll() {
      //     const db = await _db;
      //     return await db.getAll("watches");
      // },
      // async get(hostname: string) {
      //     const db = await _db;
      //     return await db.get("watches", hostname);
      // },
      // async create(info) {
      //     const db = await _db;
      //     await db.add("watches", info);
      // },
      // async update(info) {
      //     const db = await _db;
      //     await db.put("watches", info);
      // },
    };
  }
  const [registerWatchService, getWatchService] = defineProxyService(
    "watch-service",
    createWatchService
  );
  _background;
  function createSessionService(_db) {
    return {
      async create(info) {
        const db = await _db;
        await db.add("sessiondata", info);
      },
      async update(info) {
        const db = await _db;
        await db.put("sessiondata", info);
      },
      async get(id) {
        const db = await _db;
        return await db.get("sessiondata", id);
      },
      async getLast() {
        const db = await _db;
        const transaction = db.transaction("sessiondata", "readonly");
        const objectStore = transaction.objectStore("sessiondata");
        try {
          const cursorKeyRequest = await objectStore.openKeyCursor(null, "prev");
          if (!!(cursorKeyRequest == null ? void 0 : cursorKeyRequest.key)) {
            return await db.getFromIndex("sessiondata", "idx_session_startedAt", cursorKeyRequest == null ? void 0 : cursorKeyRequest.key);
          }
        } catch (error) {
          console.error("Error while opening cursor:", error);
        }
        return void 0;
      },
      async getLastForAppId(appId) {
        const db = await _db;
        const transaction = db.transaction("sessiondata", "readonly");
        const objectStore = transaction.objectStore("sessiondata");
        var result2 = void 0;
        while (true) {
          try {
            const cursorKeyRequest = await objectStore.index("idx_session_app_id").openKeyCursor(null, "prev");
            if (!!(cursorKeyRequest == null ? void 0 : cursorKeyRequest.key)) {
              if (cursorKeyRequest.key === appId) {
                result2 = await db.getFromIndex("sessiondata", "idx_session_app_id", cursorKeyRequest == null ? void 0 : cursorKeyRequest.key);
                break;
              } else {
                cursorKeyRequest == null ? void 0 : cursorKeyRequest.continue();
              }
            } else {
              console.log("test");
              break;
            }
          } catch (error) {
            break;
          }
        }
        return result2;
      },
      async getAllToday(day) {
        const db = await _db;
        const transaction = db.transaction("sessiondata", "readonly");
        const objectStore = transaction.objectStore("sessiondata");
        return await objectStore.getAll(IDBKeyRange.bound(day, Date.now(), true, true));
      }
    };
  }
  const [registerSessionService, getSessionService] = defineProxyService(
    "session-service",
    createSessionService
  );
  _background;
  function createFavIconService(_db) {
    return {
      async create(info) {
        const db = await _db;
        await db.add("favicons", info);
      },
      async get(hostname) {
        const db = await _db;
        return await db.get("favicons", hostname);
      }
    };
  }
  const [registerFavIconService, getFavIconService] = defineProxyService(
    "favicon-service",
    createFavIconService
  );
  _background;
  const excludeList = ["cahlkginjdfkbnjbgojoligicobgakfp", "newtab"];
  const definition = defineBackground(() => {
    const db = openExtensionDatabase();
    var currentTab = null;
    var watchId = "";
    const pageViewService = registerPageViewService(db);
    const sessionService = registerSessionService(db);
    const watchService = registerWatchService(db);
    const faviconService = registerFavIconService(db);
    const timeLimitService = registerTimeLimitsService(db);
    browser.alarms.create("checkTimeLimits", { periodInMinutes: 1 / 60 });
    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await browser.tabs.get(activeInfo.tabId);
      currentTab = tab;
      createPageView(tab);
      createSession(tab);
    });
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        if (!tab.active) return;
        currentTab = tab;
        createPageView(tab);
        createSession(tab);
      }
    });
    browser.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === "checkTimeLimits") {
        if (!currentTab) return;
        updateSession(currentTab);
      }
    });
    async function createPageView(tab) {
      const url = tab.url ?? tab.pendingUrl;
      const faviconUrl = tab.favIconUrl;
      if (!url) return;
      if (!tab.selected) return;
      const hostname = new URL(url).hostname;
      if (excludeList.includes(hostname)) return;
      const pageView = await pageViewService.getByAppId(hostname);
      const id = crypto.randomUUID();
      await pageViewService.create({
        id: pageView ? pageView.id : id,
        count: pageView ? pageView.count + 1 : 1,
        appId: pageView ? pageView.appId : hostname,
        day: (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0),
        faviconUrl: pageView ? pageView.faviconUrl : faviconUrl,
        path: new URL(url).pathname,
        query: new URL(url).search,
        referrer: new URL(url).origin
      });
    }
    async function createSession(tab) {
      var _a;
      const url = tab.url ?? tab.pendingUrl;
      const faviconUrl = tab.favIconUrl;
      if (!url) return;
      const hostname = new URL(url).hostname;
      if (excludeList.includes(hostname)) return;
      if (!!faviconUrl)
        await faviconService.create({
          faviconUrl,
          hostname
        });
      const id = crypto.randomUUID();
      await sessionService.create({
        id,
        faviconUrl: ((_a = await faviconService.get(hostname)) == null ? void 0 : _a.faviconUrl) ?? "",
        day: (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0),
        appId: hostname,
        createdBy: "bjorn",
        startedAt: Date.now(),
        endedAt: Date.now() + 10
      });
    }
    async function updateSession(tab) {
      var _a, _b;
      const url = tab.url ?? tab.pendingUrl;
      if (!url) return;
      const hostname = new URL(url).hostname;
      if (excludeList.includes(hostname)) return;
      const currentSession = await sessionService.getLast();
      if (!currentSession) return;
      if (currentSession.appId === hostname) {
        await sessionService.update({
          id: currentSession.id,
          faviconUrl: ((_a = await faviconService.get(hostname)) == null ? void 0 : _a.faviconUrl) ?? "",
          day: currentSession.day,
          appId: currentSession.appId,
          createdBy: currentSession.createdBy,
          startedAt: currentSession.startedAt,
          endedAt: Date.now()
        });
      } else {
        const newSession = await sessionService.getLastForAppId(hostname);
        if (!newSession) return;
        await sessionService.update({
          id: newSession.id,
          faviconUrl: ((_b = await faviconService.get(hostname)) == null ? void 0 : _b.faviconUrl) ?? "",
          day: newSession.day,
          appId: newSession.appId,
          createdBy: newSession.createdBy,
          startedAt: newSession.startedAt,
          endedAt: Date.now()
        });
      }
    }
    const getTimeData = async () => {
      const allSessions = await sessionService.getAllToday((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
      const allPageViews = await pageViewService.getAllToday((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
      if (!allSessions || !allPageViews) return;
      var timeDataList = [];
      allSessions.map((x) => {
        const timeData = timeDataList.find((y) => y.appId === x.appId);
        if (timeData) {
          timeData.timeSpent += x.endedAt - x.startedAt;
        } else {
          timeDataList.push({
            appId: x.appId,
            favIconUrl: x.faviconUrl,
            timeSpent: x.endedAt - x.startedAt,
            sessions: 1,
            percentage: 0
          });
        }
      });
      const total = timeDataList.reduce((a, b) => a + b.timeSpent, 0);
      timeDataList = await Promise.all(timeDataList.map(async (x) => {
        const pageView = await pageViewService.getByAppId(x.appId);
        const faviconObj = await faviconService.get(x.appId);
        return {
          ...x,
          favIconUrl: (faviconObj == null ? void 0 : faviconObj.faviconUrl) ?? "",
          sessions: (pageView == null ? void 0 : pageView.count) || 1,
          percentage: x.timeSpent / total * 100
        };
      }));
      return timeDataList;
    };
    async function createStopWatch() {
      var currentTab2 = void 0;
      const allTabs = await browser.tabs.query({});
      for (const tab of allTabs) {
        if (tab.active) {
          currentTab2 = tab;
          break;
        }
      }
      if (!currentTab2) return;
      const url = currentTab2.url ?? currentTab2.pendingUrl;
      const faviconUrl = currentTab2.favIconUrl;
      if (!url || !faviconUrl) return;
      const hostname = new URL(url).hostname;
      watchId = crypto.randomUUID();
      await watchService.create({
        appId: hostname,
        startedAt: Date.now(),
        endedAt: Date.now(),
        faviconUrl,
        id: watchId
      });
    }
    browser.runtime.onMessage.addListener(async (message) => {
      if (message.type == "openDashboard") {
        await browser.tabs.create({
          url: browser.runtime.getURL("/dashboard.html"),
          active: true
        });
      }
      if (message.type == "startStopWatch") {
        await createStopWatch();
        return {
          status: "success",
          message: "Stopwatch started"
        };
      }
      if (message.type == "checkStopWatch") {
        if (!watchId.length) return {
          status: "error",
          message: "Stopwatch not started"
        };
        const stopwatch = await watchService.get(watchId);
        if (!stopwatch) return;
        const newWatch = {
          appId: stopwatch.appId,
          faviconUrl: stopwatch.faviconUrl,
          id: watchId,
          startedAt: stopwatch.startedAt,
          endedAt: Date.now()
        };
        await watchService.update(newWatch);
        return {
          status: "success",
          message: "Stopwatch updated",
          data: newWatch
        };
      }
      if (message.type == "stopStopWatch") {
        watchId = "";
        return {
          status: "success",
          message: "Stopwatch stopped"
        };
      }
      if (message.type === "getFavIcon") {
        const favicon = await faviconService.get(message.id);
        return {
          status: "success",
          data: favicon == null ? void 0 : favicon.faviconUrl
        };
      }
      if (message.type == "getListOfApps") {
        const pageViews = await pageViewService.getAllApps();
        return {
          status: "success",
          data: pageViews
        };
      }
      if (message.type == "getTimeLimits") {
        const timeLimits = await timeLimitService.getAll();
        return {
          status: "success",
          data: timeLimits,
          message: "Time limits retrieved"
        };
      }
      if (message.type == "addTimeLimit") {
        await timeLimitService.create({
          active: true,
          apps: message.data.apps,
          days: message.data.days,
          id: crypto.randomUUID(),
          limitPeriod: message.data.limitPeriod,
          coolDownPeriod: message.data.coolDownPeriod,
          name: message.data.name,
          type: message.data.type,
          action: message.data.action,
          startTime: message.data.startTime,
          endTime: message.data.endTime,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        return {
          status: "success",
          message: "Time limit added"
        };
      }
      if (message.type == "editTimeLimit") {
        const timeLimit = await timeLimitService.get(message.data.id);
        if (!timeLimit) return {
          status: "error",
          message: "Time limit doesn't exist"
        };
        if (!timeLimit) return;
        await timeLimitService.update({
          active: message.data.active,
          apps: message.data.apps,
          days: message.data.days,
          limitPeriod: message.data.coolDownPeriod,
          coolDownPeriod: message.data.coolDownPeriod,
          name: message.data.name,
          action: message.data.action,
          type: message.data.type,
          startTime: message.data.startTime,
          endTime: message.data.endTime,
          id: timeLimit.id,
          createdAt: timeLimit.createdAt,
          updatedAt: Date.now()
        });
        return {
          status: "success",
          message: "Time limit updated"
        };
      }
      if (message.type == "deleteTimeLimit") {
        await timeLimitService.delete(message.data.id);
        return {
          status: "success",
          message: "Time limit deleted"
        };
      }
      if (message.type == "toggleTimeLimit") {
        const timeLimit = await timeLimitService.get(message.data.id);
        if (!timeLimit) return {
          status: "error",
          message: "Time limit doesn't exist"
        };
        if (!timeLimit) return;
        await timeLimitService.update({
          ...timeLimit,
          active: !timeLimit.active
        });
        return {
          status: "success",
          message: "Time limit updated"
        };
      }
      if (message.type == "getTimeData") {
        return {
          status: "success",
          message: "Time data retrieved",
          data: await getTimeData()
        };
      }
      return { status: "error", message: "Invalid message type" };
    });
  });
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
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
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
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
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
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
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
          await browser.tabs.reload(tab.id);
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
        browser.runtime.reload();
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
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9saWIvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3Qvc2FuZGJveC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3NlcmlhbGl6ZS1lcnJvci9lcnJvci1jb25zdHJ1Y3RvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvc2VyaWFsaXplLWVycm9yL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tZXNzYWdpbmcvbGliL2NodW5rLUJRTEZTRkZaLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tZXNzYWdpbmcvbGliL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2lzb2JqZWN0L2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2dldC12YWx1ZS9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ad2ViZXh0LWNvcmUvcHJveHktc2VydmljZS9saWIvaW5kZXguanMiLCIuLi8uLi91dGlscy90aW1lbGltaXRzLXNlcnZpY2UudHMiLCIuLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2h1bmstRk5URTJMMjcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL2luZGV4LmpzIiwiLi4vLi4vdXRpbHMvZGF0YWJhc2UudHMiLCIuLi8uLi91dGlscy9wYWdldmlldy1zZXJ2aWNlLnRzIiwiLi4vLi4vdXRpbHMvd2F0Y2gtc2VydmljZS50cyIsIi4uLy4uL3V0aWxzL3Nlc3Npb24tc2VydmljZS50cyIsIi4uLy4uL3V0aWxzL2Zhdmljb24tc2VydmljZS50cyIsIi4uLy4uL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2luZGV4LnRzXG52YXIgX01hdGNoUGF0dGVybiA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG4gICAgaWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcbiAgICAgIHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLl9NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcbiAgICAgIGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3VwcztcbiAgICAgIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG4gICAgICB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuICAgICAgdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG4gICAgfVxuICB9XG4gIGluY2x1ZGVzKHVybCkge1xuICAgIGlmICh0aGlzLmlzQWxsVXJscylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcbiAgICByZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImh0dHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImZpbGVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG4gICAgfSk7XG4gIH1cbiAgaXNIdHRwTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG4gIH1cbiAgaXNIdHRwc01hdGNoKHVybCkge1xuICAgIHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG4gICAgaWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW1xuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSxcbiAgICAgIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXG4gICAgXTtcbiAgICBjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuICAgIHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcbiAgfVxuICBpc0ZpbGVNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZmlsZTovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgaXNGdHBNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc1Vybk1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybik7XG4gICAgY29uc3Qgc3RhcnNSZXBsYWNlZCA9IGVzY2FwZWQucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuICAgIHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuICB9XG4gIGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG59O1xudmFyIE1hdGNoUGF0dGVybiA9IF9NYXRjaFBhdHRlcm47XG5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTID0gW1wiaHR0cFwiLCBcImh0dHBzXCIsIFwiZmlsZVwiLCBcImZ0cFwiLCBcInVyblwiXTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG4gICAgc3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuICBpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIilcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpXG4gICAgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4oXG4gICAgICBtYXRjaFBhdHRlcm4sXG4gICAgICBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWBcbiAgICApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHJldHVybjtcbn1cbmV4cG9ydCB7XG4gIEludmFsaWRNYXRjaFBhdHRlcm4sXG4gIE1hdGNoUGF0dGVyblxufTtcbiIsIi8vIHNyYy9zYW5kYm94L2RlZmluZS11bmxpc3RlZC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZVVubGlzdGVkU2NyaXB0KGFyZykge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcbiAgcmV0dXJuIGFyZztcbn1cblxuLy8gc3JjL3NhbmRib3gvZGVmaW5lLWJhY2tncm91bmQudHNcbmZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cblxuLy8gc3JjL3NhbmRib3gvZGVmaW5lLXd4dC1wbHVnaW4udHNcbmZ1bmN0aW9uIGRlZmluZVd4dFBsdWdpbihwbHVnaW4pIHtcbiAgcmV0dXJuIHBsdWdpbjtcbn1cblxuLy8gc3JjL3NhbmRib3gvZGVmaW5lLWFwcC1jb25maWcudHNcbmZ1bmN0aW9uIGRlZmluZUFwcENvbmZpZyhjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuLy8gc3JjL3NhbmRib3gvaW5kZXgudHNcbmV4cG9ydCAqIGZyb20gXCJAd2ViZXh0LWNvcmUvbWF0Y2gtcGF0dGVybnNcIjtcbmV4cG9ydCB7XG4gIGRlZmluZUFwcENvbmZpZyxcbiAgZGVmaW5lQmFja2dyb3VuZCxcbiAgZGVmaW5lQ29udGVudFNjcmlwdCxcbiAgZGVmaW5lVW5saXN0ZWRTY3JpcHQsXG4gIGRlZmluZVd4dFBsdWdpblxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTAuMCAtIEZyaSBBdWcgMTIgMjAyMiAxOTo0Mjo0NCAqL1xuXG4gIC8qIC0qLSBNb2RlOiBpbmRlbnQtdGFicy1tb2RlOiBuaWw7IGpzLWluZGVudC1sZXZlbDogMiAtKi0gKi9cblxuICAvKiB2aW06IHNldCBzdHM9MiBzdz0yIGV0IHR3PTgwOiAqL1xuXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIWdsb2JhbFRoaXMuY2hyb21lPy5ydW50aW1lPy5pZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2NyaXB0IHNob3VsZCBvbmx5IGJlIGxvYWRlZCBpbiBhIGJyb3dzZXIgZXh0ZW5zaW9uLlwiKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5icm93c2VyID09PSBcInVuZGVmaW5lZFwiIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWxUaGlzLmJyb3dzZXIpICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgY29uc3QgQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFID0gXCJUaGUgbWVzc2FnZSBwb3J0IGNsb3NlZCBiZWZvcmUgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWQuXCI7IC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuXG4gICAgY29uc3Qgd3JhcEFQSXMgPSBleHRlbnNpb25BUElzID0+IHtcbiAgICAgIC8vIE5PVEU6IGFwaU1ldGFkYXRhIGlzIGFzc29jaWF0ZWQgdG8gdGhlIGNvbnRlbnQgb2YgdGhlIGFwaS1tZXRhZGF0YS5qc29uIGZpbGVcbiAgICAgIC8vIGF0IGJ1aWxkIHRpbWUgYnkgcmVwbGFjaW5nIHRoZSBmb2xsb3dpbmcgXCJpbmNsdWRlXCIgd2l0aCB0aGUgY29udGVudCBvZiB0aGVcbiAgICAgIC8vIEpTT04gZmlsZS5cbiAgICAgIGNvbnN0IGFwaU1ldGFkYXRhID0ge1xuICAgICAgICBcImFsYXJtc1wiOiB7XG4gICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNsZWFyQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYm9va21hcmtzXCI6IHtcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldENoaWxkcmVuXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0U3ViVHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlVHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzZXJBY3Rpb25cIjoge1xuICAgICAgICAgIFwiZGlzYWJsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImVuYWJsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlQmFja2dyb3VuZENvbG9yXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VUZXh0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5Qb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlQmFja2dyb3VuZENvbG9yXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VUZXh0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2luZ0RhdGFcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ2FjaGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDb29raWVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRG93bmxvYWRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRm9ybURhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVIaXN0b3J5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlTG9jYWxTdG9yYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlUGFzc3dvcmRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlUGx1Z2luRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29tbWFuZHNcIjoge1xuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29udGV4dE1lbnVzXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvb2tpZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsQ29va2llU3RvcmVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGV2dG9vbHNcIjoge1xuICAgICAgICAgIFwiaW5zcGVjdGVkV2luZG93XCI6IHtcbiAgICAgICAgICAgIFwiZXZhbFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMixcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYW5lbHNcIjoge1xuICAgICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZWxlbWVudHNcIjoge1xuICAgICAgICAgICAgICBcImNyZWF0ZVNpZGViYXJQYW5lXCI6IHtcbiAgICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgXCJjYW5jZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkb3dubG9hZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImVyYXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0RmlsZUljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGF1c2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGaWxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImV4dGVuc2lvblwiOiB7XG4gICAgICAgICAgXCJpc0FsbG93ZWRGaWxlU2NoZW1lQWNjZXNzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaXNBbGxvd2VkSW5jb2duaXRvQWNjZXNzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGlzdG9yeVwiOiB7XG4gICAgICAgICAgXCJhZGRVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVSYW5nZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFZpc2l0c1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImkxOG5cIjoge1xuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBY2NlcHRMYW5ndWFnZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGVudGl0eVwiOiB7XG4gICAgICAgICAgXCJsYXVuY2hXZWJBdXRoRmxvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkbGVcIjoge1xuICAgICAgICAgIFwicXVlcnlTdGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hbmFnZW1lbnRcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0U2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEVuYWJsZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1bmluc3RhbGxTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibm90aWZpY2F0aW9uc1wiOiB7XG4gICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBlcm1pc3Npb25MZXZlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBhZ2VBY3Rpb25cIjoge1xuICAgICAgICAgIFwiZ2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhpZGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwZXJtaXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJjb250YWluc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJydW50aW1lXCI6IHtcbiAgICAgICAgICBcImdldEJhY2tncm91bmRQYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGxhdGZvcm1JbmZvXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3Blbk9wdGlvbnNQYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFVwZGF0ZUNoZWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTmF0aXZlTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFVuaW5zdGFsbFVSTFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInNlc3Npb25zXCI6IHtcbiAgICAgICAgICBcImdldERldmljZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRseUNsb3NlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3RvcmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzdG9yYWdlXCI6IHtcbiAgICAgICAgICBcImxvY2FsXCI6IHtcbiAgICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibWFuYWdlZFwiOiB7XG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzeW5jXCI6IHtcbiAgICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidGFic1wiOiB7XG4gICAgICAgICAgXCJjYXB0dXJlVmlzaWJsZVRhYlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGlzY2FyZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImR1cGxpY2F0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImV4ZWN1dGVTY3JpcHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21TZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdvQmFja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdvRm9yd2FyZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhpZ2hsaWdodFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImluc2VydENTU1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJxdWVyeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbG9hZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNTU1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21TZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRvcFNpdGVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYk5hdmlnYXRpb25cIjoge1xuICAgICAgICAgIFwiZ2V0QWxsRnJhbWVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0RnJhbWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJSZXF1ZXN0XCI6IHtcbiAgICAgICAgICBcImhhbmRsZXJCZWhhdmlvckNoYW5nZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aW5kb3dzXCI6IHtcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRMYXN0Rm9jdXNlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoT2JqZWN0LmtleXMoYXBpTWV0YWRhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcGktbWV0YWRhdGEuanNvbiBoYXMgbm90IGJlZW4gaW5jbHVkZWQgaW4gYnJvd3Nlci1wb2x5ZmlsbFwiKTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogQSBXZWFrTWFwIHN1YmNsYXNzIHdoaWNoIGNyZWF0ZXMgYW5kIHN0b3JlcyBhIHZhbHVlIGZvciBhbnkga2V5IHdoaWNoIGRvZXNcbiAgICAgICAqIG5vdCBleGlzdCB3aGVuIGFjY2Vzc2VkLCBidXQgYmVoYXZlcyBleGFjdGx5IGFzIGFuIG9yZGluYXJ5IFdlYWtNYXBcbiAgICAgICAqIG90aGVyd2lzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjcmVhdGVJdGVtXG4gICAgICAgKiAgICAgICAgQSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBpbiBvcmRlciB0byBjcmVhdGUgdGhlIHZhbHVlIGZvciBhbnlcbiAgICAgICAqICAgICAgICBrZXkgd2hpY2ggZG9lcyBub3QgZXhpc3QsIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGFjY2Vzc2VkLiBUaGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiByZWNlaXZlcywgYXMgaXRzIG9ubHkgYXJndW1lbnQsIHRoZSBrZXkgYmVpbmcgY3JlYXRlZC5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHRoaXMuY3JlYXRlSXRlbShrZXkpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KGtleSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBvYmplY3Qgd2l0aCBhIGB0aGVuYCBtZXRob2QsIGFuZCBjYW5cbiAgICAgICAqIHRoZXJlZm9yZSBiZSBhc3N1bWVkIHRvIGJlaGF2ZSBhcyBhIFByb21pc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB0aGVuYWJsZS5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IGlzVGhlbmFibGUgPSB2YWx1ZSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCBtYWtlQ2FsbGJhY2sgPSAocHJvbWlzZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuICguLi5jYWxsYmFja0FyZ3MpID0+IHtcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgfHwgY2FsbGJhY2tBcmdzLmxlbmd0aCA8PSAxICYmIG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJnc1swXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIHdyYXBwZXIgZnVuY3Rpb24gZm9yIGEgbWV0aG9kIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIG1ldGFkYXRhLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICAgKiAgICAgICAgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB3aGljaCBpcyBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBtZXRhZGF0YS5taW5BcmdzXG4gICAgICAgKiAgICAgICAgVGhlIG1pbmltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB3aGljaCBtdXN0IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggZmV3ZXIgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1heEFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG1heSBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24uIElmIGNhbGxlZCB3aXRoIG1vcmUgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24ob2JqZWN0LCAuLi4qKX1cbiAgICAgICAqICAgICAgIFRoZSBnZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IHdyYXBBc3luY0Z1bmN0aW9uID0gKG5hbWUsIG1ldGFkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhc3luY0Z1bmN0aW9uV3JhcHBlcih0YXJnZXQsIC4uLmFyZ3MpIHtcbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7IC8vIFVwZGF0ZSB0aGUgQVBJIG1ldGhvZCBtZXRhZGF0YSwgc28gdGhhdCB0aGUgbmV4dCBBUEkgY2FsbHMgd2lsbCBub3QgdHJ5IHRvXG4gICAgICAgICAgICAgICAgLy8gdXNlIHRoZSB1bnN1cHBvcnRlZCBjYWxsYmFjayBhbnltb3JlLlxuXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5ub0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEubm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBleGlzdGluZyBtZXRob2Qgb2YgdGhlIHRhcmdldCBvYmplY3QsIHNvIHRoYXQgY2FsbHMgdG8gaXQgYXJlXG4gICAgICAgKiBpbnRlcmNlcHRlZCBieSB0aGUgZ2l2ZW4gd3JhcHBlciBmdW5jdGlvbi4gVGhlIHdyYXBwZXIgZnVuY3Rpb24gcmVjZWl2ZXMsXG4gICAgICAgKiBhcyBpdHMgZmlyc3QgYXJndW1lbnQsIHRoZSBvcmlnaW5hbCBgdGFyZ2V0YCBvYmplY3QsIGZvbGxvd2VkIGJ5IGVhY2ggb2ZcbiAgICAgICAqIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSBvcmlnaW5hbCB0YXJnZXQgb2JqZWN0IHRoYXQgdGhlIHdyYXBwZWQgbWV0aG9kIGJlbG9uZ3MgdG8uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZXRob2RcbiAgICAgICAqICAgICAgICBUaGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuIFRoaXMgaXMgdXNlZCBhcyB0aGUgdGFyZ2V0IG9mIHRoZSBQcm94eVxuICAgICAgICogICAgICAgIG9iamVjdCB3aGljaCBpcyBjcmVhdGVkIHRvIHdyYXAgdGhlIG1ldGhvZC5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHdyYXBwZXJcbiAgICAgICAqICAgICAgICBUaGUgd3JhcHBlciBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgYSBkaXJlY3QgaW52b2NhdGlvblxuICAgICAgICogICAgICAgIG9mIHRoZSB3cmFwcGVkIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7UHJveHk8ZnVuY3Rpb24+fVxuICAgICAgICogICAgICAgIEEgUHJveHkgb2JqZWN0IGZvciB0aGUgZ2l2ZW4gbWV0aG9kLCB3aGljaCBpbnZva2VzIHRoZSBnaXZlbiB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIGl0cyBwbGFjZS5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgaGFzT3duUHJvcGVydHkgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIG9iamVjdCBpbiBhIFByb3h5IHdoaWNoIGludGVyY2VwdHMgYW5kIHdyYXBzIGNlcnRhaW4gbWV0aG9kc1xuICAgICAgICogYmFzZWQgb24gdGhlIGdpdmVuIGB3cmFwcGVyc2AgYW5kIGBtZXRhZGF0YWAgb2JqZWN0cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIHRhcmdldCBvYmplY3QgdG8gd3JhcC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW3dyYXBwZXJzID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyB3cmFwcGVyIGZ1bmN0aW9ucyBmb3Igc3BlY2lhbCBjYXNlcy4gQW55XG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcHJlc2VudCBpbiB0aGlzIG9iamVjdCB0cmVlIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiB0aGVcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlLiBUaGVzZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgbWV0aG9kcyBhcmUgaW52b2tlZCBhcyBkZXNjcmliZWQgaW4ge0BzZWUgd3JhcE1ldGhvZH0uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFttZXRhZGF0YSA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgbWV0YWRhdGEgdXNlZCB0byBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlXG4gICAgICAgKiAgICAgICAgUHJvbWlzZS1iYXNlZCB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYXN5bmNocm9ub3VzLiBBbnkgZnVuY3Rpb24gaW5cbiAgICAgICAqICAgICAgICB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUgd2hpY2ggaGFzIGEgY29ycmVzcG9uZGluZyBtZXRhZGF0YSBvYmplY3RcbiAgICAgICAqICAgICAgICBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYG1ldGFkYXRhYCB0cmVlIGlzIHJlcGxhY2VkIHdpdGggYW5cbiAgICAgICAqICAgICAgICBhdXRvbWF0aWNhbGx5LWdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLCBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAqICAgICAgICB7QHNlZSB3cmFwQXN5bmNGdW5jdGlvbn1cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7UHJveHk8b2JqZWN0Pn1cbiAgICAgICAqL1xuXG4gICAgICBjb25zdCB3cmFwT2JqZWN0ID0gKHRhcmdldCwgd3JhcHBlcnMgPSB7fSwgbWV0YWRhdGEgPSB7fSkgPT4ge1xuICAgICAgICBsZXQgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSB7XG4gICAgICAgICAgaGFzKHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQgfHwgcHJvcCBpbiBjYWNoZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIShwcm9wIGluIHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHdyYXBwZXJzW3Byb3BdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3BlY2lhbC1jYXNlIHdyYXBwZXIgZm9yIHRoaXMgbWV0aG9kLlxuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcnNbcHJvcF0pO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gYXN5bmMgbWV0aG9kIHRoYXQgd2UgaGF2ZSBtZXRhZGF0YSBmb3IuIENyZWF0ZSBhXG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSB3cmFwcGVyIGZvciBpdC5cbiAgICAgICAgICAgICAgICBsZXQgd3JhcHBlciA9IHdyYXBBc3luY0Z1bmN0aW9uKHByb3AsIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2QgdGhhdCB3ZSBkb24ndCBrbm93IG9yIGNhcmUgYWJvdXQuIFJldHVybiB0aGVcbiAgICAgICAgICAgICAgICAvLyBvcmlnaW5hbCBtZXRob2QsIGJvdW5kIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgKGhhc093blByb3BlcnR5KHdyYXBwZXJzLCBwcm9wKSB8fCBoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gb2JqZWN0IHRoYXQgd2UgbmVlZCB0byBkbyBzb21lIHdyYXBwaW5nIGZvciB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgICAgLy8gb2YuIENyZWF0ZSBhIHN1Yi1vYmplY3Qgd3JhcHBlciBmb3IgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgY2hpbGRcbiAgICAgICAgICAgICAgLy8gbWV0YWRhdGEuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIFwiKlwiKSkge1xuICAgICAgICAgICAgICAvLyBXcmFwIGFsbCBwcm9wZXJ0aWVzIGluICogbmFtZXNwYWNlLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtcIipcIl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgd3JhcHBpbmcgZm9yIHRoaXMgcHJvcGVydHksXG4gICAgICAgICAgICAgIC8vIHNvIGp1c3QgZm9yd2FyZCBhbGwgYWNjZXNzIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG5cbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBzZXQocHJveHlUYXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgY2FjaGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZGVsZXRlUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGNhY2hlLCBwcm9wKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfTsgLy8gUGVyIGNvbnRyYWN0IG9mIHRoZSBQcm94eSBBUEksIHRoZSBcImdldFwiIHByb3h5IGhhbmRsZXIgbXVzdCByZXR1cm4gdGhlXG4gICAgICAgIC8vIG9yaWdpbmFsIHZhbHVlIG9mIHRoZSB0YXJnZXQgaWYgdGhhdCB2YWx1ZSBpcyBkZWNsYXJlZCByZWFkLW9ubHkgYW5kXG4gICAgICAgIC8vIG5vbi1jb25maWd1cmFibGUuIEZvciB0aGlzIHJlYXNvbiwgd2UgY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZVxuICAgICAgICAvLyBwcm90b3R5cGUgc2V0IHRvIGB0YXJnZXRgIGluc3RlYWQgb2YgdXNpbmcgYHRhcmdldGAgZGlyZWN0bHkuXG4gICAgICAgIC8vIE90aGVyd2lzZSB3ZSBjYW5ub3QgcmV0dXJuIGEgY3VzdG9tIG9iamVjdCBmb3IgQVBJcyB0aGF0XG4gICAgICAgIC8vIGFyZSBkZWNsYXJlZCByZWFkLW9ubHkgYW5kIG5vbi1jb25maWd1cmFibGUsIHN1Y2ggYXMgYGNocm9tZS5kZXZ0b29sc2AuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZSBwcm94eSBoYW5kbGVycyB0aGVtc2VsdmVzIHdpbGwgc3RpbGwgdXNlIHRoZSBvcmlnaW5hbCBgdGFyZ2V0YFxuICAgICAgICAvLyBpbnN0ZWFkIG9mIHRoZSBgcHJveHlUYXJnZXRgLCBzbyB0aGF0IHRoZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGFyZVxuICAgICAgICAvLyBkZXJlZmVyZW5jZWQgdmlhIHRoZSBvcmlnaW5hbCB0YXJnZXRzLlxuXG4gICAgICAgIGxldCBwcm94eVRhcmdldCA9IE9iamVjdC5jcmVhdGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShwcm94eVRhcmdldCwgaGFuZGxlcnMpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIHNldCBvZiB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgb2JqZWN0LCB3aGljaCBoYW5kbGVzXG4gICAgICAgKiB3cmFwcGluZyBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdGhhdCB0aG9zZSBtZXNzYWdlcyBhcmUgcGFzc2VkLlxuICAgICAgICpcbiAgICAgICAqIEEgc2luZ2xlIHdyYXBwZXIgaXMgY3JlYXRlZCBmb3IgZWFjaCBsaXN0ZW5lciBmdW5jdGlvbiwgYW5kIHN0b3JlZCBpbiBhXG4gICAgICAgKiBtYXAuIFN1YnNlcXVlbnQgY2FsbHMgdG8gYGFkZExpc3RlbmVyYCwgYGhhc0xpc3RlbmVyYCwgb3IgYHJlbW92ZUxpc3RlbmVyYFxuICAgICAgICogcmV0cmlldmUgdGhlIG9yaWdpbmFsIHdyYXBwZXIsIHNvIHRoYXQgIGF0dGVtcHRzIHRvIHJlbW92ZSBhXG4gICAgICAgKiBwcmV2aW91c2x5LWFkZGVkIGxpc3RlbmVyIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtEZWZhdWx0V2Vha01hcDxmdW5jdGlvbiwgZnVuY3Rpb24+fSB3cmFwcGVyTWFwXG4gICAgICAgKiAgICAgICAgQSBEZWZhdWx0V2Vha01hcCBvYmplY3Qgd2hpY2ggd2lsbCBjcmVhdGUgdGhlIGFwcHJvcHJpYXRlIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBmb3IgYSBnaXZlbiBsaXN0ZW5lciBmdW5jdGlvbiB3aGVuIG9uZSBkb2VzIG5vdCBleGlzdCwgYW5kIHJldHJpZXZlXG4gICAgICAgKiAgICAgICAgYW4gZXhpc3Rpbmcgb25lIHdoZW4gaXQgZG9lcy5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICAgIHJldHVybiB0YXJnZXQuaGFzTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG5cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gb25SZXF1ZXN0RmluaXNoZWQocmVxKSB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZFJlcSA9IHdyYXBPYmplY3QocmVxLCB7fVxuICAgICAgICAgIC8qIHdyYXBwZXJzICovXG4gICAgICAgICAgLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGEgbWVzc2FnZSBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IG1heSBzZW5kIHJlc3BvbnNlcyBiYXNlZCBvblxuICAgICAgICAgKiBpdHMgcmV0dXJuIHZhbHVlLCByYXRoZXIgdGhhbiBieSByZXR1cm5pbmcgYSBzZW50aW5lbCB2YWx1ZSBhbmQgY2FsbGluZyBhXG4gICAgICAgICAqIGNhbGxiYWNrLiBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gcmV0dXJucyBhIFByb21pc2UsIHRoZSByZXNwb25zZSBpc1xuICAgICAgICAgKiBzZW50IHdoZW4gdGhlIHByb21pc2UgZWl0aGVyIHJlc29sdmVzIG9yIHJlamVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAgICAgKiAgICAgICAgVGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgb3RoZXIgZW5kIG9mIHRoZSBjaGFubmVsLlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VuZGVyXG4gICAgICAgICAqICAgICAgICBEZXRhaWxzIGFib3V0IHRoZSBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKil9IHNlbmRSZXNwb25zZVxuICAgICAgICAgKiAgICAgICAgQSBjYWxsYmFjayB3aGljaCwgd2hlbiBjYWxsZWQgd2l0aCBhbiBhcmJpdHJhcnkgYXJndW1lbnQsIHNlbmRzXG4gICAgICAgICAqICAgICAgICB0aGF0IHZhbHVlIGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiAgICAgICAgVHJ1ZSBpZiB0aGUgd3JhcHBlZCBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHdoaWNoIHdpbGwgbGF0ZXJcbiAgICAgICAgICogICAgICAgIHlpZWxkIGEgcmVzcG9uc2UuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAgICovXG5cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gb25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgbGV0IGRpZENhbGxTZW5kUmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgd3JhcHBlZFNlbmRSZXNwb25zZTtcbiAgICAgICAgICBsZXQgc2VuZFJlc3BvbnNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlZFNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBkaWRDYWxsU2VuZFJlc3BvbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIobWVzc2FnZSwgc2VuZGVyLCB3cmFwcGVkU2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7IC8vIElmIHRoZSBsaXN0ZW5lciBkaWRuJ3QgcmV0dXJuZWQgdHJ1ZSBvciBhIFByb21pc2UsIG9yIGNhbGxlZFxuICAgICAgICAgIC8vIHdyYXBwZWRTZW5kUmVzcG9uc2Ugc3luY2hyb25vdXNseSwgd2UgY2FuIGV4aXQgZWFybGllclxuICAgICAgICAgIC8vIGJlY2F1c2UgdGhlcmUgd2lsbCBiZSBubyByZXNwb25zZSBzZW50IGZyb20gdGhpcyBsaXN0ZW5lci5cblxuICAgICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgIWlzUmVzdWx0VGhlbmFibGUgJiYgIWRpZENhbGxTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG5cblxuICAgICAgICAgIGNvbnN0IHNlbmRQcm9taXNlZFJlc3VsdCA9IHByb21pc2UgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZS50aGVuKG1zZyA9PiB7XG4gICAgICAgICAgICAgIC8vIHNlbmQgdGhlIG1lc3NhZ2UgdmFsdWUuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZShtc2cpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAvLyBTZW5kIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaWYgdGhlIHJlamVjdGVkIHZhbHVlXG4gICAgICAgICAgICAgIC8vIGlzIGFuIGluc3RhbmNlIG9mIGVycm9yLCBvciB0aGUgb2JqZWN0IGl0c2VsZiBvdGhlcndpc2UuXG4gICAgICAgICAgICAgIGxldCBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIF9fbW96V2ViRXh0ZW5zaW9uUG9seWZpbGxSZWplY3RfXzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgLy8gUHJpbnQgYW4gZXJyb3Igb24gdGhlIGNvbnNvbGUgaWYgdW5hYmxlIHRvIHNlbmQgdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgb25NZXNzYWdlIHJlamVjdGVkIHJlcGx5XCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9OyAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCBzZW5kIHRoZSByZXNvbHZlZCB2YWx1ZSBhcyBhXG4gICAgICAgICAgLy8gcmVzdWx0LCBvdGhlcndpc2Ugd2FpdCB0aGUgcHJvbWlzZSByZWxhdGVkIHRvIHRoZSB3cmFwcGVkU2VuZFJlc3BvbnNlXG4gICAgICAgICAgLy8gY2FsbGJhY2sgdG8gcmVzb2x2ZSBhbmQgc2VuZCBpdCBhcyBhIHJlc3BvbnNlLlxuXG5cbiAgICAgICAgICBpZiAoaXNSZXN1bHRUaGVuYWJsZSkge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChzZW5kUmVzcG9uc2VQcm9taXNlKTtcbiAgICAgICAgICB9IC8vIExldCBDaHJvbWUga25vdyB0aGF0IHRoZSBsaXN0ZW5lciBpcyByZXBseWluZy5cblxuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2sgPSAoe1xuICAgICAgICByZWplY3QsXG4gICAgICAgIHJlc29sdmVcbiAgICAgIH0sIHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgLy8gRGV0ZWN0IHdoZW4gbm9uZSBvZiB0aGUgbGlzdGVuZXJzIHJlcGxpZWQgdG8gdGhlIHNlbmRNZXNzYWdlIGNhbGwgYW5kIHJlc29sdmVcbiAgICAgICAgICAvLyB0aGUgcHJvbWlzZSB0byB1bmRlZmluZWQgYXMgaW4gRmlyZWZveC5cbiAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2lzc3Vlcy8xMzBcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlID09PSBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVwbHkgJiYgcmVwbHkuX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fKSB7XG4gICAgICAgICAgLy8gQ29udmVydCBiYWNrIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpbnRvXG4gICAgICAgICAgLy8gYW4gRXJyb3IgaW5zdGFuY2UuXG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihyZXBseS5tZXNzYWdlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZENiID0gd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2suYmluZChudWxsLCB7XG4gICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXJncy5wdXNoKHdyYXBwZWRDYik7XG4gICAgICAgICAgYXBpTmFtZXNwYWNlT2JqLnNlbmRNZXNzYWdlKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07IC8vIFRoZSBidWlsZCBwcm9jZXNzIGFkZHMgYSBVTUQgd3JhcHBlciBhcm91bmQgdGhpcyBmaWxlLCB3aGljaCBtYWtlcyB0aGVcbiAgICAvLyBgbW9kdWxlYCB2YXJpYWJsZSBhdmFpbGFibGUuXG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiY29uc3QgbGlzdCA9IFtcblx0Ly8gTmF0aXZlIEVTIGVycm9ycyBodHRwczovLzI2Mi5lY21hLWludGVybmF0aW9uYWwub3JnLzEyLjAvI3NlYy13ZWxsLWtub3duLWludHJpbnNpYy1vYmplY3RzXG5cdEV2YWxFcnJvcixcblx0UmFuZ2VFcnJvcixcblx0UmVmZXJlbmNlRXJyb3IsXG5cdFN5bnRheEVycm9yLFxuXHRUeXBlRXJyb3IsXG5cdFVSSUVycm9yLFxuXG5cdC8vIEJ1aWx0LWluIGVycm9yc1xuXHRnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbixcblxuXHQvLyBOb2RlLXNwZWNpZmljIGVycm9yc1xuXHQvLyBodHRwczovL25vZGVqcy5vcmcvYXBpL2Vycm9ycy5odG1sXG5cdGdsb2JhbFRoaXMuQXNzZXJ0aW9uRXJyb3IsXG5cdGdsb2JhbFRoaXMuU3lzdGVtRXJyb3IsXG5dXG5cdC8vIE5vbi1uYXRpdmUgRXJyb3JzIGFyZSB1c2VkIHdpdGggYGdsb2JhbFRoaXNgIGJlY2F1c2UgdGhleSBtaWdodCBiZSBtaXNzaW5nLiBUaGlzIGZpbHRlciBkcm9wcyB0aGVtIHdoZW4gdW5kZWZpbmVkLlxuXHQuZmlsdGVyKEJvb2xlYW4pXG5cdC5tYXAoXG5cdFx0Y29uc3RydWN0b3IgPT4gW2NvbnN0cnVjdG9yLm5hbWUsIGNvbnN0cnVjdG9yXSxcblx0KTtcblxuY29uc3QgZXJyb3JDb25zdHJ1Y3RvcnMgPSBuZXcgTWFwKGxpc3QpO1xuXG5leHBvcnQgZGVmYXVsdCBlcnJvckNvbnN0cnVjdG9ycztcbiIsImltcG9ydCBlcnJvckNvbnN0cnVjdG9ycyBmcm9tICcuL2Vycm9yLWNvbnN0cnVjdG9ycy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBOb25FcnJvciBleHRlbmRzIEVycm9yIHtcblx0bmFtZSA9ICdOb25FcnJvcic7XG5cblx0Y29uc3RydWN0b3IobWVzc2FnZSkge1xuXHRcdHN1cGVyKE5vbkVycm9yLl9wcmVwYXJlU3VwZXJNZXNzYWdlKG1lc3NhZ2UpKTtcblx0fVxuXG5cdHN0YXRpYyBfcHJlcGFyZVN1cGVyTWVzc2FnZShtZXNzYWdlKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHJldHVybiBTdHJpbmcobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSBbXG5cdHtcblx0XHRwcm9wZXJ0eTogJ25hbWUnLFxuXHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdtZXNzYWdlJyxcblx0XHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0fSxcblx0e1xuXHRcdHByb3BlcnR5OiAnc3RhY2snLFxuXHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdjb2RlJyxcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHR9LFxuXHR7XG5cdFx0cHJvcGVydHk6ICdjYXVzZScsXG5cdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdH0sXG5dO1xuXG5jb25zdCB0b0pzb25XYXNDYWxsZWQgPSBuZXcgV2Vha1NldCgpO1xuXG5jb25zdCB0b0pTT04gPSBmcm9tID0+IHtcblx0dG9Kc29uV2FzQ2FsbGVkLmFkZChmcm9tKTtcblx0Y29uc3QganNvbiA9IGZyb20udG9KU09OKCk7XG5cdHRvSnNvbldhc0NhbGxlZC5kZWxldGUoZnJvbSk7XG5cdHJldHVybiBqc29uO1xufTtcblxuY29uc3QgZ2V0RXJyb3JDb25zdHJ1Y3RvciA9IG5hbWUgPT4gZXJyb3JDb25zdHJ1Y3RvcnMuZ2V0KG5hbWUpID8/IEVycm9yO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuY29uc3QgZGVzdHJveUNpcmN1bGFyID0gKHtcblx0ZnJvbSxcblx0c2Vlbixcblx0dG8sXG5cdGZvcmNlRW51bWVyYWJsZSxcblx0bWF4RGVwdGgsXG5cdGRlcHRoLFxuXHR1c2VUb0pTT04sXG5cdHNlcmlhbGl6ZSxcbn0pID0+IHtcblx0aWYgKCF0bykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGZyb20pKSB7XG5cdFx0XHR0byA9IFtdO1xuXHRcdH0gZWxzZSBpZiAoIXNlcmlhbGl6ZSAmJiBpc0Vycm9yTGlrZShmcm9tKSkge1xuXHRcdFx0Y29uc3QgRXJyb3IgPSBnZXRFcnJvckNvbnN0cnVjdG9yKGZyb20ubmFtZSk7XG5cdFx0XHR0byA9IG5ldyBFcnJvcigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0byA9IHt9O1xuXHRcdH1cblx0fVxuXG5cdHNlZW4ucHVzaChmcm9tKTtcblxuXHRpZiAoZGVwdGggPj0gbWF4RGVwdGgpIHtcblx0XHRyZXR1cm4gdG87XG5cdH1cblxuXHRpZiAodXNlVG9KU09OICYmIHR5cGVvZiBmcm9tLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJyAmJiAhdG9Kc29uV2FzQ2FsbGVkLmhhcyhmcm9tKSkge1xuXHRcdHJldHVybiB0b0pTT04oZnJvbSk7XG5cdH1cblxuXHRjb25zdCBjb250aW51ZURlc3Ryb3lDaXJjdWxhciA9IHZhbHVlID0+IGRlc3Ryb3lDaXJjdWxhcih7XG5cdFx0ZnJvbTogdmFsdWUsXG5cdFx0c2VlbjogWy4uLnNlZW5dLFxuXHRcdGZvcmNlRW51bWVyYWJsZSxcblx0XHRtYXhEZXB0aCxcblx0XHRkZXB0aCxcblx0XHR1c2VUb0pTT04sXG5cdFx0c2VyaWFsaXplLFxuXHR9KTtcblxuXHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhmcm9tKSkge1xuXHRcdGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSA9PT0gJ0J1ZmZlcicpIHtcblx0XHRcdHRvW2tleV0gPSAnW29iamVjdCBCdWZmZXJdJztcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IFVzZSBgc3RyZWFtLmlzUmVhZGFibGUoKWAgd2hlbiB0YXJnZXRpbmcgTm9kZS5qcyAxOC5cblx0XHRpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUucGlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dG9ba2V5XSA9ICdbb2JqZWN0IFN0cmVhbV0nO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG5cdFx0XHQvLyBHcmFjZWZ1bGx5IGhhbmRsZSBub24tY29uZmlndXJhYmxlIGVycm9ycyBsaWtlIGBET01FeGNlcHRpb25gLlxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9ba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSBjYXRjaCB7fVxuXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIXNlZW4uaW5jbHVkZXMoZnJvbVtrZXldKSkge1xuXHRcdFx0ZGVwdGgrKztcblx0XHRcdHRvW2tleV0gPSBjb250aW51ZURlc3Ryb3lDaXJjdWxhcihmcm9tW2tleV0pO1xuXG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHR0b1trZXldID0gJ1tDaXJjdWxhcl0nO1xuXHR9XG5cblx0Zm9yIChjb25zdCB7cHJvcGVydHksIGVudW1lcmFibGV9IG9mIGNvbW1vblByb3BlcnRpZXMpIHtcblx0XHRpZiAodHlwZW9mIGZyb21bcHJvcGVydHldICE9PSAndW5kZWZpbmVkJyAmJiBmcm9tW3Byb3BlcnR5XSAhPT0gbnVsbCkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBwcm9wZXJ0eSwge1xuXHRcdFx0XHR2YWx1ZTogaXNFcnJvckxpa2UoZnJvbVtwcm9wZXJ0eV0pID8gY29udGludWVEZXN0cm95Q2lyY3VsYXIoZnJvbVtwcm9wZXJ0eV0pIDogZnJvbVtwcm9wZXJ0eV0sXG5cdFx0XHRcdGVudW1lcmFibGU6IGZvcmNlRW51bWVyYWJsZSA/IHRydWUgOiBlbnVtZXJhYmxlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKHZhbHVlLCBvcHRpb25zID0ge30pIHtcblx0Y29uc3Qge1xuXHRcdG1heERlcHRoID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuXHRcdHVzZVRvSlNPTiA9IHRydWUsXG5cdH0gPSBvcHRpb25zO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0cmV0dXJuIGRlc3Ryb3lDaXJjdWxhcih7XG5cdFx0XHRmcm9tOiB2YWx1ZSxcblx0XHRcdHNlZW46IFtdLFxuXHRcdFx0Zm9yY2VFbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0bWF4RGVwdGgsXG5cdFx0XHRkZXB0aDogMCxcblx0XHRcdHVzZVRvSlNPTixcblx0XHRcdHNlcmlhbGl6ZTogdHJ1ZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIFBlb3BsZSBzb21ldGltZXMgdGhyb3cgdGhpbmdzIGJlc2lkZXMgRXJyb3Igb2JqZWN0c+KAplxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gYEpTT04uc3RyaW5naWZ5KClgIGRpc2NhcmRzIGZ1bmN0aW9ucy4gV2UgZG8gdG9vLCB1bmxlc3MgYSBmdW5jdGlvbiBpcyB0aHJvd24gZGlyZWN0bHkuXG5cdFx0Ly8gV2UgaW50ZW50aW9uYWxseSB1c2UgYHx8YCBiZWNhdXNlIGAubmFtZWAgaXMgYW4gZW1wdHkgc3RyaW5nIGZvciBhbm9ueW1vdXMgZnVuY3Rpb25zLlxuXHRcdHJldHVybiBgW0Z1bmN0aW9uOiAke3ZhbHVlLm5hbWUgfHwgJ2Fub255bW91cyd9XWA7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXNlcmlhbGl6ZUVycm9yKHZhbHVlLCBvcHRpb25zID0ge30pIHtcblx0Y29uc3Qge21heERlcHRoID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSA9IG9wdGlvbnM7XG5cblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRpZiAoaXNNaW5pbXVtVmlhYmxlU2VyaWFsaXplZEVycm9yKHZhbHVlKSkge1xuXHRcdGNvbnN0IEVycm9yID0gZ2V0RXJyb3JDb25zdHJ1Y3Rvcih2YWx1ZS5uYW1lKTtcblx0XHRyZXR1cm4gZGVzdHJveUNpcmN1bGFyKHtcblx0XHRcdGZyb206IHZhbHVlLFxuXHRcdFx0c2VlbjogW10sXG5cdFx0XHR0bzogbmV3IEVycm9yKCksXG5cdFx0XHRtYXhEZXB0aCxcblx0XHRcdGRlcHRoOiAwLFxuXHRcdFx0c2VyaWFsaXplOiBmYWxzZSxcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBuZXcgTm9uRXJyb3IodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcnJvckxpa2UodmFsdWUpIHtcblx0cmV0dXJuIEJvb2xlYW4odmFsdWUpXG5cdCYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblx0JiYgJ25hbWUnIGluIHZhbHVlXG5cdCYmICdtZXNzYWdlJyBpbiB2YWx1ZVxuXHQmJiAnc3RhY2snIGluIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc01pbmltdW1WaWFibGVTZXJpYWxpemVkRXJyb3IodmFsdWUpIHtcblx0cmV0dXJuIEJvb2xlYW4odmFsdWUpXG5cdCYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblx0JiYgJ21lc3NhZ2UnIGluIHZhbHVlXG5cdCYmICFBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuZXhwb3J0IHtkZWZhdWx0IGFzIGVycm9yQ29uc3RydWN0b3JzfSBmcm9tICcuL2Vycm9yLWNvbnN0cnVjdG9ycy5qcyc7XG4iLCJ2YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZGVmUHJvcHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbnZhciBfX2dldE93blByb3BEZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xudmFyIF9fZ2V0T3duUHJvcFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19wcm9wSXNFbnVtID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBfX2RlZk5vcm1hbFByb3AgPSAob2JqLCBrZXksIHZhbHVlKSA9PiBrZXkgaW4gb2JqID8gX19kZWZQcm9wKG9iaiwga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlIH0pIDogb2JqW2tleV0gPSB2YWx1ZTtcbnZhciBfX3NwcmVhZFZhbHVlcyA9IChhLCBiKSA9PiB7XG4gIGZvciAodmFyIHByb3AgaW4gYiB8fCAoYiA9IHt9KSlcbiAgICBpZiAoX19oYXNPd25Qcm9wLmNhbGwoYiwgcHJvcCkpXG4gICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gIGlmIChfX2dldE93blByb3BTeW1ib2xzKVxuICAgIGZvciAodmFyIHByb3Agb2YgX19nZXRPd25Qcm9wU3ltYm9scyhiKSkge1xuICAgICAgaWYgKF9fcHJvcElzRW51bS5jYWxsKGIsIHByb3ApKVxuICAgICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gICAgfVxuICByZXR1cm4gYTtcbn07XG52YXIgX19zcHJlYWRQcm9wcyA9IChhLCBiKSA9PiBfX2RlZlByb3BzKGEsIF9fZ2V0T3duUHJvcERlc2NzKGIpKTtcbnZhciBfX29ialJlc3QgPSAoc291cmNlLCBleGNsdWRlKSA9PiB7XG4gIHZhciB0YXJnZXQgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpXG4gICAgaWYgKF9faGFzT3duUHJvcC5jYWxsKHNvdXJjZSwgcHJvcCkgJiYgZXhjbHVkZS5pbmRleE9mKHByb3ApIDwgMClcbiAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgaWYgKHNvdXJjZSAhPSBudWxsICYmIF9fZ2V0T3duUHJvcFN5bWJvbHMpXG4gICAgZm9yICh2YXIgcHJvcCBvZiBfX2dldE93blByb3BTeW1ib2xzKHNvdXJjZSkpIHtcbiAgICAgIGlmIChleGNsdWRlLmluZGV4T2YocHJvcCkgPCAwICYmIF9fcHJvcElzRW51bS5jYWxsKHNvdXJjZSwgcHJvcCkpXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xudmFyIF9fYXN5bmMgPSAoX190aGlzLCBfX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdmFyIGZ1bGZpbGxlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVqZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yLnRocm93KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzdGVwID0gKHgpID0+IHguZG9uZSA/IHJlc29sdmUoeC52YWx1ZSkgOiBQcm9taXNlLnJlc29sdmUoeC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTtcbiAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkoX190aGlzLCBfX2FyZ3VtZW50cykpLm5leHQoKSk7XG4gIH0pO1xufTtcblxuLy8gc3JjL2dlbmVyaWMudHNcbmltcG9ydCB7IHNlcmlhbGl6ZUVycm9yLCBkZXNlcmlhbGl6ZUVycm9yIH0gZnJvbSBcInNlcmlhbGl6ZS1lcnJvclwiO1xuZnVuY3Rpb24gZGVmaW5lR2VuZXJpY01lc3NhbmdpbmcoY29uZmlnKSB7XG4gIGxldCByZW1vdmVSb290TGlzdGVuZXI7XG4gIGxldCBwZXJUeXBlTGlzdGVuZXJzID0ge307XG4gIGZ1bmN0aW9uIGNsZWFudXBSb290TGlzdGVuZXIoKSB7XG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKHBlclR5cGVMaXN0ZW5lcnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmVtb3ZlUm9vdExpc3RlbmVyID09IG51bGwgPyB2b2lkIDAgOiByZW1vdmVSb290TGlzdGVuZXIoKTtcbiAgICAgIHJlbW92ZVJvb3RMaXN0ZW5lciA9IHZvaWQgMDtcbiAgICB9XG4gIH1cbiAgbGV0IGlkU2VxID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU0KTtcbiAgZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICAgIHJldHVybiBpZFNlcSsrO1xuICB9XG4gIHJldHVybiB7XG4gICAgc2VuZE1lc3NhZ2UodHlwZSwgZGF0YSwgLi4uYXJncykge1xuICAgICAgcmV0dXJuIF9fYXN5bmModGhpcywgbnVsbCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hMiwgX2IsIF9jLCBfZDtcbiAgICAgICAgY29uc3QgX21lc3NhZ2UgPSB7XG4gICAgICAgICAgaWQ6IGdldE5leHRJZCgpLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IChfYiA9IHlpZWxkIChfYTIgPSBjb25maWcudmVyaWZ5TWVzc2FnZURhdGEpID09IG51bGwgPyB2b2lkIDAgOiBfYTIuY2FsbChjb25maWcsIF9tZXNzYWdlKSkgIT0gbnVsbCA/IF9iIDogX21lc3NhZ2U7XG4gICAgICAgIChfYyA9IGNvbmZpZy5sb2dnZXIpID09IG51bGwgPyB2b2lkIDAgOiBfYy5kZWJ1ZyhgW21lc3NhZ2luZ10gc2VuZE1lc3NhZ2Uge2lkPSR7bWVzc2FnZS5pZH19IFxcdTI1MDBcXHUxNDA1YCwgbWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgY29uZmlnLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICBjb25zdCB7IHJlcywgZXJyIH0gPSByZXNwb25zZSAhPSBudWxsID8gcmVzcG9uc2UgOiB7IGVycjogbmV3IEVycm9yKFwiTm8gcmVzcG9uc2VcIikgfTtcbiAgICAgICAgKF9kID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9kLmRlYnVnKGBbbWVzc2FnaW5nXSBzZW5kTWVzc2FnZSB7aWQ9JHttZXNzYWdlLmlkfX0gXFx1MTQwQVxcdTI1MDBgLCB7IHJlcywgZXJyIH0pO1xuICAgICAgICBpZiAoZXJyICE9IG51bGwpXG4gICAgICAgICAgdGhyb3cgZGVzZXJpYWxpemVFcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbk1lc3NhZ2UodHlwZSwgb25SZWNlaXZlZCkge1xuICAgICAgdmFyIF9hMiwgX2IsIF9jO1xuICAgICAgaWYgKHJlbW92ZVJvb3RMaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgIChfYTIgPSBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2EyLmRlYnVnKFxuICAgICAgICAgIGBbbWVzc2FnaW5nXSBcIiR7dHlwZX1cIiBpbml0aWFsaXplZCB0aGUgbWVzc2FnZSBsaXN0ZW5lciBmb3IgdGhpcyBjb250ZXh0YFxuICAgICAgICApO1xuICAgICAgICByZW1vdmVSb290TGlzdGVuZXIgPSBjb25maWcuYWRkUm9vdExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgdmFyIF9hMywgX2IyO1xuICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS50eXBlICE9IFwic3RyaW5nXCIgfHwgdHlwZW9mIG1lc3NhZ2UudGltZXN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmJyZWFrRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIGBbbWVzc2FnaW5nXSBVbmtub3duIG1lc3NhZ2UgZm9ybWF0LCBtdXN0IGluY2x1ZGUgdGhlICd0eXBlJyAmICd0aW1lc3RhbXAnIGZpZWxkcywgcmVjZWl2ZWQ6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICApfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAoX2EzID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9hMy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICAoX2IyID0gY29uZmlnID09IG51bGwgPyB2b2lkIDAgOiBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2IyLmRlYnVnKFwiW21lc3NhZ2luZ10gUmVjZWl2ZWQgbWVzc2FnZVwiLCBtZXNzYWdlKTtcbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHBlclR5cGVMaXN0ZW5lcnNbbWVzc2FnZS50eXBlXTtcbiAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjb25zdCByZXMgPSBsaXN0ZW5lcihtZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcykudGhlbigocmVzMikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hNCwgX2IzO1xuICAgICAgICAgICAgcmV0dXJuIChfYjMgPSAoX2E0ID0gY29uZmlnLnZlcmlmeU1lc3NhZ2VEYXRhKSA9PSBudWxsID8gdm9pZCAwIDogX2E0LmNhbGwoY29uZmlnLCByZXMyKSkgIT0gbnVsbCA/IF9iMyA6IHJlczI7XG4gICAgICAgICAgfSkudGhlbigocmVzMikgPT4ge1xuICAgICAgICAgICAgdmFyIF9hNDtcbiAgICAgICAgICAgIChfYTQgPSBjb25maWcgPT0gbnVsbCA/IHZvaWQgMCA6IGNvbmZpZy5sb2dnZXIpID09IG51bGwgPyB2b2lkIDAgOiBfYTQuZGVidWcoYFttZXNzYWdpbmddIG9uTWVzc2FnZSB7aWQ9JHttZXNzYWdlLmlkfX0gXFx1MjUwMFxcdTE0MDVgLCB7IHJlczogcmVzMiB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IHJlczogcmVzMiB9O1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTQ7XG4gICAgICAgICAgICAoX2E0ID0gY29uZmlnID09IG51bGwgPyB2b2lkIDAgOiBjb25maWcubG9nZ2VyKSA9PSBudWxsID8gdm9pZCAwIDogX2E0LmRlYnVnKGBbbWVzc2FnaW5nXSBvbk1lc3NhZ2Uge2lkPSR7bWVzc2FnZS5pZH19IFxcdTI1MDBcXHUxNDA1YCwgeyBlcnIgfSk7XG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IHNlcmlhbGl6ZUVycm9yKGVycikgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAocGVyVHlwZUxpc3RlbmVyc1t0eXBlXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVyciA9IEVycm9yKFxuICAgICAgICAgIGBbbWVzc2FnaW5nXSBJbiB0aGlzIEpTIGNvbnRleHQsIG9ubHkgb25lIGxpc3RlbmVyIGNhbiBiZSBzZXR1cCBmb3IgJHt0eXBlfWBcbiAgICAgICAgKTtcbiAgICAgICAgKF9iID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9iLmVycm9yKGVycik7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICAgIHBlclR5cGVMaXN0ZW5lcnNbdHlwZV0gPSBvblJlY2VpdmVkO1xuICAgICAgKF9jID0gY29uZmlnLmxvZ2dlcikgPT0gbnVsbCA/IHZvaWQgMCA6IF9jLmxvZyhgW21lc3NhZ2luZ10gQWRkZWQgbGlzdGVuZXIgZm9yICR7dHlwZX1gKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBwZXJUeXBlTGlzdGVuZXJzW3R5cGVdO1xuICAgICAgICBjbGVhbnVwUm9vdExpc3RlbmVyKCk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzKCkge1xuICAgICAgT2JqZWN0LmtleXMocGVyVHlwZUxpc3RlbmVycykuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBkZWxldGUgcGVyVHlwZUxpc3RlbmVyc1t0eXBlXTtcbiAgICAgIH0pO1xuICAgICAgY2xlYW51cFJvb3RMaXN0ZW5lcigpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgX19zcHJlYWRWYWx1ZXMsXG4gIF9fc3ByZWFkUHJvcHMsXG4gIF9fb2JqUmVzdCxcbiAgX19hc3luYyxcbiAgZGVmaW5lR2VuZXJpY01lc3Nhbmdpbmdcbn07XG4iLCJpbXBvcnQge1xuICBfX3NwcmVhZFByb3BzLFxuICBfX3NwcmVhZFZhbHVlcyxcbiAgZGVmaW5lR2VuZXJpY01lc3Nhbmdpbmdcbn0gZnJvbSBcIi4vY2h1bmstQlFMRlNGRlouanNcIjtcblxuLy8gc3JjL2V4dGVuc2lvbi50c1xuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuZnVuY3Rpb24gZGVmaW5lRXh0ZW5zaW9uTWVzc2FnaW5nKGNvbmZpZykge1xuICByZXR1cm4gZGVmaW5lR2VuZXJpY01lc3NhbmdpbmcoX19zcHJlYWRQcm9wcyhfX3NwcmVhZFZhbHVlcyh7fSwgY29uZmlnKSwge1xuICAgIHNlbmRNZXNzYWdlKG1lc3NhZ2UsIGFyZykge1xuICAgICAgaWYgKGFyZyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBCcm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBjb25zdCBvcHRpb25zID0gdHlwZW9mIGFyZyA9PT0gXCJudW1iZXJcIiA/IHsgdGFiSWQ6IGFyZyB9IDogYXJnO1xuICAgICAgcmV0dXJuIEJyb3dzZXIudGFicy5zZW5kTWVzc2FnZShcbiAgICAgICAgb3B0aW9ucy50YWJJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgLy8gUGFzcyBmcmFtZUlkIGlmIHNwZWNpZmllZFxuICAgICAgICBvcHRpb25zLmZyYW1lSWQgIT0gbnVsbCA/IHsgZnJhbWVJZDogb3B0aW9ucy5mcmFtZUlkIH0gOiB2b2lkIDBcbiAgICAgICk7XG4gICAgfSxcbiAgICBhZGRSb290TGlzdGVuZXIocHJvY2Vzc01lc3NhZ2UpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gKG1lc3NhZ2UsIHNlbmRlcikgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09IFwib2JqZWN0XCIpXG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NNZXNzYWdlKF9fc3ByZWFkUHJvcHMoX19zcHJlYWRWYWx1ZXMoe30sIG1lc3NhZ2UpLCB7IHNlbmRlciB9KSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gcHJvY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICB9O1xuICAgICAgQnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICByZXR1cm4gKCkgPT4gQnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgfVxuICB9KSk7XG59XG5leHBvcnQge1xuICBkZWZpbmVFeHRlbnNpb25NZXNzYWdpbmdcbn07XG4iLCIvKiFcbiAqIGlzb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pc29iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheSh2YWwpID09PSBmYWxzZTtcbn07XG4iLCIvKiFcbiAqIGdldC12YWx1ZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZ2V0LXZhbHVlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE4LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBpc09iamVjdCA9IHJlcXVpcmUoJ2lzb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBwYXRoLCBvcHRpb25zKSB7XG4gIGlmICghaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBvcHRpb25zID0geyBkZWZhdWx0OiBvcHRpb25zIH07XG4gIH1cblxuICBpZiAoIWlzVmFsaWRPYmplY3QodGFyZ2V0KSkge1xuICAgIHJldHVybiB0eXBlb2Ygb3B0aW9ucy5kZWZhdWx0ICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuZGVmYXVsdCA6IHRhcmdldDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gJ251bWJlcicpIHtcbiAgICBwYXRoID0gU3RyaW5nKHBhdGgpO1xuICB9XG5cbiAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkocGF0aCk7XG4gIGNvbnN0IGlzU3RyaW5nID0gdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnO1xuICBjb25zdCBzcGxpdENoYXIgPSBvcHRpb25zLnNlcGFyYXRvciB8fCAnLic7XG4gIGNvbnN0IGpvaW5DaGFyID0gb3B0aW9ucy5qb2luQ2hhciB8fCAodHlwZW9mIHNwbGl0Q2hhciA9PT0gJ3N0cmluZycgPyBzcGxpdENoYXIgOiAnLicpO1xuXG4gIGlmICghaXNTdHJpbmcgJiYgIWlzQXJyYXkpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nICYmIHBhdGggaW4gdGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzVmFsaWQocGF0aCwgdGFyZ2V0LCBvcHRpb25zKSA/IHRhcmdldFtwYXRoXSA6IG9wdGlvbnMuZGVmYXVsdDtcbiAgfVxuXG4gIGxldCBzZWdzID0gaXNBcnJheSA/IHBhdGggOiBzcGxpdChwYXRoLCBzcGxpdENoYXIsIG9wdGlvbnMpO1xuICBsZXQgbGVuID0gc2Vncy5sZW5ndGg7XG4gIGxldCBpZHggPSAwO1xuXG4gIGRvIHtcbiAgICBsZXQgcHJvcCA9IHNlZ3NbaWR4XTtcbiAgICBpZiAodHlwZW9mIHByb3AgPT09ICdudW1iZXInKSB7XG4gICAgICBwcm9wID0gU3RyaW5nKHByb3ApO1xuICAgIH1cblxuICAgIHdoaWxlIChwcm9wICYmIHByb3Auc2xpY2UoLTEpID09PSAnXFxcXCcpIHtcbiAgICAgIHByb3AgPSBqb2luKFtwcm9wLnNsaWNlKDAsIC0xKSwgc2Vnc1srK2lkeF0gfHwgJyddLCBqb2luQ2hhciwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoIWlzVmFsaWQocHJvcCwgdGFyZ2V0LCBvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5kZWZhdWx0O1xuICAgICAgfVxuXG4gICAgICB0YXJnZXQgPSB0YXJnZXRbcHJvcF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBoYXNQcm9wID0gZmFsc2U7XG4gICAgICBsZXQgbiA9IGlkeCArIDE7XG5cbiAgICAgIHdoaWxlIChuIDwgbGVuKSB7XG4gICAgICAgIHByb3AgPSBqb2luKFtwcm9wLCBzZWdzW24rK11dLCBqb2luQ2hhciwgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKChoYXNQcm9wID0gcHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgaWYgKCFpc1ZhbGlkKHByb3AsIHRhcmdldCwgb3B0aW9ucykpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmRlZmF1bHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgIGlkeCA9IG4gLSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaGFzUHJvcCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5kZWZhdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAoKytpZHggPCBsZW4gJiYgaXNWYWxpZE9iamVjdCh0YXJnZXQpKTtcblxuICBpZiAoaWR4ID09PSBsZW4pIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnMuZGVmYXVsdDtcbn07XG5cbmZ1bmN0aW9uIGpvaW4oc2Vncywgam9pbkNoYXIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmpvaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5qb2luKHNlZ3MpO1xuICB9XG4gIHJldHVybiBzZWdzWzBdICsgam9pbkNoYXIgKyBzZWdzWzFdO1xufVxuXG5mdW5jdGlvbiBzcGxpdChwYXRoLCBzcGxpdENoYXIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLnNwbGl0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuc3BsaXQocGF0aCk7XG4gIH1cbiAgcmV0dXJuIHBhdGguc3BsaXQoc3BsaXRDaGFyKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZChrZXksIHRhcmdldCwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMuaXNWYWxpZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBvcHRpb25zLmlzVmFsaWQoa2V5LCB0YXJnZXQpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkT2JqZWN0KHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSB8fCBBcnJheS5pc0FycmF5KHZhbCkgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsInZhciBfX2FzeW5jID0gKF9fdGhpcywgX19hcmd1bWVudHMsIGdlbmVyYXRvcikgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHZhciBmdWxmaWxsZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlamVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvci50aHJvdyh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgc3RlcCA9ICh4KSA9PiB4LmRvbmUgPyByZXNvbHZlKHgudmFsdWUpIDogUHJvbWlzZS5yZXNvbHZlKHgudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7XG4gICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KF9fdGhpcywgX19hcmd1bWVudHMpKS5uZXh0KCkpO1xuICB9KTtcbn07XG5cbi8vIHNyYy9pc0JhY2tncm91bmQudHNcbmltcG9ydCBCcm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbmZ1bmN0aW9uIGlzQmFja2dyb3VuZCgpIHtcbiAgaWYgKCFjYW5BY2Nlc3NFeHRlbnNpb25BcGkoKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IG1hbmlmZXN0ID0gQnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCk7XG4gIGlmICghbWFuaWZlc3QuYmFja2dyb3VuZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBtYW5pZmVzdC5tYW5pZmVzdF92ZXJzaW9uID09PSAzID8gaXNCYWNrZ3JvdW5kU2VydmljZVdvcmtlcigpIDogaXNCYWNrZ3JvdW5kUGFnZSgpO1xufVxuZnVuY3Rpb24gY2FuQWNjZXNzRXh0ZW5zaW9uQXBpKCkge1xuICB2YXIgX2E7XG4gIHJldHVybiAhISgoX2EgPSBCcm93c2VyLnJ1bnRpbWUpID09IG51bGwgPyB2b2lkIDAgOiBfYS5pZCk7XG59XG52YXIgS05PV05fQkFDS0dST1VORF9QQUdFX1BBVEhOQU1FUyA9IFtcbiAgLy8gRmlyZWZveFxuICBcIi9fZ2VuZXJhdGVkX2JhY2tncm91bmRfcGFnZS5odG1sXCJcbl07XG5mdW5jdGlvbiBpc0JhY2tncm91bmRQYWdlKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBLTk9XTl9CQUNLR1JPVU5EX1BBR0VfUEFUSE5BTUVTLmluY2x1ZGVzKGxvY2F0aW9uLnBhdGhuYW1lKTtcbn1cbmZ1bmN0aW9uIGlzQmFja2dyb3VuZFNlcnZpY2VXb3JrZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiO1xufVxuXG4vLyBzcmMvZGVmaW5lUHJveHlTZXJ2aWNlLnRzXG5pbXBvcnQgeyBkZWZpbmVFeHRlbnNpb25NZXNzYWdpbmcgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL21lc3NhZ2luZ1wiO1xuaW1wb3J0IGdldCBmcm9tIFwiZ2V0LXZhbHVlXCI7XG5mdW5jdGlvbiBkZWZpbmVQcm94eVNlcnZpY2UobmFtZSwgaW5pdCwgY29uZmlnKSB7XG4gIGxldCBzZXJ2aWNlO1xuICBjb25zdCBtZXNzYWdlS2V5ID0gYHByb3h5LXNlcnZpY2UuJHtuYW1lfWA7XG4gIGNvbnN0IHsgb25NZXNzYWdlLCBzZW5kTWVzc2FnZSB9ID0gZGVmaW5lRXh0ZW5zaW9uTWVzc2FnaW5nKGNvbmZpZyk7XG4gIGZ1bmN0aW9uIGNyZWF0ZVByb3h5KHBhdGgpIHtcbiAgICBjb25zdCB3cmFwcGVkID0gKCkgPT4ge1xuICAgIH07XG4gICAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkod3JhcHBlZCwge1xuICAgICAgLy8gRXhlY3V0ZWQgd2hlbiB0aGUgb2JqZWN0IGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uXG4gICAgICBhcHBseShfdGFyZ2V0LCBfdGhpc0FyZywgYXJncykge1xuICAgICAgICByZXR1cm4gX19hc3luYyh0aGlzLCBudWxsLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHNlbmRNZXNzYWdlKG1lc3NhZ2VLZXksIHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBhcmdzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgLy8gRXhlY3V0ZWQgd2hlbiBhY2Nlc3NpbmcgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3RcbiAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5TmFtZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gXCJfX3Byb3h5XCIgfHwgdHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5TmFtZSwgcmVjZWl2ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVQcm94eShwYXRoID09IG51bGwgPyBwcm9wZXJ0eU5hbWUgOiBgJHtwYXRofS4ke3Byb3BlcnR5TmFtZX1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm94eS5fX3Byb3h5ID0gdHJ1ZTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH1cbiAgcmV0dXJuIFtcbiAgICBmdW5jdGlvbiByZWdpc3RlclNlcnZpY2UoLi4uYXJncykge1xuICAgICAgc2VydmljZSA9IGluaXQoLi4uYXJncyk7XG4gICAgICBvbk1lc3NhZ2UobWVzc2FnZUtleSwgKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGRhdGEucGF0aCA9PSBudWxsID8gc2VydmljZSA6IGdldChzZXJ2aWNlICE9IG51bGwgPyBzZXJ2aWNlIDoge30sIGRhdGEucGF0aCk7XG4gICAgICAgIGlmIChtZXRob2QpXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtZXRob2QuYmluZChzZXJ2aWNlKSguLi5kYXRhLmFyZ3MpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSxcbiAgICBmdW5jdGlvbiBnZXRTZXJ2aWNlKCkge1xuICAgICAgaWYgKCFpc0JhY2tncm91bmQoKSlcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVByb3h5KCk7XG4gICAgICBpZiAoc2VydmljZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIGBGYWlsZWQgdG8gZ2V0IGFuIGluc3RhbmNlIG9mICR7bmFtZX06IGluIGJhY2tncm91bmQsIGJ1dCByZWdpc3RlclNlcnZpY2UgaGFzIG5vdCBiZWVuIGNhbGxlZC4gRGlkIHlvdSBmb3JnZXQgdG8gY2FsbCByZWdpc3RlclNlcnZpY2U/YFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICBdO1xufVxuXG4vLyBzcmMvZmxhdHRlblByb21pc2UudHNcbmltcG9ydCBnZXQyIGZyb20gXCJnZXQtdmFsdWVcIjtcbmZ1bmN0aW9uIGZsYXR0ZW5Qcm9taXNlKHByb21pc2UpIHtcbiAgZnVuY3Rpb24gY3JlYXRlUHJveHkobG9jYXRpb24yKSB7XG4gICAgY29uc3Qgd3JhcHBlZCA9ICgpID0+IHtcbiAgICB9O1xuICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHdyYXBwZWQsIHtcbiAgICAgIGFwcGx5KF90YXJnZXQsIF90aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBfX2FzeW5jKHRoaXMsIG51bGwsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgY29uc3QgdCA9IHlpZWxkIHByb21pc2U7XG4gICAgICAgICAgY29uc3QgdGhpc0FyZyA9IChsb2NhdGlvbjIgPT0gbnVsbCA/IHZvaWQgMCA6IGxvY2F0aW9uMi5wYXJlbnRQYXRoKSA/IGdldDIodCwgbG9jYXRpb24yLnBhcmVudFBhdGgpIDogdDtcbiAgICAgICAgICBjb25zdCBmbiA9IGxvY2F0aW9uMiA/IGdldDIodCwgbG9jYXRpb24yLnByb3BlcnR5UGF0aCkgOiB0O1xuICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgLy8gRXhlY3V0ZWQgd2hlbiBhY2Nlc3NpbmcgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3RcbiAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5TmFtZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gXCJfX3Byb3h5XCIgfHwgdHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5TmFtZSwgcmVjZWl2ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVQcm94eSh7XG4gICAgICAgICAgcHJvcGVydHlQYXRoOiBsb2NhdGlvbjIgPT0gbnVsbCA/IHByb3BlcnR5TmFtZSA6IGAke2xvY2F0aW9uMi5wcm9wZXJ0eVBhdGh9LiR7cHJvcGVydHlOYW1lfWAsXG4gICAgICAgICAgcGFyZW50UGF0aDogbG9jYXRpb24yID09IG51bGwgPyB2b2lkIDAgOiBsb2NhdGlvbjIucHJvcGVydHlQYXRoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByb3h5Ll9fcHJveHkgPSB0cnVlO1xuICAgIHJldHVybiBwcm94eTtcbiAgfVxuICByZXR1cm4gY3JlYXRlUHJveHkoKTtcbn1cbmV4cG9ydCB7XG4gIGRlZmluZVByb3h5U2VydmljZSxcbiAgZmxhdHRlblByb21pc2Vcbn07XG4iLCJpbXBvcnQgeyBkZWZpbmVQcm94eVNlcnZpY2UgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL3Byb3h5LXNlcnZpY2VcIjtcbmltcG9ydCB0eXBlIHsgVGltZUxpbWl0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEV4dGVuc2lvbkRhdGFiYXNlIH0gZnJvbSBcIi4vZGF0YWJhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUaW1lTGltaXRzU2VydmljZSB7XG4gICAgZ2V0QWxsKCk6IFByb21pc2U8VGltZUxpbWl0c1tdPjtcbiAgICBnZXQoaWQ6IHN0cmluZyk6IFByb21pc2U8VGltZUxpbWl0cyB8IHVuZGVmaW5lZD47XG4gICAgY3JlYXRlKGluZm86IFRpbWVMaW1pdHMpOiBQcm9taXNlPHZvaWQ+O1xuICAgIHVwZGF0ZShpbmZvOiBUaW1lTGltaXRzKTogUHJvbWlzZTx2b2lkPjtcbiAgICBkZWxldGUoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD5cbn1cblxuZnVuY3Rpb24gY3JlYXRlVGltZUxpbWl0c1NlcnZpY2UoX2RiOiBQcm9taXNlPEV4dGVuc2lvbkRhdGFiYXNlPik6IFRpbWVMaW1pdHNTZXJ2aWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3luYyBnZXRBbGwoKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBkYi5nZXRBbGwoXCJ0aW1lbGltaXRzXCIpO1xuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXQoaWQ/OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGRiLmdldChcInRpbWVsaW1pdHNcIiwgaWQgPz8gXCJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGNyZWF0ZShpbmZvKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGF3YWl0IGRiLmFkZChcInRpbWVsaW1pdHNcIiwgaW5mbyk7XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIHVwZGF0ZShpbmZvKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGF3YWl0IGRiLnB1dChcInRpbWVsaW1pdHNcIiwgaW5mbyk7XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGRlbGV0ZShob3N0bmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGF3YWl0IGRiLmRlbGV0ZShcInRpbWVsaW1pdHNcIiwgaG9zdG5hbWUpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBbcmVnaXN0ZXJUaW1lTGltaXRzU2VydmljZSwgZ2V0VGltZUxpbWl0c1NlcnZpY2VdID0gZGVmaW5lUHJveHlTZXJ2aWNlKFxuICAgIFwidGltZWxpbWl0cy1zZXJ2aWNlXCIsXG4gICAgY3JlYXRlVGltZUxpbWl0c1NlcnZpY2UsXG4pOyIsIi8vIHNyYy9icm93c2VyLnRzXG5pbXBvcnQgb3JpZ2luYWxCcm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbnZhciBicm93c2VyID0gb3JpZ2luYWxCcm93c2VyO1xuXG5leHBvcnQge1xuICBicm93c2VyXG59O1xuIiwiY29uc3QgaW5zdGFuY2VPZkFueSA9IChvYmplY3QsIGNvbnN0cnVjdG9ycykgPT4gY29uc3RydWN0b3JzLnNvbWUoKGMpID0+IG9iamVjdCBpbnN0YW5jZW9mIGMpO1xuXG5sZXQgaWRiUHJveHlhYmxlVHlwZXM7XG5sZXQgY3Vyc29yQWR2YW5jZU1ldGhvZHM7XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldElkYlByb3h5YWJsZVR5cGVzKCkge1xuICAgIHJldHVybiAoaWRiUHJveHlhYmxlVHlwZXMgfHxcbiAgICAgICAgKGlkYlByb3h5YWJsZVR5cGVzID0gW1xuICAgICAgICAgICAgSURCRGF0YWJhc2UsXG4gICAgICAgICAgICBJREJPYmplY3RTdG9yZSxcbiAgICAgICAgICAgIElEQkluZGV4LFxuICAgICAgICAgICAgSURCQ3Vyc29yLFxuICAgICAgICAgICAgSURCVHJhbnNhY3Rpb24sXG4gICAgICAgIF0pKTtcbn1cbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKSB7XG4gICAgcmV0dXJuIChjdXJzb3JBZHZhbmNlTWV0aG9kcyB8fFxuICAgICAgICAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgPSBbXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmFkdmFuY2UsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZVByaW1hcnlLZXksXG4gICAgICAgIF0pKTtcbn1cbmNvbnN0IHRyYW5zYWN0aW9uRG9uZU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHdyYXAocmVxdWVzdC5yZXN1bHQpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgLy8gVGhpcyBtYXBwaW5nIGV4aXN0cyBpbiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYnV0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gTWFrZSB0eC5zdG9yZSByZXR1cm4gdGhlIG9ubHkgc3RvcmUgaW4gdGhlIHRyYW5zYWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG1hbnkuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3N0b3JlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzFdXG4gICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIDogcmVjZWl2ZXIub2JqZWN0U3RvcmUocmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWxzZSB0cmFuc2Zvcm0gd2hhdGV2ZXIgd2UgZ2V0IGJhY2suXG4gICAgICAgIHJldHVybiB3cmFwKHRhcmdldFtwcm9wXSk7XG4gICAgfSxcbiAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbiAmJlxuICAgICAgICAgICAgKHByb3AgPT09ICdkb25lJyB8fCBwcm9wID09PSAnc3RvcmUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuICAgIH0sXG59O1xuZnVuY3Rpb24gcmVwbGFjZVRyYXBzKGNhbGxiYWNrKSB7XG4gICAgaWRiUHJveHlUcmFwcyA9IGNhbGxiYWNrKGlkYlByb3h5VHJhcHMpO1xufVxuZnVuY3Rpb24gd3JhcEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAvLyBEdWUgdG8gZXhwZWN0ZWQgb2JqZWN0IGVxdWFsaXR5ICh3aGljaCBpcyBlbmZvcmNlZCBieSB0aGUgY2FjaGluZyBpbiBgd3JhcGApLCB3ZVxuICAgIC8vIG9ubHkgY3JlYXRlIG9uZSBuZXcgZnVuYyBwZXIgZnVuYy5cbiAgICAvLyBDdXJzb3IgbWV0aG9kcyBhcmUgc3BlY2lhbCwgYXMgdGhlIGJlaGF2aW91ciBpcyBhIGxpdHRsZSBtb3JlIGRpZmZlcmVudCB0byBzdGFuZGFyZCBJREIuIEluXG4gICAgLy8gSURCLCB5b3UgYWR2YW5jZSB0aGUgY3Vyc29yIGFuZCB3YWl0IGZvciBhIG5ldyAnc3VjY2Vzcycgb24gdGhlIElEQlJlcXVlc3QgdGhhdCBnYXZlIHlvdSB0aGVcbiAgICAvLyBjdXJzb3IuIEl0J3Mga2luZGEgbGlrZSBhIHByb21pc2UgdGhhdCBjYW4gcmVzb2x2ZSB3aXRoIG1hbnkgdmFsdWVzLiBUaGF0IGRvZXNuJ3QgbWFrZSBzZW5zZVxuICAgIC8vIHdpdGggcmVhbCBwcm9taXNlcywgc28gZWFjaCBhZHZhbmNlIG1ldGhvZHMgcmV0dXJucyBhIG5ldyBwcm9taXNlIGZvciB0aGUgY3Vyc29yIG9iamVjdCwgb3JcbiAgICAvLyB1bmRlZmluZWQgaWYgdGhlIGVuZCBvZiB0aGUgY3Vyc29yIGhhcyBiZWVuIHJlYWNoZWQuXG4gICAgaWYgKGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkuaW5jbHVkZXMoZnVuYykpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICAgICAgZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodGhpcy5yZXF1ZXN0KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHdyYXAoZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB3cmFwRnVuY3Rpb24odmFsdWUpO1xuICAgIC8vIFRoaXMgZG9lc24ndCByZXR1cm4sIGl0IGp1c3QgY3JlYXRlcyBhICdkb25lJyBwcm9taXNlIGZvciB0aGUgdHJhbnNhY3Rpb24sXG4gICAgLy8gd2hpY2ggaXMgbGF0ZXIgcmV0dXJuZWQgZm9yIHRyYW5zYWN0aW9uLmRvbmUgKHNlZSBpZGJPYmplY3RIYW5kbGVyKS5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbilcbiAgICAgICAgY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHZhbHVlKTtcbiAgICBpZiAoaW5zdGFuY2VPZkFueSh2YWx1ZSwgZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSkpXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodmFsdWUsIGlkYlByb3h5VHJhcHMpO1xuICAgIC8vIFJldHVybiB0aGUgc2FtZSB2YWx1ZSBiYWNrIGlmIHdlJ3JlIG5vdCBnb2luZyB0byB0cmFuc2Zvcm0gaXQuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gd3JhcCh2YWx1ZSkge1xuICAgIC8vIFdlIHNvbWV0aW1lcyBnZW5lcmF0ZSBtdWx0aXBsZSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QgKGVnIHdoZW4gY3Vyc29yaW5nKSwgYmVjYXVzZVxuICAgIC8vIElEQiBpcyB3ZWlyZCBhbmQgYSBzaW5nbGUgSURCUmVxdWVzdCBjYW4geWllbGQgbWFueSByZXNwb25zZXMsIHNvIHRoZXNlIGNhbid0IGJlIGNhY2hlZC5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJSZXF1ZXN0KVxuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdCh2YWx1ZSk7XG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSB0cmFuc2Zvcm1lZCB0aGlzIHZhbHVlIGJlZm9yZSwgcmV1c2UgdGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgIC8vIFRoaXMgaXMgZmFzdGVyLCBidXQgaXQgYWxzbyBwcm92aWRlcyBvYmplY3QgZXF1YWxpdHkuXG4gICAgaWYgKHRyYW5zZm9ybUNhY2hlLmhhcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSk7XG4gICAgLy8gTm90IGFsbCB0eXBlcyBhcmUgdHJhbnNmb3JtZWQuXG4gICAgLy8gVGhlc2UgbWF5IGJlIHByaW1pdGl2ZSB0eXBlcywgc28gdGhleSBjYW4ndCBiZSBXZWFrTWFwIGtleXMuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICB0cmFuc2Zvcm1DYWNoZS5zZXQodmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChuZXdWYWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWU7XG59XG5jb25zdCB1bndyYXAgPSAodmFsdWUpID0+IHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuXG4vKipcbiAqIE9wZW4gYSBkYXRhYmFzZS5cbiAqXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBkYXRhYmFzZS5cbiAqIEBwYXJhbSB2ZXJzaW9uIFNjaGVtYSB2ZXJzaW9uLlxuICogQHBhcmFtIGNhbGxiYWNrcyBBZGRpdGlvbmFsIGNhbGxiYWNrcy5cbiAqL1xuZnVuY3Rpb24gb3BlbkRCKG5hbWUsIHZlcnNpb24sIHsgYmxvY2tlZCwgdXBncmFkZSwgYmxvY2tpbmcsIHRlcm1pbmF0ZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKG5hbWUsIHZlcnNpb24pO1xuICAgIGNvbnN0IG9wZW5Qcm9taXNlID0gd3JhcChyZXF1ZXN0KTtcbiAgICBpZiAodXBncmFkZSkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZ3JhZGVuZWVkZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHVwZ3JhZGUod3JhcChyZXF1ZXN0LnJlc3VsdCksIGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIHdyYXAocmVxdWVzdC50cmFuc2FjdGlvbiksIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZykge1xuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcigndmVyc2lvbmNoYW5nZScsIChldmVudCkgPT4gYmxvY2tpbmcoZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIHJldHVybiBvcGVuUHJvbWlzZTtcbn1cbi8qKlxuICogRGVsZXRlIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZURCKG5hbWUsIHsgYmxvY2tlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKG5hbWUpO1xuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmNvbnN0IGFkdmFuY2VNZXRob2RQcm9wcyA9IFsnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5JywgJ2FkdmFuY2UnXTtcbmNvbnN0IG1ldGhvZE1hcCA9IHt9O1xuY29uc3QgYWR2YW5jZVJlc3VsdHMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgaXR0clByb3hpZWRDdXJzb3JUb09yaWdpbmFsUHJveHkgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgY3Vyc29ySXRlcmF0b3JUcmFwcyA9IHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIGlmICghYWR2YW5jZU1ldGhvZFByb3BzLmluY2x1ZGVzKHByb3ApKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgbGV0IGNhY2hlZEZ1bmMgPSBtZXRob2RNYXBbcHJvcF07XG4gICAgICAgIGlmICghY2FjaGVkRnVuYykge1xuICAgICAgICAgICAgY2FjaGVkRnVuYyA9IG1ldGhvZE1hcFtwcm9wXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgYWR2YW5jZVJlc3VsdHMuc2V0KHRoaXMsIGl0dHJQcm94aWVkQ3Vyc29yVG9PcmlnaW5hbFByb3h5LmdldCh0aGlzKVtwcm9wXSguLi5hcmdzKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWNoZWRGdW5jO1xuICAgIH0sXG59O1xuYXN5bmMgZnVuY3Rpb24qIGl0ZXJhdGUoLi4uYXJncykge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby10aGlzLWFzc2lnbm1lbnRcbiAgICBsZXQgY3Vyc29yID0gdGhpcztcbiAgICBpZiAoIShjdXJzb3IgaW5zdGFuY2VvZiBJREJDdXJzb3IpKSB7XG4gICAgICAgIGN1cnNvciA9IGF3YWl0IGN1cnNvci5vcGVuQ3Vyc29yKC4uLmFyZ3MpO1xuICAgIH1cbiAgICBpZiAoIWN1cnNvcilcbiAgICAgICAgcmV0dXJuO1xuICAgIGN1cnNvciA9IGN1cnNvcjtcbiAgICBjb25zdCBwcm94aWVkQ3Vyc29yID0gbmV3IFByb3h5KGN1cnNvciwgY3Vyc29ySXRlcmF0b3JUcmFwcyk7XG4gICAgaXR0clByb3hpZWRDdXJzb3JUb09yaWdpbmFsUHJveHkuc2V0KHByb3hpZWRDdXJzb3IsIGN1cnNvcik7XG4gICAgLy8gTWFwIHRoaXMgZG91YmxlLXByb3h5IGJhY2sgdG8gdGhlIG9yaWdpbmFsLCBzbyBvdGhlciBjdXJzb3IgbWV0aG9kcyB3b3JrLlxuICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQocHJveGllZEN1cnNvciwgdW53cmFwKGN1cnNvcikpO1xuICAgIHdoaWxlIChjdXJzb3IpIHtcbiAgICAgICAgeWllbGQgcHJveGllZEN1cnNvcjtcbiAgICAgICAgLy8gSWYgb25lIG9mIHRoZSBhZHZhbmNpbmcgbWV0aG9kcyB3YXMgbm90IGNhbGxlZCwgY2FsbCBjb250aW51ZSgpLlxuICAgICAgICBjdXJzb3IgPSBhd2FpdCAoYWR2YW5jZVJlc3VsdHMuZ2V0KHByb3hpZWRDdXJzb3IpIHx8IGN1cnNvci5jb250aW51ZSgpKTtcbiAgICAgICAgYWR2YW5jZVJlc3VsdHMuZGVsZXRlKHByb3hpZWRDdXJzb3IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzSXRlcmF0b3JQcm9wKHRhcmdldCwgcHJvcCkge1xuICAgIHJldHVybiAoKHByb3AgPT09IFN5bWJvbC5hc3luY0l0ZXJhdG9yICYmXG4gICAgICAgIGluc3RhbmNlT2ZBbnkodGFyZ2V0LCBbSURCSW5kZXgsIElEQk9iamVjdFN0b3JlLCBJREJDdXJzb3JdKSkgfHxcbiAgICAgICAgKHByb3AgPT09ICdpdGVyYXRlJyAmJiBpbnN0YW5jZU9mQW55KHRhcmdldCwgW0lEQkluZGV4LCBJREJPYmplY3RTdG9yZV0pKSk7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmIChpc0l0ZXJhdG9yUHJvcCh0YXJnZXQsIHByb3ApKVxuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdGU7XG4gICAgICAgIHJldHVybiBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgfSxcbiAgICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBpc0l0ZXJhdG9yUHJvcCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApO1xuICAgIH0sXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIsIHVud3JhcCwgd3JhcCB9O1xuIiwiaW1wb3J0IHsgREJTY2hlbWEsIElEQlBEYXRhYmFzZSwgb3BlbkRCIH0gZnJvbSBcImlkYlwiO1xuaW1wb3J0IHsgU2Vzc2lvbkRhdGEsIFBhZ2VWaWV3LCBUaW1lTGltaXRzLCBXYXRjaCB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmludGVyZmFjZSBFeHRlbnNpb25EYXRhYmFzZVNjaGVtYSBleHRlbmRzIERCU2NoZW1hIHtcbiAgICBmYXZpY29uczoge1xua2V5OiBzdHJpbmc7XG52YWx1ZTogRmF2aWNvbkluZm87XG4gICAgfSxcbiAgIHBhZ2V2aWV3czoge1xuICAgICAgICBrZXk6IHN0cmluZztcbiAgICAgICB2YWx1ZTogUGFnZVZpZXc7XG4gICAgICAgIGluZGV4ZXM6IHtcbiAgICAgICAgICAgICdpZHhfcGFnZV92aWV3c19hcHBfaWQnOiBzdHJpbmc7XG4gICAgICAgICAgICAnaWR4X3BhZ2Vfdmlld3Nfc3RhcnRlZEF0JzogbnVtYmVyO1xuICAgICAgICAgICAgLy8gJ2lkeF9wYWdlX3ZpZXdzX2RheSc6IG51bWJlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2Vzc2lvbmRhdGE6IHtcbiAgICAgICAga2V5OiBzdHJpbmc7XG4gICAgICAgIHZhbHVlOiBTZXNzaW9uRGF0YTtcbiAgICAgICAgaW5kZXhlczoge1xuICAgICAgICAgICAgJ2lkeF9zZXNzaW9uX3N0YXJ0ZWRBdCc6IG51bWJlcjtcbiAgICAgICAgICAgICdpZHhfc2Vzc2lvbl9lbmRlZEF0JzogbnVtYmVyO1xuICAgICAgICAgICAgJ2lkeF9zZXNzaW9uX2RheSc6IG51bWJlcjtcbiAgICAgICAgICAgICdpZHhfc2Vzc2lvbl9hcHBfaWQnOiBudW1iZXI7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICB0aW1lbGltaXRzOiB7XG4gICAgICAgIGtleTogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogVGltZUxpbWl0cztcbiAgICAgICAgXG4gICAgfTtcbiAgICB3YXRjaGVzOiB7XG4gICAgICAgIGtleTogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogV2F0Y2g7XG4gICAgICAgIGluZGV4ZXM6IHtcbiAgICAgICAgICAgICdpZHhfd2F0Y2hlc19zdGFydGVkQXQnOiBudW1iZXI7XG4gICAgICAgICAgICAnaWR4X3dhdGNoZXNfZW5kZWRBdCc6IG51bWJlcjtcbiAgICAgICAgICAgICdpZHhfd2F0Y2hlc19kYXknOiBudW1iZXI7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBFeHRlbnNpb25EYXRhYmFzZSA9IElEQlBEYXRhYmFzZTxFeHRlbnNpb25EYXRhYmFzZVNjaGVtYT47XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuRXh0ZW5zaW9uRGF0YWJhc2UoKTogUHJvbWlzZTxFeHRlbnNpb25EYXRhYmFzZT4ge1xuICAgIHJldHVybiBvcGVuREI8RXh0ZW5zaW9uRGF0YWJhc2VTY2hlbWE+KFwidGltZS1kYXRhYmFzZVwiLCAxLCB7XG4gICAgICAgIHVwZ3JhZGUoZGF0YWJhc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2V2aWV3cyA9IGRhdGFiYXNlLmNyZWF0ZU9iamVjdFN0b3JlKFwicGFnZXZpZXdzXCIsIHtcbiAgICAgICAgICAgICAgICBrZXlQYXRoOiBcImlkXCIsXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcGFnZXZpZXdzLmNyZWF0ZUluZGV4KFwiaWR4X3BhZ2Vfdmlld3NfYXBwX2lkXCIsIFwiYXBwSWRcIiwge1xuICAgICAgICAgICAgICAgIHVuaXF1ZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHBhZ2V2aWV3cy5jcmVhdGVJbmRleChcImlkeF9wYWdlX3ZpZXdzX3N0YXJ0ZWRBdFwiLCBcInN0YXJ0ZWRBdFwiKVxuXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uZGF0YSA9IGRhdGFiYXNlLmNyZWF0ZU9iamVjdFN0b3JlKFwic2Vzc2lvbmRhdGFcIiwgeyBrZXlQYXRoOiBcInN0YXJ0ZWRBdFwifSk7XG4gICAgICAgICAgICBzZXNzaW9uZGF0YS5jcmVhdGVJbmRleChcImlkeF9zZXNzaW9uX3N0YXJ0ZWRBdFwiLCBcInN0YXJ0ZWRBdFwiKVxuICAgICAgICAgICAgc2Vzc2lvbmRhdGEuY3JlYXRlSW5kZXgoXCJpZHhfc2Vzc2lvbl9hcHBfaWRcIiwgXCJhcHBJZFwiKVxuICAgIFxuICAgICAgICAgICAgZGF0YWJhc2UuY3JlYXRlT2JqZWN0U3RvcmUoXCJ0aW1lbGltaXRzXCIsIHsga2V5UGF0aDogXCJpZFwiIH0pO1xuICAgICAgICAgICAgZGF0YWJhc2UuY3JlYXRlT2JqZWN0U3RvcmUoXCJmYXZpY29uc1wiLCB7IGtleVBhdGg6IFwiaG9zdG5hbWVcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXMgPSBkYXRhYmFzZS5jcmVhdGVPYmplY3RTdG9yZShcIndhdGNoZXNcIiwgeyBrZXlQYXRoOiBcImlkXCIgfSk7XG4gICAgICAgICAgICB3YXRjaGVzLmNyZWF0ZUluZGV4KFwiaWR4X3dhdGNoZXNfZW5kZWRBdFwiLCBcImVuZGVkQXRcIilcbiAgICAgICAgICAgIHdhdGNoZXMuY3JlYXRlSW5kZXgoXCJpZHhfd2F0Y2hlc19zdGFydGVkQXRcIiwgXCJzdGFydGVkQXRcIilcbiAgICAgICAgICAgIHdhdGNoZXMuY3JlYXRlSW5kZXgoXCJpZHhfd2F0Y2hlc19kYXlcIiwgXCJkYXlcIilcbiAgICAgICAgfSxcbiAgICB9KTtcbn0iLCJpbXBvcnQgeyBkZWZpbmVQcm94eVNlcnZpY2UgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL3Byb3h5LXNlcnZpY2VcIjtcbmltcG9ydCB0eXBlIHsgUGFnZVZpZXcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBFeHRlbnNpb25EYXRhYmFzZSB9IGZyb20gXCIuL2RhdGFiYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFnZVZpZXdTZXJ2aWNlIHtcbiAgICBnZXQoaWQ6IHN0cmluZyk6IFByb21pc2U8UGFnZVZpZXcgfCB1bmRlZmluZWQ+O1xuICAgIGNyZWF0ZShpbmZvOiBQYWdlVmlldyk6IFByb21pc2U8dm9pZD47XG4gICAgZ2V0QnlBcHBJZChhcHBJZDogc3RyaW5nKTogUHJvbWlzZTxQYWdlVmlldyB8IHVuZGVmaW5lZD47XG4gICAgZ2V0Q291bnRCeUFwcElkKGFwcElkOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj47XG4gICAgZ2V0QWxsVG9kYXkoZGF5OiBudW1iZXIpOiBQcm9taXNlPFBhZ2VWaWV3W10gfCB1bmRlZmluZWQ+O1xuICAgIGdldEFsbEFwcHMoKTogUHJvbWlzZTxQYWdlVmlld1tdIHwgdW5kZWZpbmVkPjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGFnZVZpZXdTZXJ2aWNlKF9kYjogUHJvbWlzZTxFeHRlbnNpb25EYXRhYmFzZT4pOiBQYWdlVmlld1NlcnZpY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFzeW5jIGNyZWF0ZShpbmZvOiBQYWdlVmlldykge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBjb25zdCBvID0gYXdhaXQgZGIucHV0KFwicGFnZXZpZXdzXCIsIGluZm8pXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldEJ5QXBwSWQoYXBwSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKFwicGFnZXZpZXdzXCIsIFwicmVhZG9ubHlcIik7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKFwicGFnZXZpZXdzXCIpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBhd2FpdCBvYmplY3RTdG9yZS5nZXQoSURCS2V5UmFuZ2Uub25seShhcHBJZCkpXG4gICAgICAgICAgICB2YXIgcmVzdWx0OiBQYWdlVmlldyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBvYmplY3RTdG9yZS5pbmRleChcImlkeF9wYWdlX3ZpZXdzX2FwcF9pZFwiKVxuICAgICAgICAgICAgdmFyIGN1cnNvciA9IGF3YWl0IGluZGV4Lm9wZW5LZXlDdXJzb3IoYXBwSWQsIFwicHJldlwiKVxuICAgICAgICAgICAgaWYoISFjdXJzb3I/LmtleSl7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgaW5kZXguZ2V0KGN1cnNvcj8ua2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXQoaWQ6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG5cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBkYi5nZXQoXCJwYWdldmlld3NcIiwgaWQpXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldEFsbFRvZGF5KGRheTogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJwYWdldmlld3NcIiwgXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoXCJwYWdldmlld3NcIik7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG9iamVjdFN0b3JlLmluZGV4KFwiaWR4X3BhZ2Vfdmlld3Nfc3RhcnRlZEF0XCIpXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgaW5kZXguZ2V0QWxsKElEQktleVJhbmdlLmJvdW5kKGRheSAtIDEsIERhdGUubm93KCksIHRydWUsIHRydWUpKVxuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXRDb3VudEJ5QXBwSWQoYXBwSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKFwicGFnZXZpZXdzXCIsIFwicmVhZG9ubHlcIik7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKFwicGFnZXZpZXdzXCIpO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBvYmplY3RTdG9yZS5pbmRleChcImlkeF9wYWdlX3ZpZXdzX2FwcF9pZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgaW5kZXguY291bnQoYXBwSWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldEFsbEFwcHMoKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJwYWdldmlld3NcIiwgXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoXCJwYWdldmlld3NcIik7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG9iamVjdFN0b3JlLmluZGV4KFwiaWR4X3BhZ2Vfdmlld3NfYXBwX2lkXCIpO1xuICAgICAgICAgICAgY29uc3QgYWxsID0gYXdhaXQgaW5kZXguZ2V0QWxsKCk7XG4gICAgICAgICAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBQYWdlVmlld1tdID0gW11cbiAgICAgICAgICAgIGFsbC5tYXAoKHgsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXNldC5oYXMoeC5hcHBJZCkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXQuYWRkKHguYXBwSWQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBbcmVnaXN0ZXJQYWdlVmlld1NlcnZpY2UsIGdldFBhZ2VWaWV3U2VydmljZV0gPSBkZWZpbmVQcm94eVNlcnZpY2UoXG4gICAgXCJwYWdldmlldy1zZXJ2aWNlXCIsXG4gICAgY3JlYXRlUGFnZVZpZXdTZXJ2aWNlLFxuKTsiLCJpbXBvcnQgeyBkZWZpbmVQcm94eVNlcnZpY2UgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL3Byb3h5LXNlcnZpY2VcIjtcbmltcG9ydCB0eXBlIHsgV2F0Y2ggfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBFeHRlbnNpb25EYXRhYmFzZSB9IGZyb20gXCIuL2RhdGFiYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2F0Y2hTZXJ2aWNlIHtcbiAgICBnZXQoaWQ6IHN0cmluZyk6IFByb21pc2U8V2F0Y2ggfCB1bmRlZmluZWQ+O1xuICAgIGNyZWF0ZShpbmZvOiBXYXRjaCk6IFByb21pc2U8dm9pZD47XG4gICAgdXBkYXRlKGluZm86IFdhdGNoKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlV2F0Y2hTZXJ2aWNlKF9kYjogUHJvbWlzZTxFeHRlbnNpb25EYXRhYmFzZT4pOiBXYXRjaFNlcnZpY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFzeW5jIGNyZWF0ZShpbmZvOiBXYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmFkZChcIndhdGNoZXNcIiwgaW5mbylcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgdXBkYXRlKGluZm86IFdhdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcblxuICAgICAgICAgICAgYXdhaXQgZGIucHV0KFwid2F0Y2hlc1wiLCBpbmZvKVxuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXQoaWQ6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG5cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBkYi5nZXQoXCJ3YXRjaGVzXCIsIGlkKVxuICAgICAgICB9LFxuICAgICAgICAvLyBhc3luYyBnZXRBbGwoKSB7XG4gICAgICAgIC8vICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgLy8gICAgIHJldHVybiBhd2FpdCBkYi5nZXRBbGwoXCJ3YXRjaGVzXCIpO1xuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBhc3luYyBnZXQoaG9zdG5hbWU6IHN0cmluZykge1xuICAgICAgICAvLyAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgIC8vICAgICByZXR1cm4gYXdhaXQgZGIuZ2V0KFwid2F0Y2hlc1wiLCBob3N0bmFtZSk7XG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIGFzeW5jIGNyZWF0ZShpbmZvKSB7XG4gICAgICAgIC8vICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgLy8gICAgIGF3YWl0IGRiLmFkZChcIndhdGNoZXNcIiwgaW5mbyk7XG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIGFzeW5jIHVwZGF0ZShpbmZvKSB7XG4gICAgICAgIC8vICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgLy8gICAgIGF3YWl0IGRiLnB1dChcIndhdGNoZXNcIiwgaW5mbyk7XG4gICAgICAgIC8vIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFtyZWdpc3RlcldhdGNoU2VydmljZSwgZ2V0V2F0Y2hTZXJ2aWNlXSA9IGRlZmluZVByb3h5U2VydmljZShcbiAgICBcIndhdGNoLXNlcnZpY2VcIixcbiAgICBjcmVhdGVXYXRjaFNlcnZpY2UsXG4pOyIsImltcG9ydCB7IGRlZmluZVByb3h5U2VydmljZSB9IGZyb20gXCJAd2ViZXh0LWNvcmUvcHJveHktc2VydmljZVwiO1xuaW1wb3J0IHR5cGUgeyBTZXNzaW9uRGF0YSB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEV4dGVuc2lvbkRhdGFiYXNlIH0gZnJvbSBcIi4vZGF0YWJhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uRGF0YVNlcnZpY2Uge1xuICAgIGdldChpZDogc3RyaW5nKTogUHJvbWlzZTxTZXNzaW9uRGF0YSB8IHVuZGVmaW5lZD47XG4gICAgZ2V0TGFzdCgpOiBQcm9taXNlPFNlc3Npb25EYXRhIHwgdW5kZWZpbmVkPjtcbiAgICBnZXRMYXN0Rm9yQXBwSWQoYXBwSWQ6IHN0cmluZyk6IFByb21pc2U8U2Vzc2lvbkRhdGEgfCB1bmRlZmluZWQ+O1xuICAgIGNyZWF0ZShpbmZvOiBTZXNzaW9uRGF0YSk6IFByb21pc2U8dm9pZD47XG4gICAgdXBkYXRlKGluZm86IFNlc3Npb25EYXRhKTogUHJvbWlzZTx2b2lkPjtcbiAgICBnZXRBbGxUb2RheShkYXk6IG51bWJlcik6IFByb21pc2U8U2Vzc2lvbkRhdGFbXSB8IHVuZGVmaW5lZD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXNzaW9uU2VydmljZShfZGI6IFByb21pc2U8RXh0ZW5zaW9uRGF0YWJhc2U+KTogU2Vzc2lvbkRhdGFTZXJ2aWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3luYyBjcmVhdGUoaW5mbzogU2Vzc2lvbkRhdGEpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuYWRkKFwic2Vzc2lvbmRhdGFcIiwgaW5mbylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIHVwZGF0ZShpbmZvOiBTZXNzaW9uRGF0YSkge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IGRiLnB1dChcInNlc3Npb25kYXRhXCIsIGluZm8pXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldChpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGRiLmdldChcInNlc3Npb25kYXRhXCIsIGlkKVxuICAgICAgICB9LFxuICAgICAgICBhc3luYyBnZXRMYXN0KCkge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBfZGI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJzZXNzaW9uZGF0YVwiLCBcInJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcInNlc3Npb25kYXRhXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnNvcktleVJlcXVlc3QgPSBhd2FpdCBvYmplY3RTdG9yZS5vcGVuS2V5Q3Vyc29yKG51bGwsIFwicHJldlwiKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghIWN1cnNvcktleVJlcXVlc3Q/LmtleSl7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGRiLmdldEZyb21JbmRleChcInNlc3Npb25kYXRhXCIsIFwiaWR4X3Nlc3Npb25fc3RhcnRlZEF0XCIsIGN1cnNvcktleVJlcXVlc3Q/LmtleSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB3aGlsZSBvcGVuaW5nIGN1cnNvcjpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIGdldExhc3RGb3JBcHBJZChhcHBJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJzZXNzaW9uZGF0YVwiLCBcInJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcInNlc3Npb25kYXRhXCIpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdDogU2Vzc2lvbkRhdGEgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgICBcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Vyc29yS2V5UmVxdWVzdCA9IGF3YWl0IG9iamVjdFN0b3JlLmluZGV4KFwiaWR4X3Nlc3Npb25fYXBwX2lkXCIpLm9wZW5LZXlDdXJzb3IobnVsbCwgXCJwcmV2XCIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhY3Vyc29yS2V5UmVxdWVzdD8ua2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjdXJzb3JLZXlSZXF1ZXN0LmtleSA9PT0gYXBwSWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZGIuZ2V0RnJvbUluZGV4KFwic2Vzc2lvbmRhdGFcIiwgXCJpZHhfc2Vzc2lvbl9hcHBfaWRcIiwgY3Vyc29yS2V5UmVxdWVzdD8ua2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhazsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JLZXlSZXF1ZXN0Py5jb250aW51ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0QWxsVG9kYXkoZGF5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihcInNlc3Npb25kYXRhXCIsIFwicmVhZG9ubHlcIik7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKFwic2Vzc2lvbmRhdGFcIik7XG5cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBvYmplY3RTdG9yZS5nZXRBbGwoSURCS2V5UmFuZ2UuYm91bmQoZGF5LCBEYXRlLm5vdygpLCB0cnVlLCB0cnVlKSlcbiAgICAgICAgfSxcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBbcmVnaXN0ZXJTZXNzaW9uU2VydmljZSwgZ2V0U2Vzc2lvblNlcnZpY2VdID0gZGVmaW5lUHJveHlTZXJ2aWNlKFxuICAgIFwic2Vzc2lvbi1zZXJ2aWNlXCIsXG4gICAgY3JlYXRlU2Vzc2lvblNlcnZpY2UsXG4pOyIsImltcG9ydCB7IGRlZmluZVByb3h5U2VydmljZSB9IGZyb20gXCJAd2ViZXh0LWNvcmUvcHJveHktc2VydmljZVwiO1xuaW1wb3J0IHR5cGUgeyBGYXZpY29uSW5mbyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEV4dGVuc2lvbkRhdGFiYXNlIH0gZnJvbSBcIi4vZGF0YWJhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBGYXZpY29uSW5mb1NlcnZpY2Uge1xuICAgIGdldChpZDogc3RyaW5nKTogUHJvbWlzZTxGYXZpY29uSW5mbyB8IHVuZGVmaW5lZD47XG4gICAgY3JlYXRlKGluZm86IEZhdmljb25JbmZvKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmF2SWNvblNlcnZpY2UoX2RiOiBQcm9taXNlPEV4dGVuc2lvbkRhdGFiYXNlPik6IEZhdmljb25JbmZvU2VydmljZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXN5bmMgY3JlYXRlKGluZm86IEZhdmljb25JbmZvKSB7XG4gICAgICAgICAgICBjb25zdCBkYiA9IGF3YWl0IF9kYjtcblxuICAgICAgICAgICAgYXdhaXQgZGIuYWRkKFwiZmF2aWNvbnNcIiwgaW5mbylcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0KGhvc3RuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRiID0gYXdhaXQgX2RiO1xuXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZGIuZ2V0KFwiZmF2aWNvbnNcIiwgaG9zdG5hbWUpXG4gICAgICAgIH0sXG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgW3JlZ2lzdGVyRmF2SWNvblNlcnZpY2UsIGdldEZhdkljb25TZXJ2aWNlXSA9IGRlZmluZVByb3h5U2VydmljZShcbiAgICBcImZhdmljb24tc2VydmljZVwiLFxuICAgIGNyZWF0ZUZhdkljb25TZXJ2aWNlLFxuKTsiLCJpbXBvcnQgeyBvcGVuRXh0ZW5zaW9uRGF0YWJhc2UgfSBmcm9tICdAL3V0aWxzL2RhdGFiYXNlJztcbmltcG9ydCB7IHJlZ2lzdGVyUGFnZVZpZXdTZXJ2aWNlIH0gZnJvbSAnQC91dGlscy9wYWdldmlldy1zZXJ2aWNlJztcbmltcG9ydCB7IHJlZ2lzdGVyV2F0Y2hTZXJ2aWNlIH0gZnJvbSAnQC91dGlscy93YXRjaC1zZXJ2aWNlJztcbmltcG9ydCB7IHJlZ2lzdGVyU2Vzc2lvblNlcnZpY2UgfSBmcm9tICdAL3V0aWxzL3Nlc3Npb24tc2VydmljZSc7XG5pbXBvcnQgeyBUYWJzIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJ3d4dC9zdG9yYWdlJ1xuaW1wb3J0IHsgcmVnaXN0ZXJGYXZJY29uU2VydmljZSB9IGZyb20gJ0AvdXRpbHMvZmF2aWNvbi1zZXJ2aWNlJztcblxuY29uc3QgZXhjbHVkZUxpc3QgPSBbJ2NhaGxrZ2luamRma2JuamJnb2pvbGlnaWNvYmdha2ZwJywgJ25ld3RhYiddXG5cbnR5cGUgVGltZURhdGEgPSB7XG4gICAgYXBwSWQ6IHN0cmluZ1xuICAgIGZhdkljb25Vcmw6IHN0cmluZ1xuICAgIHRpbWVTcGVudDogbnVtYmVyXG4gICAgc2Vzc2lvbnM6IG51bWJlclxuICAgIHBlcmNlbnRhZ2U6IG51bWJlclxufVxuXG50eXBlIFRpbWVMaW1pdElucHV0ID0ge1xuICAgIGlkOiBzdHJpbmdcbiAgICBhY3RpdmU6IGJvb2xlYW5cbiAgICBhcHBzOiBzdHJpbmdbXVxuICAgIHR5cGU6IHN0cmluZ1xuICAgIHN0YXJ0VGltZTogc3RyaW5nO1xuICAgIGVuZFRpbWU6IHN0cmluZztcbiAgICBkYXlzOiBzdHJpbmdbXTtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYWN0aW9uOiBzdHJpbmdcbiAgICBjb29sRG93blBlcmlvZDogbnVtYmVyXG4gICAgbGltaXRQZXJpb2Q6IG51bWJlclxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVCYWNrZ3JvdW5kKCgpID0+IHtcbiAgICBjb25zdCBkYiA9IG9wZW5FeHRlbnNpb25EYXRhYmFzZSgpO1xuICAgIHZhciBjdXJyZW50VGFiOiBUYWJzLlRhYiB8IG51bGwgPSBudWxsXG4gICAgdmFyIHdhdGNoSWQgPSBcIlwiXG4gICAgY29uc3QgcGFnZVZpZXdTZXJ2aWNlID0gcmVnaXN0ZXJQYWdlVmlld1NlcnZpY2UoZGIpXG4gICAgLy8gY29uc3Qgc2Vzc2lvblNlcnZpY2UgPSByZWdpc3RlclNlc3Npb25TZXJ2aWNlKGRiKVxuICAgIGNvbnN0IHNlc3Npb25TZXJ2aWNlID0gcmVnaXN0ZXJTZXNzaW9uU2VydmljZShkYilcbiAgICBjb25zdCB3YXRjaFNlcnZpY2UgPSByZWdpc3RlcldhdGNoU2VydmljZShkYilcbiAgICBjb25zdCBmYXZpY29uU2VydmljZSA9IHJlZ2lzdGVyRmF2SWNvblNlcnZpY2UoZGIpXG4gICAgY29uc3QgdGltZUxpbWl0U2VydmljZSA9IHJlZ2lzdGVyVGltZUxpbWl0c1NlcnZpY2UoZGIpXG5cbiAgICBicm93c2VyLmFsYXJtcy5jcmVhdGUoJ2NoZWNrVGltZUxpbWl0cycsIHsgcGVyaW9kSW5NaW51dGVzOiAxIC8gNjAgfSlcblxuICAgIGJyb3dzZXIudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcihhc3luYyAoYWN0aXZlSW5mbykgPT4ge1xuXG4gICAgICAgY29uc3QgdGFiID0gYXdhaXQgYnJvd3Nlci50YWJzLmdldChhY3RpdmVJbmZvLnRhYklkKVxuICAgICAgIGN1cnJlbnRUYWIgPSB0YWJcbiAgICAgICAgY3JlYXRlUGFnZVZpZXcodGFiKVxuICAgICAgICBjcmVhdGVTZXNzaW9uKHRhYilcbiAgICB9KVxuXG4gICAgYnJvd3Nlci50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgIGlmKCF0YWIuYWN0aXZlKSByZXR1cm5cbiAgICAgICAgICAgIGN1cnJlbnRUYWIgPSB0YWJcbiAgICAgICAgICAgIGNyZWF0ZVBhZ2VWaWV3KHRhYilcbiAgICAgICAgICAgIGNyZWF0ZVNlc3Npb24odGFiKSBcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBicm93c2VyLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKGFzeW5jIChhbGFybSkgPT4ge1xuICAgICAgICBpZiAoYWxhcm0ubmFtZSA9PT0gJ2NoZWNrVGltZUxpbWl0cycpIHtcbiAgICAgICAgICAgIGlmKCFjdXJyZW50VGFiKSByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHVwZGF0ZVNlc3Npb24oY3VycmVudFRhYilcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVQYWdlVmlldyh0YWI6IFRhYnMuVGFiKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRhYi51cmwgPz8gdGFiLnBlbmRpbmdVcmw7XG4gICAgICAgIGNvbnN0IGZhdmljb25VcmwgPSB0YWIuZmF2SWNvblVybDtcbiAgICAgICAgaWYgKCF1cmwpIHJldHVybjtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoIXRhYi5zZWxlY3RlZCkgcmV0dXJuXG5cbiAgICAgICAgY29uc3QgaG9zdG5hbWUgPSBuZXcgVVJMKHVybCkuaG9zdG5hbWU7XG4gICAgICAgIGlmKGV4Y2x1ZGVMaXN0LmluY2x1ZGVzKGhvc3RuYW1lKSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHBhZ2VWaWV3ID0gYXdhaXQgcGFnZVZpZXdTZXJ2aWNlLmdldEJ5QXBwSWQoaG9zdG5hbWUpXG4gICAgICAgIFxuICAgICAgICBjb25zdCBpZCA9IGNyeXB0by5yYW5kb21VVUlEKClcbiAgICAgICAgXG4gICAgICAgIGF3YWl0IHBhZ2VWaWV3U2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICBwYWdlVmlldyA/IHBhZ2VWaWV3LmlkOiBpZCxcbiAgICAgICAgICAgIGNvdW50OiBwYWdlVmlldyA/IHBhZ2VWaWV3LmNvdW50ICsgMSA6IDEsXG4gICAgICAgICAgICBhcHBJZDogcGFnZVZpZXcgPyBwYWdlVmlldy5hcHBJZCAgOiBob3N0bmFtZSxcbiAgICAgICAgICAgIGRheTogbmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSxcbiAgICAgICAgICAgIGZhdmljb25Vcmw6IHBhZ2VWaWV3PyBwYWdlVmlldy5mYXZpY29uVXJsOiBmYXZpY29uVXJsISxcbiAgICAgICAgICAgIHBhdGg6IG5ldyBVUkwodXJsKS5wYXRobmFtZSxcbiAgICAgICAgICAgIHF1ZXJ5OiBuZXcgVVJMKHVybCkuc2VhcmNoLFxuICAgICAgICAgICAgcmVmZXJyZXI6IG5ldyBVUkwodXJsKS5vcmlnaW5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVTZXNzaW9uKHRhYjogVGFicy5UYWIpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGFiLnVybCA/PyB0YWIucGVuZGluZ1VybDtcbiAgICAgICAgY29uc3QgZmF2aWNvblVybCA9IHRhYi5mYXZJY29uVXJsO1xuICAgICAgICBpZiAoIXVybCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lO1xuICAgICAgICBpZiAoZXhjbHVkZUxpc3QuaW5jbHVkZXMoaG9zdG5hbWUpKSByZXR1cm5cbiAgICAgICAgaWYgKCEhZmF2aWNvblVybClcbiAgICAgICAgICAgIGF3YWl0IGZhdmljb25TZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgZmF2aWNvblVybCxcbiAgICAgICAgICAgICAgICBob3N0bmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGlkID0gY3J5cHRvLnJhbmRvbVVVSUQoKVxuICAgICAgICBhd2FpdCBzZXNzaW9uU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBmYXZpY29uVXJsOiAoYXdhaXQgZmF2aWNvblNlcnZpY2UuZ2V0KGhvc3RuYW1lKSk/LmZhdmljb25VcmwgPz8gXCJcIixcbiAgICAgICAgICAgIGRheTogbmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSxcbiAgICAgICAgICAgIGFwcElkOiBob3N0bmFtZSxcbiAgICAgICAgICAgIGNyZWF0ZWRCeTogXCJiam9yblwiLFxuICAgICAgICAgICAgc3RhcnRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgZW5kZWRBdDogRGF0ZS5ub3coKSsxMCxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVTZXNzaW9uKHRhYjogVGFicy5UYWIpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGFiLnVybCA/PyB0YWIucGVuZGluZ1VybDtcbiAgICAgICAgaWYgKCF1cmwpIHJldHVybjtcbiAgICAgICAgY29uc3QgaG9zdG5hbWUgPSBuZXcgVVJMKHVybCkuaG9zdG5hbWU7XG4gICAgICAgIGlmIChleGNsdWRlTGlzdC5pbmNsdWRlcyhob3N0bmFtZSkpIHJldHVyblxuICAgICAgICBjb25zdCBjdXJyZW50U2Vzc2lvbiA9IGF3YWl0IHNlc3Npb25TZXJ2aWNlLmdldExhc3QoKVxuICAgICAgICBpZiAoIWN1cnJlbnRTZXNzaW9uKSByZXR1cm5cblxuICAgICAgICBpZihjdXJyZW50U2Vzc2lvbi5hcHBJZCA9PT0gaG9zdG5hbWUpe1xuICAgICAgICAgICAgYXdhaXQgc2Vzc2lvblNlcnZpY2UudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBpZDogY3VycmVudFNlc3Npb24uaWQsXG4gICAgICAgICAgICAgICAgZmF2aWNvblVybDogKGF3YWl0IGZhdmljb25TZXJ2aWNlLmdldChob3N0bmFtZSkpPy5mYXZpY29uVXJsID8/IFwiXCIsXG4gICAgICAgICAgICAgICAgZGF5OiBjdXJyZW50U2Vzc2lvbi5kYXksXG4gICAgICAgICAgICAgICAgYXBwSWQ6IGN1cnJlbnRTZXNzaW9uLmFwcElkLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRCeTogY3VycmVudFNlc3Npb24uY3JlYXRlZEJ5LFxuICAgICAgICAgICAgICAgIHN0YXJ0ZWRBdDogY3VycmVudFNlc3Npb24uc3RhcnRlZEF0LFxuICAgICAgICAgICAgICAgIGVuZGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG5ld1Nlc3Npb24gPSBhd2FpdCBzZXNzaW9uU2VydmljZS5nZXRMYXN0Rm9yQXBwSWQoaG9zdG5hbWUpXG4gICAgICAgICAgICBpZiAoIW5ld1Nlc3Npb24pIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBzZXNzaW9uU2VydmljZS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGlkOiBuZXdTZXNzaW9uLmlkLFxuICAgICAgICAgICAgICAgIGZhdmljb25Vcmw6IChhd2FpdCBmYXZpY29uU2VydmljZS5nZXQoaG9zdG5hbWUpKT8uZmF2aWNvblVybCA/PyBcIlwiLFxuICAgICAgICAgICAgICAgIGRheTogbmV3U2Vzc2lvbi5kYXksXG4gICAgICAgICAgICAgICAgYXBwSWQ6IG5ld1Nlc3Npb24uYXBwSWQsXG4gICAgICAgICAgICAgICAgY3JlYXRlZEJ5OiBuZXdTZXNzaW9uLmNyZWF0ZWRCeSxcbiAgICAgICAgICAgICAgICBzdGFydGVkQXQ6IG5ld1Nlc3Npb24uc3RhcnRlZEF0LFxuICAgICAgICAgICAgICAgIGVuZGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8vIGJyb3dzZXIuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoYXN5bmMgKGFsYXJtKSA9PiB7XG4gICAgLy8gICAgIGlmIChhbGFybS5uYW1lID09PSAnY2hlY2tUaW1lTGltaXRzJykge1xuICAgIC8vICAgICAgICAgY29uc3QgYWxsVGFicyA9IGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7fSk7XG4gICAgLy8gICAgICAgICBmb3IgKGNvbnN0IHRhYiBvZiBhbGxUYWJzKSB7XG4gICAgLy8gICAgICAgICAgICAgaWYgKHRhYi5hY3RpdmUpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlU2Vzc2lvbih0YWIpXG4gICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfSlcblxuICAgIGNvbnN0IGdldFRpbWVEYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBhbGxTZXNzaW9ucyA9IGF3YWl0IHNlc3Npb25TZXJ2aWNlLmdldEFsbFRvZGF5KG5ldyBEYXRlKCkuc2V0SG91cnMoMCwgMCwgMCwgMCkpXG4gICAgICAgIGNvbnN0IGFsbFBhZ2VWaWV3cyA9IGF3YWl0IHBhZ2VWaWV3U2VydmljZS5nZXRBbGxUb2RheShuZXcgRGF0ZSgpLnNldEhvdXJzKDAsIDAsIDAsIDApKVxuICAgICAgICBpZiAoIWFsbFNlc3Npb25zIHx8ICFhbGxQYWdlVmlld3MpIHJldHVyblxuICAgICAgICB2YXIgdGltZURhdGFMaXN0OiBUaW1lRGF0YVtdID0gW10gYXMgVGltZURhdGFbXVxuICAgICAgICBhbGxTZXNzaW9ucy5tYXAoICh4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lRGF0YSA9IHRpbWVEYXRhTGlzdC5maW5kKCh5KSA9PiB5LmFwcElkID09PSB4LmFwcElkKVxuICAgICAgICAgICAgaWYgKHRpbWVEYXRhKSB7XG4gICAgICAgICAgICAgICAgdGltZURhdGEudGltZVNwZW50ICs9IHguZW5kZWRBdCAtIHguc3RhcnRlZEF0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpbWVEYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IHguYXBwSWQsXG4gICAgICAgICAgICAgICAgICAgIGZhdkljb25Vcmw6IHguZmF2aWNvblVybCxcbiAgICAgICAgICAgICAgICAgICAgdGltZVNwZW50OiB4LmVuZGVkQXQgLSB4LnN0YXJ0ZWRBdCxcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbnM6IDEsXG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2U6IDBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCB0b3RhbCA9IHRpbWVEYXRhTGlzdC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLnRpbWVTcGVudCwgMClcblxuICAgICAgICB0aW1lRGF0YUxpc3QgPSBhd2FpdCBQcm9taXNlLmFsbCh0aW1lRGF0YUxpc3QubWFwKGFzeW5jICh4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYWdlVmlldyA9IGF3YWl0IHBhZ2VWaWV3U2VydmljZS5nZXRCeUFwcElkKHguYXBwSWQpXG4gICAgICAgICAgICBjb25zdCBmYXZpY29uT2JqID0gYXdhaXQgZmF2aWNvblNlcnZpY2UuZ2V0KHguYXBwSWQpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLngsXG4gICAgICAgICAgICAgICAgZmF2SWNvblVybDogZmF2aWNvbk9iaj8uZmF2aWNvblVybCA/PyBcIlwiLFxuICAgICAgICAgICAgICAgIHNlc3Npb25zOiBwYWdlVmlldz8uY291bnQgfHwgMSxcbiAgICAgICAgICAgICAgICBwZXJjZW50YWdlOiAoeC50aW1lU3BlbnQgLyB0b3RhbCkgKiAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpXG5cbiAgICAgICAgcmV0dXJuIHRpbWVEYXRhTGlzdFxuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVN0b3BXYXRjaCgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRUYWI6IFRhYnMuVGFiIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGFsbFRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoe30pO1xuICAgICAgICBmb3IgKGNvbnN0IHRhYiBvZiBhbGxUYWJzKSB7XG4gICAgICAgICAgICBpZiAodGFiLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUYWIgPSB0YWJcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY3VycmVudFRhYikgcmV0dXJuXG4gICAgICAgIGNvbnN0IHVybCA9IGN1cnJlbnRUYWIudXJsID8/IGN1cnJlbnRUYWIucGVuZGluZ1VybDtcbiAgICAgICAgY29uc3QgZmF2aWNvblVybCA9IGN1cnJlbnRUYWIuZmF2SWNvblVybDtcbiAgICAgICAgaWYgKCF1cmwgfHwgIWZhdmljb25VcmwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBob3N0bmFtZSA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZTtcbiAgICAgICAgd2F0Y2hJZCA9IGNyeXB0by5yYW5kb21VVUlEKClcbiAgICAgICAgYXdhaXQgd2F0Y2hTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICBhcHBJZDogaG9zdG5hbWUsXG4gICAgICAgICAgICBzdGFydGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgICBlbmRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgZmF2aWNvblVybCxcbiAgICAgICAgICAgIGlkOiB3YXRjaElkLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYXN5bmMgKG1lc3NhZ2U6IHtcbiAgICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBkYXRhOiBUaW1lTGltaXRJbnB1dFxuICAgIH0pID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcIm9wZW5EYXNoYm9hcmRcIikge1xuICAgICAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgdXJsOiBicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKFwiL2Rhc2hib2FyZC5odG1sXCIpLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcInN0YXJ0U3RvcFdhdGNoXCIpIHtcbiAgICAgICAgICAgIGF3YWl0IGNyZWF0ZVN0b3BXYXRjaCgpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsIG1lc3NhZ2U6IFwiU3RvcHdhdGNoIHN0YXJ0ZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcImNoZWNrU3RvcFdhdGNoXCIpIHtcbiAgICAgICAgICAgIGlmICghd2F0Y2hJZC5sZW5ndGgpIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcImVycm9yXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJTdG9wd2F0Y2ggbm90IHN0YXJ0ZWRcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0b3B3YXRjaCA9IGF3YWl0IHdhdGNoU2VydmljZS5nZXQod2F0Y2hJZClcbiAgICAgICAgICAgIGlmICghc3RvcHdhdGNoKSByZXR1cm5cbiAgICAgICAgICAgIGNvbnN0IG5ld1dhdGNoID0ge1xuICAgICAgICAgICAgICAgIGFwcElkOiBzdG9wd2F0Y2guYXBwSWQsXG4gICAgICAgICAgICAgICAgZmF2aWNvblVybDogc3RvcHdhdGNoLmZhdmljb25VcmwsXG4gICAgICAgICAgICAgICAgaWQ6IHdhdGNoSWQsXG4gICAgICAgICAgICAgICAgc3RhcnRlZEF0OiBzdG9wd2F0Y2guc3RhcnRlZEF0LFxuICAgICAgICAgICAgICAgIGVuZGVkQXQ6IERhdGUubm93KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHdhdGNoU2VydmljZS51cGRhdGUobmV3V2F0Y2gpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJTdG9wd2F0Y2ggdXBkYXRlZFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IG5ld1dhdGNoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09IFwic3RvcFN0b3BXYXRjaFwiKSB7XG4gICAgICAgICAgICB3YXRjaElkID0gJydcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgbWVzc2FnZTogXCJTdG9wd2F0Y2ggc3RvcHBlZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBcImdldEZhdkljb25cIil7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGZhdmljb24gPSBhd2FpdCBmYXZpY29uU2VydmljZS5nZXQobWVzc2FnZS5pZClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZmF2aWNvbj8uZmF2aWNvblVybFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcImdldExpc3RPZkFwcHNcIikge1xuICAgICAgICAgICAgY29uc3QgcGFnZVZpZXdzID0gYXdhaXQgcGFnZVZpZXdTZXJ2aWNlLmdldEFsbEFwcHMoKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBwYWdlVmlld3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcblxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09IFwiZ2V0VGltZUxpbWl0c1wiKSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lTGltaXRzID0gYXdhaXQgdGltZUxpbWl0U2VydmljZS5nZXRBbGwoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogdGltZUxpbWl0cywgbWVzc2FnZTogXCJUaW1lIGxpbWl0cyByZXRyaWV2ZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcImFkZFRpbWVMaW1pdFwiKSB7XG4gICAgICAgICAgICBhd2FpdCB0aW1lTGltaXRTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFwcHM6IG1lc3NhZ2UuZGF0YS5hcHBzLFxuICAgICAgICAgICAgICAgIGRheXM6IG1lc3NhZ2UuZGF0YS5kYXlzLFxuICAgICAgICAgICAgICAgIGlkOiBjcnlwdG8ucmFuZG9tVVVJRCgpLFxuICAgICAgICAgICAgICAgIGxpbWl0UGVyaW9kOiBtZXNzYWdlLmRhdGEubGltaXRQZXJpb2QsXG4gICAgICAgICAgICAgICAgY29vbERvd25QZXJpb2Q6IG1lc3NhZ2UuZGF0YS5jb29sRG93blBlcmlvZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBtZXNzYWdlLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBtZXNzYWdlLmRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246IG1lc3NhZ2UuZGF0YS5hY3Rpb24sXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBtZXNzYWdlLmRhdGEuc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IG1lc3NhZ2UuZGF0YS5lbmRUaW1lLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLCBtZXNzYWdlOiBcIlRpbWUgbGltaXQgYWRkZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJlZGl0VGltZUxpbWl0XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVMaW1pdCA9IGF3YWl0IHRpbWVMaW1pdFNlcnZpY2UuZ2V0KG1lc3NhZ2UuZGF0YS5pZClcbiAgICAgICAgICAgIGlmICghdGltZUxpbWl0KSByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJlcnJvclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGltZSBsaW1pdCBkb2Vzbid0IGV4aXN0XCIsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRpbWVMaW1pdCkgcmV0dXJuXG5cbiAgICAgICAgICAgYXdhaXQgdGltZUxpbWl0U2VydmljZS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogbWVzc2FnZS5kYXRhLmFjdGl2ZSxcbiAgICAgICAgICAgICAgIGFwcHM6IG1lc3NhZ2UuZGF0YS5hcHBzLFxuICAgICAgICAgICAgICAgIGRheXM6IG1lc3NhZ2UuZGF0YS5kYXlzLFxuICAgICAgICAgICAgICAgIGxpbWl0UGVyaW9kOiBtZXNzYWdlLmRhdGEuY29vbERvd25QZXJpb2QsXG4gICAgICAgICAgICAgICAgY29vbERvd25QZXJpb2Q6IG1lc3NhZ2UuZGF0YS5jb29sRG93blBlcmlvZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBtZXNzYWdlLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246IG1lc3NhZ2UuZGF0YS5hY3Rpb24sXG4gICAgICAgICAgICAgICAgdHlwZTogbWVzc2FnZS5kYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBtZXNzYWdlLmRhdGEuc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IG1lc3NhZ2UuZGF0YS5lbmRUaW1lLFxuICAgICAgICAgICAgICAgIGlkOiB0aW1lTGltaXQuaWQsXG4gICAgICAgICAgICAgICAgY3JlYXRlZEF0OiB0aW1lTGltaXQuY3JlYXRlZEF0LFxuICAgICAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsIG1lc3NhZ2U6IFwiVGltZSBsaW1pdCB1cGRhdGVkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09IFwiZGVsZXRlVGltZUxpbWl0XCIpIHtcbiAgICAgICAgICAgIGF3YWl0IHRpbWVMaW1pdFNlcnZpY2UuZGVsZXRlKG1lc3NhZ2UuZGF0YS5pZClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgbWVzc2FnZTogXCJUaW1lIGxpbWl0IGRlbGV0ZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJ0b2dnbGVUaW1lTGltaXRcIikge1xuICAgICAgICAgICAgY29uc3QgdGltZUxpbWl0ID0gYXdhaXQgdGltZUxpbWl0U2VydmljZS5nZXQobWVzc2FnZS5kYXRhLmlkKVxuICAgICAgICAgICAgaWYgKCF0aW1lTGltaXQpIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcImVycm9yXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaW1lIGxpbWl0IGRvZXNuJ3QgZXhpc3RcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGltZUxpbWl0KSByZXR1cm5cblxuICAgICAgICAgICAgYXdhaXQgdGltZUxpbWl0U2VydmljZS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIC4uLnRpbWVMaW1pdCxcbiAgICAgICAgICAgICAgICBhY3RpdmU6ICF0aW1lTGltaXQuYWN0aXZlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgbWVzc2FnZTogXCJUaW1lIGxpbWl0IHVwZGF0ZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJnZXRUaW1lRGF0YVwiKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaW1lIGRhdGEgcmV0cmlldmVkXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogYXdhaXQgZ2V0VGltZURhdGEoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcImVycm9yXCIsIG1lc3NhZ2U6IFwiSW52YWxpZCBtZXNzYWdlIHR5cGVcIiB9XG4gICAgfSlcblxuICAgIC8vIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRpbWVEYXRhKHRhYjogVGFicy5UYWIpIHtcbiAgICAvLyAgICAgY29uc3QgZW5kVGltZSA9IERhdGUubm93KClcbiAgICAvLyAgICAgY29uc3QgdXJsID0gdGFiLnVybCA/PyB0YWIucGVuZGluZ1VybDtcbiAgICAvLyAgICAgY29uc3QgZmF2aWNvblVybCA9IHRhYi5mYXZJY29uVXJsO1xuICAgIC8vICAgICBpZiAoIXVybCB8fCAhZmF2aWNvblVybCkgcmV0dXJuO1xuXG4gICAgLy8gICAgIGNvbnN0IGhvc3RuYW1lID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lO1xuXG4gICAgLy8gICAgIGNvbnN0IHRpbWVEYXRhID0gYXdhaXQgdGltZWRhdGFTZXJ2aWNlLmdldExhc3QoaG9zdG5hbWUpO1xuICAgIC8vICAgICBpZiAoIXRpbWVEYXRhKSByZXR1cm5cbiAgICAvLyAgICAgY29uc3QgbGFzdERhdGEgPSBhd2FpdCB0aW1lZGF0YVNlcnZpY2UuZ2V0Rmlyc3RPZkRheShuZXcgRGF0ZSgpLnNldEhvdXJzKDAsMCwwLDApLCBob3N0bmFtZSk7XG4gICAgLy8gICAgIGlmICghbGFzdERhdGEpIHJldHVyblxuXG4gICAgLy8gICAgIGNvbnN0IHRpbWVTcGVudCA9IGVuZFRpbWUgLSAoc3RhcnRUaW1lIHx8IERhdGUubm93KCkpXG5cbiAgICAvLyAgICAgYXdhaXQgdGltZWRhdGFTZXJ2aWNlLnVwZGF0ZSh7IFxuICAgIC8vICAgICAgICAgLi4udGltZURhdGEsXG4gICAgLy8gICAgICAgICB1cGRhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgIC8vICAgICAgICAgdGltZVNwZW50OiB0aW1lU3BlbnQsXG4gICAgLy8gICAgICAgICAvLyBzZXNzaW9uOiB0aW1lRGF0YS5zZXNzaW9uXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQhLFxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRpbWVEYXRhOiB0aW1lU3BlbnQsXG4gICAgLy8gICAgICAgICAgICAgdGltZUxpbWl0czogMFxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gfVxuXG4gICAgLy8gYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGltZURhdGEodGFiOiBUYWJzLlRhYikge1xuICAgIC8vICAgICBjb25zdCB1cmwgPSB0YWIudXJsID8/IHRhYi5wZW5kaW5nVXJsO1xuICAgIC8vICAgICBjb25zdCBmYXZpY29uVXJsID0gdGFiLmZhdkljb25Vcmw7XG4gICAgLy8gICAgIGlmICghdXJsIHx8ICFmYXZpY29uVXJsKSByZXR1cm47XG5cbiAgICAvLyAgICAgY29uc3QgaG9zdG5hbWUgPSBuZXcgVVJMKHVybCkuaG9zdG5hbWU7XG4gICAgLy8gICAgIGNvbnN0IHRpbWVTcGVudCA9IERhdGUubm93KCkgLSAoc3RhcnRUaW1lIHx8IERhdGUubm93KCkpXG4gICAgLy8gICAgIGF3YWl0IHRpbWVkYXRhU2VydmljZS5jcmVhdGUoe1xuICAgIC8vICAgICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgICAvLyAgICAgICAgIHVwZGF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgLy8gICAgICAgICBob3N0bmFtZSxcbiAgICAvLyAgICAgICAgIGRheTogbmV3IERhdGUoKS5zZXRIb3VycygwLDAsMCwwKSxcbiAgICAvLyAgICAgICAgIGZhdmljb25VcmwsXG4gICAgLy8gICAgICAgICB0aW1lU3BlbnQ6IHRpbWVTcGVudCxcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIC8vIH1cblxuXG5cbiAgICAvLyBhc3luYyBmdW5jdGlvbiB1cGRhdGVUaW1lVHJhY2tpbmcodXJsOiBzdHJpbmcsIHRhYklkOiBudW1iZXIpIHtcbiAgICAvLyAgICAgaWYgKGN1cnJlbnRVcmwpIHtcbiAgICAvLyAgICAgICAgIGNvbnN0IGVuZFRpbWUgPSBEYXRlLm5vdygpXG5cbiAgICAvLyAgICAgICAgIGNvbnN0IHRpbWVTcGVudCA9IGVuZFRpbWUgLSAoc3RhcnRUaW1lIHx8IGVuZFRpbWUpXG5cbiAgICAvLyAgICAgICAgIGF3YWl0IHVwZGF0ZVN0b3JlZFRpbWUoY3VycmVudFVybCwgdGltZVNwZW50LCB0YWJJZClcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCdodHRwJykpIHJldHVyblxuICAgIC8vICAgICBjdXJyZW50VXJsID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lXG4gICAgLy8gICAgIHN0YXJ0VGltZSA9IERhdGUubm93KClcbiAgICAvLyB9XG5cbiAgICAvLyBhc3luYyBmdW5jdGlvbiB1cGRhdGVTdG9yZWRUaW1lKHVybDogc3RyaW5nLCB0aW1lU3BlbnQ6IG51bWJlciwgdGFiSWQ6IG51bWJlcikge1xuICAgIC8vICAgICBjb25zdCBzdG9yZWREYXRhID0gYXdhaXQgc3RvcmFnZS5nZXRJdGVtKCdsb2NhbDp0aW1lRGF0YScpIGFzIHsgdGltZURhdGE6IFRpbWVEYXRhIH1cbiAgICAvLyAgICAgY29uc3QgdGltZURhdGEgPSBzdG9yZWREYXRhPy50aW1lRGF0YSB8fCB7fVxuICAgIC8vICAgICB0aW1lRGF0YVt1cmxdID0gKHRpbWVEYXRhW3VybF0gfHwgMCkgKyB0aW1lU3BlbnRcbiAgICAvLyAgICAgYXdhaXQgc3RvcmFnZS5zZXRJdGVtKFwibG9jYWw6dGltZURhdGFcIiwgeyB0aW1lRGF0YSB9KVxuXG4gICAgLy8gICAgIGNvbnN0IHN0b3JlZExpbWl0cyA9IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWw6dGltZUxpbWl0cycpIGFzIHsgdGltZUxpbWl0czogVGltZURhdGEgfVxuICAgIC8vICAgICBjb25zdCB0aW1lTGltaXRzID0gc3RvcmVkTGltaXRzPy50aW1lTGltaXRzIHx8IHt9XG4gICAgLy8gICAgIHRpbWVMaW1pdHNbdXJsXSA9IHRpbWVMaW1pdHNbdXJsXSA/IHRpbWVMaW1pdHNbdXJsXSAtIHRpbWVTcGVudCA+IDAgPyB0aW1lTGltaXRzW3VybF0gLSB0aW1lU3BlbnQgOiAwIDogMFxuICAgIC8vICAgICBhd2FpdCBzdG9yYWdlLnNldEl0ZW0oXCJsb2NhbDp0aW1lTGltaXRzXCIsIHsgdGltZUxpbWl0cyB9KVxuXG4gICAgLy8gICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgeyB0aW1lRGF0YTogdGltZURhdGFbdXJsXSwgdGltZUxpbWl0czogdGltZUxpbWl0c1t1cmxdIH0sKTtcbiAgICAvLyB9XG5cbiAgICAvLyAvLyBDaGVjayB0aW1lIGxpbWl0cyBldmVyeSBtaW51dGVcbiAgICAvLyBicm93c2VyLmFsYXJtcy5jcmVhdGUoJ2NoZWNrVGltZUxpbWl0cycsIHsgcGVyaW9kSW5NaW51dGVzOiAxIC8gNjAgfSlcblxuICAgIC8vIGJyb3dzZXIuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoYXN5bmMgKGFsYXJtKSA9PiB7XG4gICAgLy8gICAgIGlmIChhbGFybS5uYW1lID09PSAnY2hlY2tUaW1lTGltaXRzJykge1xuICAgIC8vICAgICAgICAgY29uc3QgdGltZURhdGEgPSBhd2FpdCBzdG9yYWdlLmdldEl0ZW0oJ2xvY2FsOnRpbWVEYXRhJykgYXMgVGltZURhdGFcbiAgICAvLyAgICAgICAgIGNvbnN0IHRpbWVMaW1pdHMgPSBhd2FpdCBzdG9yYWdlLmdldEl0ZW0oJ2xvY2FsOnRpbWVMaW1pdHMnKSBhcyBUaW1lRGF0YVxuICAgIC8vICAgICAgICAgY29uc3QgYWxsVGFicyA9IGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7fSk7XG4gICAgLy8gICAgICAgICBhbGxUYWJzLm1hcChhc3luYyAodGFiKSA9PiB7XG5cbiAgICAvLyAgICAgICAgICAgICBpZiAodGFiLmFjdGl2ZSlcbiAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlVGltZURhdGEodGFiKVxuXG4gICAgLy8gICAgICAgICB9KVxuXG4gICAgLy8gICAgICAgICBpZiAoIXRpbWVEYXRhIHx8ICF0aW1lTGltaXRzKSByZXR1cm5cbiAgICAvLyAgICAgICAgIGZvciAoY29uc3QgW3VybCwgdGltZVNwZW50XSBvZiBPYmplY3QuZW50cmllcyh0aW1lRGF0YSkpIHtcblxuICAgIC8vICAgICAgICAgICAgIGlmICh0aW1lTGltaXRzICYmIHRpbWVMaW1pdHNbdXJsXSAmJiB0aW1lU3BlbnQgPiB0aW1lTGltaXRzW3VybF0pIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gb3IgdGFrZSBhY3Rpb24gd2hlbiB0aW1lIGxpbWl0IGlzIGV4Y2VlZGVkXG5cbiAgICAvLyAgICAgICAgICAgICAgICAgYnJvd3Nlci5ub3RpZmljYXRpb25zLmNyZWF0ZSh7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmFzaWMnLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWNvblVybDogJ2ljb24ucG5nJyxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVGltZSBMaW1pdCBFeGNlZWRlZCcsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgWW91J3ZlIGV4Y2VlZGVkIHlvdXIgdGltZSBsaW1pdCBmb3IgJHt1cmx9YFxuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH0pXG5cbiAgICAvLyBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGFzeW5jIChtZXNzYWdlOiB7XG4gICAgLy8gICAgIHR5cGU6IHN0cmluZyxcbiAgICAvLyAgICAgdGltZXN0YW1wOiBudW1iZXJcbiAgICAvLyB9KSA9PiB7XG4gICAgLy8gICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJzdGFydFN0b3BXYXRjaFwiKXtcbiAgICAvLyAgICAgICAgIHN0b3BXYXRjaFRpbWUgPSBtZXNzYWdlLnRpbWVzdGFtcFxuICAgIC8vICAgICAgICAgdGltZVNwZW50ID0gMFxuICAgIC8vICAgICAgICAgcmV0dXJuIHsgdGltZVNwZW50IH1cbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIGlmIChtZXNzYWdlLnR5cGUgPT0gXCJwYXVzZVN0b3BXYXRjaFwiKSB7XG4gICAgLy8gICAgICAgICB0aW1lU3BlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0b3BXYXRjaFRpbWVcbiAgICAvLyAgICAgICAgIHJldHVybiB7IHRpbWVTcGVudCB9XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBpZiAobWVzc2FnZS50eXBlID09IFwiY2hlY2tTdG9wV2F0Y2hcIikge1xuICAgIC8vICAgICAgICAgdGltZVNwZW50ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdG9wV2F0Y2hUaW1lXG4gICAgLy8gICAgICAgICByZXR1cm4geyB0aW1lU3BlbnQgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PSBcImdldFRpbWVEYXRhTGlzdFwiKSB7XG4gICAgLy8gICAgICAgICBjb25zdCB0aW1lRGF0YUxpc3QgPSBhd2FpdCB0aW1lZGF0YVNlcnZpY2UuZ2V0QWxsQnlEYXkobmV3IERhdGUoKS5zZXRIb3VycygwLDAsMCwwKSlcblxuICAgIC8vICAgICAgICAgcmV0dXJuIHRpbWVEYXRhTGlzdFxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgcmV0dXJuIHsgdGltZVNwZW50IH1cbiAgICAvLyB9KVxufSk7XG5cbmNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZTogRGF0ZSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS50b0xvY2FsZVN0cmluZygnZGVmYXVsdCcsIHsgbW9udGg6ICdzaG9ydCcgfSk7XG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIHJldHVybiBgJHtkYXl9ICR7bW9udGh9ICR7eWVhcn1gO1xufTsiXSwibmFtZXMiOlsiZ2xvYmFsIiwidGhpcyIsIm1vZHVsZSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJyZXN1bHQiLCJtZXNzYWdlIiwiRXJyb3IiLCJfX2RlZlByb3AiLCJfX2RlZk5vcm1hbFByb3AiLCJfX2FzeW5jIiwiQnJvd3NlciIsImlzT2JqZWN0IiwicmVxdWlyZSQkMCIsImdldCIsInRhcmdldCIsImN1cnJlbnRUYWIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsTUFBSSxnQkFBZ0IsTUFBTTtBQUFBLElBQ3hCLFlBQVksY0FBYztBQUN4QixVQUFJLGlCQUFpQixjQUFjO0FBQ2pDLGFBQUssWUFBWTtBQUNqQixhQUFLLGtCQUFrQixDQUFDLEdBQUcsY0FBYyxTQUFTO0FBQ2xELGFBQUssZ0JBQWdCO0FBQ3JCLGFBQUssZ0JBQWdCO0FBQUEsTUFDM0IsT0FBVztBQUNMLGNBQU0sU0FBUyx1QkFBdUIsS0FBSyxZQUFZO0FBQ3ZELFlBQUksVUFBVTtBQUNaLGdCQUFNLElBQUksb0JBQW9CLGNBQWMsa0JBQWtCO0FBQ2hFLGNBQU0sQ0FBQyxHQUFHLFVBQVUsVUFBVSxRQUFRLElBQUk7QUFDMUMseUJBQWlCLGNBQWMsUUFBUTtBQUN2Qyx5QkFBaUIsY0FBYyxRQUFRO0FBRXZDLGFBQUssa0JBQWtCLGFBQWEsTUFBTSxDQUFDLFFBQVEsT0FBTyxJQUFJLENBQUMsUUFBUTtBQUN2RSxhQUFLLGdCQUFnQjtBQUNyQixhQUFLLGdCQUFnQjtBQUFBLE1BQzNCO0FBQUEsSUFDQTtBQUFBLElBQ0Us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bUI7QUFDbkMsY0FBTSxZQUFZLE1BQU0saUJBQWlCLElBQUksUUFBUSxLQUFLLEVBQUU7QUFDeEQsWUFBQSxDQUFDLFVBQWtCLFFBQUE7QUFBQSxVQUNuQixRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsUUFDYjtBQUNBLFlBQUksQ0FBQyxVQUFXO0FBRWhCLGNBQU0saUJBQWlCLE9BQU87QUFBQSxVQUMxQixHQUFHO0FBQUEsVUFDSCxRQUFRLENBQUMsVUFBVTtBQUFBLFFBQUEsQ0FDdEI7QUFDTSxlQUFBO0FBQUEsVUFDSCxRQUFRO0FBQUEsVUFBVyxTQUFTO0FBQUEsUUFDaEM7QUFBQSxNQUFBO0FBRUEsVUFBQSxRQUFRLFFBQVEsZUFBZTtBQUN4QixlQUFBO0FBQUEsVUFDSCxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsVUFDVCxNQUFNLE1BQU0sWUFBWTtBQUFBLFFBQzVCO0FBQUEsTUFBQTtBQUdKLGFBQU8sRUFBRSxRQUFRLFNBQVMsU0FBUyx1QkFBdUI7QUFBQSxJQUFBLENBQzdEO0FBQUEsRUF5SUwsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMSwxMl19
