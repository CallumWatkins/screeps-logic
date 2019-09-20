var roleHarvester = {

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
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                                      structure.structureType == STRUCTURE_SPAWN ||
                                      structure.structureType == STRUCTURE_TOWER)
                                      && structure.energy < structure.energyCapacity
                
            });
            
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
