/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn(
			{
				tableName: 'geolocations',
				schema: 'min_url',
			},
			'updated_at',
			{
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
				allowNull: false,
			},
		)
	},

	async down(queryInterface, _Sequelize) {
		await queryInterface.removeColumn(
			{
				tableName: 'geolocations',
				schema: 'min_url',
			},
			'updated_at',
		)
	},
}
