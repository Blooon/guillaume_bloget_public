
exports.up = function(knex, Promise) {
    return knex.schema.createTable('types', function(table) {
        table.increments();
        table.text('color');
        table.text('table_name');
        table.integer('item_id')
        table.text('image');
        table.text('value');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('types');
};
