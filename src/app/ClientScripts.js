"use client";
import { useEffect } from "react";

const ClientScripts = () => {
  useEffect(() => {
    // 加载广告脚本
    const adScript = document.createElement("script");
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    adScript.async = true;
    adScript.crossOrigin = "anonymous";
    document.body.appendChild(adScript);

    // 在脚本加载完毕后初始化广告
    adScript.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    // 加载统计脚本
    const piwikScript = document.createElement("script");
    piwikScript.async = true;
    piwikScript.src = "https://piwik.seoipo.com/matomo.js";
    document.body.appendChild(piwikScript);

    var _paq = (window._paq = window._paq || []);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    _paq.push(["setTrackerUrl", "https://piwik.seoipo.com/matomo.php"]);
    _paq.push(["setSiteId", "11"]);
  }, []);

  return null; // 无需渲染任何内容
};

export default ClientScripts;
