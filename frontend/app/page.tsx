"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  UserPlus,
  Search,
  Phone,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Printer,
  RefreshCw,
  Sparkles,
  Crown,
  Share2,
  FileText,
  Edit3,
  X,
  MapPin,
  Check,
  MessageCircle,
  BarChart3,
  GitFork,
  Play,
  Pause,
  ImageIcon,
  Maximize2,
  BookOpen,
  Calendar,
  Clock,
  Save
} from "lucide-react";

// Types
export interface FamilyMember {
  id: string;
  nameEn: string;
  nameBn: string;
  gender: "male" | "female";
  relation?: string;
  role?: string;
  generation: number;
  avatar?: string;
  avatarImg?: string;
  phone?: string;
  occupation?: string;
  location?: string;
  bio?: string;
  isCurrentUser?: boolean;
}

export interface FamilyBranch {
  id: string;
  parentNameEn: string;
  parentNameBn: string;
  role: string;
  generation: number;
  gender: "male" | "female";
  avatar?: string;
  avatarImg?: string;
  color?: string;
  phone?: string;
  location?: string;
  occupation?: string;
  bio?: string;
  childrenCount: number;
  children: FamilyMember[];
}

export interface FamilyTreeData {
  grandparents: {
    nana: FamilyMember;
    nanu: FamilyMember;
  };
  branches: FamilyBranch[];
}

// Default initial dataset
const INITIAL_DATA: FamilyTreeData = {
  grandparents: {
    nana: {
      id: "gen1-nana",
      nameEn: "Abdul Wahab Bishaws",
      nameBn: "আব্দুল ওহাব বিশ্বাস",
      role: "নানা (Grandfather / মূল কাণ্ডারী)",
      generation: 1,
      gender: "male",
      avatar: "👴",
      avatarImg: "/nana-avatar.png",
      bio: "বিশ্বাস পরিবারের শ্রদ্ধেয় ভিত্তিপ্রস্তর ও প্রিয় নানা।"
    },
    nanu: {
      id: "gen1-nanu",
      nameEn: "Ferejha Begum",
      nameBn: "ফেরেজা বেগম",
      role: "নানু (Grandmother / পরম স্নেহময়ী)",
      generation: 1,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/nanu-avatar.png",
      bio: "সবার পরম স্নেহময়ী ও শ্রদ্ধেয়া মাতামহী।"
    }
  },
  branches: [
    {
      id: "branch-1",
      parentNameEn: "Nilufa Begum",
      parentNameBn: "নিলুফা বেগম",
      role: "বড় মেয়ে (১ম কন্যা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "emerald",
      phone: "+8801700-111111",
      location: "বরিশাল / ঢাকা",
      childrenCount: 5,
      children: [
        { id: "b1-c1", nameEn: "Razia Begum", nameBn: "রাজিয়া বেগম", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-111112", occupation: "গৃহিণী / চাকুরিজীবী" },
        { id: "b1-c2", nameEn: "Mamun", nameBn: "মামুন", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/mamun-profile.png", phone: "+8801700-111113", occupation: "ব্যবসা" },
        { id: "b1-c3", nameEn: "Masum", nameBn: "মাসুম", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/masum-profile.png", phone: "+8801700-111114", occupation: "পেশাজীবী" },
        { id: "b1-c4", nameEn: "Maphiya", nameBn: "মাফিয়া", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-111115", occupation: "গৃহিণী" },
        { id: "b1-c5", nameEn: "Mafuz", nameBn: "মাহফুজ", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/mafuz-profile.png", phone: "+8801700-111116", occupation: "শিক্ষার্থী / পেশাজীবী" }
      ]
    },
    {
      id: "branch-2",
      parentNameEn: "Rahima Begum",
      parentNameBn: "রাহিমা বেগম",
      role: "মেজো মেয়ে (২য় কন্যা - কাওসারের আম্মা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "indigo",
      phone: "+8801700-222222",
      location: "ঢাকা, বাংলাদেশ",
      childrenCount: 4,
      children: [
        { id: "b2-c1", nameEn: "Ruhul Kuddus", nameBn: "রুহুল কুদ্দুস", gender: "male", relation: "বড় ভাই", generation: 3, avatar: "👨‍💼", avatarImg: "/kuddus-profile.jpg", phone: "+8801700-222223", occupation: "চাকুরীজীবী" },
        { id: "b2-c2", nameEn: "Kaiyum Zomadder", nameBn: "কাইয়ুম জোমাদ্দার", gender: "male", relation: "মেজো ভাই", generation: 3, avatar: "👨‍💼", avatarImg: "/kaiyum-profile.jpg", phone: "+8801700-222224", occupation: "ব্যবসা" },
        { id: "b2-c3", nameEn: "Kawsar", nameBn: "কাওসার", gender: "male", relation: "নিজের পরিবার (You)", generation: 3, avatar: "👨‍💻", avatarImg: "/kawsar-profile.jpg", phone: "+8801700-222225", occupation: "সফটওয়্যার ডেভেলপার", isCurrentUser: true },
        { id: "b2-c4", nameEn: "Nishat", nameBn: "নিশাত", gender: "female", relation: "ছোট বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-222226", occupation: "শিক্ষার্থী" }
      ]
    },
    {
      id: "branch-3",
      parentNameEn: "Shanu Begum",
      parentNameBn: "শানু বেগম",
      role: "৩য় মেয়ে (৩য় কন্যা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "rose",
      phone: "+8801700-333333",
      location: "বাংলাদেশ",
      childrenCount: 3,
      children: [
        { id: "b3-c1", nameEn: "Suzun", nameBn: "সুজন", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/suzun-profile.jpg", phone: "+8801700-333334", occupation: "পেশাজীবী" },
        { id: "b3-c2", nameEn: "Shawn", nameBn: "শাওন", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/shawn-profile.png", phone: "+8801700-333335", occupation: "চাকুরীজীবী" },
        { id: "b3-c3", nameEn: "Jannat", nameBn: "জান্নাত", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-333336", occupation: "শিক্ষার্থী" }
      ]
    },
    {
      id: "branch-4",
      parentNameEn: "Blue Begum",
      parentNameBn: "ব্লু বেগম (বিলু)",
      role: "৪র্থ মেয়ে (৪র্থ কন্যা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "cyan",
      phone: "+8801700-444444",
      location: "বাংলাদেশ",
      childrenCount: 2,
      children: [
        { id: "b4-c1", nameEn: "Hriday", nameBn: "হৃদয়", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/hriday-profile.png", phone: "+8801700-444445", occupation: "পেশাজীবী" },
        { id: "b4-c2", nameEn: "Readwon", nameBn: "রেদওয়ান", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/readwon-profile.png", phone: "+8801700-444446", occupation: "শিক্ষার্থী" }
      ]
    },
    {
      id: "branch-5",
      parentNameEn: "Md Abdul Wadud Khokon",
      parentNameBn: "খোকন বিশ্বাস",
      role: "একমাত্র ছেলে (৫ম সন্তান - বড় মামা)",
      generation: 2,
      gender: "male",
      avatar: "👨‍💼",
      color: "blue",
      phone: "+8801700-555555",
      location: "বাংলাদেশ",
      childrenCount: 3,
      children: [
        { id: "b5-c1", nameEn: "Apu", nameBn: "অপু", gender: "male", relation: "মামাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/apu-profile.jpg", phone: "+8801700-555556", occupation: "পেশাজীবী" },
        { id: "b5-c2", nameEn: "Nipu", nameBn: "নিপু", gender: "female", relation: "মামাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-555557", occupation: "শিক্ষার্থী" },
        { id: "b5-c3", nameEn: "Abdullah", nameBn: "আব্দুল্লাহ", gender: "male", relation: "মামাতো ভাই", generation: 3, avatar: "👦", avatarImg: "/abdullah-profile.jpg", phone: "+8801700-555558", occupation: "শিক্ষার্থী" }
      ]
    },
    {
      id: "branch-6",
      parentNameEn: "Mahmuda Begum",
      parentNameBn: "মাহমুদা বেগম",
      role: "৫ম মেয়ে (৬ষ্ঠ সন্তান - মেজো খালা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "teal",
      phone: "+8801700-666666",
      location: "বাংলাদেশ",
      childrenCount: 3,
      children: [
        { id: "b6-c1", nameEn: "Aman", nameBn: "আমান", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👨", avatarImg: "/aman-profile.png", phone: "+8801700-666667", occupation: "পেশাজীবী" },
        { id: "b6-c2", nameEn: "Marzan", nameBn: "মারজান", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-666668", occupation: "শিক্ষার্থী" },
        { id: "b6-c3", nameEn: "Maria", nameBn: "মারিয়া", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-666669", occupation: "শিক্ষার্থী" }
      ]
    },
    {
      id: "branch-7",
      parentNameEn: "Halima Begum",
      parentNameBn: "হালিমা বেগম",
      role: "ছোট মেয়ে (৭ম সন্তান - ছোট খালা)",
      generation: 2,
      gender: "female",
      avatar: "🧕",
      avatarImg: "/black-hijab.png",
      color: "purple",
      phone: "+8801700-777777",
      location: "বাংলাদেশ",
      childrenCount: 2,
      children: [
        { id: "b7-c1", nameEn: "Aha Moni", nameBn: "আহা মনি", gender: "female", relation: "খালাতো বোন", generation: 3, avatar: "🧕", avatarImg: "/female-avatar.png", phone: "+8801700-777778", occupation: "শিক্ষার্থী" },
        { id: "b7-c2", nameEn: "Addi", nameBn: "আদ্দি", gender: "male", relation: "খালাতো ভাই", generation: 3, avatar: "👦", avatarImg: "/addi-profile.png", phone: "+8801700-777779", occupation: "শিক্ষার্থী" }
      ]
    }
  ]
};


const RELATION_TRANSLATIONS: Record<string, string> = {
  "খালাতো ভাই": "Cousin (Brother)",
  "খালাতো বোন": "Cousin (Sister)",
  "মামাতো ভাই": "Maternal Cousin (Brother)",
  "মামাতো বোন": "Maternal Cousin (Sister)",
  "বড় ভাই": "Elder Brother",
  "মেজো ভাই": "Second Brother",
  "নিজের শাখা (You)": "Your Branch (You)",
  "নানা (Grandfather)": "Grandfather",
  "নানু (Grandmother)": "Grandmother",
  "নানা": "Grandfather",
  "নানু": "Grandmother",
  "পরিবারের সদস্য": "Family Member",
  "সদস্য": "Member"
};

const ROLE_TRANSLATIONS: Record<string, string> = {
  "১ম মেয়ে (বড় খালা)": "1st Daughter (Elder Aunt)",
  "২য় মেয়ে (আম্মা - মেজো খালা)": "2nd Daughter (Mother)",
  "সেজো মেয়ে (৩য় সন্তান - সেজো খালা)": "3rd Daughter (Middle Aunt)",
  "৪র্থ মেয়ে (৪র্থ সন্তান - ছোট খালা)": "4th Daughter (4th Aunt)",
  "একমাত্র ছেলে (৫ম সন্তান - একমাত্র মামা)": "Only Son (Maternal Uncle)",
  "৫ম মেয়ে (৬ষ্ঠ সন্তান - মেজো খালা)": "5th Daughter (5th Aunt)",
  "ছোট মেয়ে (৭ম সন্তান - ছোট খালা)": "Youngest Daughter (Youngest Aunt)"
};

const OCCUPATION_TRANSLATIONS: Record<string, string> = {
  "পেশাজীবী": "Professional",
  "শিক্ষার্থী": "Student",
  "সফটওয়্যার ডেভেলপার": "Software Developer",
  "সফটওয়্যার ইঞ্জিনিয়ার": "Software Engineer",
  "গৃহিণী": "Homemaker",
  "প্রবাসী": "Expatriate",
  "ব্যবসায়ী": "Businessman",
  "কর্মজীবী": "Job Holder",
  "তথ্য দেওয়া হয়নি": "Not Provided",
  "দেওয়া হয়নি": "Not Provided"
};

export default function FamilyTreePage() {
  const [familyData, setFamilyData] = useState<FamilyTreeData>(INITIAL_DATA);
  const [lang, setLang] = useState<"bn" | "en">("bn");

  const getRelation = (rel?: string) => {
    if (!rel) return lang === "en" ? "Member" : "সদস্য";
    return lang === "en" ? (RELATION_TRANSLATIONS[rel] || rel) : rel;
  };
  const getRole = (role?: string) => {
    if (!role) return "";
    return lang === "en" ? (ROLE_TRANSLATIONS[role] || role) : role;
  };
  const getOccupation = (occ?: string) => {
    if (!occ) return lang === "en" ? "Not Provided" : "তথ্য দেওয়া হয়নি";
    return lang === "en" ? (OCCUPATION_TRANSLATIONS[occ] || occ) : occ;
  };
  const [activeTab, setActiveTab] = useState<"tree" | "branches" | "directory" | "analytics">("tree");
  const [currentNav, setCurrentNav] = useState<"home" | "about" | "family" | "blog">("home");
  const [selectedBlogPost, setSelectedBlogPost] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all");
  const [selectedGenFilter, setSelectedGenFilter] = useState("all");
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    "branch-1": true,
    "branch-2": true,
    "branch-3": true,
    "branch-4": true,
    "branch-5": true,
    "branch-6": true,
    "branch-7": true
  });
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberEditForm, setMemberEditForm] = useState({
    nameBn: "",
    nameEn: "",
    occupation: "",
    phone: "",
    location: "",
    bio: ""
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollToSection = (sectionId: "home" | "about" | "family" | "blog") => {
    setCurrentNav(sectionId);
    if (sectionId === "family") {
      setActiveTab("tree");
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Real Family Quotes & Stories (বিশ্বাস পরিবারের অমলিন স্মৃতি ও কথামালা)
  const familyQuotes = [
    {
      id: "quote-mama",
      memberId: "branch-5",
      authorBn: "মোঃ আব্দুল ওয়াদুদ খোকন (একমাত্র মামা)",
      authorEn: "Md Abdul Wadud Khokon (Maternal Uncle)",
      branchBn: "৫ম শাখা • একমাত্র মামা",
      branchEn: "Branch 5 • Only Maternal Uncle",
      avatarImg: "/khokon-profile.jpg",
      quote: "জায়গা জমিন কোন বিষয় না তোমাদের সবাইকে খাসি খাওয়ার দাওয়াত রইলো কবে কোন সময় খাইবা আমাক জানাইও।",
      badge: "🍖 খাসির দাওয়াত ও মামার বিশাল মন",
      accentBg: "from-amber-950/40 via-slate-900 to-slate-900",
      accentBorder: "border-amber-500/40 hover:border-amber-400",
      quoteColor: "text-amber-400",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    {
      id: "quote-aman",
      memberId: "b6-c1",
      authorBn: "আমান (Aman)",
      authorEn: "Aman • Branch 6",
      branchBn: "৬ষ্ঠ শাখা • মাহমুদা বেগমের পুত্র",
      branchEn: "Branch 6 • Son of Mahmuda Begum",
      avatarImg: "/aman-profile.png",
      quote: "আমার একটা কথা মনে পরে সবাই নানা বাড়িতে বেরাতে গিয়েছে বর্ষা কালে রাস্তায় অনেক কাদা রাতে রান্না করবে চাল ছিলো না মামা রাতে যখন চাল নিয়ে বটুপিস আসছে আমাদের চাল আনতে যেতে বলছে কেউ যাইনি কিন্তু মামানি যেন কাকেনিয়ে যেয়ে সেই চাল কাদে করে এনে আমাদের বাত রান্না করে খাইয়েছেন আমাকে ডাকছে আমি ঘুমের বানধরে ছিলাম🤣।",
      badge: "🌧️ বর্ষার রাতে চালের বস্তা ও ঘুমের ভান 🤣",
      accentBg: "from-emerald-950/40 via-slate-900 to-slate-900",
      accentBorder: "border-emerald-500/40 hover:border-emerald-400",
      quoteColor: "text-emerald-400",
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
      id: "quote-hriday",
      memberId: "b4-c1",
      authorBn: "হৃদয় (Hriday)",
      authorEn: "Hriday • Branch 4",
      branchBn: "৪র্থ শাখা • ব্লু বেগমের পুত্র",
      branchEn: "Branch 4 • Son of Blue Begum",
      avatarImg: "/hriday-profile.png",
      quote: "মামা মামীর ঋণ ও আমরা সোদ করতে পারবো না।তারাও আমাদের অনেক স্নেহ এবং ভালোবাসা দিয়েছে",
      badge: "❤️ মামা-মামীর ঋণ ও পরম স্নেহ",
      accentBg: "from-rose-950/40 via-slate-900 to-slate-900",
      accentBorder: "border-rose-500/40 hover:border-rose-400",
      quoteColor: "text-rose-400",
      tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
    },
    {
      id: "quote-masum",
      memberId: "b1-c3",
      authorBn: "মাসুম (Masum)",
      authorEn: "Masum • Branch 1",
      branchBn: "১ম শাখা • নিলুফা বেগমের সুযোগ্য পুত্র",
      branchEn: "Branch 1 • Son of Nilufa Begum",
      avatarImg: "/masum-profile.png",
      quote: "আমার মা কে নিয়ে অনেকে অনেক কথা বলছে তাই সম্পতির কথাটা বলেছি আমার মাকে নিয়ে কেউ কোন কথা বলার আগে ১০০ বার বেবে বলতে হবে|",
      badge: "🛡️ মায়ের আত্মসম্মান ও অটুট ভালোবাসা",
      accentBg: "from-indigo-950/40 via-slate-900 to-slate-900",
      accentBorder: "border-indigo-500/40 hover:border-indigo-400",
      quoteColor: "text-indigo-400",
      tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    }
  ];

  // Blog Posts Data
  const blogPosts = [
    {
      id: 1,
      title: "আমাদের মূল শিকড়: নানা আব্দুল ওহাব বিশ্বাস ও নানু ফেরেজা বেগমের অমলিন স্মৃতি",
      author: "Md Kawsar Zomadder",
      date: "৮ অক্টোবর ২০২৬",
      readTime: "৪ মিনিট পাঠ",
      tag: "পারিবারিক স্মৃতি",
      summary: "যাঁদের স্নেহ ও ত্যাগের ওপর দাঁড়িয়ে আজ আমাদের সুবিশাল বিশ্বাস পরিবার, তাঁদের আদর্শ ও অমলিন স্মৃতিগাঁথা।",
      content: `আমাদের বিশ্বাস পরিবারের ভিত্তিপ্রস্তর স্থাপিত হয়েছিল শ্রদ্ধেয় নানা আব্দুল ওহাব বিশ্বাস এবং পরম স্নেহময়ী নানু ফেরেজা বেগমের অকৃত্রিম ভালোবাসা ও সততার মধ্য দিয়ে। তাঁদের ত্যাগ, পরিশ্রম এবং সন্তানদের সুশিক্ষায় বড় করার অক্লান্ত সাধনাই আজকের এই বিশাল পারিবারিক মহীরুহের মূল উৎস।\\n\\nনানা আব্দুল ওহাব বিশ্বাস ছিলেন একজন নীতিবান, গম্ভীর অথচ পরম স্নেহশীল অভিভাবক। তিনি সব সময় পরিবারকে একতাবদ্ধ রাখার শিক্ষা দিয়েছেন। অন্যদিকে নানু ফেরেজা বেগম ছিলেন ভালোবাসার শীতল ছায়া; যাঁর স্নেহের পরশে বড় হয়েছে তাঁর ৭ সন্তান ও ২২ জন নাতি-নাতনি।\\n\\nআজ আমরা ৩১ জন সদস্য নানা পেশা ও অবস্থানে ছড়িয়ে থাকলেও, তাঁদের শেখানো সততা, ঐক্য ও আত্মীয়তার বন্ধন আজও আমাদের হৃদয়ে অমলিন। তাঁদের প্রতি গভীর শ্রদ্ধা ও চিরন্তন দোয়া রইল।`,
      img: "/nana-nanu-couple.png"
    },
    {
      id: 2,
      title: "বিশ্বাস পরিবারের ঈদ পুনর্মিলনী ও বার্ষিক মিলনমেলা",
      author: "রুহুল কুদ্দুস (Branch 2)",
      date: "২৫ সেপ্টেম্বর ২০২৬",
      readTime: "৩ মিনিট পাঠ",
      tag: "পুনর্মিলনী",
      summary: "ঈদের আনন্দ আর নানাবাড়ির উঠোনে ভাই-বোন ও খালা-মামাদের হাসি-মুখর কোলাহলের স্মৃতিময় মুহূর্ত।",
      content: `প্রতি বছর ঈদের দিন মানেই আমাদের বিশ্বাস পরিবারের জন্য এক মহোৎসব। নানাবাড়িতে যখন সব খালা (নিলুফা, রাহিমা, শানু, ব্লু, মাহমুদা, হালিমা) ও একমাত্র মামা খোকন বিশ্বাস তাঁদের পরিবার নিয়ে হাজির হতেন, তখন চারপাশ মুখরিত হয়ে উঠত।\n\nরান্নাঘরের সুস্বাদু খাবারের সুবাস, ড্রয়িংরুমে বড়দের স্মৃতিচারণ, আর উঠোনে নাতি-নাতনিদের খুনসুটি—এই ছিল আমাদের চিরাচরিত ঈদ। ২২ জন খালাতো, মামাতো ও আপন ভাই-বোনের একসাথে খাওয়া-দাওয়া ও আড্ডা ছিল জীবনের শ্রেষ্ঠতম উপহার।\n\nসময়ের সাথে সাথে সবাই বড় হয়ে কর্মব্যস্ত হলেও সেই মিলনমেলার স্মৃতি আজও আমাদের সবাইকে কাছে টানে এবং ঐক্যবদ্ধ রাখে।`,
      img: "/family-cover.jpg"
    },
    {
      id: 3,
      title: "এক শিকড় থেকে সাত শাখা: আমাদের রক্তের অটুট বন্ধন",
      author: "পরিবারের উত্তরসূরি",
      date: "১৫ সেপ্টেম্বর ২০২৬",
      readTime: "৩ মিনিট পাঠ",
      tag: "আত্মীয়তা",
      summary: "নানা-নানুর ৭টি সন্তানের মধ্য দিয়ে কীভাবে গড়ে উঠেছে ৩ প্রজন্মের সুবিশাল ও ঐক্যবদ্ধ পরিবার।",
      content: `নানা ও নানুর সংসার থেকে ছড়িয়ে পড়েছে সাতটি শাখা। বড় মেয়ে নিলুফা বেগম (৫ সন্তান), মেজো মেয়ে রাহিমা বেগম (৪ সন্তান), সেজো মেয়ে শানু বেগম (৩ সন্তান), ৪র্থ মেয়ে ব্লু বেগম (২ সন্তান), একমাত্র ছেলে খোকন বিশ্বাস (৩ সন্তান), ৫ম মেয়ে মাহমুদা বেগম (৩ সন্তান), এবং ছোট মেয়ে হালিমা বেগম (২ সন্তান)।\n\nএই সাত শাখার মধ্য দিয়ে বিশ্বাস পরিবার আজ ৩১ সদস্যের এক বিশাল মিলনক্ষেত্র। ভাই-বোনদের মধ্যে এই গভীর আত্মিক টান আজও প্রমাণ করে যে রক্ত ও ভালোবাসার বন্ধন দূরত্বকে পরাজিত করতে পারে।`,
      img: "/black-hijab.png"
    },
    {
      id: 4,
      title: "ডিজিটাল প্ল্যাটফর্মে বিশ্বাস পরিবার: প্রযুক্তিতে আমাদের পারিবারিক ইতিহাস",
      author: "Md Kawsar Zomadder",
      date: "১০ অক্টোবর ২০২৬",
      readTime: "২ মিনিট পাঠ",
      tag: "ডিজিটাল ভল্ট",
      summary: "আগামীর প্রজন্মের জন্য পরিবারের শিকড়, সদস্য পরিচয় ও রক্তের সম্পর্ককে চিরস্থায়ী রূপ দেওয়ার ক্ষুদ্র প্রয়াস।",
      content: `কালের আবর্তে অনেক স্মৃতি হারিয়ে যায়, কিন্তু ডিজিটাল ভল্টে সংরক্ষিত ইতিহাস থেকে যায় চিরকাল। আমাদের পরবর্তী প্রজন্ম যাতে জানতে পারে তাঁদের শিকড় কোথায়, নানা-নানু কে ছিলেন, তাঁদের খালা-মামা ও আত্মীয়স্বজন কারা—এই ভাবনা থেকেই তৈরি হয়েছে 'বিশ্বাস হেরিটেজ' প্ল্যাটফর্ম।\n\nএখানে প্রতিটি সদস্যের নাম, সম্পর্ক, পদবী ও ছবি অত্যন্ত নিখুঁতভাবে সংরক্ষণ করা হয়েছে। এটি শুধু একটি সফটওয়্যার নয়, এটি আমাদের রক্তের বন্ধনের এক অমর দলিল।`,
      img: "/kawsar-profile.jpg"
    }
  ];

  // Hero Carousel Slider Data (Numbered 1 to 10 strictly according to user's marked list)
  const heroSlides = [
    {
      id: 1,
      img: "/nana-nanu-couple.png",
      titleBn: "আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগম — দাম্পত্য শ্রদ্ধা ও আশীর্বাদ",
      titleEn: "Abdul Wahab Bishaws & Ferejha Begum",
      badge: "👑 ১ম প্রজন্ম • দাম্পত্য শ্রদ্ধা ও আশীর্বাদ",
      story: "আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগম — যে মহান ভিত্তি ও দাম্পত্য স্নেহাশীর্বাদ থেকে আজ গড়ে উঠেছে ৩১ সদস্যের সুবিশাল বিশ্বাস পরিবার।",
      caption: "HERITAGE ROOTS • দাম্পত্য শ্রদ্ধা ও আশীর্বাদ",
      detail: "১ম প্রজন্ম (Gen 1) • প্রতিষ্ঠাতা পূর্বপুরুষ"
    },
    {
      id: 2,
      img: "/heritage-banner.jpg",
      titleBn: "বটবৃক্ষের ন্যায় সুবিশাল বংশলতিকা",
      titleEn: "3 Generations • 7 Branches • 22 Grandchildren",
      badge: "🌳 পারিবারিক মহীরুহ ও ঐতিহ্য",
      story: "প্রজন্ম থেকে প্রজন্মে ছড়িয়ে পড়া বিশ্বাস পরিবারের আত্মিক টান ও চিরন্তন ঐক্য।",
      caption: "GENERATIONS • সোনালী প্রজন্ম",
      detail: "৩১ জন সদস্য • ৩টি প্রজন্ম • ৭টি শাখা"
    },
    {
      id: 3,
      img: "/black-hijab.png",
      titleBn: "শ্রদ্ধেয়া ৬ বোন ও তাঁদের একমাত্র ভাই\n(নিলুফা, রহিমা, শানু, ব্লু, মাহমুদা, হালিমা ও মোঃ আব্দুল ওয়াদুদ খোকন)",
      titleEn: "Respected 6 Sisters & Their Only Brother\n(Nilufa, Rahima, Shanu, Blue, Mahmuda, Halima & Md Abdul Wadud Khokon)",
      badge: "🧕👨 ৬ বোন ও একমাত্র ভাই",
      story: "স্নেহের সুতোয় গাঁথা ৬ বোন আর তাঁদের কলিজার টুকরো একমাত্র ভাইয়ের এক অটুট বন্ধন। ভালোবাসা, মায়া আর শ্রদ্ধায় ঘেরা আমাদের প্রিয় পরিবার।",
      caption: "SIBLINGS • (নিলুফা, রহিমা, শানু, ব্লু, মাহমুদা, হালিমা ও মোঃ আব্দুল ওয়াদুদ খোকন)",
      detail: "২য় প্রজন্ম (Gen 2) • ৭ ভাই-বোন"
    },
    {
      id: 4,
      img: "/mamun-profile.png",
      titleBn: "মামুন, মাসুম ও মাহফুজ (১ম শাখা)",
      titleEn: "Mamun, Masum & Mafuz • Branch 1",
      badge: "👨 নিলুফা বেগমের সুযোগ্য পুত্রগণ",
      story: "বড় মেয়ে নিলুফা বেগমের তিন পুত্র — মামুন, মাসুম ও মাহফুজ। ৩য় প্রজন্মের শ্রদ্ধাভাজন ও দায়িত্বশীল ভাইগণ।",
      caption: "BROTHERS • বড় খালাতো ভাইগণ",
      detail: "৩য় প্রজন্ম (Gen 3) • নিলুফা বেগমের ১ম শাখা"
    },
    {
      id: 5,
      img: "/kuddus-profile.jpg",
      titleBn: "রুহুল কুদ্দুস (২য় শাখা)",
      titleEn: "Ruhul Kuddus • Branch 2 (Elder Brother)",
      badge: "👨‍💼 পরিবারের বড় ভাই",
      story: "মেজো মেয়ে রাহিমা বেগমের ১ম সন্তান। পরিবারের দায়িত্বশীল অগ্রজ ও অন্যতম অনুপ্রেরণা রুহুল কুদ্দুস ভাই।",
      caption: "BROTHER • স্নেহভাজন বড় ভাই",
      detail: "৩য় প্রজন্ম (Gen 3) • রাহিমা বেগমের ২য় শাখা"
    },
    {
      id: 6,
      img: "/suzun-profile.jpg",
      titleBn: "সুজন ও শাওন (৩য় শাখা)",
      titleEn: "Suzun & Shawn • Branch 3",
      badge: "👨 শানু বেগমের সুযোগ্য পুত্রদ্বয়",
      story: "সেজো মেয়ে শানু বেগমের দুই সন্তান — সুজন ও শাওন। পরিবারের অত্যন্ত স্নেহের ও কর্মঠ ভাইদ্বয়।",
      caption: "BROTHERS • সেজো খালাতো ভাইগণ",
      detail: "৩য় প্রজন্ম (Gen 3) • শানু বেগমের ৩য় শাখা"
    },
    {
      id: 7,
      img: "/hriday-profile.png",
      titleBn: "হৃদয় ও রেদওয়ান (৪র্থ শাখা)",
      titleEn: "Hriday & Readwon • Branch 4",
      badge: "👨 ব্লু বেগমের সুযোগ্য পুত্রদ্বয়",
      story: "৪র্থ মেয়ে ব্লু বেগমের (বিলু) দুই সন্তান — হৃদয় ও রেদওয়ান। ৩য় প্রজন্মের উদ্যমী ও কর্মঠ ভাইদ্বয়।",
      caption: "BROTHERS • ছোট খালাতো ভাইগণ",
      detail: "৩য় প্রজন্ম (Gen 3) • ব্লু বেগমের ৪র্থ শাখা"
    },
    {
      id: 8,
      img: "/khokon-profile.jpg",
      titleBn: "মোঃ আব্দুল ওয়াদুদ খোকন (৫ম শাখা - একমাত্র মামা)",
      titleEn: "Md Abdul Wadud Khokon • Branch 5 (Only Maternal Uncle)",
      badge: "👨 একমাত্র মামা • মোঃ আব্দুল ওয়াদুদ খোকন",
      story: "নানা আব্দুল ওহাব বিশ্বাস ও নানু ফেরেজা বেগমের একমাত্র পুত্রসন্তান মোঃ আব্দুল ওয়াদুদ খোকন। পরিবারের স্নেহের ও শ্রদ্ধার একমাত্র মামা।",
      caption: "UNCLE • একমাত্র মামা",
      detail: "২য় প্রজন্ম (Gen 2) • ৫ম শাখা (একমাত্র ছেলে)"
    },
    {
      id: 9,
      img: "/apu-profile.jpg",
      titleBn: "অপু ও আব্দুল্লাহ (৫ম শাখা)",
      titleEn: "Apu & Abdullah • Branch 5",
      badge: "👨 মোঃ আব্দুল ওয়াদুদ খোকনের সুযোগ্য পুত্রদ্বয়",
      story: "একমাত্র মামা মোঃ আব্দুল ওয়াদুদ খোকনের দুই পুত্র — অপু ও আব্দুল্লাহ। মামাতো ভাইগণ ও ৩য় প্রজন্মের সম্মানিত সদস্য।",
      caption: "BROTHERS • মামাতো ভাইগণ",
      detail: "৩য় প্রজন্ম (Gen 3) • ৫ম শাখা"
    },
    {
      id: 10,
      img: "/aman-profile.png",
      titleBn: "আমান (৬ষ্ঠ শাখা) ও আদ্দি (৭ম শাখা)",
      titleEn: "Aman & Addi • Branches 6 & 7",
      badge: "👨 ৩য় প্রজন্মের অনুজ ভাইদ্বয়",
      story: "৫ম মেয়ে মাহমুদা বেগমের পুত্র আমান এবং ছোট মেয়ে হালিমা বেগমের পুত্র আদ্দি। পরিবারের প্রিয় ও স্নেহভাজন সদস্য।",
      caption: "BROTHERS • খালাতো ভাইদ্বয়",
      detail: "৩য় প্রজন্ম (Gen 3) • মাহমুদা ও হালিমা বেগমের শাখা"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-slide effect (changes every 5 seconds)
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // New member form state
  const [newMemberForm, setNewMemberForm] = useState({
    branchId: "branch-2",
    nameEn: "",
    nameBn: "",
    gender: "male",
    relation: "খালাতো ভাই",
    phone: "",
    occupation: ""
  });

  // Check backend API connection
  const fetchFromApi = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/family");
      if (res.ok) {
        const json = await res.json();
        if (json.tree) {
          setFamilyData(json.tree);
          setApiOnline(true);
          showToast("🌿 Node.js ব্যাকএন্ড থেকে তাজা ডেটা সিঙ্ক করা হয়েছে!");
          return;
        }
      }
    } catch {
      // Backend not running, use local state seamlessly
      setApiOnline(false);
    }
  };

  useEffect(() => {
    fetchFromApi();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleBranch = (branchId: string) => {
    setExpandedBranches((prev) => ({ ...prev, [branchId]: !prev[branchId] }));
  };

  // Flatten all members for directory and analytics
  const getAllMembers = (): FamilyMember[] => {
    const list: FamilyMember[] = [
      familyData.grandparents.nana,
      familyData.grandparents.nanu
    ];

    familyData.branches.forEach((b) => {
      list.push({
        id: b.id,
        nameEn: b.parentNameEn,
        nameBn: b.parentNameBn,
        relation: b.role,
        generation: b.generation,
        gender: b.gender,
        avatar: b.avatar,
        avatarImg: b.avatarImg,
        phone: b.phone,
        location: b.location,
        occupation: b.occupation,
        bio: b.bio
      });
      b.children.forEach((c) => list.push(c));
    });

    return list;
  };

  const allMembers = getAllMembers();
  const totalGrandchildren = familyData.branches.reduce((acc, b) => acc + b.children.length, 0);
  const maleCount = allMembers.filter((m) => m.gender === "male").length;
  const femaleCount = allMembers.filter((m) => m.gender === "female").length;

  // Filter members for directory
  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameBn.includes(searchQuery) ||
      (m.relation && m.relation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGen = selectedGenFilter === "all" || m.generation.toString() === selectedGenFilter;
    const matchesGender = genderFilter === "all" || m.gender === genderFilter;
    return matchesSearch && matchesGen && matchesGender;
  });

  // Open member modal with fresh form data
  const openMemberModal = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsEditingMember(false);
    setMemberEditForm({
      nameBn: member.nameBn || "",
      nameEn: member.nameEn || "",
      occupation: member.occupation || "",
      phone: member.phone || "",
      location: member.location || "বাংলাদেশ",
      bio: member.bio || ""
    });
  };

  // Save edited member details
  const handleSaveMember = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMember) return;

    const updatedData: Partial<FamilyMember> = {
      nameBn: memberEditForm.nameBn.trim() || selectedMember.nameBn,
      nameEn: memberEditForm.nameEn.trim() || selectedMember.nameEn,
      occupation: memberEditForm.occupation.trim(),
      phone: memberEditForm.phone.trim(),
      location: memberEditForm.location.trim() || "বাংলাদেশ",
      bio: memberEditForm.bio.trim()
    };

    // 1. Update local state immediately
    const updatedSelected: FamilyMember = {
      ...selectedMember,
      ...updatedData
    };
    setSelectedMember(updatedSelected);

    setFamilyData((prev) => {
      // Check grandparents
      if (prev.grandparents.nana.id === selectedMember.id) {
        return {
          ...prev,
          grandparents: {
            ...prev.grandparents,
            nana: { ...prev.grandparents.nana, ...updatedData }
          }
        };
      }
      if (prev.grandparents.nanu.id === selectedMember.id) {
        return {
          ...prev,
          grandparents: {
            ...prev.grandparents,
            nanu: { ...prev.grandparents.nanu, ...updatedData }
          }
        };
      }
      // Check branches
      const newBranches = prev.branches.map((b) => {
        if (b.id === selectedMember.id) {
          return {
            ...b,
            parentNameBn: updatedData.nameBn || b.parentNameBn,
            parentNameEn: updatedData.nameEn || b.parentNameEn,
            phone: updatedData.phone ?? b.phone,
            location: updatedData.location ?? b.location,
            occupation: updatedData.occupation ?? b.occupation,
            bio: updatedData.bio ?? b.bio
          };
        }
        // Check children
        const newChildren = b.children.map((c) => {
          if (c.id === selectedMember.id) {
            return { ...c, ...updatedData };
          }
          return c;
        });
        return { ...b, children: newChildren };
      });
      return { ...prev, branches: newBranches };
    });

    // 2. Try sending to backend API
    try {
      await fetch(`http://localhost:5000/api/family/member/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
    } catch {
      // Offline fallback already updated local state
    }

    setIsEditingMember(false);
    showToast(`✅ ${updatedData.nameBn} এর তথ্য সফলভাবে সংরক্ষণ (SAVE) হয়েছে!`);
  };

  // Handle Add Member
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.nameEn || !newMemberForm.nameBn) {
      alert("দয়া করে ইংরেজি ও বাংলায় নাম লিখুন");
      return;
    }

    // Try posting to Node.js backend
    try {
      const res = await fetch("http://localhost:5000/api/family/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberForm)
      });
      if (res.ok) {
        const json = await res.json();
        showToast(json.message || "সদস্য সফলভাবে যুক্ত করা হয়েছে!");
        fetchFromApi();
        setIsAddModalOpen(false);
        return;
      }
    } catch {
      // Fallback: Add to local state
      console.log("Adding in local state");
    }

    // Local fallback update
    const updatedBranches = familyData.branches.map((b) => {
      if (b.id === newMemberForm.branchId) {
        const newChild: FamilyMember = {
          id: `b${b.id.replace("branch-", "")}-c${Date.now()}`,
          nameEn: newMemberForm.nameEn,
          nameBn: newMemberForm.nameBn,
          gender: newMemberForm.gender as "male" | "female",
          relation: newMemberForm.relation,
          generation: 3,
          avatar: newMemberForm.gender === "female" ? "👩" : "👨",
          phone: newMemberForm.phone,
          occupation: newMemberForm.occupation
        };
        return {
          ...b,
          childrenCount: b.children.length + 1,
          children: [...b.children, newChild]
        };
      }
      return b;
    });

    setFamilyData({ ...familyData, branches: updatedBranches });
    setIsAddModalOpen(false);
    showToast(`✅ ${newMemberForm.nameBn} সফলভাবে বংশলতিকায় যুক্ত হয়েছেন!`);
    setNewMemberForm({
      branchId: "branch-2",
      nameEn: "",
      nameBn: "",
      gender: "male",
      relation: "খালাতো ভাই",
      phone: "",
      occupation: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* ================= 1. TOP NAVBAR (REQUESTED MINIMALIST DESIGN) ================= */}
      <div className="bg-[#FAF4EC] text-[#2C241E] border-b border-[#E3D7C5] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <div 
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative bg-[#1D3E33] hover:bg-[#142B24] text-amber-200 px-3.5 sm:px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-md border-2 border-[#122820] transition-all transform group-hover:scale-105">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg sm:text-xl shadow-inner">
                🚐
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-[12px] font-black tracking-widest uppercase text-amber-300 font-mono leading-tight">
                  BISHAWS HERITAGE
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-emerald-200/90 tracking-wider">
                  বিশ্বাস পরিবার
                </span>
              </div>
            </div>
            
            <div className="hidden lg:block pl-2 border-l border-[#DACDBD]">
              <span className="text-[11px] font-bold text-[#6D5D50] block">{lang === "bn" ? "আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগম" : "Abdul Wahab Bishaws & Ferejha Begum"}</span>
              <span className="text-[10px] text-[#8F7D70]">{lang === "bn" ? "৩টি প্রজন্ম • ৩১ জন সদস্য" : "3 Generations • 31 Members"}</span>
            </div>
          </div>

          {/* Center: Home, About, Family, Blog */}
          <nav className="flex items-center gap-5 sm:gap-7 md:gap-9 text-xs sm:text-sm font-extrabold tracking-wide text-[#5B4E44]">
            <button
              onClick={() => scrollToSection("home")}
              className={`hover:text-[#1D3E33] transition-all pb-1.5 border-b-2 ${
                currentNav === "home" ? "text-[#1D3E33] border-[#1D3E33] font-black" : "border-transparent"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`hover:text-[#1D3E33] transition-all pb-1.5 border-b-2 ${
                currentNav === "about" ? "text-[#1D3E33] border-[#1D3E33] font-black" : "border-transparent"
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("family")}
              className={`hover:text-[#1D3E33] transition-all pb-1.5 border-b-2 ${
                currentNav === "family" ? "text-[#1D3E33] border-[#1D3E33] font-black" : "border-transparent"
              }`}
            >
              Family
            </button>
            <button
              onClick={() => scrollToSection("blog")}
              className={`hover:text-[#1D3E33] transition-all pb-1.5 border-b-2 ${
                currentNav === "blog" ? "text-[#1D3E33] border-[#1D3E33] font-black" : "border-transparent"
              }`}
            >
              Blog
            </button>
          </nav>

          {/* Right: "+ নতুন সদস্য যুক্ত করুন" + English / Bangla Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1D3E33] hover:bg-[#142B24] text-amber-300 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{lang === "bn" ? "নতুন সদস্য যুক্ত করুন" : "Add Member"}</span>
            </button>

            {/* Language Switcher: English / বাংলা */}
            <div className="flex items-center bg-[#EDE3D4] p-1 rounded-xl border border-[#DACDBD] shadow-inner select-none">
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-lg transition-all ${
                  lang === "bn"
                    ? "bg-[#1D3E33] text-amber-300 shadow-sm"
                    : "text-[#6D5D50] hover:text-[#2C241E]"
                }`}
                title="বাংলা সংস্করণ"
              >
                বাংলা
              </button>
              <span className="text-[#BBAEA0] text-xs px-0.5 font-bold">/</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-lg transition-all ${
                  lang === "en"
                    ? "bg-[#1D3E33] text-amber-300 shadow-sm"
                    : "text-[#6D5D50] hover:text-[#2C241E]"
                }`}
                title="English Version"
              >
                English
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. HERO SHOWCASE & CLICKER SLIDER ================= */}
      <header id="home" className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800 pt-6 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "bn" ? "বিশ্বাস পরিবার ডিজিটাল অ্যালবাম ও ইন্টারেক্টিভ স্লাইডার" : "Bishaws Family Digital Album & Interactive Showcase"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] text-emerald-400">
                  {apiOnline ? "Node.js API Connected" : "Local React Mode"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {lang === "bn" ? "আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগমের অমর উত্তরসূরি" : "Immortal Legacy of Abdul Wahab Bishaws & Ferejha Begum"}
              </h1>
            </div>

            {/* Slider Controls (Play/Pause & Counter) */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                title={isAutoPlay ? "স্লাইড পজ করুন" : "অটো-প্লে চালু করুন"}
              >
                {isAutoPlay ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === "bn" ? "অটো-স্লাইড অন" : "Auto-Slide On"}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === "bn" ? "প্লে করুন" : "Play"}</span>
                  </>
                )}
              </button>
              <span className="text-slate-500">|</span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {currentSlide + 1} / {heroSlides.length}
              </span>
            </div>
          </div>

          {/* Hero Slider Box (Image 2 style with dark offset frame shadow) */}
          <div className="relative group">
            
            {/* The Outer Offset Shadow (Exact match to Image 2 dark bottom-right offset border) */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/50 bg-slate-950 shadow-2xl transition-all">
              
              {/* Image Frame with Clicker */}
              <div 
                onClick={nextSlide}
                className="relative h-[380px] sm:h-[460px] md:h-[520px] w-full overflow-hidden cursor-pointer select-none"
                title="ক্লিক করে পরের ছবিতে যান (Click to Next Image)"
              >
                {/* Background ambient glow blur */}
                <img
                  src={heroSlides[currentSlide].img}
                  alt={lang === "bn" ? heroSlides[currentSlide].titleBn : heroSlides[currentSlide].titleEn}
                  className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-30 scale-110"
                />

                {/* Main Hero Photo */}
                <img
                  key={heroSlides[currentSlide].id}
                  src={heroSlides[currentSlide].img}
                  alt={heroSlides[currentSlide].titleBn}
                  className="relative z-10 w-full h-full object-contain sm:object-cover sm:object-center transition-all duration-700 ease-out transform group-hover:scale-[1.01]"
                />

                {/* Dark Vignette Overlay for Crisp Typography Contrast */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none"></div>

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold shadow-lg">
                    {heroSlides[currentSlide].badge}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-300 text-[11px] font-mono border border-white/20">
                    {heroSlides[currentSlide].detail}
                  </span>
                </div>

                {/* Centered Typography Overlay (Exact Match to Image 2 "Foster the Family FOREVER") */}
                <div className="absolute inset-0 z-25 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                  
                  {/* Big Elegant Title (like "Foster the Family") */}
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-serif">
                    The Bishaws Family
                  </h2>

                  {/* Rustic / Wooden Signboard Overlay (like the "FOREVER" board in Image 2) */}
                  <div className="mt-3 bg-stone-900/90 border-2 border-amber-600/60 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-md max-w-lg">
                    <p className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold">
                      {heroSlides[currentSlide].caption}
                    </p>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 whitespace-pre-line">
                      {lang === "bn" ? heroSlides[currentSlide].titleBn : heroSlides[currentSlide].titleEn}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                      {heroSlides[currentSlide].story}
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-amber-200/90 font-medium tracking-wide drop-shadow-md">
                    {lang === "bn" ? "আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগমের ৩টি প্রজন্ম • ৩১ জন সদস্য • ৭টি শাখা" : "Abdul Wahab Bishaws & Ferejha Begum • 3 Generations • 31 Members • 7 Branches"}
                  </p>
                </div>

                {/* Bottom Center Dots / Indicators (Exact Match to Image 2 circular dots) */}
                <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2.5 pointer-events-auto">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      className={`transition-all rounded-full ${
                        currentSlide === idx
                          ? "w-8 h-3 bg-amber-400 shadow-lg shadow-amber-400/50 ring-2 ring-white"
                          : "w-3 h-3 bg-white/60 hover:bg-white ring-1 ring-black/40"
                      }`}
                      title={`ছবি ${idx + 1}-এ যান: ${slide.titleBn}`}
                    />
                  ))}
                </div>

              </div>

              {/* CLICKER BUTTON 1: LEFT PREVIOUS ARROW CLICKER */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-35 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 group/btn"
                title="পূর্ববর্তী ছবি (Previous Image)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover/btn:text-amber-300" />
              </button>

              {/* CLICKER BUTTON 2: RIGHT NEXT ARROW CLICKER */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-35 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 group/btn"
                title="পরবর্তী ছবি (Next Image)"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover/btn:text-amber-300" />
              </button>

            </div>

            {/* CLICKER THUMBNAIL STRIP: 5 Clickable Image Cards Below */}
            <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 p-1 bg-slate-950 ${
                    currentSlide === idx
                      ? "border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-[1.03]"
                      : "border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100"
                  }`}
                  title={`ক্লিক করুন: ${slide.titleBn}`}
                >
                  <div className="h-14 sm:h-20 w-full overflow-hidden rounded-lg bg-slate-900">
                    <img
                      src={slide.img}
                      alt={slide.titleBn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-1 px-1 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold text-white truncate">
                      {slide.titleBn.split("(")[0]}
                    </span>
                    {currentSlide === idx && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Heritage Stat Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
            
            <div className="bg-slate-850/60 rounded-xl p-3.5 border border-slate-800 bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-400">{lang === "bn" ? "মূল ভিত্তি (১ম প্রজন্ম)" : "Founding Roots (Gen 1)"}</div>
              <div className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 flex items-center gap-1.5">
                <span>{lang === "bn" ? "নানা ও নানু" : "Grandparents"}</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">{lang === "bn" ? "২ জন" : "2 Members"}</span>
              </div>
            </div>

            <div className="bg-slate-850/60 rounded-xl p-3.5 border border-slate-800 bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-400">{lang === "bn" ? "সন্তানাদি (২য় প্রজন্ম)" : "Children (Gen 2)"}</div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span>{lang === "bn" ? "৭টি শাখা" : "7 Branches"}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">{lang === "bn" ? "৬ মেয়ে, ১ ছেলে" : "6 Daughters, 1 Son"}</span>
              </div>
            </div>

            <div className="bg-slate-850/60 rounded-xl p-3.5 border border-slate-800 bg-slate-800/40">
              <div className="text-[11px] font-medium text-slate-400">{lang === "bn" ? "নাতি-নাতনি (৩য় প্রজন্ম)" : "Grandchildren (Gen 3)"}</div>
              <div className="text-base sm:text-lg font-bold text-cyan-400 mt-0.5 flex items-center gap-1.5">
                <span>{totalGrandchildren} {lang === "bn" ? "জন" : "Members"}</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">{lang === "bn" ? "নাতি ও নাতনি" : "Grandchildren"}</span>
              </div>
            </div>

            <div className="bg-slate-850/60 rounded-xl p-3.5 border border-indigo-500/30 bg-indigo-950/20">
              <div className="text-[11px] font-medium text-indigo-300">{lang === "bn" ? "আপনার পরিচয়" : "Your Identity"}</div>
              <div className="text-sm sm:text-base font-bold text-indigo-400 mt-0.5 flex items-center gap-1.5 truncate">
                <span>{lang === "bn" ? "কান্না ও কাওসার" : "Kawsar Zomadder"}</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-1.5 py-0.5 rounded font-mono">You</span>
              </div>
            </div>

          </div>

          {/* VIEW SWITCHER TABS */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            <button
              onClick={() => setActiveTab("tree")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "tree"
                  ? "bg-slate-800/80 text-amber-400 border-amber-400"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30"
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>{lang === "bn" ? "🌳 বংশলতিকা চার্ট (Tree View)" : "🌳 Family Tree View"}</span>
            </button>

            <button
              onClick={() => setActiveTab("branches")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "branches"
                  ? "bg-slate-800/80 text-amber-400 border-amber-400"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{lang === "bn" ? "👥 শাখাভিত্তিক পরিবার কার্ড" : "👥 7 Branches Cards"}</span>
              <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-md font-mono">7</span>
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "directory"
                  ? "bg-slate-800/80 text-amber-400 border-amber-400"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{lang === "bn" ? "📖 সদস্য তালিকা ও ফোনবুক" : "📖 Member Directory"}</span>
              <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-md font-mono">{allMembers.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === "analytics"
                  ? "bg-slate-800/80 text-amber-400 border-amber-400"
                  : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{lang === "bn" ? "📊 পরিসংখ্যান ও বিশ্লেষণ" : "📊 Family Analytics"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= 3. ABOUT SECTION (REQUESTED NAV: "ABOUT") ================= */}
      <section id="about" className="bg-slate-950 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === "bn" ? "ঐতিহ্য ও ইতিহাস • About Bishaws Heritage" : "Heritage & History • About Bishaws Heritage"}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              {lang === "bn" ? "বিশ্বাস পরিবারের শিকড় ও গৌরবময় ঐতিহ্য" : "Roots & Glorious Heritage of Bishaws Family"}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              শ্রদ্ধেয় নানা <strong className="text-amber-300">আব্দুল ওহাব বিশ্বাস</strong> ও পরম স্নেহময়ী নানু <strong className="text-amber-300">ফেরেজা বেগম</strong> — এই মহান দুই পূর্বপুরুষের আদর্শ, ত্যাগ ও স্নেহে গড়ে উঠেছে ৩টি সোনালী প্রজন্ম, ৭টি বিস্তৃত শাখা এবং ৩১ জন সম্মানিত সদস্যের অটুট রক্তবন্ধন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="text-3xl mb-3">👑</div>
              <h3 className="text-lg font-bold text-white">{lang === "bn" ? "প্রতিষ্ঠাতা মূল শিকড় (The Roots)" : "Founding Roots (The Roots)"}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগমের দাম্পত্য শ্রদ্ধা ও ভালোবাসায় আমাদের পরিবারের ভিত্তি সূচিত হয়েছিল। তাঁদের সততা, আদর্শ এবং সন্তানদের প্রতি অকৃত্রিম স্নেহ প্রতিটি উত্তরসূরির আলোকবর্তিকা।
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="text-3xl mb-3">🌳</div>
              <h3 className="text-lg font-bold text-white">{lang === "bn" ? "এক শিকড়ে সাত শাখা (7 Branches)" : "7 Branches from 1 Root"}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                নিলুফা, রহিমা, শানু, ব্লু, খোকন, মাহমুদা এবং হালিমা — নানা ও নানুর এই ৭ সন্তানের মাধ্যমে পরিবারটি আজ ঢাকা ও বরিশালের বিভিন্ন প্রান্তে ছড়িয়ে পড়েছে, যেখানে রয়েছে ২২ জন সুযোগ্য নাতি ও নাতনি।
              </p>
            </div>

            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-400 transition-all">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-lg font-bold text-white">{lang === "bn" ? "ডিজিটাল ভল্ট ও ভবিষ্যৎ (Digital Vault)" : "Digital Vault & Future"}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                পরবর্তী প্রজন্মের জন্য পরিবারের প্রতিটি সদস্যের পরিচয়, রক্তের সম্পর্ক ও স্মৃতি চিরস্মরণীয় করে রাখতেই এই আধুনিক ডিজিটাল প্ল্যাটফর্ম গড়ে তোলা হয়েছে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FAMILY TREE & BRANCHES (REQUESTED NAV: "FAMILY") ================= */}
      <main id="family" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* Quick Gender Filter Bar */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              {lang === "bn" ? "লিঙ্গ ফিল্টার (Gender):" : "Gender Filter:"}
            </span>
            <button
              onClick={() => setGenderFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                genderFilter === "all"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {lang === "bn" ? `সকল (${allMembers.length})` : `All (${allMembers.length})`}
            </button>
            <button
              onClick={() => setGenderFilter("male")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                genderFilter === "male"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400"
                  : "bg-slate-800 text-blue-300 hover:bg-slate-700 border border-blue-500/20"
              }`}
            >
              <span>{lang === "bn" ? `👨 পুরুষ / ছেলে (${maleCount})` : `👨 Male (${maleCount})`}</span>
            </button>
            <button
              onClick={() => setGenderFilter("female")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                genderFilter === "female"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-400"
                  : "bg-slate-800 text-pink-300 hover:bg-slate-700 border border-pink-500/20"
              }`}
            >
              <span>{lang === "bn" ? `👩 মহিলা / মেয়ে (${femaleCount})` : `👩 Female (${femaleCount})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span><strong>{maleCount}</strong> {lang === "bn" ? "জন পুরুষ" : "Males"} ({Math.round((maleCount / allMembers.length) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span><strong>{femaleCount}</strong> {lang === "bn" ? "জন মহিলা" : "Females"} ({Math.round((femaleCount / allMembers.length) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* ----------------- TAB 1: VISUAL TREE VIEW ----------------- */}
        {activeTab === "tree" && (
          <div className="space-y-12">
            
            {/* LEVEL 1: GRANDPARENTS ROOT NODE */}
            <div className="flex flex-col items-center">
              <div className="relative group bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 text-center max-w-xl w-full shadow-2xl shadow-amber-500/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5 text-slate-950" />
                  <span>{lang === "bn" ? "মূল শিকড় ও কাণ্ডারী (Generation 1)" : "Founding Roots & Pillars (Generation 1)"}</span>
                </div>

                {/* Grandparents Portrait Artwork */}
                <div className="flex flex-col items-center mt-3 mb-5">
                  <div className="relative group/portrait">
                    <div className="w-52 h-32 sm:w-64 sm:h-38 rounded-2xl overflow-hidden border-4 border-amber-400 ring-8 ring-amber-500/20 shadow-2xl shadow-amber-500/30 transform group-hover/portrait:scale-105 transition-all duration-500 bg-slate-900">
                      <img
                        src="/nana-nanu-couple.png"
                        alt="আব্দুল ওহাব বিশ্বাস ও ফেরেজা বেগম — দাম্পত্য শ্রদ্ধা ও আশীর্বাদ"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-amber-300">
                      {lang === "bn" ? "দাম্পত্য শ্রদ্ধা ও আশীর্বাদ" : "Marital Honor & Blessings"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 mt-2">
                  
                  {/* Nana */}
                  <div
                    onClick={() => openMemberModal(familyData.grandparents.nana)}
                    className="cursor-pointer hover:scale-105 transition-transform text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 overflow-hidden flex items-center justify-center text-3xl mx-auto ring-4 ring-amber-500/30 shadow-lg">
                      {familyData.grandparents.nana.avatarImg ? (
                        <img src={familyData.grandparents.nana.avatarImg} alt={familyData.grandparents.nana.nameBn} className="w-full h-full object-cover" />
                      ) : (
                        "👴"
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-2">
                      {lang === "bn" ? familyData.grandparents.nana.nameBn : familyData.grandparents.nana.nameEn}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-mono">
                      {lang === "bn" ? familyData.grandparents.nana.nameEn : familyData.grandparents.nana.nameBn}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      {lang === "bn" ? "নানা (Grandfather)" : "Grandfather"}
                    </span>
                  </div>

                  {/* Heart / Union Icon */}
                  <div className="flex flex-col items-center">
                    <Heart className="w-7 h-7 text-rose-500 fill-rose-500/30 animate-pulse" />
                    <span className="text-[10px] text-slate-400 mt-1">{lang === "bn" ? "দাম্পত্য বন্ধন" : "Eternal Union"}</span>
                  </div>

                  {/* Nanu */}
                  <div
                    onClick={() => openMemberModal(familyData.grandparents.nanu)}
                    className="cursor-pointer hover:scale-105 transition-transform text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 overflow-hidden flex items-center justify-center text-3xl mx-auto ring-4 ring-amber-500/30 shadow-lg">
                      {familyData.grandparents.nanu.avatarImg ? (
                        <img src={familyData.grandparents.nanu.avatarImg} alt={familyData.grandparents.nanu.nameBn} className="w-full h-full object-cover" />
                      ) : (
                        "🧕"
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-2">
                      {lang === "bn" ? familyData.grandparents.nanu.nameBn : familyData.grandparents.nanu.nameEn}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-mono">
                      {lang === "bn" ? familyData.grandparents.nanu.nameEn : familyData.grandparents.nanu.nameBn}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      {lang === "bn" ? "নানু (Grandmother)" : "Grandmother"}
                    </span>
                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-amber-200/70 italic">
                  &ldquo;সবার শ্রদ্ধা ও ভালোবাসায় ঘেরা বিশ্বাস পরিবারের আলোকবর্তিকা&rdquo;
                </div>
              </div>

              {/* Vertical connector from Nana to branches */}
              <div className="w-0.5 h-10 bg-gradient-to-b from-amber-500 to-indigo-500"></div>
              <div className="w-full max-w-5xl h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500"></div>
            </div>

            {/* LEVEL 2 & 3: THE 7 BRANCHES & THEIR CHILDREN */}
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {lang === "bn" ? "২য় ও ৩য় প্রজন্ম: ৭টি কন্যা ও পুত্র শাখা (The 7 Branches & Grandchildren)" : "Generations 2 & 3: The 7 Branches & Grandchildren"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyData.branches.map((branch, index) => {
                  const isExpanded = expandedBranches[branch.id] ?? true;
                  const isKawsarBranch = branch.id === "branch-2";

                  // Color helper
                  const colorBorder = isKawsarBranch ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10" : "border-slate-800";

                  return (
                    <div
                      key={branch.id}
                      className={`bg-slate-850/80 rounded-2xl border ${colorBorder} p-5 shadow-xl transition-all duration-200 flex flex-col justify-between`}
                    >
                      {/* Branch Header */}
                      <div>
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                          
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openMemberModal({
                              id: branch.id,
                              nameEn: branch.parentNameEn,
                              nameBn: branch.parentNameBn,
                              relation: branch.role,
                              generation: branch.generation,
                              gender: branch.gender,
                              avatar: branch.avatar,
                              avatarImg: branch.avatarImg,
                              phone: branch.phone,
                              location: branch.location,
                              occupation: branch.occupation,
                              bio: branch.bio
                            })}
                            title="বিস্তারিত ও এডিট করতে ক্লিক করুন"
                          >
                            <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center text-2xl border border-slate-700 shrink-0">
                              {branch.avatarImg ? (
                                <img src={branch.avatarImg} alt={branch.parentNameBn} className="w-full h-full object-cover" />
                              ) : (
                                branch.avatar
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400 font-bold">#{index + 1}</span>
                                <h4 className="text-base font-extrabold text-white hover:text-amber-300 transition-colors">
                                  {lang === "bn" ? branch.parentNameBn : branch.parentNameEn}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-400 font-mono">{lang === "bn" ? branch.parentNameEn : branch.parentNameBn}</p>
                              <span className="inline-block text-[11px] font-semibold text-amber-300 mt-0.5">
                                {getRole(branch.role)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleBranch(branch.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Branch info pills */}
                        <div className="flex items-center justify-between text-xs text-slate-400 py-2.5">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span>{lang === "bn" ? "সন্তান সংখ্যা:" : "Children:"} <strong className="text-slate-200">{branch.children.length} {lang === "bn" ? "জন" : ""}</strong></span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{branch.location}</span>
                        </div>
                      </div>

                      {/* Branch Children (Generation 3) */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                            <span>{lang === "bn" ? "সন্তানাদি (৩য় প্রজন্ম - নাতি/নাতনি):" : "Grandchildren (Generation 3):"}</span>
                            <span>{branch.children.length}</span>
                          </div>

                          <div className="space-y-2">
                            {branch.children.map((child) => {
                              const isSelf = child.isCurrentUser;
                              const isDimmed = genderFilter !== "all" && child.gender !== genderFilter;
                              const isGenderHighlighted = genderFilter === child.gender;
                              
                              return (
                                <div
                                  key={child.id}
                                  onClick={() => openMemberModal(child)}
                                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                    isDimmed ? "opacity-30 grayscale" : ""
                                  } ${
                                    isSelf
                                      ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400"
                                      : isGenderHighlighted
                                      ? child.gender === "female"
                                        ? "bg-pink-950/20 border-pink-500/60 ring-1 ring-pink-500/30 text-white"
                                        : "bg-blue-950/20 border-blue-500/60 ring-1 ring-blue-500/30 text-white"
                                      : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200 hover:border-slate-600"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-slate-700/80 overflow-hidden flex items-center justify-center text-sm border border-slate-600/50">
                                      {child.avatarImg ? (
                                        <img src={child.avatarImg} alt={child.nameBn} className="w-full h-full object-cover" />
                                      ) : (
                                        child.avatar || (child.gender === "female" ? "👩" : "👨")
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold">{lang === "bn" ? child.nameBn : child.nameEn}</span>
                                        {isSelf && (
                                          <span className="text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.2 rounded uppercase">
                                            You
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono">
                                        {lang === "bn" ? child.nameEn : child.nameBn} • {getRelation(child.relation)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                        child.gender === "female"
                                          ? "bg-pink-500/10 text-pink-300 border-pink-500/30"
                                          : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                      }`}
                                    >
                                      {child.gender === "female" ? (lang === "bn" ? "👩 মেয়ে" : "👩 Daughter") : (lang === "bn" ? "👨 ছেলে" : "👨 Son")}
                                    </span>
                                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                                      {lang === "bn" ? "বিস্তারিত" : "Details"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setNewMemberForm((prev) => ({ ...prev, branchId: branch.id }));
                            setIsAddModalOpen(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          <span>+ সন্তান যোগ করুন</span>
                        </button>
                        <a
                          href={`tel:${branch.phone}`}
                          className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{lang === "bn" ? "কল করুন" : "Call"}</span>
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB 2: BRANCHES DIRECTORY ----------------- */}
        {activeTab === "branches" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">{lang === "bn" ? "৭টি পরিবারের পূর্ণাঙ্গ তালিকা (Family Branches)" : "Complete Directory of 7 Branches"}</h2>
                <p className="text-xs text-slate-400">{lang === "bn" ? "প্রতিটি শাখার সন্তান সংখ্যা, যোগাযোগের ফোন ও বিস্তারিত তথ্য" : "Children count, phone numbers, and details for each branch"}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400"
              >
                {lang === "bn" ? "+ নতুন সন্তান যোগ" : "+ Add New Child"}
              </button>
            </div>

            <div className="space-y-4">
              {familyData.branches.map((b, idx) => (
                <div key={b.id} className="bg-slate-850 rounded-xl p-5 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openMemberModal({
                        id: b.id,
                        nameEn: b.parentNameEn,
                        nameBn: b.parentNameBn,
                        relation: b.role,
                        generation: b.generation,
                        gender: b.gender,
                        avatar: b.avatar,
                        avatarImg: b.avatarImg,
                        phone: b.phone,
                        location: b.location,
                        occupation: b.occupation,
                        bio: b.bio
                      })}
                      title="বিস্তারিত ও এডিট করতে ক্লিক করুন"
                    >
                      <span className="w-9 h-9 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold text-sm">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span className="hover:text-amber-300 transition-colors">{lang === "bn" ? b.parentNameBn : b.parentNameEn}</span>
                          <span className="text-xs text-slate-400 font-mono font-normal">({lang === "bn" ? b.parentNameEn : b.parentNameBn})</span>
                          <span className="text-xs font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                            {getRole(b.role)}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">📞 {b.phone} | 📍 {b.location}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      {lang === "bn" ? "মোট সন্তান: " : "Total Children: "}<strong className="text-white text-sm">{b.children.length}</strong>{lang === "bn" ? " জন" : ""}
                    </div>
                  </div>

                  {/* Children Chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.children.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => openMemberModal(c)}
                        className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                          c.isCurrentUser
                            ? "bg-indigo-600 text-white border-indigo-400 font-bold"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                          {c.avatarImg ? (
                            <img src={c.avatarImg} alt={c.nameBn} className="w-full h-full object-cover" />
                          ) : (
                            c.avatar || "👤"
                          )}
                        </span>
                        <span>{lang === "bn" ? c.nameBn : c.nameEn}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({getRelation(c.relation)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: MEMBER DIRECTORY & PHONEBOOK ----------------- */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "bn" ? "নাম (Kawsar, মামুন), সম্পর্ক বা পেশা দিয়ে খুঁজুন..." : "Search by name, relation or occupation..."}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 text-slate-100 placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedGenFilter}
                  onChange={(e) => setSelectedGenFilter(e.target.value)}
                  className="p-2 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === "bn" ? "সকল প্রজন্ম (All Generations)" : "All Generations"}</option>
                  <option value="1">{lang === "bn" ? "প্রজন্ম ১ (নানা ও নানু)" : "Gen 1 (Grandparents)"}</option>
                  <option value="2">{lang === "bn" ? "প্রজন্ম ২ (খালা ও মামা)" : "Gen 2 (Aunts & Uncle)"}</option>
                  <option value="3">{lang === "bn" ? "প্রজন্ম ৩ (নাতি ও নাতনি)" : "Gen 3 (Grandchildren)"}</option>
                </select>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                >
                  + Add Member
                </button>
              </div>
            </div>

            {/* Table of Members */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">{lang === "bn" ? "সদস্যের নাম (বাংলা ও ইংরেজি)" : "Member Name"}</th>
                      <th className="py-3 px-4">{lang === "bn" ? "লিঙ্গ (Gender)" : "Gender"}</th>
                      <th className="py-3 px-4">{lang === "bn" ? "প্রজন্ম (Gen)" : "Generation"}</th>
                      <th className="py-3 px-4">{lang === "bn" ? "পারিবারিক সম্পর্ক" : "Family Relation"}</th>
                      <th className="py-3 px-4">{lang === "bn" ? "পেশা / বিবরণ" : "Occupation / Status"}</th>
                      <th className="py-3 px-4">{lang === "bn" ? "মোবাইল ফোন" : "Mobile Phone"}</th>
                      <th className="py-3 px-4 text-center">{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-base border border-slate-700 shrink-0">
                              {m.avatarImg ? (
                                <img src={m.avatarImg} alt={m.nameBn} className="w-full h-full object-cover" />
                              ) : (
                                m.avatar || (m.gender === "female" ? "👩" : "👨")
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{lang === "bn" ? m.nameBn : m.nameEn}</span>
                                {m.isCurrentUser && (
                                  <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">{lang === "bn" ? m.nameEn : m.nameBn}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              m.gender === "female"
                                ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            }`}
                          >
                            <span>{m.gender === "female" ? "👩" : "👨"}</span>
                            <span>{m.gender === "female" ? (lang === "bn" ? "মহিলা" : "Female") : (lang === "bn" ? "পুরুষ" : "Male")}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.generation === 1
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : m.generation === 2
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            }`}
                          >
                            Gen {m.generation}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-200">
                          {getRelation(m.relation)}
                        </td>

                        <td className="py-3 px-4 text-slate-400">
                          {getOccupation(m.occupation)}
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-300">
                          {m.phone || (lang === "bn" ? "ফোন নম্বর নেই" : "No Phone")}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openMemberModal(m)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] cursor-pointer"
                            >
                              প্রোফাইল
                            </button>
                            {m.phone && (
                              <a
                                href={`tel:${m.phone}`}
                                className="p-1 bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/50 rounded"
                                title="Call"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB 4: ANALYTICS & STATS ----------------- */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">{lang === "bn" ? "মোট নথিভুক্ত সদস্য" : "Total Registered Members"}</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-2">{allMembers.length} {lang === "bn" ? "জন" : "Members"}</div>
                <div className="text-xs text-slate-500 mt-1">{lang === "bn" ? "৩ প্রজন্মের সমৃদ্ধ পরিবার" : "Rich legacy across 3 generations"}</div>
              </div>

              <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">{lang === "bn" ? "৩য় প্রজন্ম (নাতি ও নাতনি)" : "Generation 3 (Grandchildren)"}</div>
                <div className="text-3xl font-extrabold text-cyan-400 mt-2">{totalGrandchildren} {lang === "bn" ? "জন" : "Members"}</div>
                <div className="text-xs text-slate-500 mt-1">{lang === "bn" ? "ভবিষ্যতের কান্ডারী" : "The future torchbearers"}</div>
              </div>

              <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">{lang === "bn" ? "কন্যা শাখা (খালাগণ)" : "Daughters Branches (Aunts)"}</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-2">{lang === "bn" ? "৬ টি শাখা" : "6 Branches"}</div>
                <div className="text-xs text-slate-500 mt-1">{lang === "bn" ? "নিলুফা, রহিমা, শানু, ব্লু, হালিমা ইত্যাদি" : "Nilufa, Rahima, Shanu, Blue, Mahmuda, Halima"}</div>
              </div>

              <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">{lang === "bn" ? "পুত্র শাখা (মামা)" : "Son Branch (Maternal Uncle)"}</div>
                <div className="text-3xl font-extrabold text-blue-400 mt-2">{lang === "bn" ? "১ টি মূল শাখা" : "1 Main Branch"}</div>
                <div className="text-xs text-slate-500 mt-1">{lang === "bn" ? "মোঃ আব্দুল ওয়াদুদ খোকন পরিবার" : "Md Abdul Wadud Khokon Family"}</div>
              </div>
            </div>

            {/* Branch size comparison bar chart */}
            <div className="bg-slate-850 p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {lang === "bn" ? "প্রতিটি শাখায় নাতি-নাতনির অনুপাত (Branch Distribution)" : "Grandchildren Distribution by Branch"}
              </h3>

              <div className="space-y-3">
                {familyData.branches.map((b) => {
                  const pct = Math.round((b.children.length / totalGrandchildren) * 100);
                  return (
                    <div key={b.id}>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                        <span>{lang === "bn" ? b.parentNameBn : b.parentNameEn} ({getRole(b.role).split("(")[0]})</span>
                        <span>{b.children.length} {lang === "bn" ? "জন সন্তান" : "Children"} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-3 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= 5. BLOG SECTION: বিশ্বাস পরিবারের অমলিন স্মৃতি ও কথামালা ================= */}
      <section id="blog" className="bg-slate-950 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "bn" ? "পারিবারিক স্মৃতিকথা ও কথামালা" : "Family Voices & Cherished Memories"}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                বিশ্বাস পরিবারের অমলিন স্মৃতি ও কথামালা
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {lang === "bn"
                  ? "নানা বাড়ির সোনালী স্মৃতি, মামা-ভাগ্নেদের খুনসুটি, খাসির দাওয়াত আর রক্তের গভীর ভালোবাসার অমর কথামালা।"
                  : "Authentic words, childhood memories at Nana's home, uncle-nephew love, and unbreakable bonds of the Bishaws family."}
              </p>
            </div>

            <div className="text-xs text-amber-400/90 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
              ✨ ৪টি স্মরণীয় কথামালা
            </div>
          </div>

          {/* ================= 4 REAL FAMILY QUOTES CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyQuotes.map((q) => (
              <div
                key={q.id}
                className={`relative bg-gradient-to-br ${q.accentBg} rounded-2xl border ${q.accentBorder} p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group overflow-hidden`}
              >
                {/* Decorative background watermark quote mark */}
                <span className="absolute -top-3 -right-2 text-7xl font-serif text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                  “
                </span>

                <div>
                  {/* Top Badge & Branch info */}
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${q.tagColor}`}>
                      {q.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                      {lang === "bn" ? q.branchBn : q.branchEn}
                    </span>
                  </div>

                  {/* Main Quote Text */}
                  <div className="my-3 relative">
                    <span className={`text-2xl font-serif leading-none mr-1.5 ${q.quoteColor}`}>“</span>
                    <p className="inline text-sm sm:text-base font-medium text-slate-100 leading-relaxed tracking-normal font-sans">
                      {q.quote}
                    </p>
                    <span className={`text-2xl font-serif leading-none ml-1.5 ${q.quoteColor}`}>”</span>
                  </div>
                </div>

                {/* Author footer */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-md shrink-0 bg-slate-800 flex items-center justify-center">
                      <img src={q.avatarImg} alt={q.authorBn} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {lang === "bn" ? q.authorBn : q.authorEn}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {lang === "bn" ? q.branchBn : q.branchEn}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const member = allMembers.find(m => m.id === q.memberId);
                      if (member) openMemberModal(member);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 border border-slate-800 transition-colors cursor-pointer shrink-0"
                    title="প্রোফাইল দেখুন"
                  >
                    <span>প্রোফাইল</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subheading for long-form blog articles */}
          <div className="pt-4 border-t border-slate-850">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {lang === "bn" ? "পারিবারিক ইতিহাস ও স্মৃতিচারণমূলক প্রবন্ধ" : "Family Heritage Chronicles & Articles"}
              </h3>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedBlogPost(post)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {post.tag}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                      ✍️ {post.author}
                    </span>
                    <span className="text-amber-400 font-bold group-hover:underline">
                      {lang === "bn" ? "পড়ুন →" : "Read →"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODAL: BLOG POST FULL READER ================= */}
      {selectedBlogPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {selectedBlogPost.tag}
              </span>
              <button
                onClick={() => setSelectedBlogPost(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="h-60 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  src={selectedBlogPost.img}
                  alt={selectedBlogPost.title}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mb-1">
                  <span>📅 {selectedBlogPost.date}</span>
                  <span>•</span>
                  <span>⏱️ {selectedBlogPost.readTime}</span>
                  <span>•</span>
                  <span>✍️ {selectedBlogPost.author}</span>
                </div>
                <h2 className="text-xl font-black text-white">{selectedBlogPost.title}</h2>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-800/80 pt-4">
                {selectedBlogPost.content}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedBlogPost(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MEMBER DETAILS & EDIT ================= */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {isEditingMember
                    ? (lang === "bn" ? "✏️ তথ্য পরিবর্তন (Edit Profile)" : "✏️ Edit Profile")
                    : (lang === "bn" ? "পারিবারিক পরিচিতি কার্ড" : "Family Profile Card")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingMember && (
                  <button
                    type="button"
                    onClick={() => setIsEditingMember(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="তথ্য এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "এডিট" : "Edit"}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setIsEditingMember(false);
                  }}
                  className="text-slate-400 hover:text-white text-lg font-bold px-1.5 leading-none transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto pr-1 flex-1 py-2">
              {!isEditingMember ? (
                /* ================= VIEW MODE ================= */
                <div>
                  <div className="mt-3 text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-amber-500/50 overflow-hidden flex items-center justify-center text-5xl mx-auto shadow-xl ring-4 ring-amber-500/10">
                      {selectedMember.avatarImg ? (
                        <img src={selectedMember.avatarImg} alt={selectedMember.nameBn} className="w-full h-full object-cover" />
                      ) : (
                        selectedMember.avatar || (selectedMember.gender === "female" ? "👩" : "👨")
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mt-3">{lang === "bn" ? selectedMember.nameBn : selectedMember.nameEn}</h3>
                    <p className="text-xs text-slate-400 font-mono">{lang === "bn" ? selectedMember.nameEn : selectedMember.nameBn}</p>
                    
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
                      <span>{getRelation(selectedMember.relation || selectedMember.role)}</span>
                      <span>• Gen {selectedMember.generation}</span>
                    </div>
                  </div>

                  <div className="mt-5 bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-400/80" />
                        <span>{lang === "bn" ? "পেশা (Occupation):" : "Occupation:"}</span>
                      </span>
                      <span className="font-semibold text-white">{getOccupation(selectedMember.occupation)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400/80" />
                        <span>{lang === "bn" ? "মোবাইল ফোন:" : "Mobile Phone:"}</span>
                      </span>
                      <span className="font-mono font-semibold text-white">{selectedMember.phone || (lang === "bn" ? "দেওয়া হয়নি" : "Not Provided")}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400/80" />
                        <span>{lang === "bn" ? "বর্তমান অবস্থান (Location):" : "Location:"}</span>
                      </span>
                      <span className="font-semibold text-white">{selectedMember.location || (lang === "bn" ? "বাংলাদেশ" : "Bangladesh")}</span>
                    </div>
                    
                    <div className="pt-2.5 border-t border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
                        <FileText className="w-3.5 h-3.5 text-amber-400/80" />
                        <span>{lang === "bn" ? "বিস্তারিত তথ্য (Details):" : "Details:"}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {selectedMember.bio || (lang === "bn" ? "পরিবারের সম্মানিত সদস্য।" : "Honored family member.")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= EDIT MODE ================= */
                <form id="member-edit-form" onSubmit={handleSaveMember} className="mt-2 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">
                        {lang === "bn" ? "নাম (বাংলা) *" : "Name (Bengali) *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={memberEditForm.nameBn}
                        onChange={(e) => setMemberEditForm({ ...memberEditForm, nameBn: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">
                        {lang === "bn" ? "Name (English) *" : "Name (English) *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={memberEditForm.nameEn}
                        onChange={(e) => setMemberEditForm({ ...memberEditForm, nameEn: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">
                        {lang === "bn" ? "পেশা (Occupation)" : "Occupation"}
                      </label>
                      <input
                        type="text"
                        value={memberEditForm.occupation}
                        onChange={(e) => setMemberEditForm({ ...memberEditForm, occupation: e.target.value })}
                        placeholder="যেমন: শিক্ষার্থী, প্রকৌশলী..."
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">
                        {lang === "bn" ? "মোবাইল ফোন" : "Mobile Phone"}
                      </label>
                      <input
                        type="text"
                        value={memberEditForm.phone}
                        onChange={(e) => setMemberEditForm({ ...memberEditForm, phone: e.target.value })}
                        placeholder="+8801..."
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location field */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{lang === "bn" ? "বর্তমান অবস্থান (Location / জেলা / দেশ)" : "Location"}</span>
                    </label>
                    <input
                      type="text"
                      value={memberEditForm.location}
                      onChange={(e) => setMemberEditForm({ ...memberEditForm, location: e.target.value })}
                      placeholder="যেমন: ঢাকা, খুলনা, বরিশাল, প্রবাস..."
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none transition-colors"
                    />
                  </div>

                  {/* Details / Bio field */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === "bn" ? "বিস্তারিত তথ্য (Details / বিবরণ / ভূমিকা)" : "Details / Bio"}</span>
                    </label>
                    <textarea
                      rows={3}
                      value={memberEditForm.bio}
                      onChange={(e) => setMemberEditForm({ ...memberEditForm, bio: e.target.value })}
                      placeholder="সদস্য সম্পর্কে বিস্তারিত তথ্য, শিক্ষাগত যোগ্যতা, ভূমিকা বা স্মৃতি..."
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-lg p-2.5 text-white outline-none transition-colors resize-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0 flex-wrap">
              {!isEditingMember ? (
                <>
                  {selectedMember.phone && (
                    <a
                      href={`tel:${selectedMember.phone}`}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "কল দিন" : "Call"}</span>
                    </a>
                  )}
                  <button
                    onClick={() => setIsEditingMember(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "এডিট করুন" : "Edit Profile"}</span>
                  </button>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {lang === "bn" ? "বন্ধ করুন" : "Close"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingMember(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    form="member-edit-form"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === "bn" ? "SAVE (সংরক্ষণ করুন)" : "SAVE"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW MEMBER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">{lang === "bn" ? "নতুন সদস্য যুক্ত করুন" : "Add New Family Member"}</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="mt-4 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-300 mb-1">{lang === "bn" ? "কোন শাখার সন্তান? (Select Branch) *" : "Which Branch? (Select Branch) *"}</label>
                <select
                  value={newMemberForm.branchId}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, branchId: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                >
                  {familyData.branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {lang === "bn" ? b.parentNameBn : b.parentNameEn} - {getRole(b.role)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "সদস্যের নাম (বাংলা) *" : "Name in Bengali *"}</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রাফিদ হাসান"
                    value={newMemberForm.nameBn}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nameBn: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "Name (English) *" : "Name (English) *"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rafid Hasan"
                    value={newMemberForm.nameEn}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "লিঙ্গ (Gender)" : "Gender"}</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="male">{lang === "bn" ? "ছেলে (Male)" : "Male"}</option>
                    <option value="female">{lang === "bn" ? "মেয়ে (Female)" : "Female"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "পারিবারিক সম্পর্ক" : "Family Relation"}</label>
                  <input
                    type="text"
                    placeholder="যেমন: খালাতো ভাই / ভাগ্নে"
                    value={newMemberForm.relation}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relation: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "মোবাইল নম্বর" : "Mobile Phone"}</label>
                  <input
                    type="tel"
                    placeholder="+8801700-000000"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{lang === "bn" ? "পেশা (Occupation)" : "Occupation"}</label>
                  <input
                    type="text"
                    placeholder="যেমন: শিক্ষার্থী / সফটওয়্যার ইঞ্জিনিয়ার"
                    value={newMemberForm.occupation}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, occupation: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
                >
                  {lang === "bn" ? "সংরক্ষণ করুন (Save Member)" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-amber-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= RICH HERITAGE FOOTER ================= */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto pt-14 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-850">
            
            {/* Col 1: Family Identity & Roots */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
                  🌳
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-wide">
                    {lang === "bn" ? "বিশ্বাস পরিবার" : "Bishaws Family"}
                  </h3>
                  <p className="text-[11px] text-amber-400/90 font-medium">
                    {lang === "bn" ? "ঐতিহ্য ও ডিজিটাল বংশলতিকা" : "Heritage & Digital Genealogy"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "শ্রদ্ধেয় নানা আব্দুল ওহাব বিশ্বাস ও পরম স্নেহময়ী নানু ফেরেজা বেগমের মহান ত্যাগ ও স্নেহাশীর্বাদে গড়ে ওঠা ৩১ সদস্যের এক অটুট আত্মিক বন্ধন।"
                  : "A united family bond of 31 members across 3 generations, rooted in the legacy of Abdul Wahab Bishaws & Ferejha Begum."}
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">৩ প্রজন্ম</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">৭ শাখা</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">৩১ সদস্য</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "দ্রুত নেভিগেশন" : "Quick Navigation"}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>🏠</span>
                    <span>{lang === "bn" ? "নীড়পাতা (Home)" : "Home"}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>📜</span>
                    <span>{lang === "bn" ? "পরিবারের ইতিহাস ও শিকড়" : "Family Roots & Heritage"}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("family");
                      setActiveTab("tree");
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>🌳</span>
                    <span>{lang === "bn" ? "মূল বংশলতিকা (Tree View)" : "Interactive Family Tree"}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("family");
                      setActiveTab("branches");
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>🌿</span>
                    <span>{lang === "bn" ? "৭টি শাখা ডিরেক্টরি (Branches)" : "7 Branches Directory"}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("family");
                      setActiveTab("directory");
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>👥</span>
                    <span>{lang === "bn" ? "সদস্য তালিকা ও ফোনবুক" : "Member Directory"}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("blog")}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>📖</span>
                    <span>{lang === "bn" ? "স্মৃতি ও পারিবারিক ব্লগ" : "Memories & Blog"}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: 7 Branches Overview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "৭টি মূল পরিবার শাখা" : "7 Family Branches"}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>১. নিলুফা বেগম</span>
                  <span className="text-[10px] text-slate-400 font-mono">৫ সন্তান</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span className="text-amber-300 font-semibold">২. রাহিমা বেগম (আম্মা)</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">৪ সন্তান</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>৩. শানু বেগম</span>
                  <span className="text-[10px] text-slate-400 font-mono">৩ সন্তান</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>৪. ব্লু বেগম (বিলু)</span>
                  <span className="text-[10px] text-slate-400 font-mono">২ সন্তান</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>৫. মোঃ আব্দুল ওয়াদুদ খোকন</span>
                  <span className="text-[10px] text-slate-400 font-mono">৩ সন্তান</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>৬. মাহমুদা বেগম</span>
                  <span className="text-[10px] text-slate-400 font-mono">৩ সন্তান</span>
                </li>
                <li className="flex items-center justify-between pb-1">
                  <span>৭. হালিমা বেগম</span>
                  <span className="text-[10px] text-slate-400 font-mono">২ সন্তান</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Platform & Developer Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "উদ্যোগ ও প্রযুক্তি" : "Initiative & Tech"}</span>
              </h4>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{lang === "bn" ? "পরিকল্পনা ও কারিগর:" : "Curator & Architect:"}</span>
                  <strong className="text-white font-semibold">Md Kawsar Zomadder</strong>
                  <span className="block text-[11px] text-amber-300/80 font-mono">২য় শাখা • সফটওয়্যার ডেভেলপার</span>
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>ঢাকা / বরিশাল / খুলনা, বাংলাদেশ</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Next.js 15 • Tailwind • Express REST API</span>
                  </p>
                </div>
              </div>

              {/* Back to top button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronUp className="w-4 h-4 text-amber-400" />
                <span>{lang === "bn" ? "পৃষ্ঠার শুরুতে যান (Scroll to Top)" : "Back to Top"}</span>
              </button>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Dedication */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span>© ২০২৬</span>
              <strong className="text-slate-200">{lang === "bn" ? "বিশ্বাস পরিবার ঐতিহ্য আর্কাইভ" : "Bishaws Family Heritage Archive"}</strong>
              <span>• সর্বস্বত্ব সংরক্ষিত</span>
            </div>

            <div className="flex items-center gap-1.5 text-center sm:text-right text-[11px] text-slate-400">
              <span>পরম শ্রদ্ধায় উৎসর্গীকৃত:</span>
              <span className="text-amber-400 font-medium">নানা আব্দুল ওহাব বিশ্বাস ও নানু ফেরেজা বেগম</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block ml-1 animate-pulse" />
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
