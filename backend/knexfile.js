// Update with your config settings.
const sharedConfig = {
  useNullAsDefault: true,
  // generates migration files in a data/migrations/ folder
  migrations: {
    directory: './data/migrations'
  },
  seeds: {
    directory: './data/seeds'
  }
};


module.exports = {

  development: {
      ...sharedConfig,
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3'
      },
      // needed when using foreign keys
      pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
      }
    }
  },
  production: {
    ...sharedConfig,
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
