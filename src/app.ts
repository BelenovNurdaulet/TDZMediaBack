import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, {Options} from "swagger-jsdoc";
import cors from "cors";
import cookieParser from "cookie-parser";
import {exceptionHandler} from "./presentation/http/middlewares/exceptionHandler";
import {addRequestId} from "./presentation/http/middlewares/addRequestId";
import {buildApiRouter} from "./container";

const PORT = Number(process.env.PORT)|| 5000;
const app = express();
const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TDZMediaBack",
            description: "Belenov Nurdaulet",
            version: "1.0.0",
        },
        servers: [{url: `http://localhost:${PORT}`}],
    },
    apis: [
        "./src/**/*.ts","src/presentation/http/swagger/**/*.ts"
    ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(addRequestId);
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(buildApiRouter());
app.use(exceptionHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});