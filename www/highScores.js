function loadHighScores() {

    // @ts-ignore
    return fetch("http://127.0.0.1:8081/data/highScores", {
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
            var index = 1;
            var numOfEntries = obj["highScores"].length;
            for (let i = 0; i < numOfEntries; i++){
                var idea = scoreFactory(obj["highScores"][numOfEntries - 1 - i][0], obj["highScores"][numOfEntries - 1 - i][1], numOfEntries - i);
                list.insertBefore(idea, list.childNodes[0]);
            }
            // for (var key in obj["highScores"]) {
            //
            //     var idea = scoreFactory(obj["highScores"][obj["highScores"].length - key][0], obj["highScores"]["highScores"].length - key][1], index);
            //     list.insertBefore(idea, list.childNodes[0]);
            //     index++;
            // }

        });
}

function scoreFactory(key, value, index) {
    var ideaBox = document.createElement("DIV");
    var idea = document.createElement("P");


    var viewProfileBtn = document.createElement("BUTTON");
    viewProfileBtn.setAttribute("onclick", "viewProfileButton(\"" + key + "\")");
    viewProfileBtn.innerHTML = "View Profile";



    idea.innerHTML = "" + index + ".\t" + key + "\t" + value;
    //if (value[isAlive] == 1) {
    //  idea.setAttribute("class", "deadPerson");
    //} else if (value[isAlive] == 2) {
    //    idea.setAttribute("class", "deadPerson2");
    //}
    ideaBox.setAttribute("class", "container darker");
    ideaBox.setAttribute("id", key);
    ideaBox.appendChild(idea);
    //ideaBox.appendChild(editBtn);
    //if (value[isAlive] == 0){
    //}
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
    document.location.href = "http://127.0.0.1:8081/profilePage.html?id=" + id;

}


function backBTN(){
    window.location.href = "http://127.0.0.1:8081/";
}

window.onload = function () {
    list = document.getElementById("lCon");
    loadHighScores();
};