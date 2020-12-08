import { getSessionUser, addDiscordToUser, getUserFromDiscordId } from "../../../../utils/user";
import { addDiscordAccessTokenToSession } from "../../../../utils/session";
import { callbackAuth } from "../../../../utils/oauth";
import { fetch } from "../../../../utils/fetch";

export default async function(req, res) {
    const baseUrl = "https://discord.com/api";

    try {
        // Check if a session cookie is present
        if (req?.cookies?.SessionId === undefined) {
            throw "No session ID is present";
        }

        const sessionCookie = req.cookies.SessionId;

        // Get current session user
        let session = await getSessionUser(sessionCookie);
        if (!session || session?.uid === undefined) {
            throw "Invalid session data";
        }

        // Finish the OAuth flow
        const oauthResult = await callbackAuth("discord", req);
        console.log(oauthResult);

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
        console.log(discordUser);

        if (discordUser?.error) {
            // Request to get user failed, redirect with the error message
            throw discordUser?.error_description;
        }

        // Check if this Discord account is already being used
        const userIfExists = await getUserFromDiscordId(discordUser.id);
        if (userIfExists !== null) {
            // This Discord account is already being used, throw an error
            throw "This Discord account is already in use by another user";
        }

        // Store Discord user and refresh token
        await addDiscordToUser(session.uid, discordUser, oauthResult.refresh_token);

        // Store Discord access token in session
        await addDiscordAccessTokenToSession(oauthResult.access_token, sessionCookie);

        // const url = `${baseUrl}/guilds/${config.DISCORD_GUILD_ID}/members/${}`
        // const response = await fetch()

        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    }
    catch (error) {
        console.log(error);
        res.writeHead(302, {
            'Location': `/?error=An error occurred: ${error}`
        });
        res.end();
    }
}
