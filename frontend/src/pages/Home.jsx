import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import About from './About';

const Home = () => {
  const navigate = useNavigate();

  // Magnetic button states for Men & Women
  const [menBtnPos, setMenBtnPos] = useState({ x: 0, y: 0 });
  const [womenBtnPos, setWomenBtnPos] = useState({ x: 0, y: 0 });

  const handleMagneticMove = (e, setPos) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPos({ x: x * 0.35, y: y * 0.35 }); // Pull intensity
  };

  const handleMagneticLeave = (setPos) => {
    setPos({ x: 0, y: 0 });
  };

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        className="w-full min-h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden transition-colors duration-300"
      >

        {/* ==================== LEFT CARD: MEN'S COLLECTION ==================== */}
        <motion.div
          variants={cardVariants}
          className="w-full md:w-1/2 min-h-[50vh] md:min-h-0 relative flex flex-col justify-end p-8 sm:p-12 lg:p-20 overflow-hidden group border-b md:border-b-0 md:border-r border-secondary dark:border-zinc-800"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1200&auto=format&fit=crop"
              alt="Men's Fashion Background"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out filter brightness-[0.7] dark:brightness-[0.4]"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          </div>

          {/* 3 Overlapping Male Model Images */}
          <div className="absolute top-12 right-12 z-20 hidden xl:flex space-x-[-40px]">
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform"
            >
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform transform translate-y-4"
            >
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform"
            >
              <img src="https://images.unsplash.com/photo-1618886614638-80e3c103d31a?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Text and CTA */}
          <div className="relative z-20 text-white space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">
              COLLECTION 2026
            </span>
            <h1 className="font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none m-0">
              MEN COLLECTION
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-light tracking-widest uppercase">
              Premium Fashion For Modern Men
            </p>

            <div className="pt-4">
              <motion.button
                onMouseMove={(e) => handleMagneticMove(e, setMenBtnPos)}
                onMouseLeave={() => handleMagneticLeave(setMenBtnPos)}
                animate={{ x: menBtnPos.x, y: menBtnPos.y }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                onClick={() => navigate('/man')}
                className="px-8 py-4 border border-accent text-accent bg-transparent hover:bg-accent hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center space-x-3 cursor-pointer"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ==================== RIGHT CARD: WOMEN'S COLLECTION ==================== */}
        <motion.div
          variants={cardVariants}
          className="w-full md:w-1/2 min-h-[50vh] md:min-h-0 relative flex flex-col justify-end p-8 sm:p-12 lg:p-20 overflow-hidden group"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
              alt="Women's Fashion Background"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out filter brightness-[0.7] dark:brightness-[0.4]"
            />
            {/* Beige Tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-secondary/10 dark:via-zinc-950/20 to-transparent z-10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-15 opacity-80" />
          </div>

          {/* 3 Overlapping Female Model Images */}
          <div className="absolute top-12 right-12 z-20 hidden xl:flex space-x-[-40px]">
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform"
            >
              <img src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform transform translate-y-4"
            >
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              whileHover={{ y: -10, zIndex: 30 }}
              className="w-24 h-32 border border-accent/40 rounded-sm overflow-hidden shadow-2xl transition-transform"
            >
              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Text and CTA */}
          <div className="relative z-20 text-white space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">
              COLLECTION 2026
            </span>
            <h1 className="font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none m-0">
              WOMEN COLLECTION
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-light tracking-widest uppercase">
              Discover Your Style
            </p>

            <div className="pt-4">
              <motion.button
                onMouseMove={(e) => handleMagneticMove(e, setWomenBtnPos)}
                onMouseLeave={() => handleMagneticLeave(setWomenBtnPos)}
                animate={{ x: womenBtnPos.x, y: womenBtnPos.y }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                onClick={() => navigate('/women')}
                className="px-8 py-4 border border-accent text-accent bg-transparent hover:bg-accent hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center space-x-3 cursor-pointer"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <About />
    </>
  );
};

export default Home;
