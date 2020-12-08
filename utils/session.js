import { ObjectId } from "mongodb";
import { initDatabase, serializeDocument } from "./mongodb";
import { getSessionUser } from "./user";
import { updateDiscordUser } from "./discord";
import absoluteUrl from 'next-absolute-url';

export async function getSession(req, res) {
    const { protocol, host } = absoluteUrl(req, '');
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    let sessionCookie = null;
    let session = null;

    if (req.headers.cookie?.indexOf("SessionId") >= 0) {
        sessionCookie = req.headers.cookie?.substr(req.headers.cookie?.indexOf("SessionId") + 10, 24);
    }

    if (sessionCookie) {
        console.log(`Session ID is present: ${sessionCookie}`);

        session = await getSessionUser(sessionCookie);

        // Update user's Discord information (including access token)
        if (session?.discordAccessToken === undefined && session?.user?.discord?.refreshToken !== undefined) {
            try {
                session.user.discord = updateDiscordUser(sessionCookie, session.uid, session.user.discord.refreshToken);
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

        session = {
            expires: expiryDate.getTime()
        };

        const result = await sessions.insertOne(session);
        session._id = result.insertedId;
        sessionCookie = result.insertedId;
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
        _id: ObjectId(sessionCookie)
    }, update);
}

export async function deleteSession(sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");
    
    return await sessions.deleteOne({
        _id: ObjectId(sessionCookie)
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
        _id: ObjectId(sessionCookie)
    }, update);
}