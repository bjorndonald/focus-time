(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
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
{
  try {
    const ws2 = getDevServerWebSocket();
    ws2.addWxtEventListener("wxt:reload-page", (event) => {
      if (event.detail === location.pathname.substring(1)) location.reload();
    });
  } catch (err) {
    logger.error("Failed to setup web socket connection with dev server", err);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLWh0bWwtQ29acExQeFcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC92aXJ0dWFsL3JlbG9hZC1odG1sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9zYW5kYm94L3V0aWxzL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBtZXRob2QoYFt3eHRdICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbiAgfVxufVxudmFyIGxvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcbiAgbG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcblxuLy8gc3JjL3NhbmRib3gvZGV2LXNlcnZlci13ZWJzb2NrZXQudHNcbnZhciB3cztcbmZ1bmN0aW9uIGdldERldlNlcnZlcldlYlNvY2tldCgpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5DT01NQU5EICE9PSBcInNlcnZlXCIpXG4gICAgdGhyb3cgRXJyb3IoXG4gICAgICBcIk11c3QgYmUgcnVubmluZyBXWFQgZGV2IGNvbW1hbmQgdG8gY29ubmVjdCB0byBjYWxsIGdldERldlNlcnZlcldlYlNvY2tldCgpXCJcbiAgICApO1xuICBpZiAod3MgPT0gbnVsbCkge1xuICAgIGNvbnN0IHNlcnZlclVybCA9IGAke19fREVWX1NFUlZFUl9QUk9UT0NPTF9ffS8vJHtfX0RFVl9TRVJWRVJfSE9TVE5BTUVfX306JHtfX0RFVl9TRVJWRVJfUE9SVF9ffWA7XG4gICAgbG9nZ2VyLmRlYnVnKFwiQ29ubmVjdGluZyB0byBkZXYgc2VydmVyIEBcIiwgc2VydmVyVXJsKTtcbiAgICB3cyA9IG5ldyBXZWJTb2NrZXQoc2VydmVyVXJsLCBcInZpdGUtaG1yXCIpO1xuICAgIHdzLmFkZFd4dEV2ZW50TGlzdGVuZXIgPSB3cy5hZGRFdmVudExpc3RlbmVyLmJpbmQod3MpO1xuICAgIHdzLnNlbmRDdXN0b20gPSAoZXZlbnQsIHBheWxvYWQpID0+IHdzPy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJjdXN0b21cIiwgZXZlbnQsIHBheWxvYWQgfSkpO1xuICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICgpID0+IHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcIkNvbm5lY3RlZCB0byBkZXYgc2VydmVyXCIpO1xuICAgIH0pO1xuICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJEaXNjb25uZWN0ZWQgZnJvbSBkZXYgc2VydmVyXCIpO1xuICAgIH0pO1xuICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGxvZ2dlci5lcnJvcihcIkZhaWxlZCB0byBjb25uZWN0IHRvIGRldiBzZXJ2ZXJcIiwgZXZlbnQpO1xuICAgIH0pO1xuICAgIHdzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChlKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBcImN1c3RvbVwiKSB7XG4gICAgICAgICAgd3M/LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQobWVzc2FnZS5ldmVudCwgeyBkZXRhaWw6IG1lc3NhZ2UuZGF0YSB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gaGFuZGxlIG1lc3NhZ2VcIiwgZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gd3M7XG59XG5cbi8vIHNyYy92aXJ0dWFsL3JlbG9hZC1odG1sLnRzXG5pZiAoaW1wb3J0Lm1ldGEuZW52LkNPTU1BTkQgPT09IFwic2VydmVcIikge1xuICB0cnkge1xuICAgIGNvbnN0IHdzMiA9IGdldERldlNlcnZlcldlYlNvY2tldCgpO1xuICAgIHdzMi5hZGRXeHRFdmVudExpc3RlbmVyKFwid3h0OnJlbG9hZC1wYWdlXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmRldGFpbCA9PT0gbG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpKSBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHNldHVwIHdlYiBzb2NrZXQgY29ubmVjdGlvbiB3aXRoIGRldiBzZXJ2ZXJcIiwgZXJyKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxTQUFTLE1BQU0sV0FBVyxNQUFNO0FBRTlCLE1BQUksT0FBTyxLQUFLLENBQUMsTUFBTSxVQUFVO0FBQ3pCLFVBQUEsVUFBVSxLQUFLLE1BQU07QUFDM0IsV0FBTyxTQUFTLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxFQUFBLE9BQzdCO0FBQ0UsV0FBQSxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQUE7QUFFM0I7QUFDQSxJQUFJLFNBQVM7QUFBQSxFQUNYLE9BQU8sSUFBSSxTQUFTLE1BQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUFBLEVBQ2hELEtBQUssSUFBSSxTQUFTLE1BQU0sUUFBUSxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQzVDLE1BQU0sSUFBSSxTQUFTLE1BQU0sUUFBUSxNQUFNLEdBQUcsSUFBSTtBQUFBLEVBQzlDLE9BQU8sSUFBSSxTQUFTLE1BQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUNsRDtBQUdBLElBQUk7QUFDSixTQUFTLHdCQUF3QjtBQUsvQixNQUFJLE1BQU0sTUFBTTtBQUNkLFVBQU0sWUFBWSxHQUFHLEtBQXVCLEtBQUssV0FBdUIsSUFBSSxHQUFtQjtBQUN4RixXQUFBLE1BQU0sOEJBQThCLFNBQVM7QUFDL0MsU0FBQSxJQUFJLFVBQVUsV0FBVyxVQUFVO0FBQ3hDLE9BQUcsc0JBQXNCLEdBQUcsaUJBQWlCLEtBQUssRUFBRTtBQUNwRCxPQUFHLGFBQWEsQ0FBQyxPQUFPLFlBQVkseUJBQUksS0FBSyxLQUFLLFVBQVUsRUFBRSxNQUFNLFVBQVUsT0FBTyxRQUFTLENBQUE7QUFDM0YsT0FBQSxpQkFBaUIsUUFBUSxNQUFNO0FBQ2hDLGFBQU8sTUFBTSx5QkFBeUI7QUFBQSxJQUFBLENBQ3ZDO0FBQ0UsT0FBQSxpQkFBaUIsU0FBUyxNQUFNO0FBQ2pDLGFBQU8sTUFBTSw4QkFBOEI7QUFBQSxJQUFBLENBQzVDO0FBQ0UsT0FBQSxpQkFBaUIsU0FBUyxDQUFDLFVBQVU7QUFDL0IsYUFBQSxNQUFNLG1DQUFtQyxLQUFLO0FBQUEsSUFBQSxDQUN0RDtBQUNFLE9BQUEsaUJBQWlCLFdBQVcsQ0FBQyxNQUFNO0FBQ2hDLFVBQUE7QUFDRixjQUFNLFVBQVUsS0FBSyxNQUFNLEVBQUUsSUFBSTtBQUM3QixZQUFBLFFBQVEsU0FBUyxVQUFVO0FBQ3pCLG1DQUFBO0FBQUEsWUFDRixJQUFJLFlBQVksUUFBUSxPQUFPLEVBQUUsUUFBUSxRQUFRLEtBQU0sQ0FBQTtBQUFBO0FBQUEsUUFDekQ7QUFBQSxlQUVLLEtBQUs7QUFDTCxlQUFBLE1BQU0sNEJBQTRCLEdBQUc7QUFBQSxNQUFBO0FBQUEsSUFDOUMsQ0FDRDtBQUFBLEVBQUE7QUFFSSxTQUFBO0FBQ1Q7QUFHeUM7QUFDbkMsTUFBQTtBQUNGLFVBQU0sTUFBTSxzQkFBc0I7QUFDOUIsUUFBQSxvQkFBb0IsbUJBQW1CLENBQUMsVUFBVTtBQUNoRCxVQUFBLE1BQU0sV0FBVyxTQUFTLFNBQVMsVUFBVSxDQUFDLFlBQVksT0FBTztBQUFBLElBQUEsQ0FDdEU7QUFBQSxXQUNNLEtBQUs7QUFDTCxXQUFBLE1BQU0seURBQXlELEdBQUc7QUFBQSxFQUFBO0FBRTdFOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
