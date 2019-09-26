const bcrypt = require('bcryptjs');

exports.seed = function (knex) {
    return knex('users').del()
        .then(function () {
            const password = "admin123";
            const hash = bcrypt.hashSync(password, 10);
            return knex('users').insert([
                {username: 'admin', password: hash},
            ]);
        });
};
