var express = require("express");
var app = express();
var strftime = require('strftime');
var parseTime = require('./node_modules/parsetime/dist/parseTime.js');

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/timestamp/:date_string?", (req, res, next) => {
	var num = req.params.date_string;
	let obj;
	if(typeof num === 'undefined'){
		//return the current day	
		var today = new Date().toUTCString();
		var newDate = Date.parse(today);

		obj = {"unix": newDate, "utc": today};

	} else if (typeof num === 'string'){
		var newNum = Number(num);		
		// console.log(num, newNum);

		if (!isNaN(newNum)) { // works with unix string	1451001600000		
			// console.log(newNum)
			var utcDate = new Date(newNum).toUTCString();
			console.log(utcDate);
			obj = {"unix": num, "utc": utcDate};	

			


		} else if (isNaN(newNum)) {
			//works with reg date 2015-12-25			
			var unixTime = parseTime(num.toString())['absolute'];
			//console.log(unixTime);

			var utcDate = new Date(unixTime).toUTCString();
			
			if (utcDate === "Thu, 01 Jan 1970 00:00:00 GMT") {
				console.log(utcDate);
				res.json({"error" : "Invalid Date" });
			};
			// console.log(utcDate);

			obj = {"unix": unixTime, "utc": utcDate};

		} else {
			// passing in not a date 'abouce'

			
		}
	};  
	res.json(obj);	
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});