import { AiOutlineFire } from "react-icons/ai";
import { BiDiamond, BiHeartCircle } from "react-icons/bi";
import {
  CiCloud,
  CiCoffeeCup,
  CiCompass1,
  CiHeart,
  CiLock,
  CiTimer,
  CiWavePulse1,
} from "react-icons/ci";
import { FaRegFaceKiss, FaRegGem } from "react-icons/fa6";
import { GiCardKingDiamonds, GiCelebrationFire } from "react-icons/gi";
import { IoDiamondOutline } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { RiFocus3Line } from "react-icons/ri";

export type ReactionsType = {
  [key: string]: {
    label: string | ((isMe: boolean, senderName?: string) => string);
    subText?: string | ((isMe: boolean) => string);
    bgColor: string;
    color: string;
    icon: IconType;
    isSuper: boolean;
    component?: string;
  };
};

export const REACTIONS: ReactionsType = {
  i_love_you: {
    label: "I Love You",
    subText: "A little piece of my heart",
    bgColor: "#d41111",
    color: "#eb3333",
    icon: CiHeart,
    isSuper: false,
  },
  i_miss_you: {
    label: "I Miss You",
    subText: "Wish you were right here",
    bgColor: "#1e40af",
    color: "#3b82f6",
    icon: CiTimer,
    isSuper: false,
  },
  thinking_about_you: {
    label: "I'm Thinking About You",
    subText: "You're wandering through my mind",
    bgColor: "#4c1d95",
    color: "#a78bfa",
    icon: CiWavePulse1,
    isSuper: false,
  },
  you_re_hot: {
    label: "You're Hot",
    subText: "Is it warm in here or is it just you?",
    bgColor: "#450a0a",
    color: "#f97316",
    icon: AiOutlineFire,
    isSuper: false,
  },
  kiss_me: {
    label: "Kiss Me",
    subText: "Sending a million smooches",
    bgColor: "#831843",
    color: "#f472b6",
    icon: FaRegFaceKiss,
    isSuper: false,
  },
  i_want_you: {
    label: "I Want You",
    subText: "More than just a thought",
    bgColor: "#111111",
    color: "#f59e0b",
    icon: RiFocus3Line,
    isSuper: false,
  },
  i_love_you_super: {
    label: (isMe: boolean, senderName?: string) =>
      isMe
        ? "You are my everything"
        : `${senderName || "Someone"} is deeply in love with you`,
    subText: (isMe: boolean) =>
      isMe
        ? "My heart beats only for you"
        : "They are sending you their whole heart",
    bgColor: "#F59E0B",
    color: "#FBBF24",
    icon: IoDiamondOutline,
    isSuper: true,
    component: "SuperILoveYouReaction",
  },
  i_miss_you_super: {
    label: (isMe: boolean, senderName?: string) =>
      isMe ? "I ache for you" : `${senderName || "Someone"} is longing for you`,
    subText: (isMe: boolean) =>
      isMe
        ? "My world stops when you're not here"
        : "They feel the distance in every heartbeat",
    bgColor: "#0C4A6E",
    color: "#0EA5E9",
    icon: CiCompass1,
    isSuper: true,
    component: "SuperIMissYouReaction",
  },
};
