// const Protocol = require('structures.analysis');

class ProtocolMinimum {
    constructor(room) {
        this.name = 'Simple start';
        this.actual_source = this.find_source_in_a_room(room);
        this.actual_target = this.find_target_in_a_room(room);
    }
    static is_applicable() {
        return true;
    }
    find_source_in_a_room(room) {
        let sources = room.find(FIND_SOURCES_ACTIVE);
        return sources[0];
    }
    find_target_in_a_room(room) {
        let structures = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];
        for (let struct of structures) {
            var targets = room.find(
                FIND_STRUCTURES,
                {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_SPAWN && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        )
                    }
                }
            );
            targets.sort((a,b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
            if (targets.length) {
                return targets.length;
            }
        };
        return room.controller;
    }
    move_to_source(creep) {
        const path = creep.pos.findPathTo(this.actual_source);
        const res = creep.move(path[0].direction);
        switch (res) {
            case OK:
                console.log(
                    'Creep ' + creep.name + ' move to a source at ' +
                    this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName
                );
                break;
            case ERR_TIRED:
                console.log(
                    'Creep ' + creep.name + ' has some rest in moving to a source at ' +
                    this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName
                );
                break;
            default:
                console.log(
                    'Creep ' + creep.name + " can't move to a source at " +
                    this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName +
                    ' because of error code: ' + res
                )
            break;
        }
        if (path.length <= 1) {
            creep.memory.status = 'loading';
            console.log('Creep ' + creep.name + ' has got new status: loading');
        }
    }
    move_to_target(creep) {
        const path = creep.pos.findPathTo(this.actual_target);
        const res = creep.move(path[0].direction);
        switch (res) {
            case OK:
                console.log(
                    'Creep ' + creep.name + ' move to a target at ' +
                    this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName
                );
                break;
                case ERR_TIRED:
                    console.log(
                        'Creep ' + creep.name + ' has some rest in moving to a target at ' +
                        this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName
                    );
                    break;
            default:
                console.log(
                    'Creep ' + creep.name + " can't move to a target at " +
                    this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName +
                    ' because of error code: ' + res
                )
            break;
        }
        if (path.length <= 1) {
            creep.memory.status = 'unloading';
            console.log('Creep ' + creep.name + ' has got new status: unloading');
        }
    }
    harvest_source(creep) {
        const res = creep.harvest(this.actual_source);
        switch (res) {
            case OK:
                console.log(
                    'Creep ' + creep.name + ' harvested source at ' +
                    this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName +
                    ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity()
                );
                break;
            default:
                console.log(
                    'Creep ' + creep.name + " can't harvest a source at " +
                    this.actual_source.pos.x + '/' + this.actual_source.pos.y + ' ' + this.actual_source.pos.roomName +
                    ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity() +
                    ' because of error code: ' + res
                )
            break;
        }
        if (!creep.store.getFreeCapacity()) {
            creep.memory.status = 'move_to_target';
            console.log('Creep ' + creep.name + ' has got new status: move_to_target');
        }
    }
    handle_controller(creep) {
        if (this.actual_target.structureType == STRUCTURE_CONTROLLER) {
            const res = creep.upgradeController(this.actual_target);
            switch (res) {
                case OK:
                    console.log(
                        'Creep ' + creep.name + " upgrade controller at " +
                        this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName +
                        ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity()
                    )
                break;
                default:
                    console.log(
                        'Creep ' + creep.name + " can't upgrade controller at " +
                        this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName +
                        ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity() +
                        ' because of error code: ' + res
                    )
                break;
            }
        }
    }
    handle_structure(creep) {
        let allowed_structures = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];
        const is_allowed = allowed_structures.includes(this.actual_target.structureType);
        if (is_allowed) {
            const res = creep.transfer(this.actual_target, RESOURCE_ENERGY);
            switch (res) {
                case OK:
                    console.log(
                        'Creep ' + creep.name + " transfer resources to " +
                        this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName +
                        ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity()
                    )
                break;
                default:
                    console.log(
                        'Creep ' + creep.name + " can't transfer resources to " +
                        this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName +
                        ': ' + creep.store.getUsedCapacity() + '/' + creep.store.getCapacity() +
                        ' because of error code: ' + res
                    )
                break;
            }
        } else {
            console.log(
                'Creep ' + creep.name + " can't handle a structure " + this.actual_target.id
            );
        }
    }
    handle_target(creep) {
        switch (this.actual_target.structureType) {
            case STRUCTURE_SPAWN:
            case STRUCTURE_STRUCTURE_EXTENSION:
            case STRUCTURE_TOWER:
                this.handle_structure(creep);
                break;
            case STRUCTURE_CONTROLLER:
                this.handle_controller(creep);
                break;
        }
        if (!creep.store.getUsedCapacity()) {
            creep.memory.status = 'move_to_source';
            console.log('Creep ' + creep.name + ' has got new status: move_to_source');
        }
    }
    next_step_for_creep(creep) {
        switch (creep.memory.status) {
            case 'move_to_source':
                this.move_to_source(creep);
                break;
            case 'loading':
                this.harvest_source(creep);
                break;
            case 'move_to_target':
                this.move_to_target(creep);
                break;
            case 'unloading':
                this.handle_structure(creep);
                break;
            default:
                console.log('Creep ' + creep.name + " don't know what next he does");
                break;
        }
    }
}

module.exports = ProtocolMinimum;