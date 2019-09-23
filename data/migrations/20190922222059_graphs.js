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
        .createTable('legs', labels =>{
            labels.increments();
            labels.string('name', 128)
                .notNullable();
            labels.integer('graph_id', 128)
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('graphs')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users')
};
