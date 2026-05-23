import React, { useState } from 'react';
import { GoldPrices } from '../types';
import { TrendingUp, TrendingDown, Landmark, Sparkles, AlertCircle, BarChart2, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GoldTableProps {
  prices: GoldPrices;
}

export default function GoldTable({ prices }: GoldTableProps) {
  const [activeTab, setActiveTab] = useState<'sjc' | 'ring9999' | 'jewelry'>('sjc');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'conglomerate' | 'private'>('all');

  const getBrandDetails = (brandKey: string) => {
    switch (brandKey) {
      case 'sjcHolding': return { name: 'Công ty SJC (Quốc Doanh SJC)', logo: 'SJC', isPrivate: false, region: 'Toàn quốc' };
      case 'doji': return { name: 'Tập đoàn DOJI', logo: 'DOJI', isPrivate: false, region: 'Toàn quốc' };
      case 'pnj': return { name: 'Công ty PNJ', logo: 'PNJ', isPrivate: false, region: 'Toàn quốc' };
      case 'btmc': return { name: 'Bảo Tín Minh Châu', logo: 'BTMC', isPrivate: false, region: 'Hà Nội' };
      case 'phuquy': return  { name: 'Vàng Phú Quý', logo: 'PHÚ QUÝ', isPrivate: false, region: 'Toàn quốc' };
      case 'mihong': return { name: 'Tiệm vàng Mi Hồng', logo: 'MI HỒNG', isPrivate: true, region: 'TP.HCM / Miền Nam' };
      case 'baotinmanhhai': return { name: 'Bảo Tín Mạnh Hải', logo: 'BTMH', isPrivate: true, region: 'Hà Nội / Miền Bắc' };
      case 'sinhdien': return { name: 'Thương hiệu Sinh Diễn', logo: 'SDJ', isPrivate: true, region: 'Bắc Ninh / Kinh Bắc' };
      case 'kimtin': return { name: 'Vàng Kim Tín', logo: 'KIM TÍN', isPrivate: true, region: 'HN / Quảng Ninh' };
      case 'ngoctham': return { name: 'Vàng Ngọc Thẫm', logo: 'NTJ', isPrivate: true, region: 'Tây Nam Bộ / Tiền Giang' };
      case 'kimchung': return { name: 'Tiệm vàng Kim Chung', logo: 'KIM CHUNG', isPrivate: true, region: 'Thanh Hóa / Bắc Trung Bộ' };
      case 'quytung': return { name: 'Tiệm vàng Quý Tùng', logo: 'QUÝ TÙNG', isPrivate: true, region: 'Nghệ An / Vinh' };
      default: return { name: brandKey, logo: 'VÀNG', isPrivate: true, region: 'Địa phương' };
    }
  };

  const isJewelry = activeTab === 'jewelry';
  const currentGroup = isJewelry ? prices.domestic.ring9999 : (activeTab === 'sjc' ? prices.domestic.sjc : prices.domestic.ring9999);
  
  // Find outstanding values on the entire group
  const allBrandKeys = Object.keys(currentGroup) as Array<keyof typeof currentGroup>;
  
  let bestBuyPrice = 0;
  let bestBuyBrand = '';
  let bestSellPrice = Infinity;
  let bestSellBrand = '';

  allBrandKeys.forEach(key => {
    const item = currentGroup[key];
    if (item.buy > bestBuyPrice) {
      bestBuyPrice = item.buy;
      bestBuyBrand = key;
    }
    if (item.sell < bestSellPrice) {
      bestSellPrice = item.sell;
      bestSellBrand = key;
    }
  });

  // Count per segment
  const conglomerateCount = allBrandKeys.filter(key => !getBrandDetails(key).isPrivate).length;
  const privateCount = allBrandKeys.filter(key => getBrandDetails(key).isPrivate).length;

  // Filter keys based on active segment
  const brandKeys = allBrandKeys.filter(key => {
    if (selectedSegment === 'all') return true;
    const details = getBrandDetails(key);
    if (selectedSegment === 'conglomerate') return !details.isPrivate;
    if (selectedSegment === 'private') return details.isPrivate;
    return true;
  });

  const formatVND = (value: number) => {
    return (value / 1000000).toFixed(2); // Convert to Millions VND list
  };

  // Build dataset for Recharts brand comparison
  const brandChartData = brandKeys.map(key => {
    const item = currentGroup[key];
    const brandInfo = getBrandDetails(key);
    return {
      name: brandInfo.name.replace('Công ty ', '').replace('Tập đoàn ', '').replace('Vàng ', ''),
      'Mua vào': parseFloat((item.buy / 1000000).toFixed(2)),
      'Bán ra': parseFloat((item.sell / 1000000).toFixed(2)),
    };
  });

  // Comprehensive Jewelry Gold types in Vietnam
  const jewelryTypes = [
    { key: '24k', name: 'Vàng Nữ Trang 24K (99.9%)', description: 'Trang sức cưới, vàng nhẫn trơn thủ công', buyCoeff: 0.983, sellCoeff: 0.999, code: 'Vàng 24K' },
    { key: '22k', name: 'Vàng Nữ Trang 22K (91.6%)', description: 'Trang sức đúc hoa văn truyền thống Nam Bộ', buyCoeff: 0.916, sellCoeff: 0.930, code: 'Vàng 22K' },
    { key: '18k_pt', name: 'Vàng Tây 18K (75.0%)', description: 'Vàng trang sức đính kim cương, đá quý cao cấp', buyCoeff: 0.750, sellCoeff: 0.768, code: 'Vàng 18K' },
    { key: '18k_rose', name: 'Vàng Hồng 18K (Rose Gold 75.0%)', description: 'Hồng kim nhập khẩu thời thượng', buyCoeff: 0.748, sellCoeff: 0.772, code: 'Vàng Hồng' },
    { key: 'ita_750', name: 'Vàng Ý Bạch Kim 750 (75.0%)', description: 'Trang sức Ý trắng bóng, tráng gương cao cấp', buyCoeff: 0.752, sellCoeff: 0.775, code: 'Vàng Ý 750' },
    { key: '14k_pt', name: 'Vàng Tây 14K (58.3%)', description: 'Mặt dây chuyền, nhẫn đôi phổ thông', buyCoeff: 0.583, sellCoeff: 0.602, code: 'Vàng 14K' },
    { key: 'ita_585', name: 'Vàng Ý 585 (58.3%)', description: 'Trang sức Ý rỗng nhẹ, kiểu dáng thời trang', buyCoeff: 0.580, sellCoeff: 0.605, code: 'Vàng Ý 585' },
    { key: '10k_pt', name: 'Vàng Tây 10K (41.7%)', description: 'Nhẫn cưới, dây chuyền xích độ cứng chịu lực cao', buyCoeff: 0.417, sellCoeff: 0.438, code: 'Vàng 10K' },
    { key: '9k_pt', name: 'Vàng Tây 9K (37.5%)', description: 'Phân khúc vàng trang sức phổ thong giá cực tốt', buyCoeff: 0.375, sellCoeff: 0.395, code: 'Vàng 9K' }
  ];

  const benchmarkRingBuy = prices.domestic.ring9999.sjcHolding.buy;
  const benchmarkRingSell = prices.domestic.ring9999.sjcHolding.sell;

  const jewelryData = jewelryTypes.map(item => {
    const buyPrice = Math.round((benchmarkRingBuy * item.buyCoeff) / 10000) * 10000;
    const sellPrice = Math.round((benchmarkRingSell * item.sellCoeff) / 10000) * 10000;
    return {
      ...item,
      buy: buyPrice,
      sell: sellPrice,
      spread: sellPrice - buyPrice
    };
  });

  const chartData = isJewelry 
    ? jewelryData.map(item => ({
        name: item.code,
        'Mua vào': parseFloat((item.buy / 1000000).toFixed(2)),
        'Bán ra': parseFloat((item.sell / 1000000).toFixed(2))
      }))
    : brandChartData;

  const minChartPrice = isJewelry ? 25 : (activeTab === 'sjc' ? 65 : 60); // range anchor for visual contrast
  const maxChartPrice = isJewelry ? 85 : (activeTab === 'sjc' ? 95 : 90);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-md" id="gold-dashboard-panel">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 tracking-tight">
            <span className="p-1 px-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400 font-black text-xs">VN</span>
            Bảng Giá Vàng Trong Nước
          </h2>
          <p className="text-xs text-slate-400 mt-1">Giao dịch thực tế tức thời của các thương hiệu hàng đầu • Triệu VND / Lượng</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* SJC vs Ring vs Jewelry toggle */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('sjc')}
              className={`px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'sjc'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-sjc-selector"
            >
              Vàng Miếng SJC
            </button>
            <button
              onClick={() => setActiveTab('ring9999')}
              className={`px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'ring9999'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-ring-selector"
            >
              Vàng Nhẫn 9999
            </button>
            <button
              onClick={() => setActiveTab('jewelry')}
              className={`px-3.5 py-1.5 font-bold text-[11px] rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'jewelry'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-jewelry-selector"
            >
              Vàng Nữ Trang
            </button>
          </div>

          {/* Table vs Chart toggle */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dạng Bảng Danh Sách"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                viewMode === 'chart'
                  ? 'bg-slate-800 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Biểu Đồ So Sánh"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Phân nhóm Cửa hàng Vàng Tư Nhân & Doanh Nghiệp */}
      {!isJewelry && (
        <div className="flex flex-wrap items-center gap-2 justify-start bg-slate-950/20 p-1.5 px-2.5 rounded-xl border border-slate-800/50 w-fit">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold px-1">Phân Loại Hệ Thống:</span>
          <div className="flex bg-slate-950/80 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setSelectedSegment('all')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedSegment === 'all'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Tất Cả ({allBrandKeys.length})
            </button>
            <button
              onClick={() => setSelectedSegment('conglomerate')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedSegment === 'conglomerate'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Quốc Doanh & Tập Đoàn ({conglomerateCount})
            </button>
            <button
              onClick={() => setSelectedSegment('private')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedSegment === 'private'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Tiệm Vàng Tư Nhân ({privateCount})
            </button>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        /* Grid Brands Table */
        <div className="overflow-x-auto rounded-xl border border-slate-700/65 bg-slate-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700/60 text-slate-400 text-xs font-semibold tracking-wider">
                <th className="py-3.5 px-4">{isJewelry ? 'Loại Vàng Nữ Trang' : 'Thương hiệu'}</th>
                <th className="py-3.5 px-4 text-emerald-400 text-right">Mua vào (Khách bán cho tiệm)</th>
                <th className="py-3.5 px-4 text-amber-400 text-right">Bán ra (Khách mua của tiệm)</th>
                <th className="py-3.5 px-4 text-right">Chênh lệch (Spread)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {isJewelry ? (
                jewelryData.map(item => {
                  return (
                    <tr key={item.key} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-200 flex items-center gap-3">
                        <span className="w-12 h-6 flex items-center justify-center text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
                          {item.code}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200 text-xs sm:text-sm">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{item.description}</div>
                        </div>
                      </td>
                      
                      {/* Buy Column */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-100">
                        {formatVND(item.buy)}
                      </td>

                      {/* Sell Column */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-100">
                        {formatVND(item.sell)}
                      </td>

                      {/* Spread Column */}
                      <td className="py-4 px-4 text-right font-mono text-xs text-slate-400">
                        {(item.spread / 1000000).toFixed(2)} triệu
                      </td>
                    </tr>
                  );
                })
              ) : (
                brandKeys.map(key => {
                  const item = currentGroup[key];
                  const brandInfo = getBrandDetails(key);
                  const isBestBuy = key === bestBuyBrand;
                  const isBestSell = key === bestSellBrand;
                  const spread = item.sell - item.buy;

                  return (
                    <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-200 flex items-center gap-3">
                        <span className="w-12 h-6 flex items-center justify-center text-[10px] font-bold bg-slate-950 border border-slate-800 rounded text-slate-300">
                          {brandInfo.logo}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
                            {brandInfo.name}
                            {brandInfo.isPrivate ? (
                              <span className="inline-block px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-bold text-cyan-400 tracking-wider">TƯ NHÂN</span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-bold text-amber-400 tracking-wider">TẬP ĐOÀN</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium flex flex-wrap items-center gap-2 mt-0.5 leading-none">
                            <span>Vùng: <strong className="text-slate-300">{brandInfo.region}</strong></span>
                            <span className="text-slate-700 font-normal">|</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-0.5 font-mono">
                              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Live
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Buy Column */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className="font-mono font-bold text-slate-100">{formatVND(item.buy)}</span>
                          {isBestBuy && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.5 rounded mt-0.5 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Bán ra lợi nhất
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sell Column */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className="font-mono font-bold text-slate-100">{formatVND(item.sell)}</span>
                          {isBestSell && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1 py-0.5 rounded mt-0.5 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Mua vào rẻ nhất
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Spread Column */}
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-xs text-slate-400">{(spread / 1000000).toFixed(2)} triệu</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Brand Comparison Chart */
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
          <div className="text-center mb-2">
            <span className="text-xs font-semibold text-slate-400">
              So sánh Trực quan Chênh lệch Mua - Bán ({isJewelry ? 'Phân loại Vàng Trang Sức' : activeTab === 'sjc' ? 'Vàng Miếng SJC' : 'Vàng Nhẫn 9999'})
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 1.5', 'dataMax + 1.5']}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#cbd5e1' }}
                  itemStyle={{ fontSize: '12px' }}
                  formatter={(value: any) => [`${value} Tr VND`]}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
                <Bar dataKey="Mua vào" fill="#10b981" radius={[4, 4, 0, 0]} name="Giá Mua vào (Khách được nhận)" />
                <Bar dataKey="Bán ra" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Giá Bán ra (Khách phải trả)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Helpful Tip */}
      <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-xs text-slate-400 leading-relaxed">
          <strong>Lời khuyên:</strong> Khi bán vàng, hãy chọn thương hiệu có giá <span className="text-emerald-400 font-bold">Mua vào cao nhất</span>. Khi tích lũy vàng, tìm nguồn bán có giá <span className="text-amber-400 font-bold">Bán ra thấp nhất</span> để tối ưu hóa chi phí.
        </span>
      </div>
    </div>
  );
}
