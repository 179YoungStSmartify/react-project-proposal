export type TierKey = "silver" | "gold" | "platinum";
export type Tier = {
  key: TierKey;
  name: string;
  price: string;
  summary: string;
  specs: [string, string][];
  recommended?: boolean;
};
export const lightingTiers: Tier[] = [
  {
    key: "silver",
    name: "Silver",
    price: "$8,500",
    summary:
      "A considered start: reliable smart switching, local control and the essentials throughout your home.",
    specs: [
      ["Lighting", "Basic smart switch replacement"],
      ["Dimming", "Not included"],
      ["Wall screens", "2×S, 1×M, 1×L"],
      ["Automations included", "5"],
      ["Automation capacity", "Up to 20"],
      ["Presence sensing", "Not included"],
      ["Garage door", "Included"],
      ["Air conditioning", "Included"],
      ["Remote access", "Nabu Casa (subscription)"],
      ["Support after handover", "2 months"],
    ],
  },
  {
    key: "gold",
    name: "Gold",
    price: "$12,000",
    summary:
      "More considered control, with push-button conversion and integrations for the home you already use.",
    recommended: true,
    specs: [
      ["Lighting", "Existing switches converted to push-button"],
      ["Dimming", "Not included"],
      ["Wall screens", "2×S, 2×L"],
      ["Automations included", "10"],
      ["Automation capacity", "Up to 20"],
      ["Presence sensing", "Optional extra"],
      ["Garage door", "Included"],
      ["Air conditioning", "Included"],
      ["Remote access", "Nabu Casa (subscription)"],
      ["Support after handover", "2 months"],
    ],
  },
  {
    key: "platinum",
    name: "Platinum",
    price: "$18,000",
    summary:
      "A premium switch finish, dimming capability and expanded support for a more tailored experience.",
    specs: [
      ["Lighting", "Clipsal premium-range push buttons"],
      ["Dimming", "Included, subject to sample-stage testing"],
      [
        "Wall screens",
        "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
      ],
      ["Automations included", "50"],
      ["Automation capacity", "Unlimited"],
      ["Presence sensing", "Optional extra"],
      ["Garage door", "Included"],
      ["Air conditioning", "Included"],
      ["Remote access", "Nabu Casa (subscription)"],
      [
        "Support after handover",
        "2 months, priority support, callout fee exempt",
      ],
    ],
  },
];
export const networkTiers: Tier[] = [
  {
    key: "silver",
    name: "Silver Network",
    price: "$1,825",
    summary:
      "Designed for reliable whole-home coverage, with one access point per floor.",
    specs: [
      ["Kit", "UDR7 · 2× U7 Pro APs · PoE+ switch"],
      ["APs", "2 — one per floor"],
      ["Gateway LAN", "2.5 GbE"],
      ["Wi‑Fi", "Wi‑Fi 7 (802.11be) · 6‑stream tri‑band"],
      ["IDS/IPS throughput", "2.3 Gbps"],
      ["Security", "Built‑in IDS/IPS"],
      ["Cameras", "Not included"],
      ["IoT network", "Dedicated VLAN for smart devices"],
      ["Network management", "UniFi app"],
    ],
  },
  {
    key: "gold",
    name: "Gold Network",
    price: "$2,630",
    summary:
      "Dense Wi‑Fi 7, with more access points for denser coverage throughout the home.",
    recommended: true,
    specs: [
      ["Kit", "Cloud Gateway Ultra · 4× U7 Pro APs · 2.5 GbE PoE+ switch"],
      ["APs", "4 — two per floor"],
      ["Gateway LAN", "1 GbE"],
      ["Wi‑Fi", "Wi‑Fi 7 (802.11be) · 6‑stream tri‑band"],
      ["IDS/IPS throughput", "1 Gbps"],
      ["Security", "Built‑in IDS/IPS"],
      ["Cameras", "Not included"],
      ["IoT network", "Dedicated VLAN for smart devices"],
      ["Network management", "UniFi app"],
    ],
  },
  {
    key: "platinum",
    name: "Platinum Network",
    price: "$4,805",
    summary: "Local recording, with no ongoing UniFi subscription fee.",
    specs: [
      [
        "Kit",
        "Cloud Gateway Max · 4× U7 Pro APs · 3× G6 cameras · 2.5 GbE PoE+ switch",
      ],
      ["APs", "4 — two per floor"],
      ["Gateway LAN", "2.5 GbE"],
      ["Wi‑Fi", "Wi‑Fi 7 (802.11be) · 6‑stream tri‑band"],
      ["IDS/IPS throughput", "2.3 Gbps"],
      ["Security", "Built‑in IDS/IPS"],
      ["Cameras", "3× G6 + up to 2 TB local recording"],
      ["IoT network", "Dedicated VLAN for smart devices"],
      ["Network management", "UniFi app"],
    ],
  },
];
export const comparisonRows: [string, string, string, string][] = [
  [
    "Lighting",
    ...(lightingTiers.map((t) => t.specs[0][1]) as [string, string, string]),
  ],
  [
    "Dimming",
    ...(lightingTiers.map((t) => t.specs[1][1]) as [string, string, string]),
  ],
  [
    "Wall screens",
    "2×S (small), 1×M (medium), 1×L (large)",
    "2×S, 2×L",
    "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
  ],
  [
    "Automations included",
    ...(lightingTiers.map((t) => t.specs[3][1]) as [string, string, string]),
  ],
  [
    "Automation capacity",
    ...(lightingTiers.map((t) => t.specs[4][1]) as [string, string, string]),
  ],
  [
    "Presence sensing",
    ...(lightingTiers.map((t) => t.specs[5][1]) as [string, string, string]),
  ],
  ["Garage door", "Included", "Included", "Included"],
  ["Air conditioning", "Included", "Included", "Included"],
  [
    "Home network",
    ...(networkTiers.map(
      (t) => `${t.name} — ${t.price} indicative hardware`,
    ) as [string, string, string]),
  ],
  [
    "Remote access",
    "Home Assistant App via Nabu Casa (subscription)",
    "Silver inclusions + integration into Google Home/Apple HomeKit",
    "Silver inclusions + integration into Google Home/Apple HomeKit",
  ],
  [
    "Support after handover",
    ...(lightingTiers.map((t) => t.specs[9][1]) as [string, string, string]),
  ],
];
export const finishRanges = [
  {
    name: "Iconic Styl",
    colours: [
      [
        "Classic Electric White",
        "/images/clipsal/processed/styl/S3042C-CE.jpg",
      ],
      ["Silver Shadow", "/images/clipsal/processed/styl/S3042C-SH.jpg"],
      ["Stainless Silver", "/images/clipsal/processed/styl/S3042C-SV.jpg"],
    ],
  },
  {
    name: "Iconic Essence",
    colours: [
      ["Antique Gold", "/images/clipsal/processed/essence/E3042C-AG.jpg"],
      ["Antique White", "/images/clipsal/processed/essence/E3042C-AW.jpg"],
    ],
  },
  {
    name: "Saturn Zen",
    colours: [
      ["Black", "/images/clipsal/processed/saturn-zen/Z4062PBL-ZB.jpg"],
      ["White", "/images/clipsal/processed/saturn-zen/Z4062PBL-ZW.jpg"],
    ],
  },
  {
    name: "Solis",
    colours: [
      ["Black", "/images/clipsal/processed/solis/1042PA-ZB.jpg"],
      ["White", "/images/clipsal/processed/solis/1042PA-ZW.jpg"],
    ],
  },
] as const;
export function validProjectUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
