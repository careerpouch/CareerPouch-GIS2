import React, { useState, useEffect } from 'react';

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
  const [adBlockedOrFailed, setAdBlockedOrFailed] = useState(false);

  // Fallback to environment variables if set, otherwise use the provided bannerKey prop or hardcoded fallbacks
  const envKey = width === 728 
    ? import.meta.env.VITE_ADSTERRA_LEADERBOARD_KEY 
    : import.meta.env.VITE_ADSTERRA_SQUARE_KEY;
  
  const rawKey = (envKey || bannerKey || (width === 728 ? '29552977' : '29553000')).trim();

  // Extract pure key if user passes script tag string
  const extractedKeyMatch = rawKey.match(/invoke\.js|\/([a-f0-9]{32}|[0-9]{8,})/i);
  const activeKey = extractedKeyMatch ? (extractedKeyMatch[1] || rawKey) : rawKey;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === `adsterra-blocked-${id}`) {
        setAdBlockedOrFailed(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id]);

  const srcDocContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
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
    <script type="text/javascript">
      var atOptions = {
        'key' : '${activeKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    </script>
    <script 
      type="text/javascript" 
      src="https://www.highperformanceformat.com/${activeKey}/invoke.js"
      onerror="try { window.parent.postMessage('adsterra-blocked-${id}', '*'); } catch(e) {}"
    ></script>
  </body>
</html>`;

  const defaultContainerClass = width === 728
    ? 'w-full min-h-[90px] flex items-center justify-center my-4 overflow-hidden max-w-[728px] mx-auto rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 p-2'
    : 'w-full min-h-[250px] flex items-center justify-center my-4 overflow-hidden max-w-[300px] mx-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 p-3';

  return (
    <div className={className || defaultContainerClass}>
      {!adBlockedOrFailed ? (
        <iframe
          id={id}
          title={`Adsterra Ad ${id}`}
          srcDoc={srcDocContent}
          width={width}
          height={height}
          style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
          scrolling="no"
          onError={() => setAdBlockedOrFailed(true)}
        />
      ) : (
        <div className="text-center p-3 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          <div className="font-bold text-amber-500/80 mb-1">● Sponsored Ad Slot ({width}x{height})</div>
          <div>Ad network script offline or blocked by AdBlocker</div>
        </div>
      )}
    </div>
  );
};


