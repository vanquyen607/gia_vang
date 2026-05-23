export interface GoldBrandPrices {
  buy: number;      // VND per tael/lượng
  sell: number;     // VND per tael/lượng
  updatedAt: string;
}

export interface GoldPrices {
  world: {
    usdPerOunce: number;
    vndEquivalent: number; // calculated equivalent
    change24h: number;     // percentage change
  };
  domestic: {
    sjc: {
      sjcHolding: GoldBrandPrices;
      doji: GoldBrandPrices;
      pnj: GoldBrandPrices;
      btmc: GoldBrandPrices;
      phuquy: GoldBrandPrices;
      mihong?: GoldBrandPrices;
      baotinmanhhai?: GoldBrandPrices;
      sinhdien?: GoldBrandPrices;
      kimtin?: GoldBrandPrices;
      ngoctham?: GoldBrandPrices;
      kimchung?: GoldBrandPrices;
      quytung?: GoldBrandPrices;
    };
    ring9999: {
      sjcHolding: GoldBrandPrices;
      doji: GoldBrandPrices;
      pnj: GoldBrandPrices;
      btmc: GoldBrandPrices;
      phuquy: GoldBrandPrices;
      mihong?: GoldBrandPrices;
      baotinmanhhai?: GoldBrandPrices;
      sinhdien?: GoldBrandPrices;
      kimtin?: GoldBrandPrices;
      ngoctham?: GoldBrandPrices;
      kimchung?: GoldBrandPrices;
      quytung?: GoldBrandPrices;
    };
  };
  usdVndRate: number;
  lastUpdated: string;
}

export interface HistoricalPricePoint {
  date: string;
  worldUsd: number;
  sjcBuy: number;
  sjcSell: number;
  ringBuy: number;
  ringSell: number;
  usdEquivalent: number; // Converted world gold to VND per Lượng with fees
}

export interface PriceAlert {
  id: string;
  type: 'WORLD_ABOVE' | 'WORLD_BELOW' | 'SJC_ABOVE' | 'SJC_BELOW' | 'RING_ABOVE' | 'RING_BELOW';
  targetValue: number; // USD for world, million VND for SJC/Ring (e.g. 84.5)
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
}

export interface GoldConversionParams {
  importTax: number;       // percentage, e.g. 1%
  shippingFee: number;      // USD per ounce, e.g. 4.0
  insuranceFee: number;     // USD per ounce, e.g. 1.5
  makingFee: number;        // VND per tael, e.g. 300,000
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
