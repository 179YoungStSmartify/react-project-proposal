export type TierKey = "silver" | "gold" | "platinum";
export type Tier = {
  key: TierKey;
  name: string;
  price: string;
  summary: string;
  specs: [string, string][];
  recommended?: boolean;
  designUrl?: string;
};
export const integrationScopeNote =
  "Listed wall-screen hardware and one smart-home hub are included: HA Green for Silver and Gold; mini PC for Platinum. Switches, relays and wall plates are excluded and purchased separately.";
export const serviceScopeNote =
  "Consultation + installation + integration services.";
export const networkScopeNote =
  "Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.";
export const hardwareChoiceNote =
  "Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.";
export const lightingTiers: Tier[] = [
  {
    key: "silver",
    name: "Silver",
    price: "$8,500",
    summary:
      "Consultation, installation and on/off smart-switch integration, local control and essential routines using client-selected compatible hardware.",
    specs: [
      ["Lighting", "Integration with basic smart switches"],
      ["Dimming", "Not included"],
      ["Wall screens", "2×S, 1×M, 1×L"],
      ["Automations included", "5"],
      ["Automation capacity", "Up to 20"],
      ["Presence sensing", "Not included"],
      ["Garage door", "Integration included"],
      ["Air conditioning", "Integration included"],
      ["Remote access", "Nabu Casa (subscription)"],
      ["Support after handover", "2 months"],
      ["Relays with normal switches", "Not included"],
      ["Smart-home hub hardware", "One HA Green included"],
    ],
  },
  {
    key: "gold",
    name: "Gold",
    price: "$12,000",
    summary:
      "Consultation, installation and integration with client-selected compatible smart switches or relays behind normal light switches. Gold lighting control is on/off only; dimming requires Platinum.",
    recommended: true,
    specs: [
      [
        "Lighting",
        "On/off smart switches or relays with normal light switches",
      ],
      ["Dimming", "Not included"],
      ["Wall screens", "2×S, 2×L"],
      ["Automations included", "10"],
      ["Automation capacity", "Up to 20"],
      ["Presence sensing", "Optional extra"],
      ["Garage door", "Integration included"],
      ["Air conditioning", "Integration included"],
      ["Remote access", "Nabu Casa (subscription)"],
      ["Support after handover", "2 months"],
      ["Relays with normal switches", "Integration included"],
      ["Smart-home hub hardware", "One HA Green included"],
    ],
  },
  {
    key: "platinum",
    name: "Platinum",
    price: "$18,000",
    summary:
      "Consultation, installation and integration with client-selected compatible switches or relays, dimming configuration and expanded support for a tailored experience.",
    specs: [
      ["Lighting", "Smart switches or relays; dimming integration"],
      ["Dimming", "Included, subject to sample-stage testing"],
      [
        "Wall screens",
        "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
      ],
      ["Automations included", "50"],
      ["Automation capacity", "Unlimited"],
      ["Presence sensing", "Optional extra"],
      ["Garage door", "Integration included"],
      ["Air conditioning", "Integration included"],
      ["Remote access", "Nabu Casa (subscription)"],
      [
        "Support after handover",
        "2 months, priority support, callout fee exempt",
      ],
      ["Relays with normal switches", "Integration included"],
      ["Smart-home hub hardware", "One mini PC included"],
    ],
  },
];
export const networkTiers: Tier[] = [
  {
    key: "silver",
    name: "Silver Network",
    designUrl:
      "https://design.ui.com/share/3decd510-ef03-4098-ac90-fc137c050a52#key=c23f7582-5f37-476f-bfa3-580eaf920915",
    price: "$1,825",
    summary:
      "Designed for reliable whole-home coverage, with one access point per floor.",
    specs: [
      [
        "Kit",
        "Dream Router (UDR) · 2× U7 Pro APs · Ultra 60W (USW-Ultra-60W) switch",
      ],
      ["APs", "2 — one per floor"],
      ["Gateway LAN", "1 GbE LAN"],
      ["Wi‑Fi", "Wi‑Fi 7 (802.11be) · 6‑stream tri‑band"],
      ["IDS/IPS throughput", "1 Gbps"],
      ["Security", "Built‑in IDS/IPS"],
      ["Cameras", "Not included"],
      ["IoT network", "Dedicated VLAN for smart devices"],
      ["Network management", "UniFi app"],
    ],
  },
  {
    key: "gold",
    name: "Gold Network",
    designUrl:
      "https://design.ui.com/share/1f719bb6-db14-46b1-b2be-eba8edb180cd#key=cf9d690b-f603-4f83-93d5-f0680878fbc3",
    price: "$2,630",
    summary:
      "Dense Wi‑Fi 7, with more access points for denser coverage throughout the home.",
    recommended: true,
    specs: [
      [
        "Kit",
        "Cloud Gateway Ultra (UCG-Ultra) · 4× U7 Pro APs · Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) switch",
      ],
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
    designUrl:
      "https://design.ui.com/share/36118d48-fd86-46eb-9be2-9f6b8e65cd4f#key=737f0add-e88e-4cd1-8b9e-a92fa1e370cf",
    price: "$4,805",
    summary: "Local recording, with no ongoing UniFi subscription fee.",
    specs: [
      [
        "Kit",
        "Cloud Gateway Max 2TB (UCG-Max-2TB) · 4× U7 Pro APs · 1× Ultra (USW-Ultra) + 1× Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) · 3× G6 cameras",
      ],
      ["APs", "4 — two per floor"],
      ["Gateway LAN", "2.5 GbE"],
      ["Wi‑Fi", "Wi‑Fi 7 (802.11be) · 6‑stream tri‑band"],
      ["IDS/IPS throughput", "2.3 Gbps"],
      ["Security", "Built‑in IDS/IPS"],
      ["Cameras", "1× G6 Pro Dome, 1× G6 180 and 1× G6 Mini Dome; 2 TB model"],
      ["IoT network", "Dedicated VLAN for smart devices"],
      ["Network management", "UniFi app"],
    ],
  },
];
export const comparisonRows: [string, string, string, string][] = [
  [
    "Smart-home hub hardware",
    "Included — one HA Green",
    "Included — one HA Green",
    "Included — one mini PC",
  ],
  [
    "Switches, relays and wall plates",
    "Excluded — client supplied",
    "Excluded — client supplied",
    "Excluded — client supplied",
  ],
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
    "Relays with normal switches",
    ...(lightingTiers.map(
      (t) =>
        t.specs.find((row) => row[0] === "Relays with normal switches")![1],
    ) as [string, string, string]),
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
  [
    "Garage door",
    "Integration included",
    "Integration included",
    "Integration included",
  ],
  [
    "Air conditioning",
    "Integration included",
    "Integration included",
    "Integration included",
  ],
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
