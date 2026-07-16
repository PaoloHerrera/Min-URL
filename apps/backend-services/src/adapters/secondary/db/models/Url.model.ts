import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../../../../config/database.js'
import type { GeolocationModel } from './Geolocation.model.js'
import type { UserModel } from './User.model.js'

export class UrlModel extends Model<
	InferAttributes<UrlModel>,
	InferCreationAttributes<UrlModel>
> {
	declare public id_urls: CreationOptional<string>
	declare public user_id: CreationOptional<ForeignKey<UserModel['id_users']>>
	declare public geolocations_id: CreationOptional<
		ForeignKey<GeolocationModel['id_geolocations']>
	>
	declare public title: string
	declare public long_url: string
	declare public purpose: 'direct' | 'qr' | 'api'
	declare public password_hash: CreationOptional<string | null>
	declare public expiration_date: CreationOptional<Date | null>
	declare public expired_at: CreationOptional<Date | null>
	declare public created_at: CreationOptional<Date>
	declare public updated_at: CreationOptional<Date>
	declare public deleted_at: CreationOptional<Date | null>
}

UrlModel.init(
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
			defaultValue: 'Untitled',
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
		password_hash: {
			type: DataTypes.STRING(128),
			allowNull: true,
		},
		expiration_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		expired_at: {
			type: DataTypes.DATE,
			allowNull: true,
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
	{
		tableName: 'urls',
		schema: 'min_url',
		sequelize,
		timestamps: false,
	},
)
