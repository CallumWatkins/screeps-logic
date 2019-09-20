var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.isCarryingZeroEnergy()) {
            creep.memory.building = false;
            creep.memory.targetId = undefined;
            creep.say('⛏️harvest');
        }
        
        if (!creep.memory.building && creep.isCarryingMaximumEnergy()) {
            creep.memory.building = true;
            creep.say('🚧build');
        }

        if (creep.memory.building) {
            if (creep.memory.targetId) {
                // Check if the current target is now fully built or was cancelled
                if (Game.getObjectById(creep.memory.targetId) === null) {
                    creep.memory.targetId = undefined;
                }
            }
            
            var target;
            if (creep.memory.targetId) {
                target = Game.getObjectById(creep.memory.targetId);
            } else {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }
            
            if (target) {
                creep.memory.targetId = target.id;
                creep.moveAndBuild(target);
            }
        } else {
            creep.withdrawNearByTombstoneEnergy() || creep.pickupNearByDroppedEnergy() || creep.harvestNearestEnergyByPath();
        }
    }
};

module.exports = roleBuilder;
