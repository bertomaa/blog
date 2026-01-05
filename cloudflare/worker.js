export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        // ---------------------------------------------------------
        // Unified Proxy Path: /p/
        // ---------------------------------------------------------
        // 1. Umami -> /p/umami/
        // /p/umami/s.js -> https://cloud.umami.is/script.js
        // /p/umami/api/send -> https://cloud.umami.is/api/send
        const UMAMI_HOST = 'https://cloud.umami.is';
        if (url.pathname === '/p/umami/s.js') {
            return fetch(`${UMAMI_HOST}/script.js`, request);
        }
        if (url.pathname === '/p/umami/api/send') {
            return fetch(`${UMAMI_HOST}/api/send`, request);
        }
        // 2. PostHog -> /p/posthog/
        // /p/posthog/* -> https://eu.i.posthog.com/*
        const POSTHOG_HOST = 'https://eu.i.posthog.com';
        if (url.pathname.startsWith('/p/posthog/')) {
            // Strip '/p/posthog' from the path
            const newPath = url.pathname.substring(10);
            const newUrl = `${POSTHOG_HOST}${newPath}${url.search}`;
            return fetch(newUrl, request);
        }
        return new Response('Not Found', { status: 404 });
    },
};