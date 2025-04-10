import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const ClickModel = sequelize.define(
	'clicks',
	{
		id_clicks: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		url_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'urls',
				key: 'id_urls',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: 'clicks', schema: 'Min-URL', timestamps: false },
)

export const createClick = async (data) => {
	const click = await ClickModel.create(data)
	return click
}

export const getClick = async (id) => {
	const click = await ClickModel.findByPk(id)
	return click
}
