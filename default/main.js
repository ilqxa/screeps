var structAnalyzer = require('structures.analysis');
var creepsProcessor = require('creeps.processing');
var spawnProcessor = require('spawn.processing');

module.exports.loop = function () {
    console.log('tick');
    Memory.tasks = [];
    
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    for (var name in Game.structures) {
        var structure = Game.structures[name];
        structAnalyzer.discover_needs(structure);
    }
    
    Memory.tasks = Memory.tasks.sort().reverse();
    
    for (var name in Game.creeps) {
        creep = Game.creeps[name];
        creepsProcessor.give_an_order(creep);
    }
    
    for (var name in Game.spawns) {
        spawn = Game.spawns[name];
        spawnProcessor.give_an_order(spawn);
    }
    
    
}