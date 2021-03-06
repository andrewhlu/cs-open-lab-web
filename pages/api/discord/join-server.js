import { getSessionUser, addFnameLnamePronouns } from "../../../utils/user";
import { fetch, fetchRaw } from "../../../utils/fetch";
import config from "../../../utils/config";

export default async function(req, res) {
    if (req.method !== "POST") {
        res.statusCode = 405;
        return res.end();
    }

    const { fname, lname, pronouns } = req.body;
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
        
        const accessToken = session?.discordAccessToken;
        if (accessToken === undefined) {
           throw "User does not have a Discord Access Token";
        }

        const discordId = session?.user?.discord?.user?.id;
        if (discordId === undefined) {
            throw "Cannot find user's Discord ID";
        }

        // Save user's first and last name in database
        await addFnameLnamePronouns(session.uid, fname, lname, pronouns);

        // Get user object from CS Open Lab Guild
        const guildMemberUrl = `${baseUrl}/guilds/${config.DISCORD_GUILD_ID}/members/${discordId}`;
        const guildMemberOptions = {
            method: "GET",
            headers: {
                "Authorization": `Bot ${config.DISCORD_BOT_TOKEN}`
            }
        };
        
        const allGuilds = await fetch(guildMemberUrl, guildMemberOptions);

        let isNewGuildMember = false;
        if (allGuilds?.message !== undefined && allGuilds?.code !== 10007) {
            throw allGuilds.message;
        } else if (allGuilds?.message !== undefined && allGuilds?.code === 10007) {
            isNewGuildMember = true;
        }

        // Add student role
        let roles = allGuilds?.roles;

        if (Array.isArray(roles) && !roles.includes(`${config.DISCORD_STUDENT_ROLE_ID}`)) {
            roles.push(`${config.DISCORD_STUDENT_ROLE_ID}`);
        } else if (!Array.isArray(roles)) {
            roles = [`${config.DISCORD_STUDENT_ROLE_ID}`];
        }

        // Add the user to the CS Open Lab Guild with the Student role
        const addMemberUrl = `${baseUrl}/guilds/${config.DISCORD_GUILD_ID}/members/${discordId}`;
        const addMemberOptions = {
            // PUT request to add member, PATCH request to modify member
            method: isNewGuildMember ? "PUT" : "PATCH",
            headers: {
                "Authorization": `Bot ${config.DISCORD_BOT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: accessToken,
                nick: `${fname} ${lname}${pronouns ? ` (${pronouns})` : ""}`.replace(/^\s+|\s+$|\s+(?=\s)/g, ""),
                roles: roles
            })
        };

        console.log(addMemberOptions)

        const addResponse = await fetchRaw(addMemberUrl, addMemberOptions);
        console.log("status " + addResponse.status)
        if (addResponse.status !== (isNewGuildMember ? 201 : 204)) {
            console.log(addResponse.json())
            throw "Failed to add user to CS Open Lab server";
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true
        }));
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
