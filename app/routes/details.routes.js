const express = require("express");
const detailsObject = require("../controllers/details.controller");

const detail = express.Router();

detail.get("/userDetails", detailsObject);
