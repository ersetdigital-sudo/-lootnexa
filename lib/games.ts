export interface Nominal {
  label: string;
  price: number;
}

export interface Game {
  slug: string;
  name: string;
  cur: string;
  range: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  logoStyle?: "contain" | "fill";
  alt: string;
  tag?: string;
  heading: string;
  copy: string;
  hint: string;
  server: boolean;
  serverLabel?: string;
  user_id_label?: string;
  user_id_placeholder?: string;
  server_id_label?: string;
  server_id_placeholder?: string;
  nominals: Nominal[];
  passes?: Nominal[];
}

export const GAMES: Game[] = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    cur: "Diamond",
    range: "5 – 706",
    logo: "/images/mobile-legends.svg",
    logoWidth: 120,
    logoHeight: 120,
    logoStyle: "contain",
    alt: "Logo resmi Mobile Legends: Bang Bang",
    tag: "Paling dicari",
    heading: "Top Up Diamond Mobile Legends",
    copy: "Top up Diamond Mobile Legends dikirim ke User ID dan Zone ID yang kamu masukkan, tanpa login akun.",
    hint: "User ID dan Zone ID ada di menu profil dalam game.",
    server: true,
    serverLabel: "Zone ID",
    user_id_label: "User ID",
    user_id_placeholder: "12345678",
    nominals: [
      { label: "5 Diamond", price: 1500 },
      { label: "12 Diamond", price: 3400 },
      { label: "28 Diamond", price: 7900 },
      { label: "59 Diamond", price: 16500 },
      { label: "86 Diamond", price: 23500 },
      { label: "172 Diamond", price: 46500 },
      { label: "257 Diamond", price: 69000 },
      { label: "344 Diamond", price: 92000 },
      { label: "706 Diamond", price: 185000 },
    ],
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    cur: "Diamond",
    range: "5 – 1000",
    logo: "/images/free-fire.png",
    logoWidth: 616,
    logoHeight: 90,
    logoStyle: "contain",
    alt: "Logo resmi Garena Free Fire",
    tag: "Cepat",
    heading: "Top Up Diamond Free Fire",
    copy: "Top up Diamond Free Fire ke User ID kamu, tanpa login akun.",
    hint: "User ID Free Fire ada di halaman profil akunmu.",
    server: false,
    user_id_label: "User ID",
    user_id_placeholder: "12345678",
    nominals: [
      { label: "5 Diamond", price: 1500 },
      { label: "12 Diamond", price: 2900 },
      { label: "50 Diamond", price: 8500 },
      { label: "70 Diamond", price: 11500 },
      { label: "100 Diamond", price: 16000 },
      { label: "140 Diamond", price: 22000 },
      { label: "355 Diamond", price: 52000 },
      { label: "720 Diamond", price: 103000 },
      { label: "1000 Diamond", price: 142000 },
    ],
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    cur: "UC",
    range: "60 – 8100",
    logo: "/images/pubg-mobile.jpg",
    logoWidth: 512,
    logoHeight: 380,
    alt: "Ikon resmi PUBG Mobile",
    heading: "Top Up UC PUBG Mobile",
    copy: "Top up UC PUBG Mobile ke User ID kamu, tanpa login akun.",
    hint: "Character ID PUBG Mobile ada di menu profil.",
    server: false,
    user_id_label: "User ID",
    user_id_placeholder: "12345678",
    nominals: [
      { label: "60 UC", price: 15000 },
      { label: "120 UC", price: 29000 },
      { label: "180 UC", price: 43000 },
      { label: "325 UC", price: 72000 },
      { label: "660 UC", price: 143000 },
      { label: "985 UC", price: 212000 },
      { label: "1800 UC", price: 385000 },
      { label: "3850 UC", price: 770000 },
      { label: "8100 UC", price: 1540000 },
    ],
  },
  {
    slug: "call-of-duty-mobile",
    name: "Call of Duty: Mobile",
    cur: "CP",
    range: "53 – 10800",
    logo: "/images/call-of-duty-mobile.svg",
    logoWidth: 445,
    logoHeight: 227,
    logoStyle: "contain",
    alt: "Logo resmi Call of Duty",
    heading: "Top Up CP Call of Duty: Mobile",
    copy: "Top up CP Call of Duty: Mobile ke User ID kamu, tanpa login akun.",
    hint: "Open ID / Player ID COD Mobile ada di menu profil dalam game.",
    server: false,
    user_id_label: "User ID",
    user_id_placeholder: "12345678",
    nominals: [
      { label: "53 CP", price: 11000 },
      { label: "106 CP", price: 21000 },
      { label: "212 CP", price: 41000 },
      { label: "424 CP", price: 80000 },
      { label: "880 CP", price: 160000 },
      { label: "1320 CP", price: 238000 },
      { label: "2400 CP", price: 425000 },
      { label: "5000 CP", price: 850000 },
      { label: "10800 CP", price: 1700000 },
    ],
  },
  {
    slug: "magic-chess-go-go",
    name: "Magic Chess: Go Go",
    cur: "Diamond / Pass",
    range: "16 – 512 & Pass",
    logo: "/images/magic-chess-go-go.webp",
    logoWidth: 154,
    logoHeight: 62,
    logoStyle: "contain",
    alt: "Logo resmi Magic Chess: Go Go",
    tag: "Baru",
    heading: "Top Up Diamond & Pass Magic Chess: Go Go",
    copy: "Top up Diamond & Pass Magic Chess: Go Go ke User ID kamu, tanpa login akun.",
    hint: "User ID dan Zone ID ada di menu profil dalam game.",
    server: true,
    serverLabel: "Zone ID",
    user_id_label: "User ID",
    user_id_placeholder: "12345678",
    nominals: [
      { label: "16 Diamond", price: 4500 },
      { label: "32 Diamond", price: 8500 },
      { label: "64 Diamond", price: 16500 },
      { label: "128 Diamond", price: 32500 },
      { label: "256 Diamond", price: 64000 },
      { label: "512 Diamond", price: 127000 },
      { label: "Weekly Pass", price: 29000 },
      { label: "Season Pass", price: 89000 },
      { label: "Premium Pass", price: 159000 },
    ],
  },
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}
