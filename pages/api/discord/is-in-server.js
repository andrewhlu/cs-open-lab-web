import { getSessionUser } from "../../../utils/user";
import { fetch } from "../../../utils/fetch";
import config from "../../../utils/config";

export default async function(req, res) {
    const baseUrl = "https://discord.com/api";

    try {
        // Check if a session cookie is present
        if (req?.cookies?.SessionId === undefined) {
            throw "No session ID is present";
        }

        const sessionCookie = req.cookies.SessionId;

        // Get current session user
        const session = await getSessionUser(sessionCookie);
        if (!session || session?.uid === undefined) {
            throw "Invalid session data";
        } 
        
        // Check if this user has a Discord Access Token
        const accessToken = session?.discordAccessToken;
        if (accessToken === undefined) {
           throw "User does not have a Discord Access Token";
        }

        // Determine if user is in CS Open Lab guild
        const url = `${baseUrl}/users/@me/guilds`;
        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        };

        const allGuilds = await fetch(url, options);
        const guild = allGuilds.filter(g => {
            return g.id === config.DISCORD_GUILD_ID;
        })[0];

        if (guild === undefined) {
            // User is not in guild
            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                inGuild: false
            }));
        } else {
            // User is in guild
            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                inGuild: true
            }));
        }
    }
    catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.end(JSON.stringify({
            success: false,
            error: error
        }));
    }
}
