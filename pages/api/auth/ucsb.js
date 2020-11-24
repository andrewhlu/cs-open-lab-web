import { getSessionUser } from "../../../utils/user";
import absoluteUrl from 'next-absolute-url';

export default async function startAuth(req, res) {
    let sessionCookie;
    if (req.cookies && req.cookies.SessionId) {
        sessionCookie = req.cookies.SessionId;

        let session = await getSessionUser(sessionCookie);

        if (session && session.uid === undefined) {
            // This is a new session, proceed to login
            const { origin } = absoluteUrl(req, 'localhost:3000');
            const authUrl = `https://sso.ucsb.edu/cas/login?service=${encodeURIComponent(`${origin}/api/auth/redirect/ucsb`)}`;

            res.statusCode = 302;
            res.setHeader("Location", authUrl);
            res.end();
        } else if (session.uid !== undefined) {
            // This session is already tied to a user
            res.statusCode = 400;
            res.end("This session is already tied to a user.");
        }
    } else {
        // A session ID is not present
        res.statusCode = 400;
        res.end("No Session ID present");
    }
}
