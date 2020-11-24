import { createUser, getSessionUser, getUserFromCampusId } from "../../../../utils/user";
import { fetchXml } from "../../../../utils/fetch";
import { addUidToSession } from "../../../../utils/session";
import absoluteUrl from 'next-absolute-url';
import xml2js from "xml-js";

export default async function completeAuth(req, res) {
    const ticket = req.query.ticket;

    let sessionCookie;
    let status;

    if (req.cookies?.SessionId) {
        sessionCookie = req.cookies.SessionId;

        let session = await getSessionUser(sessionCookie);

        if (session?.uid === undefined) {
            // This is a new session, complete login
            const response = await validateTicket(req, ticket);

            if (response.success) {
                // Check if this user is already in our database
                let databaseUser = await getUserFromCampusId(response.user.campusId);

                if (!databaseUser) {
                    // Add user to database
                    const createResponse = await createUser(response.user);
                    databaseUser = response.user;
                    databaseUser._id = createResponse.insertedId;

                    console.log("Database user");
                    
                }

                // Attach user ID to session
                await addUidToSession(databaseUser._id, sessionCookie);

                status = {
                    success: true,
                    error: ""
                };
            } else {
                status = response;
            }
        } else {
            // User is already logged in
            status = {
                success: false,
                error: "You are already logged in!"
            };
        }
    } else {
        // A session ID is not present
        status = {
            success: false,
            error: "No Session ID was present. Please try again!"
        };
    }

    res.statusCode = 302;
    res.setHeader("Location", `/?success=${status.success}&error=${status.error}`);
    res.end();
}

async function validateTicket(req, ticket) {
    const { origin } = absoluteUrl(req, 'localhost:3000');
    const response = await fetchXml(`https://sso.ucsb.edu/cas/p3/serviceValidate?service=${encodeURIComponent(`${origin}/api/auth/redirect/ucsb`)}&ticket=${ticket}`);
    return parseUserFromXml(response);
}

function parseUserFromXml(xml) {
    const json = xml2js.xml2js(xml, { compact: true });

    if (json["cas:serviceResponse"] === undefined) {
        // This is not a valid CAS response
        return {
            success: false,
            error: "Invalid CAS Response"
        };
    } else if (json["cas:serviceResponse"]["cas:authenticationFailure"] !== undefined) {
        // Ticket validation failed
        return {
            success: false,
            error: `Ticket validation failed: ${json["cas:serviceResponse"]["cas:authenticationFailure"]["_text"]}`
        }
    } else {
        // Ticket validation succeeded
        let user = {};
        user.netId = json["cas:serviceResponse"]["cas:authenticationSuccess"]["cas:user"]["_text"];

        const attributes = json["cas:serviceResponse"]["cas:authenticationSuccess"]["cas:attributes"];
        if (attributes !== undefined) {
            user.fname = attributes["cas:givenName"]?.["_text"]; // may be null
            user.lname = attributes["cas:sn"]?.["_text"]; // may be null
            user.email = attributes["cas:mail"]?.["_text"];
            user.campusId = attributes["cas:ucsbCampusID"]?.["_text"];
        }

        return {
            success: true,
            user: user
        };
    }
}
