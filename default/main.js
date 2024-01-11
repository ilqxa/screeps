var ProtocolMinimum = require('protocol.minimum');

let protocol = new ProtocolMinimum(Game.rooms['W22S18']);

module.exports.loop = function () {
    console.log('tick');
    
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    let creeps = _.filter(Game.creeps, function(o) {return o.memory.protocol == protocol.name});
    creeps.forEach(creep => protocol.next_step_for_creep(creep));

    let spawns = _.filter(Game.spawns, function(o) {return o.memory.protocol == protocol.name});
    spawns.forEach(spawn => protocol.interact_with_a_spawn(spawn, []));
}