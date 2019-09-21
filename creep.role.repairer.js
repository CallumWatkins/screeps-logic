module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.isCarryingMaximumEnergy()) {
            var tombstoneOrPickup = creep.withdrawNearByTombstoneEnergy() || creep.pickupNearByDroppedEnergy();
        }
        
        if (creep.memory.repairing && creep.isCarryingZeroEnergy()) {
            creep.memory.repairing = false;
            creep.memory.targetId = undefined;
            creep.say('⛏️harvest');
        }
        
        if (!creep.memory.repairing && creep.isCarryingMaximumEnergy()) {
            creep.memory.repairing = true;
            creep.say('🛠️repair');
        }

        if (creep.memory.repairing) {
            if (creep.memory.targetId) {
                // Check if the current target is now fully repaired
                if (Game.getObjectById(creep.memory.targetId).hits === Game.getObjectById(creep.memory.targetId).hitsMax) {
                    creep.memory.targetId = undefined;
                }
            }
            
            var target;
            if (creep.memory.targetId) {
                target = Game.getObjectById(creep.memory.targetId);
            } else {
                target = _(creep.room.find(FIND_STRUCTURES)).filter(s => s.hits < 0.75*s.hitsMax || s.hitsMax - s.hits > 100*creep.carry[RESOURCE_ENERGY])
                                                            .min(s => s.hits);
            }
            
            if (target) {
                creep.memory.targetId = target.id;
                creep.moveAndRepair(target);
            }
        } else if (!tombstoneOrPickup) {
            creep.harvestNearestEnergyByPath();
        }
    }
};
