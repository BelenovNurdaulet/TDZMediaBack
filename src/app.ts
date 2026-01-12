import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, {Options} from "swagger-jsdoc";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = Number(process.env.PORT);
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

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
        "./src/**/*.ts",
    ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});