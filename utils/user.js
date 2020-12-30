import { ObjectId } from "mongodb";
import { initDatabase } from "./mongodb";

export async function getSessionUser(sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    const agg = [
        {
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                state: sessionCookie,
            },
        }
    ];

    const result = await sessions.aggregate(agg).toArray();
    return result[0];
}

export async function getUserFromUid(uid) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.findOne({
        _id: ObjectId(uid)
    });
}

export async function getUserFromCampusId(campusId) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.findOne({
        campusId: campusId
    });
}

export async function createUser(user) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.insertOne(user);
}

export async function updateUserFromSSO(uid, user) {
    const client = await initDatabase();
    const sessions = client.collection("users");

    const update = {
        $set: user
    }

    return await sessions.updateOne({ 
        _id: ObjectId(uid)
    }, update);
}

export async function getUserFromDiscordId(discordId) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.findOne({
        discord: {
            user: {
                id: discordId
            }
        }
    });
}

export async function addDiscordToUser(uid, user, refreshToken) {
    const client = await initDatabase();
    const sessions = client.collection("users");

    const update = {
        $set: {
            discord: {
                user: user,
                refreshToken: refreshToken
            }
        }
    }

    return await sessions.updateOne({ 
        _id: ObjectId(uid)
    }, update);
}

export async function addFnameLnamePronouns(uid, fname, lname, pronouns) {
    const client = await initDatabase();
    const sessions = client.collection("users");

    const update = {
        $set: {
            fname: fname,
            lname: lname,
            pronouns: pronouns
        }
    }

    return await sessions.updateOne({ 
        _id: ObjectId(uid)
    }, update);
}
