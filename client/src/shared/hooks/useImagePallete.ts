import isNullish from "@client/shared/lib/isNullish";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { extractColors } from "extract-colors";

async function getPallete(src: string) {
    try {
        const pallete = await extractColors(src, { crossOrigin: "anonymous", distance: 0.15, lightnessDistance: 0.2, hueDistance: 0.2 });
        console.log(pallete.toSorted((a, b) => b.area - a.area));
        return pallete.toSorted((a, b) => b.area - a.area);
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function preloadPallete(src: string, qc: QueryClient) {
    return qc.ensureQueryData({ queryKey: ["useImagePallete", src], queryFn: () => getPallete(src) });
}

export function useImagePallete(src: string | undefined) {

    const { data } = useQuery({
        queryKey: ["useImagePallete", src],
        queryFn: async () => {
            if (isNullish(src)) return undefined;

            return getPallete(src);
        },
    });

    return data;
}