import React, { useState, useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  id: string;
  bannerKey?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ 
  id, 
  bannerKey,
  width = 728,
  height = 90,
  className
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [adBlockedOrFailed, setAdBlockedOrFailed] = useState(false);

  // Fallback to environment variables if set, otherwise use the provided bannerKey prop or hardcoded fallbacks
  const envKey = width === 728 
    ? import.meta.env.VITE_ADSTERRA_LEADERBOARD_KEY 
    : import.meta.env.VITE_ADSTERRA_SQUARE_KEY;
  
  const rawKey = (envKey || bannerKey || (width === 728 ? '29552977' : '29553000')).trim();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setAdBlockedOrFailed(false);
    container.innerHTML = '';

    // Create an isolated iframe to prevent window.atOptions collisions while preserving referrer domain
    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${id}`;
    iframe.title = `Adsterra Ad ${id}`;
    iframe.width = `${width}`;
    iframe.height = `${height}`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'transparent';
    iframe.style.maxWidth = '100%';
    iframe.scrolling = 'no';

    container.appendChild(iframe);

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        setAdBlockedOrFailed(true);
        return;
      }

      // Determine if rawKey is a full script snippet or an 8-digit/32-character key
      let scriptMarkup = '';
      if (rawKey.includes('<script')) {
        scriptMarkup = rawKey;
      } else {
        // Extract key ID if user provided URL or full key string
        const extractedKeyMatch = rawKey.match(/invoke\.js|\/([a-f0-9]{32}|[0-9]{8,})/i);
        const activeKey = extractedKeyMatch ? (extractedKeyMatch[1] || rawKey) : rawKey;

        // Check if key is 32-char effectivecpmnetwork key or standard highperformanceformat key
        const scriptUrl = activeKey.length === 32 
          ? `https://pl29714375.effectivecpmnetwork.com/${activeKey}/invoke.js`
          : `https://www.highperformanceformat.com/${activeKey}/invoke.js`;

        scriptMarkup = `
          <script type="text/javascript">
            var atOptions = {
              'key' : '${activeKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <div id="container-${activeKey}"></div>
          <script type="text/javascript" src="${scriptUrl}" onerror="window.parent.postMessage('adsterra-blocked-${id}', '*')"></script>
        `;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="referrer" content="always">
            <meta name="referrer" content="unsafe-url">
            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            </style>
          </head>
          <body>
            ${scriptMarkup}
          </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();
    } catch (e) {
      console.warn(`[Adsterra] Failed to write iframe document for ${id}`, e);
      setAdBlockedOrFailed(true);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data === `adsterra-blocked-${id}`) {
        setAdBlockedOrFailed(true);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [id, rawKey, width, height]);

  const defaultContainerClass = width === 728
    ? 'w-full min-h-[90px] flex items-center justify-center my-4 overflow-hidden max-w-[728px] mx-auto rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 p-2'
    : 'w-full min-h-[250px] flex items-center justify-center my-4 overflow-hidden max-w-[300px] mx-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 p-3';

  return (
    <div className={className || defaultContainerClass}>
      <div ref={containerRef} className="w-full flex items-center justify-center min-h-[90px]" />
      {adBlockedOrFailed && (
        <div className="text-center p-3 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          <div className="font-bold text-amber-500/80 mb-1">● Sponsored Ad Slot ({width}x{height})</div>
          <div>Ad network script offline or blocked by AdBlocker</div>
        </div>
      )}
    </div>
  );
};



