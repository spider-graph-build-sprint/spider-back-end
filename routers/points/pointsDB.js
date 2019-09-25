const db = require('../../data/dbConfig');

module.exports = {
    add,
    get,
    update,
    remove,
    findBy
};

function findBy(filter) {
    return db('points')
        .where(filter);
}


function add(point) {
    return db('points')
        .insert(point)
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
        .update(changes)
}


async function remove(filter) {
    const points = await findBy({name: filter});
    if (points.length) {
        await db('points')
            .where({name: filter})
            .del();
        return points;
    } else return null;
}