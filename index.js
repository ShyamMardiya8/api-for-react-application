const express = require("express");
const connectDb = require("./app/connections/db");
const router = require("./app/routes/users.route");
const errorHandler = require("./app/middleware/errorHandler.middleware");
const adminRoutes = require("./app/routes/admin.routes");
const path = require("path");
const app = express();

connectDb();

app.use(express.json());

app.use("/api", router);
app.use("/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads/")));
app.use(errorHandler);

app.listen(3000, () => {
  console.log(`server is started on 3000 https://192.168.29.185/api`);
});
