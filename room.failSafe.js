module.exports = {
    checkRoom: function(room) {
        if (room.controller.safeModeAvailable &&
            !room.controller.safeModeCooldown &&
            _.any(room.find(FIND_HOSTILE_CREEPS), c => c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0)) {
                
            room.controller.activateSafeMode();
            console.log('=== SAFE MODE ACTIVATED ===');
            Game.notify(`Safe mode was activated in room ${room.name}.`);
        }
    }
};
