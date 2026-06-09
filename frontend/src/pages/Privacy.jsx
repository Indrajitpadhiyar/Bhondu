import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Lock, Scale, Mail } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      icon: <EyeOff className="w-4 h-4 text-accent" />,
      content: [
        'Account Profile Details: Name, email address, contact numbers, and default shipping addresses.',
        'Transactional Information: Order specifications, payment verification logs (we utilize secure third-party payment gateways; raw card details are never stored on our database), and order totals.',
        'Technical Logs: Device IP, browser configuration, location indices, and browsing behavior indicators on the storefront.'
      ]
    },
    {
      title: '2. Sourcing and Using Data',
      icon: <Lock className="w-4 h-4 text-accent" />,
      content: [
        'Fulfillment: Standard dispatch operations, order tracking, address verification, and delivery operations.',
        'Communications: Automated transactional email dispatch (invoice details, dispatch notifications, password recovery). With consent, newsletter emails.',
        'Security Auditing: Anti-fraud screening, security validation checks, and general site diagnostics.'
      ]
    },
    {
      title: '3. Preferences and Cookies',
      icon: <ShieldCheck className="w-4 h-4 text-accent" />,
      content: [
        'Session storage: We record session states and basket/cart quantities locally.',
        'UI Customization: Theme variables (dark/light mode configuration options) are stored in localStorage.',
        'Analytics: Third-party cookies assist in analyzing traffic metrics to improve design layouts.'
      ]
    },
    {
      title: '4. Legal Rights & Compliance',
      icon: <Scale className="w-4 h-4 text-accent" />,
      content: [
        'Access: You have the right to request a full copy of your registered profile data.',
        'Correction: You can edit addresses and profile info via the profile menu at any time.',
        'Erasure: You may request complete deletion of your account and related transactional logs, subject to financial accounting retention requirements.'
      ]
    }
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
            <Lock className="w-3.5 h-3.5 text-accent" />
            SECURE PROTOCOL
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            PRIVACY POLICY
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            LEARN HOW BHONDU SECURES AND MANAGES PROFILE, TRANSACTIONAL, AND DEVICE DATA ON THE SITE.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== PRIVACY SECTIONS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left max-w-6xl mx-auto">
          
          {/* Main Content Columns */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map((section, idx) => (
              <motion.div key={idx} variants={itemVariants} className="space-y-4">
                <div className="flex items-center space-x-3 text-primary dark:text-zinc-200">
                  <div className="p-2 bg-secondary/60 dark:bg-zinc-900 rounded-full">
                    {section.icon}
                  </div>
                  <h3 className="font-luxury-serif text-lg sm:text-xl font-bold uppercase tracking-widest">
                    {section.title}
                  </h3>
                </div>
                <div className="pl-11 space-y-3">
                  {section.content.map((bullet, bIdx) => (
                    <p key={bIdx} className="text-xs text-zinc-500 dark:text-zinc-450 uppercase tracking-widest leading-relaxed">
                      {bullet}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact / Right Sidebar Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <div className="bg-secondary/15 dark:bg-zinc-900/10 border border-secondary/60 dark:border-zinc-850 p-8 rounded-sm space-y-6">
              <Mail className="w-6 h-6 text-accent" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-primary dark:text-zinc-100">
                Privacy Enquiries
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                IF YOU HAVE QUESTIONS REGARDING INDIVIDUAL PRIVACY RIGHTS, ACCOUNT DELETION, OR COOKIE PREFERENCES, CONTACT THE ATELIER DATA COMPLIANCE TEAM DIRECTLY.
              </p>
              <a
                href="mailto:privacy@bhondu.com?subject=Privacy Request"
                className="inline-flex w-full justify-center py-3 bg-primary hover:bg-zinc-900 dark:bg-accent dark:hover:bg-white text-white dark:text-primary transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer rounded-xs"
              >
                CONTACT COMPLIANCE
              </a>
            </div>

            <div className="p-6 border border-secondary dark:border-zinc-800 rounded-sm bg-secondary/5 dark:bg-zinc-900/5 text-[9px] text-zinc-400 space-y-2 uppercase tracking-widest leading-relaxed">
              <span>LAST MODIFIED:</span>
              <p className="font-bold text-zinc-650 dark:text-zinc-300">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default Privacy;
