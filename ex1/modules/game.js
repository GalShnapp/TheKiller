const userMod = require('./user');
const https = require('https');


const loadingEndpoint = '';
class game {

    users;
    gameID;

    constructor() {
        this.gameID = 0;
        this.users = this.loadUsers();
    }

    loadUsers() {
        https.get(loadingEndpoint, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(JSON.parse(data).explanation);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}

global.game = new game();
let a = {
    users: [],

    gameID: 0,

    init: function (gameID) {
        // loadUsers()
        userMod.makeUser();
    },

    getAliveList: function () {

    },

    getNotAmongstUsList: function () {

    },

    getScoreList: function () {

    },

    getUserStatus: function (userID) {

    },

    getMarksForUser: function (userID) {

    },



    kill: function (killer, mark) {
        // killer receives all of mark's arrows.
        // everybody pointing to mark is releaved
        // 
    }
};