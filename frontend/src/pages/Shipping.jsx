import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Globe, ShieldCheck, HelpCircle, Package, Clock } from 'lucide-react';

const Shipping = () => {
  const shippingMethods = [
    {
      name: 'Standard Atelier Delivery',
      time: '3 - 5 Business Days',
      price: '$15.00',
      description: 'Free for orders exceeding $250.00. Delivered via courier with signature validation.',
      badge: 'POPULAR'
    },
    {
      name: 'Express Courier Dispatch',
      time: '1 - 2 Business Days',
      price: '$30.00',
      description: 'Guaranteed dispatch within 12 hours. Full real-time live SMS tracking notifications.',
      badge: 'FASTEST'
    },
    {
      name: 'International Air Freight',
      time: '3 - 7 Business Days',
      price: '$45.00',
      description: 'Global courier service with expedited customs handling. Customs fees calculated at checkout.',
      badge: 'GLOBAL'
    }
  ];

  const faqs = [
    {
      q: 'HOW DO I TRACK MY ATELIER DISPATCH?',
      a: 'ONCE YOUR SHIPMENT LEAVES OUR ATELIER warehouse, YOU WILL RECEIVE AN EMAIL CONTAINING A TRACKING LINK AND A UNIQUE WAYBILL NUMBER. YOU CAN MONTIOR YOUR SHIPMENT VIA THE COURIER SYSTEM.'
    },
    {
      q: 'DO YOU DELIVER TO PO BOX ADDRESSES?',
      a: 'AS ALL BHONDU SHIPMENTS REQUIRE SIGNATURE AUTHENTICATION UPON HANDOVER FOR SECURITY, WE DO NOT DELIVER TO PO BOXES OR PARCEL LOCKERS.'
    },
    {
      q: 'WHAT ABOUT CUSTOMS AND IMPORT IMPORT FEES?',
      a: 'FOR SHIPMENTS OUTSIDE OF THE DOMESTIC REGION, TAXES AND CUSTOM DUTIES ARE SHOWN AT CHECKOUT ACCORDING TO YOUR DESTINATION AND LOCAL REGULATIONS.'
    },
    {
      q: 'CAN I AMEND MY DELIVERY ADDRESS POST-ORDER?',
      a: 'ADDRESS CORRECTIONS CAN BE INITIATED WITHIN 1 HOUR OF PLACING AN ORDER. CONTACT THE SUPPORT DESK VIA PHONE OR CHAT IMMEDIATELY. WE CANNOT CHANGE DETAILS ONCE PARCELS ARE WITH COURIERS.'
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
            <Truck className="w-3.5 h-3.5 text-accent animate-pulse" />
            WORLDWIDE FULFILLMENT
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            SHIPPING & FEES
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            DISCOVER SHIPPING METHODS, CHARGES, AND FULFILLMENT TIMELINES FOR YOUR PREMIUM PURCHASES.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== SHIPPING TIERS GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {shippingMethods.map((method, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary dark:border-zinc-850 bg-secondary/15 dark:bg-zinc-900/10 p-8 rounded-sm relative flex flex-col justify-between text-left hover:border-accent transition-colors"
            >
              {method.badge && (
                <span className="absolute top-4 right-4 text-[8px] font-bold tracking-widest px-2.5 py-1 bg-primary text-white dark:bg-accent dark:text-primary rounded-xs uppercase">
                  {method.badge}
                </span>
              )}
              <div className="space-y-4">
                <h3 className="font-luxury-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                  {method.name}
                </h3>
                <div className="flex items-baseline space-x-2 border-b border-secondary dark:border-zinc-800 pb-4">
                  <span className="text-3xl font-extrabold tracking-tight text-accent">
                    {method.price}
                  </span>
                  <span className="text-[10px] text-zinc-400 tracking-widest uppercase">/ flat rate</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
                  {method.description}
                </p>
              </div>

              <div className="mt-8 flex items-center space-x-3 text-xs tracking-widest font-semibold uppercase">
                <Clock className="w-4 h-4 text-accent" />
                <span>ETA: {method.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ==================== CORE PRINCIPLES ==================== */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-secondary dark:border-zinc-850 py-12 mb-20 text-left"
        >
          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full w-fit text-accent">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest">EXPEDITED FULFILLMENT</h4>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
              Orders placed before 2:00 PM EST on business days are processed and prepared for courier dispatch on the same day.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full w-fit text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest">INSURED TRANSPORT</h4>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
              Every parcel is fully insured during transit against damage or loss, ensuring absolute peace of mind.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 dark:bg-zinc-900 rounded-full w-fit text-accent">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest">PREMIUM EMBALLAGE</h4>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
              All garments are carefully packed in dust bags and shipped in high-density recyclable protective carton packaging.
            </p>
          </div>
        </motion.div>

        {/* ==================== FAQ SECTION ==================== */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <HelpCircle className="w-6 h-6 text-accent mx-auto" />
            <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest">
              Shipping FAQ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2 border-l border-accent pl-4 py-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary dark:text-zinc-100">
                  {faq.q}
                </h4>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Shipping;
