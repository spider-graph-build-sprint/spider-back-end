
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'admin', password: "1234"},
        {id: 1, username: 'user1', password: "1234"},
        {id: 1, username: 'user2', password: "1234"},
        {id: 1, username: 'user3', password: "1234"},
      ]);
    });
};
