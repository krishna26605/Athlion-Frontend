"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Trophy, Instagram, MessageCircle, Twitter, MapPin } from "lucide-react";
import * as Color from "color-bits";
import { cn } from "@/lib/utils";

// Helper function to convert any CSS color to rgba
export const getRGBA = (
  cssColor: string,
  fallback: string = "rgba(180, 180, 180, 1)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    if (cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, width / (2 * dpr), height / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, 1, 1).data;
          const hasText = maskData[0] > 0;

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity;
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: any;

    const updateCanvasSize = () => {
      const w = width || container.clientWidth;
      const h = height || container.clientHeight;
      setCanvasSize({ width: w, height: h });
      gridParams = setupCanvas(canvas, w, h);
    };

    updateCanvasSize();
    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => updateCanvasSize());
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    intersectionObserver.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none w-full h-full" />
    </div>
  );
};

import { WorldMap } from "./map";

export function FlickeringFooter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { id: 1, title: "Find an Event", url: "/events" },
        { id: 2, title: "Rulebook", url: "#" },
        { id: 3, title: "Training", url: "#" },
        { id: 4, title: "Volunteers", url: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { id: 5, title: "Contact Us", url: "#" },
        { id: 6, title: "FAQs", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { id: 7, title: "Privacy Policy", url: "#" },
        { id: 8, title: "Terms of Service", url: "#" },
      ],
    },
  ];

  return (
    <footer id="footer" className="relative w-full bg-black border-t border-white/5 pt-16 pb-24 md:pb-12 overflow-hidden">
      {/* Background Layer: World Map */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none md:scale-100 scale-110 origin-center">
        <WorldMap 
          dots={[
            { start: { lat: 28.6139, lng: 77.2090, label: "HQ" }, end: { lat: 25.2048, lng: 55.2708, label: "Dubai" } },
            { start: { lat: 28.6139, lng: 77.2090, label: "HQ" }, end: { lat: 51.5074, lng: -0.1278, label: "London" } },
            { start: { lat: 28.6139, lng: 77.2090, label: "HQ" }, end: { lat: 40.7128, lng: -74.0060, label: "NYC" } },
            { start: { lat: 28.6139, lng: 77.2090, label: "HQ" }, end: { lat: -33.8688, lng: 151.2093, label: "Sydney" } },
          ]}
          lineColor="#f82506"
          showLabels={false}
          className="h-full"
        />
        {/* Black Mask Effect - softened to maximize map visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-black z-10" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col items-start gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
              <img src="/FINAL-ATH-LOGO.png" alt="ATHLiON Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-black tracking-tighter italic text-white uppercase">ATH<span className="text-[#f82506]">LiON</span></span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            The world series of fitness racing. Test your strength, endurance, and mental toughness in the ultimate fitness competition where athletes unite.
          </p>
          <div className="flex items-center gap-3">
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-[#f82506] transition-all duration-300"><Instagram size={18} className="text-white"/></Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-[#f82506] transition-all duration-300"><Twitter size={18} className="text-white"/></Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-[#f82506] transition-all duration-300"><MessageCircle size={18} className="text-white"/></Link>
          </div>
        </div>

        <div className="col-span-1 md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {footerLinks.map((column) => (
            <div key={column.title} className="flex flex-col gap-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.id} className="group flex items-center gap-1.5 transition-all duration-300">
                    <ChevronRight size={10} className="text-[#f82506] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <Link href={link.url} className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Flickering Grid Bottom Accent */}
      <div className="relative w-full h-28 md:h-40 mt-16 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
        <FlickeringGrid
          text={isMobile ? "ATHLiON" : "ESTABLISHED IN INDIA"}
          fontSize={isMobile ? 38 : 100}
          className="h-full w-full opacity-50"
          squareSize={2}
          gridGap={2}
          color="#f82506"
          maxOpacity={0.45}
          flickerChance={0.2}
        />
      </div>

      <div className="relative z-30 mt-8 px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
            © {new Date().getFullYear()} ATHLiON FITNESS ENTERTAINMENT. ALL RIGHTS RESERVED.
          </p>
      </div>
    </footer>
  );
}
