'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppDiscountWidget() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Auto-hide tooltip after 10 seconds to remain non-intrusive
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919579680332';
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const text = encodeURIComponent('Need discount');
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${text}`;

  const handleRedirect = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-28 left-4 sm:bottom-6 sm:left-6 z-[9999] flex flex-col items-start gap-2.5">
      {/* Tooltip Badge */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0a0a0a] border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 max-w-[220px] sm:max-w-xs group"
          >
            {/* Arrow pointing down */}
            <div className="absolute top-full left-[28px] -translate-y-1.5 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a] border-r border-b border-white/10 rotate-45" />
            <div className="flex flex-col select-none">
              <span className="text-[10px] text-[#25D366] font-black uppercase tracking-wider">EXCLUSIVE OFFER</span>
              <span className="text-xs text-white font-bold tracking-tight">Claim your discount! ⚡</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-500 hover:text-white transition-colors text-[10px] ml-1 p-0.5 cursor-pointer"
              aria-label="Dismiss tooltip"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleRedirect}
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#25D366]/25 hover:shadow-[#25D366]/40 transition-shadow relative group cursor-pointer"
        aria-label="Claim Discount on WhatsApp"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 blur-md group-hover:opacity-50 transition-opacity animate-pulse" />
        
        {/* WhatsApp SVG logo */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7 relative z-10"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.424 0 9.835-4.41 9.838-9.829.002-2.624-1.013-5.092-2.859-6.939C16.398 2.05 13.918 1.05 11.997 1.05c-5.429 0-9.84 4.411-9.843 9.83-.002 2.012.524 3.975 1.524 5.714l-.997 3.637 3.737-.98c1.3.8 2.518 1.202 3.619 1.202zm10.748-7.354c-.265-.133-1.57-.775-1.814-.863-.244-.089-.422-.133-.599.133-.177.265-.688.863-.843 1.04-.155.177-.31.199-.575.066-.265-.133-1.12-.413-2.133-1.317-.788-.703-1.32-1.57-1.475-1.835-.155-.265-.017-.409.116-.541.12-.119.265-.31.397-.464.133-.155.177-.265.265-.443.089-.177.044-.332-.022-.465-.067-.133-.599-1.443-.821-1.974-.216-.519-.453-.448-.62-.456-.16-.008-.344-.01-.529-.01-.185 0-.487.07-.742.349-.255.278-.975.953-.975 2.325s.997 2.699 1.137 2.887c.14.188 1.963 2.999 4.757 4.204.664.287 1.184.458 1.589.587.667.212 1.275.182 1.756.11.536-.08 1.57-.642 1.792-1.261.223-.619.223-1.15.155-1.261-.067-.11-.244-.177-.509-.31z"/>
        </svg>

        {/* Small discount tag badge overlay */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f82506] border border-white rounded-full flex items-center justify-center text-[9px] font-black text-white italic tracking-tighter z-20">
          %
        </span>
      </motion.button>
    </div>
  );
}
