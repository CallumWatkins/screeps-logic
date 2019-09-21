let cachedTargetTemplate = require('creep.role.cachedTargetTemplate').create({
    roleMessage: '✈️transfer',
    
    harvestEnergy: function (creep) {
        creep.harvestNearestEnergyByPath();
    },
    
    findTarget: function (creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                   filter: s => s.structureType === STRUCTURE_TOWER &&
                                s.energy < s.RESERVE_ENERGY_COEFFICIENT * s.energyCapacity
               })
               
            || creep.pos.findClosestByPath(FIND_STRUCTURES, {
                   filter: s => (s.structureType === STRUCTURE_EXTENSION ||
                                 s.structureType === STRUCTURE_SPAWN) &&
                                s.energy < s.energyCapacity
               })
               
            || creep.pos.findClosestByPath(FIND_STRUCTURES, {
                   filter: s => s.structureType === STRUCTURE_TOWER &&
                                s.energy < s.energyCapacity
               })
               
            || null;
    },
    
    validateTarget: function (target) {
        return target.energy < target.energyCapacity;
    },
    
    executeRole: function (creep, target) {
        creep.moveAndTransferEnergy(target);
    },
    
    idle: function (creep) {
        creep.moveTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS));
    }
});

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        cachedTargetTemplate.run(creep);
    }
};
