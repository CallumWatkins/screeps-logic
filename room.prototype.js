module.exports = function () {
    /**
     * Returns an object (keys: attacker usernames, values: number of creeps owned by that user), or undefined if there are no attackers.
     * 
     * @returns {boolean} True if this room is under attack.
     */
    Room.prototype.findAttackers = function () {
        var attackers = _(this.find(FIND_HOSTILE_CREEPS)).filter(c => c.getActiveBodyparts(ATTACK) ||
                                                                      c.getActiveBodyparts(RANGED_ATTACK) ||
                                                                      (c.getActiveBodyparts(CLAIM) && c.pos.hasPathTo(this.controller, 1, true)))
                                                         .countBy('owner.username')
                                                         .omit('MrFishHead', 'Simon7919')
                                                         .value(); // {'Invader': 5, 'OtherPlayer': 2}
        return !Object.keys(attackers).length ? undefined : attackers;
    };
    
    Room.prototype.tryActivateSafeMode = function () {
        if (!this.controller.safeMode && this.controller.safeModeAvailable && !this.controller.safeModeCooldown) {
            this.controller.activateSafeMode();
            console.log('=== SAFE MODE ACTIVATED ===');
            Game.notify(`Safe mode was activated in room ${this.name}.`);
        }
    };
};
