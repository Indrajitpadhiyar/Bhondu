import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Info, Ruler, Sparkles } from 'lucide-react';

const SizeGuide = () => {
  const [unit, setUnit] = useState('IN'); // 'IN' or 'CM'
  const [genderTab, setGenderTab] = useState('MAN'); // 'MAN' or 'WOMAN'

  // Size data
  const manApparel = [
    { size: 'XS', chest: { IN: '32 - 34', CM: '81 - 86' }, waist: { IN: '26 - 28', CM: '66 - 71' }, hips: { IN: '32 - 34', CM: '81 - 86' } },
    { size: 'S', chest: { IN: '35 - 37', CM: '89 - 94' }, waist: { IN: '29 - 31', CM: '74 - 79' }, hips: { IN: '35 - 37', CM: '89 - 94' } },
    { size: 'M', chest: { IN: '38 - 40', CM: '97 - 102' }, waist: { IN: '32 - 34', CM: '81 - 86' }, hips: { IN: '38 - 40', CM: '97 - 102' } },
    { size: 'L', chest: { IN: '41 - 43', CM: '104 - 109' }, waist: { IN: '35 - 37', CM: '89 - 94' }, hips: { IN: '41 - 43', CM: '104 - 109' } },
    { size: 'XL', chest: { IN: '44 - 46', CM: '112 - 117' }, waist: { IN: '38 - 40', CM: '97 - 102' }, hips: { IN: '44 - 46', CM: '112 - 117' } },
    { size: 'XXL', chest: { IN: '47 - 49', CM: '119 - 124' }, waist: { IN: '41 - 43', CM: '104 - 109' }, hips: { IN: '47 - 49', CM: '119 - 124' } }
  ];

  const womanApparel = [
    { size: 'XS', chest: { IN: '30 - 32', CM: '76 - 81' }, waist: { IN: '23 - 25', CM: '58 - 63' }, hips: { IN: '33 - 35', CM: '84 - 89' } },
    { size: 'S', chest: { IN: '33 - 35', CM: '84 - 89' }, waist: { IN: '26 - 28', CM: '66 - 71' }, hips: { IN: '36 - 38', CM: '91 - 96' } },
    { size: 'M', chest: { IN: '36 - 38', CM: '91 - 96' }, waist: { IN: '29 - 31', CM: '74 - 79' }, hips: { IN: '39 - 41', CM: '99 - 104' } },
    { size: 'L', chest: { IN: '39 - 41', CM: '99 - 104' }, waist: { IN: '32 - 34', CM: '81 - 86' }, hips: { IN: '42 - 44', CM: '107 - 112' } },
    { size: 'XL', chest: { IN: '42 - 44', CM: '107 - 112' }, waist: { IN: '35 - 37', CM: '89 - 94' }, hips: { IN: '45 - 47', CM: '114 - 119' } }
  ];

  const shoeSizes = [
    { us: '7', uk: '6', eu: '40', cm: '25.0', in: '9.8' },
    { us: '8', uk: '7', eu: '41', cm: '26.0', in: '10.2' },
    { us: '9', uk: '8', eu: '42.5', cm: '27.0', in: '10.6' },
    { us: '10', uk: '9', eu: '44', cm: '28.0', in: '11.0' },
    { us: '11', uk: '10', eu: '45', cm: '29.0', in: '11.4' },
    { us: '12', uk: '11', eu: '46', cm: '30.0', in: '11.8' }
  ];

  const currentApparelData = genderTab === 'MAN' ? manApparel : womanApparel;

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
            <Scissors className="w-3.5 h-3.5 text-accent animate-pulse" />
            FIT ATELIER
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            SIZE GUIDE
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            ENSURE THE PERFECT FIT. REVIEW OUR MEASUREMENT DETAILS AND SIZING SPECS TO MATCH YOUR PROFILE.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== CONTROLS SWITCHES ==================== */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center border-b border-secondary dark:border-zinc-855 pb-6 mb-12 gap-6">
          {/* Gender Tabs */}
          <div className="flex bg-secondary/50 dark:bg-zinc-900/50 p-1 rounded-sm border border-secondary dark:border-zinc-800">
            <button
              onClick={() => setGenderTab('MAN')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${genderTab === 'MAN' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500 hover:text-primary'}`}
            >
              MEN'S SIZING
            </button>
            <button
              onClick={() => setGenderTab('WOMAN')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${genderTab === 'WOMAN' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500 hover:text-primary'}`}
            >
              WOMEN'S SIZING
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center space-x-3 text-xs tracking-widest uppercase font-semibold text-zinc-400">
            <span>UNIT:</span>
            <div className="flex bg-secondary/50 dark:bg-zinc-900/50 p-1 rounded-sm border border-secondary dark:border-zinc-800">
              <button
                onClick={() => setUnit('IN')}
                className={`px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${unit === 'IN' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500'}`}
              >
                INCHES
              </button>
              <button
                onClick={() => setUnit('CM')}
                className={`px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${unit === 'CM' ? 'bg-primary text-white dark:bg-accent dark:text-primary' : 'text-zinc-500'}`}
              >
                CENTIMETERS
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==================== APPAREL SIZING TABLE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left mb-20">
          
          {/* Table Container */}
          <motion.div variants={itemVariants} className="lg:col-span-8 overflow-x-auto border border-secondary dark:border-zinc-850 p-6 rounded-sm bg-secondary/5 dark:bg-zinc-900/5">
            <h3 className="font-luxury-serif text-lg font-bold uppercase tracking-widest mb-6">
              {genderTab} Apparel sizing
            </h3>
            <table className="w-full text-xs tracking-wider uppercase text-left border-collapse">
              <thead>
                <tr className="border-b border-secondary dark:border-zinc-850 text-zinc-400 font-bold">
                  <th className="py-4 px-3">SIZE</th>
                  <th className="py-4 px-3">CHEST ({unit})</th>
                  <th className="py-4 px-3">WAIST ({unit})</th>
                  <th className="py-4 px-3">HIPS ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary dark:divide-zinc-900">
                {currentApparelData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-accent">{row.size}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">{row.chest[unit]}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">{row.waist[unit]}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">{row.hips[unit]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Measurements Guidance */}
          <motion.div variants={itemVariants} className="lg:col-span-4 bg-secondary/10 dark:bg-zinc-900/10 border border-secondary/60 dark:border-zinc-850 p-8 rounded-sm space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-primary dark:text-zinc-100 border-b border-secondary dark:border-zinc-800 pb-4">
              How to Measure
            </h3>

            <div className="space-y-4 text-xs uppercase tracking-widest text-zinc-500">
              <div className="space-y-1">
                <h4 className="font-bold text-primary dark:text-zinc-200">1. CHEST</h4>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Measure around the fullest part of your chest, keeping the tape horizontal under the armpits.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-primary dark:text-zinc-200">2. WAIST</h4>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Measure around the narrowest part of your waistline (typically where your body bends side to side).
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-primary dark:text-zinc-200">3. HIPS</h4>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Measure around the fullest part of your hips, keeping the measuring tape horizontal.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-secondary dark:border-zinc-800 flex items-start space-x-3 text-[10px] text-zinc-400">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                FOR TOURNAMENT JERSEY PURCHASES, WE RECOMMEND SIZING UP BY ONE UNIT IF YOU PREFER A COMFORTABLE LOOSE FIT OVER A FITTED ESports ATHLETE SILHOUETTE.
              </p>
            </div>
          </motion.div>

        </div>

        {/* ==================== SHOES SIZING TABLE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left border-t border-secondary dark:border-zinc-850 pt-20">
          
          {/* Sizing description */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-accent" />
              <h3 className="font-luxury-serif text-xl sm:text-2xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                Shoe Sizing conversion
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest">
              WE OFFER PRECISE LUXURY MONOLITH SNEAKERS SIZING MAPS. MEASURE FOOT FROM HEEL TO LONGEST TOE TO SELECT THE PROPER MATRIX FIT.
            </p>
            <div className="p-6 border border-secondary dark:border-zinc-800 rounded-sm bg-secondary/10 dark:bg-zinc-900/10 text-[10px] text-zinc-500 space-y-2">
              <span className="font-bold text-accent uppercase tracking-widest block">PRO TIP:</span>
              <p className="leading-relaxed">
                OUR CASUAL LEATHER SNEAKERS GENERALLY FIT TRUE TO EU STANDARDS. IF YOU FALL BETWEEN HALF-SIZES, WE SUGGEST ORDERING THE NEXT SIZE UP.
              </p>
            </div>
          </motion.div>

          {/* Shoes Table Container */}
          <motion.div variants={itemVariants} className="lg:col-span-8 overflow-x-auto border border-secondary dark:border-zinc-850 p-6 rounded-sm bg-secondary/5 dark:bg-zinc-900/5">
            <table className="w-full text-xs tracking-wider uppercase text-left border-collapse">
              <thead>
                <tr className="border-b border-secondary dark:border-zinc-850 text-zinc-400 font-bold">
                  <th className="py-4 px-3">US SIZE</th>
                  <th className="py-4 px-3">UK SIZE</th>
                  <th className="py-4 px-3">EU SIZE</th>
                  <th className="py-4 px-3">FOOT LENGTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary dark:divide-zinc-900">
                {shoeSizes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-accent">US {row.us}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">UK {row.uk}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">EU {row.eu}</td>
                    <td className="py-4 px-3 text-zinc-650 dark:text-zinc-300">
                      {unit === 'IN' ? `${row.in} IN` : `${row.cm} CM`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default SizeGuide;
