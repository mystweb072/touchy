"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiHeart } from "react-icons/ci";
import { GiCardKingDiamonds } from "react-icons/gi";

const SUPER_REACTION_CONFIG = {
  label: (isMe: boolean, senderName?: string) =>
    isMe ? "I Love You" : `${senderName || "Someone"} is sending love`,
  subText: (isMe: boolean) =>
    isMe
      ? "A little piece of my heart for you"
      : "A little piece of their heart",
  bgColor: "#F59E0B",
  color: "#FBBF24",
  icon: GiCardKingDiamonds,
  isSuper: true,
  component: "SuperILoveYouReaction",
};

export default function SuperILoveYouReaction({
  onClose,
  connectedUser,
}: {
  onClose: () => void;
  connectedUser: { first_name: string; last_name: string };
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      angle: (i * (360 / 30) * Math.PI) / 180,
      distance: 130 + Math.random() * 200,
      size: 5 + Math.random() * 6,
      delay: Math.random() * 0.2,
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/95 text-white antialiased"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
            style={{ backgroundColor: SUPER_REACTION_CONFIG.color }}
          />

          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0.3,
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.6,
                delay: p.delay,
                ease: [0.1, 0.8, 0.3, 1],
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: SUPER_REACTION_CONFIG.color,
                boxShadow: `0 0 10px ${SUPER_REACTION_CONFIG.color}`,
              }}
            />
          ))}

          <div className="relative z-10 flex max-w-sm flex-col items-center px-6 text-center">
            <div className="relative mb-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute h-32 w-32 rounded-full border-2"
                style={{ borderColor: SUPER_REACTION_CONFIG.color }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="rounded-full border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                style={{ color: SUPER_REACTION_CONFIG.color }}
              >
                <Icon size={80} />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-xs font-black tracking-[0.3em] uppercase"
              style={{ color: SUPER_REACTION_CONFIG.color }}
            >
              Super Reaction
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-2 text-3xl font-extrabold tracking-tight"
            >
              {typeof SUPER_REACTION_CONFIG.label === "function"
                ? SUPER_REACTION_CONFIG.label(true, connectedUser.first_name)
                : SUPER_REACTION_CONFIG.label}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-sm leading-relaxed text-white/60"
            >
              {typeof SUPER_REACTION_CONFIG.subText === "function"
                ? SUPER_REACTION_CONFIG.subText(true)
                : SUPER_REACTION_CONFIG.subText}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsOpen(false);
                setTimeout(onClose, 500);
              }}
              className="cursor-pointer rounded-xl border border-white/10 bg-neutral-900 px-6 py-3 text-sm font-semibold tracking-wide text-white/80 transition-colors hover:bg-neutral-800"
            >
              Close Reaction
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
