import { useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 style={{ fontSize: '4rem', letterSpacing: '-2px' }}>
          <TypeAnimation
            sequence={[
              'No_Queue',
              1500,
              () => {
                navigate('/login');
              }
            ]}
            wrapper="span"
            cursor={true}
            repeat={0}
            className="text-gradient"
          />
        </h1>
      </motion.div>
    </div>
  );
}
