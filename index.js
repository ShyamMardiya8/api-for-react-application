const express = require("express");
const connectDb = require("./app/connections/db");
const router = require("./app/routes/users.route");
const errorHandler = require("./app/middleware/errorHandler.middleware");
const fs = require("fs");
const adminRoutes = require("./app/routes/admin.routes");
const path = require("path");
const details = require("./app/routes/details.routes");
const app = express();
const cors = require("cors");
const punch = require("./app/routes/attendance.route");
connectDb();

app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use("/admin", adminRoutes);
app.use("/punch", punch);
app.use("/attendance-full-details", details);
app.use(errorHandler);

app.listen(5000, () => {
  console.log(`server is started on 3000 https://192.168.29.185/api`);
});
