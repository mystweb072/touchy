"use client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { v4 } from "uuid";
import { REACTIONS } from "../../data/reactions";
import { formatSeparatorDate, shouldShowSeparator } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

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

  const handleSendReaction = async (type: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
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
                          {config.label}
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
              <div className="grid gap-3">
                {Object.entries(REACTIONS).map(([key, data]: any) => (
                  <button
                    key={key}
                    disabled={isSubmitting}
                    onClick={() => handleSendReaction(key)}
                    className={`flex items-center gap-4 rounded-2xl p-4 text-white transition-all ${isSubmitting ? "opacity-40 grayscale" : "active:scale-95"}`}
                    style={{ backgroundColor: data.bgColor }}
                  >
                    <data.icon size={24} />
                    <div className="text-left">
                      <p className="font-bold">{data.label}</p>
                      <p className="text-xs opacity-80">{data.subText}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
