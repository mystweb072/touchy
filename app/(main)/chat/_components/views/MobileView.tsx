"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import UserConnections from "../UserConnections";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoCalendarOutline,
  IoExitOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { User } from "@supabase/supabase-js";
import { formatDate } from "@/lib/utils";
import { acceptInvitation, dismissInvitation } from "@/lib/actions";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

type Props = {
  getUserProfile: {
    first_name: string;
    last_name: string;
    user_id: string;
    invite_code: string;
  };
  publicUrl: string;
  userAuth: User | null;
  connections: any[];
  getInvites:
    | {
        from_user: string;
        id: string;
        invite_code: string;
        created_at: string;
        sender: {
          user_id: string;
          first_name: string;
          last_name: string;
          avatar_url: string;
        };
      }[]
    | null;
};

export default function MobileView({
  connections,
  userAuth,
  getUserProfile,
  publicUrl,
  getInvites,
}: Props) {
  const supabase = createClient();
  const user = userAuth?.id;
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      setShowNotificationPrompt(true);
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  const handleEnablePush = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const convertedVapidKeys = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      );

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKeys,
      });

      await supabase.from("push_subscriptions").upsert({
        user_id: userAuth?.id,
        subscription: sub.toJSON(),
      });

      setShowNotificationPrompt(false);
      alert("Powiadomienia włączone pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas odświeżania subskrypcji:", error);
    }
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-slate-50 font-sans antialiased">
      <header className="z-50 flex w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4">
        <UserSettings
          getUserProfile={getUserProfile}
          getInvites={getInvites}
          userAuth={userAuth}
          publicUrl={publicUrl}
        />
        <InviteUserModal />
      </header>

      <main className="px-6 pt-6">
        <AnimatePresence>
          {showNotificationPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 rounded-3xl bg-blue-600 p-5 text-white shadow-xl shadow-blue-200"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white/20 p-3">
                  <IoNotificationsOutline size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Enable Notifications</h3>
                  <p className="text-sm text-blue-100">
                    Get notified when someone sends you a touch!
                  </p>
                </div>
              </div>
              <button
                onClick={handleEnablePush}
                className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-blue-600 transition-transform active:scale-95"
              >
                Turn on
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Your connections
          </h1>
          <p className="text-sm text-slate-500">
            {connections.length} active connections
          </p>
        </div>
      </main>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 h-[50dvh] w-full overflow-y-auto rounded-t-[2.5rem] bg-linear-to-b from-blue-600 to-blue-800 p-6 text-white shadow-2xl shadow-blue-500/40"
      >
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />

        <div className="flex flex-col gap-4">
          {connections.length > 0 ? (
            connections.map((connection) => {
              const isSender = connection.sender_user_id === user;
              const connectedUser = isSender
                ? connection.recipient
                : connection.sender;
              const avatar = supabase.storage
                .from("ProfilePictures")
                .getPublicUrl(connectedUser.avatar_url);

              return (
                <UserConnections
                  key={connection.id}
                  connection={connection}
                  connectedUser={connectedUser}
                  publicUrl={avatar.data.publicUrl}
                  currentUser={userAuth?.id}
                />
              );
            })
          ) : (
            <div className="mt-10 text-center opacity-60">
              <p>Brak aktywnych połączeń.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const InviteUserModal = () => {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<any>([]);
  const [isSent, setIsSent] = useState(false);
  let [value, setValue] = useState("");
  const inviteCode = uuidv4();

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: TouchEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  const openModal = () => {
    setIsOpen(true);

    window.addEventListener("touchend", handleClickOutside);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUserInfo([]);
    setValue("");
    setError("");
  };

  const handleFindUser = async () => {
    if (value.length === 0) {
      setError("Enter the user invite code here");
      return;
    }
    value = value.trim();

    const { data: getUser, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("invite_code", value);

    if (userError || !getUser || getUser.length === 0) {
      setError("No user with this invitation ID");
      setUserInfo([]);
      return;
    }

    setError("");
    setUserInfo(getUser);
  };

  const handleSendInvitation = async () => {
    const { data: userAuth } = await supabase.auth.getUser();
    const user = userAuth.user?.id;
    if (!user) return <div>No user</div>;

    const { data: getUserProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("invite_code", value)
      .maybeSingle();

    if (userProfileError) {
      setError("No profile has been found");
    }

    const { error } = await supabase.from("invitations").insert({
      invite_code: inviteCode,
      from_user: user,
      to_user: getUserProfile.user_id,
    });

    if (error) {
      setError(error.message);
      setUserInfo(null);
      return;
    }

    setIsSent(true);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => {
          isOpen ? closeModal() : openModal();
        }}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        <BiPlusCircle size={24} />
        New Connection
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full rounded-t-3xl bg-white p-8 shadow-2xl"
              ref={modalRef}
            >
              <div className="mb-6 flex w-full items-center justify-between">
                <h2 className="text-center text-3xl font-semibold">
                  Find friends
                </h2>
                <button
                  onClick={() => closeModal()}
                  className="cursor-pointer rounded-xl border p-1"
                >
                  <IoMdClose size={28} />
                </button>
              </div>

              <div className="relative mb-6">
                <BiSearch
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                  size={24}
                />
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-lg transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Provide a unique user invite code"
                  onChange={(event) => setValue(event.target.value)}
                  value={value}
                  min={1}
                  required
                />
              </div>

              <button
                onClick={handleFindUser}
                className="w-full cursor-pointer rounded-2xl bg-slate-900 py-4 text-lg font-semibold text-white transition-all active:scale-95"
              >
                Search profile
              </button>

              <div className="mt-8">
                {error && (
                  <p className="rounded-xl bg-red-50 py-3 text-center text-red-500">
                    {error}
                  </p>
                )}
                {userInfo.map((user: any) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-center rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                          {user.avatar_url && (
                            <Image
                              src={
                                supabase.storage
                                  .from("ProfilePictures")
                                  .getPublicUrl(user.avatar_url).data.publicUrl
                              }
                              alt="Profile Picture"
                              width={48}
                              height={48}
                            />
                          )}
                        </div>
                        <p className="text-lg font-semibold">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                      <button
                        onClick={handleSendInvitation}
                        className={`rounded-xl px-6 py-2 font-medium transition-all ${isSent ? "bg-green-200 text-green-700" : "bg-blue-600 text-white"}`}
                      >
                        {isSent ? "Sent" : "Invite"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type UserSettingsProps = {
  getUserProfile: {
    first_name: string;
    last_name: string;
    user_id: string;
    invite_code: string;
  };
  publicUrl: string;
  userAuth: User | null;
  getInvites:
    | {
        from_user: string;
        id: string;
        invite_code: string;
        created_at: string;
        sender: {
          user_id: string;
          first_name: string;
          last_name: string;
          avatar_url: string;
        };
      }[]
    | null;
};

const UserSettings = ({
  getUserProfile,
  publicUrl,
  getInvites,
  userAuth,
}: UserSettingsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalOpen = searchParams.get("userSettings") === "open";

  const handleLogOutUser = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => router.push("/chat?userSettings=open")}
        className="rounded-full p-0.5 ring-2 ring-blue-100 transition-transform active:scale-90"
      >
        <Image
          src={publicUrl}
          alt="Avatar"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 1 }}
              exit={{ y: "100%" }}
              className="w-full rounded-t-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-4 size-24 overflow-hidden rounded-3xl shadow-xl">
                  <Image src={publicUrl} alt="Avatar" width={96} height={96} />
                </div>
                <h3 className="text-2xl font-bold">
                  {getUserProfile.first_name || "Użytkownik"}{" "}
                  {getUserProfile.last_name || ""}
                </h3>
                <span className="mt-2 rounded-full bg-slate-100 px-3 py-1 font-mono text-sm text-slate-500">
                  ID: {getUserProfile.invite_code || "Brak kodu"}
                </span>
              </div>

              <div className="space-y-3">
                <MenuLink
                  href="/chat/settings"
                  icon={<IoSettingsOutline size={24} />}
                  label="Settings"
                />
                <MenuLink
                  href="/chat/invitations"
                  icon={<IoMailOutline size={24} />}
                  label="Invites"
                />

                <button
                  onClick={handleLogOutUser}
                  className="flex w-full items-center gap-4 rounded-2xl bg-red-50 p-4 font-semibold text-red-500"
                >
                  <IoLogOutOutline size={24} />
                  <span>Log Out</span>
                </button>
              </div>
              <button
                onClick={() => router.push("/chat")}
                className="mt-6 w-full py-4 font-medium text-slate-400"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-slate-100 active:scale-95"
    >
      <div className="flex items-center gap-4 text-slate-700">
        <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
          {icon}
        </div>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <MdKeyboardArrowRight size={24} className="text-slate-400" />
    </Link>
  );
};
