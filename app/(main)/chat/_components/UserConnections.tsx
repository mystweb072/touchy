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
    <Link href={`/chat/${connection.id}`} className="block">
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between rounded-2xl bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Image
              src={publicUrl}
              alt={`${connectedUser.first_name} avatar`}
              width={54}
              height={54}
              className="rounded-full border-2 border-white/20 object-cover"
            />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#1e40af] bg-red-500 px-1.5 text-sm font-bold text-white shadow-lg"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col">
            <p className="text-lg leading-tight font-semibold">
              {connectedUser.first_name} {connectedUser.last_name}
            </p>
            <span className="text-xs font-medium tracking-tight text-blue-100/60 uppercase">
              Connected: {formatDate(connection.created_at)}
            </span>
          </div>
        </div>

        <div className="mr-2 text-white/30 transition-colors group-hover:text-white">
          <IoChevronForward size={20} />
        </div>
      </motion.div>
    </Link>
  );
}
