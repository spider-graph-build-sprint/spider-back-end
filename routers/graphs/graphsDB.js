const db = require('../../data/dbConfig');

module.exports = {
    add,
    get,
    update,
    remove,
    findBy
};

function findBy(filter) {
    return db('graphs')
        .where(filter);
}


//create graph
function add(graph) {
    return db('graphs')
        .insert(graph)
        .then(([id]) => {
            return findBy({id})
        });
}

//get all graphs
function get() {
    return db('graphs');
}

//update graph
function update(filter, changes) {
    return db('graphs')
        .where(filter)
        .update(changes)
}


async function remove(filter) {
    const graph = await findBy({name: filter});
    if (graph.length) {
        await db('graphs')
            .where({name: filter})
            .del();
        return graph;
    } else return null;
}