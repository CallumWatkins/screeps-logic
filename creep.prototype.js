module.exports = function () {
    Creep.prototype.ROLES = {
        'harvester': require('creep.role.harvester'),
        'upgrader': require('creep.role.upgrader'),
        'builder': require('creep.role.builder'),
        'repairer': require('creep.role.repairer')
    };
    
    Creep.prototype.run = function () {
        this.ROLES[this.memory.role].run(this);
    };
    
    /**
     * Pick up any droppd energy adjacent to the current location.
     * 
     * @returns {boolean} True if energy was picked up.
     */
    Creep.prototype.pickupNearByDroppedEnergy = function () {
        return this.pickupNearByDroppedResource(RESOURCE_ENERGY);
    };
    
    Creep.prototype.pickupNearByDroppedResource = function (resourceType) {
        var closestDroppedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === resourceType });
        if (this.pos.isNearTo(closestDroppedResource)) {
            this.pickup(closestDroppedResource);
            this.say('💲 pickup');
            return true;
        }
        
        return false;
    };
    
    Creep.prototype.withdrawNearByTombstoneEnergy = function () {
        return this.withdrawNearByTombstoneResource(RESOURCE_ENERGY);
    };
    
    /**
     * 
     * Amount is optional.
     */
    Creep.prototype.withdrawNearByTombstoneResource = function (resourceType) {
        var closestTombstoneWithResource = this.pos.findClosestByPath(FIND_TOMBSTONES, { filter: t => t.store[resourceType] > 0 });
        if (this.pos.isNearTo(closestTombstoneWithResource)) {
            this.withdraw(closestTombstoneWithResource, resourceType);
            this.say('💲 tomb');
            return true;
        }
        
        return false;
    };
    
    /**
     * Move to and harvest the closest actve energy source by path.
     * 
     * fromPosition: RoomPosition [optional]
     */
    Creep.prototype.harvestNearestEnergyByPath = function (fromPosition) {
        fromPosition = fromPosition || this.pos;
        var closestActiveSource = fromPosition.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(closestActiveSource) === ERR_NOT_IN_RANGE) {
            this.moveTo(closestActiveSource, {reusePath: 0, visualizePathStyle: {stroke: '#ffbf00', opacity: 0.2}});
        }
    };
    
    /**
     * Move to and harvest the closest actve energy source by range.
     * 
     * fromPosition: RoomPosition [optional]
     */
    Creep.prototype.harvestNearestEnergyByRange = function (fromPosition) {
        fromPosition = fromPosition || this.pos;
        var closestActiveSource = fromPosition.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (this.harvest(closestActiveSource) === ERR_NOT_IN_RANGE) {
            this.moveTo(closestActiveSource, {reusePath: 0, visualizePathStyle: {stroke: '#ffbf00', opacity: 0.2}});
        }
    };
    
    Creep.prototype.moveAndTransferEnergy = function (target) {
        this.moveAndTransfer(target, RESOURCE_ENERGY);
    };
    
    Creep.prototype.moveAndTransfer = function (target, resourceType) {
        if (this.transfer(target, resourceType) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#ffffff', opacity: 0.2}});
        }
    };
    
    Creep.prototype.moveAndBuild = function (constructionSite) {
        if (this.build(constructionSite) === ERR_NOT_IN_RANGE) {
            this.moveTo(constructionSite, {reusePath: 0, visualizePathStyle: {stroke: '#1e7dff', opacity: 0.2}});
        }
    };
    
    Creep.prototype.moveAndUpgradeController = function (controller) {
        if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            this.moveTo(controller, {reusePath: 0, visualizePathStyle: {stroke: '#ffffff', opacity: 0.2}});
        }
    };
    
    Creep.prototype.moveAndRepair = function (target) {
        if (this.repair(target) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#008000', opacity: 0.2}});
        }
    };
    
    Creep.prototype.isCarryingMaximumEnergy = function () {
        return this.carry[RESOURCE_ENERGY] === this.carryCapacity;
    };
    
    Creep.prototype.isCarryingZeroEnergy = function () {
        return this.carry[RESOURCE_ENERGY] === 0;
    };
};
