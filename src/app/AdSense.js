"use client";
import React, { useEffect } from "react";

const AdsenseAd = () => {
  useEffect(() => {
    // 检查广告脚本是否已经加载并且防止重复加载
    let adsbygoogleScript = document.querySelector("script[src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7585955822109216']");
    if (!adsbygoogleScript) {
      adsbygoogleScript = document.createElement("script");
      adsbygoogleScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7585955822109216";
      adsbygoogleScript.async = true;
      adsbygoogleScript.crossOrigin = "anonymous";
      document.body.appendChild(adsbygoogleScript);
    }

    // 初始化广告
    adsbygoogleScript.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Failed to initialize ads", e);
      }
    };

    // 组件卸载时，防止 onload 多次触发
    return () => {
      adsbygoogleScript.onload = null;
    };
  }, []);

  return <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-7585955822109216" data-ad-slot="3744254915" data-ad-format="auto" data-full-width-responsive="true"></ins>;
};

export default AdsenseAd;
