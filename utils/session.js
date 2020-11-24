import { ObjectId } from "mongodb";
import { initDatabase, serializeDocument } from "./mongodb";
import { getSessionUser } from "./user";

export async function getSession(req, res) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    let sessionCookie = req.headers.cookie?.substr(10);
    let session;

    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    if (sessionCookie) {
        console.log(`Session ID is present: ${sessionCookie}`);

        const result = await getSessionUser(sessionCookie);
        session = result[0];

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

    res.setHeader("Set-Cookie", `SessionId=${sessionCookie}; Expires=${expiryDate.toUTCString()}; HttpOnly; SameSite;`);

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