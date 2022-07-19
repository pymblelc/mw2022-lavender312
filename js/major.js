var api = '6237cbf0dced170e8c83a41d';
var userUrl = 'https://ldavis-b83d.restdb.io/rest/majorlogins';
var arrUsers = [''];
var loggedInUser = "";
var arrUserIrritants = "";
var INCIoptions;
//var db = new restdb("6237cbf0dced170e8c83a41d", options);
//var db = new restdb(api);
//var majorlogins = "6237b460f088b11e000072b0"; 

$("#scannerScreen").hide();
$("#startPage").hide();
$("#scannerScreen").hide();
$("#userHub").hide();
$("#irritantLog").hide();
$("#scanResults").hide();
$('#userNameTaken').hide();
$('#signUpPage').hide();

//linking pages
//forward

function changePage(button, pageStart, pageEnd) {
    $(button).click(function () {
        $(pageStart).hide();
        $(pageEnd).show();
    });
};

changePage("#btnLogBack", "#irritantLog", "#userHub");
changePage("#btnScannerPage", "#startPage", "#scannerScreen");
changePage("#btnUserHub", "#startPage", "#userHub");
changePage("#btnIrritantEdit", "#userHub", "#irritantLog");
changePage("#btnScannerBack", "#scannerScreen", "#startPage");
changePage("#btnUserBack", "#userHub", "#startPage");
changePage('#btnSignup', "#loginPage", "#signUpPage");
changePage ("#btnIrritantSubmit", "#irritantLog", "#userHub");
changePage("#btnIrritantBack", "#irritantLog", "#userHub")

//Log in through Restdb

var users;
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://ldavis-b83d.restdb.io/rest/majorlogins",
    "method": "GET",
    "headers": {
        "content-type": "application/json",
        "x-apikey": api,
        "cache-control": "no-cache"
    }
}

$.ajax(settings).done(function (response) {
    users = response;
});

//log in system
function login(username, password) {
    for (user of users) {
        if (user.email_address == username && user.Password == password) {
            console.log(user);
            loggedInUser = user;
            //success stuff here
            $("#loginPage").hide();
            $("#startPage").show();
            document.getElementById("txtWelcome").innerText = "Welcome back " + user.Name;
            document.getElementById("profileName").innerText = user.Name;
            break;
        }
    }
};
$('#btnLogin').click(function () {
    login(
        $("#loginUsername")[0].value, $("#loginPassword")[0].value
    );
});

//Sign up system
function addUser(item) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ldavis-b83d.restdb.io/rest/majorlogins",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": api,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(item)
    }
    $.ajax(settings).done(function (response) {
        console.log('user successfully added');
        console.log(response);
    });
}

$("#btnComplete").click(function () {
    let user = {
        Name: $("#signUpName")[0].value,
        email_address: $("#signUpUsername")[0].value,
        Password: $("#signUpPassword")[0].value
    };
    addUser(user);
});
changePage("#btnComplete", "#signUpPage", "#loginPage")

//user hub

//irritants record
function irritantLog() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ldavis-b83d.restdb.io/rest/irritants",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": api,
            "cache-control": "no-cache"
        }
    }
    $.ajax(settings).done(function (response) {
        let thisUsersIrs = response.filter(function (v) {
            if (v.Profile[0].email_address == loggedInUser.email_address) {
                return true;
            }
            else {
                return false;
            }
        });
        document.getElementById("irritantList").innerHTML = "";
        for (irritant of thisUsersIrs) {
            document.getElementById("irritantList").innerHTML += "<p>" + irritant.Ingredient[0]["INCI-name"] + "</p>";
        }
    });
}

$("#btnUserHub").click(function () {
    irritantLog();
});

//Edit irritants

// displaying the irritants in dropdown
/*
function enhancedBubbleSort (arrayToSort){
    var swapped = true;
    var pass = 0;
    while (swapped = true){
        swapped = false;
        var comparison = 0;
        while (comparison < arrayToSort.length - 1){
            if (arrayToSort[comparison]< arrayToSort[comparison + 1]){
                var tempItem = arrayToSort[comparison];
                arrayToSort[comparison] = arrayToSort[comparison + 1];
                arrayToSort[comparison + 1]= tempItem; 
                swapped = true;
            }
            comparison = comparison + 1;
        }
        pass = pass + 1;
    }
    console.log(arrayToSort);
}
*/
function getOptions() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ldavis-b83d.restdb.io/rest/inci-list",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": api,
            "cache-control": "no-cache"
        }
    }
    $.ajax(settings).done(function (response) {
        // Loop through the response array
        INCIoptions = response;
        for (Ingredient of response) {
            //enhancedBubbleSort(Ingredient["INCI-name"]);
            document.getElementById("IngredientSelector").innerHTML += `<option value="${Ingredient["INCI-name"]}">${Ingredient["ChemIUPAC-Name-Description"]}</option>`;
        }
    });
}

$("#btnIrritantEdit").click(function () {
    getOptions();
});

//sorting and searching INCI Options array in order to locate desired irritatnt to log.

function selectionSort (arrayToSort){
    var pass = 0;
    while (pass < arrayToSort.length){
        var count = pass + 1;
        var minimum = pass;
        while (count<= arrayToSort.length){
            if (arrayToSort[count]<arrayToSort[minimum]){
                minimum = count;
            }
            count = count + 1;
        }
        var tempItem = arrayToSort[minimum];
        arrayToSort[minimum] = arrayToSort[pass];
        arrayToSort[pass]= tempItem;
        pass ++;
    }
    console.log ("sorted " + arrayToSort);
}

//Adding the selected irritant to the array

function submitNewIrritant(jsondata) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ldavis-b83d.restdb.io/rest/irritants",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": api,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

$("#btnIrritantSubmit").click(function () {
    selectionSort(INCIoptions);


    // let addition = {
    //     Profile: user,
    //     Ingredient: $("#IngredientSelector")[0].value,
    //     Reaction: true
    // };
    // submitNewIrritant(addition);
    // console.log(addition);
})

//Scanner
/*function cameraActivate() {

    // activate camera through browser
    var video = document.getElementById('camForScan');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    };
}
cameraActivate();*/

//ocr software (hella buggy)

const player = document.getElementById('player')
const snapshotZone = document.getElementById('snapshot')
const captureButton = document.getElementById('capture')
const result = document.getElementById('result')
$("#snapshot").hide();


navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    player.srcObject = stream
})

captureButton.addEventListener('click', async function () {
    const context = snapshot.getContext('2d')
    context.drawImage(player, 0, 0, snapshotZone.width, snapshotZone.height)
    // Tesseract.recognize(snapshotZone, 'eng', { logger: m => console.log(m) })
    //     .then(({ data: { text } }) => {
    //         result.value = text
    //         console.log(text);
    //         //var result = text
    //     })
    let data = await Tesseract.recognize(snapshotZone, 'eng', { logger: m => console.log(m) });
    console.log(data);
    console.log(data.data.text);
    $("#snapshot").hide();
    data = "lanolin";
})


/* 
Search and sort
scanner results
fix submission of irritants so it stops breaking the database
minus irritants?
*/