exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('points').del()
        .then(function () {
            return knex('points').insert([
                {data: 50, dataset_id: 1},
                {data: 10, dataset_id: 1},
                {data: 16, dataset_id: 1},

                {data: 50, dataset_id: 2},
                {data: 10, dataset_id: 2},
                {data: 16, dataset_id: 2},

                {data: 50, dataset_id: 3},
                {data: 10, dataset_id: 3},
                {data: 16, dataset_id: 3},

                {data: 50, dataset_id: 4},
                {data: 10, dataset_id: 4},
                {data: 16, dataset_id: 4},

                {data: 50, dataset_id: 5},
                {data: 10, dataset_id: 5},
                {data: 16, dataset_id: 5},
            ]);
        });
};
