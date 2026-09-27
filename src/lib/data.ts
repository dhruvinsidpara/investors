// Mock data mirroring the content shown in the Figma designs.
// Replace with API calls once a backend is available.

export type Status = "Active" | "Inactive";
export type ApprovalStatus = "Approved" | "Pending" | "Rejected" | "Re-submit";

export const currentUser = {
  id: "IN001",
  name: "Hawkins Strong",
  role: "Investor",
  email: "h.strong@vestora.com",
  phone: "+1-541-754-3010",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
  totalInvested: 320_000_000,
  totalInvestments: 14,
  totalProperties: 35,
};

export const formatCurrency = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/* ---------------------------------- Investments ---------------------------------- */

export type Investment = {
  id: string;
  name: string;
  entity: string;
  date: string;
  amount: number;
  capRate: string;
  ror: string;
  coc: string;
  irr: string;
  prefReturn: string;
  status: Status;
};

const investmentNames = ["Ralph Edwards", "Devils Lounge", "Fox LLC", "Lawrence Avenue", "Big Bird", "Beach Side Courtyard", "Fisherman"];
const entityNames = ["Guy Hawkins", "Fireman LLC", "Lawrence Avenue LLC", "Bill Board"];

export const investments: Investment[] = Array.from({ length: 14 }, (_, i) => {
  const inactive = i === 3 || i === 9;
  return {
    id: `AC${String(i + 1).padStart(5, "0")}`,
    name: investmentNames[i % investmentNames.length],
    entity: entityNames[i % entityNames.length],
    date: `${(i % 9) + 1}/2/19`,
    amount: 3_500_000 + (i % 4) * 250_000,
    capRate: "6.8%",
    ror: inactive ? "-" : `${10 + (i % 3)}%`,
    coc: inactive ? "-" : `${7 + (i % 3)}%`,
    irr: inactive ? "-" : `${4 + (i % 3)}%`,
    prefReturn: inactive ? "-" : "6.8%",
    status: inactive ? "Inactive" : "Active",
  };
});

/* ---------------------------------- Distributions ---------------------------------- */

export type Distribution = {
  id: string;
  investment: string;
  entity: string;
  date: string;
  received: number;
  expected: number;
  type: "Quarterly" | "Monthly" | "Annual";
  proof: "Approved" | "Pending" | "Upload";
  late?: boolean;
};

export const distributions: Distribution[] = Array.from({ length: 12 }, (_, i) => ({
  id: `AC${String(i + 1).padStart(5, "0")}`,
  investment: investmentNames[i % investmentNames.length],
  entity: entityNames[i % entityNames.length],
  date: `${(i % 9) + 1}/2/19`,
  received: 3_500_000 - (i % 3) * 500_000,
  expected: 3_500_000,
  type: i % 4 === 3 ? "Monthly" : "Quarterly",
  proof: i % 3 === 1 ? "Pending" : i % 5 === 4 ? "Upload" : "Approved",
  late: i % 4 === 2,
}));

export const distributionSummary = {
  actual: 8_000_000,
  expected: 11_000_000,
  projected: 14_000_000,
  max: 15_000_000,
};

export const monthlyDistributions = [
  { month: "Jan", name: "Devils Lounge", value: 36, total: 50 },
  { month: "Feb", name: "Fox LLC", value: 25, total: 50 },
  { month: "Jun", name: "Lawrence Avenue", value: 45, total: 50 },
  { month: "Aug", name: "Lawrence Avenue", value: 36, total: 50 },
  { month: "Sep", name: "Lawrence Avenue", value: 41, total: 50 },
  { month: "Oct", name: "Lawrence Avenue", value: 28, total: 50 },
];

export const investmentTypes = [
  { name: "Multifamily", value: 26, color: "#FF1F1F" },
  { name: "Retail", value: 10, color: "#5CB6D6" },
  { name: "Office", value: 11, color: "#71DBD3" },
  { name: "Hospitality", value: 8, color: "#2BD49A" },
  { name: "Industrial", value: 7, color: "#27C45B" },
  { name: "Self Storage", value: 7, color: "#1FA43A" },
  { name: "Land", value: 5, color: "#F57C00" },
  { name: "Senior Living", value: 7, color: "#8CCFF7" },
  { name: "Student Housing", value: 7, color: "#8898EA" },
  { name: "Mixed Use", value: 8, color: "#1D84E0" },
];

/* ---------------------------------- Properties ---------------------------------- */

export type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  units: string;
  builtYear: number;
  loan: string;
  noi: number;
  sponsor: string;
  group: "Investments" | "Entities";
  images: string[];
  estimatedValue: number;
  outstandingLoan: number;
  debtService: number;
};

const propertyImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&fit=crop",
];

const propertyNames = ["Lawrence Avenue", "Beach Side Courtyard", "Cliff Beach Side", "St. Johns", "Fisherman Wharf", "Devils Lounge", "Big Bird Towers"];

export const properties: Property[] = propertyNames.map((name, i) => ({
  id: `AC0${i + 1}`,
  name,
  address: `${100 + i * 12}, Main Street,`,
  city: "Bronx, NY",
  type: i % 3 === 2 ? "Retail" : "Multi Family",
  units: `${145 - i * 5} Units`,
  builtYear: 2015 - (i % 4),
  loan: i % 2 ? "$1,000,000" : "Null",
  noi: 78_004 + i * 1_250,
  sponsor: i % 2 ? "Cary Berry" : "Gary Vino",
  group: i % 2 ? "Entities" : "Investments",
  images: [...propertyImages.slice(i % 5), ...propertyImages.slice(0, i % 5)],
  estimatedValue: 60_000_000 - i * 2_500_000,
  outstandingLoan: 1_000_000,
  debtService: 10_000,
}));

export const noiRecords = [
  { name: "Noi", amount: 5_000_000, year: 2021, type: "Actual", document: "NY001_Actual_2021.pdf" },
  { name: "Noi", amount: 5_000_000, year: 2020, type: "Actual", document: "NY001_Actual_2020.pdf" },
  { name: "Noi", amount: 5_000_000, year: 2019, type: "Actual", document: "NY001_Actual_2019.pdf" },
  { name: "Noi", amount: 4_800_000, year: 2022, type: "Projected", document: "NY001_Projected_2022.pdf" },
  { name: "Noi", amount: 4_500_000, year: 2023, type: "Projected", document: "NY001_Projected_2023.pdf" },
];

/* ---------------------------------- Entities ---------------------------------- */

export type Entity = {
  id: string;
  name: string;
  investments: string[];
  taxId: string;
  address: string;
  partners: string[];
  status: Status;
};

export const entities: Entity[] = [
  { id: "EN00001", name: "Lawrence Avenue", investments: ["Fireman LLC", "Fox LLC", "Big Bird"], taxId: "XXXXX123", address: "19502 Sierra, Irvine, CA, US", partners: ["Franklin Smith", "Irvin Tech", "Robert Stanly"], status: "Active" },
  { id: "EN00002", name: "Lawrence Avenue LLC", investments: ["Lawrence", "Fox LLC", "Big Bird"], taxId: "XXXXX123", address: "19502 Sierra, Irvine, CA, US", partners: ["Franklin Smith", "Smith Johns"], status: "Active" },
  { id: "EN00003", name: "Bill Board", investments: ["Bill Board", "Fox LLC", "Big Bird"], taxId: "XXXXX123", address: "19502 Sierra, Irvine, CA, US", partners: ["Franklin Smith"], status: "Inactive" },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `EN${String(i + 4).padStart(5, "0")}`,
    name: i % 2 ? "Fireman LLC" : "Lawrence Avenue",
    investments: ["Fireman LLC", "Fox LLC", "Big Bird"],
    taxId: "XXXXX123",
    address: "19502 Sierra, Irvine, CA, US",
    partners: ["Franklin Smith", "Irvin Tech", "Robert Stanly"],
    status: "Active" as Status,
  })),
];

/* ---------------------------------- Sponsors ---------------------------------- */

export type Sponsor = {
  id: string;
  name: string;
  company: string;
  recentDeal: string;
  email: string;
  phone: string;
  active: boolean;
};

const sponsorNames = ["Cary Berry", "Gary Vino", "Jenny Wilson", "Cody Fisher", "Esther Howard", "Guy Hawkins"];
export const sponsors: Sponsor[] = Array.from({ length: 10 }, (_, i) => {
  const name = sponsorNames[i % sponsorNames.length];
  return {
    id: `AC${String(i + 1).padStart(5, "0")}`,
    name,
    company: i % 3 === 2 ? "Estate Brokers" : "Ace Real estate",
    recentDeal: propertyNames[i % propertyNames.length],
    email: `${name.toLowerCase().replace(" ", ".")}@vestora.com`,
    phone: "+91-1234567890",
    active: i % 4 !== 3,
  };
});

/* ---------------------------------- Documents ---------------------------------- */

export type DocumentRecord = {
  id: string;
  name: string;
  category: "K1" | "Distribution Notice" | "Agreement" | "Other";
  property: string;
  entity: string;
  investment: string;
  date: string;
};

export const documents: DocumentRecord[] = [
  { id: "d1", name: "K1-July 2021", category: "K1", property: "Lawrence Beach", entity: "Ace Real Estate", investment: "Big Bird", date: "07/21/2020" },
  { id: "d2", name: "Distribution Notice", category: "Distribution Notice", property: "Lawrence Beach", entity: "Ace Real Estate", investment: "Big Bird", date: "07/21/2020" },
  { id: "d3", name: "K1-June 2020", category: "K1", property: "Lawrence Beach", entity: "Ace Real Estate", investment: "Big Bird", date: "07/21/2020" },
  { id: "d4", name: "K1 2020", category: "K1", property: "Lawrence Beach", entity: "Ace Real Estate", investment: "Big Bird", date: "07/21/2020" },
  { id: "d5", name: "K1 2020", category: "K1", property: "Cliff Beach Side", entity: "Ace Real Estate", investment: "Devils Lounge", date: "07/21/2020" },
  { id: "d6", name: "Distributions Gary Chaulk", category: "Distribution Notice", property: "St. Johns", entity: "Estate Brokers", investment: "Mark LLC", date: "07/21/2020" },
  { id: "d7", name: "Account Statement", category: "Agreement", property: "Lawrence Beach", entity: "Ace Real Estate", investment: "Big Bird", date: "07/21/2020" },
  { id: "d8", name: "Subscription Agreement", category: "Agreement", property: "Fisherman Wharf", entity: "Estate Brokers", investment: "Fox LLC", date: "06/11/2020" },
];

/* ---------------------------------- Manage data ---------------------------------- */

export type DataSet = {
  id: string;
  name: string;
  group: "Investments" | "Distributions" | "Others";
  uploadDate: string;
  comments: string;
  status: ApprovalStatus;
};

export const dataSets: DataSet[] = [
  { id: "m1", name: "London City Data", group: "Investments", uploadDate: "07/21/2020", comments: "-", status: "Approved" },
  { id: "m2", name: "New York States Investments", group: "Investments", uploadDate: "07/21/2020", comments: "-", status: "Approved" },
  { id: "m3", name: "States Investments", group: "Distributions", uploadDate: "07/21/2020", comments: "Add Real Estate", status: "Re-submit" },
  { id: "m4", name: "Data", group: "Others", uploadDate: "07/21/2020", comments: "Data mapping failed", status: "Rejected" },
  { id: "m5", name: "City Data", group: "Distributions", uploadDate: "07/21/2020", comments: "Add Real Estate", status: "Pending" },
  { id: "m6", name: "London City Data", group: "Others", uploadDate: "07/21/2020", comments: "Add Real Estate", status: "Pending" },
];

/* ---------------------------------- Contacts ---------------------------------- */

export type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  designation: string;
  investments: string[];
  phone: string;
};

export const contacts: Contact[] = Array.from({ length: 10 }, (_, i) => ({
  id: `C${String(i + 1).padStart(3, "0")}`,
  name: ["Ralph Edwards", "Jane Cooper", "Wade Warren", "Kristin Watson", "Jacob Jones"][i % 5],
  company: i % 3 === 0 ? "Investopedia Edwards" : "Royal Bank",
  email: `${["edwards", "jane", "wade", "kristin", "jacob"][i % 5]}@gmail.com`,
  designation: i % 4 === 3 ? "Director" : "Manager",
  investments: ["Fireman LLC", "Fox LLC", "Big Bird"],
  phone: "+1-541-754-3010",
}));

/* ---------------------------------- Notifications ---------------------------------- */

export type NotificationItem = {
  id: string;
  kind: "distribution" | "approved" | "resubmit" | "comment";
  text: string;
  date: string;
  read?: boolean;
};

export const notifications: NotificationItem[] = [
  { id: "n1", kind: "distribution", text: "Received 8% distributions from Big Bird", date: "Feb 20, 2021, 10:45 Am" },
  { id: "n2", kind: "approved", text: "Distribution proof approved for wire transfer $13,000 from Big Bird", date: "Feb 20, 2021, 10:45 Am" },
  { id: "n3", kind: "resubmit", text: 'Request to resubmit data set with file name "Data set - New City"', date: "Feb 20, 2021, 10:45 Am" },
  { id: "n4", kind: "distribution", text: "Received 12% distributions from Big Bird, request to upload distribution proof", date: "Feb 20, 2021, 10:45 Am", read: true },
  { id: "n5", kind: "comment", text: "Comment added on Capital Database row", date: "Feb 20, 2021, 10:45 Am", read: true },
];

/* ---------------------------------- Profile entities ---------------------------------- */

export const profileEntities = [
  {
    name: "Lawrence Avenue",
    mailingAddress: "19502 Sierra, Irvine, California, United States of America",
    taxId: "XXXXXX4978",
    investments: "Lawrence Avenue, Fisherman, Beach Side Courtyard +3",
    partners: ["Irvin Tech", "Smith Johns", "Robert Stanly"],
  },
  {
    name: "Fireman LLC",
    mailingAddress: "19502 Sierra, Irvine, California, United States of America",
    taxId: "XXXXXX4978",
    investments: "Lawrence Avenue, Fisherman, Beach Side Courtyard +3",
    partners: ["Irvin Tech", "Smith Johns", "Robert Stanly"],
  },
];

export const settingsOptions = [
  { id: "s1", label: "SMS notification for all file updates", sms: true, email: true },
  { id: "s2", label: "Send me email when I receive any distributions", sms: true, email: true },
  { id: "s3", label: "Send me email if I need to upload distribution proofs", sms: false, email: true },
  { id: "s4", label: "Notify me if I miss the distributions", sms: false, email: true },
];
