import {
  IconCat,
  IconTrophy,
  IconBook2,
  IconCamera,
  IconHandFingerRight,
  IconMessageDots,
  IconMail,
  IconTerminal,
} from "@tabler/icons-react";
import type { FormWindowItem } from "../../components/modals/draggableForm.modal";
import type { InteractiveItem } from "../../components/modals/draggableWindow.modal";

export const ITEMS: InteractiveItem[] = [
  {
    id: "footer",
    windowWidth: 720,
    label: "NAVIGATION",
    category: "SYS_NAV",
    icon: IconTerminal,
    tag: "NAVIGATION",
    content: {
      title: "SITE NAVIGATION",
      subtitle: "Global links and system status",
      description: "",
      highlights: [],
      details: [],
    },
  },
  {
    id: "pets",
    windowWidth: 560,
    label: "PETS",
    category: "SYS_BIO",
    icon: IconCat,
    tag: "CAT_V1.0",
    photo: {
      src: "/pictures/about/cat.jpg",
      alt: "Yellow blossoms framed by dark tree leaves.",
      caption: "FIELD NOTE 09 // CANOPY",
    },
    content: {
      title: "CAM",
      subtitle: "Full-time Snack Sneakers & Nap Specialists",
      description:
        "Engineered for high-frequency purring and automated keyboard sitting. Primary duties include monitoring code deployments and sleep the day away.",
      highlights: [
        "Senior Snack Inspector (Specializing in sensing fresh foods)",
        "Zero downtime nap scheduling",
        "Just don't let me touch. I fed you with my hands you little *****",
      ],
      details: [],
    },
  },
  {
    id: "awards",
    windowWidth: 680,
    label: "AWARDS & HONORS",
    category: "SYS_ACHIEVE",
    icon: IconTrophy,
    tag: "ACCOLADES",
    photo: {
      src: "/pictures/about/awards.jpg",
      alt: "City traffic passing beneath an overpass at sunset.",
      caption: "FIELD NOTE 03 // CONCRETE",
    },
    content: {
      title: "RECOGNITIONS & CERTIFICATIONS",
      subtitle: "Academic Excellence & Professional Milestones",
      description:
        "Consistently striving for engineering excellence, system architecture optimizations, and high-standard backend security standards.",
      highlights: [
        "SC-500 Microsoft Certified: Cloud and AI Security Engineer Associate",
        "Toshiba Software Development Vietnam Best Engineer of 2025",
        "Top University Graduate (First Class Honors)",
      ],
      details: [],
    },
  },
  {
    id: "story",
    windowWidth: 1180,
    label: "STORY",
    category: "SYS_STORY",
    icon: IconBook2,
    tag: "PERSONAL_ARCHIVE",
    content: {
      title: "PERSONAL STORY",
      subtitle: "User Story",
      description: "",
      highlights: [],
      details: [],
    },
  },
  {
    id: "techonology",
    windowWidth: 1180,
    windowHeight: "min(100dvh, 820px)",
    label: "TECHNOLOGY",
    category: "SYS_TECHNOLOGY",
    icon: IconBook2,
    tag: "PERSONAL_SKILLSETS",
    content: {
      title: "PERSONAL SKILLSETS",
      subtitle: "Interactive homepage archive",
      description: "",
      highlights: [],
      details: [],
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
  }
];
