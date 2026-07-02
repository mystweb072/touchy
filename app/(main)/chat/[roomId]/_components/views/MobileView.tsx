"use client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { v4 } from "uuid";
import { REACTIONS, ReactionsType } from "../../data/reactions";
import { formatSeparatorDate, shouldShowSeparator } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { SuperOverlayManager } from "../SuperOverlayManager";

type Props = {
  connection: {
    recipient: {
      first_name: string;
      last_name: string;
      avatar_url: string;
      user_id: string;
    };
    sender: {
      first_name: string;
      last_name: string;
      avatar_url: string;
      user_id: string;
    };
    sender_user_id: string;
    user_id: string;
  };
  roomId: string;
  reactionsData: any[] | null;
  authUser: User | null;
};

export default function MobileView({
  roomId,
  connection,
  reactionsData,
  authUser,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reactionsModalOpen = searchParams.get("reactions") === "open";
  const supabase = createClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [reactions, setReactions] = useState<any[]>(reactionsData || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"normal" | "super">("normal");
  const filteredReactions = Object.entries(REACTIONS).filter(([_, data]) =>
    activeTab === "super" ? data.isSuper : !data.isSuper,
  );

  const connectedUser =
    connection.sender_user_id === authUser?.id
      ? connection.recipient
      : connection.sender;

  const { data: userAvatar } = supabase.storage
    .from("ProfilePictures")
    .getPublicUrl(connectedUser.avatar_url);

  useEffect(() => {
    if (!reactionsModalOpen) setIsSubmitting(false);
  }, [reactionsModalOpen]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const markAsRead = async () => {
      const { error } = await supabase
        .from("reactions")
        .update({ is_read: true })
        .match({
          room_id: roomId,
          is_read: false,
        })
        .neq("sender_id", authUser?.id);

      if (error) {
        console.log(error.message);
        return;
      }
    };

    markAsRead();
  }, [roomId]);

  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`, {
        config: { broadcast: { self: true } },
      })
      .on("broadcast", { event: "new_reaction_insert" }, (payload) => {
        const newData = payload.payload;
        setReactions((prev) => {
          if (prev.some((r) => r.id === newData.id)) return prev;
          return [newData, ...prev];
        });
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const [activeSuperComponent, setActiveSuperComponent] = useState<{
    component: string;
    config?: any;
  } | null>(null);

  const handleSendReaction = async (type: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const currentReaction = REACTIONS[type as keyof ReactionsType];

      if (currentReaction?.isSuper && currentReaction?.component) {
        setActiveSuperComponent({ component: currentReaction.component });
        setIsSubmitting(false);
      }

      const id = v4();
      const reactionObject = {
        id,
        room_id: roomId,
        sender_id: authUser?.id,
        type,
        sender: { user_id: authUser?.id },
        created_at: new Date().toISOString(),
      };

      setReactions((prev) => [reactionObject, ...prev]);
      setTimeout(scrollToBottom, 50);

      await supabase.channel(`room:${roomId}`).send({
        type: "broadcast",
        event: "new_reaction_insert",
        payload: reactionObject,
      });

      await supabase.channel(`room:notifications:${roomId}`).send({
        type: "broadcast",
        event: "new_reaction_in_room",
        payload: reactionObject,
      });

      const { error } = await supabase.from("reactions").insert({
        id,
        room_id: roomId,
        sender_id: authUser?.id,
        recipient_id: connectedUser.user_id,
        type,
      });

      if (error) {
        console.log(error.message);
      }

      router.replace(`/chat/${roomId}`, { scroll: false });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <header className="z-30 flex h-16 w-full shrink-0 items-center justify-center border-b bg-white/80 px-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="absolute left-4 rounded-xl border bg-white p-2 shadow-sm"
        >
          <IoArrowBackOutline size={20} />
        </button>
        <Link
          href={`/chat/${roomId}/settings`}
          className="flex items-center gap-2"
        >
          <Image
            src={userAvatar.publicUrl}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full border object-cover"
          />
          <p className="text-sm font-bold">
            {connectedUser.first_name} {connectedUser.last_name}
          </p>
        </Link>
      </header>

      <main
        ref={scrollContainerRef}
        className={`flex flex-1 touch-pan-y flex-col-reverse overflow-y-auto px-4 ${isSubmitting ? "pointer-events-none" : "pointer-events-auto"}`}
        style={{
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
        }}
      >
        <div className="flex flex-col-reverse">
          <div className="h-32 shrink-0" />

          {reactions.map((reaction: any, index: number) => {
            const config = REACTIONS[reaction.type as keyof typeof REACTIONS];
            if (!config) return null;

            const isMe = reaction.sender_id === authUser?.id;
            const nextReaction = reactions[index + 1];
            const showTime = shouldShowSeparator(reaction, nextReaction);

            if (config.isSuper) {
              const getStableRandom = (stringId: string, seed: string) => {
                let hash = 0;
                const combinedStr = stringId + seed;
                for (let i = 0; i < combinedStr.length; i++) {
                  hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
                }
                return Math.abs(hash % 1000) / 1000;
              };

              const MainIcon = config.icon;

              return (
                <div key={reaction.id} className="flex flex-col">
                  {showTime && (
                    <div className="my-6 flex justify-center">
                      <p className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black tracking-[0.15rem] text-slate-400 uppercase">
                        {formatSeparatorDate(reaction.created_at)}
                      </p>
                    </div>
                  )}

                  <div className="my-6 flex w-full justify-center px-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="group relative flex w-full max-w-[95%] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-neutral-950 p-8 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                      style={{
                        boxShadow: `0 20px 40px -15px ${config.color}20, 0 1px 0 0 rgba(255,255,255,0.1) inset`,
                      }}
                    >
                      <motion.div
                        initial={{ left: "-100%" }}
                        animate={{ left: "200%" }}
                        transition={{
                          repeat: Infinity,
                          repeatDelay: 3,
                          duration: 0.8,
                          ease: "easeInOut",
                        }}
                        className="pointer-events-none absolute top-0 z-10 h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                      />

                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.2, 0.35, 0.2],
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="pointer-events-none absolute z-0 h-64 w-64 rounded-full blur-[80px]"
                        style={{ backgroundColor: config.color }}
                      />

                      <motion.div
                        className="relative z-20 mb-4 flex h-32 w-32 items-center justify-center"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {[...Array(14)].map((_, i) => {
                          const seedStartX = getStableRandom(
                            reaction.id,
                            `startX-${i}`,
                          );
                          const seedStartY = getStableRandom(
                            reaction.id,
                            `startY-${i}`,
                          );
                          const seedMoveX = getStableRandom(
                            reaction.id,
                            `moveX-${i}`,
                          );
                          const seedMoveY = getStableRandom(
                            reaction.id,
                            `moveY-${i}`,
                          );
                          const seedDelay = getStableRandom(
                            reaction.id,
                            `delay-${i}`,
                          );
                          const seedRepeat = getStableRandom(
                            reaction.id,
                            `repeat-${i}`,
                          );
                          const seedSize = getStableRandom(
                            reaction.id,
                            `size-${i}`,
                          );

                          const startX = seedStartX * 100 - 50;
                          const startY = seedStartY * 100 - 50;

                          const moveX = startX + (seedMoveX * 30 - 15);
                          const moveY = startY - (20 + seedMoveY * 40);

                          const delay = seedDelay * 1.2;
                          const repeatDelay = 0.5 + seedRepeat * 2;
                          const dotSize = 3 + seedSize * 5;

                          return (
                            <motion.div
                              key={`super-cloud-dot-${reaction.id}-${i}`}
                              initial={{
                                x: startX,
                                y: startY,
                                opacity: 0,
                                scale: 0,
                              }}
                              animate={{
                                x: moveX,
                                y: moveY,
                                opacity: [0, 1, 1, 0],
                                scale: [0.5, 1, 0.2],
                              }}
                              transition={{
                                duration: 1.5 + seedMoveY * 1,
                                repeat: Infinity,
                                repeatDelay: repeatDelay,
                                delay: delay,
                                ease: "easeOut",
                              }}
                              className="pointer-events-none absolute rounded-full"
                              style={{
                                width: dotSize,
                                height: dotSize,
                                backgroundColor: config.color,
                                boxShadow: `0 0 8px ${config.color}, 0 0 2px #ffffff`,
                              }}
                            />
                          );
                        })}

                        <div
                          className="relative z-10 rounded-full border border-white/10 bg-neutral-900/80 p-5 text-white backdrop-blur-xl"
                          style={{
                            color: config.color,
                            filter: `drop-shadow(0 0 25px ${config.color}80) drop-shadow(0 0 60px ${config.color}40)`,
                          }}
                        >
                          <MainIcon
                            size={44}
                            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          />
                        </div>
                      </motion.div>

                      <span
                        className="relative z-20 mb-2 rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-[9px] font-black tracking-[0.3em] uppercase"
                        style={{ color: config.color }}
                      >
                        Super Reaction
                      </span>

                      <h3 className="relative z-20 mb-1.5 bg-linear-to-b from-white to-neutral-200 bg-clip-text text-3xl leading-none font-black tracking-tight text-transparent">
                        {typeof config.label === "function"
                          ? config.label(isMe, connectedUser.first_name)
                          : config.label}
                      </h3>

                      {config.subText && (
                        <p className="relative z-20 mx-auto max-w-[85%] text-xs leading-relaxed font-medium text-neutral-400">
                          {typeof config.subText === "function"
                            ? config.subText(isMe)
                            : config.subText}
                        </p>
                      )}

                      <div className="relative z-20 mt-6 flex w-full items-center justify-center gap-2 border-t border-white/5 pt-4 text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <span>
                          {isMe
                            ? "Sent by you"
                            : `Sent by ${connectedUser.first_name}`}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            }

            return (
              <div key={reaction.id} className="flex flex-col-reverse">
                <div
                  className={`mb-6 flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex max-w-[85%] items-end gap-2">
                    {!isMe && (
                      <Image
                        src={userAvatar.publicUrl}
                        alt="Av"
                        width={32}
                        height={32}
                        className="rounded-full border shadow-sm"
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="rounded-2xl px-5 py-3 text-white shadow-md"
                      style={{ backgroundColor: config.bgColor }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-white/20 p-1">
                          <config.icon size={24} />
                        </div>
                        <p className="text-md leading-tight font-bold">
                          {typeof config.label === "function"
                            ? config.label(isMe, connectedUser.first_name)
                            : config.label}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {showTime && (
                  <div className="my-6 flex justify-center">
                    <p className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black tracking-[0.15rem] text-slate-400 uppercase">
                      {formatSeparatorDate(reaction.created_at)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="h-6 shrink-0" />
        </div>
      </main>

      <div className="fixed right-6 bottom-8 z-40">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            router.push(`/chat/${roomId}?reactions=open`, { scroll: false })
          }
          className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-black text-white shadow-2xl"
        >
          <FiSend size={20} />
          Send reaction
        </motion.button>
      </div>

      <AnimatePresence>
        {reactionsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-white p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black">Choose a reaction</h2>
                <button
                  onClick={() => router.back()}
                  className="rounded-full bg-slate-100 p-2"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="mx-auto mb-12 w-full max-w-md">
                <div className="relative flex w-full rounded-2xl bg-slate-100 p-1 select-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab("normal")}
                    className="relative flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  >
                    {activeTab === "normal" && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 rounded-xl bg-white shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        activeTab === "normal"
                          ? "text-slate-900"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Normal
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("super")}
                    className="relative flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  >
                    {activeTab === "super" && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 rounded-xl border border-blue-50/50 bg-white shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        activeTab === "super"
                          ? "text-blue-600"
                          : "text-slate-500 hover:text-blue-500"
                      }`}
                    >
                      Super
                    </span>
                  </button>
                </div>
              </div>

              <div key={activeTab} className="relative grid auto-rows-fr gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredReactions.map(([key, rawData]: any) => {
                    // 1. Parsowanie danych - czyścimy funkcje do czystych tekstów
                    const data = {
                      ...rawData,
                      label:
                        typeof rawData.label === "function"
                          ? rawData.label(true, connectedUser?.first_name)
                          : rawData.label,
                      subText:
                        typeof rawData.subText === "function"
                          ? rawData.subText(true)
                          : rawData.subText,
                    };

                    const isSuper = data.isSuper;

                    return (
                      <motion.button
                        layout="position"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        key={key}
                        disabled={isSubmitting}
                        onClick={() => handleSendReaction(key)}
                        className={`relative flex h-20 w-full items-center gap-4 overflow-hidden rounded-2xl p-4 text-white will-change-transform select-none ${
                          isSubmitting
                            ? "cursor-not-allowed opacity-50 grayscale"
                            : "cursor-pointer"
                        }`}
                        style={{
                          // Naprawa: Jeśli to Super, używamy gradientu, jeśli Normal - używamy backgroundColor z data
                          background: isSuper
                            ? `linear-gradient(135deg, ${data.bgColor} 0%, color-mix(in srgb, ${data.bgColor}, black 20%) 100%)`
                            : data.bgColor,
                          boxShadow: isSuper
                            ? `0 4px 20px -5px ${data.bgColor}`
                            : "none",
                          border: isSuper
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "none",
                        }}
                      >
                        {isSuper && (
                          <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "linear",
                              repeatDelay: 1,
                            }}
                            className="absolute inset-0 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
                        )}

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isSuper ? "bg-black/20 backdrop-blur-md" : "bg-white/15"}`}
                        >
                          <data.icon size={24} />
                        </div>

                        <div className="min-w-0 flex-1 overflow-hidden text-left">
                          <p
                            className={`w-full truncate text-base leading-snug ${isSuper ? "font-black tracking-wide" : "font-semibold"}`}
                          >
                            {data.label}
                          </p>
                          {data.subText && (
                            <p
                              className={`mt-0.5 w-full truncate text-xs ${isSuper ? "font-medium text-white/70" : "font-medium text-white/80"}`}
                            >
                              {data.subText}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuperOverlayManager
        activeComponent={activeSuperComponent?.component}
        config={activeSuperComponent?.config}
        onClose={() => setActiveSuperComponent(null)}
        connectedUser={connectedUser}
      />
    </div>
  );
}
