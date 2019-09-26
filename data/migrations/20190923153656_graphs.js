exports.up = function (knex) {
    return knex.schema.createTable('users', users => {
        users.increments();
        users.string('username', 128)
            .unique()
            .notNullable();
        users.string('password', 500)
            .notNullable();
    })

        .createTable('graphs', graphs => {
            graphs.increments();
            graphs.string('name', 128)
                .notNullable();
            graphs.integer('user_id', 128)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })

        .createTable('legs', legs =>{
            legs.increments();
            legs.string('name', 128)
                .notNullable();
            legs.integer('graph_id', 128)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('graphs')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })

        .createTable('datasets', datasets =>{
            datasets.increments();
            datasets.string('name', 128)
                .notNullable();
            datasets.integer('graph_id', 128)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('graphs')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })

        .createTable('points', points =>{
            points.increments();
            points.integer('data', 128)
                .notNullable();
            points.integer('dataset_id', 128)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('datasets')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users')
        .dropTableIfExists('graphs')
        .dropTableIfExists('legs')
        .dropTableIfExists('datasets')
        .dropTableIfExists('points')
};
