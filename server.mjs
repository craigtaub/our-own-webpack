import express from "express";
import manifest from "./build/manifest.json";

const app = express();

const html_string = `
<html>
  <script src="/static/${manifest.bundle}"></script>
  <body>
    Hello world
  </body>
</html>
`;

app.use("/static", express.static("build"));

app.get("/", (req, res) => res.send(html_string));

app.listen(8000, () => console.log("App listening on port 8000!"));
