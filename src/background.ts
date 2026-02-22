import basicBg from "@/assets/basic_paynow_background.png";
import enhancedBg from "@/assets/enhanced_icons_paynow_background.png";
import plainBg from "@/assets/plain_paynow_bg.png"

export type BackgroundOption = {
  id: string;
  label: string;
  src: string | null;
  recipientStyle: {
    color: string;
    textShadow?: string;
    background?: string;
  };
};

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: "none",
    label: "White Background",
    src: plainBg,
    recipientStyle: {
      color: "#000",
      background: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "basic",
    label: "Basic PayNow",
    src: basicBg,
    recipientStyle: {
      color: "#111",
      textShadow: "0 1px 2px rgba(255,255,255,0.6)",
    },
  },
  {
    id: "enhanced",
    label: "Enhanced Icons",
    src: enhancedBg,
    recipientStyle: {
      color: "#fff",
      textShadow: "0 2px 6px rgba(0,0,0,0.6)",
    },
  }
];