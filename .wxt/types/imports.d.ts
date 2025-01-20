// Generated by wxt
export {}
declare global {
  const ContentScriptContext: typeof import('wxt/client')['ContentScriptContext']
  const InvalidMatchPattern: typeof import('wxt/sandbox')['InvalidMatchPattern']
  const MatchPattern: typeof import('wxt/sandbox')['MatchPattern']
  const browser: typeof import('wxt/browser')['browser']
  const createIframeUi: typeof import('wxt/client')['createIframeUi']
  const createIntegratedUi: typeof import('wxt/client')['createIntegratedUi']
  const createShadowRootUi: typeof import('wxt/client')['createShadowRootUi']
  const defineAppConfig: typeof import('wxt/sandbox')['defineAppConfig']
  const defineBackground: typeof import('wxt/sandbox')['defineBackground']
  const defineConfig: typeof import('wxt')['defineConfig']
  const defineContentScript: typeof import('wxt/sandbox')['defineContentScript']
  const defineUnlistedScript: typeof import('wxt/sandbox')['defineUnlistedScript']
  const defineWxtPlugin: typeof import('wxt/sandbox')['defineWxtPlugin']
  const fakeBrowser: typeof import('wxt/testing')['fakeBrowser']
  const getFavIconService: typeof import('/Users/mac/dev/open_source/background-message/utils/favicon-service')['getFavIconService']
  const getPageViewService: typeof import('/Users/mac/dev/open_source/background-message/utils/pageview-service')['getPageViewService']
  const getSessionService: typeof import('/Users/mac/dev/open_source/background-message/utils/session-service')['getSessionService']
  const getTimeLimitsService: typeof import('/Users/mac/dev/open_source/background-message/utils/timelimits-service')['getTimeLimitsService']
  const getWatchService: typeof import('/Users/mac/dev/open_source/background-message/utils/watch-service')['getWatchService']
  const openExtensionDatabase: typeof import('/Users/mac/dev/open_source/background-message/utils/database')['openExtensionDatabase']
  const registerFavIconService: typeof import('/Users/mac/dev/open_source/background-message/utils/favicon-service')['registerFavIconService']
  const registerPageViewService: typeof import('/Users/mac/dev/open_source/background-message/utils/pageview-service')['registerPageViewService']
  const registerSessionService: typeof import('/Users/mac/dev/open_source/background-message/utils/session-service')['registerSessionService']
  const registerTimeLimitsService: typeof import('/Users/mac/dev/open_source/background-message/utils/timelimits-service')['registerTimeLimitsService']
  const registerWatchService: typeof import('/Users/mac/dev/open_source/background-message/utils/watch-service')['registerWatchService']
  const storage: typeof import('wxt/storage')['storage']
  const useAppConfig: typeof import('wxt/client')['useAppConfig']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { ExtensionDatabase } from '/Users/mac/dev/open_source/background-message/utils/database'
  import('/Users/mac/dev/open_source/background-message/utils/database')
  // @ts-ignore
  export type { FaviconInfoService } from '/Users/mac/dev/open_source/background-message/utils/favicon-service'
  import('/Users/mac/dev/open_source/background-message/utils/favicon-service')
  // @ts-ignore
  export type { PageViewService } from '/Users/mac/dev/open_source/background-message/utils/pageview-service'
  import('/Users/mac/dev/open_source/background-message/utils/pageview-service')
  // @ts-ignore
  export type { SessionDataService } from '/Users/mac/dev/open_source/background-message/utils/session-service'
  import('/Users/mac/dev/open_source/background-message/utils/session-service')
  // @ts-ignore
  export type { TimeLimitsService } from '/Users/mac/dev/open_source/background-message/utils/timelimits-service'
  import('/Users/mac/dev/open_source/background-message/utils/timelimits-service')
  // @ts-ignore
  export type { FaviconInfo, PageView, SessionData, TimeLimits, Watch } from '/Users/mac/dev/open_source/background-message/utils/types'
  import('/Users/mac/dev/open_source/background-message/utils/types')
  // @ts-ignore
  export type { WatchService } from '/Users/mac/dev/open_source/background-message/utils/watch-service'
  import('/Users/mac/dev/open_source/background-message/utils/watch-service')
}
