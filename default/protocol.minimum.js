// const Protocol = require('structures.analysis');

class ProtocolMinimum {
    constructor(room) {
        this.name = 'Simple start';
        this.room = room;
        this.actual_target = this.find_target_in_a_room(room);
        this.actual_source = this.find_source_in_a_room(room);
        this.body_requirements = {
            CARRY: 1,
            WORK: 1,
            MOVE: 1,
        }
        this.body_preferences = {
            CARRY: 3,
            WORK: 3,
            MOVE: 3,
        }
    }
    static is_applicable() {
        return true;
    }
    check_creep_for_compliance(creep) {
        for (let part of this.body_requirements) {
            var owned = _.filter(creep.body, {type: part}).length
            if (owned < this.body_requirements.part) {
                console.log('Creep ' + creep.name + " isn't compatible for protocol " + this.name);
                return false;
            }
        }
        console.log('Creep ' + creep.name + " is compatible for protocol " + this.name);
        return false;
    }
    build_new_creep_body_project(maxEnergy) {
        return [MOVE, WORK, CARRY];
    }
    calculate_energy_structures(energyStructures) {
        return {
            'total': energyStructures.reduce((sum, current) => sum + current.store.getCapacity(RESOURCE_ENERGY), 0),
            'used': energyStructures.reduce((sum, current) => sum + current.store.getUsedCapacity(RESOURCE_ENERGY), 0),
        };
    }
    interact_with_a_spawn(spawn, energyStructures) {
        console.log('We have an interaction with the spawn ' + spawn.name);
        let energyCapacity = this.calculate_energy_structures(energyStructures);
        console.log('We have ' + energyCapacity['used'] + '/' + energyCapacity['total'] + ' energy');
        if (energyCapacity['used'] == energyCapacity['total']) {
            const body = this.build_new_creep_body_project(energyCapacity['total']);
            const res = spawn.spawnCreep(
                body,
                Game.time,
                {
                    energyStructures: energyStructures,
                    memory: {
                        protocol: this.name,
                        status: 'move_to_source',
                    }
                }
            );
            switch (res) {
                case OK:
                    console.log('We are spawning new creep');
                    // this.find_target_in_a_room(this.room);
                    break;
                default:
                    console.log("We can't spawn new creep because of error code " + res);
                    break;
            }
        } else {
            console.log("Energy for a new spawn isn't enough");
        }
    }
    find_source_in_a_room(room) {
        let sources = room.find(FIND_SOURCES_ACTIVE);
        return sources[0];
    }
    find_target_in_a_room(room) {
        // let structures = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];
        // for (let struct of structures) {
        //     var targets = room.find(
        //         FIND_STRUCTURES,
        //         {
        //             filter: (structure) => {
        //                 return (
        //                     structure.structureType == struct && 
        //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        //                 )
        //             }
        //         }
        //     );
        //     if (targets.length) {
        //         targets.sort((a,b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
        //         console.log('Protocol ' + this.name + ' set a new target at ' + targets[0].pos.x + '/' + targets[0].pos.y);
        //         return targets[0];
        //     }
        // };
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
                        this.actual_target.pos.x + '/' + this.actual_target.pos.y + ' ' + this.actual_target.pos.roomName
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
        if (creep.store.getFreeCapacity() <= 1) {
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
        } else {
            console.log('Structure ' + this.actual_target.id + " isn't a controller");
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
        const structType = this.actual_target.structureType;
        switch (structType) {
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
            case STRUCTURE_TOWER:
                this.handle_structure(creep);
                break;
            case STRUCTURE_CONTROLLER:
                this.handle_controller(creep);
                break;
        }
        if (creep.store.getUsedCapacity() <= 1) {
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
                this.handle_target(creep);
                break;
            default:
                console.log('Creep ' + creep.name + " don't know what next he does");
                break;
        }
    }
}

module.exports = ProtocolMinimum;