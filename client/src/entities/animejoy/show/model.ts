export type ShowTitle = {
    ru: string;
    romanji: string;
};

export type ShowInfo = Array<{ label?: string; value: Array<{ text: string; url?: string; }>; }>;

export type FranchiseData = {
    label: string;
    type: "AVAILABLE" | "CURRENT" | "BLOCKED" | "NOT_AVAILABLE";
    url?: string;
}[];