var express = require('express');
var router = express.Router();

router.post("/", async function (req, res) {
    console.log("1111");
    res.json("2222");
});

module.exports = router;