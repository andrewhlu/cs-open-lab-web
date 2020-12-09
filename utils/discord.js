import { addDiscordToUser } from "./user";
import { addDiscordAccessTokenToSession } from "./session";
import { refreshAuthToken } from "./oauth";
import { fetch } from "./fetch";

export async function updateDiscordUser(req, sessionCookie, uid, refreshToken) {
    const baseUrl = "https://discord.com/api";

    const oauthResult = await refreshAuthToken("discord", req, refreshToken);
    if (oauthResult?.error) {
        // OAuth failed, redirect with the error message
        throw oauthResult?.error_description;
    }

    // Get user info from Discord
    const userUrl = `${baseUrl}/users/@me`;
    const userReqOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${oauthResult.access_token}`
        }
    }

    const discordUser = await fetch(userUrl, userReqOptions);

    if (discordUser?.error) {
        // Request to get user failed, redirect with the error message
        throw discordUser?.error_description;
    }

    // Store Discord user and refresh token
    await addDiscordToUser(uid, discordUser, oauthResult.refresh_token);

    // Store Discord access token in session
    await addDiscordAccessTokenToSession(oauthResult.access_token, sessionCookie);

    return discordUser;
}
