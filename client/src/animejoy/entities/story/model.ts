import { ShowTitle } from "@/animejoy/entities/show/model";
import { ShowCategory } from "@/shared/routing/category";


export type ShowStory = {
    title: ShowTitle;
    url: string;
    poster: string;
    status?: "FULL" | "ONGOING";
    description?: string;
    info: Array<{ label?: string; value: Array<{ text: string; url?: string; }>; }>;
    editDate?: string;
    categories: Array<{
        label: string;
        path: ShowCategory | string;
    }>;
    comments?: number;
};