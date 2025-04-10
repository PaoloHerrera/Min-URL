import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const ClickDetailModel = sequelize.define(
	'clicks_details',
	{
		id_clicks_details: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		click_id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			references: {
				model: 'clicks',
				key: 'id_clicks',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		geolocations_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'geolocations',
				key: 'id_geolocations',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		user_agent: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		device_type: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		referer: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: 'clicks_details', schema: 'Min-URL', timestamps: false },
)

export const createClickDetail = async (data) => {
	const clickDetail = await ClickDetailModel.create(data)
	return clickDetail
}

export const getClickDetail = async (id) => {
	const clickDetail = await ClickDetailModel.findByPk(id)
	return clickDetail
}
