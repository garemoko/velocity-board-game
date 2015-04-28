var Vessel = function(vesselId) {
    this.id = vesselId;

    $('#' + vesselId).find('.vessel-name').click({vessel: this},function(event){
        event.data.vessel.editName();
    });

    $('#' + vesselId).find('.vessel-attribute-class select').change({vessel: this},function(event){
        event.data.vessel.changeClass($(this).val());
    });

    $('#' + vesselId).find('.vessel-property-sqd-ldr').change({vessel: this},function(event){
        $('#' + vesselId).toggleClass('panel-info');
    });
};

Vessel.prototype = {
    editName: function(){
        var titleElement = $('#' + this.id).find('.vessel-name');
        var newName = window.prompt("Enter a new name for the current vessel:", titleElement.text());
        if (newName !== null){
            titleElement.text(newName);
        }
    },
    deleteVessel: function (ignoreWarning){
        if ((ignoreWarning === false) || window.confirm("Are you sure you want to delete this vessel?")) {
            $('#' + this.id).remove();
            return true;
        }
        return false;
    },
    changeClass: function(newClass){
        vesselData = this.VESSELDATA[newClass];
        vesselId = this.id;
        vessel = this;
        $.each(vesselData.attributes, function(attribute, value){
            $('#' + vesselId).find('.vessel-attribute-' + attribute + ' td').eq(1).text(value);
        });
        $('#' + vesselId).find('.vessel-property-speed td input').val(vesselData.attributes.minSpeed);
        $('#' + vesselId).find('.vessel-property-shield td input').val(vesselData.attributes.shield);
        $('#' + vesselId).find('.vessel-property-armor td input').val(vesselData.attributes.armor);

        if (vesselData.attributes.hasOwnProperty('fighters')){
            $('#' + vesselId).find('.vessel-property-fighters td input').val(vesselData.attributes.fighters).attr('disabled', false);
        }
        else {
            $('#' + vesselId).find('.vessel-property-fighters td input').val('').attr('disabled', true);
        }

        $('#' + vesselId + ' .vessel-fittings tr td:nth-child(2)').text('');
        $.each(vesselData.fittings, function(index, fitting){
            fittingData = vessel.FITTINGSDATA[fitting.type][fitting.level];
            $.each(fitting.positions, function(index, position){
                $('#' + vesselId).find('.vessel-fitting-' + position + ' td:eq(1)').text(fittingData);
            });
        });

    },
    FITTINGSDATA: {
        'bomb': {
            3: "10 damage, 6 inch range, 3 inch raidus, 2i/t speed",
            4: "20 damage, 8 inch range, 4 inch raidus, 2i/t speed"
        },
        'torpedo': {
            4: "10 damage, 25 inch range, 2 inch raidus, 5i/t speed"
        },
        'cannon': {
            2: "2 damage, 12 inch range"
        },
        'flak': {
            1: "1 damage, 10 inch range"
        },
        'fighters': {
            4: "Allows control of up to 3 fighters at a time."
        }
    },
    VESSELDATA: {
        'carrier': {
            'attributes' : {
                'minSpeed': 0,
                'maxSpeed' : 1,
                'armor' : 50,
                'agility' : 1,
                'fighters': 30,
            },
            'fittings' : [
                {
                    'level': 4,
                    'type': 'fighters',
                    'positions': ['port','starboard']
                }
            ]
        },
        'battleship': {
            'attributes' : {
                'minSpeed': 0,
                'maxSpeed' : 1,
                'armor' : 50,
                'agility' : 1,
                'fighters': 15,
            },
            'fittings' : [
                {
                    'level': 4,
                    'type': 'fighters',
                    'positions': ['aft']
                },
                {
                    'level': 4,
                    'type': 'torpedo',
                    'positions': ['fore']
                },
                {
                    'level': 4,
                    'type': 'bomb',
                    'positions': ['port','starboard']
                }
            ]
        },
        'annihilator': {
            'attributes' : {
                'minSpeed': 0,
                'maxSpeed' : 8,
                'armor' : 10,
                'agility' : 2,
            },
            'fittings' : [
                {
                    'level': 3,
                    'type': 'bomb',
                    'positions': ['fore']
                }
            ]
        },
        'sentinel': {
            'attributes' : {
                'minSpeed': 0,
                'maxSpeed' : 8,
                'armor' : 10,
                'agility' : 2,
            },
            'fittings' : [
                {
                    'level': 1,
                    'type': 'flak',
                    'positions': ['fore','port','starboard','aft']
                }
            ]
        },
        'fighter': {
            'attributes' : {
                'minSpeed': 3,
                'maxSpeed' : 15,
                'armor' : 1,
                'agility' : 4,
            },
            'fittings' : [
                {
                    'level': 2,
                    'type': 'cannon',
                    'positions': ['fore']
                }
            ]
        }
    }

};



