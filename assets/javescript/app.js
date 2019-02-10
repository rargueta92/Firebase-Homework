// Firebase config & initialize
var config = {
    apiKey: "AIzaSyA4bLaqjU6W-wj_8-MlcyMzVYxf2dZMwEY",
    authDomain: "train-schedule-f89e5.firebaseapp.com",
    databaseURL: "https://train-schedule-f89e5.firebaseio.com",
    projectId: "train-schedule-f89e5",
    storageBucket: "",
    messagingSenderId: "228207195137"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database

    var database = firebase.database();

// variable for the user inputs
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    

// on click for the user input
$("#submit-button").on("click", function(event) {

// Prevent the page from refreshing
    event.preventDefault();

    // Get inputs
    
    var trainName = $("#train-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    
    //current time
    
    // Gathers the train information
    var newTrain = {
        train: trainName,
        trainGoing: destination,
        trainComing: trainTime,
        everyXMin: frequency,
        dateAddedDb: firebase.database.ServerValue.TIMESTAMP
    }


    // Change what is saved in firebase
    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.trainGoing);
    console.log(newTrain.trainComing);
    console.log(newTrain.everyXMin);

    //clears elements before adding new text
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});


// Firebase is always watching for changes to the data.
// When changes occurs it will print them to console and html
database.ref().on("child_added", function(childSnapshot) {

    // Print the initial data to the console.
    // console.log(snapshot.val());
    // console.log(childSnapshot.val().trainName);
    // console.log(childSnapshot.val().destination);
    // console.log(childSnapshot.val().trainTime);
    // console.log(childSnapshot.val().frequency);

    trainName = childSnapshot.val().train;
    destination =childSnapshot.val().trainGoing;
    trainTime = childSnapshot.val().trainComing;
    frequency = childSnapshot.val().everyXMin;

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

    var difference = moment().diff(moment(trainTimeConverted), "minutes");

    var trainRemain = difference % frequency;

    var minUntil = frequency - trainRemain;

    var newArrival = moment().add(minUntil, "minutes");

    $("#trainInfo > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>"
    + frequency + "</td><td>" + newArrival + "</td><td>" + minUntil + "</td></tr>");
    

    // If any errors are experienced, log them to console.
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);

});
 
