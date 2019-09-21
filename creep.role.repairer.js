let cachedTargetTemplate = require('creep.role.cachedTargetTemplate').create({
    roleMessage: '🛠️repair',
    
    harvestEnergy: function (creep) {
        creep.harvestNearestEnergyByPath();
    },
    
    findTarget: function (creep) {
        return _(creep.room.find(FIND_STRUCTURES)).filter(s => s.hits < 0.75*s.hitsMax || s.hitsMax - s.hits > 100*creep.carry[RESOURCE_ENERGY])
                                                  .min(s => s.hits);
    },
    
    validateTarget: function (target) {
        return target.hits < target.hitsMax;
    },
    
    executeRole: function (creep, target) {
        creep.moveAndRepair(target);
    },
    
    idle: function (creep) {
        // TODO
    }
});

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        cachedTargetTemplate.run(creep);
    }
};
