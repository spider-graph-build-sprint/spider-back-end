exports.seed = function (knex) {
    return knex('datasets').del()
        .then(function () {
            return knex('datasets').insert([
                {name: 'Step1', graph_id: 1},
                {name: 'Step2', graph_id: 1},
                {name: 'Step3', graph_id: 1},

                {name: 'Step1', graph_id: 2},
                {name: 'Step2', graph_id: 2},
                {name: 'Step3', graph_id: 2},

                {name: 'Step1', graph_id: 3},
                {name: 'Step2', graph_id: 3},
                {name: 'Step3', graph_id: 3},

                {name: 'Step1', graph_id: 4},
                {name: 'Step2', graph_id: 4},
                {name: 'Step3', graph_id: 4},

                {name: 'Step1', graph_id: 5},
                {name: 'Step2', graph_id: 5},
                {name: 'Step3', graph_id: 5},
            ]);
        });
};
