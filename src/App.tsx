import React, { useState, useEffect } from 'react';
import { GoldPrices, PriceAlert } from './types';
import GoldTable from './components/GoldTable';
import GoldConverter from './components/GoldConverter';
import AlertsPanel from './components/AlertsPanel';
import AiAdvisor from './components/AiAdvisor';
import TradingViewChart from './components/TradingViewChart';
import GoldRoiCalculator from './components/GoldRoiCalculator';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe, 
  Coins, 
  DollarSign, 
  Bell, 
  Sparkles, 
  Info,
  Clock,
  RotateCcw,
  RefreshCw,
  Flame,
  X,
  BarChart2,
  Briefcase,
  Bot,
  Palette,
  Edit2,
  Check
} from 'lucide-react';

export default function App() {
  const [prices, setPrices] = useState<GoldPrices | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toISOString());
  const [activeTab, setActiveTab] = useState<'prices' | 'charts' | 'portfolio' | 'ai'>('prices');

  // Theme Management
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vietnam-gold-theme') || 'slate';
    }
    return 'slate';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('vietnam-gold-theme', theme);
    }
  }, [theme]);

  // Simulation mode
  const [simulationMode, setSimulationMode] = useState<'normal' | 'up' | 'down'>('normal');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Quick state notification banner list
  const [toastMessage, setToastMessage] = useState<{ id: string; title: string; text: string } | null>(null);

  // Manual pricing and conversion overrides
  const [isEditingWorldPrice, setIsEditingWorldPrice] = useState<boolean>(false);
  const [tempWorldPrice, setTempWorldPrice] = useState<string>('');
  const [isEditingUsdRate, setIsEditingUsdRate] = useState<boolean>(false);
  const [tempUsdRate, setTempUsdRate] = useState<string>('');

  const handleOverridePrice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedPrice = parseFloat(tempWorldPrice);
    if (!isNaN(parsedPrice) && parsedPrice > 0) {
      try {
        const res = await fetch('/api/gold-prices/override', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worldPrice: parsedPrice })
        });
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          setIsEditingWorldPrice(false);
          setToastMessage({
            id: 'override-' + Date.now(),
            title: "CẬP NHẬT THÀNH CÔNG",
            text: `Đã thiết lập giá vàng thế giới cố định là $${parsedPrice.toLocaleString('vi-VN')} /oz. Các giá thương hiệu trong nước tự động đồng bộ.`
          });
          setTimeout(() => setToastMessage(null), 4500);
        }
      } catch (err) {
        console.error("Lỗi cập nhật giá vàng thủ công:", err);
      }
    }
  };

  const handleOverrideRate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedRate = parseInt(tempUsdRate);
    if (!isNaN(parsedRate) && parsedRate > 0) {
      try {
        const res = await fetch('/api/gold-prices/override', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usdVndRate: parsedRate })
        });
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          setIsEditingUsdRate(false);
          setToastMessage({
            id: 'override-rate-' + Date.now(),
            title: "CẬP NHẬT TỶ GIÁ THÀNH CÔNG",
            text: `Giá đô-la đã đổi thành ${parsedRate.toLocaleString('vi-VN')} VND.`
          });
          setTimeout(() => setToastMessage(null), 4500);
        }
      } catch (err) {
        console.error("Lỗi cập nhật tỷ giá thủ công:", err);
      }
    }
  };

  // Fetch prices from local server with optional database refresh bypass
  const fetchPrices = async (force = false) => {
    try {
      const url = force ? '/api/gold-prices?force=true' : '/api/gold-prices';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Không thể tải tỉ giá vàng hiện tại');
      const data = await res.json();
      setPrices(data);
    } catch (e: any) {
      setError(e.message || 'Lỗi kết nối máy chủ');
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await fetchPrices(true);
      await fetchAlerts();
      setToastMessage({
        id: 'sync-' + Date.now(),
        title: "ĐỒNG BỘ LIVE THÀNH CÔNG",
        text: "Hệ thống đã thu thập trực tiếp giá vàng quốc tế và đồng bộ hóa SJC Việt Nam chính xác."
      });
      setTimeout(() => setToastMessage(null), 4500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch alert listings and logs
  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Không thể tải cảnh báo');
      const data = await res.json();
      setAlerts(data.alerts);
      
      // Update notifications inside client list if there are new ones
      setNotifications(data.notifications);

      // Trigger standard toast notification for the newest triggered alert
      const justTriggered = data.alerts.find((a: any) => a.triggered && !alerts.find(exist => exist.id === a.id && exist.triggered));
      if (justTriggered) {
        setToastMessage({
          id: justTriggered.id,
          title: "KÍCH HOẠT CẢNH BÁO GIÁ!",
          text: `Ngưỡng của bạn (${justTriggered.targetValue}) đã được khớp thành công!`
        });
        setTimeout(() => setToastMessage(null), 8500);
      }
    } catch (e: any) {
      console.warn("Lỗi đồng bộ cảnh báo:", e);
    }
  };

  const handleSimulateMarket = async (direction: 'up' | 'down' | 'normal') => {
    setIsSimulating(true);
    setSimulationMode(direction);
    try {
      const res = await fetch('/api/gold-prices/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });
      if (res.ok) {
        await fetchPrices();
        await fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
      }, 1000);
    }
  };

  const handleAddAlert = async (type: string, targetValue: number) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, targetValue })
      });
      if (res.ok) {
        await fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear', {
        method: 'POST'
      });
      if (res.ok) {
        await fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Polling setup
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPrices(), fetchAlerts()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));

    // Polling triggers
    const intervalPrice = setInterval(() => {
      fetchPrices();
      fetchAlerts();
    }, 15000);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => {
      clearInterval(intervalPrice);
      clearInterval(clockInterval);
    };
  }, []);

  if (loading && !prices) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-amber-500 animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-400">Đang đồng bộ dữ liệu giao dịch vàng Việt Nam...</p>
        </div>
      </div>
    );
  }

  if (error || !prices) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 p-4">
        <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl max-w-md text-center space-y-4">
          <Flame className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold">Lỗi Kết Nối</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || 'Không nhận được dữ liệu từ hệ thống.'} Hãy thử tải lại trang hoặc khởi động lại máy chủ phát triển.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            Tải Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-900">
      
      {/* Decorative background ambient glows for deep luxury fintech atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/[0.04] blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none z-0" />

      {/* Toast alert popup box */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900/95 border-2 border-amber-500/80 backdrop-blur-lg text-slate-100 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex gap-3 animate-fade-in transition-all">
          <div className="p-1 px-1.5 bg-amber-500 rounded-lg h-fit text-slate-950 font-black shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-xs tracking-wider text-amber-400">{toastMessage.title}</h4>
            <p className="text-[11px] leading-relaxed mt-0.5 font-medium text-slate-300">{toastMessage.text}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-200 self-start cursor-pointer transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner Navigation */}
      <header className="border-b border-slate-900/80 bg-slate-950/70 sticky top-0 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo with high-end typography */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-400 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)] border border-yellow-300/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Vietnam Gold Tracker
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  v3.5 Live
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wide">Hệ thống phân tích giá vàng, tỷ giá quy đổi & cố vấn tài chính AI</p>
            </div>
          </div>

          {/* Unified Controller Simulator and sync live widgets */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-900 self-start md:self-auto shadow-inner">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Mô phỏng:</span>
            </div>
            
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900">
              <button
                onClick={() => handleSimulateMarket('up')}
                disabled={isSimulating}
                className={`px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  simulationMode === 'up' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-transparent'
                }`}
                title="Kích hoạt mô phỏng giá thế giới và giá nội cùng tăng mạnh"
              >
                <TrendingUp className="w-3 h-3" />
                Tăng
              </button>
              <button
                onClick={() => handleSimulateMarket('down')}
                disabled={isSimulating}
                className={`px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  simulationMode === 'down' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-transparent'
                }`}
                title="Kích hoạt mô phỏng giá thế giới và trong nước tụt dốc"
              >
                <TrendingDown className="w-3 h-3" />
                Giảm
              </button>
              <button
                onClick={() => handleSimulateMarket('normal')}
                disabled={isSimulating}
                className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-transparent transition-all cursor-pointer flex items-center gap-1"
                title="Mô phỏng thị trường biến động ngẫu nhiên nhỏ"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                Biến động
              </button>
            </div>

            {/* Quick Live Refresh */}
            <button
              onClick={handleForceSync}
              disabled={isSyncing || isSimulating}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-extrabold text-[10px] uppercase rounded-lg border border-amber-500/25 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              title="Đồng bộ live tỷ giá SJC & thế giới tức thì"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Đồng bộ Live
            </button>

            {/* Theme Selector Swatches */}
            <div className="flex items-center gap-1.5 border-l border-slate-850 pl-3">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Giao diện:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900">
                <button
                  onClick={() => setTheme('slate')}
                  className={`w-4 h-4 rounded-full bg-[#020617] border border-amber-500/40 transition-all cursor-pointer hover:scale-110 ${
                    theme === 'slate' ? 'ring-2 ring-amber-500 border-transparent scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Slate Vũ Trụ"
                />
                <button
                  onClick={() => setTheme('light')}
                  className={`w-4 h-4 rounded-full bg-[#FAF6EE] border border-[#B45309]/40 transition-all cursor-pointer hover:scale-110 ${
                    theme === 'light' ? 'ring-2 ring-[#B45309] border-transparent scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Hoàng Kim Sáng"
                />
                <button
                  onClick={() => setTheme('jade')}
                  className={`w-4 h-4 rounded-full bg-[#011310] border border-emerald-500/40 transition-all cursor-pointer hover:scale-110 ${
                    theme === 'jade' ? 'ring-2 ring-emerald-500 border-transparent scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Lục Bảo Thạch"
                />
                <button
                  onClick={() => setTheme('midnight')}
                  className={`w-4 h-4 rounded-full bg-[#0D1527] border border-cyan-500/40 transition-all cursor-pointer hover:scale-110 ${
                    theme === 'midnight' ? 'ring-2 ring-cyan-500 border-transparent scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Thanh Lam dạ khách"
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono border-l border-slate-800 pl-3">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(currentTime).toLocaleTimeString('vi-VN')}</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Top-Level High Contrast Bento Metrics Bar (Always Visible as Baseline) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-6 relative z-10">
        
        {/* Bento Market summary widgets with glass effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="bento-indices-row">

          {/* Box 1: World Gold Price tracker */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg flex items-center justify-between hover:border-slate-700/60 transition-all duration-300">
            <div className="space-y-1 w-full pr-2">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-amber-500/70" />
                VÀNG THẾ GIỚI (XAU/USD)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-slate-100">
                  ${prices.world.usdPerOunce.toLocaleString('vi-VN', { minimumFractionDigits: 1 })}
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{prices.world.change24h}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium font-sans">Sàn New York • Cập nhật tự động</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 border border-slate-800 shadow shrink-0">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
 
          {/* Box 2: USD / VND Bank Rate tracker */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg flex items-center justify-between hover:border-slate-700/60 transition-all duration-350">
            <div className="space-y-1 w-full pr-2">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-blue-400/80" />
                TỶ GIÁ USD / VND (VCB)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-slate-100">
                  {prices.usdVndRate.toLocaleString('vi-VN')}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 leading-none">
                  Chuyển khoản
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium font-sans">Giá liên ngân hàng Vietcombank</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-blue-400 border border-slate-800 shadow shrink-0">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Box 3: Derived equivalent VND / Lượng price */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-lg flex items-center justify-between hover:border-slate-700/60 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                VÀNG THẾ GIỚI QUY ĐỔI (VND)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black font-mono text-amber-400">
                  {(prices.world.vndEquivalent / 1000000).toFixed(2)} Tr
                </span>
                <span className="text-[10px] text-slate-500 font-bold italic">/ Lượng (Cây)</span>
              </div>
              <p className="text-[9px] text-slate-500 font-semibold font-sans">Đã bao gồm thuế, hải quan & phí vận chuyển</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow">
              <FLAME_ICON />
            </div>
          </div>

        </div>

        {/* 3. Master Visual Tab Navigation Bar (Minimizes Clutter entirely) */}
        <div className="flex justify-center w-full pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 w-full max-w-4xl bg-slate-900/80 border border-slate-800/80 rounded-xl shadow-2xl relative">
            <button
              onClick={() => setActiveTab('prices')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'prices'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)] font-extrabold focus:outline-none'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Bảng Giá & Quy Đổi</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'charts'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)] font-extrabold focus:outline-none'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Biểu Đồ Kỹ Thuật</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)] font-extrabold focus:outline-none'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Nhật Ký Đầu Tư</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)] font-extrabold focus:outline-none'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Trợ Lý AI & Cảnh Báo</span>
            </button>
          </div>
        </div>

        {/* 4. Active Workspace Rendering (Dynamically swapped, pristine view, no vertical slop) */}
        <div className="pt-2 animate-fade-in duration-300">
          
          {/* TAB 1: Live pricing and multi-way converter calculator */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className="bg-slate-900/25 border border-slate-900 rounded-2xl p-1">
                <GoldTable prices={prices} />
              </div>
              <div className="border border-slate-900 bg-slate-950/20 rounded-2xl">
                <GoldConverter prices={prices} />
              </div>
            </div>
          )}

          {/* TAB 2: Dynamic Live Unified TradingView Chart */}
          {activeTab === 'charts' && (
            <div className="bg-slate-900/25 border border-slate-900 rounded-2xl p-1">
              <TradingViewChart />
            </div>
          )}

          {/* TAB 3: Personal portfolio, transaction history & ROI metrics */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl">
                <GoldRoiCalculator prices={prices} />
              </div>
            </div>
          )}

          {/* TAB 4: Gemini AI advisor chatbot + custom price alert settings */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Alert Center takes 2 columns for a pristine layout on desktop */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/20 border border-slate-900 p-1.5 rounded-2xl shadow-xl">
                  <AlertsPanel 
                    alerts={alerts}
                    notifications={notifications}
                    onAddAlert={handleAddAlert}
                    onDeleteAlert={handleDeleteAlert}
                    onClearNotifications={handleClearNotifications}
                  />
                </div>
              </div>

              {/* Chat panel takes 1 column, perfectly proportioned and clean */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/20 border border-slate-900 p-1 rounded-2xl shadow-xl">
                  <AiAdvisor lastUpdated={prices.lastUpdated} />
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Modern minimal footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-slate-900 text-center text-[10px] text-slate-500 font-sans tracking-widest uppercase">
        <p>© 2026 Vietnam Gold Price Monitor and Tracking System. Powered by Google AI Studio & Gemini.</p>
        <p className="mt-1 font-mono text-[9px] text-slate-600 tracking-normal normal-case">Dữ liệu hoàn toàn giả lập có cấu trúc thực tế phục vụ nhu cầu đào tạo và lập kế hoạch tài chính.</p>
      </footer>

    </div>
  );
}

// Custom icon
function FLAME_ICON() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );
}
