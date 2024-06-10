export type ShowTitle = {
    ru: string;
    romanji: string;
};

export type FranchiseData = {
    label: string;
    type: "AVAILABLE" | "CURRENT" | "BLOCKED" | "NOT_AVAILABLE";
    url?: string;
}[];