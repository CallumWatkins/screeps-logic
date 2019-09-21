module.exports = function () {
    RoomPosition.prototype.hasPathTo = function (target, {range = 1, ignoreCreeps = false}={}) {
        let targetRoomName;
        if (target instanceof RoomPosition) {
            targetRoomName = target.roomName;
        } else if (target.pos && (target.pos instanceof RoomPosition)) {
            targetRoomName = target.pos.roomName;
        } else {
            throw new Error('target invalid');
        }
        
        if (targetRoomName !== this.roomName) { return false; } // Target not in the same room
        
        if (this.inRangeTo(target, range)) { return true; } // Target already in range
        
        let path = this.findPathTo(target, {algorithm: 'astar', ignoreRoads: true, range: range, ignoreCreeps: ignoreCreeps});
        
        if (!path.length) { return false; } // No path found
        
        return Game.rooms[this.roomName]
                   .getPositionAt(path[path.length - 1].x, path[path.length - 1].y)
                   .inRangeTo(target, range); // Last position of path is in range of the target
    };
};
