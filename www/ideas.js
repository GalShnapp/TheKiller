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

    return fetch("http://127.0.0.1:8081/idead", {
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
    return fetch("http://127.0.0.1:8081/ideas", {
            body: {}, // must match 'Content-Type' header
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
            for (var key in obj) {
                var idea = ideaFactory(key, obj[key]);
                list.insertBefore(idea, list.childNodes[0]);
            }

        });
}

function ideaFactory(key, value) {
    var ideaBox = document.createElement("DIV");
    var idea = document.createElement("P");

    var editBtn = document.createElement("BUTTON");
    editBtn.setAttribute("onclick", "toEditButton(" + key + ")");
    editBtn.innerHTML = "Edit";

    var rmvBtn = document.createElement("BUTTON");
    rmvBtn.setAttribute("onclick", "rmvIdea(" + key + ")");
    rmvBtn.innerHTML = "Remove";

    idea.innerHTML = value;
    ideaBox.setAttribute("class", "container darker");
    ideaBox.setAttribute("id", key);
    ideaBox.appendChild(idea);
    ideaBox.appendChild(editBtn);
    ideaBox.appendChild(rmvBtn);



    return ideaBox;

}

function toEditButton(id) {

    var origRef = document.getElementById(id);
    var editable = document.createElement("DIV");
    var textArea = document.createElement("TEXTAREA");
    var addBlk = document.createElement("DIV");
    var saveBtn = document.createElement("BUTTON");

    editable.setAttribute("id", id);
    saveBtn.setAttribute("onclick", "save(" + id + ")");
    saveBtn.innerHTML = "Save";
    editable.setAttribute("class", "container darker");
    addBlk.setAttribute("class", "addBlock");
    textArea.innerHTML = origRef.childNodes[0].innerHTML;
    addBlk.appendChild(saveBtn);
    editable.appendChild(textArea);
    editable.appendChild(addBlk);

    list.replaceChild(editable, origRef);

}

function save(id) {

    var origRef = document.getElementById(id);
    var val = origRef.childNodes[0].value + "";
    var ideaBox = ideaFactory(id, val);
    list.replaceChild(ideaBox, origRef);
    updateIdea(id, val);
}

function rmvIdea(id) {

    list.removeChild(document.getElementById(id));
    console.log("button " + id + " wants a removal");
    removeIdea(id);
}

function newIdea() {
    var id = Math.random();
    var val = document.getElementById("addTxt").value;
    var newIdea = ideaFactory(id, val);
    list.appendChild(newIdea);
    document.getElementById("addTxt").value = null;
    addIdea(id, val);
}

window.onload = function () {
    list = document.getElementById("lCon");
    loadList();
};