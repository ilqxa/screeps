class Protocol {
    constructor(name) {
        this.name = name;
        this.structures = [];
    }
    static is_applicable() {
        return true;
    }
    static get_new_step_for_creep(creep) {

    }
    static get_new_step_for_spawn(spawn) {
        
    }
}

module.exports = Protocol;