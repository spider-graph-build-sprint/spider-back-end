const db = require('../../data/dbConfig');

module.exports = {
    add,
    get,
    update,
    remove,
    findBy,
    dataset
};

function findBy(filter) {
    return db('points')
        .where(filter);
}

function dataset(filter){
    return db('points as p')
        .join('datasets as d', 'd.id', 'p.dataset_id')
        .join('graphs as g', 'g.id', 'd.graph_id')
        .select('p.data', 'd.graph_id', 'g.name', 'g.user_id')
        .where(filter)
}

async function add(point) {
    return await db('points')
        .insert(point, 'id')
        .then(([id]) => {
            return findBy({id})
        });
}


function get() {
    return db('points');
}

//update graph
function update(filter, changes) {
    return db('points')
        .where(filter)
        .update({...changes}, ['id'])
}

function remove(filter) {
    return db('points')
        .where(filter)
        .del();
}

