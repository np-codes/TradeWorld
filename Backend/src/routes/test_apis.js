const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("The test_apis is working fine");
});

module.exports = router;