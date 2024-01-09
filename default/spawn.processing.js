module.exports = {
    give_an_order: function(spawn) {
        var unassigned = 0;
        for (id in Memory.tasks) {
            var task = Memory.tasks[id];
            if (!task.assigned) unassigned += task['priority'];
        }
        console.log('Unassigned: ' + unassigned);
        
        if ((unassigned > 10 && !spawn.spawning) || !spawn.store.getFreeCapacity()) {
            console.log('Spawn new creep');
            spawn.spawnCreep([WORK, CARRY, MOVE], Game.time);
        };
    }
};