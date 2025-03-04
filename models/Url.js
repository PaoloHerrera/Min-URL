import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const UrlModel = sequelize.define(
	'urls',
	{
		id_urls: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'user',
				key: 'id_user',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		long_url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		slug: {
			type: DataTypes.STRING(16),
			allowNull: false,
			unique: true,
		},
		clicks: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		purpose: {
			type: DataTypes.ENUM('direct', 'qr', 'api'),
			allowNull: false,
		},
		password: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		password_text: {
			type: DataTypes.STRING(128),
			allowNull: true,
		},
		expiration: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		expiration_date: {
			type: DataTypes.DATE,
			allowNull: true,
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
	{ tableName: 'urls', schema: 'Min-URL', timestamps: false },
)
