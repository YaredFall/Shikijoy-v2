import { auth } from "node-shikimori";

// export type AuthResponse = {
//     access_token: string;
//     token_type: "Bearer";
//     expires_in: number;
//     refresh_token: string;
//     scope: string;
//     created_at: number;
// };

export const { getAccessToken, refreshAccessToken } = auth({
    clientName: process.env.SHIKIMORI_CLIENT_NAME!,
    clientId: process.env.SHIKIMORI_OAUTH_CLIENT_ID!,
    clientSecret: process.env.SHIKIMORI_OAUTH_CLIENT_SECRET!,
    redirectURI: process.env.SHIKIMORI_OAUTH_REDIRECT_URL!,
});