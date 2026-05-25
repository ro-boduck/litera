'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FAQ_DATA } from '../data/faqData';

export default function ChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Navigation State
  const [currentOptions, setCurrentOptions] = useState(FAQ_DATA);
  const [parentStack, setParentStack] = useState([]);
  const [activeResponder, setActiveResponder] = useState("Kang Umen & Neng Euis");
  
  const pathname = usePathname();
  const messagesEndRef = useRef(null);

  // Close chatbot when navigating to a new page (only if open to avoid cascading renders)
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, currentOptions]);

  const handleFabClick = useCallback(() => {
    if (isAnimating) return;
    
    if (isOpen) {
      // Close immediately
      setIsOpen(false);
      return;
    }
    
    // Bounce animation then open
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsAnimating(false);
    }, 400);
  }, [isOpen, isAnimating]);

  const handleOptionClick = (option) => {
    // Hide options immediately
    const previousOptions = currentOptions;
    setCurrentOptions([]);
    setParentStack(prev => [...prev, previousOptions]);
    
    // Set responder if available
    const responder = option.responder || activeResponder;
    if (option.responder) {
      setActiveResponder(option.responder);
    }
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: option.q }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: option.a, responder }]);
      if (option.sub) {
        setCurrentOptions(option.sub);
      }
    }, 1500);
  };

  const handleBackClick = () => {
    if (parentStack.length === 0) return;
    const prevOptions = parentStack[parentStack.length - 1];
    
    setMessages(prev => [...prev, { sender: 'user', text: "Kembali ke opsi sebelumnya" }]);
    setIsTyping(true);
    setCurrentOptions([]);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: "Baik, silakan pilih topik di bawah ini:", responder: activeResponder }]);
      setCurrentOptions(prevOptions);
      setParentStack(prev => prev.slice(0, -1));
    }, 1000);
  };
  
  const handleHomeClick = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Kembali ke menu utama" }]);
    setIsTyping(true);
    setCurrentOptions([]);
    
    setTimeout(() => {
      setIsTyping(false);
      setActiveResponder("Kang Umen & Neng Euis");
      setMessages(prev => [...prev, { sender: 'bot', text: "Baik, silakan pilih topik utama yang ingin Anda ketahui:", responder: "Kang Umen & Neng Euis" }]);
      setCurrentOptions(FAQ_DATA);
      setParentStack([]);
    }, 1000);
  };

  const handleReset = () => {
    setMessages([]);
    setIsTyping(false);
    setCurrentOptions(FAQ_DATA);
    setParentStack([]);
    setActiveResponder("Kang Umen & Neng Euis");
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 lg:bottom-10 lg:right-16 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window Popup */}
      <div 
        className={`pointer-events-auto mb-4 w-[340px] sm:w-[380px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right max-h-[calc(100dvh-120px)] ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}
      >
        {/* Header — with the only mascot avatar */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 relative z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
              <Image src="/KangNeng.svg" alt="Profile" fill className="object-cover object-top scale-[1.3] translate-y-1" priority />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm">Kang Umen & Neng Euis</h3>
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
              title="Mulai Ulang"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="h-[420px] flex flex-col bg-slate-50 relative">
          <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-4 z-10 relative">
            
            {/* Welcome message — no avatar, just bubble */}
            <div className="flex items-end gap-2 self-start animate-fade-up max-w-[90%]">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 mb-1 ml-1 font-semibold">Kang Umen & Neng Euis</span>
                <div className="bg-white border border-slate-100 text-slate-700 p-3.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed shadow-sm">
                  Sampurasun! Ada pertanyaan apa yang bisa kami bantu hari ini? 😊
                </div>
              </div>
            </div>

            {/* Messages — no avatar on individual bubbles */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 max-w-[90%] animate-fade-up ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className="flex flex-col">
                  {msg.sender === 'bot' && (
                    <span className="text-[10px] text-slate-400 mb-1 ml-1 font-semibold">{msg.responder}</span>
                  )}
                  <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator — no avatar */}
            {isTyping && (
              <div className="flex items-end gap-2 self-start animate-fade-up">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 mb-1 ml-1 font-semibold">{activeResponder}</span>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-[42px] shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            {/* User Option Buttons */}
            {currentOptions.length > 0 && (
              <div className="flex flex-col gap-2 items-end mt-2 animate-fade-in w-full">
                {currentOptions.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-sm text-left leading-snug transition-colors w-max max-w-[90%] shadow-sm"
                  >
                    {opt.q}
                  </button>
                ))}
                
                {/* Back Button */}
                {parentStack.length > 0 && (
                  <button 
                    onClick={handleBackClick}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-sm text-left leading-snug transition-colors w-max shadow-sm mt-1 flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg> 
                    Kembali
                  </button>
                )}
              </div>
            )}

            {/* Menu Utama Button for Leaf Nodes */}
            {currentOptions.length === 0 && !isTyping && parentStack.length > 0 && (
              <div className="flex justify-end mt-2 animate-fade-in w-full">
                <button 
                  onClick={handleHomeClick}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-sm text-left leading-snug transition-colors w-max shadow-sm flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 
                  Menu Utama
                </button>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* CTA Banner at bottom of chat */}
          <div className="bg-white border-t border-slate-100 p-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20">
            <Link href="/materi" className="w-full bg-gradient-to-r from-blue-600 to-[#0a4d94] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl py-3 px-4 flex items-center justify-between transition-all shadow-sm group">
              <div className="flex flex-col">
                <span className="text-xs text-blue-100 font-medium">Ingin belajar lebih lanjut?</span>
                <span className="text-sm font-bold">Ayo cari tau di Kelas PeKA!</span>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Action Button — Always visible, morphs on hover/click */}
      <div className="pointer-events-auto relative z-50 mt-2 flex items-center gap-3">
        
        {/* Hover Tooltip Label */}
        <div className="chatbot-fab-tooltip hidden sm:flex items-center bg-[#1B2D4F] text-white text-[13px] font-semibold px-4 py-2.5 rounded-2xl shadow-xl shadow-[#1B2D4F]/20 opacity-0 translate-x-3 pointer-events-none transition-all duration-300 whitespace-nowrap select-none">
          <span>Tanya Kang Umen & Neng Euis</span>
          {/* Tooltip Arrow */}
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1B2D4F] rotate-45 rounded-sm" />
        </div>

        {/* Button Core */}
        <button 
          onClick={handleFabClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`chatbot-fab-button group relative flex items-center justify-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isAnimating ? 'chatbot-fab-bounce' : ''} ${isOpen ? 'chatbot-fab-open' : ''}`}
          aria-label="Buka Asisten Virtual PeKA"
        >
          {/* Gradient Background — morphs from circle to pill on hover */}
          <div className="chatbot-fab-bg absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1B2D4F] shadow-[0_8px_32px_rgba(37,99,235,0.4)] group-hover:shadow-[0_12px_40px_rgba(37,99,235,0.55)] transition-all duration-300" />
          
          {/* Subtle Border Ring */}
          <div className="chatbot-fab-bg absolute inset-0 rounded-full border-[2.5px] border-white/30 group-hover:border-white/50 transition-all duration-300" />

          {/* Mascot Icon Container */}
          <div 
            className="chatbot-fab-mascot relative w-[50px] h-[50px] rounded-full flex items-center justify-center z-10 transition-all duration-300 overflow-hidden"
            style={{
              transform: isOpen && isHovered ? 'scale(0)' : (isHovered ? 'scale(1.05)' : 'scale(1)'),
              opacity: isOpen && isHovered ? 0 : 1,
              width: isOpen && isHovered ? 0 : 50,
              height: isOpen && isHovered ? 0 : 50,
            }}
          >
            <Image 
              src="/KangNeng.svg" 
              alt="Asisten PeKA" 
              fill 
              className="object-cover object-top scale-[1.25] translate-y-1" 
              priority 
            />
          </div>

          {/* Close "X" Icon for when chatbox is open and hovered */}
          <div 
            className="chatbot-fab-close absolute w-[50px] h-[50px] flex items-center justify-center z-10 text-white pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              opacity: isOpen && isHovered ? 1 : 0,
              transform: isOpen && isHovered ? 'scale(1)' : 'scale(0)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          {/* Hover label inside the pill — transition handled in globals.css */}
          <span className="chatbot-fab-label relative z-10 text-white text-[13px] font-semibold whitespace-nowrap overflow-hidden">
            Tanya Kami
          </span>

          {/* Online Indicator Dot */}
          <div className="absolute -top-0.5 -right-0.5 z-20">
            <span className="flex h-3.5 w-3.5">
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-sm" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
