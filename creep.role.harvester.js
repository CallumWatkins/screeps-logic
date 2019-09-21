module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.isCarryingMaximumEnergy()) {
            creep.withdrawNearByTombstoneEnergy() || creep.pickupNearByDroppedEnergy();
        }
        
        if (creep.memory.harvesting && creep.isCarryingMaximumEnergy()) {
            creep.memory.harvesting = false;
            creep.say('✈️transfer');
        }
        
        if (!creep.memory.harvesting && creep.isCarryingZeroEnergy()) {
            creep.memory.harvesting = true;
            creep.say('⛏️harvest');
            
        }
        
        if (creep.memory.harvesting) {
            creep.harvestNearestEnergyByPath();
        } else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_EXTENSION ||
                              s.structureType === STRUCTURE_SPAWN ||
                              s.structureType === STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            }); // TODO: Cache this
            
            if (target) {
                creep.moveAndTransferEnergy(target);
            } else {
                creep.moveTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS));
            }
        }
    }
};
