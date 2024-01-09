function handleSpawn(creep, spawn) {
    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
        console.log('Creep ' + creep.name + ' is going to spawn ' + spawn.name);
    } else {
        console.log('Creep ' + creep.name + ' is unloading at spawn ' + spawn.name);
    }
};

function handleController(creep, controller) {
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
        console.log('Creep ' + creep.name + ' is going to controller at ' + controller.pos);
    } else {
        console.log('Creep ' + creep.name + ' is upgrading controller at ' + controller.pos);
    }
};

function handleStructure(creep, structure) {
    switch (structure.structureType) {
        case STRUCTURE_SPAWN:
            handleSpawn(creep, structure);
            break;
        case STRUCTURE_CONTROLLER:
            handleController(creep, structure);
            break;
    }
};

function handleSource(creep, source) {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        console.log('Creep ' + creep.name + ' is going to source at ' + source.pos);
    } else {
        console.log('Creep ' + creep.name + ' is harvesting source at ' + source.pos);
    }
};

module.exports = {
    give_an_order: function(creep) {
        console.log('Start creep processing');
        // Проверка что крип свободен
        if (false) {
            return;
            console.log('Creep ' + creep.name + ' is busy');
        } else {
            console.log('Creep ' + creep.name + ' is ready');
        }
        // Выбор задачи
        for (id in Memory.tasks) {
            var task = Memory.tasks[id];
            if (task['assigned'] || !task['priority']) continue;
            switch (task['resource']) {
                case RESOURCE_ENERGY:
                    // Проверка возможности выполнения
                    if (
                        creep.getActiveBodyparts(MOVE) &&
                        creep.getActiveBodyparts(WORK) &&
                        creep.getActiveBodyparts(CARRY)
                    ) {
                        // Уточнение по текущему статусу
                        if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                            var sources = creep.room.find(FIND_SOURCES);
                            handleSource(creep, sources[0]);
                            console.log('Assign ' + creep.name + ' to harvest energy because his storage is empty');
                        } else if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                            handleStructure(creep, task['recepient']);
                            console.log('Assign ' + creep.name + ' to deliver energy because his storage is full');
                        } else {
                            var sources = creep.room.find(FIND_SOURCES);
                            distanceToSource = PathFinder.search(creep.pos, {'pos': sources[0].pos, 'range': 0});
                            distanceToRecepient = PathFinder.search(creep.pos, {'pos': task['recepient'].pos, 'range': 0});
                            
                            if (distanceToRecepient['cost'] <= distanceToSource['cost']) {
                                handleStructure(creep, task['recepient']);
                                console.log('Assign ' + creep.name + ' to deliver energy because its cheaper');
                            } else {
                                handleSource(creep, sources[0]);
                                console.log('Assign ' + creep.name + ' to harvest energy because its cheaper');
                            }
                        }
                        task['assigned'] = true;
                        return;
                    }
                    break;
            }
        }
        console.log('Creep ' + creep.name + ' stay without any task');
    }
}