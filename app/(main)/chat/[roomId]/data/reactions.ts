import { AiOutlineFire } from "react-icons/ai";
import {
  CiCloud,
  CiCoffeeCup,
  CiHeart,
  CiLock,
  CiTimer,
  CiWavePulse1,
} from "react-icons/ci";
import { FaRegFaceKiss } from "react-icons/fa6";
import { GiCelebrationFire } from "react-icons/gi";
import { RiFocus3Line } from "react-icons/ri";

export const REACTIONS = {
  i_love_you: {
    label: "I Love You",
    subText: "A little piece of my heart",
    bgColor: "#d41111",
    color: "#eb3333",
    icon: CiHeart,
  },
  i_miss_you: {
    label: "I Miss You",
    subText: "Wish you were right here",
    bgColor: "#1e40af",
    color: "#3b82f6",
    icon: CiTimer,
  },
  thinking_about_you: {
    label: "I'm Thinking About You",
    subText: "You're wandering through my mind",
    bgColor: "#4c1d95",
    color: "#a78bfa",
    icon: CiWavePulse1,
  },
  you_re_hot: {
    label: "You're Hot",
    subText: "Is it warm in here or is it just you?",
    bgColor: "#450a0a",
    color: "#f97316",
    icon: AiOutlineFire,
  },
  kiss_me: {
    label: "Kiss Me",
    subText: "Sending a million smooches",
    bgColor: "#831843",
    color: "#f472b6",
    icon: FaRegFaceKiss,
  },
  i_want_you: {
    label: "I Want You",
    subText: "More than just a thought",
    bgColor: "#111111",
    color: "#f59e0b",
    icon: RiFocus3Line,
  },
};
