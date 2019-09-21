var roomFailSafe = require('room.failSafe');
require('prototypes')();


var desiredCreeps = {
    'harvester': 3,
    'upgrader': 1,
    'builder': 3,
    'repairer': 4
};

module.exports.loop = function () {
    roomFailSafe.checkRoom(Game.spawns['Spawn1'].room);
    
    deleteUnusedMemory();
    
    spawnDesiredCreeps(Game.spawns['Spawn1']);
    
    runCreeps();
}

function deleteUnusedMemory() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Creep died:', name);
        }
    }
}

function spawnDesiredCreeps(spawn) {
    if (spawn.spawning) { return; }
    
    for (var desiredRole in desiredCreeps) {
        if (_.sum(Game.creeps, creep => creep.memory.role === desiredRole) < desiredCreeps[desiredRole]) {
            spawnCreep(desiredRole, spawn);
            break;
        }
    }

    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    }
}

function spawnCreep(role, spawn) {
    var creepBodyParts = {
        'harvester': [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        'upgrader': [WORK,WORK,WORK,CARRY,CARRY,MOVE],
        'builder': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
        'repairer': [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
    }
    
    var newName = role.charAt(0).toUpperCase() + role.substring(1) + Game.time;
    
    var spawnErr = spawn.spawnCreep(creepBodyParts[role], newName, {memory: {role: role}});
    switch (spawnErr) {
        case OK:
            console.log(`Spawning new ${role}: ${newName}`);
            break;
        case ERR_NOT_OWNER:
            console.error(`Spawn not owned: ${spawn.name}`);
            break;
        case ERR_NAME_EXISTS:
            console.error('Another creep with the same name already exists when spawn attempted.');
            break;
        case ERR_BUSY:
            console.error('Another spawn already in progress when spawn attempted.');
            break;
        case ERR_NOT_ENOUGH_ENERGY:
            console.log(`Not enough energy to build new ${role}! (${spawn.room.energyAvailable} / ${calculateBodyCost(creepBodyParts[role])} energy)`);
            if (_.sum(Game.creeps, (creep) => creep.memory.role === 'harvester') === 0) {
                console.log('No harvesters remaining. Attempting to build emergency harvester...');
                spawnErr = spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: role}});
                if (spawnErr !== 0) {
                    console.log(`Emergency harvester spawn failed with error code ${spawnErr}`);
                    console.log('Attempting to convert an existing creep into a harvester...');
                    
                    // Find the first creep that has at least [WORK,CARRY,MOVE] body parts.
                    var compatibleCreep = spawn.room.find(FIND_MY_CREEPS, {
                        filter: c => c.body.map(part => part.type)
                                           .filter(part => [WORK,CARRY,MOVE].includes(part))
                                           .filter((value, index, self) => self.indexOf(value) === index)
                                           .length === 3
                    })[0];
                    
                    if (compatibleCreep === undefined) {
                        console.log('No compatible creeps available to convert');
                        console.error('No harvesters could be created or converted');
                    } else {
                        compatibleCreep.memory.role = 'harvester';
                    }
                }
            }
            break;
        case ERR_INVALID_ARGS:
            console.error('Creep body not properly described or name was not provided when spawn attempted.');
            break;
        case ERR_RCL_NOT_ENOUGH:
            console.error(`RCL insufficient to spawn ${role}`);
            break;
    }
}

function calculateBodyCost(bodyParts) {
    return bodyParts.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}

function runCreeps() {
    for (let name in Game.creeps) {
        Game.creeps[name].run();
    }
}

function displayCreepRoleCounts() {
    var countByRole = _(Game.creeps).countBy(c => c.memory.role).value();
    
    var list = _(desiredCreeps).mapValues((val, key) => `${countByRole[key] || 0}/${val}`)
                               .reduce((acc, val, key) => `${acc}\n${key}: ${val}`, '');
    
    console.log('Creep roles:' + list);
}

module.exports.displayCreepRoleCounts = displayCreepRoleCounts;
