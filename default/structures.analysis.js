module.exports = {
    discover_needs: function(structure) {
        console.log('Start structure analysis');
        switch (structure.structureType) {
            case STRUCTURE_SPAWN:
                if (structure.store.getFreeCapacity(RESOURCE_ENERGY)) {
                    var req = {
                        'priority': structure.store.getFreeCapacity(RESOURCE_ENERGY),
                        'resource': RESOURCE_ENERGY,
                        'recepient': structure,
                    }
                    Memory.tasks.push(req);
                }
                break;
            case STRUCTURE_CONTROLLER:
                var req = {
                    'priority': 50,
                    'resource': RESOURCE_ENERGY,
                    'recepient': structure,
                }
                Memory.tasks.push(req);
                break;
        }
    }
};