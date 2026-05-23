import React, { useState } from 'react';
import { PriceAlert } from '../types';
import { Bell, Trash2, ShieldAlert, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

interface AlertsPanelProps {
  alerts: PriceAlert[];
  notifications: any[];
  onAddAlert: (type: string, value: number) => void;
  onDeleteAlert: (id: string) => void;
  onClearNotifications: () => void;
}

export default function AlertsPanel({
  alerts,
  notifications,
  onAddAlert,
  onDeleteAlert,
  onClearNotifications
}: AlertsPanelProps) {
  const [alertType, setAlertType] = useState<string>('SJC_BELOW');
  const [targetValue, setTargetValue] = useState<string>('83.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (!val || val <= 0) return;
    onAddAlert(alertType, val);
  };

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case 'WORLD_ABOVE': return 'Thế giới tăng trên ($/oz)';
      case 'WORLD_BELOW': return 'Thế giới giảm dưới ($/oz)';
      case 'SJC_ABOVE': return 'SJC tăng trên (triệu/lượng)';
      case 'SJC_BELOW': return 'SJC giảm dưới (triệu/lượng)';
      case 'RING_ABOVE': return 'Vàng nhẫn tăng trên (triệu/lượng)';
      case 'RING_BELOW': return 'Vàng nhẫn giảm dưới (triệu/lượng)';
      default: return type;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="alerts-control-panel-container">
      
      {/* 1. Add Alert Form Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-amber-500 animate-pulse" />
            Thiết lập Cảnh báo Giá
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Nhận cảnh báo trực quan ngay tức thì khi thị trường trong nước hoặc thế giới vượt qua ngưỡng mong muốn của bạn.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Chọn loại giá</label>
              <select
                value={alertType}
                onChange={(e) => {
                  setAlertType(e.target.value);
                  // Update suggest values logic
                  if (e.target.value.includes('WORLD')) setTargetValue('2450');
                  else if (e.target.value.includes('RING')) setTargetValue('75.0');
                  else setTargetValue('83.0');
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="SJC_BELOW">Giá SJC Giảm dưới (Triệu VND)</option>
                <option value="SJC_ABOVE">Giá SJC Tăng vượt (Triệu VND)</option>
                <option value="RING_BELOW">Giá Vàng Nhẫn Giảm dưới (Triệu VND)</option>
                <option value="RING_ABOVE">Giá Vàng Nhẫn Tăng vượt (Triệu VND)</option>
                <option value="WORLD_BELOW">Giá Thế Giới Giảm dưới ($ USD)</option>
                <option value="WORLD_ABOVE">Giá Thế Giới Tăng vượt ($ USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Giá trị kích hoạt</label>
              <div className="relative font-mono">
                <input
                  type="number"
                  step="0.05"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500 uppercase">
                  {alertType.includes('WORLD') ? 'USD/Oz' : 'Tr.Đồng'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 py-2.5 px-4 rounded-xl text-xs transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tạo Cảnh báo Mới
            </button>
          </form>
        </div>

        <div className="mt-5 text-[10px] text-slate-500 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Sử dụng bảng <strong>Điều Khiển Mô Phỏng</strong> ở góc trên màn hình để kiểm tra nhanh biểu đồ và kích hoạt cảnh báo này!</span>
        </div>
      </div>

      {/* 2. Active Alerts List Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Cảnh báo đang hoạt động ({alerts.filter(a => !a.triggered).length})
          </h3>
          <p className="text-xs text-slate-400 mb-5">Danh sách các ngưỡng biên độ thị trường bạn đã đánh dấu quan sát.</p>

          <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/60 flex flex-col items-center gap-1.5 justify-center">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="text-xs text-slate-500">Chưa thiết lập cảnh báo nào.</span>
              </div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                    alert.triggered 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-slate-950/40 border-slate-850'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {formatTypeLabel(alert.type)}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-100">
                      Ngưỡng: {alert.targetValue} {alert.type.includes('WORLD') ? 'USD' : 'Triệu'}
                    </span>
                    {alert.triggered ? (
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                        Đã kích hoạt lúc {new Date(alert.triggeredAt || '').toLocaleTimeString('vi-VN')}
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-500 italic">Đang giám sát...</span>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Xóa cảnh báo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 mt-4 italic font-medium text-center">
          Giới hạn lưu trữ cục bộ tối đa 20 cảnh báo song song.
        </div>
      </div>

      {/* 3. Alerts Log Notifications Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Lịch sử đẩy chuông
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase transition-colors cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-5">Thông báo hệ thống tức thời khi mức trần bị phá vỡ đột ngột.</p>

          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/60 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-600 font-mono">Chưa ghi nhận thông báo nào.</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 text-[11px]">{notif.title}</span>
                    <span className="text-[9px] font-semibold text-amber-400 font-mono">{notif.time}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 mt-4 text-center font-medium">
          Dữ liệu thông báo tự động resets khi bạn đóng trình duyệt.
        </div>
      </div>

    </div>
  );
}
