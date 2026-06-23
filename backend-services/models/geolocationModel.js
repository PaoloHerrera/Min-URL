import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const GeolocationModel = sequelize.define(
	'geolocations',
	{
		id_geolocations: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		ip_address: {
			type: DataTypes.STRING(50),
			unique: true,
			defaultValue: 'unknown',
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING(10),
			defaultValue: 'unknown',
			allowNull: true,
		},
		region: {
			type: DataTypes.STRING(16),
			defaultValue: 'unknown',
			allowNull: true,
		},
		timezone: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING(255),
			defaultValue: 'unknown',
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
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: 'geolocations', schema: 'Min-URL', timestamps: false },
)

export const createGeolocation = async (data) => {
	const geolocation = await GeolocationModel.create(data)
	return geolocation
}

export const getGeolocation = async (id) => {
	const geolocation = await GeolocationModel.findByPk(id)
	return geolocation
}

export const getGeolocationByIp = async (ip) => {
	const geolocation = await GeolocationModel.findOne({
		where: {
			ip_address: ip,
		},
	})
	return geolocation
}
