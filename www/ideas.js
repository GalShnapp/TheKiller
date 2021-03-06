function alertMe() {
    alert('Dude, take some deep breaths..');
}

var list;

// Example POST method implementation:

function updateIdea(id, value) {

    var data = {};
    data[id] = value;
    postData(data)
        .then(data => console.log(data)) // JSON from `response.json()` call
        .catch(error => console.error(error))
}

function addIdea(id, value) {

    var data = {};
    data[id] = value;
    putData(data)
        .then(data => console.log(data)) // JSON from `response.json()` call
        .catch(error => console.error(error))
}

function removeIdea(id) {

    var data = {};
    data[id] = id;
    deleteData(data)
        .then(data => console.log(data)) // JSON from `response.json()` call
        .catch(error => console.error(error))
}

function postData(data) {
    // Default options are marked with *
    return fetch("http://127.0.0.1:8081/ideaup", {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    });

}

function putData(data) {
    return fetch("http://127.0.0.1:8081/ideapu", {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    });

}

function deleteData(data) {
    console.log(data);

    return fetch("http://127.0.0.1:8081/kill", {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    });

}

function loadList() {

    // @ts-ignore
    return fetch("http://127.0.0.1:8081/marks", {
            // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (obj) {
            list.innerText = null;
            console.log(obj);
            for (var key in obj['marks']) {
                var idea = ideaFactory(key, obj.marks[key]);
                list.insertBefore(idea, list.childNodes[0]);
            }

        });
}

function ideaFactory(key, value) {
    var ideaBox = document.createElement("DIV");
    var idea = document.createElement("P");


    var viewProfileBtn = document.createElement("BUTTON");
    viewProfileBtn.setAttribute("onclick", "viewProfileButton(\"" + key + "\")");
    viewProfileBtn.innerHTML = "View Profile";



    idea.innerHTML = key;
    if (value == 1) {
        idea.setAttribute("class", "deadPerson");
    } else if (value == 2) {
        idea.setAttribute("class", "deadPerson2");
    }
    ideaBox.setAttribute("class", "container darker");
    ideaBox.setAttribute("id", key);
    ideaBox.appendChild(idea);
    //ideaBox.appendChild(editBtn);
    if (value == 0) {
        var killBtn = document.createElement("BUTTON");
        killBtn.setAttribute("onclick", "killButton(\"" + key + "\")");
        killBtn.innerHTML = "Kill";
        ideaBox.appendChild(killBtn);
    }
    ideaBox.appendChild(viewProfileBtn);




    return ideaBox;

}

function viewProfileButton(id) {

    var origRef = document.getElementById(id);
    var editable = document.createElement("DIV");
    var textArea = document.createElement("TEXTAREA");
    var addBlk = document.createElement("DIV");
    var saveBtn = document.createElement("BUTTON");

    editable.setAttribute("id", id);
    saveBtn.setAttribute("onclick", "save(\"" + id + "\")");
    saveBtn.innerHTML = "Save";
    editable.setAttribute("class", "container darker");
    addBlk.setAttribute("class", "addBlock");
    textArea.innerHTML = origRef.childNodes[0].innerHTML;
    addBlk.appendChild(saveBtn);
    editable.appendChild(textArea);
    editable.appendChild(addBlk);

    list.replaceChild(editable, origRef);
    document.location.href = "http://127.0.0.1:8081/profilePage.html?id=" + id + "&origin=ideas";

}

function save(id) {

    var origRef = document.getElementById(id);
    var val = origRef.childNodes[0].value + "";
    var ideaBox = ideaFactory(id, val);
    list.replaceChild(ideaBox, origRef);
    updateIdea(id, val);
}

function killButton(id) {
    console.log(id);
    list.removeChild(document.getElementById(id));
    console.log("button " + id + " wants a removal");
    removeIdea(id);
    loadList();
}

function newIdea() {
    var id = Math.random();
    var val = document.getElementById("addTxt").value;
    id = val;
    var newIdea = ideaFactory(id, val);
    list.appendChild(newIdea);
    document.getElementById("addTxt").value = null;
    addIdea(id, val);
}


function howToBTN() {
    window.location.href = "http://127.0.0.1:8081/howTo.html";
}

function highScoresBTN() {
    window.location.href = "http://127.0.0.1:8081/highScores.html";
}

window.onload = function () {
    list = document.getElementById("lCon");
    loadList();
};