if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const r = (e) => n(e, t),
      d = { module: { uri: t }, exports: i, require: r };
    s[t] = Promise.all(a.map((e) => d[e] || r(e))).then((e) => (c(...e), i));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts("/push-sw.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/7uQUWW2UqtQjIsbEMzdxl/_buildManifest.js",
          revision: "ad04764732c262441b3dfd8632f34e93",
        },
        {
          url: "/_next/static/7uQUWW2UqtQjIsbEMzdxl/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/124-59b5c0a2ad651731.js",
          revision: "59b5c0a2ad651731",
        },
        {
          url: "/_next/static/chunks/370-5e0a8ed363c87c57.js",
          revision: "5e0a8ed363c87c57",
        },
        {
          url: "/_next/static/chunks/3d47b92a-9fd20b47d921a364.js",
          revision: "9fd20b47d921a364",
        },
        {
          url: "/_next/static/chunks/479ba886-091b94681f897f00.js",
          revision: "091b94681f897f00",
        },
        {
          url: "/_next/static/chunks/4bd1b696-deba172d32c79f82.js",
          revision: "deba172d32c79f82",
        },
        {
          url: "/_next/static/chunks/53c13509-eddd1bb1e0c1894e.js",
          revision: "eddd1bb1e0c1894e",
        },
        {
          url: "/_next/static/chunks/5e22fd23-5cc17759bb277833.js",
          revision: "5cc17759bb277833",
        },
        {
          url: "/_next/static/chunks/772-3771028844326c4b.js",
          revision: "3771028844326c4b",
        },
        {
          url: "/_next/static/chunks/795d4814-fe0d78502e4f4a40.js",
          revision: "fe0d78502e4f4a40",
        },
        {
          url: "/_next/static/chunks/899.1813981119fa1f8a.js",
          revision: "1813981119fa1f8a",
        },
        {
          url: "/_next/static/chunks/920-d76ec49df2da4b3c.js",
          revision: "d76ec49df2da4b3c",
        },
        {
          url: "/_next/static/chunks/928-09594eb82c2a88c3.js",
          revision: "09594eb82c2a88c3",
        },
        {
          url: "/_next/static/chunks/94730671-a2efbd88098790fa.js",
          revision: "a2efbd88098790fa",
        },
        {
          url: "/_next/static/chunks/966.1775eb621d8d3e09.js",
          revision: "1775eb621d8d3e09",
        },
        {
          url: "/_next/static/chunks/9c4e2130-5c95c9ed5e455434.js",
          revision: "5c95c9ed5e455434",
        },
        {
          url: "/_next/static/chunks/app/(main)/auth/login/page-b7e6a72e5db4a1bc.js",
          revision: "b7e6a72e5db4a1bc",
        },
        {
          url: "/_next/static/chunks/app/(main)/auth/register/page-60ccd487e5d61180.js",
          revision: "60ccd487e5d61180",
        },
        {
          url: "/_next/static/chunks/app/(main)/chat/%5BroomId%5D/page-68d6b7695cdcdf28.js",
          revision: "68d6b7695cdcdf28",
        },
        {
          url: "/_next/static/chunks/app/(main)/chat/%5BroomId%5D/settings/page-7306536188cfeb98.js",
          revision: "7306536188cfeb98",
        },
        {
          url: "/_next/static/chunks/app/(main)/chat/invitations/page-8738d65842be3d1f.js",
          revision: "8738d65842be3d1f",
        },
        {
          url: "/_next/static/chunks/app/(main)/chat/page-cbaec06e79e77037.js",
          revision: "cbaec06e79e77037",
        },
        {
          url: "/_next/static/chunks/app/(main)/chat/settings/page-7306536188cfeb98.js",
          revision: "7306536188cfeb98",
        },
        {
          url: "/_next/static/chunks/app/(main)/page-8f2b0ad7ca26260f.js",
          revision: "8f2b0ad7ca26260f",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-7ed2c54b19973dfc.js",
          revision: "7ed2c54b19973dfc",
        },
        {
          url: "/_next/static/chunks/app/layout-c3672a8b21033f9a.js",
          revision: "c3672a8b21033f9a",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/e34aaff9-4650c34d3fdcf7c3.js",
          revision: "4650c34d3fdcf7c3",
        },
        {
          url: "/_next/static/chunks/ee560e2c-7a96e64af61833e1.js",
          revision: "7a96e64af61833e1",
        },
        {
          url: "/_next/static/chunks/framework-292291387d6b2e39.js",
          revision: "292291387d6b2e39",
        },
        {
          url: "/_next/static/chunks/main-34fe588c638dad3a.js",
          revision: "34fe588c638dad3a",
        },
        {
          url: "/_next/static/chunks/main-app-c09fdfd0bb9304c0.js",
          revision: "c09fdfd0bb9304c0",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-5fe4f08e71145ea3.js",
          revision: "5fe4f08e71145ea3",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-085dfe6b711ec138.js",
          revision: "085dfe6b711ec138",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-7a07bd6ba27def77.js",
          revision: "7a07bd6ba27def77",
        },
        {
          url: "/_next/static/css/17f970b1ee16ad74.css",
          revision: "17f970b1ee16ad74",
        },
        {
          url: "/_next/static/media/4cf2300e9c8272f7-s.p.woff2",
          revision: "18bae71b1e1b2bb25321090a3b563103",
        },
        {
          url: "/_next/static/media/747892c23ea88013-s.woff2",
          revision: "a0761690ccf4441ace5cec893b82d4ab",
        },
        {
          url: "/_next/static/media/8d697b304b401681-s.woff2",
          revision: "cc728f6c0adb04da0dfcb0fc436a8ae5",
        },
        {
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/9610d9e46709d722-s.woff2",
          revision: "7b7c0ef93df188a852344fc272fc096b",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        {
          url: "/icons/192x192.png",
          revision: "8424cfb697fe8a29ab8be1ec8e9599fe",
        },
        {
          url: "/icons/512x512.png",
          revision: "7a70863e4692213ece028a3e23f5449a",
        },
        {
          url: "/icons/apple-touch-icon.png",
          revision: "8424cfb697fe8a29ab8be1ec8e9599fe",
        },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "76fdd3369f623a3edcf74ce2200bfdd0",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        n &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") && n && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
