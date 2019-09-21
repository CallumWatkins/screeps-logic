module.exports = function () {
    /** All roles that a creep may have. */
    Creep.prototype.ROLES = {
        'harvester': require('creep.role.harvester'),
        'upgrader': require('creep.role.upgrader'),
        'builder': require('creep.role.builder'),
        'repairer': require('creep.role.repairer')
    };
    
    /**
     * Make this creep perform its role.
     */
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
    
    /**
     * Pick up any dropped resource matching the specified type adjacent to the current location.
     * 
     * @param {string} resourceType - One of the RESOURCE_* constants.
     * @returns {boolean} True if a resource was picked up.
     */
    Creep.prototype.pickupNearByDroppedResource = function (resourceType) {
        var closestDroppedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === resourceType });
        if (this.pos.isNearTo(closestDroppedResource)) {
            this.pickup(closestDroppedResource);
            this.say('💲 pickup');
            return true;
        }
        
        return false;
    };
    
    /**
     * Withdraw any energy from a tombstone adjacent to the current location.
     * 
     * @returns {boolean} True if energy was withdrawn.
     */
    Creep.prototype.withdrawNearByTombstoneEnergy = function () {
        return this.withdrawNearByTombstoneResource(RESOURCE_ENERGY);
    };
    
    /**
     * Withdraw any resource matching the specified type from a tombstone adjacent to the current location.
     * 
     * @param {string} resourceType - One of the RESOURCE_* constants.
     * @returns {boolean} True if a resource was withdrawn.
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
     * @param {RoomPosition} [fromPosition] - The position to find the nearest energy to.
     * @param {boolean} [allowInactiveSources=false] - Allow inactive energy sources to be moved to.
     */
    Creep.prototype.harvestNearestEnergyByPath = function (fromPosition, allowInactiveSources = false) {
        fromPosition = fromPosition || this.pos;
        var closestActiveSource = fromPosition.findClosestByPath(allowInactiveSources ? FIND_SOURCES : FIND_SOURCES_ACTIVE);
        if (this.harvest(closestActiveSource) === ERR_NOT_IN_RANGE) {
            this.moveTo(closestActiveSource, {reusePath: 0, visualizePathStyle: {stroke: '#ffbf00', opacity: 0.2}});
        }
    };
    
    /**
     * Move to and harvest the closest actve energy source by range.
     * 
     * @param {RoomPosition} [fromPosition] - The position to find the nearest energy to.
     * @param {boolean} [allowInactiveSources=false] - Allow inactive energy sources to be moved to.
     */
    Creep.prototype.harvestNearestEnergyByRange = function (fromPosition, allowInactiveSources = false) {
        fromPosition = fromPosition || this.pos;
        var closestActiveSource = fromPosition.findClosestByRange(allowInactiveSources ? FIND_SOURCES : FIND_SOURCES_ACTIVE);
        if (this.harvest(closestActiveSource) === ERR_NOT_IN_RANGE) {
            this.moveTo(closestActiveSource, {reusePath: 0, visualizePathStyle: {stroke: '#ffbf00', opacity: 0.2}});
        }
    };
    
    /**
     * Move and transfer energy to the specified target.
     * 
     * @param {(Creep|Structure)} target - The target to transfer energy to.
     */
    Creep.prototype.moveAndTransferEnergy = function (target) {
        this.moveAndTransfer(target, RESOURCE_ENERGY);
    };
    
    /**
     * Move and transfer a resource to the specified target.
     * 
     * @param {(Creep|Structure)} target - The target to transfer energy to.
     * @param {string} resourceType - One of the RESOURCE_* constants.
     */
    Creep.prototype.moveAndTransfer = function (target, resourceType) {
        if (this.transfer(target, resourceType) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#ffffff', opacity: 0.2}});
        }
    };
    
    /**
     * Move to and build the specified construction site.
     * 
     * @param {ConstructionSite} constructionSite - The construction site to build.
     */
    Creep.prototype.moveAndBuild = function (constructionSite) {
        if (this.build(constructionSite) === ERR_NOT_IN_RANGE) {
            this.moveTo(constructionSite, {reusePath: 0, visualizePathStyle: {stroke: '#1e7dff', opacity: 0.2}});
        }
    };
    
    /**
     * Move to and upgrade the specified controller.
     * 
     * @param {StructureController} controller - The controller to upgrade.
     */
    Creep.prototype.moveAndUpgradeController = function (controller) {
        if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            this.moveTo(controller, {reusePath: 0, visualizePathStyle: {stroke: '#ffffff', opacity: 0.2}});
        }
    };
    
    /**
     * Move to and repair the specified structure.
     * 
     * @param {Structure} target - The structure to repair.
     */
    Creep.prototype.moveAndRepair = function (target) {
        if (this.repair(target) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#008000', opacity: 0.2}});
        }
    };
    
    /**
     * Checks if this creep is carrying maximum energy.
     * 
     * @returns {boolean} True if this creep is carrying energy equal to its carry capacity.
     */
    Creep.prototype.isCarryingMaximumEnergy = function () {
        // TODO: If creeps ever start carrying more than energy, this should probably be changed to isCarryingMaximumResources
        return this.carry[RESOURCE_ENERGY] === this.carryCapacity;
    };
    
    /**
     * Checks if this creep is carrying zero energy.
     * 
     * @returns {boolean} True if this creep is carrying zero energy.
     */
    Creep.prototype.isCarryingZeroEnergy = function () {
        return this.carry[RESOURCE_ENERGY] === 0;
    };
};
