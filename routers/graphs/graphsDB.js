const db = require('../../data/dbConfig');

module.exports = {
    add,
    get,
    update,
    remove,
    findBy,
    getGraph
};

function findBy(filter) {
    return db('graphs')
        .where(filter);
}


function getGraph(){
    return db('points as p')
        .join('datasets as ds', 'ds.id', 'p.dataset_id')
        .join('graphs as g', 'g.id', 'ds.graph_id')
        .select('g.name', 'ds.name')
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

function update(filter, changes) {
    return db('graphs')
        .where(filter)
        .update({...changes}, ['id'])
}


async function remove(filter) {
    const graph = await findBy(filter);
    if (graph.length) {
        await db('graphs')
            .where(filter)
            .del();
        return graph;
    } else return null;
}