import { deleteSession } from "../../../utils/session";
import absoluteUrl from 'next-absolute-url';

export default async function (req, res) {
  const { origin } = absoluteUrl(req, 'localhost:3000');

  if (req.cookies && req.cookies.SessionId) {
      await deleteSession(req.cookies.SessionId);

      let expiryDate = new Date(1);

      res.statusCode = 302;
      res.setHeader("Set-Cookie", `SessionId=${req.cookies.SessionId}; Path=/; Expires=${expiryDate.toUTCString()}; HttpOnly; SameSite;`);
      res.setHeader("Location", `https://sso.ucsb.edu/cas/logout?service=${encodeURIComponent(`${origin}`)}`);
      res.end();
  } else {
      // A session ID is not present
      res.statusCode = 400;
      res.end("No Session ID present");
  }
}
