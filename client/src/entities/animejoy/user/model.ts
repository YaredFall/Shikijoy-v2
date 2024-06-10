import { z } from "zod";

export const AnimejoyUserSchema = z.object({
    url: z.string(),
    avatar: z.string(),
    nickname: z.string(),
    unreadMessages: z.string(),
});

export type AnimejoyUser = z.infer<typeof AnimejoyUserSchema>;