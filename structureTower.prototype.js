module.exports = function () {
    /** The proportion of energy to reserve (for the event of an attack) when healing or repairing. */
    StructureTower.prototype.RESERVE_ENERGY_COEFFICIENT = 0.75;
    
    /**
     * Make this tower attack, heal and repair as required.
     * 
     * @param {boolean} underAttack - Whether or not the room is under attack by hostile creeps.
     */
    StructureTower.prototype.run = function (underAttack) {
        if (this.energy === 0) { return; }
        
        // 1. Attack closest hostile creep
        if (underAttack) {
            let closestEnemyCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestEnemyCreep) {
                this.attack(closestEnemyCreep);
                return;
            }
        }
        
        // Reserve 75% energy in case of attack
        if (this.energy - 10 < this.RESERVE_ENERGY_COEFFICIENT * this.energyCapacity) { return; }
        
        // 2. Heal closest damaged creep
        let closestDamagedCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
        if (closestDamagedCreep) {
            this.heal(closestDamagedCreep);
            return;
        }
        
        // Load structures at ranges 0-10 with less than max hits
        let damagedStructuresAtRange = []; // TODO: Cache for some time
        for (let range = 0; range <= 10; range++) {
            damagedStructuresAtRange[range] = _(this.room.find(FIND_STRUCTURES)).filter(s => this.pos.getRangeTo(s) === range &&
                                                                                             s.hits < s.hitsMax)
                                                                                .map(s => _.pick(s, ['id', 'structureType', 'hits', 'hitsMax']));
        }
        //Memory.structureTowers[this.id].damagedStructuresAtRange = {data: damagedStructuresAtRange, cacheExpiryTime: Game.time+5};
        
        let repairTarget = this.findRepairTarget(damagedStructuresAtRange);
        if (repairTarget) {
            this.repair(repairTarget);
        }
    }

    /**
     * Find a target to repair.
     * 
     * @param {Structure[][]} damagedStructuresAtRange - Structures at each range that are damaged.
     * @returns {?Structure} The structure to repair, or null if no target was found.
     */
    StructureTower.prototype.findRepairTarget = function (damagedStructuresAtRange) {
        // TODO: Maybe cache target for a few ticks, so that this doesn't have to run as often
        // 3. Repair walls/ramparts within 0-10 range to 50,000 hits
        for (let range = 0; range <= 10; range++) {
            let mostDamagedWallRampart = _(damagedStructuresAtRange[range]).filter(s => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < 50000)
                                                                           .min('hits');
            if (mostDamagedWallRampart !== Infinity) {
                return Game.getObjectById(mostDamagedWallRampart.id);
            }
        }
        
        // 4. Repair all other structures within 1-10 range to 0.5*hitsMax
        for (let range = 1; range <= 10; range++) {
            let otherDamagedStructure = _(damagedStructuresAtRange[range]).filter(s => s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART && s.hits < 0.5*s.hitsMax)
                                                                          .min('hits');
            if (otherDamagedStructure !== Infinity) {
                return Game.getObjectById(otherDamagedStructure.id);
            }
        }
        
        // 5. Repair walls/ramparts within 0-5 range to max hits
        for (let range = 0; range <= 5; range++) {
            let mostDamagedWallRampart = _(damagedStructuresAtRange[range]).filter(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
                                                                           .min('hits');
            if (mostDamagedWallRampart !== Infinity) {
                return Game.getObjectById(mostDamagedWallRampart.id);
            }
        }
        
        // 6. Repair walls/ramparts within 6-10 range to 200,000 hits
        for (let range = 6; range <= 10; range++) {
            let mostDamagedWallRampart = _(damagedStructuresAtRange[range]).filter(s => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < 200000)
                                                                           .min('hits');
            if (mostDamagedWallRampart !== Infinity) {
                return Game.getObjectById(mostDamagedWallRampart.id);
            }
        }
        
        return null;
    }
};
