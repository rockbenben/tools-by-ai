import React from "react";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "./ui/Navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <body>
        <Navigation />
        <script data-ad-client="ca-pub-7585955822109216" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        {children}
        <Script
          id="piwik"
          dangerouslySetInnerHTML={{
            __html: `
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
                var u="https://piwik.seoipo.com/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '11']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
        `,
          }}
        />
        <Script src="https://oss.newzone.top/instantpage.min.js" type="module" strategy="lazyOnload" />
      </body>
    </html>
  );
}
