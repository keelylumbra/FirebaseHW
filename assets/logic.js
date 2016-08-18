// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAzzTjOkFuPlfDRFT-nZg_HWza-jTHdiEo",
    authDomain: "train-times-94c57.firebaseapp.com",
    databaseURL: "https://train-times-94c57.firebaseio.com",
    storageBucket: "train-times-94c57.appspot.com",
  };
  firebase.initializeApp(config);

// // Create a variable to reference the database.
var database = firebase.database();


$("#submit").on("click", function(e){
	e.preventDefault();

	// Grabs user input
	var trainName = $("#trainName").val().trim();
	var dest = $("#destination").val().trim();
	var trainStart = moment($("#firstTime").val().trim(), "HH:mm").format("HH:mm");
	var freq = $("#frequency").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		place: dest,
		start: trainStart,
		rate: freq
	};

	// Uploads train data to the database
	database.ref().push(newTrain);

	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.place);
	console.log(newTrain.start);
	console.log(newTrain.rate);

	// Clears all of the text-boxes
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTime").val("");
	$("#frequency").val("");

	// Prevents moving to new page
	return false;
});


database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var dest = childSnapshot.val().place;
	var trainStart = childSnapshot.val().start;
	var freq = childSnapshot.val().rate;

	// Employee Info
	console.log(trainName);
	console.log(dest);
	console.log(trainStart);
	console.log(freq);


//predicting train time

		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(trainStart,"HH:mm").subtract(1, "years");
		console.log(firstTimeConverted);
		// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);
		// Time apart (remainder)
		var tRemainder = diffTime % freq;
		console.log(tRemainder);
		// Minute Until Train
		var tMinutesTillTrain = freq - tRemainder;
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
		// Next Train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes");
		console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"))

	// Add each train's data into the table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + (moment(nextTrain).format("hh:mm")) + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});


