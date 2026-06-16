import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Your message has been sent successfully.');
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 1200);
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
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            CUSTOMER SUPPORT
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider leading-none">
            CONTACT US
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-light max-w-2xl mx-auto">
            HAVE A QUESTION ABOUT AN ORDER, SIZING, OR CUSTOM TOURNAMENT GEAR? REACH OUT TO THE BHONDU ATELIER TEAM.
          </p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </motion.div>

        {/* ==================== CONTENT GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 bg-secondary/20 dark:bg-zinc-900/30 border border-secondary dark:border-zinc-850 p-6 sm:p-10 rounded-sm glass-modal"
          >
            <h2 className="font-luxury-serif text-xl sm:text-2xl font-bold uppercase tracking-widest mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-secondary dark:border-zinc-800 py-3 px-4 text-xs tracking-wider outline-none focus:border-accent text-primary dark:text-zinc-100 placeholder-zinc-400 transition-colors"
                    placeholder="E.G. ALEXANDER MCQUEEN"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-secondary dark:border-zinc-800 py-3 px-4 text-xs tracking-wider outline-none focus:border-accent text-primary dark:text-zinc-100 placeholder-zinc-400 transition-colors"
                    placeholder="NAME@DOMAIN.COM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-secondary dark:border-zinc-800 py-3 px-4 text-xs tracking-wider outline-none focus:border-accent text-primary dark:text-zinc-100 placeholder-zinc-400 transition-colors"
                    placeholder="E.G. +1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    SUBJECT
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-secondary dark:border-zinc-800 py-3 px-4 text-xs tracking-wider outline-none focus:border-accent text-primary dark:text-zinc-100 transition-colors"
                  >
                    <option value="General Inquiry">GENERAL INQUIRY</option>
                    <option value="Order Support">ORDER SUPPORT</option>
                    <option value="Sizing Advice">SIZING ADVICE</option>
                    <option value="Tournament Wear Customization">TOURNAMENT WEAR CUSTOMIZATION</option>
                    <option value="Press & Partnerships">PRESS & PARTNERSHIPS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                  YOUR MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-zinc-950 border border-secondary dark:border-zinc-800 py-3 px-4 text-xs tracking-wider outline-none focus:border-accent text-primary dark:text-zinc-100 placeholder-zinc-400 transition-colors resize-none"
                  placeholder="WRITE YOUR ENQUIRY HERE..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-zinc-900 dark:bg-accent dark:hover:bg-white text-white dark:text-primary py-4 px-6 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 rounded-xs hover:shadow-lg dark:hover:shadow-accent/10"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Contact Details & Info */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-10">
            
            {/* Quick Contact Cards */}
            <div className="bg-secondary/10 dark:bg-zinc-900/10 border border-secondary/60 dark:border-zinc-850 p-8 rounded-sm space-y-8">
              <h2 className="font-luxury-serif text-xl sm:text-2xl font-bold uppercase tracking-widest border-b border-secondary dark:border-zinc-800 pb-4">
                Atelier Directory
              </h2>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-secondary/50 dark:bg-zinc-900 rounded-full text-accent flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">EMAIL ENQUIRIES</h4>
                  <p className="text-sm font-medium hover:text-accent transition-colors">
                    <a href="mailto:bhondufesion@gmail.com">bhondufesion@gmail.com</a>
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">General response within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-secondary/50 dark:bg-zinc-900 rounded-full text-accent flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">TELEPHONE SUPPORT</h4>
                  <p className="text-sm font-medium hover:text-accent transition-colors">
                    <a href="tel:+919714833771">+91 97148 33771</a>
                  </p>
                </div>
              </div>


            </div>

            {/* Premium Call-out */}
            <div className="relative h-48 rounded-sm overflow-hidden border border-secondary dark:border-zinc-800 flex items-center p-8">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
                alt="Showroom Design"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
              />
              <div className="relative z-10 text-white space-y-2 text-left">
                <h4 className="font-luxury-serif text-lg font-bold uppercase tracking-widest">BHONDU MEMBERSHIP</h4>
                <p className="text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed">
                  MEMBERS ENJOY LIFETIME REPAIRS, FREE PRE-RELEASE RESERVATIONS, AND 24/7 DEDICATED ATELIER CONCIERGE CHAT.
                </p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default Contact;
