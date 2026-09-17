export type LayoutType = 1 | 2 | 3 | 4 | 5 | 6;
export type MediaKind = "image" | "video" | "embed";

export interface ProjectMedia {
  kind: MediaKind;
  src: string;
  title?: string;
  aspect?: "wide" | "square" | "portrait";
}

export interface ProjectDetail {
  id: string;
  year: string;
  title: string;
  tag: string;
  category: "youtube" | "events" | "outsource" | "website";
  description: string;
  vision: string;
  statsNodes: Array<{ value: string; label: string }>;
  layoutType: LayoutType;
  media: ProjectMedia[];
  runtimeChannels?: Array<"nem-ngon" | "qua-bong-cuoi">;
  horizontalVideos?: string[];
  videos?: string[];
  logos?: string[];
  horizontalImages?: string[];
  verticalVideos?: string[];
  verticalImages?: string[];
}

const image = (src: string, aspect: ProjectMedia["aspect"] = "wide", title?: string): ProjectMedia => ({ kind: "image", src, aspect, title });
const video = (src: string, aspect: ProjectMedia["aspect"] = "wide", title?: string): ProjectMedia => ({ kind: "video", src, aspect, title });
const embed = (src: string, aspect: ProjectMedia["aspect"] = "wide", title?: string): ProjectMedia => ({ kind: "embed", src, aspect, title });

const stats = (values: [string, string][]) => values.map(([value, label]) => ({ value, label }));
const numbered = (folder: string, names: string[], start = 1) => names.map((name, index) => image(`/images/${folder}/${name}`, "wide", `Media ${start + index}`));

export const PROJECTS_DETAIL_DATA: Record<string, ProjectDetail> = {
  "zen-tactics": {
    id: "zen-tactics", year: "2021", title: "Zen Tactics", tag: "(Livestream Channel)", category: "youtube", layoutType: 1,
    description: "A pioneering Vietnamese football channel built around visual tactical analysis, livestream production, and accessible storytelling.",
    vision: "Turn complex football information into a rewarding viewing experience through clear motion, graphics, and storytelling.",
    statsNodes: stats([["64K", "SUBS"], ["44K", "FOLLOW"], ["6.3M", "VIEWS"]]),
    media: [video("https://drive.google.com/file/d/1iUfXeqNqXsCUNN66TlSX2c53nDPnybeL/preview"), image("/images/zen-tactics/2.png", "square"), image("/images/zen-tactics/3.png", "square"), ...numbered("zen-tactics", ["4.png", "5.png", "6.png", "9.png", "10.jpg", "11.jpg", "12.png", "13.png", "14.jpg", "15.png", "16.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"]), video("https://drive.google.com/file/d/1gJsr_2d2FDO2fGnXxOUk1_hiGYoCuqKs/preview", "portrait"), video("https://drive.google.com/file/d/1--QabvWWob7rTjmlqAS5BO8VJIDddazM/preview", "portrait"), video("https://drive.google.com/file/d/1PsO8fLA9SUn6HzAfCUQCT4ETE3ztca3F/preview")],
  },
  "modern-football": {
    id: "modern-football", year: "2022", title: "Modern Football", tag: "(Sport YT Channel)", category: "youtube", layoutType: 1,
    description: "The analytical successor to Zen Tactics, pairing a new visual identity with football analysis for a younger audience.", vision: "Make intricate tactical setups accessible and visually compelling.",
    statsNodes: stats([["24K", "SUBS"], ["30K", "FOLLOW"], ["4M", "VIEWS"]]),
    media: [video("https://drive.google.com/file/d/1wPp6zFc5Jzz4lDfGOZN3rHIKmk9WrzAa/preview"), ...numbered("modern-football", ["2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.png", "9.jpg", "10.png", "11.jpg", "12.png", "13.png", "14.png", "15.png", "16.png", "18.png", "19.png", "20.png", "21.png", "23.png", "24.png"]), video("https://drive.google.com/file/d/1B5vdu5vfm48xU6MLpZ7xZ3QKkarEcdF1/preview"), video("https://drive.google.com/file/d/1PFRTMcV4vx8kqdQF30PV6SKNRgy0H7MW/preview"), video("https://drive.google.com/file/d/1hiiwMSHkMjRDs48cad0dCLHwZrXFumev/preview")],
  },
  "zen-cine-esports": {
    id: "zen-cine-esports", year: "2022", title: "Zen Cine & Esports", tag: "(Other YT Channels)", category: "youtube", layoutType: 2,
    description: "Cinematic channel work and esports event storytelling across trailers, roster graphics, and stage visuals.", vision: "Elevate visual storytelling in sports entertainment.",
    statsNodes: stats([["10K", "SUBS"], ["500K", "VIEWS"], ["2", "FORMATS"]]),
    media: [video("https://drive.google.com/file/d/1U8AjTgqTH05V9PaUw__zEtPzsZgfyCID/preview"), image("/images/zen-cine-esports/2.png", "square"), ...numbered("zen-cine-esports", ["3.png", "4.jpg.png", "5.jpg", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png"]), video("https://drive.google.com/file/d/1IQi9wXG77nfLRBVDPnkQuP38TywEd8yL/preview")],
  },
  "tactics-duo": {
    id: "tactics-duo", year: "2022", title: "The Tactics Duo", tag: "(Outsource Channel)", category: "outsource", layoutType: 3,
    description: "Pre-match tactical breakdowns and graphic design production for an outsourced football channel.", vision: "Prove that precise motion graphics and deep analysis can drive reach.",
    statsNodes: stats([["2.9K", "SUBS"], ["4.7K", "FOLLOW"], ["646K", "VIEWS"]]),
    media: [video("https://drive.google.com/file/d/1hv5HhGLvnmBaBAAQ1akQd6PnKdSFhalf/preview"), ...numbered("tactics-duo", ["2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "8.jpg", "9.jpg", "10.png", "11.png", "12.png", "13.png"]), video("https://drive.google.com/file/d/1iQfPlxsmZGWcdiTi4ThbP0c6hBwJSJiX/preview")],
  },
  "zen-fifa-eworldcup": {
    id: "zen-fifa-eworldcup", year: "2023", title: "Zen FIFA eWorld Cup", tag: "(Public Event)", category: "events", layoutType: 4,
    description: "An offline EA FC tournament with broadcast graphics and event media produced under the Modern Football brand.", vision: "Unify competitive gaming with high-production event coverage.",
    statsNodes: stats([["100+", "PLAYERS"], ["8+", "TEAMS"], ["50K", "REACH"]]),
    media: [image("/images/zen-fifa-eworldcup/1.jpg"), image("/images/zen-fifa-eworldcup/2.png", "square"), ...numbered("zen-fifa-eworldcup", ["3.jpg", "4.jpg", "5.jpg", "6.jpg.png", "7.jpg", "8.jpg", "9.jpg", "10.png", "11.png", "12.png", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg"])],
  },
  zentlemen: {
    id: "zentlemen", year: "2022", title: "Zentlemen", tag: "(Website)", category: "website", layoutType: 6,
    description: "A website project presented through its approved editorial screenshots.", vision: "Interactive website exploration is reserved for a future phase.",
    statsNodes: stats([["WEB", "EXPERIENCE"], ["UI", "DESIGN"], ["2022", "LAUNCH"]]),
    media: [image("/images/zentlemen/image.png"), image("/images/zentlemen/image copy.png", "portrait")],
  },
  "hlv-online": {
    id: "hlv-online", year: "2023", title: "HLV Online", tag: "(Sport YT Channel)", category: "youtube", layoutType: 1,
    description: "MYM's signature sports-media brand combining modern motion graphics, tactical analysis, and interactive storytelling.", vision: "Prove that tactical depth and mass accessibility can coexist.",
    statsNodes: stats([["164K", "SUBS"], ["133K", "FOLLOW"], ["39M", "VIEWS"]]),
    media: [video("https://drive.google.com/file/d/1pjXf7hlm1-8QkPOhLbqoG6qsv5Gg39Q0/preview"), image("/images/hlv-online/2.png", "square"), image("/images/hlv-online/3.png", "square"), ...numbered("hlv-online", ["4.png", "5.png", "6.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"]), video("https://drive.google.com/file/d/1z7Hfv3E0Kgocw-lZVOvqFPZ7gVP4OKjI/preview", "portrait"), video("https://drive.google.com/file/d/1nwYORA8hSB9U7ALh6SH5pe69HvCAy8nf/preview", "portrait"), video("https://drive.google.com/file/d/1zsZVLCyKolS3gVdRR0wYecKhwFjJ427f/preview")],
  },
  "hlv-online-classic": {
    id: "hlv-online-classic", year: "2024", title: "HLV Online Classic", tag: "(Sport YT Channel)", category: "youtube", layoutType: 1,
    description: "A retro, narrative-led channel focused on iconic football moments and emotional audience connection.", vision: "Restore human connection to sports history.",
    statsNodes: stats([["31K", "SUBS"], ["3.3M", "VIEWS"], ["93K", "HOURS"]]),
    media: [video("https://drive.google.com/file/d/1w88XRlAu0XT_fD1GNPMtuXQBGZ8gm3n8/preview"), ...numbered("hlv-online-classic", ["2.png", "3.png", "4.jpg", "5.png", "6.jpg", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "18.png", "19.png", "20.jpg", "21.jpg", "22.jpg", "23.jpg"]), video("https://drive.google.com/file/d/1kcT1b_QLJ9FkAJAtZ8pOxnfvXT6Ividt/preview"), video("https://drive.google.com/file/d/1lbHCnSD3z6yyr0ilcxK8AW3GhdFefeXN/preview"), video("https://drive.google.com/file/d/1EKgLB-TBbor5w_AFsNcPAYnPUbbiVSzK/preview")],
  },
  "hlv-onlive": {
    id: "hlv-onlive", year: "2024", title: "HLV Onlive", tag: "(Livestream Channel)", category: "youtube", layoutType: 3,
    description: "A live-broadcast package featuring studio overlays, graphics, and matchday coverage.", vision: "Create a coherent visual system for live football production.",
    statsNodes: stats([["LIVE", "BROADCAST"], ["14", "ASSETS"], ["2024", "ERA"]]),
    media: [video("https://drive.google.com/file/d/1cvZtNdX-n2coqjUjD8WGDqLtFwBSxB0T/preview"), image("/images/hlv-onlive/2.png", "square"), ...numbered("hlv-onlive", ["3.png", "4.png", "5.png", "6.png"]), embed("https://www.youtube.com/live/h4IuJqvGYZY"), ...numbered("hlv-onlive", ["8.png", "9.png", "10.png", "11.png", "12.jpg", "13.png"])],
  },
  "cup-hoc-xem-bong": {
    id: "cup-hoc-xem-bong", year: "2025", title: "Cúp Học Xem Bóng", tag: "(Sport YT Channel)", category: "youtube", layoutType: 1,
    description: "A reality-show format for emerging football commentary and analysis talent.", vision: "Build an ecosystem for high-potential sports-media creators.",
    statsNodes: stats([["11K", "SUBS"], ["51K", "FOLLOW"], ["1.6M", "VIEWS"]]),
    media: [video("https://drive.google.com/file/d/1Xz1Kz5ppNhRzYzztR2baJzjDHVlXlFLB/preview"), ...numbered("cup-hoc-xem-bong", ["2.png", "3.png", "4.png", "5.png", "6.png"]), video("https://drive.google.com/file/d/1DbZF75YQNZgmHSjpwKP7MOI_Rx3nUo7K/preview"), video("https://drive.google.com/file/d/1TQDqofOdKf6DpSWdXQUdRs3fvkJXnXhv/preview"), ...numbered("cup-hoc-xem-bong", ["9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png"]), embed("https://www.youtube.com/watch?v=ep_oOmFukpY"), ...numbered("cup-hoc-xem-bong", ["18.png", "19.png", "20.png", "21.png", "22.png", "23.png"])],
  },
  "qua-bong-cuoi-nem-ngon": {
    id: "qua-bong-cuoi-nem-ngon", year: "2025", title: "Quả Bóng Cười, Ném Ngon…", tag: "(Outsource Channels)", category: "outsource", layoutType: 5,
    description: "Two content channels presented together: Ném Ngon and Quả Bóng Cười.", vision: "Match entertaining channel content with clear, platform-native presentation.",
    statsNodes: stats([["2", "CHANNELS"], ["TOP", "VIDEOS"], ["2025", "ERA"]]),
    media: [image("/images/qua-bong-cuoi-nem-ngon/1.png", "square"), image("/images/qua-bong-cuoi-nem-ngon/2.png", "square"), image("/images/qua-bong-cuoi-nem-ngon/3.png")], runtimeChannels: ["nem-ngon", "qua-bong-cuoi"],
  },
  "the-watcher": {
    id: "the-watcher", year: "2025", title: "The Watcher", tag: "(Website)", category: "website", layoutType: 6,
    description: "A website project awaiting the interactive demonstration requested in the review.", vision: "The present phase keeps an editorial preview until the source website is supplied.",
    statsNodes: stats([["WEB", "EXPERIENCE"], ["UI", "DESIGN"], ["2025", "LAUNCH"]]),
    media: [image("/logos/project-logos/14_The Watcher.png", "square")],
  },
};

export const PROJECT_IDS = Object.keys(PROJECTS_DETAIL_DATA);
