//
// https://is-kirkwood-road-open.glitch.me
//
// @author: Ido Green | @greenido
// @date: JAN 2023

// @see:
// source for date: http://www.dot.ca.gov/hq/roadinfo/display.php?page=i88
//
// init project pkgs
const express = require("express");
const bodyParser = require("body-parser");

const request = require("request"); // TODO: replace all of these calls with GOT (the line below)
const got = require("got");

const app = express();
const Map = require("es6-map");
const dateJS = require("./dateLib.js");

// Pretty JSON output for logs
const prettyjson = require("prettyjson");
const toSentence = require("underscore.string/toSentence");

app.use(bodyParser.json({ type: "application/json" }));
app.use(express.static("public"));

//
// Main entry points
//
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/getText", function (req, res) {
  //console.log('** Handling getText/' );
  request.post(
    {
      url: "https://roads.dot.ca.gov/roadscell.php",
      form: { roadnumber: "88", submit: "Search" },
    },
    function (error, response, body) {
      if (error) throw new Error(error);
      //console.log("🚀 RES: " + JSON.stringify(response ));
      try {
        let html = response.body;
        //console.log("===From Web Page ====" + html + "\n\n");
        let inx1 = html.indexOf("<p><em>This highway");
        let inx2 = html.indexOf("<hr", inx1 + 100);

        let roadConditionsStr = html.substring(inx1, inx2).trim();
        roadConditionsStr = roadConditionsStr.replace(/CHAINS/g, '<b>CHAINS</b>');
        roadConditionsStr = roadConditionsStr.replace(/1-WAY/g, '<b>1-WAY</b>');
        roadConditionsStr = roadConditionsStr.replace(/PROHIBITED/g, '<b>PROHIBITED</b>');
        roadConditionsStr = roadConditionsStr.replace(/CLOSED/g, '<b>CLOSED</b>');
         
        //console.log("inx1: " + inx1 + " inx2:" + inx2);
        //console.log("🚀🚀 roadConditionsStr:" + roadConditionsStr);

        if (roadConditionsStr == null || roadConditionsStr.length < 3) {
          res.send(
            "<b>Could not get the road conditions.</b><br>You can check with the Caltrans Highway Information Network at phone 800-427-7623.<br>Have safe trip!"
          );
          return;
        }
        res.send(roadConditionsStr);
      } catch (error) {
        console.log(
          "🧐 getText Error: " + error + " json: " + JSON.stringify(error)
        );
      }
    }
  );
});

//
// Add a health check route in express
//
app.get("/_health", (req, res) => {
  res.status(200).send("ok 🥇");
});

//
// Handle webhook requests
//
app.post("/", function (req, res, next) {
  logObject("-- req: ", req);
  logObject("-- res: ", res);
  // TODO?
});

//
// Handle errors
//
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "Oppss... Something is not working. Please let @greenido know about it."
    );
});

//
// Pretty print objects for logging
//
function logObject(message, object, options) {
  console.log(message);
  //console.log(prettyjson.render(object, options));
}

//
//
//
function getCurrentDateTime() {
  let currentdate = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  // let datetime = " " + currentdate.getDate() + "/"
  //               + (currentdate.getMonth()+1)  + "/"
  //               + currentdate.getFullYear() + " @ "
  //               + currentdate.getHours() + ":"
  //               + currentdate.getMinutes() + ":"
  //               + currentdate.getSeconds();
  return currentdate;
}

//
// Listen for requests -- Start the party
//
let server = app.listen(process.env.PORT, function () {
  console.log(
    "--> Our Webhook is listening on " + JSON.stringify(server.address())
  );
});
