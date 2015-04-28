var FleetManager = function() {
    this.nextFleetId = 1;
    this.initializeNavigation();
    this.initializeTemplates();
    this.fleets = {};
    this.fleets['fleet-' + this.nextFleetId] = new Fleet('fleet-' + this.nextFleetId, this.vesselTemplate);
    this.addStartingFleets();
};

FleetManager.prototype = {
    //Save HTML as tempaltes for re-use
    initializeTemplates: function (){
        this.fleetTemplate = $('#fleet-1').clone();
        this.fleetTabTemplate = $('#fleet-1-tab').clone();
        this.vesselTemplate = $('#vessel-1-1').clone();
    },
    //Activate all buttons on the page
    initializeNavigation: function () {

        //Attributes/fittings/properties selector
        $('#dataswitch').children('button').click( function() {
            $('#dataswitch').children('button').removeClass('btn-info');
            $(this).addClass('btn-info');
            var targetPanelType = $(this).attr('data-targetpaneltype');
            $('.vessel-cardpanel .panel-body').addClass('hidden');
            $('.' + targetPanelType).removeClass('hidden');
        });

        //Fleet tabs
        $('.fleet-tabs li a').click(function (e) {
             e.preventDefault();
            $(this).tab('show');
        });

        //Rename current Fleet
         $('#rename-fleet').click({fleetManager: this},function(event){
            var currentFleetId = $('#fleet-list').children('div.fleet-panel.active').attr('id');
            event.data.fleetManager.fleets[currentFleetId].renameFleet();
         });

        //Add fleet
        $('#add-fleet').click({fleetManager: this},function(event){
            event.data.fleetManager.addFleet();
        });

        //Delete current fleet
        $('#delete-fleet').click({fleetManager: this},function(event){
            var currentFleetId = $('#fleet-list').children('div.fleet-panel.active').attr('id');
            var deleteResult = event.data.fleetManager.fleets[currentFleetId].deleteFleet();
            if (deleteResult) {
                delete event.data.fleetManager.fleets[currentFleetId];
            }
        });
    },
    addFleet: function (){
        $('#fleet-tabs li').removeClass('active');
        $('#fleet-list').children('div.fleet-panel').removeClass('active');

        this.nextFleetId++;

        var newFleetTab = this.fleetTabTemplate.clone();
        newFleetTab.attr('id','fleet-' + this.nextFleetId + '-tab');
        newFleetTab.children('a').attr('href','#fleet-' + this.nextFleetId);
        newFleetTab.children('a').attr('aria-controls','fleet-' + this.nextFleetId);
        newFleetTab.children('a').text('Fleet ' + this.nextFleetId);

        $('#fleet-tabs').append(newFleetTab);

        var newFleet = this.fleetTemplate.clone();
        newFleet.attr('id','fleet-' + this.nextFleetId);
        newFleet.find('.vessel-cardpanel').attr('id','vessel-' + this.nextFleetId + '-1');

        $('#fleet-list').append(newFleet);

        $('.fleet-tabs li a').click(function (e) {
             e.preventDefault();
            $(this).tab('show');
        });
        this.fleets['fleet-' + this.nextFleetId] = new Fleet('fleet-' + this.nextFleetId, this.vesselTemplate);
    },
    addStartingFleets: function(){
        $.each(this.fleets,function(){
            this.deleteFleet(false);
        });

        for (var f = 0; f < (this.STARTINGFLEETS.length); f++) {
            this.addFleet();
            $('#fleet-' + this.nextFleetId + '-tab a').text(this.STARTINGFLEETS[f].name);
            this.fleets['fleet-' + this.nextFleetId].vessels['vessel-' + this.nextFleetId + '-1'].deleteVessel(false);
            for (var v = 0; v < this.STARTINGFLEETS[f].vessels.length; v++) {
                this.fleets['fleet-' + this.nextFleetId].addVessel();
                vesselId = this.fleets['fleet-' + this.nextFleetId].nextVesselId;
                $('#vessel-' + this.nextFleetId + '-' + vesselId + ' .vessel-name').text(this.STARTINGFLEETS[f].vessels[v].name);
                $('#vessel-' + this.nextFleetId + '-' + vesselId + ' .vessel-attribute-class select')
                    .val(this.STARTINGFLEETS[f].vessels[v].type).change();
            }
        }

        this.fleets[$('.fleet-panel:eq(0)').attr('id')].activateFleet();
    }, 
    STARTINGFLEETS: [
        {
            'name': 'Player 1',
            'vessels' : [
                {
                    'name': 'P1 Battleship',
                    'type': 'battleship'
                },
                {
                    'name': 'P1 Annhilator 1',
                    'type': 'annihilator'
                },
                {
                    'name': 'P1 Annhilator 2',
                    'type': 'annihilator'
                },
                {
                    'name': 'P1 Fighter 1',
                    'type': 'fighter'
                },
                {
                    'name': 'P1 Fighter 2',
                    'type': 'fighter'
                },
                {
                    'name': 'P1 Fighter 3',
                    'type': 'fighter'
                }
            ]
        },
        {
            'name': 'Player 2',
            'vessels' : [
                {
                    'name': 'P2 Carrier',
                    'type': 'carrier'
                },
                {
                    'name': 'P2 Sentinel 1',
                    'type': 'sentinel'
                },
                {
                    'name': 'P2 Sentinel 2',
                    'type': 'sentinel'
                },
                {
                    'name': 'P2 Fighter 1',
                    'type': 'fighter'
                },
                {
                    'name': 'P2 Fighter 2',
                    'type': 'fighter'
                },
                {
                    'name': 'P2 Fighter 3',
                    'type': 'fighter'
                },
                {
                    'name': 'P2 Fighter 4',
                    'type': 'fighter'
                },
                {
                    'name': 'P2 Fighter 5',
                    'type': 'fighter'
                },
                {
                    'name': 'P2 Fighter 6',
                    'type': 'fighter'
                }
            ]
        }
    ]
};

var Fleet = function(id, vesselTemplate){
    this.id = id;
    this.nextVesselId = 1;
    this.vessels = {};
    vesselId = this.id.replace('fleet', 'vessel') + '-' + this.nextVesselId;
    this.vessels[vesselId] = new Vessel(vesselId);
    this.vesselTemplate = vesselTemplate;

    //Add vessel
    $('#' + this.id).find('.add-vessel').click({fleet: this},function(event){
        event.data.fleet.addVessel();
    });

    //Delete a vessel
    $('#' + id).find('.remove-vessel').click({fleet: this},function(event){
        vesselId = $(this).parent().parent().parent().attr('id');
        deleteResult = event.data.fleet.vessels[vesselId].deleteVessel();
        if (deleteResult) {
            delete event.data.fleet.vessels[vesselId];
        }
    });
    $('#delete-fleet').click({fleetManager: this},function(event){
        var currentFleetId = $('#fleet-list').children('div.fleet-panel.active').attr('id');
        var deleteResult = event.data.fleetManager.fleets[currentFleetId].deleteFleet();
        if (deleteResult) {
            delete event.data.fleetManager.fleets[currentFleetId];
        }
    });
};

Fleet.prototype = {
    renameFleet: function (){
        var newName = window.prompt("Enter a new name for the current fleet:");
        $('#' + this.id + '-tab').children('a').text(newName);
    },
    deleteFleet: function (ignoreWarning){
        if ((ignoreWarning === false) || window.confirm("Are you sure you want to delete the current fleet?")) {

            var currentFleetIndex = $('#' + this.id).index();
            var nextFleetIndex = currentFleetIndex - 1;

            //remove fleet from tabs
            $('#' + this.id + '-tab').remove();
            $('#fleet-tabs li').eq(nextFleetIndex).addClass('active');
            //remove fleet panel
            $('#' + this.id).remove();
            $('#fleet-list').children('div.fleet-panel').eq(nextFleetIndex).addClass('active');
            return true;
        }
        return false;
    },
    addVessel: function (){
        this.nextVesselId++;
        vesselId = this.id.replace('fleet', 'vessel') + '-' + this.nextVesselId;

        var newVessel = this.vesselTemplate.clone();
        newVessel.attr('id', vesselId);

        newVessel.find('.remove-vessel').click({fleet: this},function(event){
            vesselId = $(this).parent().parent().parent().attr('id');
            deleteResult = event.data.fleet.vessels[vesselId].deleteVessel();
            if (deleteResult) {
                delete event.data.fleet.vessels[vesselId];
            }
        });

        $('#' + this.id).find('.add-vessel').before(newVessel);

        this.vessels[vesselId] = new Vessel(vesselId);
    },
    activateFleet: function(fleet){
        $('#fleet-list div.fleet-panel').removeClass('active');
        $('#fleet-tabs li').removeClass('active');
        $('#' + this.id + '-tab').addClass('active');
        $('#' + this.id).addClass('active');
    },
};



