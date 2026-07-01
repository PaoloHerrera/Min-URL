//TODO: REVISAR ATRIBUTOS A FUTURO

import { sequelize } from '../../../../../config/database.js'
import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	public declare id_users: CreationOptional<string>
	public declare google_id: CreationOptional<string | null>
	public declare github_id: CreationOptional<string | null>
	public declare email: CreationOptional<string>
	public declare password_hash: CreationOptional<string | null>
	public declare display_name: CreationOptional<string | null>
	public declare given_name: CreationOptional<string | null>
	public declare family_name: CreationOptional<string | null>
	public declare avatar: CreationOptional<string | null>
	public declare credits: CreationOptional<number>
	public declare deleted: CreationOptional<boolean>
	public declare deleted_at: CreationOptional<Date | null>
	public declare created_at: CreationOptional<Date>
	public declare updated_at: CreationOptional<Date>
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
		schema: 'Min-URL',
		sequelize,
		timestamps: false,
	},
)
