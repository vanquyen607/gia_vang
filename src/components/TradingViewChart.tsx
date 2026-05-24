import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Activity, Scale, Coins, Flame, Info } from 'lucide-react';

interface ChartInstrument {
  symbol: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  impactOnGold: string;
  defaultInterval: string;
}

const TechAnalysisWidget = ({ symbol }: { symbol: string }) => {
  const params = {
    interval: "1D",
    width: "100%",
    isTransparent: true,
    height: "100%",
    symbol: symbol,
    showIntervalTabs: true,
    displayMode: "single",
    locale: "vi",
    colorTheme: "dark",
    utm_source: typeof window !== 'undefined' ? window.location.hostname : "localhost"
  };

  const iframeUrl = `https://s.tradingview.com/embed-widget/technical-analysis/?locale=vi#${encodeURIComponent(JSON.stringify(params))}`;

  return (
    <div className="w-full h-full min-h-[300px] overflow-hidden flex items-center justify-center">
      <iframe
        src={iframeUrl}
        className="w-full h-full min-h-[300px]"
        style={{ border: 'none' }}
        title="TradingView Technical Analysis Gauge"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
};

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-interest prime global & domestic assets critical for users/investors, completely free & unrestricted in widgets
  const instruments: ChartInstrument[] = [
    {
      symbol: 'OANDA:XAUUSD',
      name: 'Vàng Thế Giới Giao Ngay (Spot Gold)',
      shortName: 'Giá Vàng Spot',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      description: 'Giá vàng giao ngay quốc tế tính bằng USD trên mỗi ounce (oz). Đây là thước đo quy chuẩn thế giới của kim loại quý.',
      impactOnGold: 'Chỉ báo gốc cho toàn bộ giá vàng trong nước (SJC, Nhẫn, Nữ trang).',
      defaultInterval: '60'
    },
    {
      symbol: 'OANDA:XAGUSD',
      name: 'Bạc Thế Giới Giao Ngay (Spot Silver)',
      shortName: 'Bạc Thế Giới',
      icon: <Scale className="w-5 h-5 text-slate-300" />,
      description: 'Giá bạc kim loại quý giao ngay quốc tế. Bạc thường biến động cùng pha với vàng nhưng có biên độ lớn hơn.',
      impactOnGold: 'Đo lường tính đầu cơ của thị trường hàng hóa. Bạc tăng kéo theo tâm lý giá vàng tăng.',
      defaultInterval: '60'
    },
    {
      symbol: 'BINANCE:BTCUSDT',
      name: 'Chỉ Số Giá Bitcoin (BTC/USDT)',
      shortName: 'Bitcoin (BTC)',
      icon: <Coins className="w-5 h-5 text-orange-400" />,
      description: 'Đồng tiền mã hóa lớn nhất thế giới. Được ví như "vàng kỹ thuật số" của thời đại công nghệ.',
      impactOnGold: 'Khi thị trường tiền số bùng nổ, dòng tiền có thể chuyển dịch bớt từ tài sản truyền thống như vàng sang BTC.',
      defaultInterval: '240'
    },
    {
      symbol: 'BINANCE:ETHUSDT',
      name: 'Chỉ Số Giá Ethereum (ETH/USDT)',
      shortName: 'Ethereum (ETH)',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      description: 'Hệ sinh thái blockchain lớn nhất toàn cầu. Đo lường sức khỏe của toàn bộ dòng vốn đầu cơ công nghệ.',
      impactOnGold: 'Thường đại diện cho khẩu vị rủi ro ròng của các nhà đầu tư thế hệ mới.',
      defaultInterval: '240'
    },
    {
      symbol: 'FX_IDC:USDVND',
      name: 'Tỷ Giá Đô-la Ngân Hàng (USD/VND)',
      shortName: 'Tỷ giá USD/VND',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      description: 'Tỷ giá hối đoái Đô-la Mỹ/Việt Nam Đồng trực tuyến ngân hàng, ảnh hưởng trực tiếp đến giá trị quy đổi nhập khẩu.',
      impactOnGold: 'USD/VND tăng mạnh khiến chi phí quy đổi vàng thế giới sang VND đắt đỏ hơn, làm tăng giá vàng Việt Nam tương ứng.',
      defaultInterval: 'D'
    },
    {
      symbol: 'FX:USDOLLAR',
      name: 'Chỉ Số Sức Mạnh Đồng USD (US Dollar Index)',
      shortName: 'Chỉ số USD (DXY)',
      icon: <Activity className="w-5 h-5 text-sky-450" />,
      description: 'Đo lường sức khỏe của đồng Đô-la Mỹ so với rổ các đồng tiền mạnh khác trên toàn cầu.',
      impactOnGold: 'Thường tỉ lệ nghịch tuyệt đối với giá vàng. Khi đồng USD mạnh lên (chỉ số tăng), giá vàng thế giới thường chịu áp lực giảm.',
      defaultInterval: 'D'
    },
    {
      symbol: 'OANDA:WTICOUSD',
      name: 'Giá Dầu Thô WTI Giao Dịch (Crude Oil)',
      shortName: 'Dầu Thô WTI',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      description: 'Giá dầu thô ngọt nhẹ WTI Mỹ. Chỉ số năng lượng gốc cấu thành thước đo lạm phát toàn cầu.',
      impactOnGold: 'Dầu thô tăng cao gây sức ép lạm phát, kích hoạt dòng tiền tìm đến vàng để phòng hộ rủi ro trượt giá tiền tệ.',
      defaultInterval: '240'
    }
  ];

  const [activeSymbol, setActiveSymbol] = useState<string>('OANDA:XAUUSD');
  const [customTicker, setCustomTicker] = useState<string>('');
  
  // Style '3' is Area (Biểu đồ vùng có dải màu), extremely easy for non-pro users to study at a glance!
  const [chartStyle, setChartStyle] = useState<string>('3'); 

  const currentInstrument = instruments.find(i => i.symbol === activeSymbol) || {
    symbol: activeSymbol,
    name: `Ký hiệu tự chọn: ${activeSymbol}`,
    shortName: activeSymbol,
    icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    description: 'Biểu đồ phân tích kỹ thuật do người dùng nạp ký hiệu thủ công.',
    impactOnGold: 'Mã phân tích nâng cao theo yêu cầu của riêng bạn.',
    defaultInterval: '60'
  };

  const handleApplyCustomTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTicker.trim()) {
      const formatted = customTicker.trim().toUpperCase();
      setActiveSymbol(formatted);
      setCustomTicker('');
    }
  };

  useEffect(() => {
    const containerId = 'tradingview_epic_unified_frame';
    
    // Crucial Clean-up: Re-create the div element with the unique ID to prevent widget state collision on swapping symbols.
    if (containerRef.current) {
      containerRef.current.innerHTML = `<div id="${containerId}" class="w-full h-full rounded-xl overflow-hidden shadow-inner"></div>`;
    }

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView && containerRef.current) {
        new (window as any).TradingView.widget({
          width: '100%',
          height: '100%',
          symbol: activeSymbol,
          interval: currentInstrument.defaultInterval,
          timezone: 'Asia/Ho_Chi_Minh',
          theme: 'dark',
          style: chartStyle, // Area '3' (Default), Candlestick '1', Line '10'
          locale: 'vi',
          toolbar_bg: '#0f172a', // Tailwind Slate 900 matched
          enable_publishing: false,
          hide_side_toolbar: true, // Clean layout without side noises
          allow_symbol_change: false,
          container_id: containerId,
          gridColor: 'rgba(255, 255, 255, 0.04)',
          save_image: false,
          studies: [
            'RSI@tv-basicstudies',
            'MASimple@tv-basicstudies'
          ],
        });
      }
    };

    if (typeof window !== 'undefined' && (window as any).TradingView) {
      initWidget();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);

  }, [activeSymbol, chartStyle]);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl" id="tradingview-gold-panel">
      
      {/* Redesigned Upper Dashboard Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase leading-none">
              BIỂU ĐỒ BẤT ĐỘNG CHỈ SỐ LỚN
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {activeSymbol}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-1.5 flex items-center gap-2 tracking-tight">
            📊 Biến Động Thị Trường Tài Chính Vĩ Mô
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Xem nhanh: <span className="text-amber-400 font-bold">{currentInstrument.name}</span>
          </p>
        </div>
        
        {/* Redesigned Easy Style Selector for Non-Pros (default Area) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-500" /> Kiểu xem:
          </span>
          <div className="flex bg-slate-900 border border-slate-700/60 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setChartStyle('3')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 justify-center whitespace-nowrap ${
                chartStyle === '3'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="style-area-btn"
            >
              📈 Biểu đồ Vùng (Dễ hiểu nhất)
            </button>
            <button
              onClick={() => setChartStyle('10')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 justify-center whitespace-nowrap ${
                chartStyle === '10'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="style-line-btn"
            >
              📉 Đường Đơn Giản
            </button>
            <button
              onClick={() => setChartStyle('1')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 justify-center whitespace-nowrap ${
                chartStyle === '1'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="style-candle-btn"
            >
              🕯️ Nến Nhật Bản (Chuyên gia)
            </button>
          </div>
        </div>
      </div>

      {/* Rebuilt Asset Selection Dashboard Layout - Grid style with beautiful clear states */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2.5 mb-5">
        {instruments.map((inst) => {
          const isActive = inst.symbol === activeSymbol;
          return (
            <button
              key={inst.symbol}
              onClick={() => {
                setActiveSymbol(inst.symbol);
                // Vàng or BTC might look standard, but we default everything to Area chart Style '3' for super friendly use!
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-slate-900 border-amber-500 shadow-lg ring-1 ring-amber-500/20'
                  : 'bg-slate-900/35 border-slate-700/60 hover:bg-slate-900/75 hover:border-slate-500'
              }`}
              id={`selector-${inst.symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`p-1.5 rounded-lg border inline-flex ${isActive ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800 border-slate-700/50'}`}>
                  {inst.icon}
                </span>
                {isActive ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-wider">
                    ĐANG XEM
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono font-bold uppercase truncate max-w-[50px]">
                    {inst.symbol.split(':')[0]}
                  </span>
                )}
              </div>
              
              <div className="mt-2.5">
                <div className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-amber-400' : 'text-slate-200'}`}>
                  {inst.shortName}
                </div>
                <div className="text-[9px] text-slate-500 font-mono font-medium truncate mt-0.5">
                  {inst.symbol.split(':')[1]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic educational context card (Extremely user friendly!) */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 px-4 mb-4 text-xs text-slate-350 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div>
          <h4 className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Thông tin chỉ số:
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">{currentInstrument.description}</p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-slate-750/80 pt-3 md:pt-0 md:pl-6">
          <h4 className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Ảnh hưởng tới giá vàng:
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">{currentInstrument.impactOnGold}</p>
        </div>
      </div>

      {/* Unified Big Interactive Chart Render Canvas with Technical Gauge side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Price Action Chart (2/3 width on wide screens) */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-900 bg-slate-950 h-[450px] shadow-inner relative">
          <div ref={containerRef} className="w-full h-full text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải mô-đun phân tích TradingView...</span>
          </div>
        </div>

        {/* Real-time Technical Buy/Sell Gauge (1/3 width on wide screens) */}
        <div className="lg:col-span-1 rounded-xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm p-4 h-[450px] shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Đồng Hồ Sức Mua Kỹ Thuật
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Live Widget</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Xu hướng phân tích kỹ thuật tổng hợp từ 26 chỉ báo (RSI, Stoch, EMA, MACD...) của TradingView:
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-2 h-full min-h-[290px]">
            <TechAnalysisWidget symbol={activeSymbol} />
          </div>

          <div className="text-[10px] text-slate-500 text-center border-t border-slate-800/60 pt-2 font-medium">
            Tín hiệu cập nhật tự động theo khung thời gian thực tế
          </div>
        </div>

      </div>

      {/* Custom asset fast loader form for power users */}
      <form onSubmit={handleApplyCustomTicker} className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left w-full sm:w-auto">
          <span className="text-[10px] font-extrabold text-amber-400 block uppercase mb-0.5">🔍 Nhập ký hiệu tài sản của bạn</span>
          <p className="text-[10px] text-slate-400 leading-tight">
            Có thể tra cứu bất cứ thứ gì trên sàn quốc tế (Ví dụ: <code className="font-mono text-amber-300">EURUSD</code>, <code className="font-mono text-amber-300">AAPL</code>, <code className="font-mono text-amber-300">BINANCE:SOLUSDT</code>)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <input
            type="text"
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500 font-mono w-full sm:w-48 placeholder-slate-600 focus:ring-1 focus:ring-amber-500/20"
            placeholder="Ký hiệu (ví dụ: ADAUSDT)"
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value)}
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            Nạp mã
          </button>
        </div>
      </form>
    </div>
  );
}
