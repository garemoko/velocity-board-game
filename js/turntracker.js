var TurnTracker = function(){
    this.turn = 0;
    this.phase = 0;
    this.startFleet = 0;
    this.currentFleet = 0;

    $('#turn-tracker button').click({turnTracker: this},function(event){
        event.data.turnTracker.advanceGame();
    });
};

TurnTracker.prototype = {
    advanceGame: function(){

        fleetManager.fleets[$('.fleet-panel:eq(' + this.currentFleet + ')').attr('id')].activateFleet();

        switch (this.phase){
            case 0:
                //movement phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to move');

                break;
            case 1:
                //refuel phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to refuel');

                break;
            case 2:
                //collisions phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to collide');

                break;
            case 3:
                //combat phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to shoot');

                break;
        }

        this.nextPlayer();
    },
    nextPlayer: function (){
        var numberOfPlayers = $('#fleet-tabs li').length;
        this.currentFleet++;

        if (this.currentFleet == numberOfPlayers){
            this.currentFleet = 0;
        }
        if (this.currentFleet == this.startFleet){
            this.phase++;
        }
        if (this.phase == 4){
            this.phase = 0;
            this.startFleet++;
            this.turn++
            if (this.startFleet == numberOfPlayers){
                this.startFleet = 0;
            }
            this.currentFleet = this.startFleet;
        }
        
    }
};