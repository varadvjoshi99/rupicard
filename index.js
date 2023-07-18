const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { name, mobile } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1QlApcMmCVX4fV0SOljOqiT_Q7d-MwGGLXg1D05grAYY";

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, mobile]],
    },
  });

  res.redirect('/');
});

app.listen(3000, (req, res) => console.log("running on 3000"));
