exports.seed = function (knex) {
    return knex('graphs').del()
        .then(function () {
            return knex('graphs').insert([
                {name: 'Homework', user_id: 1},
                {name: 'Business', user_id: 1},
                {name: 'Dinner', user_id: 1},
                {name: 'Find a job', user_id: 1},
                {name: 'Save 1000$', user_id: 1},
            ]);
        });
};
