exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('legs').del()
        .then(function () {
            // Inserts seed entries
            return knex('legs').insert([
                {name: 'Read books', graph_id: 1},
                {name: 'Find a solution', graph_id: 1},
                {name: 'Do that', graph_id: 1},

                {name: 'Save money', graph_id: 2},
                {name: 'Create plan', graph_id: 2},
                {name: 'Make money', graph_id: 2},


                {name: 'Buy food', graph_id: 3},
                {name: 'Cook something', graph_id: 3},
                {name: 'Eat', graph_id: 3},

                {name: 'Read newspapers', graph_id: 4},
                {name: 'Go to indeed', graph_id: 4},
                {name: 'Go to linkid', graph_id: 4},

                {name: 'Don`t buy anything', graph_id: 5},
                {name: 'Don`t refill the fills on phone', graph_id: 5},
                {name: 'Don`t go anywhere', graph_id: 5},
            ]);
        });
};
