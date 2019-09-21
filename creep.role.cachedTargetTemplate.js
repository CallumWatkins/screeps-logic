// Template pattern expressed using composition for a creep role with a cached target.

// primitives: {
//     String roleMessage,
//     function harvestEnergy(creep),
//     function findTarget(creep),
//     function validateTarget(target),
//     function executeRole(creep, target),
//     function idle(creep)
// }

/**
 * Create a template object for the given primitive implementation.
 * 
 * @param {Object} primitives - The implementation of the role.
 * @returns {Object} An object with a run(creep) method.
 */
module.exports.create = function (primitives) {
    return {
        /**
         * Run the role for the specified creep.
         * 
         * @param {Creep} creep - The creep to run.
         */
        run: function (creep) {
            if (!creep.isCarryingMaximumEnergy()) {
                var tombstoneOrPickup = creep.withdrawNearByTombstoneEnergy() || creep.pickupNearByDroppedEnergy();
            }
            
            if (creep.memory.executingRole && creep.isCarryingZeroEnergy()) {
                creep.memory.executingRole = false;
                creep.memory.cachedTargetId = undefined;
                creep.say('⛏️harvest');
            }
            
            if (!creep.memory.executingRole && creep.isCarryingMaximumEnergy()) {
                creep.memory.executingRole = true;
                creep.say(primitives.roleMessage);
            }
        
            if (creep.memory.executingRole) {
                let target;
                if (creep.memory.cachedTargetId) {
                    target = Game.getObjectById(creep.memory.cachedTargetId)
                    
                    if (!target || !primitives.validateTarget(target)) {
                        target = creep.memory.cachedTargetId = undefined;
                    }
                }
                
                if (!target) {
                    target = primitives.findTarget(creep);
                }
                
                if (target) {
                    creep.memory.cachedTargetId = target.id;
                    primitives.executeRole(creep, target);
                } else {
                    primitives.idle(creep);
                }
            } else if (!tombstoneOrPickup) {
                primitives.harvestEnergy(creep);
            }
        }
    };
};
