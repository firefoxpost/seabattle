function Game() {}

Game.prototype = {

    constructor: Game,

    players: [],

    getPlayers: function() {
        return this.players;
    },

    setPlayers: function(player1, player2) {
        for (var k in arguments) {
            this.players.push(arguments[k]);
        }
    },

    getPlayerByRole: function(role) {
        var players = this.getPlayers();
        for (var k in players) {
            if(players[k].role === role) {
                return players[k];
            }
        }
    },

    startGame: function() {
        this.initPlayers();
        this.initShooter();
    },

    initPlayers: function () {
        this.setPlayers(new Player("Пользователь", "user"), new Player("Компьютер", "comp"));

        var players = this.getPlayers();

        for (var k in players) {
            var player = players[k];
            player.initPlayer();
        }
    },

    initShooter: function () {
        var grids = document.getElementById('gamefield_comp').getElementsByTagName('span'),
            $self = this,
            intelligentHit,
            intelligent = false;

        for(var t=0; t < grids.length; t++) {
            grids[t].addEventListener("click", handleShoot);
        }

        function handleShoot() {
            var gridId = this.getAttribute('id'),
                index = gridId.indexOf('_'),
                coord = gridId.substring(0, index);

            anyliseHit(coord, 'user');
        }

        function anyliseHit(coord, gamer) {
            var gamerObj = $self.getPlayerByRole(gamer),
                enemyObj,
                enemyFleet,
                seaGrid = coord + '_',
                loggerStr;

            if (gamer === 'user') {
                enemyObj = $self.getPlayerByRole('comp');
                seaGrid += 'comp';
            } else {
                enemyObj = $self.getPlayerByRole('user');
                seaGrid += 'user';
            }

            enemyFleet = enemyObj.getFleet();

            gamerObj.setShootCounter();

            loggerStr = gamerObj.getName()
                +". "
                +"Выстрел №"
                +gamerObj.getShootCounter()
                +". ";

            var checker = 0;

            outer:
                for (var m in enemyFleet) {
                    var coords = enemyFleet[m].coords;

                    for (var n in coords) {
                        var trigger = coords[n].indexOf(coord);
                        if (trigger !== -1) { // if comp ship is hit
                            document.getElementById(seaGrid).setAttribute("class", "killed");
                            document.getElementById(seaGrid).removeEventListener("click", handleShoot);

                            if (coords[n].length === 1) {
                                document.getElementById("countShoot").innerHTML+="<p>"
                                    +loggerStr
                                    +enemyFleet[m].name
                                    +" убит!</p>";
                                    intelligent = false;

                            } else {
                                document.getElementById("countShoot").innerHTML+="<p>"
                                    +loggerStr
                                    +enemyFleet[m].name
                                    +" ранен!</p>";
                                    intelligent = true;
                                    intelligentHit = coord;

                            }
                            
                            scrollLogger();
                            
                            coords[n].splice(trigger, 1);

                            for (var m in enemyFleet) {
                                var coords = enemyFleet[m].coords;

                                for (var n in coords) {
                                    checker+= coords[n].length;
                                }
                            }

                            if (checker === 0) {
                                finishGame(gamerObj);
                            }

                            if (gamer === 'comp') {
                                compShooter(intelligent);
                            }
                            return true;
                            break outer;
                        }
                    }
                }

            document.getElementById("countShoot").innerHTML+="<p>" + loggerStr + "Промах!</p>";
            document.getElementById(seaGrid).setAttribute("class", "disabled");
            document.getElementById(seaGrid).removeEventListener("click", handleShoot);
            scrollLogger();

            if (gamer === 'user') {
                compShooter();
            }
        }

        function compShooter(param) {
            var compHitCoord = getHitCoord(param);
            anyliseHit(compHitCoord, 'comp');
        }

        function scrollLogger() {    
            var objDiv = document.getElementById("countShoot");
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        function getHitCoord(param) {
            var enemyGrids = $self.getPlayerByRole('comp').getEnemyGrids(),
                resIndex,
                result;
                
                if (param) {
                    var intelligentParseCoord = intelligentHit.split(":"),
                    x = parseInt(intelligentParseCoord[0]),
                    y = parseInt(intelligentParseCoord[1]),
                    freeDots = [x+1+":"+y, x-1+":"+y, x+":"+y+1, x+":"+y-1];

                    for (var m=0; m < freeDots.length; i++) {
                        resIndex = enemyGrids.indexOf(freeDots[m]);

                        if(resIndex !==-1) {
                            break;
                        }
                    }
                }
                else {
                    resIndex = Math.floor(Math.random() * ((enemyGrids.length-1) + 1)); // array index
                }

            result = enemyGrids[resIndex];
            
            $self.getPlayerByRole('comp').removeEnemyGrids(resIndex);

            return result;
        }

        function finishGame(gamer) {
            document.getElementById('body').setAttribute("style", "visibility:hidden;");
            alert("Игра окончена! Выйграл "+gamer.getName()+" за "+gamer.getShootCounter()+" выстрелов!");
            document.getElementById('reloadGame').setAttribute("style", "display:inline-block");
            document.getElementById('reloadGame').addEventListener("click", reloader);
        }

        function reloader() {
            location.reload();
        }

    }
};