import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Sparkles, ChevronRight, Mail, Users, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Careers = () => {
  const jobs = [
    {
      title: 'Lead Textile Designer',
      department: 'Creative & Design',
      location: 'New York, NY (Hybrid)',
      type: 'Full-time',
      desc: 'Oversee sourcing and design development of our signature bio-synthetics and ocean plastic knits.'
    },
    {
      title: 'Senior Esports Apparel Product Manager',
      department: 'Product Development',
      location: 'Remote (US/EU)',
      type: 'Full-time',
      desc: 'Own product lifecycles for tournament jerseys, gamer jackets, and specialized apparel drops.'
    },
    {
      title: 'Global Supply Chain Specialist',
      department: 'Operations',
      location: 'New York, NY',
      type: 'Full-time',
      desc: 'Optimize custom logistics, import/export handling, and ensure zero carbon footprint standards.'
    }
  ];

  const benefits = [
    {
      title: 'Health & Wellness',
      desc: 'Comprehensive premium health cover plans, dental, vision, and mental wellness access.',
      icon: <Heart className="w-5 h-5 text-accent" />
    },
    {
      title: 'Garment Allowance',
      desc: 'Annual Bhondu clothing store credits to style yourself in our latest seasonal collections.',
      icon: <Sparkles className="w-5 h-5 text-accent" />
    },
    {
      title: 'Continuous Sabbaticals',
      desc: 'Sponsored continuous learning programs and structured paid sabbaticals for creative research.',
      icon: <Users className="w-5 h-5 text-accent" />
    }
  ];

  const handleApplyClick = (title) => {
    toast.success(`Application guidelines for ${title} copied to clipboard!`);
    navigator.clipboard.writeText(`Applying for ${title} position at Bhondu`);
  };

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
            <Briefcase className="w-3.5 h-3.5 text-accent" />
            JOIN THE TEAM
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            CAREERS AT BHONDU
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            WE ARE CONSTANTLY SEEKING BOTH VISIONARY DESIGNERS AND TECHNICAL INNOVATORS TO REDEFINE PREMIUM ESPORTS AND CASUAL APPAREL.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== OPEN ROLES ==================== */}
        <div className="space-y-6 max-w-4xl mx-auto mb-20">
          <motion.h2 variants={itemVariants} className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest text-left mb-8 border-b border-secondary dark:border-zinc-850 pb-4">
            Open Positions
          </motion.h2>

          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary dark:border-zinc-850 bg-secondary/15 dark:bg-zinc-900/10 p-6 sm:p-8 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left hover:border-accent transition-colors"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-widest text-accent uppercase">{job.department}</span>
                <h3 className="font-luxury-serif text-lg font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                  {job.title}
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                  {job.desc}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] text-zinc-550 tracking-widest uppercase pt-2">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-accent" /> {job.type}</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyClick(job.title)}
                className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-zinc-900 dark:bg-accent dark:hover:bg-white text-white dark:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer rounded-xs"
              >
                <span>APPLY NOW</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ==================== BENEFITS GRID ==================== */}
        <div className="mb-20">
          <motion.h2 variants={itemVariants} className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest text-center mb-12">
            Why Work With Us
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-secondary dark:border-zinc-850 bg-secondary/15 dark:bg-zinc-900/10 p-8 rounded-sm hover:border-accent transition-colors"
              >
                <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full w-fit mb-6">
                  {b.icon}
                </div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-primary dark:text-zinc-100 mb-3">
                  {b.title}
                </h3>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ==================== SPONTANEOUS APPLICATIONS ==================== */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto border border-secondary dark:border-zinc-850 bg-secondary/20 dark:bg-zinc-900/20 p-8 sm:p-12 rounded-sm text-center space-y-6"
        >
          <Mail className="w-8 h-8 text-accent mx-auto" />
          <h3 className="font-luxury-serif text-2xl font-bold uppercase tracking-widest">
            SPONTANEOUS CANDIDACY
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            DON'T SEE THE IDEAL OPENING BUT FEEL YOU COULD BRING AMAZING VALUE TO BHONDU? WE ARE ALWAYS EXCITIED TO HEAR FROM CREATIVES AND LOGISTIC INNOVATORS.
          </p>
          <a
            href="mailto:careers@bhondu.com?subject=Spontaneous Application"
            className="inline-flex px-8 py-4 bg-accent hover:bg-white text-primary hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer rounded-xs"
          >
            SEND RESUME & PORTFOLIO
          </a>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Careers;
