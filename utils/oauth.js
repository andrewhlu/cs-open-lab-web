import config from "./config";
import { fetch } from "./fetch";
import { getSessionUser } from "./user";
import absoluteUrl from 'next-absolute-url';

const contexts = {
    discord: {
        authUri: "https://discord.com/api/oauth2/authorize",
        tokenUri: "https://discord.com/api/oauth2/token",
        clientId: config.DISCORD_CLIENT_ID,
        clientSecret: config.DISCORD_CLIENT_SECRET,
        scopes: "email identify guilds.join",
        tokenAuthInBody: true,
    },
    bot: {
        authUri: "https://discord.com/api/oauth2/authorize",
        clientId: config.DISCORD_CLIENT_ID,
        scopes: "bot",
        additionalParams: {
            permissions: config.DISCORD_BOT_PERMISSION,
        },
    },
};

export async function startAuth(context, req, res, sessionCookie) {
    if(!context) {
        res.statusCode = 400;
        res.end({ error: "No OAuth context was provided" });
        throw "No OAuth context was provided";
    } else if(!contexts[context]) {
        res.statusCode = 400;
        res.end({ error: "An invalid OAuth context was provided" });
        throw "An invalid OAuth context was provided";
    }

    const { origin } = absoluteUrl(req, 'localhost:3000');

    const urlParams = {
        response_type: "code",
        client_id: contexts[context].clientId,
        scope: contexts[context].scopes,
        redirect_uri: contexts[context].tokenUri ? origin + "/api/auth/redirect/" + context : "",
        state: sessionCookie,
    };

    Object.assign(urlParams, contexts[context].additionalParams);

    res.statusCode = 302;
    res.setHeader('Location', contexts[context].authUri + "?" + new URLSearchParams(urlParams).toString());
    res.end();
}

export async function callbackAuth(context, req) {
    if(!context) {
        throw "No OAuth context was provided";
    } else if(!contexts[context]) {
        throw "An invalid OAuth context was provided";
    }

    const { state, code, scope } = req.query;

    const session = await getSessionUser(state);

    if(!session) {
        throw "An invalid state was received";
    }

    const { origin } = absoluteUrl(req, 'localhost:3000');

    const body = {
        grant_type: "authorization_code",
        code: code,
        client_id: contexts[context].tokenAuthInBody ? contexts[context].clientId : null,
        client_secret: contexts[context].tokenAuthInBody ? contexts[context].clientSecret : null,
        redirect_uri: origin + "/api/auth/redirect/" + context,
    };

    const headers = {
        "Authorization": contexts[context].tokenAuthInBody ? null :  "Basic " + Buffer.from(contexts[context].clientId + ":" + contexts[context].clientSecret).toString('base64'),
        "Content-Type": contexts[context].jsonEncodedBody ? "application/json" : "application/x-www-form-urlencoded",
    };

    const options = {
        method: "POST",
        body: contexts[context].jsonEncodedBody ? JSON.stringify(body) : new URLSearchParams(body).toString(),
        headers: headers,
    };

    const response = await fetch(contexts[context].tokenUri, options);

    return response;
}

export async function refreshAuthToken(context, req, refreshToken) {
    if(!context) {
        throw "No OAuth context was provided";
    } else if(!contexts[context]) {
        throw "An invalid OAuth context was provided";
    } else if(!refreshToken) {
        throw "No refresh token was provided";
    }

    const { origin } = absoluteUrl(req, 'localhost:3000');

    const body = {
        client_id: contexts[context].tokenAuthInBody ? contexts[context].clientId : null,
        client_secret: contexts[context].tokenAuthInBody ? contexts[context].clientSecret : null,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        redirect_uri: origin + "/api/auth/redirect/" + context,
        scope: contexts[context].scopes,
    };

    const headers = {
        "Authorization": contexts[context].tokenAuthInBody ? null :  "Basic " + Buffer.from(contexts[context].clientId + ":" + contexts[context].clientSecret).toString('base64'),
        "Content-Type": contexts[context].jsonEncodedBody ? "application/json" : "application/x-www-form-urlencoded",
    };

    const options = {
        method: "POST",
        body: contexts[context].jsonEncodedBody ? JSON.stringify(body) : new URLSearchParams(body).toString(),
        headers: headers,
    };

    const response = await fetch(contexts[context].tokenUri, options);

    return response;
}
