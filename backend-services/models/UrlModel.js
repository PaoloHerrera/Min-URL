import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const UrlModel = sequelize.define(
	'urls',
	{
		id_urls: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'user',
				key: 'id_user',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		geolocations_id: {
			type: DataTypes.UUID,
			allowNull: true,
			unique: true,
			references: {
				model: 'geolocations',
				key: 'id_geolocations',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		long_url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		purpose: {
			type: DataTypes.ENUM('direct', 'qr', 'api'),
			allowNull: false,
			defaultValue: 'direct',
		},
		password: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		password_hash: {
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
		expired: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		expired_at: {
			type: DataTypes.DATE,
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

export const createUrl = async (data) => {
	const url = await UrlModel.create(data)
	return url
}

export const getUrl = async (id) => {
	const url = await UrlModel.findByPk(id)
	return url
}
