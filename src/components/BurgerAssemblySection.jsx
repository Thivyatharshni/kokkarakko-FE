import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';

// Import all 6 correct assets directly using ES modules
import bottomBun from '../assets/images/bottom bun.png';
import friedChicken from '../assets/images/fried chicken.png';
import cheddarCheese from '../assets/images/cheddar cheese.png';
import lettuce from '../assets/images/lettuce.png';
import onionTomato from '../assets/images/onion tomato.png';
import topBun from '../assets/images/top bun.png';
import bgImage from '../assets/images/bg.png';

const steps = [
  {
    number: '01 / 05',
    subtitle: 'THE FOUNDATION',
    title: 'TOASTED SESAME BRIOCHE',
    description: 'Our story begins with the foundation. Artisanal brioche sesame bottom bun, butter-toasted to golden perfection for a crispy outer crust and pillowy soft crumb.',
    qualityNotes: [
      '100% Artisanal Sesame Brioche Bun',
      'Butter-Toasted for a rich, golden crust',
      'Pillowy soft texture that holds the juices'
    ]
  },
  {
    number: '02 / 05',
    subtitle: 'THE HERO LAYER',
    title: 'CRISPY FRIED CHICKEN',
    description: 'The heart of the legend. A massive chicken breast fillet, double-dipped in our signature spiced batter and pressure-fried to achieve a deafening crunch and maximum juiciness.',
    qualityNotes: [
      'Massive double-breaded chicken fillet',
      'Pressure-fried at precise temperature',
      'Infused with 12 secret herbs and spices'
    ]
  },
  {
    number: '03 / 05',
    subtitle: 'THE MELT',
    title: 'AGED YELLOW CHEDDAR',
    description: 'A blanket of pure indulgence. A thick slice of cheddar cheese draped over the steaming hot chicken fillet, melting into every crispy crevice.',
    qualityNotes: [
      'Aged yellow Cheddar cheese slice',
      'Naturally melted by the hot chicken fillet',
      'Rich, sharp, and creamy flavor profile'
    ]
  },
  {
    number: '04 / 05',
    subtitle: 'THE CRUNCH',
    title: 'FARM FRESH TOPPINGS',
    description: 'Vibrant garden crunch. Crisp fresh lettuce, thick juicy vine-ripened onion & tomato slices to cut through the rich, savory flavors.',
    qualityNotes: [
      'Crisp farm-fresh iceberg lettuce leaf',
      'Vine-ripened red tomato slices',
      'Sharp red onion ring crunch'
    ]
  },
  {
    number: '05 / 05',
    subtitle: 'THE SIGNATURE',
    title: 'KOKKARAKKO CRISPY BURGER',
    description: 'The ultimate masterpiece. Crowned with the sesame brioche top bun. A symphony of textures and flavors. Welcome to the Kokkarakko experience.',
    qualityNotes: [
      'Crowned with the sesame brioche top bun',
      'Kokkarakko signature recipe burger sauce',
      'Perfect harmony of textures and temperatures'
    ]
  }
];

// CSS-only floating seasoning particles for performance
const SeasoningParticles = () => {
  const particles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const left = `${15 + (i * 7) % 70}%`;
        const top = `${20 + (i * 9) % 60}%`;
        const size = `${3 + (i % 3)}px`;
        const delay = `${(i * 0.4).toFixed(1)}s`;
        const duration = `${6 + (i % 4)}s`;
        const colors = ['#E50914', '#F59E0B', '#10B981', '#FFFFFF'];
        const color = colors[i % colors.length];
        
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left,
              top,
              width: size,
              height: size,
              backgroundColor: color,
              opacity: 0.15,
              animation: `floatParticle ${duration} infinite linear`,
              animationDelay: delay,
            }}
          />
        );
      })}
    </div>
  );
};

// CSS-only premium steam overlay appearing after top bun lands
const SteamOverlay = ({ opacity }) => {
  return (
    <motion.div 
      style={{ opacity }} 
      className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-[-140px] w-64 h-64 pointer-events-none z-20 flex justify-center"
    >
      <div 
        className="w-6 h-28 bg-white/20 rounded-full mx-1.5"
        style={{
          filter: 'blur(10px)',
          animation: 'steamFloat 4.5s infinite ease-in-out',
          animationDelay: '0s'
        }}
      />
      <div 
        className="w-10 h-28 bg-white/15 rounded-full mx-1.5"
        style={{
          filter: 'blur(12px)',
          animation: 'steamFloat 5.5s infinite ease-in-out',
          animationDelay: '1.8s'
        }}
      />
      <div 
        className="w-5 h-28 bg-white/25 rounded-full mx-1.5"
        style={{
          filter: 'blur(8px)',
          animation: 'steamFloat 3.8s infinite ease-in-out',
          animationDelay: '0.9s'
        }}
      />
    </motion.div>
  );
};

const BurgerAssemblySection = () => {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Scroll tracking across 600vh height
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Track active step based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.12) {
      setActiveStep(0); // Toasted Brioche
    } else if (latest < 0.28) {
      setActiveStep(1); // Crispy Fillet
    } else if (latest < 0.44) {
      setActiveStep(2); // Cheddar Cheese
    } else if (latest < 0.77) {
      setActiveStep(3); // Fresh Toppings (Lettuce + Onion/Tomato)
    } else {
      setActiveStep(4); // Completed Masterpiece
    }
  });

  // Hero assembly burger base width (Desktop)
  const W_hero = 350;

  // Specific layer configurations with target visual balance proportions
  // Top Bun = 100% (1.00), Vegetables = 90% (0.90), Cheese = 95% (0.95), Chicken = 115% (1.15), Bottom Bun = 105% (1.05)
  // Lettuce = 1.05 to extend slightly outside top bun
  const layersConfig = [
    { id: 'bottom-bun', src: bottomBun, label: 'Bottom Bun', dropRotate: 2, start: 0.00, end: 0.12, wScale: 1.05, shadowBase: 0.48, offsetFraction: -0.504 },
    { id: 'chicken', src: friedChicken, label: 'Crispy Chicken', dropRotate: -6, start: 0.12, end: 0.28, wScale: 1.15, shadowBase: 0.484, offsetFraction: -0.410 },
    { id: 'cheese', src: cheddarCheese, label: 'Cheddar Cheese', dropRotate: 3, start: 0.28, end: 0.44, wScale: 0.95, shadowBase: 0.469, offsetFraction: -0.127 },
    { id: 'lettuce', src: lettuce, label: 'Fresh Lettuce', dropRotate: -3, start: 0.44, end: 0.60, wScale: 1.05, shadowBase: 0.539, offsetFraction: -0.047 },
    { id: 'onion-tomato', src: onionTomato, label: 'Onion & Tomato', dropRotate: 2, start: 0.60, end: 0.77, wScale: 0.90, shadowBase: 0.453, offsetFraction: 0.228 },
    { id: 'top-bun', src: topBun, label: 'Top Bun', dropRotate: -2, start: 0.77, end: 0.80, wScale: 1.00, shadowBase: 0.414, offsetFraction: 0.333 },
  ];

  // Generate transforms for each layer based on the timeline
  const layerTransforms = layersConfig.map((layer, index) => {
    const { start, end, dropRotate } = layer;
    const duration = end - start;
    const isChicken = index === 1;

    if (index === 0) {
      // Bottom bun is the foundation and starts already fully landed and visible
      const y = useTransform(scrollYProgress, [0, 1], [0, 0]);
      const rotate = useTransform(scrollYProgress, [0, 1], [0, 0]);
      const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);
      const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
      const shadowOpacity = useTransform(scrollYProgress, [0, 1], [0, 0]);
      const shadowScale = useTransform(scrollYProgress, [0, 1], [1, 1]);
      const shadowY = useTransform(scrollYProgress, [0, 1], [0, 0]);
      return { y, rotate, scale, opacity, shadowOpacity, shadowScale, shadowY };
    }

    // Y Translation: start far above, anticipate with tiny tilt, drop fast, impact bounce, settle
    const yStart = isChicken ? -1100 : -950;
    const inputY = [
      0.00,
      start,
      start + 0.05 * duration,
      start + 0.15 * duration,
      start + 0.25 * duration,
      start + 0.35 * duration,
      start + 0.45 * duration,
      1.00
    ];
    const outputY = [
      yStart,
      yStart,
      yStart + 50, // Slight anticipation upward lift
      -150,        // Speeding down
      0,           // Impact land
      -6,          // Tight bounce up
      0,           // Settled at rest
      0
    ];
    const y = useTransform(scrollYProgress, inputY, outputY);

    // Rotation: Tilt while falling, counter-tilt on impact, settle
    const inputRotate = [
      0.00,
      start,
      start + 0.05 * duration,
      start + 0.15 * duration,
      start + 0.25 * duration,
      start + 0.35 * duration,
      start + 0.45 * duration,
      1.00
    ];
    const outputRotate = [
      dropRotate,
      dropRotate,
      dropRotate * 1.3, // Slight extra tilt during anticipation
      dropRotate * 0.8, // Tilt during fall
      -dropRotate * 0.3, // Landing impact counter-tilt
      0,
      0,
      0
    ];
    const rotate = useTransform(scrollYProgress, inputRotate, outputRotate);

    // Scale: Perspective zoom when falling (slightly larger 1.05x), compress on land (0.97x), settle
    const inputScale = [
      0.00,
      start,
      start + 0.05 * duration,
      start + 0.15 * duration,
      start + 0.25 * duration,
      start + 0.35 * duration,
      start + 0.45 * duration,
      1.00
    ];
    const outputScale = [
      1.05,
      1.05,
      1.05,
      1.02,
      0.98,
      0.97, // Landing compression
      1.00,
      1.00
    ];
    const scale = useTransform(scrollYProgress, inputScale, outputScale);

    // Opacity: Fade in quickly as it starts falling
    const inputOpacity = [0.00, start, start + 0.05 * duration, 1.00];
    const outputOpacity = [0, 0, 1, 1];
    const opacity = useTransform(scrollYProgress, inputOpacity, outputOpacity);

    // Dynamic Layer Shadow cast onto the stack below (soft contact shadow style)
    const inputShadow = [
      0.00,
      start,
      start + 0.15 * duration,
      start + 0.25 * duration,
      start + 0.35 * duration,
      1.00
    ];
    const shadowOpacity = useTransform(scrollYProgress, inputShadow, [0, 0, 0.08, 0.32, 0.32, 0.32]);
    const shadowScale = useTransform(scrollYProgress, inputShadow, [1.4, 1.4, 1.3, 0.9, 0.9, 0.9]);
    const shadowY = useTransform(scrollYProgress, inputShadow, [-150, -150, -100, 0, 0, 0]);

    return { y, rotate, scale, opacity, shadowOpacity, shadowScale, shadowY };
  });

  // Bottom bun ground shadow transforms (starts fully active since bun is already landed)
  const groundShadowOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.85, 0.95, 1.00],
    [0.45, 0.45, 0.62, 0.54]
  );
  const groundShadowScale = useTransform(
    scrollYProgress,
    [0.00, 0.85, 0.95, 1.00],
    [1.00, 1.00, 1.20, 1.15]
  );

  // Global Burger Group Container Animations (Completion compression & Showcase zoom)
  const burgerScale = useTransform(
    scrollYProgress,
    [
      0.00, 
      0.15, 0.16, 0.18, 0.20, // Chicken landing compression (lands at 0.16)
      0.31, 0.32, 0.34, 0.36, // Cheese landing compression (lands at 0.32)
      0.47, 0.48, 0.50, 0.52, // Lettuce landing compression (lands at 0.48)
      0.63, 0.64, 0.66, 0.68, // Tomato landing compression (lands at 0.64)
      0.77, 0.78, 0.80,       // Top Bun landing compression (lands at 0.78)
      0.85, 0.95, 1.00
    ],
    [
      1.00,
      1.00, 0.96, 1.00, 1.00, // Heavy chicken impact
      1.00, 0.98, 1.00, 1.00,
      1.00, 0.99, 1.00, 1.00,
      1.00, 0.98, 1.00, 1.00,
      1.00, 0.96, 1.00,       // Top Bun impact
      1.05, 1.05, 1.05
    ]
  );

  // Vertical shifts (0.00 to 1.00): Shifts entire burger DOWN by 100px
  // to clear the navbar area and center the burger vertically (camera shifts up by 15px at final showcase)
  const burgerY = useTransform(
    scrollYProgress,
    [0.00, 0.85, 0.95, 1.00],
    [100, 100, 85, 85]
  );

  // Horizontal exit shift (0.95 to 1.00): Shifts slightly left (-40px)
  const burgerX = useTransform(
    scrollYProgress,
    [0.00, 0.95, 1.00],
    [0, 0, -40]
  );

  // Background Spotlight: warm golden center fading to transparent (intensifies by 15% on completion to peak 0.80)
  const spotlightOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.80, 0.85, 0.95, 1.00],
    [0.25, 0.25, 0.50, 0.80, 0.45]
  );

  // Steam Opacity: Appears ONLY after Top Bun lands (0.80 to 0.85)
  const steamOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.80, 0.85, 1.00],
    [0.00, 0.00, 0.50, 0.50]
  );

  // Right-Side Text Column Exit Fade
  const rightColumnOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.95, 1.00],
    [1.00, 1.00, 0.00]
  );

  return (
    <section 
      id="burger-assembly"
      ref={sectionRef} 
      className="relative w-full bg-neutral-950 z-20 border-b border-neutral-900"
      style={{ height: '600vh' }}
    >
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.30; }
          85% { opacity: 0.30; }
          100% { transform: translateY(-90px) rotate(360deg); opacity: 0; }
        }
        @keyframes steamFloat {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; filter: blur(5px); }
          40% { opacity: 0.25; filter: blur(8px); }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; filter: blur(12px); }
        }
      `}</style>

      {/* Pinned Desktop Viewport (50% / 50% Split) */}
      <div 
        className="sticky top-0 left-0 w-full h-screen overflow-hidden hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        
        {/* Premium Film Grain Noise Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none z-30">
          <filter id="grainNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainNoise)" />
        </svg>

        <div className="w-full h-full flex flex-row relative">
          
          {/* Left Side: Burger Assembly (50%) */}
          <div className="w-1/2 h-full relative flex items-center justify-center border-r border-white/5 bg-transparent">
            {/* Warm Golden Spotlight Backlight */}
            <motion.div 
              style={{ 
                background: 'radial-gradient(circle at center, rgba(255,220,120,0.22) 0%, rgba(255,255,255,0) 70%)',
                opacity: spotlightOpacity
              }}
              className="absolute inset-0 z-0 pointer-events-none"
            />

            {/* Premium Float Seasoning Particles */}
            <SeasoningParticles />

            {/* Rising Steam Overlay */}
            <SteamOverlay opacity={steamOpacity} />

            {/* Center Assembly Wrapper */}
            <motion.div 
              style={{ 
                width: `${W_hero}px`, 
                height: `${Math.round(W_hero * 1.208)}px`, // Restrict wrapper height to final assembled height
                scale: burgerScale,
                y: burgerY,
                x: burgerX
              }}
              className="relative select-none pointer-events-none z-10 overflow-visible"
            >
              {/* Ground Shadow */}
              <motion.div
                style={{
                  opacity: groundShadowOpacity,
                  scale: groundShadowScale,
                }}
                className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[85%] h-5 bg-black/20 filter blur-md rounded-full z-0"
              />

              {layersConfig.map((layer, index) => {
                const anim = layerTransforms[index];
                const bottomOffset = layer.offsetFraction * W_hero;
                const w_layer = W_hero * layer.wScale;
                const h_layer = w_layer * 1.5;

                return (
                  <div
                    key={layer.id}
                    className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center overflow-visible"
                    style={{
                      bottom: `${bottomOffset}px`,
                      width: `${w_layer}px`,
                      height: `${h_layer}px`
                    }}
                  >
                    {/* Intermediate Layer Contact Shadow cast on the element below */}
                    {index > 0 && (
                      <motion.div
                        style={{
                          y: anim.shadowY,
                          opacity: anim.shadowOpacity,
                          scale: anim.shadowScale,
                          bottom: `${layer.shadowBase * w_layer - 10}px`, // Snug shadow placement at visual bottom of ingredient
                          width: `${(index === 1 ? 0.55 : 0.75) * w_layer}px`
                        }}
                        className={`absolute left-1/2 -translate-x-1/2 h-5 rounded-full z-0 pointer-events-none ${
                          index === 1 ? 'bg-black/35 filter blur-md' : 'bg-black/15 filter blur-xl'
                        }`}
                      />
                    )}

                    {/* Ingredient Graphic (Centered horizontally on a single axis) */}
                    <motion.img
                      src={layer.src}
                      alt={layer.label}
                      style={{
                        y: anim.y,
                        rotate: anim.rotate,
                        scale: anim.scale,
                        opacity: anim.opacity,
                        transformOrigin: 'bottom center',
                        width: `${w_layer}px`,
                        height: `${h_layer}px`
                      }}
                      className="object-contain relative z-10"
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Side: Storytelling Content Only (50% - No Preview Card) */}
          <motion.div 
            style={{ opacity: rightColumnOpacity }}
            className="w-1/2 h-full flex flex-col justify-center px-24 bg-gradient-to-r from-transparent to-black/20 z-10 relative pt-12"
          >
            {/* Ambient Watermark Background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] font-black text-[220px] text-white leading-none uppercase italic tracking-tighter whitespace-nowrap z-0">
              BUILD.
            </div>

            <div className="relative z-10 w-full space-y-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  {/* Step hierarchy structure */}
                  <div className="space-y-1">
                    <span className="text-sm font-black text-[#E50914] tracking-widest uppercase">
                      {steps[activeStep].number}
                    </span>
                    <h4 className="text-xs font-extrabold text-gray-300 tracking-widest uppercase block">
                      {steps[activeStep].subtitle}
                    </h4>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase max-w-xl">
                    {steps[activeStep].title}
                  </h2>

                  <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                    {steps[activeStep].description}
                  </p>

                  {/* Ingredient Quality Notes */}
                  <div className="space-y-4 pt-6 border-t border-white/10 max-w-xl">
                    <h4 className="text-xs font-black text-white tracking-wider uppercase">
                      INGREDIENT QUALITY NOTES
                    </h4>
                    <ul className="grid grid-cols-1 gap-3.5">
                      {steps[activeStep].qualityNotes.map((note, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm md:text-base text-gray-300 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#E50914] shrink-0 animate-pulse" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots indicator */}
              <div className="pt-6 max-w-xl flex items-center gap-2">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeStep ? 'w-10 bg-[#E50914]' : 'w-2.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Static Stacked Layout for Mobile Screens (No placeholders, dynamically stacked complete burger) */}
      <div 
        className="block md:hidden py-16 bg-cover bg-center w-full"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="px-6 space-y-12 w-full">
          
          <div className="space-y-3 text-center">
            <span className="text-xs font-black text-[#E50914] tracking-widest uppercase bg-red-950/40 border border-[#E50914]/20 px-4 py-1.5 rounded-full">
              ASSEMBLY STORY
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              Crafting The Legend
            </h2>
            <p className="text-gray-300 text-xs font-medium max-w-xs mx-auto">
              How we assemble our ultimate crispy chicken masterpiece layer by layer.
            </p>
          </div>

          {/* Hero Stacked Burger (Rendered dynamically using the same 6 local assets) */}
          <div className="relative w-full h-[430px] flex items-end justify-center bg-black/40 rounded-3xl overflow-hidden border border-white/5 pb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
            
            {/* Complete Stack for Mobile */}
            <div className="relative w-[210px] h-[370px] select-none pointer-events-none z-10 flex items-end justify-center">
              {[
                { src: bottomBun, bottom: -0.504 * 210, label: 'Bottom Bun', wScale: 1.05 },
                { src: friedChicken, bottom: -0.410 * 210, label: 'Fried Chicken', wScale: 1.15 },
                { src: cheddarCheese, bottom: -0.127 * 210, label: 'Cheddar Cheese', wScale: 0.95 },
                { src: lettuce, bottom: -0.047 * 210, label: 'Lettuce', wScale: 1.05 },
                { src: onionTomato, bottom: 0.228 * 210, label: 'Onion & Tomato', wScale: 0.90 },
                { src: topBun, bottom: 0.333 * 210, label: 'Top Bun', wScale: 1.00 }
              ].map((layer, idx) => {
                const w_mob = 210 * layer.wScale;
                return (
                  <img
                    key={idx}
                    src={layer.src}
                    alt={layer.label}
                    className="absolute object-contain pointer-events-none"
                    style={{
                      bottom: `${layer.bottom}px`,
                      width: `${w_mob}px`,
                      height: `${w_mob * 1.5}px`
                    }}
                  />
                );
              })}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md z-20">
              KOKKARAKKO SIGNATURE
            </div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-8 relative pl-6 border-l border-white/10 max-w-sm mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="relative space-y-2">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-neutral-900 border-2 border-[#E50914] rounded-full flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 bg-[#E50914] rounded-full" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#E50914] tracking-wider uppercase">
                      STEP {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase">
                    {step.title}
                  </h3>
                </div>

                <p className="text-gray-300 text-xs font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BurgerAssemblySection;
