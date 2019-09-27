const db = require('../../data/dbConfig');

module.exports = {
    add,
    get,
    update,
    remove,
    findBy,
    findByGraph
};

function findBy(filter) {
    return db('legs')
        .where(filter);
}

function findByGraph(filter) {
    return db('legs')
        .select('legs.name')
        .where(filter);
}


async function add(leg) {
    return await db('legs')
        .insert(leg, "id")
        .then(([id]) => {
            return findBy({id})
        });
}



function get() {
    return db('legs');
}


//update graph
function update(filter, changes) {
    return db('legs')
        .where(filter)
        .update(changes)
}

function remove(filter) {
    return db('legs')
        .where(filter)
        .del();
}