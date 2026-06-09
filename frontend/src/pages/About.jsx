import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    // GSAP Context makes cleanup easy in React 18/19
    const ctx = gsap.context(() => {

      // Pinning the main page sections as they stack like cards
      const panels = gsap.utils.toArray('.scroll-panel');

      panels.forEach((panel, i) => {
        // We only pin panels that have another panel coming after them
        if (i < panels.length - 1) {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top top',
            pin: true,
            pinSpacing: false, // Prevents gap below pinned elements
            scrub: true
          });
        }
      });

      // Slide 1 animations: Parallax scroll for secondary card images
      gsap.to('.side-image-1', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.panel-1',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Slide 2 animations: Horizontal slide-in cards that meet and pin
      gsap.from('.left-slide-card', {
        xPercent: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: '.panel-2',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.from('.right-slide-card', {
        xPercent: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: '.panel-2',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      // Slide 3 animations: Cards stacking vertically one by one
      const stackCards = gsap.utils.toArray('.stack-card');
      stackCards.forEach((card, idx) => {
        gsap.from(card, {
          y: 100 + (idx * 50),
          opacity: 0,
          scale: 0.9,
          scrollTrigger: {
            trigger: '.panel-3',
            start: 'top center',
            end: 'center center',
            scrub: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert(); // clean up all GSAP timelines
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-secondary/20 dark:bg-zinc-950 transition-colors duration-300">

      {/* ==================== PANEL 1: GENESIS ==================== */}
      <section className="scroll-panel panel-1 min-h-screen w-full flex flex-col md:flex-row items-center justify-between relative bg-white dark:bg-zinc-900 border-b border-secondary dark:border-zinc-800 p-8 sm:p-12 lg:p-24 z-10">
        <div className="w-full md:w-1/2 space-y-6 text-left max-w-lg">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">THE GENESIS</span>
          <h2 className="font-luxury-serif text-4xl sm:text-5xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100 leading-tight">
            FORM AND FLOW
          </h2>
          <div className="w-12 h-[1px] bg-accent" />
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
            BHONDU is a study in form and flow. Born at the intersection of gaming culture and haute couture, we create technical apparel that honors esports performance while upholding the rigorous standards of modern luxury fashion.
          </p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
            SCROLL DOWN TO DISCOVER THE STORY
          </p>
        </div>

        {/* Floating/Parallax Image Cards */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto flex items-center justify-center relative mt-12 md:mt-0">
          {/* Main Card (pinned) */}
          <div className="w-64 sm:w-80 aspect-[3/4] border border-secondary dark:border-zinc-800 rounded-sm overflow-hidden shadow-2xl relative z-10">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
              alt="Genesis"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Parallax Card (moves up/down) */}
          <div className="side-image-1 absolute -bottom-10 -left-6 sm:left-4 w-40 sm:w-48 aspect-[3/4] border border-accent/40 rounded-sm overflow-hidden shadow-2xl z-20">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
              alt="Atelier detail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ==================== PANEL 2: ATELIER (Pinning & Horizontal Sliders) ==================== */}
      <section className="scroll-panel panel-2 min-h-screen w-full flex flex-col items-center justify-center relative bg-secondary/50 dark:bg-zinc-950/80 border-b border-secondary dark:border-zinc-800 p-8 sm:p-12 lg:p-24 z-20">
        <div className="text-center max-w-xl space-y-6 mb-16 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">THE ATELIER</span>
          <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            ENGINEERED COUTURE
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
            Every piece is developed in our atelier using sustainable, custom-woven fibers. From our signature 280GSM organic cotton tees to carbon-infused performance jerseys, our tailoring is engineered for comfort under pressure.
          </p>
        </div>

        {/* Sliders meeting in center */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center items-center gap-8 relative">
          <div className="left-slide-card w-72 aspect-[3/4] border border-secondary dark:border-zinc-800 rounded-sm overflow-hidden bg-white dark:bg-zinc-900 shadow-xl p-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
              alt="Weaving fibers"
              className="w-full h-2/3 object-cover rounded-xs"
            />
            <div className="mt-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest">TACTILE COMFORT</h4>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">PRE-WASHED ORGANIC SILK AND LINEN BLENDS.</p>
            </div>
          </div>

          <div className="right-slide-card w-72 aspect-[3/4] border border-secondary dark:border-zinc-800 rounded-sm overflow-hidden bg-white dark:bg-zinc-900 shadow-xl p-4">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
              alt="Tailoring"
              className="w-full h-2/3 object-cover rounded-xs"
            />
            <div className="mt-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest">ARCHITECTURAL CUTS</h4>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">STRUCTURED SILHOUETTES THAT HOLD FORM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PANEL 3: VISION (Vertical Stacking Cards) ==================== */}
      <section className="scroll-panel panel-3 min-h-screen w-full flex flex-col items-center justify-center relative bg-white dark:bg-zinc-900 p-8 sm:p-12 lg:p-24 z-30">
        <div className="text-center max-w-xl space-y-6 mb-16">
          <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">THE SUSTAINABILITY</span>
          <h2 className="font-luxury-serif text-3xl sm:text-4xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
            THE DIGITAL VANGUARD
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto" />
        </div>

        {/* Vertical Stacking Cards */}
        <div className="w-full max-w-4xl space-y-6 flex flex-col items-center">
          <div className="stack-card w-full max-w-2xl bg-secondary/30 dark:bg-zinc-800/50 border border-secondary dark:border-zinc-800 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-sm">
            <div className="text-left space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent">01 / RECYCLED TECHNICAL FILAMENTS</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                ESPORTS WEAR KNIT ENTIRELY FROM OCEAN-CLEANED OCEAN PLASTIC BOTTLES AND BIO-BASED NYLON.
              </p>
            </div>
            <div className="w-24 h-16 rounded-xs overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="stack-card w-full max-w-2xl bg-secondary/30 dark:bg-zinc-800/50 border border-secondary dark:border-zinc-800 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-sm">
            <div className="text-left space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent">02 / CARBON CERTIFIED PRODUCTION</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                CARBON FOOTPRINT AUDITING FOR THE ENTIRE SUPPLY CHAIN, NEUTRALIZED BY BRAND OFFSET INVESTMENTS.
              </p>
            </div>
            <div className="w-24 h-16 rounded-xs overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="stack-card w-full max-w-2xl bg-secondary/30 dark:bg-zinc-800/50 border border-secondary dark:border-zinc-800 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-sm">
            <div className="text-left space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent">03 / ENDURING QUALITY</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                WE DO NOT BELIEVE IN DISPOSABLE TRENDS. WE DESIGN PIECES BUILT FOR DURABILITY AND TIMELESSNESS.
              </p>
            </div>
            <div className="w-24 h-16 rounded-xs overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
