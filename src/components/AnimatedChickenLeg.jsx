import React from 'react';
import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import maskedLegPiece from '../assets/images/masked legpiece.png';

// Seasoning Dust / Masala Powder particle (Stage 2)
const SeasoningParticle = ({ index, scrollYProgress, startX, startY, endX, endY, travelEnd, halfWidth, halfHeight }) => {
  const startTrigger = 0.12 + (index * 0.045);
  const endTrigger = startTrigger + 0.20;

  // Drift offsets
  const driftX = (Math.sin(index * 2) * 20) - 10;
  const driftY = (Math.cos(index * 2) * 12) - 6;
  const fallY = 35 + (index * 4);

  // Position of chicken leg center along direct diagonal path
  const getChickenPos = (s) => {
    const pct = Math.min(Math.max(s / travelEnd, 0), 1);
    return {
      x: startX + halfWidth + (endX - startX) * pct,
      y: startY + halfHeight + (endY - startY) * pct
    };
  };

  const startPos = getChickenPos(startTrigger);
  const endPos = getChickenPos(endTrigger);

  const pX = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startX + halfWidth, 
    startPos.x + driftX, 
    endPos.x + driftX - 8,
    startX + halfWidth
  ], { clamp: true });

  const pY = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startY + halfHeight, 
    startPos.y + driftY, 
    endPos.y + driftY + fallY,
    startY + halfHeight
  ], { clamp: true });

  const pOpacity = useTransform(scrollYProgress, [startTrigger, startTrigger + 0.03, endTrigger - 0.04, endTrigger], [0, 0.40, 0.28, 0]);
  const pScale = useTransform(scrollYProgress, [startTrigger, endTrigger], [0.65, 0.25]);

  return (
    <motion.div
      className={`absolute rounded-full filter blur-[0.2px] ${
        index % 2 === 0 ? 'bg-[#D90404]/65' : 'bg-amber-600/65'
      }`}
      style={{
        left: 0,
        top: 0,
        x: pX,
        y: pY,
        opacity: pOpacity,
        scale: pScale,
        width: index % 3 === 0 ? 5 : 3,
        height: index % 3 === 0 ? 5 : 3,
      }}
    />
  );
};

// Crispy Golden Crumb particle (Stage 3)
const CrumbParticle = ({ index, scrollYProgress, startX, startY, endX, endY, travelEnd, halfWidth, halfHeight }) => {
  const startTrigger = 0.18 + (index * 0.05);
  const endTrigger = startTrigger + 0.18;

  const driftX = (Math.cos(index * 3) * 18) - 9;
  const fallY = 55 + (index * 5);

  const getChickenPos = (s) => {
    const pct = Math.min(Math.max(s / travelEnd, 0), 1);
    return {
      x: startX + halfWidth + (endX - startX) * pct,
      y: startY + halfHeight + (endY - startY) * pct
    };
  };

  const startPos = getChickenPos(startTrigger);
  const endPos = getChickenPos(endTrigger);

  const pX = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startX + halfWidth, 
    startPos.x + driftX, 
    endPos.x + driftX - 5,
    startX + halfWidth
  ], { clamp: true });

  const pY = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startY + halfHeight, 
    startPos.y, 
    endPos.y + fallY,
    startY + halfHeight
  ], { clamp: true });

  const pOpacity = useTransform(scrollYProgress, [startTrigger, startTrigger + 0.02, endTrigger - 0.03, endTrigger], [0, 0.35, 0.22, 0]);
  const pScale = useTransform(scrollYProgress, [startTrigger, endTrigger], [0.8, 0.35]);
  const pRotate = useTransform(scrollYProgress, [startTrigger, endTrigger], [0, index % 2 === 0 ? 120 : -120]);

  return (
    <motion.div
      className="absolute bg-amber-700/45 rounded border border-amber-800/10"
      style={{
        left: 0,
        top: 0,
        x: pX,
        y: pY,
        opacity: pOpacity,
        scale: pScale,
        rotate: pRotate,
        width: index % 2 === 0 ? 6 : 4,
        height: index % 2 === 0 ? 4 : 5,
        borderRadius: '35% 65% 50% 50% / 50% 60% 40% 50%',
      }}
    />
  );
};

// Soft Smoke Puff particle (Stage 4)
const SmokeParticle = ({ index, scrollYProgress, startX, startY, endX, endY, travelEnd, halfWidth, halfHeight }) => {
  const startTrigger = 0.15 + (index * 0.09);
  const endTrigger = startTrigger + 0.22;

  const driftX = (Math.sin(index * 1.5) * 30) - 15;
  const riseY = -45 - (index * 6);

  const getChickenPos = (s) => {
    const pct = Math.min(Math.max(s / travelEnd, 0), 1);
    return {
      x: startX + halfWidth + (endX - startX) * pct,
      y: startY + halfHeight + (endY - startY) * pct
    };
  };

  const startPos = getChickenPos(startTrigger);
  const endPos = getChickenPos(endTrigger);

  const pX = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startX + halfWidth, 
    startPos.x + driftX, 
    endPos.x + driftX + 10,
    startX + halfWidth
  ], { clamp: true });

  const pY = useTransform(scrollYProgress, [0.0, startTrigger, endTrigger, 1.0], [
    startY + halfHeight, 
    startPos.y, 
    endPos.y + riseY,
    startY + halfHeight
  ], { clamp: true });

  const pOpacity = useTransform(scrollYProgress, [startTrigger, startTrigger + 0.04, endTrigger - 0.05, endTrigger], [0, 0.08, 0.05, 0]);
  const pScale = useTransform(scrollYProgress, [startTrigger, endTrigger], [0.6, 2.2]);

  return (
    <motion.div
      className="absolute bg-white/35 rounded-full filter blur-[8px]"
      style={{
        left: 0,
        top: 0,
        x: pX,
        y: pY,
        opacity: pOpacity,
        scale: pScale,
        width: 25,
        height: 25,
      }}
    />
  );
};

const AnimatedChickenLeg = ({ coords, scrollYProgress }) => {
  const startX = coords.start.x;
  const endX = coords.end.x;
  const startY = coords.start.y;
  const endY = coords.end.y;
  const width = coords.start.width;
  const height = coords.start.height;

  // Travel range endpoints — use full scroll range for slow, cinematic movement
  const travelStart = 0.05; // small delay before chicken starts moving
  const travelEnd = 1.0;

  // Transform coordinates for the chicken leg along a direct diagonal path
  const x = useTransform(scrollYProgress, [0.0, travelStart, travelEnd], [startX, startX, endX], { clamp: true });
  const y = useTransform(scrollYProgress, [0.0, travelStart, travelEnd], [startY, startY, endY], { clamp: true });
  
  // Consistent size scale tracking
  let targetScale = 0.5;
  if (coords.start.width && coords.end.width) {
    targetScale = coords.end.width / coords.start.width;
  }
  // Ensure targetScale is a valid finite number
  if (isNaN(targetScale) || !isFinite(targetScale) || targetScale <= 0) {
    targetScale = 0.5;
  }

  // Scale stays full size through most of journey, only shrinks near landing
  const scale = useTransform(scrollYProgress, [0.0, 0.60, travelEnd], [1.0, 1.0, targetScale], { clamp: true });
  
  // Very slow, subtle rotation
  const rotate = useTransform(scrollYProgress, [0.0, travelEnd], [0, 4], { clamp: true });
  
  // Sharp drop shadow filters (no image blur filter is applied to maintain high crispness)
  const shadowDist = useTransform(scrollYProgress, [0.0, 0.55, travelEnd], [3, 20, 5], { clamp: true });
  const shadowBlur = useTransform(scrollYProgress, [0.0, 0.55, travelEnd], [4, 16, 6], { clamp: true });
  const shadowOpacity = useTransform(scrollYProgress, [0.0, 0.55, travelEnd], [0.15, 0.30, 0.25], { clamp: true });

  const filterTemplate = useMotionTemplate`drop-shadow(0 ${shadowDist}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`;

  // Heat Glow overlay behind the chicken
  const heatGlowOpacity = useTransform(scrollYProgress, [0.45, 0.70, travelEnd], [0, 0.20, 0]);

  // Center offsets for particles
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      
      {/* Soft Smoke/Steam Particles */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <SmokeParticle
          key={`smoke-${idx}`}
          index={idx}
          scrollYProgress={scrollYProgress}
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          travelEnd={travelEnd}
          halfWidth={halfWidth}
          halfHeight={halfHeight}
        />
      ))}

      {/* Seasoning Trail Particles */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <SeasoningParticle
          key={`seasoning-${idx}`}
          index={idx}
          scrollYProgress={scrollYProgress}
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          travelEnd={travelEnd}
          halfWidth={halfWidth}
          halfHeight={halfHeight}
        />
      ))}

      {/* Crispy Crumb Particles */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <CrumbParticle
          key={`crumb-${idx}`}
          index={idx}
          scrollYProgress={scrollYProgress}
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          travelEnd={travelEnd}
          halfWidth={halfWidth}
          halfHeight={halfHeight}
        />
      ))}

      {/* Main Traveling Chicken Leg */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          left: 0,
          top: 0,
          x,
          y,
          width,
          height,
          scale,
          rotate,
          filter: filterTemplate
        }}
      >
        {/* Heat Glow */}
        <motion.div
          style={{ opacity: heatGlowOpacity }}
          className="absolute w-full h-full rounded-full bg-orange-500/18 filter blur-[20px] z-0"
        />

        <img
          src={maskedLegPiece}
          alt="Animated Chicken Leg Piece"
          className="w-full h-full object-contain select-none z-10"
        />
      </motion.div>

    </div>
  );
};

export default AnimatedChickenLeg;
