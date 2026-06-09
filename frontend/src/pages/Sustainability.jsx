import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, Infinity, Sparkles, ShieldCheck } from 'lucide-react';

const Sustainability = () => {
  const pillars = [
    {
      title: 'Ocean Filaments',
      desc: '100% of our technical jerseys and activewear are knit from post-consumer ocean plastic debris. We clean coastal boundaries and spin ocean-bound waste into premium, high-durability fabrics.',
      icon: <Infinity className="w-5 h-5 text-accent" />
    },
    {
      title: 'Carbon Neutrality',
      desc: 'Through strict audits and targeted investments in forest preservation and clean energy projects, we neutralize the carbon footprint generated across our entire supply chain.',
      icon: <Globe className="w-5 h-5 text-accent" />
    },
    {
      title: 'Slow Fashion Ethos',
      desc: 'We reject standard fashion seasons. Every piece is architectural, timeless, and designed to endure. We construct apparel with reinforced seams and offer modular repair tutorials.',
      icon: <Leaf className="w-5 h-5 text-accent" />
    }
  ];

  const statistics = [
    { value: '100%', label: 'Ocean Recycled Filaments' },
    { value: '0%', label: 'Virgin Synthetics Sourced' },
    { value: '100%', label: 'Carbon Audited Supply' },
    { value: 'LIFETIME', label: 'Modular Stitch Guarantee' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pt-28 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ==================== HERO SECTION ==================== */}
        <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase bg-black dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800/40 inline-flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-accent animate-pulse" />
            CIRCULAR DESIGN
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            SUSTAINABILITY
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            DISCOVER HOW BHONDU BALANCES HIGH-PERFORMANCE ESPORTS APPAREL WITH STRICT ENVIRONMENT STEWARDSHIP.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== STATS LIST GRID ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-center">
          {statistics.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary dark:border-zinc-850 bg-secondary/10 dark:bg-zinc-900/10 p-6 sm:p-8 rounded-sm"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-accent mb-2">
                {stat.value}
              </h2>
              <p className="text-[9px] font-bold tracking-widest text-zinc-450 dark:text-zinc-400 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ==================== THREE SUSTAINABILITY PILLARS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 text-left">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary dark:border-zinc-850 bg-secondary/15 dark:bg-zinc-900/10 p-8 rounded-sm hover:border-accent transition-colors"
            >
              <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full w-fit mb-6">
                {pillar.icon}
              </div>
              <h3 className="font-luxury-serif text-lg font-bold uppercase tracking-widest text-primary dark:text-zinc-100 mb-4">
                {pillar.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ==================== TEXT STORY COMPONENT ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-t border-secondary dark:border-zinc-855 pt-20 text-left">
          
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest">
              Designing for Tomorrow
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              Traditional technical wear relies heavily on virgin polyester—a resource intensive, fossil-fuel based polymer. Bhondu was established to disrupt this pattern. By working alongside environmental scientists and high-performance knitting ateliers, we have proved that recycled ocean filaments can deliver identical, if not superior, sweat-wicking and dynamic performance.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              Every stage of our process—from packaging design using zero virgin plastic, to shipping only via carbon-offset priority delivery, to partnering with ethical ateliers in the USA and Italy—is audited. We continue to audit, iterate, and strive towards zero waste.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 relative h-80 rounded-sm overflow-hidden border border-secondary dark:border-zinc-800"
          >
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
              alt="Eco-friendly packaging"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] dark:brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-2">
              <div className="flex items-center space-x-2 text-accent">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-bold tracking-widest uppercase">CERTIFIED SECURE SOURCE</span>
              </div>
              <p className="text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed">
                WE SOURCE FIBERS FROM ISO-CERTIFIED RECLAMATION CENTERS GUARANTEEING ETHICAL WORKING HOURLY WAGES AND ECO-FRIENDLY BIO-STITCHING STANDARDS.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default Sustainability;
