"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import { IoChevronBack, IoConstructOutline } from "react-icons/io5";

type Props = {};

export default function UnderConstruction({}: Props) {
  const router = useRouter();
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-900 font-sans antialiased">
      <div className="absolute inset-0 bg-linear-to-b from-blue-600 to-blue-800">
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 size-80 rounded-full bg-blue-400/30 blur-[100px]"
        />

        <div className="relative z-10 flex h-full flex-col px-8 pt-16 pb-12">
          <button
            onClick={() => router.back()}
            className="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-lg transition-transform active:scale-90"
          >
            <IoChevronBack size={24} />
          </button>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-10"
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
              <div className="relative flex size-32 items-center justify-center rounded-[3rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">
                <IoConstructOutline size={60} className="text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="mb-4 text-4xl font-black tracking-tight text-white">
                Technical break
              </h1>
              <p className="px-4 text-lg leading-relaxed font-medium text-blue-100/60">
                This feature is still under construction. <br />
                Come back soon!
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <button
              onClick={() => router.back()}
              className="w-full rounded-4xl bg-white py-5 text-lg font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
            >
              Go back
            </button>
            <p className="mt-6 text-center text-xs font-bold tracking-[0.2em] text-white/30 uppercase">
              Work in progress • v1.0
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
