require('prototype.creep')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var desiredCreeps = {
    'harvester': 4,
    'upgrader': 7,
    'builder': 0
};

module.exports.loop = function () {
    deleteUnusedMemory();
    
    spawnDesiredCreeps();
    
    executeRoles();
}

function deleteUnusedMemory() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function spawnDesiredCreeps() {
    if (Game.spawns['Spawn1'].spawning) { return; }
    
    for (var desiredRole in desiredCreeps) {
        if (_.sum(Game.creeps, creep => creep.memory.role == desiredRole) < desiredCreeps[desiredRole]) {
            spawnCreep(desiredRole);
            break;
        }
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
}

function spawnCreep(role) {
    var creepBodyParts = {
        'harvester': [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        'upgrader': [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        'builder': [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
    }
    
    var newName = role.charAt(0).toUpperCase() + role.substring(1) + Game.time;
    
    var spawnErr = Game.spawns['Spawn1'].spawnCreep(creepBodyParts[role], newName, {memory: {role: role}});
    switch (spawnErr) {
        case OK:
            console.log(`Spawning new ${role}: ${newName}`);
            break;
        case ERR_NOT_OWNER:
            console.error('Spawn1 not owned')
            break;
        case ERR_NAME_EXISTS:
            console.error('Another creep with the same name already exists when spawn attempted.');
            break;
        case ERR_BUSY:
            console.error('Another spawn already in progress when spawn attempted.');
            break;
        case ERR_NOT_ENOUGH_ENERGY:
            console.log(`Not enough energy to build new ${role}! (${Game.spawns['Spawn1'].room.energyAvailable} / ${calculateBodyCost(creepBodyParts[role])} energy)`);
            if (_.sum(Game.creeps, (creep) => creep.memory.role == 'harvester') === 0) {
                console.log('No harvesters remaining. Attempting to build emergency harvester...');
                spawnErr = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: role}});
                if (spawnErr !== 0) {
                    console.log(`Emergency harvester spawn failed with error code ${spawnErr}`);
                    console.log('Attempting to convert an existing creep into a harvester...');
                    
                    // Find the first creep that has at least [WORK,CARRY,MOVE] body parts.
                    var compatibleCreep = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
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

function executeRoles() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function displayCreepRoleCounts() {
    var countByRole = _(Game.creeps).countBy(c => c.memory.role).value();
    
    var list = _(desiredCreeps).mapValues((value, key) => `${countByRole[key] || 0}/${value}`)
                               .reduce((acc, val, key) => `${acc}\n${key}: ${val}`, '');
    
    console.log('Creep roles:' + list);
}

module.exports.displayCreepRoleCounts = displayCreepRoleCounts;



