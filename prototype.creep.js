module.exports = function () {
    /**
     * Pick up any droppd energy adjacent to the current location.
     * 
     * @returns {boolean} True if energy was picked up.
     */
    Creep.prototype.pickupNearByDroppedEnergy = function () {
        var closestDroppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType === RESOURCE_ENERGY});
        if (this.pos.isNearTo(closestDroppedEnergy)) {
            this.pickup(closestDroppedEnergy);
            this.say('💲 pickup');
            return true;
        }
        
        return false;
    }
    
    /**
     * Move to and harvest the closest actve energy source.
     */
    Creep.prototype.harvestNearestEnergy = function () {
        var closestActiveSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(closestActiveSource) == ERR_NOT_IN_RANGE) {
            this.moveTo(closestActiveSource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};