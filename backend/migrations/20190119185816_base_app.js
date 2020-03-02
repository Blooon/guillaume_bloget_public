
exports.up = function(knex) {
    return knex.schema.createTable('once', function(table) {
        table.increments();
        table.text('keyvalue');
        table.text('data');
        }).then(() => {

        return knex.schema.createTable('images', function(table) {
            table.increments();
            table.string('table_name');
            table.integer('item_id');
            table.text('small');
            table.text('medium');
            table.text('large');
            table.integer('ordered');
            table.integer('archived');
        }).then(() => {
            return knex.schema.createTable('users', function(table) {
                table.increments();
                table.string('username').unique();
                table.string('email').unique();
                table.text('password');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            knex.schema
        }).then(() => {
            return knex.schema.createTable('commands', function(table) {
                table.increments();
                table.string('user');
                table.string('basket');
                table.integer('total');
                table.integer('archived').defaultTo(0);
            });
        }).then(() => {
            return knex.schema.createTable("meuble", function(table) {
                table.increments();
                table.float('price');
                table.integer("stock");
                table.text('image');
                table.text('description');
                table.text('name');
                table.integer('archived').defaultTo(0);
                table.timestamp('date');
            })
        })
    })
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
    .then(() => {return knex.schema.dropTable('commands')});
};
