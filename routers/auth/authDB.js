const db = require('../../data/dbConfig');

module.exports = {
    add,
    findBy,
};

function add(user) {

    return db('users').insert(user)
        .returning(['id']);

}


function findBy(filter) {
    return db('users').where(filter);
}




