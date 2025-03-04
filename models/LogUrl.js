import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const LogUrlModel = sequelize.define(
	'logurls',
	{
		id_logurls: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		url_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'url',
				key: 'id_url',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		ip_address: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING(10),
			allowNull: true,
		},
		region: {
			type: DataTypes.STRING(10),
			allowNull: true,
		},
		timezone: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		latitude: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		longitude: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{ tableName: 'logurls', schema: 'Min-URL', timestamps: false },
)
