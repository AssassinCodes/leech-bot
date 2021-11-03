const mongoose = require("mongoose");

const leechSchema = new mongoose.Schema({
    leeches: { type: Array },
});

const model = mongoose.model("leeches", leechSchema);
module.exports = model;
