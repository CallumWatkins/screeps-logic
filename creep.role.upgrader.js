let cachedTargetTemplate = require('creep.role.cachedTargetTemplate').create({
    roleMessage: '⚡upgrade',
    
    harvestEnergy: function (creep) {
        creep.harvestNearestEnergyByRange(creep.room.controller.pos, true);
    },
    
    findTarget: function (creep) {
        return creep.room.controller;
    },
    
    validateTarget: function (target) {
        return true;
    },
    
    executeRole: function (creep, target) {
        creep.moveAndUpgradeController(target);
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
