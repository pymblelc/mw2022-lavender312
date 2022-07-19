var api = '6237cbf0dced170e8c83a41d';
var userUrl = 'https://ldavis-b83d.restdb.io/rest/majorlogins';
var arrUsers = [''];
var loggedInUser = "";
var arrUserIrritants = "";
var INCIoptions;

$("#scannerScreen").hide();
$("#startPage").hide();
$("#scannerScreen").hide();
$("#userHub").hide();
$("#irritantLog").hide();
$("#scanResults").hide();
$('#userNameTaken').hide();
$('#signUpPage').hide();

//changing pages

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
            //enhancedBubbleSort(Ingredient["INCI-name"]);
            document.getElementById("IngredientSelector").innerHTML += `<option value="${Ingredient["INCI-name"]}">${Ingredient["ChemIUPAC-Name-Description"]}</option>`;
        }
    });
}

$("#btnIrritantEdit").click(function () {
    getOptions();
});

//sorting and searching INCI Options array in order to locate desired irritatnt to log.

function INCISelectionSort (arrayToSort){
    var pass = 0;
    while (pass < arrayToSort.length){
        var count = pass + 1;
        var minimum = pass;
        while (count< arrayToSort.length){
           //console.log( arrayToSort[count]);
            if (arrayToSort[count].COSINGRefNo <arrayToSort[minimum].COSINGRefNo){
                minimum = count;
            }
            count = count + 1;
        }
        var tempItem = arrayToSort[minimum];
        arrayToSort[minimum] = arrayToSort[pass];
        arrayToSort[pass]= tempItem;
        pass ++;
    }
    return arrayToSort;
}
function INCILinearSearch(arrayToSearch, seachTerm){
    var count = 0
    while (arrayToSearch.length>count){
        if (arrayToSearch[count]["INCI-name"] == seachTerm){
            console.log('found'+ seachTerm);
            return arrayToSearch[count];
        }
        else{
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

$("#btnIrritantSubmit").click(function () {
   
   var foundIngredient = INCILinearSearch(INCIoptions,$("#IngredientSelector")[0].value);
   if (foundIngredient == null){
       console.log ("failed lol")
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
    console.log (data);
})

//Scanner results

/*take the data and create loop that asks how the data 
currently data is hard coded to be lanolin as the ocr software isnt working good :(

compate data to irritants applicatblw to the user. 
*/

function compareData (a, b){
    if (a == b) {
        alert("contains irritant")
    }
    else {
        alert ("doesn't contain irritant")
    }
}

("#btnCapture").click(function (){
    compareData(data, /*user's irritants*/);
})

/* 
Search and sort (tick)
scanner results
fix submission of irritants so it stops breaking the database (tick)
minus irritants?
*/