import { startAuth } from "../../../utils/oauth";

export default async function(req, res) {
    const { context } = req.query;

    if (req?.cookies?.SessionId) {
        startAuth(context, req, res, req.cookies.SessionId)
    } else {
        // A session ID is not present
        res.statusCode = 400;
        res.end("No Session ID present");
    }
}
