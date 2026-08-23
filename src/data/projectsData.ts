export interface ProjectDetail {
  id: string;
  year: string;
  title: string;
  tag: string;
  category: string;
  description: string;
  vision: string;
  statsNodes: Array<{ value: string; label: string }>;
  logos: string[]; // 1:1 square logo image paths
  horizontalImages: string[]; // 16:9 horizontal image paths
  verticalImages: string[]; // 9:16 vertical image paths
  horizontalVideos: string[]; // 16:9 YouTube/Vimeo video embed URLs
  verticalVideos: string[]; // 9:16 YouTube Shorts/Vimeo video embed URLs
  videos: string[]; // 16:9 video embed URLs (backward compatibility)
}

export const PROJECTS_DETAIL_DATA: Record<string, ProjectDetail> = {
  "zen-tactics": {
    id: "zen-tactics",
    year: "2021",
    title: "Zen Tactics",
    tag: "(Livestream Channel)",
    category: "youtube",
    description:
      "The Zen system represents a multi-year journey of redefining digital sports and entertainment media in Vietnam. Born from a desire to move beyond basic streams, we have consistently pushed the boundaries of content creation—transitioning from pioneering regional tactical analysis to football broadcasting, large scale live esports events.",
    vision:
      "Our work—from pioneering high-end tactical boards in football to crossing down esports strategy—is designed to dismantle the barrier between 'hardcore information' and 'audience understanding'. By utilizing dynamic motion graphics and reliable storytelling, we turn technical analysis into a rewarding viewing experience.",
    statsNodes: [
      {
            "value": "64K",
            "label": "SUBS"
      },
      {
            "value": "44K",
            "label": "FOLLOW"
      },
      {
            "value": "6.3M",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/zen-tactics/475056694_910641067818661_514620898112741635_n.jpg",
      "/images/zen-tactics/471149121_885377707011664_4241553800759395865_n.jpg"
],
    horizontalImages: [
      "/images/zen-tactics/261982058_231575285725246_9124063563937176591_n.jpg",
      "/images/zen-tactics/247395811_211126724436769_8114731029458775560_n.jpg",
      "/images/zen-tactics/262528981_231069332442508_717587687579017197_n.jpg",
      "/images/zen-tactics/269757730_246400077576100_8305394240951439269_n.jpg",
      "/images/zen-tactics/472179218_895044539378314_2909086318927515435_n.jpg",
      "/images/zen-tactics/472426126_895709369311831_6879265775689816510_n.jpg",
      "/images/zen-tactics/472599692_895716355977799_4787358625607068956_n.jpg",
      "/images/zen-tactics/470668407_884758123740289_8534694881790031200_n.jpg"
],
    verticalImages: [],
    horizontalVideos: [
      "https://drive.google.com/file/d/1BmBzq737YhOF1f8wkfQYX0lHqCl4s9Sa/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1BmBzq737YhOF1f8wkfQYX0lHqCl4s9Sa/preview"
],
  },
  "modern-football": {
    id: "modern-football",
    year: "2022",
    title: "Modern Football",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "Modern Football (2022): The analytical successor to Zentactics. This project assumes the core analytical DNA of its predecessor while introducing a brand new visual identity. With a vibrant design language, Modern Football bridges today's complex tactical analysis with young audiences.",
    vision:
      "Our vision is to set the gold standard in sports media by making intricate tactical setups accessible and visually thrilling for the next generation of sports enthusiasts.",
    statsNodes: [
      {
            "value": "24K",
            "label": "SUBS"
      },
      {
            "value": "30K",
            "label": "FOLLOW"
      },
      {
            "value": "4M",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/modern-football/475649955_944879514413744_7326433066322230252_n.jpg"
],
    horizontalImages: [
      "/images/modern-football/4(1).jpg",
      "/images/modern-football/5.jpg",
      "/images/modern-football/8.jpg",
      "/images/modern-football/7.jpg",
      "/images/modern-football/8.png",
      "/images/modern-football/1.jpg",
      "/images/modern-football/2.jpg",
      "/images/modern-football/3.jpg",
      "/images/modern-football/4.jpg",
      "/images/modern-football/5.png",
      "/images/modern-football/9.png",
      "/images/modern-football/1(1).jpg",
      "/images/modern-football/6.jpg",
      "/images/modern-football/10.png",
      "/images/modern-football/11.png"
],
    verticalImages: [],
    horizontalVideos: [],
    verticalVideos: [],
    videos: [],
  },
  "tactics-duo": {
    id: "tactics-duo",
    year: "2022",
    title: "The Tactics Duo",
    tag: "(Outsource Channel)",
    category: "outsource",
    description:
      "Focused on pre-match tactical breakdown and heavy graphic design execution. Achieved a peak traffic of over 600K views within a single year despite having modest subscriber counts.",
    vision:
      "Demonstrating that high production value, precise motion graphics, and deep football analysis can achieve extreme viral efficiency.",
    statsNodes: [
      {
            "value": "2.9K",
            "label": "SUBS"
      },
      {
            "value": "4.7K",
            "label": "FOLLOW"
      },
      {
            "value": "646K",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/tactics-duo/472344380_577484088480153_5444369428971598159_n.jpg",
      "/images/tactics-duo/473825573_586864197542142_1598442920759940212_n.jpg"
],
    horizontalImages: [
      "/images/tactics-duo/472270521_576889831872912_1974374757049650913_n.jpg",
      "/images/tactics-duo/476110603_597252313169997_211867323366721269_n.jpg",
      "/images/tactics-duo/476345143_602266059335289_7880048792624729124_n.jpg",
      "/images/tactics-duo/476786028_602269222668306_6944255767925836396_n.jpg",
      "/images/tactics-duo/476462967_600730769488818_3386492867093511406_n.jpg",
      "/images/tactics-duo/480907522_4081755948710606_7988917682884591118_n.jpg"
],
    verticalImages: [],
    horizontalVideos: [
      "https://drive.google.com/file/d/1X-ioaQIhzkVKC7xoFGOuIpjnMxYUutj5/preview",
      "https://drive.google.com/file/d/1fNIiaI8r4lXnMxVbtN003gODtt9ScAMS/preview",
      "https://drive.google.com/file/d/1PE8mjuZKnKyUHD1cqtiH1qCY7YM_qrUN/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1X-ioaQIhzkVKC7xoFGOuIpjnMxYUutj5/preview",
      "https://drive.google.com/file/d/1fNIiaI8r4lXnMxVbtN003gODtt9ScAMS/preview",
      "https://drive.google.com/file/d/1PE8mjuZKnKyUHD1cqtiH1qCY7YM_qrUN/preview"
],
  },
  "zen-fifa": {
    id: "zen-fifa",
    year: "2023",
    title: "Zen FIFA23 eWorld Cup",
    tag: "(Public Event)",
    category: "events",
    description:
      "The first major Esports offline tournament organized under the Modern Football brand. One of the largest offline EA FC tournaments hosted in Ho Chi Minh City.",
    vision:
      "Unifying offline competitive gaming with high-production online broadcast graphics, setting new standards for grass-roots esports tournaments in Vietnam.",
    statsNodes: [
      {
            "value": "100+",
            "label": "PLAYERS"
      },
      {
            "value": "8+",
            "label": "TEAMS"
      },
      {
            "value": "50K",
            "label": "REACH"
      }
],
    logos: [
      "/images/zen-fifa-eworldcup/475778147_944879907747038_6124399279494855186_n.jpg",
      "/images/zen-fifa-eworldcup/475872175_944879587747070_2330471353124767265_n.jpg"
],
    horizontalImages: [
      "/images/zen-fifa-eworldcup/475558328_944879894413706_2573176993309625017_n.jpg",
      "/images/zen-fifa-eworldcup/475655468_944879474413748_623354579659500435_n.jpg",
      "/images/zen-fifa-eworldcup/475661500_944879914413704_933783975644155104_n.jpg",
      "/images/zen-fifa-eworldcup/475677583_944879651080397_2228180341651416688_n.jpg",
      "/images/zen-fifa-eworldcup/475730538_944879607747068_5917676286444930522_n.jpg",
      "/images/zen-fifa-eworldcup/475849502_944879911080371_2697539055331079909_n.jpg",
      "/images/zen-fifa-eworldcup/475831082_944879471080415_4984727195396708880_n.jpg",
      "/images/zen-fifa-eworldcup/475681514_944879891080373_1922671567771122179_n.jpg",
      "/images/zen-fifa-eworldcup/475684476_944879924413703_8127607533985552413_n.jpg"
],
    verticalImages: [],
    horizontalVideos: [
      "https://drive.google.com/file/d/1EY5LkkhEJWhI05eLJ5dM3CTHEwp6vDOh/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1EY5LkkhEJWhI05eLJ5dM3CTHEwp6vDOh/preview"
],
  },
  "hlv-online": {
    id: "hlv-online",
    year: "2023",
    title: "HLV Online",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "HLV Online represents our signature milestone and most successful sport media brand to date. By combining modern visual motion graphics, deep-dive tactical analytics, and interactive storytelling.",
    vision:
      "To redefine digital football media by proving that tactical depth and mass accessibility are not mutually exclusive.",
    statsNodes: [
      {
            "value": "164K",
            "label": "SUBS"
      },
      {
            "value": "133K",
            "label": "FOLLOW"
      },
      {
            "value": "39M",
            "label": "VIEWS"
      }
],
    logos: [],
    horizontalImages: [
      "/images/hlv-onlive/2.png",
      "/images/hlv-onlive/12.jpg",
      "/images/hlv-onlive/13.jpg",
      "/images/hlv-onlive/31.png",
      "/images/hlv-onlive/epl 3.png",
      "/images/hlv-onlive/pre-epl 2.png"
],
    verticalImages: [],
    horizontalVideos: [],
    verticalVideos: [],
    videos: [],
  },
  "hlv-classic": {
    id: "hlv-classic",
    year: "2024",
    title: "HLV Online Classic",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "A retro, narrative-driven approach to iconic football moments. Focusing on nostalgic events to restore pure, emotional human connection with dedicated football audiences.",
    vision:
      "Restoring pure human connection and emotional storytelling to iconic moments in sports history.",
    statsNodes: [
      {
            "value": "31K",
            "label": "SUBS"
      },
      {
            "value": "3.3M",
            "label": "VIEWS"
      },
      {
            "value": "93K",
            "label": "HOURS"
      }
],
    logos: [
      "/images/hlv-online-classic/Logo.png",
      "/images/hlv-online-classic/Paul Scholes.png"
],
    horizontalImages: [
      "/images/hlv-online-classic/Youtube banner.png",
      "/images/hlv-online-classic/Bayern_Munnich_Ribery_Robben.png",
      "/images/hlv-online-classic/Ronaldo_Man_United_Rooney.png",
      "/images/hlv-online-classic/Spain 2026 Cassilas Inesta Xavi.png",
      "/images/hlv-online-classic/Facebook banner.png"
],
    verticalImages: [
      "/images/hlv-online-classic/1.png",
      "/images/hlv-online-classic/2.png",
      "/images/hlv-online-classic/3.png",
      "/images/hlv-online-classic/Neymar.png"
],
    horizontalVideos: [
      "https://drive.google.com/file/d/1KkZDjVR60RkNWHasKOMarpPfRljOARWG/preview",
      "https://drive.google.com/file/d/1r2-zQ_aJm2FcJHY9n9jSLBUEDELSAi16/preview",
      "https://drive.google.com/file/d/1FCqEmeifmNHIzHeXBhH7QL013GqQnaxS/preview",
      "https://drive.google.com/file/d/1hvkIKuwcYCvKNiJlSn_s0-lPMPzGP3px/preview",
      "https://drive.google.com/file/d/1cCy4b9gVIZ6gQtFw9ZfBAl-RjOfsI9S1/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1KkZDjVR60RkNWHasKOMarpPfRljOARWG/preview",
      "https://drive.google.com/file/d/1r2-zQ_aJm2FcJHY9n9jSLBUEDELSAi16/preview",
      "https://drive.google.com/file/d/1FCqEmeifmNHIzHeXBhH7QL013GqQnaxS/preview",
      "https://drive.google.com/file/d/1hvkIKuwcYCvKNiJlSn_s0-lPMPzGP3px/preview",
      "https://drive.google.com/file/d/1cCy4b9gVIZ6gQtFw9ZfBAl-RjOfsI9S1/preview"
],
  },
  "cup-hoc": {
    id: "cup-hoc",
    year: "2025",
    title: "Cup Hoc Xem Bong",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "A reality show format dedicated to finding and nurturing young commentary and analytical talent in football esports, forming the foundation for the next media generation.",
    vision:
      "Building an incubator ecosystem for high-potential digital sports creators.",
    statsNodes: [
      {
            "value": "11K",
            "label": "SUBS"
      },
      {
            "value": "51K",
            "label": "FOLLOW"
      },
      {
            "value": "1.6M",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/cup-hoc-xem-bong/Mark logo.png"
],
    horizontalImages: [
      "/images/cup-hoc-xem-bong/Youtube banner.png",
      "/images/cup-hoc-xem-bong/Alexander_Isak_Liam_Delap_Woltermade_Liverpool_Chelsea_Newcastle.png",
      "/images/cup-hoc-xem-bong/Bayern_Munnich_Ribery_Robben.png",
      "/images/cup-hoc-xem-bong/Bản sao của Arsenal_va_Bayern_nhu_nay_thi_sao_Chelsea_an_uoc_ay.png",
      "/images/cup-hoc-xem-bong/Bản sao của Tat_ca_tai_Isak.png",
      "/images/cup-hoc-xem-bong/Mathues Cunha Ryan Cherki Joao Pedro(1).png",
      "/images/cup-hoc-xem-bong/Salah.png",
      "/images/cup-hoc-xem-bong/Tonali Bruno Guimares Man United(1).png",
      "/images/cup-hoc-xem-bong/fb banner.png"
],
    verticalImages: [
      "/images/cup-hoc-xem-bong/2a (1).png",
      "/images/cup-hoc-xem-bong/4a.png",
      "/images/cup-hoc-xem-bong/6a.png"
],
    horizontalVideos: [
      "https://drive.google.com/file/d/1GBBCjYaqAv9RpOkuL4cXars0tWQAWvpC/preview",
      "https://drive.google.com/file/d/1IpAO8bPbEZsL2IvxdvAoejwhzt4MQj60/preview"
],
    verticalVideos: [
      "https://drive.google.com/file/d/17PHMMoD_91Fy5YJQjIGxmzidAZA-BofZ/preview",
      "https://drive.google.com/file/d/1xhLwyGad4KIETNm9qalEEFKUalYyK9En/preview",
      "https://drive.google.com/file/d/137ydQGEdjINYz_5D1GCqotftrBUcmRT-/preview",
      "https://drive.google.com/file/d/1k3jWs8IW9pHBdEXurtt22lGAI_fz2bIc/preview",
      "https://drive.google.com/file/d/1TnqWOxehDuOyAgZDuAMk4gp_ZixkaZsX/preview",
      "https://drive.google.com/file/d/1L4-QEDzX90ntq4k5SdunORT8UQ9NZr3r/preview",
      "https://drive.google.com/file/d/1BmtlBOcT3fEyD3pB-VFtyo1wa1I6-yZl/preview"
],
    videos: [
      "https://drive.google.com/file/d/1GBBCjYaqAv9RpOkuL4cXars0tWQAWvpC/preview",
      "https://drive.google.com/file/d/1IpAO8bPbEZsL2IvxdvAoejwhzt4MQj60/preview"
],
  },
  "the-watcher": {
    id: "the-watcher",
    year: "2025",
    title: "The Watcher",
    tag: "(Website & Platform)",
    category: "website",
    description:
      "A premium subscription-based editorial blog platform designed with a dark, minimalist aesthetic, smooth scroll interactions, and a custom admin CMS panel.",
    vision:
      "Merging editorial journalism with modern software engineering for next-generation digital publishing.",
    statsNodes: [
      {
            "value": "100%",
            "label": "CUSTOM UI"
      },
      {
            "value": "CMS",
            "label": "ADMIN"
      },
      {
            "value": "2025",
            "label": "LAUNCH"
      }
],
    logos: [],
    horizontalImages: [
      "/images/zentlemen/image.png"
],
    verticalImages: [
      "/images/zentlemen/image copy.png"
],
    horizontalVideos: [],
    verticalVideos: [],
    videos: [],
  },
  "zen-cine": {
    id: "zen-cine",
    year: "2022",
    title: "Zen Cine",
    tag: "(Media Channel)",
    category: "youtube",
    description:
      "Cinematic and narrative digital entertainment experiences.",
    vision:
      "Elevating visual storytelling standards in sports entertainment.",
    statsNodes: [
      {
            "value": "10K",
            "label": "SUBS"
      },
      {
            "value": "500K",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/zen-cine/295828058_104244065711818_4950345619294456168_n.jpg",
      "/images/zen-cine/470170245_553844847418402_5608481775455364546_n.jpg"
],
    horizontalImages: [
      "/images/zen-cine/471489345_564682986334588_7285750892335056990_n.jpg",
      "/images/zen-cine/297812997_113979661404925_4704299858387917655_n.jpg",
      "/images/zen-cine/294980201_104244262378465_1188009827340525302_n.png"
],
    verticalImages: [],
    horizontalVideos: [
      "https://drive.google.com/file/d/1gaMR0mp7p7knl4-JGRluUhsophOF61Si/preview",
      "https://drive.google.com/file/d/1wAHknHEvsWMs2qOX7lfjWLOwhTjFzkUd/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1gaMR0mp7p7knl4-JGRluUhsophOF61Si/preview",
      "https://drive.google.com/file/d/1wAHknHEvsWMs2qOX7lfjWLOwhTjFzkUd/preview"
],
  },
  "zen-esport": {
    id: "zen-esport",
    year: "2023",
    title: "Zen Esport",
    tag: "(Esports Event)",
    category: "events",
    description:
      "High-production esports tournament coverage and motion design.",
    vision:
      "Pioneering state of the art esports live broadcasts.",
    statsNodes: [
      {
            "value": "50K",
            "label": "REACH"
      },
      {
            "value": "10+",
            "label": "EVENTS"
      }
],
    logos: [],
    horizontalImages: [
      "/images/zen-esport/2.png",
      "/images/zen-esport/3.png",
      "/images/zen-esport/4.png",
      "/images/zen-esport/5.png",
      "/images/zen-esport/6.png",
      "/images/zen-esport/7.png",
      "/images/zen-esport/lol.png",
      "/images/zen-esport/291620735_137020969003837_1358084763908439614_n.jpg"
],
    verticalImages: [
      "/images/zen-esport/475744360_638204002218862_4860111482180158439_n.jpg"
],
    horizontalVideos: [
      "https://drive.google.com/file/d/1DwpwWIE2IbBzCT5yLF-IzF5RXL9PJpb0/preview",
      "https://drive.google.com/file/d/1pO3BPxxz96BukbK0jWPFCNd6hR__zHwG/preview"
],
    verticalVideos: [],
    videos: [
      "https://drive.google.com/file/d/1DwpwWIE2IbBzCT5yLF-IzF5RXL9PJpb0/preview",
      "https://drive.google.com/file/d/1pO3BPxxz96BukbK0jWPFCNd6hR__zHwG/preview"
],
  },
  "lien-minh-fun": {
    id: "lien-minh-fun",
    year: "2023",
    title: "Lien Minh Fun",
    tag: "(Community Channel)",
    category: "youtube",
    description:
      "Gaming community content and creative motion design assets.",
    vision:
      "Connecting gaming communities through innovative visual design.",
    statsNodes: [
      {
            "value": "15K",
            "label": "FOLLOW"
      },
      {
            "value": "1M",
            "label": "VIEWS"
      }
],
    logos: [
      "/images/lien-minh-fun/480674703_623789863730100_6669545896043966229_n.jpg",
      "/images/lien-minh-fun/481240467_624607186981701_2269220079689298231_n.jpg"
],
    horizontalImages: [],
    verticalImages: [],
    horizontalVideos: [],
    verticalVideos: [
      "https://drive.google.com/file/d/17CpLNlGagrRnDDbx-d56OvtyO5iCxS6v/preview",
      "https://drive.google.com/file/d/141QiVu1DgT2doyvLsTi9WVRiXCLElg1g/preview"
],
    videos: [],
  },
};
