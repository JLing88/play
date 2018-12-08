
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/play_development',
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/play_test',
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true
  },

  staging: {
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
  },

  production: {
    client: 'pg',
    debug: true,
    connection: {
      database: 'postgres://jabmpgotqzudnt:2d693c2e91c4913aec5c123a1ff5cbdf2dd298f0e54ea6a045d5785ebf1bc41d@ec2-54-235-156-60.compute-1.amazonaws.com:5432/dcpn9veojus1dp',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    },
    ssl: true
  }

};
