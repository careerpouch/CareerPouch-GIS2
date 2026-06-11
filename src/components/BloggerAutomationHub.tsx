import { useState, useEffect } from 'react';
import { TOOLS } from '../data/toolsData';
import { Tool } from '../types';
import { 
  Settings, 
  Calendar, 
  CheckCircle, 
  Play, 
  HelpCircle, 
  ExternalLink, 
  RefreshCw, 
  Pause, 
  Eye, 
  Clock, 
  BookOpen, 
  Info,
  ChevronRight,
  Sparkles,
  ChevronDown,
  Lock
} from 'lucide-react';

interface BloggerPost {
  id: string;
  title: string;
  published: string;
  url: string;
  toolId: string;
}

export function BloggerAutomationHub({ isDarkMode, appUrl }: { isDarkMode: boolean; appUrl: string }) {
  // Developer Overrides (Subtle & optional, loaded from Env first then localStorage)
  const [clientId, setClientId] = useState(() => import.meta.env.VITE_BLOGGER_CLIENT_ID || localStorage.getItem('cp_blogger_client_id') || '');
  const [blogId, setBlogId] = useState(() => import.meta.env.VITE_BLOGGER_BLOG_ID || localStorage.getItem('cp_blogger_blog_id') || '');
  const [targetUrl, setTargetUrl] = useState(() => localStorage.getItem('cp_blogger_target_url') || appUrl || 'https://careerpouch.com');
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('cp_blogger_access_token') || '');
  
  // Automation loop states
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(() => {
    const saved = localStorage.getItem('cp_blogger_queue_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isAutoActive, setIsAutoActive] = useState<boolean>(() => {
    return localStorage.getItem('cp_blogger_auto_active') === 'true';
  });

  const [publishedHistory, setPublishedHistory] = useState<BloggerPost[]>(() => {
    const saved = localStorage.getItem('cp_blogger_published_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastCheckedDate, setLastCheckedDate] = useState<string>(() => {
    return localStorage.getItem('cp_blogger_last_checked_date') || '';
  });

  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const [showOverrides, setShowOverrides] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Persist overridden settings to local storage on change
  useEffect(() => {
    localStorage.setItem('cp_blogger_client_id', clientId);
  }, [clientId]);

  useEffect(() => {
    localStorage.setItem('cp_blogger_blog_id', blogId);
  }, [blogId]);

  useEffect(() => {
    localStorage.setItem('cp_blogger_target_url', targetUrl);
  }, [targetUrl]);

  useEffect(() => {
    localStorage.setItem('cp_blogger_queue_index', currentQueueIndex.toString());
  }, [currentQueueIndex]);

  useEffect(() => {
    localStorage.setItem('cp_blogger_auto_active', isAutoActive.toString());
  }, [isAutoActive]);

  useEffect(() => {
    localStorage.setItem('cp_blogger_published_history', JSON.stringify(publishedHistory));
  }, [publishedHistory]);

  // Read URL Hash for implicit OAuth Redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      const state = params.get('state');
      if (token && state === 'blogger_automation') {
        setAccessToken(token);
        sessionStorage.setItem('cp_blogger_access_token', token);
        // Clear hash from URL cleanly
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setSuccessMsg('Successfully linked with your Google credentials!');
      }
    }
  }, []);

  // Fetch Blogger profile once linked
  useEffect(() => {
    if (!accessToken) {
      setUserInfo(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            name: data.name || 'Blogger Admin',
            email: data.email || 'api@blogger.com',
            picture: data.picture || ''
          });
        } else if (response.status === 401) {
          // Token expired
          setAccessToken('');
          sessionStorage.removeItem('cp_blogger_access_token');
          setErrorMsg('Your Google connection token has expired. Please re-authenticate.');
        }
      } catch (e) {
        console.error('Error fetching user info:', e);
      }
    };

    fetchProfile();
  }, [accessToken]);

  // Dynamic Blog Post Content HTML Generator
  const generatePostHtml = (tool: Tool) => {
    const toolLink = `${targetUrl}/?tool=${tool.id}`;
    const suiteLink = targetUrl;
    
    let imageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop';
    if (tool.category === 'career') {
      imageUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'productivity') {
      imageUrl = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'math') {
      imageUrl = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'converters') {
      imageUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'text') {
      imageUrl = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'design') {
      imageUrl = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop';
    } else if (tool.category === 'accounting') {
      imageUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop';
    }

    return `
<div style="font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 650px; margin: 0 auto; color: #334155; line-height: 1.7; padding: 10px 0;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #4f46e5; background-color: #eedeffff; padding: 6px 14px; border-radius: 9999px; box-shadow: 0 2px 5px rgba(79, 70, 229, 0.05);">Featured Application</span>
    <h1 style="font-size: 30px; font-weight: 900; margin-top: 18px; margin-bottom: 8px; color: #0f172a; letter-spacing: -0.025em; line-height: 1.2;">Optimize Your Workflow with ${tool.name}</h1>
    <p style="font-size: 15px; color: #64748b; margin-bottom: 0;">Explore premium technical tools for developers, job hunters, and digital creators on CareerPouch.</p>
  </div>
  
  <div style="border-radius: 20px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;">
    <img src="${imageUrl}" alt="${tool.name}" style="width: 100%; height: auto; display: block; object-fit: cover; max-height: 380px;" />
  </div>

  <div style="background-color: #f8fafc; border-left: 5px solid #4f46e5; padding: 20px; border-radius: 6px 16px 16px 6px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);">
    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">Introducing ${tool.name}</h3>
    <p style="margin: 0; font-size: 14.5px; color: #475569; line-height: 1.6;">${tool.description}</p>
  </div>

  <h2 style="font-size: 21px; font-weight: 800; color: #0f172a; margin-top: 35px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; letter-spacing: -0.015em;">Core Benefits & Features</h2>
  <ul style="padding-left: 20px; margin-bottom: 30px; font-size: 14.5px; color: #334155;">
    <li style="margin-bottom: 10px; line-height: 1.6;"><strong>100% Client-Side Architecture:</strong> Your data remains completely secure and offline. No background servers process your uploads or calculations.</li>
    <li style="margin-bottom: 10px; line-height: 1.6;"><strong>Instant Productivity Gains:</strong> Access beautiful UI layouts, formatted results, and automated calculations in just one click.</li>
    <li style="margin-bottom: 10px; line-height: 1.6;"><strong>Completely Free & Uncapped:</strong> Avoid paywalls and annoying limits. Use any of the ${TOOLS.length}+ available builders anytime.</li>
  </ul>

  <h2 style="font-size: 21px; font-weight: 800; color: #0f172a; margin-top: 30px; margin-bottom: 15px; letter-spacing: -0.015em;">Run It Instantly Inside CareerPouch</h2>
  <p style="font-size: 14.5px; color: #334155; margin-bottom: 30px; line-height: 1.6;">Get direct, unrestricted sandbox access to the official <strong>${tool.name}</strong> toolkit. Ready to bootstrap your development velocity?</p>
  
  <div style="text-align: center; margin-top: 30px; margin-bottom: 35px;">
    <a href="${toolLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none !important; font-weight: 800; font-size: 15px; padding: 15px 32px; border-radius: 12px; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25); border: 1px solid rgba(255,255,255,0.1); letter-spacing: -0.01em;">
      ⚡ Launch the ${tool.name} Application
    </a>
  </div>

  <div style="background-color: #f1f5f9; border-radius: 16px; padding: 24px; text-align: center; font-size: 13.5px; color: #64748b; border: 1px solid #e2e8f0;">
    <p style="margin: 0 0 8px 0; font-weight: 800; color: #0f172a; font-size: 15px;">Explore ${TOOLS.length}+ Smart Tools For Developers & Pros</p>
    <p style="margin: 0 0 16px 0; line-height: 1.5;">CareerPouch is a suite of custom-crafted format converters, secure encoders, equation graphers, resume outline generators, and slate-themed workspaces.</p>
    <a href="${suiteLink}" target="_blank" rel="noopener" style="color: #4f46e5; text-decoration: underline; font-weight: 700; font-size: 14px;">Visit CareerPouch Suite</a>
  </div>
</div>
    `.trim();
  };

  // Google OAuth2 Implicit Authorization Flow (Client secret is not needed)
  const handleConnect = () => {
    if (!clientId) {
      setErrorMsg('Google OAuth Client ID is missing. Please set VITE_BLOGGER_CLIENT_ID in your deployment panel.');
      return;
    }
    setErrorMsg('');
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'https://www.googleapis.com/auth/blogger';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=blogger_automation`;
    
    // Redirect cleanly
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    setAccessToken('');
    sessionStorage.removeItem('cp_blogger_access_token');
    setUserInfo(null);
    setSuccessMsg('Successfully disconnected from Blogger API.');
  };

  // Publish specific tool to Blogger
  const publishTool = async (tool: Tool, isAutomatic: boolean = false) => {
    if (!accessToken || !blogId) {
      if (isAutomatic) {
        console.warn('Scheduled publish skipped: No access token or Blog ID found.');
      } else {
        setErrorMsg('You must authenticating your Google account and set up a valid Blogger Blog ID first!');
      }
      return;
    }

    setPublishStatus('publishing');
    setErrorMsg('');
    setSuccessMsg('');

    const postTitle = `Increase Productivity: Run our ${tool.name} Client-Side Utility`;
    const postBody = generatePostHtml(tool);

    try {
      const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          kind: 'blogger#post',
          title: postTitle,
          content: postBody,
          labels: [tool.category, 'tools', 'careerpouch', tool.name.replace(/\s+/g, '')]
        })
      });

      if (response.ok) {
        const postData = await response.json();
        const successLog: BloggerPost = {
          id: postData.id,
          title: postData.title,
          published: new Date().toLocaleDateString(),
          url: postData.url,
          toolId: tool.id
        };

        setPublishedHistory(prev => [successLog, ...prev]);
        setPublishStatus('success');
        setSuccessMsg(`"${tool.name}" was successfully posted on Blogger!`);

        // Update loop variables (cycles back to 0 if out of limits)
        const nextIndex = (currentQueueIndex + 1) % TOOLS.length;
        setCurrentQueueIndex(nextIndex);
        
        const todayString = new Date().toDateString();
        setLastCheckedDate(todayString);
        localStorage.setItem('cp_blogger_last_checked_date', todayString);
      } else {
        const err = await response.json();
        setPublishStatus('error');
        setErrorMsg(err?.error?.message || 'Publication failed. Verify your Blogger API permissions.');
      }
    } catch (e) {
      setPublishStatus('error');
      setErrorMsg('Network error occurred during publication. Please try again.');
      console.error(e);
    }
  };

  // Daily Scheduler Hook - trigger once daily when active
  useEffect(() => {
    if (!isAutoActive || !accessToken || !blogId) return;

    const todayString = new Date().toDateString();
    
    // If we've already run for today, skip
    if (lastCheckedDate === todayString) return;

    // Execute daily post about the current tool
    const currentTool = TOOLS[currentQueueIndex];
    if (currentTool) {
      console.log(`Auto-Publish triggered: Daily post for "${currentTool.name}"`);
      publishTool(currentTool, true);
    }
  }, [isAutoActive, accessToken, blogId, lastCheckedDate, currentQueueIndex]);

  const activeTool = TOOLS[currentQueueIndex] || TOOLS[0];

  return (
    <div id="blogger-automation" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-slate-800 dark:text-slate-100 mb-8 max-w-4xl mx-auto">
      
      {/* Decorative colored glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-5 md:space-x-4">
        <div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoActive ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-mono">Blogger Integration Suite</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mb-1 text-slate-900 dark:text-white">Google Blogger Daily Scheduler</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
            Automatically draft and publish a beautifully compiled promotion article daily about 1 of our {TOOLS.length} available tools. Cycles perpetually when done.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {accessToken ? (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-1.5 px-3 rounded-full border border-slate-200/50 dark:border-slate-805">
              {userInfo?.picture ? (
                <img src={userInfo.picture} alt="" className="w-5 h-5 rounded-full ring-1 ring-indigo-500" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-[10px] text-white flex items-center justify-center font-bold">G</div>
              )}
              <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 hidden sm:inline">{userInfo?.name || 'Linked'}</span>
              <button 
                onClick={handleDisconnect}
                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold ml-1 hover:underline transition-all cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-100 dark:border-rose-950 flex items-center gap-2 font-medium">
          <Info className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-100 dark:border-emerald-955 flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Warnings about missing Env settings (Replaces cluttery form inputs) */}
      {(!clientId || !blogId) && (
        <div className="p-4 mb-5 bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/40 rounded-xl text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 font-extrabold text-amber-700 dark:text-amber-400">
            <Lock className="w-4 h-4" />
            <span>Configured via Security Environment Variables</span>
          </div>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400 text-[11px]">
            To ensure ultimate client security and neat layouts, Blogger API credentials should be loaded from your deployment hosting dashboard variables. 
            Define <code className="bg-slate-100 dark:bg-slate-950 text-indigo-500 px-1 py-0.5 rounded font-mono">VITE_BLOGGER_CLIENT_ID</code> and <code className="bg-slate-100 dark:bg-slate-950 text-indigo-500 px-1 py-0.5 rounded font-mono">VITE_BLOGGER_BLOG_ID</code> to complete connection.
          </p>
        </div>
      )}

      {/* Primary Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Settings (5 spans) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Core Automation Scheduler Switch */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-805 rounded-xl space-y-3">
            <h3 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-pulse text-indigo-500" /> Live Automation Loop
            </h3>

            <div className="flex items-center justify-between gap-2 p-1">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Loop Automation</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Auto-publish 1 tool post every 24 hours</p>
              </div>
              <button
                onClick={() => {
                  if (!accessToken || !blogId) {
                    setErrorMsg('Please connect your Google Account and set Blog ID to activate scheduler.');
                    return;
                  }
                  setIsAutoActive(!isAutoActive);
                  setErrorMsg('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tight transition-all duration-300 cursor-pointer ${
                  isAutoActive 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isAutoActive ? 'ACTIVE (Loop On)' : 'INACTIVE (Loop Off)'}
              </button>
            </div>

            {/* Loop Diagnostics */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white dark:bg-slate-950 p-2 rounded border border-slate-205 dark:border-slate-805 font-mono">
                <span className="block text-slate-400">NEXT POST INDEX:</span>
                <span className="font-bold text-indigo-500">{currentQueueIndex + 1} / {TOOLS.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-950 p-2 rounded border border-slate-205 dark:border-slate-805 font-mono">
                <span className="block text-slate-400">LAST SYNC DATE:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">{lastCheckedDate || 'Never'}</span>
              </div>
            </div>
          </div>

          {/* Collapsible Local Developer Override Settings (Keeps UI extremely simple and clean) */}
          <div className="border border-slate-200/50 dark:border-slate-800 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowOverrides(!showOverrides)}
              className="w-full p-3 bg-slate-50/60 dark:bg-slate-900/30 flex items-center justify-between text-xs font-bold text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
                <Settings className="w-3.5 h-3.5" /> Local Overrides (Optional)
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showOverrides ? 'rotate-180' : ''}`} />
            </button>

            {showOverrides && (
              <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800 space-y-3">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[9px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Overwrite Client ID
                    </label>
                    <input 
                      type="text"
                      placeholder="Paste google oauth client ID..."
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value.trim())}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Overwrite Blog ID
                    </label>
                    <input 
                      type="text"
                      placeholder="Paste blogger blog ID..."
                      value={blogId}
                      onChange={(e) => setBlogId(e.target.value.trim())}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Live App Callback URL
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. https://careerpouch.com"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value.trim())}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 rounded-lg space-y-1">
                  <p className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"><Sparkles className="w-3 h-3 text-indigo-500" /> Redirect URI Config:</p>
                  <p>When creating your Client ID (Web App), match authorized callback to:</p>
                  <code className="block bg-white dark:bg-black p-1 rounded border border-slate-150 dark:border-slate-850 text-[9px] overflow-x-auto text-indigo-500 font-mono">
                    {window.location.origin + window.location.pathname}
                  </code>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column Queue Management & Instant Publisher (7 spans) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Tool Promo Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-805 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Next Scheduled Article
              </h3>
              
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const prev = (currentQueueIndex - 1 + TOOLS.length) % TOOLS.length;
                    setCurrentQueueIndex(prev);
                  }}
                  className="p-1 px-1.5 text-[10px] uppercase font-bold bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    const next = (currentQueueIndex + 1) % TOOLS.length;
                    setCurrentQueueIndex(next);
                  }}
                  className="p-1 px-1.5 text-[10px] uppercase font-bold bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Skip Next
                </button>
              </div>
            </div>

            {/* Selected Tool specs */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 p-3 rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-black shrink-0 uppercase font-mono text-xs">
                {activeTool.category.substring(0, 3)}
              </div>
              <div className="space-y-1 overflow-hidden">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{activeTool.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                  {activeTool.description}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] font-mono">
                  <span className="text-slate-400">ID: <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-indigo-500">{activeTool.id}</code></span>
                  <span className="text-slate-400">Labels: <code className="text-emerald-500">{activeTool.category}, tools</code></span>
                </div>
              </div>
            </div>

            {/* Instant controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => publishTool(activeTool, false)}
                disabled={publishStatus === 'publishing'}
                className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 text-white rounded-lg text-xs font-extrabold transition-all duration-200 shadow shadow-indigo-600/10 cursor-pointer"
              >
                {publishStatus === 'publishing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting Post...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Publish to Blogger Now
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-2 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Hide HTML Preview' : 'Show Blog Layout'}
              </button>
            </div>

            {/* Inline Generated Article layout viewer */}
            {showPreview && (
              <div className="bg-slate-100 dark:bg-slate-950/20 rounded-xl p-4 border border-slate-205 dark:border-slate-805 max-h-72 overflow-y-auto scrollbar-thin">
                <p className="text-[10.5px] font-bold font-mono text-indigo-500 dark:text-indigo-400 mb-3 border-b border-slate-200/50 dark:border-slate-800/80 pb-1.5">
                  POST PREVIEW IN BLOGGER DESIGN (${TOOLS.length} Total Tools)
                </p>
                <div 
                  className="bg-white p-4 rounded-lg border border-slate-200 max-w-full overflow-hidden prose prose-sm text-slate-800 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: generatePostHtml(activeTool) }}
                />
              </div>
            )}
          </div>

          {/* Logs & Publications */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-805 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Publication logs ({publishedHistory.length})
              </h3>
              
              {publishedHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete local history records? (Does not delete actual Blogger posts)')) {
                      setPublishedHistory([]);
                    }
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer font-bold hover:underline"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {publishedHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-mono">
                  No blog posts published yet. Connect your credentials and schedule a loop or publish above!
                </div>
              ) : (
                publishedHistory.map((item, index) => (
                  <div key={item.id + '-' + index} className="p-2 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-205">{item.title}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">Published on {item.published}</span>
                      </div>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-500 hover:text-indigo-600 transition-colors shrink-0 flex items-center gap-0.5 font-mono text-[10px] font-bold"
                    >
                      VISIT <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
