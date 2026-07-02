"use client";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoChevronForward } from "react-icons/io5";

type Props = {
  connection: { id: string; created_at: string };
  connectedUser: {
    first_name: string;
    last_name: string;
  };
  publicUrl: string;
  currentUser: string | undefined;
};

export default function UserConnections({
  connection,
  connectedUser,
  publicUrl,
  currentUser,
}: Props) {
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestReaction, setLatestReaction] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("reactions")
        .select("*", { count: "exact", head: true })
        .match({
          room_id: connection.id,
          is_read: false,
        })
        .neq("sender_id", currentUser);

      if (error) {
        console.error("Błąd licznika:", error.message);
        return;
      }

      setUnreadCount(count || 0);
    };
    fetchUnreadCount();

    const getLatestReaction = async () => {
      const { data, error } = await supabase
        .from("reactions")
        .select("*")
        .match({
          room_id: connection.id,
        })
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Błąd:", error.message);
        return;
      }

      if (data) {
        console.log(data.type);
        switch (data.type) {
          case "i_love_you":
            setLatestReaction("I love you");
            break;
          case "kiss_me":
            setLatestReaction("Kiss me");
            break;
          case "i_miss_you":
            setLatestReaction("I miss you");
            break;
          case "you_re_hot":
            setLatestReaction("You're hot");
            break;
          case "thinking_about_you":
            setLatestReaction("Thinking about you");
            break;
          case "i_want_you":
            setLatestReaction("I want you");
            break;
          default:
            setLatestReaction("Brak reakcji");
        }
      }
    };
    getLatestReaction();

    const channel = supabase
      .channel(`room:notifications:${connection.id}`, {
        config: { broadcast: { self: false } },
      })
      .on("broadcast", { event: "new_reaction_in_room" }, (payload) => {
        console.log("Nowa reakcja!");
        setUnreadCount((prev) => prev + 1);
      })
      .on("broadcast", { event: "reaction_read" }, () => {
        console.log("Odczytano!");
        setUnreadCount(0);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connection.id, currentUser]);

  return (
    <Link href={`/chat/${connection.id}`} className="block w-full">
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="group flex items-center justify-between rounded-xl border border-white/2 bg-white/4 p-3 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/8"
      >
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="relative shrink-0 select-none">
            <Image
              src={publicUrl}
              alt={`${connectedUser.first_name} avatar`}
              width={48}
              height={48}
              className="rounded-full border border-white/10 bg-white/5 object-cover"
            />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#1e40af] bg-rose-500 px-1 text-[11px] font-bold text-white shadow-md select-none"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex min-w-0 flex-col">
            <p className="truncate text-base leading-snug font-semibold tracking-tight text-white/90">
              {connectedUser.first_name} {connectedUser.last_name}
            </p>
            {latestReaction && (
              <span className="mt-0.5 truncate text-xs font-medium tracking-normal text-white/40 transition-colors duration-200 group-hover:text-white/60">
                {latestReaction}
              </span>
            )}
          </div>
        </div>

        <div className="mr-1 shrink-0 transform text-white/15 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/60">
          <IoChevronForward size={18} />
        </div>
      </motion.div>
    </Link>
  );
}
