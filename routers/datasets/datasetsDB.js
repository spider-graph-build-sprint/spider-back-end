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
    return db('datasets')
        .where(filter);
}

function findByGraph(filter) {
    return db('datasets')
        .select('datasets.name')
        .where(filter);
}

function add(dataset) {
    return db('datasets')
        .insert(dataset)
        .then(([id]) => {
            return findBy({id})
        });
}


function get() {
    return db('datasets');
}

//update graph
function update(filter, changes) {
    return db('datasets')
        .where(filter)
        .update({...changes}, ['id'])
}




async function remove(filter) {
    const datasets = await findBy({name: filter.name});
    if (datasets.length) {
        await db('datasets')
            .where(filter)
            .del();
        return datasets;
    } else return null;
}