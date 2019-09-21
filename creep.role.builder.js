let cachedTargetTemplate = require('creep.role.cachedTargetTemplate').create({
    roleMessage: '🚧build',
    
    harvestEnergy: function (creep) {
        creep.harvestNearestEnergyByPath();
    },
    
    findTarget: function (creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },
    
    validateTarget: function (target) {
        return target instanceof ConstructionSite;
    },
    
    executeRole: function (creep, target) {
        creep.moveAndBuild(target);
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
