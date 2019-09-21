module.exports = {

    /** @param {Room} room **/
    defend: function(room) {
        var attackers = room.findAttackers();
        if (attackers) {
            let attackerList = _.reduce(attackers, (acc, val, key) => `\n- ${key} (${val} creeps)`, '');
            Game.notify(`Attackers spotted in room ${room.name}:${attackerList}`);
            // TODO: Store whether the room is under attack in memory, then make harvesters prioritise supplying towers in the event of attack
            room.tryActivateSafeMode();
        }
        
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for (var i in towers) {
            towers[i].run(attackers === undefined ? false : true);
        }
    }
};
