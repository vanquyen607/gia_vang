import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';

interface AiAdvisorProps {
  lastUpdated: string;
}

export default function AiAdvisor({ lastUpdated }: AiAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý phân tích vàng AI. Tôi có sẵn cập nhật giá vàng trực tiếp ngày hôm nay. Hãy hỏi tôi về tính toán chênh lệch thuế phí giá vàng thế giới, lời khuyên phân bổ vàng miếng SJC vs vàng nhẫn 9999, rủi ro đầu cơ, hoặc dự phóng xu hướng dài hạn!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Nên chọn vàng nhẫn 9999 hay vàng miếng SJC?',
    'Giải thích công thức quy đổi giá vàng VN?',
    'Có nên dùng vàng để phòng ngừa lạm phát?',
    'Chênh lệch mua bán (Spread) bao nhiêu là an toàn?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) throw new Error('Không thể kết nối trợ lý AI');
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '❌ Xin lỗi, tôi không thể hoàn tất phân tích lúc này do sự cố kết nối. Vui lòng kiểm tra API Key.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown-style parsing to HTML for headings, bullets, and bold
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      
      // Bold syntax **text**
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Check bullet items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = content.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 leading-relaxed text-xs my-1" dangerouslySetInnerHTML={{ __html: itemContent }} />
        );
      }

      // Check headers
      if (line.trim().startsWith('###')) {
        return (
          <h4 key={idx} className="text-amber-400 font-bold text-xs mt-3 mb-1.5 uppercase" dangerouslySetInnerHTML={{ __html: content.replace(/###\s*/, '') }} />
        );
      }
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={idx} className="text-amber-400 font-bold text-sm mt-3.5 mb-2 uppercase" dangerouslySetInnerHTML={{ __html: content.replace(/##\s*/, '') }} />
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col h-[520px]" id="ai-advisor-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-xl text-slate-950 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-1.5">
              Trợ lý Phân tích Vàng AI
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Được tối ưu về thị trường tài chính Việt Nam</p>
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center shrink-0 text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans shadow-md ${
              m.sender === 'user' 
                ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                : 'bg-slate-950 border border-slate-850/80 text-slate-200 rounded-tl-none'
            }`}>
              <div className={m.sender === 'user' ? 'text-slate-900' : 'text-slate-300'}>
                {m.sender === 'user' ? <p className="font-semibold">{m.text}</p> : parseMarkdown(m.text)}
              </div>
              <span className={`text-[8px] block text-right mt-1.5 ${m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'}`}>
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shrink-0 text-slate-950 font-bold text-xs shadow">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center shrink-0 text-amber-500 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-400 font-mono italic animate-pulse">
              Đang phân tích dữ liệu vĩ mô và tính toán...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggest Tags */}
      {messages.length === 1 && (
        <div className="mb-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Gợi ý thắc mắc:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-[10px] bg-slate-950 hover:bg-slate-900 text-slate-350 border border-slate-850 hover:border-amber-500/50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Hỏi về đầu tư vàng, thuế phí quy đổi..."
          className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 p-2.5 px-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
