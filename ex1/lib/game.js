const https = require('https');
const fs = require('fs');
const user = require('./user.js')
const loadingEndpoint = 'ex1/data/game/0.txt';
const msgs = ['hello', 'world', 'punch', 'snapple', 'guliver', 'clap', 'hands'];
const markListSize = 10;
class game {


    constructor() {
        this.gameID = 0;
        this.users = this.loadUsers();

        /**
         * returns an object containing all living users
         */
        this.getAliveList = function () {
            let living = {};
            for (let user in this.users) {
                if (this.users[user].isAlive == 0) {
                    living[user] = this.users[user];
                }
            }
            return living;
        }

        /**
         * returns an object containing all deceased users
         */
        this.getDeceasedList = function () {
            let deceased = {};
            for (let user in this.users) {
                if (this.users[user].isAlive != 0) {
                    deceased[user] = this.users[user];
                }
            }
            return deceased;
        };

        /**
         * returns an object that maps player IDs to score
         */
        this.getScoreList = function () {
            let scoreMap = {};
            for (let user in this.users) {
                scoreMap[user] = this.users[user].score;
            }
            return scoreMap;
        };

        /**
         * returns:
         * -1 if player does not exist
         * 0 if player is alive
         * 1 if player is dead
         * @param {String} user  User ID
         */
        this.getUserStatus = function (user) {
            let status = -1;
            if (this.users.hasOwnProperty(user)) {
                status = this.users[user].isAlive;
            }
            return status;
        };

        /**
         * returns an object containting all the marks for given User ID
         * @param {String} user user ID
         */
        this.getMarksForUser = function (user) {
            let marks = {};
            if (this.users.hasOwnProperty(user)) {
                for (let mark in this.users[user].marks) {
                    marks[mark] = this.users[mark];
                }
            }
            return marks;
        };

        /**
         * kills mark.
         * returns 0 on success
         * informative string otherwise
         * @param {String} killer 
         * @param {String} mark 
         */
        this.kill = function (killer, mark) {
            // killer receives all of mark's arrows.
            // everybody pointing to mark is releaved
            // score is updated
            let datum = "this function was called";
            if (!this.users.hasOwnProperty(killer)) {
                datum = "killer not found";
            }
            if (!this.users.hasOwnProperty(mark)) {
                datum = "mark not found";
            }
            let killerObj = this.users[killer];
            let markObj = this.users[mark];
            if (!killerObj['marks'].hasOwnProperty(mark)) {
                datum = "mark doesn't belong to killer's list";
            }

            switch (killerObj.marks[mark]) {
                case 0:
                    datum = "killing that dude right now!";

                    while (markObj.bewareOf.length != 0) {
                        let opposer = markObj.bewareOf.pop();
                        this.users[opposer].marks[mark] =
                            (opposer.localeCompare(killer)) ? 1 : 2;
                        console.log(1 + opposer.localeCompare(killer));
                    }
                    this.users[killer].score += this.users[mark].score;
                    for (let markyMark in markObj.marks) {
                        // if mark is alive
                        if (this.users[mark].marks[markyMark] == 0) {
                            this.users[killer].marks[markyMark] = 0;
                        } else {
                            this.users[killer].marks[markyMark] = 2;
                        }
                        this.users[markyMark].bewareOf
                            .splice(this.users[markyMark].bewareOf
                                .indexOf(mark), 1);
                    }
                    this.flush();
                    break;
                case 1:
                    datum = "I killed this dude";
                    break;
                case 2:
                    datum = "an opposing player killed this guy";
                    break;
                default:
                    datum = "we messed up the database";
            }
            return datum;
        }

        this.addUser = function (username, password) {
            if (this.users.hasOwnProperty(username)) {
                return 1;
            }

            this.users[username] = {
                "pw": password,
                "isAlive": 0,
                "score": 10,
                "msg": this.randomMsg(),
                "marks": this.randomMarkList(),
                "bewareOf": []
            }
        }

    }

    randomMarkList() {
        let marks = [];
        let living = this.getAliveList();
        for (let i = 0; i < markListSize; i++) {
            marks.push(living[this.randomNum(150)]);
        }
    }

    randomMsg() {
        let rand = this.randomNum(msgs.length);
        return msgs[rand];
    }

    randomNum(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    loadUsers() {
        // @ts-ignore
        let db = JSON.parse(fs.readFileSync(loadingEndpoint));
        return db;
    }

    flush() {
        fs.writeFileSync(loadingEndpoint, JSON.stringify(this.users));
    }

}


// @ts-ignore
global.gameSingleton = (!global.gameSingleton) ? new game() : global.gameSingleton;
// @ts-ignore
module.exports = global.gameSingleton;