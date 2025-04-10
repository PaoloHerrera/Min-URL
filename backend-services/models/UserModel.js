import { DataTypes, Op } from 'sequelize'
import { sequelize } from '../config/database.js'

export const UserModel = sequelize.define(
	'users',
	{
		id_users: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		google_id: {
			type: DataTypes.STRING(255),
			unique: true,
		},
		github_id: {
			type: DataTypes.STRING(255),
			unique: true,
		},
		email: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false,
		},
		display_name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		given_name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		family_name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		avatar: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		short_url_usage: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		short_url_available: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 50,
		},
		qr_code_usage: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		qr_code_available: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 25,
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
	{ tableName: 'users', schema: 'Min-URL', timestamps: false },
)

export const createUser = async (data) => {
	const user = await UserModel.create(data)
	return user
}

export const getUser = async (id) => {
	const user = await UserModel.findByPk(id)
	return user
}

export const getUserIfShortUrlAvailable = async (id) => {
	const user = await UserModel.findOne({
		where: {
			id_users: id,
			short_url_available: {
				[Op.gt]: 0,
			},
		},
	})
	return user
}

export const getUserIfQrCodeAvailable = async (id) => {
	const user = await UserModel.findOne({
		where: {
			id_users: id,
			qr_code_available: {
				[Op.gt]: 0,
			},
		},
	})
	return user
}

export const addShortUrlUsage = async (id) => {
	const user = await UserModel.findByPk(id)
	user.increment({ short_url_usage: 1 })
	user.decrement({ short_url_available: 1 })
	await user.save()
	return user
}

export const addQrCodeUsage = async (id) => {
	const user = await UserModel.findByPk(id)
	user.increment({ qr_code_usage: 1 })
	user.decrement({ qr_code_available: 1 })
	await user.save()
	return user
}
