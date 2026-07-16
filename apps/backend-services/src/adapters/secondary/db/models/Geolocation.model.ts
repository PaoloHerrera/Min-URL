import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../../../../config/database.js'

export class GeolocationModel extends Model<
	InferAttributes<GeolocationModel>,
	InferCreationAttributes<GeolocationModel>
> {
	declare public id_geolocations: CreationOptional<string>
	declare public ip_address: string
	declare public country: CreationOptional<string | null>
	declare public region: CreationOptional<string | null>
	declare public timezone: CreationOptional<string | null>
	declare public city: CreationOptional<string | null>
	declare public latitude: CreationOptional<number | null>
	declare public longitude: CreationOptional<number | null>
	declare public created_at: CreationOptional<Date>
	declare public updated_at: CreationOptional<Date>
}

GeolocationModel.init(
	{
		id_geolocations: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		region: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		timezone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		latitude: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		longitude: {
			type: DataTypes.DECIMAL,
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
	},
	{
		tableName: 'geolocations',
		schema: 'min_url',
		sequelize,
		timestamps: false,
	},
)
