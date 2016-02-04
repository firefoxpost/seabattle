function Player (name, role) {

    this.name = name;

    this.role = role;

    this.shootCounter = 0;

    this.fleet = {
        fourGrid: {
            weight:4,
            quantity:1,
            name: "Четырехпалубник",
            coords: []
        },
        threeGrid: {
            weight: 3,
            quantity: 2,
            name: "Трехпалубник",
            coords: []
        },
        twoGrid: {
            weight: 2,
            quantity: 3,
            name: "Двухпалубник",
            coords: []
        },
        oneGrid: {
            weight: 1,
            quantity: 4,
            name: "Однопалубник",
            coords: []
        }
    };

    this.seaCoords = [];

    this.enemyGrids = [];

    this.x = 10;

    this.y = 10;

    this.getName = function() {
        return this.name;
    };

    this.getRole = function() {
        return this.role;
    };

    this.getShootCounter = function() {
        return this.shootCounter;
    };

    this.setShootCounter = function() {
        this.shootCounter++;
    };

    this.getFleet = function() {
        return this.fleet;
    };

    this.getX = function() {
        return this.x;
    };

    this.getY = function() {
        return this.y;
    };

    this.getSeaCoords = function() {
      return this.seaCoords;
    };

    this.addSeaCoords = function(i) {
        this.seaCoords.push(i);
    };

    this.removeSeaCoords = function(i) {
        this.seaCoords.splice(i,1);
    };

    this.getEnemyGrids = function() {
        return this.enemyGrids;
    };

    this.addEnemyGrids = function(i) {
        this.enemyGrids.push(i);
    };

    this.removeEnemyGrids = function(i) {
        this.enemyGrids.splice(i,1);
    };

    this.initPlayer = function() {
        this.createGameField();
        this.locateFleet();
    };

    this.createGameField = function() {
         var xSize = this.getX(),
             ySize = this.getY();

        for (var i = 1; i <= xSize; i++) {
            for (var j = 1; j <= ySize; j++) {
                document.getElementById('gamefield_' + this.getRole()).innerHTML += '<span class="seagrid" id="'+ i + ':'+ j + "_" + this.getRole()+'"></span>';
                this.addSeaCoords(i+":"+j);

                if (this.getRole() === 'comp') {
                    this.addEnemyGrids(i+":"+j);
                }
            }
        }
    };

    this.locateFleet = function() {
        var $self = this,
            fleet = $self.getFleet(),
            k, obj,
            busyCoordsArray = [];

        // run over fleet object
        for (k in fleet) {
            obj = fleet[k];

            // run over ships on fleet
            for (var t = 0; t < obj.quantity; t++) {
                var shipCoords = generateCoords(); // result coords for ship
                obj.coords.push(shipCoords[0]);

                for (var m in shipCoords[1]) {
                    var trigger = busyCoordsArray.indexOf(shipCoords[1][m]);
                    if (trigger === -1) {
                        busyCoordsArray.push(shipCoords[1][m]);
                    }
                }

                cleanSeaCoords(shipCoords);

                if($self.getRole() === 'user') {
                    drawFleet(shipCoords[0]);
                }
            }
        }

        // generate coords
        function generateCoords() {
            var result = [],
                validatePosition = false;

            do {
                // create ship coords and busy coords
                var createdPosition = createStartPosition(),
                    tempCoords = createCoords(createdPosition);

                // validate coords for ship location
                validatePosition = checkCoords(tempCoords);
            }
            while(validatePosition === false);

            if (validatePosition === true) {
                result.push(tempCoords[0], tempCoords[1]);
            }
            return result;
        }

        // randomise start position
        function createStartPosition() {
            var direction = Math.floor(Math.random() * 2), // 0 - draw ship horizontal; 1 - draw ship vertical
                posIndex = Math.floor(Math.random() * (($self.getSeaCoords().length-1) + 1)), // array index
                position = $self.getSeaCoords()[posIndex]; // value on this index

            return [position, direction];
        }

        // calculate ship coords
        function createCoords(startData) {
            var tempShipCoords = [],
                tempBusyCoords = createBusyCoords(startData),
                startArr = startData[0].split(":"),
                xPos = parseInt(startArr[0]),
                yPos = parseInt(startArr[1]),
                dir = startData[1];

            for (var s=0; s < obj.weight; s++) {
                switch (dir) {
                    case 1:
                        var x = xPos,
                            y = yPos + s;

                        tempShipCoords.push(x + ":" + y); // values array
                        break;
                    case 0:
                        var x = xPos + s,
                            y = yPos;

                        tempShipCoords.push(x + ":" + y); // values array
                        break;
                }
            }
            return [tempShipCoords, tempBusyCoords];
        }

        function createBusyCoords(i) {
            var tempDeadCoords=[],
                startArr = i[0].split(":"),
                x = parseInt(startArr[0]),
                y = parseInt(startArr[1]),
                dir = i[1];// 0 - draw ship horizontal; 1 - draw ship vertical

            for (var s=0; s < obj.weight; s++) {
                switch (dir) {
                    case 1:
                        if(x>1){
                            tempDeadCoords.push(x-1+":"+(y+s));
                        }
                        if(x<10) tempDeadCoords.push(x+1+":"+(y+s));
                        if(s==0 && x>=1 && y>1){
                            tempDeadCoords.push(x+":"+(y-1));
                            if(x>1){
                                tempDeadCoords.push(x-1+":"+(y-1));
                            }
                            if(x<10) tempDeadCoords.push(x+1+":"+(y-1));
                        }
                        if(s === obj.weight-1 && y<10-s){
                            tempDeadCoords.push(x+":"+((y+s)+1));
                            if(x>1){
                                tempDeadCoords.push((x-1)+":"+((y+s)+1));
                            }
                            if(x<10) tempDeadCoords.push((x+1)+":"+((y+s)+1));
                        }
                        break;

                    case 0:
                        if(y>1){
                            tempDeadCoords.push((x+s)+":"+(y-1));
                        }
                        if(y<10) tempDeadCoords.push((x+s)+":"+(y+1));
                        if(s === 0 && x>1 && y>=1){
                            tempDeadCoords.push(x-1+":"+(y));
                            if(y>1){
                                tempDeadCoords.push((x-1)+":"+(y-1));
                            }
                            if(y<10) tempDeadCoords.push((x-1)+":"+(y+1));
                        }
                        if(s === obj.weight-1 && x<10-s){
                            tempDeadCoords.push((x+s)+1+":"+(y));
                            if(y>1){
                                tempDeadCoords.push((x+s)+1+":"+(y-1));
                            }
                            if(y<10)tempDeadCoords.push((x+s)+1+":"+(y+1));
                        }
                        break;
                }
            }
            return tempDeadCoords;
        }

        // validator for created coords
        function checkCoords(data) {
            var validator = false,
                testShipDots = [],
                testBusyDots = [],
                valid_ship,
                valid_around;

            for (var k in data[0]) {
                var coord = $self.getSeaCoords().indexOf(data[0][k]),
                    busyDot = busyCoordsArray.indexOf(data[0][k]); //value

                testShipDots.push(coord);
                testBusyDots.push(busyDot);
            }

            var is_valid = function(n) { return n == -1; };

            valid_ship = testShipDots.some(is_valid);
            valid_around = testBusyDots.some(is_valid);

            if (valid_ship === false && valid_around === true) {
                validator = true;
            } else {
                validator = false;
            }

            return validator;
        }

        // delete busy coords from seaCoords Array
        function cleanSeaCoords(data) {
            var shipCoords = data[0],
                busyCoords = data[1];

            deleter(shipCoords,busyCoords);
        }

        function deleter() {
            for (var m in arguments) {
                for (var k in arguments[m]) {
                    var coordsArray = $self.getSeaCoords(),
                        dot = coordsArray.indexOf(arguments[m][k]);

                    if (dot !== -1) $self.removeSeaCoords(dot);
                }
            }
        }

        // draw fleet on seafield
        function drawFleet(i) {

            for (var key in i) {
                var gridId = i[key]+"_"+$self.getRole();
                document.getElementById(gridId).setAttribute("class", "sheep");
            }
        }
    };
}