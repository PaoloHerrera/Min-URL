import { sequelize } from '../../../../../config/database.js'
import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'

export class GeolocationModel extends Model<
	InferAttributes<GeolocationModel>,
	InferCreationAttributes<GeolocationModel>
> {
	public declare id_geolocations: CreationOptional<string>
	public declare ip_address: string
	public declare country: CreationOptional<string | null>
	public declare region: CreationOptional<string | null>
	public declare timezone: CreationOptional<string | null>
	public declare city: CreationOptional<string | null>
	public declare latitude: CreationOptional<number | null>
	public declare longitude: CreationOptional<number | null>
	public declare created_at: CreationOptional<Date>
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
	},
	{
		tableName: 'geolocations',
		schema: 'Min-URL',
		sequelize,
		timestamps: false,
	},
)
