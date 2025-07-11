import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import registerRoute from "./routes/register.js";
import paymentRoute from "./routes/payment.js";
import adminRoute from "./routes/admin.js";
import collegeRoute from "./routes/college.js";
import { start as startScheduler } from "./services/scheduler.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();
startScheduler();

app.use('/api/register', registerRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/admin', adminRoute);
app.use('/api/college', collegeRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));