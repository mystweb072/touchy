"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiCloud } from "react-icons/ci";

const SUPER_REACTION_CONFIG = {
  label: "I Miss You",
  subText: "Every moment feels a bit quieter without you",
  bgColor: "#6366f1",
  color: "#818cf8",
  icon: CiCloud,
  isSuper: true,
  component: "IMissYou",
};

export default function SuperIMissYouReaction({
  onClose,
}: {
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      angle: (i * (360 / 25) * Math.PI) / 180,
      distance: 100 + Math.random() * 150,
      size: 4 + Math.random() * 4,
      delay: Math.random() * 0.5,
    }));
  }, []);

  if (!isMounted) return null;

  const Icon = SUPER_REACTION_CONFIG.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 text-white antialiased"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-[500px] w-[500px] rounded-full blur-[100px]"
            style={{ backgroundColor: SUPER_REACTION_CONFIG.bgColor }}
          />

          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 0.6, scale: 0.8 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: SUPER_REACTION_CONFIG.color,
                boxShadow: `0 0 15px ${SUPER_REACTION_CONFIG.color}`,
              }}
            />
          ))}

          <div className="relative z-10 flex max-w-sm flex-col items-center px-6 text-center">
            <div className="relative mb-8 flex items-center justify-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute h-24 w-24 rounded-full border-t-2 border-dashed"
                style={{ borderColor: SUPER_REACTION_CONFIG.color }}
              />

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-neutral-900/50 p-6 backdrop-blur-sm"
                style={{ color: SUPER_REACTION_CONFIG.color }}
              >
                <Icon size={70} />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-[10px] font-bold tracking-[0.4em] uppercase opacity-70"
            >
              Super reaction
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-3 text-4xl font-light tracking-wide"
            >
              {SUPER_REACTION_CONFIG.label}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-10 text-sm text-white/50 italic"
            >
              {SUPER_REACTION_CONFIG.subText}
            </motion.p>

            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(onClose, 500);
              }}
              className="cursor-pointer rounded-full border border-white/10 px-8 py-2 text-xs font-medium tracking-widest uppercase transition-all hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
