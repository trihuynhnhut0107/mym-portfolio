export interface SkillSectionConfig {
  title: string;
  description: string;
}

export interface SkillSlotItem {
  id: number;
  title?: string;
  type?: "image" | "video" | "youtube" | "ongoing";
  mediaUrl?: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  isOngoing?: boolean;
  aspectRatio?: "16/9" | "9/16" | "1/1" | "4/3" | "2/1";
}

export interface SkillModalData {
  id: string; // e.g. 'srv-content', 'srv-graphic', 'srv-video', 'srv-livestream'
  title: string;
  prevSkillId: string;
  nextSkillId: string;
  section1: SkillSectionConfig;
  section2: SkillSectionConfig;
  section3: SkillSectionConfig;
  section4: SkillSectionConfig;
  slots?: Record<number, SkillSlotItem>;
}

export const SKILLS_MODAL_DATA: Record<string, SkillModalData> = {
  "srv-content": {
    id: "srv-content",
    title: "Content Creator",
    prevSkillId: "srv-livestream",
    nextSkillId: "srv-graphic",
    section1: {
      title: "Football In-depth Analysis",
      description:
        "Proven expertise in deconstructing complex tactical systems, match dynamics, and individual player roles into accessible, compelling visual narratives using custom tactical boards, data-backed insights, and clear analytical framing.",
    },
    section2: {
      title: "Documentary",
      description:
        "Skilled in long-form, retrospective storytelling centered on nostalgic sports history, iconic eras, human stories, and film analysis that forge deep emotional connections with viewers.",
    },
    section3: {
      title: "Trending Content",
      description:
        "Adept at identifying viral trends, real-time sports discussions, and hot topics, translating them rapidly into high-engagement formats with witty angles and accessible humor.",
    },
    section4: {
      title: "English Content",
      description:
        "Proficient in extracting, analyzing, and synthesizing international media, technical research, and global analytical sources into seamless bilingual or English-ready media tailored to global digital standards.",
    },
    slots: {
      1: {
        id: 1,
        title: "Wesley Fofana In-depth Analysis",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/16P-9XTeqAFiD84Tjk_XrAgkVPaiu016u/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/QcbJq7nmaDc/hqdefault.jpg",
        youtubeId: "QcbJq7nmaDc",
      },
      2: {
        id: 2,
        title: "Andrea Pirlo Career Retrospective",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/12mJkqL6veCbz133xrurXuqfVlLlPoNC-/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/PaKebfHWVTA/hqdefault.jpg",
        youtubeId: "PaKebfHWVTA",
      },
      3: {
        id: 3,
        title: "Deciphering Ball Possession Rate",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1Q8jZFBeKhLJ_LYyd5jUTb42jj77I2l2k/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/EvS0biul9tI/hqdefault.jpg",
        youtubeId: "EvS0biul9tI",
      },
      4: {
        id: 4,
        title: "PSG vs Bayern Match Tactical Analysis",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1ojW4VNqt8vZBwZF3c2RGJ2us3uJTBDTZ/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/7QE-3IxFOJ4/hqdefault.jpg",
        youtubeId: "7QE-3IxFOJ4",
      },
      5: {
        id: 5,
        title: "Pedri & Musiala Young Talents",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1udbjjj7WB85IH2GZzgngb1ARKHsIL_vf/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/Pg6fRV-B25A/hqdefault.jpg",
        youtubeId: "Pg6fRV-B25A",
      },
      6: {
        id: 6,
        title: "Gareth Bale - The Welsh Speedster",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1J9xtFoS6R1vR3cc1SMpW0BUWhM36F0Zh/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/ep_oOmFukpY/hqdefault.jpg",
        youtubeId: "ep_oOmFukpY",
      },
      7: {
        id: 7,
        title: "Neymar Jr - The Samba Dancer",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1eoDSBhvHzCdtxDIKYQHwVqJ6lXMA-XQ2/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/OMXNL9Fns6Y/hqdefault.jpg",
        youtubeId: "OMXNL9Fns6Y",
      },
      8: {
        id: 8,
        title: "Arsenal 2025/26 Season Deep Dive",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1xmumzZDZy3MHy2Wu53e9xuXRV1VWehDy/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/ltsFntlkE6c/hqdefault.jpg",
        youtubeId: "ltsFntlkE6c",
      },
      9: {
        id: 9,
        title: "Viral Sports Moment (Vertical Short)",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/16__aisizQ2NPR0aSlh8hQJpa4EFlU8lG/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/sP8-CfY4dI8/hqdefault.jpg",
        youtubeId: "sP8-CfY4dI8",
        aspectRatio: "9/16",
      },
      10: {
        id: 10,
        title: "Zlatan Ibrahimovic Breakdown",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1jfGBqkkWPHydzfaS1dvM9eBE94DZxcda/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/XokJ84Av6eM/hqdefault.jpg",
        youtubeId: "XokJ84Av6eM",
      },
      11: {
        id: 11,
        title: "Dominik Szoboszlai Spotlight (Short)",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/17XeQUPaPvHM7HCCg2K7KF_9BNXrWzrdn/preview",
        thumbnailUrl: "https://i.ytimg.com/vi/SST0jbBnpKo/hqdefault.jpg",
        youtubeId: "SST0jbBnpKo",
        aspectRatio: "9/16",
      },
      12: {
        id: 12,
        title: "Global Production",
        type: "ongoing",
        isOngoing: true,
      },
      13: {
        id: 13,
        title: "International Strategic Dossier",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1KZxQUzGwQfb1BxWNkEjlCqUvxB2Gcr4-/preview",
        thumbnailUrl: "/images/content-creator/13.jpg",
      },
      14: {
        id: 14,
        title: "Global Sports Industry Analysis",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1lBJq7jENluLt6EgVlZBOJfrZN5IxnW3q/preview",
        thumbnailUrl: "/images/content-creator/14.jpg",
      },
      15: {
        id: 15,
        title: "Bilingual Tactical Insights",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1H8Q4GOZbd-THHPITFv-I9DW6wHGvjgPT/preview",
        thumbnailUrl: "/images/content-creator/15.jpg",
      },
      16: {
        id: 16,
        title: "International Digital Media Series",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1I6sfYe48399WSX-VhdrMejfg-IP13QVr/preview",
        thumbnailUrl: "/images/content-creator/16.jpg",
      },
    },
  },

  "srv-graphic": {
    id: "srv-graphic",
    title: "Graphic Designer",
    prevSkillId: "srv-content",
    nextSkillId: "srv-video",
    section1: {
      title: "Brand Identity Systems",
      description:
        "End-to-end design of cohesive visual identity systems, establishing distinctive brand guides, typography rules, color systems, and assets across multi-channel ecosystems, websites, and live events.",
    },
    section2: {
      title: "Logo Design",
      description:
        "Creation of memorable, scalable brand marks, custom typography wordmarks, and mascot illustrations engineered for modern digital touchpoints and brand recognition.",
    },
    section3: {
      title: "Social Media Posts & Thumbnail Design",
      description:
        "Production of polished static and carousel assets, match fixtures, breaking news graphics, infographics, and high-CTR thumbnails employing intentional contrast and psychological framing.",
    },
    section4: {
      title: "Livestream & Powerpoint Template Design",
      description:
        "Modular broadcast design including dynamic scene layouts, scorebugs, ticker bars, and lower thirds paired with custom structured presentation slide decks that bridge complex data and clear aesthetics.",
    },
    slots: Object.fromEntries(
      Array.from({ length: 51 }, (_, i) => {
        const id = i + 1;
        return [
          id,
          {
            id,
            title: `Graphic Asset ${id}`,
            type: "image",
            mediaUrl: `/images/graphic-designer/${id}.png`,
          },
        ];
      })
    ),
  },

  "srv-video": {
    id: "srv-video",
    title: "Cinematic video editor",
    prevSkillId: "srv-graphic",
    nextSkillId: "srv-uxui",
    section1: {
      title: "2D Motion Graphic Video",
      description:
        "Integration of self-designed 2D animations, animated visual boards, kinetic text, and custom motion elements that transform dense statistics into fluid visual explanations.",
    },
    section2: {
      title: "Long-form Documentary Video",
      description:
        "Mastery of pacing, rhythm, narrative arcs, and atmospheric sound design to construct captivating deep-dive retrospective essays that command extended watch times.",
    },
    section3: {
      title: "Advertising Video",
      description:
        "High-impact commercial editing focusing on razor-sharp hooks, dynamic transitions, polished audio mixing, and strategic visual messaging designed to drive conversions and sponsor awareness.",
    },
    section4: {
      title: "Trending Short Video",
      description:
        "Fast-paced vertical editing (Shorts, TikTok, Reels) featuring instant retention hooks, expressive sound effects, animated captions, and punchy visual rhythm built for algorithm-driven reach.",
    },
    slots: {
      1: {
        id: 1,
        title: "2D Kinetic Motion Graphic Showcase",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1EnMmuDCJdzr9h1xdU3PFwldDyHuo05k0/preview",
        thumbnailUrl: "/images/cinematic-video-editor/1.jpg",
      },
      2: {
        id: 2,
        title: "Tactical Motion Board Animation",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1HSJ4Fuv6i6kqUHQJp1dbUQJdxWib4BTP/preview",
        thumbnailUrl: "/images/cinematic-video-editor/2.jpg",
      },
      3: {
        id: 3,
        title: "Statistical Data Infographic Animation",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1XxX1NHt-O5-NYXj0MMoaYcoTAaiZEV1b/preview",
        thumbnailUrl: "/images/cinematic-video-editor/3.jpg",
      },
      4: {
        id: 4,
        title: "Kinetic Visual Title Sequence",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1JqJpb0gTqmDdQDob02DEETSEJ9EF6KI3/preview",
        thumbnailUrl: "/images/cinematic-video-editor/4.jpg",
      },
      5: {
        id: 5,
        title: "Dynamic Vector Explainers",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1fak0jKCJ5z6QwWoO65xvnuo_vy4xpjxb/preview",
        thumbnailUrl: "/images/cinematic-video-editor/5.jpg",
      },
      6: {
        id: 6,
        title: "Fluid Graphics & Scene Transitions",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/15Qe-MGUNTYV9cxbQ1DC1WG6Kcq_1LhP4/preview",
        thumbnailUrl: "/images/cinematic-video-editor/6.jpg",
      },
      7: {
        id: 7,
        title: "Long-form Documentary Essay",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1WmYyhU1w_T-IZPeOGagiwJEMV2nf9ebN/preview",
        thumbnailUrl: "/images/cinematic-video-editor/7.jpg",
        youtubeId: "ep_oOmFukpY",
      },
      8: {
        id: 8,
        title: "Historical Retrospective Film",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1PwyJNvPeggtxR05z2IqPT2lb04mSbtNH/preview",
        thumbnailUrl: "/images/cinematic-video-editor/8.jpg",
        youtubeId: "OcfRTDIWfGM",
      },
      9: {
        id: 9,
        title: "Cinematic Narrative Sports Documentary",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1361yOpnGizWHWj6VDq_f9kgWG9xGUoxE/preview",
        thumbnailUrl: "/images/cinematic-video-editor/9.jpg",
        youtubeId: "7XQODjNjsQU",
      },
      10: {
        id: 10,
        title: "Commercial Anthem & Brand Spot",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1-20Sg9CCWus2BrdYzVeznTtuR58RQY_-/preview",
        thumbnailUrl: "/images/cinematic-video-editor/10.jpg",
        aspectRatio: "9/16",
      },
      11: {
        id: 11,
        title: "High-Energy Sponsor Teaser",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1pkxspbj_drBE6gf1EpoO8TzP7_bD95kR/preview",
        thumbnailUrl: "/images/cinematic-video-editor/11.jpg",
      },
      12: {
        id: 12,
        title: "Campaign Promo & Audio Mix",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1P0OUEu6hgK7YMzzvK5RUiPhPye4rgpbE/preview",
        thumbnailUrl: "/images/cinematic-video-editor/12.jpg",
      },
      13: {
        id: 13,
        title: "Viral Sports Reel #1",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1z9M4VDttG5iqft5d1lc6-0EF9DFrgNvx/preview",
        thumbnailUrl: "/images/cinematic-video-editor/13.jpg",
        aspectRatio: "9/16",
      },
      14: {
        id: 14,
        title: "Trending Algorithm Short #2",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1Ib8cpg7XGLS9UE3Al7gpGV1luk4-fPs0/preview",
        thumbnailUrl: "/images/cinematic-video-editor/14.jpg",
        aspectRatio: "9/16",
      },
      15: {
        id: 15,
        title: "High-Retention Vertical Hook #3",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1y4qxRNW20IJ-jk0exhlZM6KHzgQ0Nvaq/preview",
        thumbnailUrl: "/images/cinematic-video-editor/15.jpg",
        aspectRatio: "9/16",
      },
      16: {
        id: 16,
        title: "Dynamic Caption Vertical Edit #4",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1oRaiGKrpykL20t00YZx0c9L3BR7co5ch/preview",
        thumbnailUrl: "/images/cinematic-video-editor/16.jpg",
        aspectRatio: "9/16",
      },
      17: {
        id: 17,
        title: "Punchy Rhythm Short #5",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1m_d2uJUO4o86mVjk_F4I7ZHnEUL2TbrD/preview",
        thumbnailUrl: "/images/cinematic-video-editor/17.jpg",
        aspectRatio: "9/16",
      },
      18: {
        id: 18,
        title: "Expressive Sound Design Short #6",
        type: "video",
        mediaUrl: "https://drive.google.com/file/d/1Igha0jOCnbktPwqqLIr809pto2r91Eqv/preview",
        thumbnailUrl: "/images/cinematic-video-editor/18.jpg",
        aspectRatio: "9/16",
      },
    },
  },

  "srv-uxui": {
    id: "srv-uxui",
    title: "UX/UI Designer & Developer",
    prevSkillId: "srv-video",
    nextSkillId: "srv-livestream",
    section1: {
      title: "Zentlemen Web Portal",
      description:
        "A sports & entertainment web portal combining live discussions, tactical analysis, and multimedia video features.",
    },
    section2: {
      title: "The Watcher Digital Publication",
      description:
        "A premium subscription-based editorial platform and digital publication exploring art, football culture, and visual essays.",
    },
    section3: {
      title: "Interactive Web Architecture",
      description:
        "Engineered with modern frontend technologies, fluid responsive layouts, interactive live previews, and design systems.",
    },
    section4: {
      title: "Full-Stack & Product Design",
      description:
        "End-to-end design and implementation spanning interface aesthetics, user experience journeys, performance optimization, and scalable codebases.",
    },
  },

  "srv-livestream": {
    id: "srv-livestream",
    title: "Livestream production",
    prevSkillId: "srv-uxui",
    nextSkillId: "srv-content",
    section1: {
      title: "Broadcast Infrastructure & Multi-Cam",
      description:
        "Managing the technical and creative demands of live broadcasting with multi-camera switching, stable connectivity, low-latency transmission, and high-fidelity audio/visual pipelines.",
    },
    section2: {
      title: "Live Show Flow & Direction",
      description:
        "Seamless broadcast operations, rundown management, real-time timing execution, and professional show direction for esports events, tournaments, and live shows.",
    },
    section3: {
      title: "Dynamic Overlays & Scorebugs",
      description:
        "Real-time scoreboard graphics, lower thirds, animated stingers, and dynamic ticker bars tailored for high-energy live sports and community streaming.",
    },
    section4: {
      title: "Audience Engagement & Countdown Sequences",
      description:
        "Interactive chat integrations, automated stream opening and intermission sequences, real-time voting widgets, and multi-platform simulcasting.",
    },
    slots: {
      1: {
        id: 1,
        title: "Chung Kết Giải Đấu Quốc Tế Live Broadcast",
        type: "youtube",
        youtubeId: "ES_6e3NOT34",
      },
      2: {
        id: 2,
        title: "Talkshow Bình Luận Trực Tiếp Trận Cầu Đỉnh Cao",
        type: "youtube",
        youtubeId: "75EWbkcJG4M",
      },
      3: {
        id: 3,
        title: "Esports Tournament Championship Live Stream",
        type: "youtube",
        youtubeId: "bWkRdB63x7Y",
      },
      4: {
        id: 4,
        title: "Multi-Cam Live Studio Production",
        type: "youtube",
        youtubeId: "ehMH5Lfo7us",
      },
      5: {
        id: 5,
        title: "Interactive Community Live Show",
        type: "youtube",
        youtubeId: "YAPTXLctifk",
      },
      6: {
        id: 6,
        title: "Special Featured Live Broadcast & Interview",
        type: "youtube",
        youtubeId: "lkiW8o9a9lQ",
      },
      7: {
        id: 7,
        title: "HLV Onlive - Livestream Bình Luận Trận Cầu Đêm",
        type: "youtube",
        youtubeId: "h4IuJqvGYZY",
      },
      8: {
        id: 8,
        title: "Grand Final Live Event Presentation",
        type: "youtube",
        youtubeId: "y2x_RkMqgM4",
      },
    },
  },
};
