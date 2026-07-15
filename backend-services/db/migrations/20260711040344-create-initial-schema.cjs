const fs = require('node:fs')
const path = require('node:path')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, _Sequelize) {
		// Read init.sql
		const initSqlPath = path.join(__dirname, '../init.sql')
		const initSql = fs.readFileSync(initSqlPath, 'utf8')

		//Execute the SQL script
		await queryInterface.sequelize.query(initSql)
	},

	async down(queryInterface, _Sequelize) {
		// Delete schema if it exists
		await queryInterface.sequelize.query(
			`DROP SCHEMA IF EXISTS "Min-URL" CASCADE;`,
		)
	},
}
