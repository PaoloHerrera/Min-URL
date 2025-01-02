import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

export const LogUrlModel = sequelize.define(
	'logurl',
	{
		id_logurl: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		url_id_url: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'url',
				key: 'id_url',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		id_logurl_hash: {
			type: DataTypes.STRING(16),
			allowNull: true,
			unique: true,
		},
		ip_address: {
			type: DataTypes.STRING(32),
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
	{ timestamps: false },
)
