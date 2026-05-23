import React, { useState, useEffect } from 'react';
import { GoldPrices } from '../types';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  HelpCircle, 
  Award,
  DollarSign,
  BookmarkPlus,
  Compass
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  category: 'sjc' | 'ring9999';
  brand: 'sjcHolding' | 'doji' | 'pnj' | 'btmc' | 'phuquy';
  purchasePrice: number; // in million VND per tael (e.g. 81.5)
  quantity: number; // in taels/lượng (e.g. 2.5 or 0.5 for 5 chỉ)
  purchaseDate: string;
}

const BRAND_NAME_MAP: Record<string, string> = {
  sjcHolding: 'SJC Nhà Nước',
  doji: 'DOJI Tập Đoàn',
  pnj: 'PNJ Công Ty',
  btmc: 'Bảo Tín Minh Châu',
  phuquy: 'Phú Quý Group'
};

export default function GoldRoiCalculator({ prices }: { prices: GoldPrices }) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  
  // Form inputs
  const [category, setCategory] = useState<'sjc' | 'ring9999'>('sjc');
  const [brand, setBrand] = useState<'sjcHolding' | 'doji' | 'pnj' | 'btmc' | 'phuquy'>('sjcHolding');
  const [purchasePrice, setPurchasePrice] = useState<string>('82.5');
  const [quantity, setQuantity] = useState<string>('1.0');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vietnam_gold_user_portfolio');
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (e) {
        console.error('Lỗi nạp danh mục:', e);
      }
    } else {
      // Seed an example portfolio for professional display
      const example: PortfolioItem[] = [
        {
          id: 'ex-1',
          category: 'sjc',
          brand: 'sjcHolding',
          purchasePrice: 81.2,
          quantity: 2.0,
          purchaseDate: '2026-03-10'
        },
        {
          id: 'ex-2',
          category: 'ring9999',
          brand: 'btmc',
          purchasePrice: 72.8,
          quantity: 0.5,
          purchaseDate: '2026-04-05'
        }
      ];
      setPortfolio(example);
      localStorage.setItem('vietnam_gold_user_portfolio', JSON.stringify(example));
    }
  }, []);

  const savePortfolio = (updated: PortfolioItem[]) => {
    setPortfolio(updated);
    localStorage.setItem('vietnam_gold_user_portfolio', JSON.stringify(updated));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(purchasePrice) || 0;
    const qtyNum = parseFloat(quantity) || 0;

    if (priceNum <= 0 || qtyNum <= 0) return;

    const newItem: PortfolioItem = {
      id: 'item-' + Date.now(),
      category,
      brand,
      purchasePrice: priceNum,
      quantity: qtyNum,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0]
    };

    const updated = [...portfolio, newItem];
    savePortfolio(updated);

    // Set defaults or reset quantity
    setQuantity('1.0');
  };

  const handleDeleteItem = (id: string) => {
    const updated = portfolio.filter(item => item.id !== id);
    savePortfolio(updated);
  };

  // Live matching rate helper helper - We sell SJC or Ring to merchant at BUY price (Giá mua vào của đại lý)
  const getLiveSellbackPrice = (cat: 'sjc' | 'ring9999', brandKey: string): number => {
    const brandData = prices.domestic[cat]?.[brandKey as keyof typeof prices.domestic.sjc];
    return brandData ? brandData.buy : 0; // The dealer buys it back from us at their 'buy' rate
  };

  // Computations
  let totalInvestment = 0;
  let totalCurrentValue = 0;

  portfolio.forEach(item => {
    const cost = item.purchasePrice * item.quantity * 1000000; // stored in millions, convert to raw VND
    const currentPricePerTael = getLiveSellbackPrice(item.category, item.brand);
    const valuation = currentPricePerTael * item.quantity;

    totalInvestment += cost;
    totalCurrentValue += valuation;
  });

  const totalGainLoss = totalCurrentValue - totalInvestment;
  const totalRoiPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6" id="portfolio-calculator-panel">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-amber-500" />
            Nhật Ký & Sổ Sách Đầu Tư Vàng Thực Tế
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Lập tài khoản, lưu giữ lịch sử mua sắm. Hệ thống tự động so khớp giá mua với <span className="text-emerald-400 font-semibold">Tỉ giá hiện tại</span> để báo lãi lỗ.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Thống kê Real-time</span>
        </div>
      </div>

      {/* Grid: Form + Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form column (Left) */}
        <form onSubmit={handleAddItem} className="md:col-span-1 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
            <BookmarkPlus className="w-4 h-4" /> Ghi nhận Giao dịch mới
          </h3>

          {/* Gold Type category select */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Loại vàng sở hữu</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setCategory('sjc')}
                className={`py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  category === 'sjc' 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                Vàng Miếng SJC
              </button>
              <button
                type="button"
                onClick={() => setCategory('ring9999')}
                className={`py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  category === 'ring9999' 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                Nhẫn Trơn 9999
              </button>
            </div>
          </div>

          {/* Brand select */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Thương hiệu / Nhà bán lẻ</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value as any)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800 p-2 focus:outline-none focus:border-amber-500/40 cursor-pointer"
            >
              <option value="sjcHolding">SJC Nhà Nước (Khuyên dùng)</option>
              <option value="doji">Tập đoàn DOJI</option>
              <option value="pnj">PNJ (Phú Nhuận)</option>
              <option value="btmc">Bảo Tín Minh Châu</option>
              <option value="phuquy">Phú Quý Group</option>
            </select>
          </div>

          {/* Price inputs and Quantities */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Giá mua (Tr/Lượng)</label>
              <input
                type="number"
                step="0.05"
                min="10"
                max="250"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800 p-2 font-mono text-center focus:outline-none focus:border-amber-500/40"
                placeholder="E.g. 81.5"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Số lượng (Lượng/Cây)</label>
              <input
                type="number"
                step="0.05"
                min="0.01"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800 p-2 font-mono text-center focus:outline-none focus:border-amber-500/40"
                placeholder="E.g. 1.5"
                required
              />
            </div>
          </div>

          {/* Purchase Date */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Ngày mua hoặc đặt cọc</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800 p-2 text-center focus:outline-none focus:border-amber-500/50 cursor-pointer font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            Thêm vào Sổ Lịch Sử
          </button>
        </form>

        {/* Portfolio Stats & Real-time Gains/Losses Summary (Right 2 columns) */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Summary Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Box 1: Total invested capital */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Vốn đầu tư ban đầu</span>
              <div className="mt-1">
                <span className="text-lg font-black font-mono text-slate-100">
                  {totalInvestment.toLocaleString('vi-VN')}
                </span>
                <span className="text-[9px] text-slate-500 ml-1">VND</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-medium">Toàn bộ lượng mua đã nhập</span>
            </div>

            {/* Box 2: Current live asset value */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Giá trị hiện thời Sàn mua lại</span>
              <div className="mt-1">
                <span className="text-lg font-black font-mono text-amber-400">
                  {totalCurrentValue.toLocaleString('vi-VN')}
                </span>
                <span className="text-[9px] text-amber-500 ml-1">VND</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-2 font-medium">Theo giá Đại lý mua lại tức thời</span>
            </div>

            {/* Box 3: Gains or Losses */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              totalGainLoss >= 0 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <span className="text-[9px] uppercase font-extrabold tracking-wider">Tổng Lợi nhuận tạm tính</span>
              <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-lg font-black font-mono">
                  {totalGainLoss >= 0 ? '+' : ''}
                  {totalGainLoss.toLocaleString('vi-VN')}
                </span>
                <span className="text-[9px] font-bold">VND</span>
              </div>
              <span className="text-[10px] font-extrabold flex items-center gap-0.5 mt-2">
                {totalGainLoss >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {totalGainLoss >= 0 ? '+' : ''}{totalRoiPercent.toFixed(2)}% ROI
              </span>
            </div>

          </div>

          {/* List of active purchases */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex justify-between">
              <span>Danh mục Vàng thực tế của bạn</span>
              <span className="text-amber-400">{portfolio.length} bản ghi</span>
            </div>

            {portfolio.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                <p>Chưa có bản ghi tài sản nào.</p>
                <p className="text-[10px]">Sử dụng form bên trái để ghi nhận giá đã mua trước đây.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[190px] overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[9px] font-bold uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Sản phẩm</th>
                      <th className="p-2.5 text-center">SL</th>
                      <th className="p-2.5">Giá Mua</th>
                      <th className="p-2.5">Giá Hiện Tại</th>
                      <th className="p-2.5 text-right">Lãi/Lỗ</th>
                      <th className="p-2.5 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                    {portfolio.map((item) => {
                      const livePricePerTael = getLiveSellbackPrice(item.category, item.brand);
                      const costPerTael = item.purchasePrice * 1000000;
                      const changePerTael = livePricePerTael - costPerTael;
                      const itemGainLoss = changePerTael * item.quantity;
                      const itemRoi = (changePerTael / costPerTael) * 100;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-2.5">
                            <div className="font-sans font-semibold text-slate-200">
                              {item.category === 'sjc' ? 'SJC Miếng' : 'Nhẫn 9999'}
                            </div>
                            <div className="text-[9px] text-slate-500 font-sans">
                              {BRAND_NAME_MAP[item.brand]} ({item.purchaseDate})
                            </div>
                          </td>
                          <td className="p-2.5 text-center font-bold text-slate-200">
                            {item.quantity} lượng
                          </td>
                          <td className="p-2.5 text-slate-300">
                            {(costPerTael / 1000000).toFixed(2)} Tr
                          </td>
                          <td className="p-2.5 text-amber-400 font-bold">
                            {(livePricePerTael / 1000000).toFixed(2)} Tr
                          </td>
                          <td className={`p-2.5 text-right font-bold ${
                            itemGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            <div>{itemGainLoss >= 0 ? '+' : ''}{(itemGainLoss / 1000000).toFixed(3)} Tr</div>
                            <div className="text-[10px] font-semibold">{itemGainLoss >= 0 ? '+' : ''}{itemRoi.toFixed(2)}%</div>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Xóa bản ghi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Interactive Advisory / Smart Note */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex gap-3 text-xs leading-relaxed text-slate-300">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 h-fit shrink-0">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-bold text-slate-100 block">Lời giải thích hữu ích:</span>
              Khi bạn giữ vàng giấy hoặc vàng vật lý tại Việt Nam, bạn kiếm lời khi <span className="text-amber-400 font-semibold">Bán lại</span> mặt hàng đó cho doanh nghiệp. Do đó, hệ thống luôn lấy <span className="text-emerald-400 font-semibold">Giá Mua vào của tiệm vàng</span> để tính toán số tiền bạn thu về lúc chốt lời. Việc sở hữu một danh mục tại chỗ giúp bạn quyết định điểm bán vàng lý tưởng khi chênh lệch spread thu hẹp!
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
