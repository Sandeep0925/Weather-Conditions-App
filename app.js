const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//receiving the post request made through html form
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit +
    "";
  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      //tapping some specific data from whole bunch of weatherData
      const temperature = weatherData.main.temp;

      const weatherFeel = weatherData.main.feels_like;

      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const imageURL =
        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

      res.write(
        "<p>The weather feels like  " + weatherFeel + " degree Celcius  </p>"
      );
      res.write(
        "<h1>The Temperature in " +
          query +
          " is " +
          temperature +
          " degree Celsius</h1>"
      );
      res.write("<h2>Today the weather is " + weatherDescription + "</h2>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(process.env.PORT || 2000, function () {
  console.log("localhost port 2000 started");
});
