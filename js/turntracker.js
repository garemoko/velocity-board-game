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

        $('#dataswitch-turnTracker').removeClass('hidden').click();
        fleetManager.fleets[$('.fleet-panel:eq(' + this.currentFleet + ')').attr('id')].activateFleet();
        $('.vessel-turnTracker div').addClass('hidden');

        switch (this.phase){
            case 0:
                //movement phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to move');

                
                $('.vessel-cardpanel').each(function(){
                    if (!$(this).hasClass('add-vessel')){
                        var vesselAgility =  parseInt($(this).find('.vessel-attribute-agility td:eq(1)').text());
                        var vesselStartSpeed = parseInt($(this).find('.vessel-property-speed td:eq(1) input').val());
                        var vesselTurnAngle = vesselAgility * 45;
                        var vesselMinSpeed = parseInt($(this).find('.vessel-attribute-minSpeed td:eq(1)').text());
                        var vesselMaxSpeed = parseInt($(this).find('.vessel-attribute-maxSpeed td:eq(1)').text());

                        var minSpeed = (vesselStartSpeed - vesselAgility);
                        if (minSpeed < vesselMinSpeed){
                            minSpeed = vesselMinSpeed;
                        }

                        var maxSpeed = (vesselStartSpeed + vesselAgility);
                        if (maxSpeed > vesselMaxSpeed){
                            maxSpeed = vesselMaxSpeed;
                        }
                        var ticks = [];
                        for (var i = minSpeed; i <= maxSpeed; i++) {
                            ticks.push(i);
                        };

                        $(this).find('.vessel-turnTracker .move .move-angle').text(vesselTurnAngle);
                        var sliderTarget = $(this).find('.vessel-turnTracker .move .speed-slider');
                        var currentSlider  = sliderTarget.slider({
                            min: minSpeed,
                            max: maxSpeed,
                            value: vesselStartSpeed,
                            tooltip: 'hide',
                            ticks: ticks,
                            ticks_labels: ticks,
                        });
                    }
                });

                $('.vessel-turnTracker .move').removeClass('hidden');
                $('.vessel-turnTracker .move .speed-slider').slider('refresh');

                break;
            case 1:
                //refuel phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to refuel');
                $('.vessel-turnTracker .refuel').removeClass('hidden');

                break;
            case 2:
                //collisions phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to collide');
                $('.vessel-turnTracker .collide').removeClass('hidden');

                break;
            case 3:
                //combat phase
                $('#turn-tracker p').text('Player ' + (this.currentFleet + 1) + ' to shoot');
                $('.vessel-turnTracker .combat').removeClass('hidden');

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