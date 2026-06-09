import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, FileText, PackageOpen, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';

const Returns = () => {
  const steps = [
    {
      num: '01',
      title: 'Initiate Return Request',
      icon: <FileText className="w-5 h-5" />,
      description: 'Contact customer care at support@bhondu.com. Provide your Order ID and target items to receive a pre-paid shipping waybill.'
    },
    {
      num: '02',
      title: 'Repackage the Items',
      icon: <PackageOpen className="w-5 h-5" />,
      description: 'Place garments in their original dust bag with tags attached. Pack inside the original carton packaging to prevent shipping damage.'
    },
    {
      num: '03',
      title: 'Handover to Courier',
      icon: <RotateCcw className="w-5 h-5" />,
      description: 'Affix the printed pre-paid label on the carton. Drop the package off at any designated partner courier service collection point.'
    },
    {
      num: '04',
      title: 'Receive Refund',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Once checked by our Quality Atelier (generally within 3 business days), a refund is credited to your original payment method.'
    }
  ];

  const rules = [
    'Garments must be returned unworn, unwashed, and undamaged.',
    'All original designer swing tags and dust bags must be attached.',
    'Returns must be shipped within 30 days from your order delivery date.',
    'Customized apparel (such as Tournament Wear printed with custom gamer tags/names) is non-returnable unless defective.'
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12,
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
            <RotateCcw className="w-3.5 h-3.5 text-accent animate-spin-slow" />
            30-DAY EASY RETRACTS
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            RETURNS & REFUNDS
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            HASSLE-FREE PROCESS FOR RETURNING PRODUCTS TO THE BHONDU WAREHOUSE FOR REFUND OR EXCHANGE.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== STEPS PIPELINE ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-left">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary dark:border-zinc-850 bg-secondary/15 dark:bg-zinc-900/10 p-8 rounded-sm relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full text-accent flex-shrink-0">
                  {step.icon}
                </div>
                <span className="text-3xl font-luxury-serif font-bold text-zinc-350 dark:text-zinc-800">
                  {step.num}
                </span>
              </div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-primary dark:text-zinc-100 mb-3">
                {step.title}
              </h3>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ==================== SPLIT RULE SECTION ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          {/* Rules/Policies Box */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 bg-secondary/20 dark:bg-zinc-900/30 border border-secondary dark:border-zinc-850 p-6 sm:p-10 rounded-sm glass-modal"
          >
            <h2 className="font-luxury-serif text-xl sm:text-2xl font-bold uppercase tracking-widest mb-6">
              Return Policy terms
            </h2>
            <ul className="space-y-4">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs tracking-widest text-zinc-500 uppercase leading-relaxed">
                  <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Alert / Exclusions Box */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 border border-amber-500/20 bg-amber-500/5 p-8 rounded-sm space-y-6"
          >
            <div className="flex items-center space-x-3 text-amber-500">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-bold text-xs uppercase tracking-widest">
                IMPORTANT WARNING
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              PLEASE DOUBLE-CHECK SIZING SPECIFICATIONS BEFORE PURCHASING TOURNAMENT JERSEYS PRINTED WITH CUSTOM GAMERTAGS. THESE JERSEYS ARE TAILORED INDIVIDUALLY AND CANNOT BE RETURNED OR EXCHANGED.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              If an item is received in a damaged or defective condition, contact support within 48 hours of delivery for a complimentary immediate replacement.
            </p>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default Returns;
