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

        this.getUserScore = function (user) {
            if (this.userExists(user)) {
                return this.users[user].score;
            } else {
                return 1;
            }

        }

        /**
         * @returns {any[]} - an array of couples.
         */
        this.getScoreMap = function () {
            let scoreMap = [];
            for (let user in this.users) {
                let pair = [user, this.users[user].score];
                scoreMap.push(pair);
            }
            scoreMap.sort(function ([a, b], [c, d]) {
                // less than 0 -> a is lower
                // more than 0 -> b is lower

                return d - b;
            });
            return scoreMap;
        };

        /**
         * returns:
         * -1 if player does not exist
         * 0 if player is alive
         * 1 if player is dead
         * @param {String} user - User ID
         */
        this.getUserStatus = function (user) {
            let status = -1;
            if (!this.userExists(user)) {
                status = this.users[user].isAlive;
            }
            return status;
        };

        /**
         * returns an object containing all the marks for given User ID
         * @param {String} user - user ID
         */
        this.getMarksForUser = function (user) {
            return this.users[user].marks;
        };

        /**
         * kills mark.
         * returns 0 on success
         * informative string otherwise
         * @param {String} killer - killer's ID String
         * @param {String} mark - mark's ID String
         */
        this.kill = function (killer, mark) {
            // killer receives all of mark's arrows.
            // everybody pointing to mark is releaved
            // score is updated
            let datum = "this function was called";
            if (!this.userExists(killer)) {
                datum = "killer not found";
            }
            if (!this.userExists(mark)) {
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
                            (opposer.localeCompare(killer)) ? 2 : 1;
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

        /**
         * validates user's login information
         * @returns 1 on fail, 0 on valid data
         * @param {String} username user's username
         * @param {*} password - user's password
         */
        this.loginUser = function (username, password) {
            if (!this.userExists(username)) {
                return 1;
            }
            if (!this.users[username].pw.localeCompare(password)) {
                return 1;
            }
            return 0;
        }

        /**
         * @returns {any} - user's rank
         * @param {String} user - user ID string
         */
        this.getUserRank = function (user) {
            let scoreMap = this.getScoreMap();
            let rank = 0;
            scoreMap.forEach(function (val, ind) {
                if (!val[0].localeCompare(user)) {
                    rank += ind;
                    rank++;
                }
            });
            return rank;
        }

        /**
         * 
         * @returns {String} - user's msg
         * @param {String} user 
         */
        this.getUserMsg = function (user) {
            if (this.userExists(user)) {
                return this.users[user].msg;
            } else {
                // @ts-ignore
                return -1;
            }
        }


        /**
         * adds username to DB with random marks and chasers.
         * @param {String} username - ID string to be used
         * @param {String} password - validation pw.
         */
        this.addUser = function (username, password) {
            if (this.userExists(username)) {
                return 1;
            }
            let killers = this.randomList();
            let marks = this.randomList();
            this.users[username] = {
                "pw": password,
                "isAlive": 0,
                "score": 10,
                "msg": this.randomMsg(),
                "marks": {},
                "bewareOf": []
            }
            this.makeMark(username, killers);
            for (let mark in marks) {
                this.makeMark(mark, [username]);
            }
            this.flush();
            return 0;
        }
    }

    /**
     * Sets <mark> as a mark for each <killer> in list
     * @param {String} mark - mark's ID string
     * @param {String[]} list - a List of ID Strings
     */
    makeMark(mark, list) {
        for (let killer in list) {
            this.users[killer].marks[mark] = 0;
            this.users[mark].bewareOf.push(killer);
        }

    }

    /**
     * returns a list of random living characters
     * @returns {any}
     */
    randomList() {
        let marks = [];
        let living = this.getAliveList();
        for (let i = 0; i < markListSize; i++) {
            marks.push(living[this.randomNum(150)]);
        }
    }
    /**
     * returns a random string out of a given set
     */
    randomMsg() {
        let rand = this.randomNum(msgs.length);
        return msgs[rand];
    }
    /**
     * returns a random int between 0 and max
     * @param {number} max 
     */
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

    userExists(username) {
        if (this.users.hasOwnProperty(username)) {
            return 1;
        }
        return 0;
    }

}


// @ts-ignore
global.gameSingleton = (!global.gameSingleton) ? new game() : global.gameSingleton;
// @ts-ignore
module.exports = global.gameSingleton;