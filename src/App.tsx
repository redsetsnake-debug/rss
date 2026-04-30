/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Sparkles, Eye, Info, Ghost } from 'lucide-react';

// --- Types ---

interface CreatureState {
  x: number;
  y: number;
  eyeState: 'normal' | 'wide' | 'glitch';
  scale: number;
  rotate: number;
}

// --- Components ---

// --- Components ---

const GrainOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.14] mix-blend-overlay">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

const GlitchOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay opacity-20">
      <motion.div
        animate={{
          y: [0, -100, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-300 to-transparent h-40 w-full"
      />
    </div>
  );
};

const PixelCreature = ({ state, onInteract }: { state: CreatureState; onInteract: (part: string) => void }) => {
  return (
    <motion.div
      className="absolute cursor-pointer select-none group"
      animate={{
        x: state.x,
        y: state.y,
        scale: state.scale,
        rotate: state.rotate,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 12 }}
      style={{ 
        transformOrigin: 'bottom center',
        filter: state.eyeState === 'glitch' ? 'hue-rotate(90deg) contrast(150%)' : 'none'
      }}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Shadow */}
        <div className="absolute -bottom-2 w-24 h-4 bg-pink-900/10 rounded-full blur-md" />

        {/* Body - using a more 'pixelated' border-radius approach */}
        <motion.div 
          onClick={(e) => { e.stopPropagation(); onInteract('body'); }}
          className="absolute w-24 h-24 bg-pink-300 border-4 border-pink-500 rounded-[20%] shadow-lg overflow-hidden"
          animate={{
            skewX: [0, 2, -2, 0],
            scaleY: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
           {/* Subtle Texture on body */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />
        </motion.div>

        {/* Floating Hat */}
        <motion.div
          onClick={(e) => { e.stopPropagation(); onInteract('hat'); }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-8 bg-purple-400 border-4 border-purple-600 rounded-[10%] z-10"
          animate={{
            y: [-8, 8, -8],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eyes */}
        <div className="absolute top-8 left-0 right-0 flex justify-around px-6 z-20">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              onClick={(e) => { e.stopPropagation(); onInteract('eye'); }}
              className="w-5 h-5 bg-white rounded-none border-4 border-pink-900 overflow-hidden relative"
              animate={{
                height: state.eyeState === 'wide' ? 32 : state.eyeState === 'glitch' ? [4, 32, 4] : 8,
                scale: state.eyeState === 'wide' ? 1.4 : 1,
                borderRadius: state.eyeState === 'wide' ? '40%' : '0%',
              }}
            >
              <motion.div 
                animate={{
                  x: [-2, 2, -2],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-950" 
              />
            </motion.div>
          ))}
        </div>

        {/* Small Paws */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
           <motion.div 
             animate={{ rotate: [-10, 10, -10] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="w-8 h-6 bg-pink-400 rounded-none border-4 border-pink-600" 
           />
           <motion.div 
             animate={{ rotate: [10, -10, 10] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="w-8 h-6 bg-pink-400 rounded-none border-4 border-pink-600" 
           />
        </div>
      </div>
    </motion.div>
  );
};

const BackgroundElements = ({ onInteract }: { onInteract: (item: string) => void }) => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* Haunted Carousel */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={(e) => { e.stopPropagation(); onInteract('carousel'); }}
        className="absolute top-1/3 left-1/4 -translate-x-1/2 opacity-20 hover:opacity-100 transition-all cursor-pointer z-10 group"
      >
        <div className="w-32 h-24 relative">
          <div className="absolute inset-x-0 top-0 h-4 bg-pink-400 rounded-full group-hover:bg-pink-600" />
          <div className="absolute inset-x-4 top-4 bottom-2 border-x-2 border-pink-300 flex justify-between px-2">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="w-2 h-6 bg-pink-200 mt-2"
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-4 bg-pink-500 rounded-full" />
        </div>
        <p className="text-[8px] text-center mt-1 font-mono uppercase tracking-[0.2em] group-hover:text-pink-700">Haunted Carousel</p>
      </motion.div>

      {/* Glowing Mushrooms */}
      <div className="absolute bottom-1/4 left-1/3 flex gap-4 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2, y: -5 }}
            onClick={(e) => { e.stopPropagation(); onInteract('mushrooms'); }}
            className="w-6 h-8 relative opacity-30 hover:opacity-100 transition-all cursor-pointer pointer-events-auto group"
            animate={{ filter: ["drop-shadow(0 0 2px #fff)", "drop-shadow(0 0 8px #fbc)", "drop-shadow(0 0 2px #fff)"] }}
            transition={{ duration: 3, repeat: Infinity, delay: i }}
          >
            <div className="w-6 h-4 bg-pink-200 rounded-full group-hover:bg-white transition-colors" />
            <div className="w-2 h-4 bg-pink-100 mx-auto" />
          </motion.div>
        ))}
      </div>

      {/* Distorted Sign */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); onInteract('sign'); }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-10 p-6 border-4 border-pink-400/30 bg-pink-200/10 backdrop-blur-sm rotate-[-5deg] cursor-pointer z-20 group"
      >
        <span className="text-pink-600/40 text-[10px] font-bold block mb-2 font-sans tracking-widest uppercase group-hover:text-pink-600 transition-colors">TICKET // REQUIRED</span>
        <div className="w-16 h-1 bg-pink-500/20 mb-1 group-hover:bg-pink-500/40" />
        <div className="w-10 h-1 bg-pink-500/20 group-hover:bg-pink-500/40" />
      </motion.div>

      {/* Wheel of Regret */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        onClick={(e) => { e.stopPropagation(); onInteract('wheel'); }}
        className="absolute top-1/2 left-24 opacity-20 rotate-[-15deg] cursor-pointer hover:opacity-100 transition-all z-20 group"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-8 border-pink-300 rounded-full flex items-center justify-center group-hover:border-pink-500 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.3)]"
        >
          <div className="w-1 h-24 bg-pink-300 group-hover:bg-pink-500"></div>
        </motion.div>
        <p className="text-[10px] mt-2 font-bold uppercase tracking-tighter group-hover:text-pink-700">WHEEL_OF_REGRET</p>
      </motion.div>

      {/* Castle of Hollow Whispers */}
      <motion.div 
        whileHover={{ scale: 1.05, y: -5 }}
        onClick={(e) => { e.stopPropagation(); onInteract('castle'); }}
        className="absolute bottom-1/3 right-32 opacity-20 rotate-[5deg] scale-125 text-center cursor-pointer hover:opacity-100 transition-all z-20 group"
      >
        <div className="w-24 h-40 bg-pink-200 rounded-t-full border-4 border-pink-300 group-hover:border-pink-500 relative overflow-hidden">
           <div className="mt-8 flex justify-around px-4">
              <motion.div 
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-pink-400 group-hover:bg-yellow-200" 
              />
              <motion.div 
                animate={{ opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-pink-400 group-hover:bg-yellow-200" 
              />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-pink-400/10 to-transparent pointer-events-none" />
        </div>
        <p className="text-[8px] mt-1 font-mono uppercase tracking-[0.2em] group-hover:text-pink-700">Castle of Hollow Whispers</p>
      </motion.div>

      {/* Strange Floating Blocks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20 + i * 10,
            repeat: Infinity,
            delay: i * 5,
            ease: "easeInOut"
          }}
          className="absolute bg-pink-500/5 border border-pink-600/10"
          style={{
            left: `${15 + i * 20}%`,
            top: `${30 + i * 10}%`,
            width: `${15 + (i % 2) * 20}px`,
            height: `${15 + (i % 2) * 20}px`,
          }}
        />
      ))}

      {/* Floating Eyes in Sky */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0],
            scale: [0.2, 0.4, 0.2],
            x: ["0%", `${30 + (i * 10)}%`, "100%"],
            y: ["0%", `${10 + (i * 5)}%`, "0%"]
          }}
          transition={{ duration: 30 + i * 10, repeat: Infinity, delay: i * 4 }}
          className="absolute"
        >
          <Eye size={48} className="text-pink-300 contrast-150" />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [creature, setCreature] = useState<CreatureState>({
    x: 400,
    y: 500,
    eyeState: 'normal',
    scale: 1,
    rotate: 0,
  });

  const [message, setMessage] = useState<string | null>("欢迎来到游乐园...");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [memoryCount, setMemoryCount] = useState(0);
  const [discoveryCount, setDiscoveryCount] = useState(0);
  const [lastInteraction, setLastInteraction] = useState<string | null>(null);

  // Movement Logic
  useEffect(() => {
    const moveCreature = () => {
      setCreature(prev => {
        const nextX = Math.min(Math.max(100, prev.x + (Math.random() - 0.5) * 300), window.innerWidth - 200);
        const nextY = Math.min(Math.max(100, prev.y + (Math.random() - 0.5) * 300), window.innerHeight - 200);
        return {
          ...prev,
          x: nextX,
          y: nextY,
          rotate: (Math.random() - 0.5) * 15,
        };
      });
    };

    const interval = setInterval(moveCreature, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInteract = (part: string) => {
    setLastInteraction(part);
    
    // Check if background interaction
    const bgItems = ['wheel', 'castle', 'sign', 'carousel', 'mushrooms'];
    if (bgItems.includes(part)) {
      setDiscoveryCount(p => Math.min(p + 1, bgItems.length));
      setGlitchIntensity(p => Math.min(p + 1.2, 10));
      
      switch(part) {
        case 'wheel':
          setMessage("遗憾在旋转，永远不会停止。");
          break;
        case 'castle':
          setMessage("城堡深处有人在呼唤你的名字。");
          break;
        case 'sign':
          setMessage("入场卷...是用记忆换来的。");
          break;
        case 'carousel':
          setMessage("旋转木马在寻找它失踪的骑手。");
          break;
        case 'mushrooms':
          setMessage("它们在窃窃私语，关于现实的裂缝。");
          break;
      }
      return;
    }

    setMemoryCount(p => p + 1);
    setGlitchIntensity(p => Math.min(p + 1, 10));

    switch(part) {
      case 'eye':
        setCreature(prev => ({ ...prev, eyeState: 'wide', scale: 1.3 }));
        setMessage(Math.random() > 0.5 ? "你在我眼里..." : "看见了，那边的未来。");
        setTimeout(() => setCreature(prev => ({ ...prev, eyeState: 'normal', scale: 1 })), 1500);
        break;
      case 'hat':
        setCreature(prev => ({ ...prev, rotate: 720, eyeState: 'glitch' }));
        setMessage("这个帽子，它在尖叫。");
        setTimeout(() => setCreature(prev => ({ ...prev, rotate: 0, eyeState: 'normal' })), 800);
        break;
      case 'body':
        setCreature(prev => ({ ...prev, scale: 1.2 }));
        setMessage("这只是一个梦，对吗？");
        setTimeout(() => setCreature(prev => ({ ...prev, scale: 1 })), 300);
        break;
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.group')) return;
    setCreature(prev => ({
      ...prev,
      x: e.clientX - 64,
      y: e.clientY - 64,
      scale: 1.1
    }));
    setTimeout(() => setCreature(prev => ({ ...prev, scale: 1 })), 500);
  };

  return (
    <div 
      className="relative w-screen h-screen bg-[#fdf2f8] overflow-hidden font-serif text-[#4c0519] cursor-crosshair select-none"
      onClick={handleScreenClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fb7185 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <GrainOverlay />
      <BackgroundElements onInteract={handleInteract} />
      
      {/* Top Left Title */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <h1 className="text-5xl font-bold tracking-tighter text-[#be123c] leading-none mb-2">
          粉色梦核游乐园
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] font-sans opacity-60">
          Project: Perpetual Funfair / Status: Uncanny
        </p>
        <p className="text-[10px] text-[#fb7185] font-sans mt-1">
          DISCOVERIES: {discoveryCount.toString().padStart(2, '0')} / UNLOCKED: {(discoveryCount / 5 * 100).toFixed(0)}%
        </p>
      </div>

      {/* Top Right Simulation Info */}
      <div className="absolute top-12 right-12 text-right z-20 hidden md:block">
        <div className="text-xs uppercase font-sans tracking-widest bg-white px-4 py-2 border border-pink-200 rounded-full inline-block shadow-sm">
          Simulation Time: 04:44 AM
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="relative w-full h-full z-10">
        <PixelCreature state={creature} onInteract={handleInteract} />
      </div>

      {/* Narrative Message (Floating) */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={message}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-32 pointer-events-none"
          >
             <div className="bg-white border-2 border-[#fb7185] px-4 py-2 text-xs uppercase tracking-tighter shadow-[4px_4px_0_0_#fb7185] min-w-[200px] text-center">
                "{message}"
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Layout */}
      <div className="absolute bottom-0 w-full p-12 flex flex-col md:flex-row justify-between items-end z-30 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur border-2 border-pink-200 p-4 rounded-2xl w-64 shadow-xl">
             <div className="text-[10px] uppercase font-sans font-bold text-pink-500 mb-2">Active Entity: THE DREAMER</div>
             <div className="h-1.5 w-full bg-pink-100 rounded-full mb-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#fb7185]"
                  animate={{ width: `${100 - glitchIntensity * 10}%` }}
                />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleInteract('body')}
                  className="bg-pink-50 text-[10px] py-2 border border-pink-200 hover:bg-pink-100 transition-colors uppercase font-bold"
                >
                  FEED MEMORY
                </button>
                <button 
                   onClick={() => setGlitchIntensity(0)}
                   className="bg-pink-50 text-[10px] py-2 border border-pink-200 hover:bg-pink-100 transition-colors uppercase font-bold"
                >
                  RESET VOID
                </button>
             </div>
          </div>

          {/* Stability Circle Indicator */}
          <div className="bg-white/80 backdrop-blur border-2 border-pink-200 p-4 rounded-2xl w-40 flex flex-col justify-center items-center text-center shadow-xl">
             <div className="text-3xl font-bold text-[#fb7185]">{100 - glitchIntensity * 10}%</div>
             <div className="text-[9px] uppercase tracking-widest opacity-60 font-sans">Reality Stability</div>
          </div>
        </div>

        {/* Event Log */}
        <div className="w-80 h-32 bg-white/60 backdrop-blur border border-pink-200 rounded-3xl p-5 flex flex-col gap-2 mt-4 md:mt-0 pointer-events-auto overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider">EVENT_LOG</span>
            <span className={`w-2 h-2 rounded-full ${glitchIntensity < 8 ? 'bg-green-500' : 'bg-red-500 animate-ping'}`}></span>
          </div>
          <div className="text-[10px] font-sans text-rose-800 leading-tight space-y-1.5 overflow-hidden">
            <p className="border-l-2 border-pink-200 pl-2">
              &gt; Entity interaction: {lastInteraction || 'Monitoring'}
            </p>
            <p className="border-l-2 border-pink-200 pl-2">
              &gt; Memories archived: {memoryCount}
            </p>
            {glitchIntensity > 5 && (
              <p className="opacity-40 animate-pulse text-red-500 underline uppercase font-bold">
                &gt; WARNING: VOID ENCROACHMENT
              </p>
            )}
          </div>
        </div>
      </div>

      <GlitchOverlay />

      {glitchIntensity > 8 && (
        <motion.div 
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="fixed inset-0 bg-red-600 pointer-events-none mix-blend-color-burn z-[99]"
        />
      )}
    </div>
  );
}

