import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: 'Focus Time',
        description: 'Track and limit your time on websites',
        version: '1.0.0',
        permissions: ['storage', 'tabs', 'alarms'],
        icons: {
            "16": "icons/favicon-16x16.png",
            "32": "icons/favicon-32x32.png",
            "96": "icons/favicon-96x96.png",
            "128": "icons/favicon-128.png",
            "196": "icons/favicon-196x196.png",
        }
    },
    runner: {
        startUrls: ["https://x.com", "https://kaggle.com"],
    },
});