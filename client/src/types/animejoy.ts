import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "../utils/routing";

// Shows related

export type ShowTitle = {
    ru: string;
    romanji: string;
};

export type FranchiseData = {
    label: string;
    type: "AVAILABLE" | "CURRENT" | "BLOCKED" | "NOT_AVAILABLE";
    url?: string;
}[];

export type StoryData = {
    title: ShowTitle;
    url: string;
    poster: string;
    status?: "FULL" | "ONGOING";
    description?: string;
    info: Array<{ label?: string; value: Array<{ text: string; url?: string; }>; }>;
    editDate?: string;
    categories: ShowCategory[];
    comments?: number;
};

export type ShowCategory = {
    path: string;
    name: string;
};
export type KnownShowCategory = typeof SHOW_CATEGORIES[number] | typeof HOME_AS_CATEGORY;