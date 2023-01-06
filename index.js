const express = require("express");
const app = express();
app.use(express.static("docs"));
app.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/javascript")
    res.sendFile(__dirname + "/docs/index.html")
})

app.listen(3000, "localhost", () => {
    console.log("Listening on localhost")
})