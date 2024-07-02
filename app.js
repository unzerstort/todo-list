import express from "express";
import routes from "./routes/index.js";



const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.use(express.json());
routes(app);

export default app;