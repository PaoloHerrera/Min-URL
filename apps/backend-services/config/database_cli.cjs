require('dotenv').config()

module.exports = {
	development: {
		username: process.env.DB_USER || 'admin',
		password: process.env.DB_PASS || 'admin',
		database: process.env.DB_NAME || 'min_url',
		host: process.env.DB_HOST || '127.0.0.1',
		port: process.env.DB_PORT || 5432,
		dialect: 'postgres',
	},
	test: {
		username: process.env.DB_USER || 'admin',
		password: process.env.DB_PASS || 'admin',
		database: process.env.DB_NAME_TEST || 'min_url_test',
		host: process.env.DB_HOST || '127.0.0.1',
		port: process.env.DB_PORT || 5432,
		dialect: 'postgres',
	},
}
