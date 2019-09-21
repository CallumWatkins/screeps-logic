module.exports = function () {
    /**
     * Find attackers in this room.
     * 
     * @returns {?Object} A map of attacker usernames to the number of creeps owned by that user in this room, or null if there are no attackers.
     */
    Room.prototype.findAttackers = function () {
        var attackers = _(this.find(FIND_HOSTILE_CREEPS)).filter(c => c.getActiveBodyparts(ATTACK) ||
                                                                      c.getActiveBodyparts(RANGED_ATTACK) ||
                                                                      (c.getActiveBodyparts(CLAIM) && c.pos.hasPathTo(this.controller, 1, true)))
                                                         .countBy('owner.username')
                                                         .omit('MrFishHead', 'Simon7919')
                                                         .value(); // {'Invader': 5, 'OtherPlayer': 2}
        return !Object.keys(attackers).length ? null : attackers;
    };
    
    /**
     * Try to activate safe mode for this room. Sends a notification if successful.
     */
    Room.prototype.tryActivateSafeMode = function () {
        if (!this.controller.safeMode && this.controller.safeModeAvailable && !this.controller.safeModeCooldown) {
            this.controller.activateSafeMode();
            console.log('=== SAFE MODE ACTIVATED ===');
            Game.notify(`Safe mode was activated in room ${this.name}.`);
        }
    };
};
