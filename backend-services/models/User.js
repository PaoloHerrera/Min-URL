import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const User = sequelize.define(
	'users',
	{
		id_users: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		google_id: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: true,
		},
		github_id: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		name: {
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
			allowNull: true,
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'users',
		schema: 'Min-URL',
		timestamps: false,
	},
)
