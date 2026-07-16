//TODO: REVISAR ATRIBUTOS A FUTURO

import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../../../../config/database.js'

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	declare public id_users: CreationOptional<string>
	declare public google_id: CreationOptional<string | null>
	declare public github_id: CreationOptional<string | null>
	declare public email: CreationOptional<string>
	declare public password_hash: CreationOptional<string | null>
	declare public display_name: CreationOptional<string | null>
	declare public given_name: CreationOptional<string | null>
	declare public family_name: CreationOptional<string | null>
	declare public avatar: CreationOptional<string | null>
	declare public credits: CreationOptional<number>
	declare public deleted: CreationOptional<boolean>
	declare public deleted_at: CreationOptional<Date | null>
	declare public created_at: CreationOptional<Date>
	declare public updated_at: CreationOptional<Date>
}

UserModel.init(
	{
		id_users: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		google_id: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		github_id: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		display_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		given_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		family_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		credits: {
			type: DataTypes.NUMBER,
			allowNull: false,
			defaultValue: 100,
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: 'users',
		schema: 'min_url',
		sequelize,
		timestamps: false,
	},
)
