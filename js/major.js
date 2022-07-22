var api = '6237cbf0dced170e8c83a41d';
var userUrl = 'https://ldavis-b83d.restdb.io/rest/majorlogins';
var loggedInUser = "";
var scanned = "";
var arrUserIrritants;
var INCIoptions;

$("#scannerScreen").hide();
$("#startPage").hide();
$("#scannerScreen").hide();
$("#userHub").hide();
$("#irritantLog").hide();
$("#scanResults").hide();
$('#userNameTaken').hide();
$('#signUpPage').hide();
$('#irritantRemove').hide();

//changing pages

function changePage(button, pageStart, pageEnd) {
    $(button).click(function () {
        $(pageStart).hide();
        $(pageEnd).show();
    });
};

//Log in and sign up through Restdb data base

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
        arrUserIrritants = thisUsersIrs;
        console.log("asd", thisUsersIrs);
        document.getElementById("irritantList").innerHTML = "";
        document.getElementById("removeIngredientSelector").innerHTML = "Select an irritant to remove";
        for (irritant of thisUsersIrs) {
            console.log(irritant);
            document.getElementById("irritantList").innerHTML += "<p>" + irritant.Ingredient[0]["INCI-name"] + "</p>";
            document.getElementById("removeIngredientSelector").innerHTML += `<option value="${irritant["_id"]}">${irritant.Ingredient[0]["INCI-name"]}</option>`;
        }
    });
}

//Edit irritants

// displaying the irritants in dropdown

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
        response = INCISelectionSort(response)
        INCIoptions = response;
        for (Ingredient of response) {
            document.getElementById("IngredientSelector").innerHTML += `<option value="${Ingredient["INCI-name"]}">${Ingredient["ChemIUPAC-Name-Description"]}</option>`;
        }
    });
}

//sorting and searching INCI Options array in order to locate desired irritatnt to log.

function INCISelectionSort(arrayToSort) {
    var pass = 0;
    while (pass < arrayToSort.length) {
        var count = pass + 1;
        var minimum = pass;
        while (count < arrayToSort.length) {
            //console.log( arrayToSort[count]);
            if (arrayToSort[count].COSINGRefNo < arrayToSort[minimum].COSINGRefNo) {
                minimum = count;
            }
            count = count + 1;
        }
        var tempItem = arrayToSort[minimum];
        arrayToSort[minimum] = arrayToSort[pass];
        arrayToSort[pass] = tempItem;
        pass++;
    }
    return arrayToSort;
}

function INCILinearSearch(arrayToSearch, seachTerm) {
    var count = 0
    while (arrayToSearch.length > count) {
        if (arrayToSearch[count]["INCI-name"] == seachTerm) {
            console.log('found' + seachTerm);
            return arrayToSearch[count];
        }
        else {
            count++;
        };
    };
};

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
    });
}

//Removing an irritant from the array

function deleteIrritant(irritantID) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ldavis-b83d.restdb.io/rest/irritants/" + irritantID,
        "method": "DELETE",
        "headers": {
            "content-type": "application/json",
            "x-apikey": api,
            "cache-control": "no-cache"
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}



//Scanner
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
    console.log(data);
    scanned = data;
    console.log(scanned);
})

//excution of functions

changePage("#btnLogBack", "#irritantLog", "#userHub");
changePage("#signUpBack", "#signUpPage", "#loginPage");
changePage("#btnScannerPage", "#startPage", "#scannerScreen");
changePage("#btnUserHub", "#startPage", "#userHub");
changePage("#btnIrritantAdd", "#userHub", "#irritantLog");
changePage("#btnScannerBack", "#scannerScreen", "#startPage");
changePage("#btnUserBack", "#userHub", "#startPage");
changePage('#btnSignup', "#loginPage", "#signUpPage");
changePage("#btnIrritantSubmit", "#irritantLog", "#userHub");
changePage("#btnIrritantBack", "#irritantLog", "#userHub");
changePage("#btnComplete", "#signUpPage", "#loginPage");
changePage("#btnIrritantRemove", "#userHub", "#irritantRemove");
changePage("#btnRemoveIrritantBack", "#irritantRemove", "#userHub");
changePage("#btnRemoveIrritantSubmit", "#irritantRemove", "#userHub");
changePage("#scanResultsDone", "#scanResults", "#scannerScreen");


$("#btnComplete").click(function () {
    let user = {
        Name: $("#signUpName")[0].value,
        email_address: $("#signUpUsername")[0].value,
        Password: $("#signUpPassword")[0].value
    };
    addUser(user);
});

$('#btnLogin').click(function () {
    login(
        $("#loginUsername")[0].value, $("#loginPassword")[0].value
    );
    irritantLog();
    getOptions();
});


$("#btnIrritantSubmit").click(function () {

    var foundIngredient = INCILinearSearch(INCIoptions, $("#IngredientSelector")[0].value);
    if (foundIngredient == null) {
        console.log("failed lol")
        return;
    }
    let addition = {
        Profile: user,
        Ingredient: foundIngredient,
        Reaction: true
    };
    submitNewIrritant(addition);
    irritantLog();
})

$("#btnRemoveIrritantSubmit").click(function () {
    let irrId = document.getElementById("removeIngredientSelector").value
    if (irrId == "") {
        console.log("error");
        return;
    }
    deleteIrritant(irrId);
    irritantLog();
});

//Scanner results

function compareData(a, b) {
    if (b==null){
        alert ("data loading");
        return;
    }
    for (item of b) {
        console.log(item.Ingredient[0]);
        if (item.Ingredient[0]["ChemIUPAC-Name-Description"].includes(a)) {
            $("#scannerScreen").hide();
            $("#scanResults").show();
            $("#doesntContainIrritant").hide();
        }
        else {
            $("#scannerScreen").hide();
            $("#scanResults").show();
            $("#containsIrritant").hide();
        }
    }
}


$("#capture").click(function () {
    console.log ("here", arrUserIrritants);
    compareData(scanned, arrUserIrritants);
})
