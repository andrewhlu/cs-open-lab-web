import { ObjectId } from "mongodb";
import { initDatabase, serializeDocument } from "./mongodb";
import { getSessionUser } from "./user";
import { updateDiscordUser } from "./discord";
import crypto from 'crypto';

export async function getSession(req, res) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    let sessionCookie = null;
    let session = null;

    if (req.headers.cookie?.indexOf("SessionId") >= 0) {
        req.headers.cookie += ";";
        let cookieIndex = req.headers.cookie.indexOf("SessionId");
        sessionCookie = req.headers.cookie?.substring(cookieIndex + 10, req.headers.cookie?.indexOf(";", cookieIndex));
    }

    if (sessionCookie) {
        console.log(`Session ID is present: ${sessionCookie}`);

        session = await getSessionUser(sessionCookie);

        // Update user's Discord information (including access token)
        if (session?.discordAccessToken === undefined && session?.user?.discord?.refreshToken !== undefined) {
            try {
                session.user.discord.user = await updateDiscordUser(req, sessionCookie, session.uid, session.user.discord.refreshToken);
            } catch(error) {
                console.log(error);
            }
        }

        if (session.expires < Date.now()) {
            // This session has expired, delete it
            console.log("Expired session");
            await deleteSession(session._id);
            session = null;
        }
    } 
    
    if (!session) {
        console.log("No Session ID present");

        // Generate new session cookie
        sessionCookie = crypto.randomBytes(16).toString('hex')

        session = {
            state: sessionCookie,
            expires: expiryDate.getTime()
        };

        const result = await sessions.insertOne(session);
        session._id = result.insertedId;
    }

    res.setHeader("Set-Cookie", `SessionId=${sessionCookie}; Path=/; Expires=${expiryDate.toUTCString()}; HttpOnly; SameSite;`);

    return serializeDocument(session);
}

export async function addUidToSession(uid, sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    const update = {
        $set: {
            uid: ObjectId(uid)
        }
    }

    return await sessions.updateOne({ 
        state: sessionCookie
    }, update);
}

export async function deleteSession(sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");
    
    return await sessions.deleteOne({
        state: sessionCookie
    });
}

export async function addDiscordAccessTokenToSession(accessToken, sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    const update = {
        $set: {
            discordAccessToken: accessToken
        }
    }

    return await sessions.updateOne({ 
        state: sessionCookie
    }, update);
}