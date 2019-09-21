module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.isCarryingZeroEnergy()) {
            creep.memory.upgrading = false;
            creep.say('⛏️harvest');
        }
        
        if (!creep.memory.upgrading && creep.isCarryingMaximumEnergy()) {
            creep.memory.upgrading = true;
            creep.say('⚡upgrade');
        }

        if (creep.memory.upgrading) {
            creep.moveAndUpgradeController(creep.room.controller);
        } else {
            creep.withdrawNearByTombstoneEnergy() || creep.pickupNearByDroppedEnergy() || creep.harvestNearestEnergyByRange(creep.room.controller.pos);
        }
    }
};
