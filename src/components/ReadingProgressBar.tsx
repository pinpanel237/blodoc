'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"
        style={{
          scaleX,
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.7), 0 0 20px rgba(168, 85, 247, 0.4)',
        }}
      />
    </div>
  );
}
