import React, { useState, useEffect } from 'react';
import { GoldPrices, GoldConversionParams } from '../types';
import { Calculator, ArrowRightLeft, DollarSign, Info, Percent } from 'lucide-react';

interface GoldConverterProps {
  prices: GoldPrices;
  onParamsChange?: (newParams: GoldConversionParams) => void;
}

export default function GoldConverter({ prices, onParamsChange }: GoldConverterProps) {
  // Formula Parameters states
  const [shippingFee, setShippingFee] = useState(4.5);
  const [insuranceFee, setInsuranceFee] = useState(1.5);
  const [importTax, setImportTax] = useState(1); // represented in %
  const [makingFee, setMakingFee] = useState(350000);

  // Quick unit converter states (synchronous conversions)
  const [ounceVal, setOunceVal] = useState<string>('1');
  const [luongVal, setLuongVal] = useState<string>('0.829');
  const [chiVal, setChiVal] = useState<string>('8.29');

  // Currency Converter states
  const [usdVal, setUsdVal] = useState<string>('1000');
  const [vndVal, setVndVal] = useState<string>((1000 * prices.usdVndRate).toString());

  // Equivalency conversion result
  const [equivalentResult, setEquivalentResult] = useState(0);
  const [sjcPremium, setSjcPremium] = useState(0);
  const [ringPremium, setRingPremium] = useState(0);

  // Recalculate physical equivalent of World Price to Lượng
  useEffect(() => {
    const rawTaxFraction = importTax / 100;
    const baseCost = (prices.world.usdPerOunce + shippingFee + insuranceFee) * 1.20565 * prices.usdVndRate;
    const withTax = baseCost * (1 + rawTaxFraction);
    const finalVnd = Math.round(withTax + makingFee);
    setEquivalentResult(finalVnd);

    // Domestic averages
    const sjcSellAvg = (prices.domestic.sjc.sjcHolding.sell + prices.domestic.sjc.doji.sell + prices.domestic.sjc.pnj.sell) / 3;
    const ringSellAvg = (prices.domestic.ring9999.sjcHolding.sell + prices.domestic.ring9999.doji.sell + prices.domestic.ring9999.pnj.sell) / 3;

    setSjcPremium(sjcSellAvg - finalVnd);
    setRingPremium(ringSellAvg - finalVnd);

    // Notify backend/parent about parameter update
    if (onParamsChange) {
      onParamsChange({
        shippingFee,
        insuranceFee,
        importTax: rawTaxFraction,
        makingFee
      });
    }
  }, [shippingFee, insuranceFee, importTax, makingFee, prices.world.usdPerOunce, prices.usdVndRate, prices.domestic]);

  // Handle Quick Unit Conversions
  // Relationship: 1 lượng (cây) = 1.20565 ounce = 10 chỉ
  const handleUnitChange = (value: string, unit: 'ounce' | 'luong' | 'chi') => {
    if (value === '') {
      if (unit === 'ounce') {
        setOunceVal('');
        setLuongVal('');
        setChiVal('');
      } else if (unit === 'luong') {
        setOunceVal('');
        setLuongVal('');
        setChiVal('');
      } else {
        setOunceVal('');
        setLuongVal('');
        setChiVal('');
      }
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) return;

    if (unit === 'ounce') {
      setOunceVal(value);
      const luong = num / 1.20565;
      setLuongVal(luong.toFixed(3));
      setChiVal((luong * 10).toFixed(2));
    } else if (unit === 'luong') {
      const ounce = num * 1.20565;
      setOunceVal(ounce.toFixed(3));
      setLuongVal(value);
      setChiVal((num * 10).toFixed(2));
    } else if (unit === 'chi') {
      const luong = num / 10;
      const ounce = luong * 1.20565;
      setOunceVal(ounce.toFixed(3));
      setLuongVal(luong.toFixed(3));
      setChiVal(value);
    }
  };

  // Currency conversion handler
  const handleCurrencyChange = (val: string, currency: 'usd' | 'vnd') => {
    if (val === '') {
      setUsdVal('');
      setVndVal('');
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) return;

    if (currency === 'usd') {
      setUsdVal(val);
      setVndVal(Math.round(num * prices.usdVndRate).toString());
    } else {
      setUsdVal((num / prices.usdVndRate).toFixed(2));
      setVndVal(val);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="gold-converter-widget-container">
      
      {/* 1. VN Equivalent Formula Calculator */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/85 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 mb-3 uppercase tracking-wider">
            <Calculator className="w-5 h-5 text-amber-400" />
            Công thức quy đổi giá vàng thế giới
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Quy đổi giá vàng thế giới về tương đương triệu VND/lượng bao gồm thuế nhập khẩu, phí vận chuyển và gia công thực tế tại Việt Nam.
          </p>

          <div className="space-y-4">
            {/* Inputs sliders */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Thuế nhập khẩu</span>
                <span className="text-amber-400 font-mono">{importTax}%</span>
              </div>
              <input 
                type="range" min="0" max="5" step="0.5" 
                value={importTax} 
                onChange={(e) => setImportTax(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-850"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vận chuyển ($/oz)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-2 py-1.5 text-xs font-semibold text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bảo hiểm ($/oz)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={insuranceFee}
                    onChange={(e) => setInsuranceFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-2 py-1.5 text-xs font-semibold text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tiền công làm & chế tác (VND/lượng)</label>
              <div className="relative font-mono">
                <input
                  type="number"
                  step="50000"
                  value={makingFee}
                  onChange={(e) => setMakingFee(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-3 top-2 text-[10px] uppercase font-bold text-slate-500">VND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculations display */}
        <div className="mt-6 pt-5 border-t border-slate-800 font-sans">
          <div className="flex justify-between items-center bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 mb-3">
            <span className="text-xs font-medium text-slate-400">Thế giới quy đổi:</span>
            <span className="text-base font-extrabold text-sky-400 font-mono">
              {(equivalentResult / 1000000).toFixed(3)} triệu / lượng
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-slate-950/40 rounded-lg text-center border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">C.Lệch SJC</span>
              <span className={`text-xs font-bold font-mono ${sjcPremium >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {sjcPremium >= 0 ? '+' : ''}{(sjcPremium / 1000000).toFixed(2)} triệu
              </span>
            </div>
            <div className="p-2.5 bg-slate-950/40 rounded-lg text-center border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">C.Lệch Vàng Nhẫn</span>
              <span className={`text-xs font-bold font-mono ${ringPremium >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {ringPremium >= 0 ? '+' : ''}{(ringPremium / 1000000).toFixed(2)} triệu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-3 font-semibold justify-center">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Công thức quy đổi chuẩn Hội đồng Vàng Thế giới.</span>
          </div>
        </div>
      </div>

      {/* 2. Units & Currency Quick Converter */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/85 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-4">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            Công cụ quy đổi Đơn vị & Ngoại tệ
          </h3>

          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 block border-b border-slate-700/40 pb-1">
              Trọng lượng Vàng
            </span>

            {/* Ounce <=> Lượng <=> Chỉ inputs */}
            <div className="grid grid-cols-3 gap-3 font-medium">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Troy Ounce (Thế giới)</label>
                <div className="relative font-mono">
                  <input
                    type="number"
                    value={ounceVal}
                    onChange={(e) => handleUnitChange(e.target.value, 'ounce')}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="oz"
                  />
                  <span className="absolute right-2 top-2 text-[8px] text-slate-500 uppercase font-bold">oz</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Cây / Lượng (VN)</label>
                <div className="relative font-mono">
                  <input
                    type="number"
                    value={luongVal}
                    onChange={(e) => handleUnitChange(e.target.value, 'luong')}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="lượng"
                  />
                  <span className="absolute right-2 top-2 text-[8px] text-slate-500 uppercase font-bold">lượng</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Chỉ (VN)</label>
                <div className="relative font-mono">
                  <input
                    type="number"
                    value={chiVal}
                    onChange={(e) => handleUnitChange(e.target.value, 'chi')}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-105 focus:outline-none focus:border-amber-500"
                    placeholder="chỉ"
                  />
                  <span className="absolute right-2 top-2 text-[8px] text-slate-500 uppercase font-bold">chỉ</span>
                </div>
              </div>
            </div>

            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 block border-b border-slate-800 pb-1 pt-2">
              Quy đổi ngoại tệ USD / VND
            </span>

            {/* USD <=> VND fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Số lượng Đô la (USD)</label>
                <div className="relative font-mono">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    value={usdVal}
                    onChange={(e) => handleCurrencyChange(e.target.value, 'usd')}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Số lượng Đồng (VND)</label>
                <div className="relative font-mono">
                  <input
                    type="number"
                    value={vndVal}
                    onChange={(e) => handleCurrencyChange(e.target.value, 'vnd')}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-2 top-2 text-[8px] text-slate-500 uppercase font-bold">đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live quote note */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 p-3 bg-slate-900/60 rounded-xl border border-slate-700/30 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tỉ giá quy tính (VCB):</span>
            <span className="text-xs font-mono font-bold text-amber-500">1 USD = {prices.usdVndRate.toLocaleString('vi-VN')} VND</span>
          </div>
          <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded-md font-medium">
            Tỉ giá liên ngân hàng
          </span>
        </div>
      </div>

    </div>
  );
}
