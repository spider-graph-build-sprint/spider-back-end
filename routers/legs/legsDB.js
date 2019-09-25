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


function add(leg) {
    return db('legs')
        .insert(leg)
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


async function remove(filter) {
    const legs = await findBy({name: filter});
    if (legs.length) {
        await db('legs')
            .where({name: filter})
            .del();
        return legs;
    } else return null;
}