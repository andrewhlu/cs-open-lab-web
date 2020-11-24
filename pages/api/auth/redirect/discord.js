import { callbackAuth } from "../../../../utils/oauth";

export default async function(req, res) {
    let result;
    
    try {
        result = await callbackAuth("discord", req);

        console.log(result);
        res.writeHead(302, {
            'Location': '/'
            //add other headers here...
        });
        res.end();

        // res.statusCode = 200;
        // res.setHeader("Content-Type", "application/json");
        // res.end(JSON.stringify(result));
    }
    catch (error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(error));
    }
}
