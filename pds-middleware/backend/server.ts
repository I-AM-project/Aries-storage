import express, { Express, Handler, Request, Response } from "express";
import readMyData from "./serverFunctions/my-data/readMyData";
import { readMyCerts } from "./serverFunctions/my-certs/readMyCerts"
import bodyParser from 'body-parser'
import createMyData from "./serverFunctions/my-data/createMyData";
import deleteMyData from "./serverFunctions/my-data/deleteMyData";
import createRSAKeyPair from "./serverFunctions/my-certs/rsaKeyGen";
import { updateMyData } from "./serverFunctions/my-data/updateMyData";
import createNewUser from "./serverFunctions/my-data/createNewUser";
import { current_mapping, production } from './serverConfig'
import { createLogger, format, transports } from 'winston'
import { createNewCredentials, createWallet } from "./wallet"
import 'dotenv/config'


import path from "path"
import fs from "fs"


var https = require('https');


const app = express();
var router = express.Router();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.use(express.static(path.join(__dirname, "../frontend", "build")));
app.use(express.static("public"));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});

const logger = createLogger({
    transports: [
        new transports.File({
            dirname: "logs",
            filename: "server.log",
        }),
    ],
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
});


app.use('/', router)


if (production) {
    let certificate = fs.readFileSync(`${process.env.SSL_CERT}`, 'utf8');
    let privateKey = fs.readFileSync(`${process.env.SSL_PRIVATE_KEY}`, 'utf8');

    let credentials = {
        key: privateKey,
        cert: certificate
    };
    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(443, async () => {
        logger.info("Started Server");
        console.log(`Aries PDS Middleware software listening on port in Production mode ${443}`);
    });
} else {
    app.listen(80, () => {
        console.log(`Aries PDS Middleware software listening on port in testing Mode ${80}`);
    })
}



//////////////////////////////////
// Credentials Endpoints
/////////////////////////////////

app.post('/createWalletKeyPair', (request: Request<string, any>, response: Response) => {
    try {
        logger.info("URL:" + request.url + " |  METHOD:" + request.method + " |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        createRSAKeyPair(request.body.person, request.body.keyPairName, request.body.passphrase, (result) => {
            if (result.success) {
                response.status(200).send(result.data)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send(result.data)
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})

app.get('/readMyCerts', (request: Request, response: Response) => {
    try {
        logger.info("URL:" + request.url + " |  METHOD:" + request.method + " |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        readMyCerts((result) => {
            if (result.success) {
                response.status(200).send(result.data)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send(result.data)
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})


//////////////////////////////////
// My Data Endpoints
/////////////////////////////////

interface createMyDataBody {
    person: string,
    attribute: string,
    cert: string,
    value: string
}

app.post('/createNewUser', (request: Request<string, createMyDataBody>, response: Response) => {
    try {
        logger.info("URL:" + request.url + " METHOD:" + request.method + " Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        createNewUser((result) => {
            if (result.success) {
                response.status(200).send(result.data)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send("Could not create person")
            }
        })
    } catch (error) {
        logger.error(error);
    }

})

app.post('/createMyData', (request: Request<string, createMyDataBody>, response: Response) => {
    try {
        logger.info("URL:" + request.url + " METHOD:" + request.method + " Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        let data = request.body
        createMyData(data.person, data.attribute, data.value, data.cert, (result) => {
            if (result.success) {
                response.status(200).send("Successfully Uploaded " + data.attribute)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send("Could Not Uploaded " + data.attribute)
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})

app.get('/readMappedAttributes', (request: Request, response: Response) => {
    try {
        logger.info("URL:" + request.url + " | METHOD:" + request.method + " |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        response.status(200).send({ attrList: current_mapping })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})


app.get('/readMyData', (request: Request, response: Response) => {
    try {
        logger.info("URL:" + request.url + "  |  METHOD:" + request.method + "  |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        readMyData((result) => {
            if (result.success) {
                response.status(200).send(result.data)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send("Failed to Read Data")
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})


app.post('/updateMyData', (request: Request<string, createMyDataBody>, response: Response) => {
    try {
        logger.info("URL:" + request.url + "  |  METHOD:" + request.method + "  |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        let data = request.body
        updateMyData(data.person, data.attribute, data.newDataValue, data.oldDataValue, (result) => {
            if (result.success) {
                response.status(200).send("Successfully Updated " + data.attribute)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send("Could Not Update " + data.attribute)
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})


app.post('/deleteMyData', (request: Request<string, createMyDataBody>, response: Response,) => {
    try {
        logger.info("URL:" + request.url + " |  METHOD:" + request.method + " |  Headers:" + request.rawHeaders + " |  BODY: " + JSON.stringify(request.body));
        let data = request.body
        deleteMyData(data.attribute, data.value, (result) => {
            if (result.success) {
                response.status(200).send("Successfully Deleted " + data.attribute)
            } else {
                logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + result.data);
                response.status(500).send("Could Not Delete " + data.attribute)
            }
        })
    } catch (error) {
        logger.error("URL:" + request.url + " |  METHOD:" + request.method + " | Error:" + error);
    }

})


