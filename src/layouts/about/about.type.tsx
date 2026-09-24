import {
  IconCat,
  IconTrophy,
  IconClock,
  IconCamera,
  IconHandFingerRight,
  IconMessageDots,
  IconMail,
} from "@tabler/icons-react";
import type { FormWindowItem } from "../../components/modals/draggableForm.modal";
import type { InteractiveItem } from "../../components/modals/draggableWindow.modal";

export const ITEMS: InteractiveItem[] = [
  {
    id: "pets",
    label: "PETS",
    category: "SYS_BIO",
    icon: IconCat,
    tag: "CAT_V1.0",
    photo: {
      src: "/pictures/9.jpg",
      alt: "Yellow blossoms framed by dark tree leaves.",
      caption: "FIELD NOTE 09 // CANOPY",
    },
    content: {
      title: "BOBA & FELIX",
      subtitle: "Full-time Debugging Assistants & Nap Specialists",
      description:
        "Engineered for high-frequency purring and automated keyboard sitting. Primary duties include monitoring code deployments and enforcing mandatory screen breaks.",
      highlights: [
        "Senior Code Inspector (Specializing in Async Ops)",
        "Zero downtime nap scheduling",
        "High tolerance for Mechanical Keyboard noise",
      ],
      details: [],
    },
  },
  {
    id: "awards",
    label: "AWARDS & HONORS",
    category: "SYS_ACHIEVE",
    icon: IconTrophy,
    tag: "ACCOLADES",
    photo: {
      src: "/pictures/3.jpg",
      alt: "City traffic passing beneath an overpass at sunset.",
      caption: "FIELD NOTE 03 // CONCRETE",
    },
    content: {
      title: "RECOGNITIONS & CERTIFICATIONS",
      subtitle: "Academic Excellence & Professional Milestones",
      description:
        "Consistently striving for engineering excellence, system architecture optimizations, and high-standard backend security standards.",
      highlights: [
        "Top University Graduate (Honors)",
        "Software Engineering Innovation Award",
        "Certified OWASP Security & Automated Scan Specialist",
      ],
      details: [],
    },
  },
  {
    id: "watches",
    label: "HOBBY",
    category: "SYS_TIME",
    icon: IconClock,
    tag: "TIMEPIECES",
    photo: {
      src: "/pictures/2.jpg",
      alt: "Quiet water beneath a city bridge.",
      caption: "FIELD NOTE 02 // PASSING LIGHT",
    },
    content: {
      title: "MECHANICAL HOROLOGY",
      subtitle: "Analog Precision in a Digital Realm",
      description:
        "Fascinated by mechanical complications, automatic movements, and tactile engineering. Appreciates the architecture behind gear trains and escapements.",
      highlights: [
        "Automatic Movement Enthusiast (NH35 / ETA / Miyota)",
        "Tactical & Diver Tool Watches",
        "Sapphire Crystal & Custom Mod Assembly",
      ],
      details: [
        { key: "PREFERENCE", val: "AUTOMATIC / MECHANICAL" },
        { key: "DAILY_DRIVER", val: "SEIKO MOD 39MM" },
        { key: "TOLERANCE", val: "+5s/DAY DEV" },
      ],
    },
  },
  {
    id: "photography",
    label: "PHOTOGRAPHY",
    category: "SYS_OPTICS",
    icon: IconCamera,
    tag: "35MM_RAW",
    photo: {
      src: "/pictures/1.jpg",
      alt: "A solitary figure standing in the water before a distant skyline.",
      caption: "FIELD NOTE 01 // STILL WATER",
    },
    content: {
      title: "CYBER STREET & SHADOWS",
      subtitle: "High-Contrast Visual Log",
      description:
        "Capturing urban nocturnal landscapes, high-contrast monochrome architecture, neon reflections, and quiet moments in busy cities.",
      highlights: [
        "Street & Architectural Night Photography",
        "Color Grading: Dark Cyber Orange & High-Contrast B&W",
        "35mm & 50mm Prime Lens Framing",
      ],
      details: [
        { key: "GEAR", val: "MIRRORLESS + 35MM F1.4" },
        { key: "PALETTE", val: "NOIR / CYBER ORANGE" },
        { key: "EXPORT", val: "100% UNCOMPRESSED RAW" },
      ],
    },
  },
];

export const FORM_TYPES: FormWindowItem[] = [
  {
    id: "collaboration",
    title: "FORM // COLLABORATION_REQ",
    icon: IconHandFingerRight,
  },
  {
    id: "say-hi",
    title: "FORM // DIRECT_COMMUNICATION",
    icon: IconMessageDots,
  },
  {
    id: "email-me",
    title: "FORM // DIRECT_EMAIL_TERMINAL",
    icon: IconMail,
  },
];
