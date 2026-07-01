import { sequelize } from '../../../../../config/database.js'
import { DataTypes, Model } from 'sequelize'
import type {
	CreationOptional,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize'
import type { UrlModel } from './Url.model.js'

export class SlugModel extends Model<
	InferAttributes<SlugModel>,
	InferCreationAttributes<SlugModel>
> {
	public declare id_slugs: CreationOptional<string>
	public declare url_id: ForeignKey<UrlModel['id_urls']>
	public declare slug: string
	public declare created_at: CreationOptional<Date>
	public declare deleted: CreationOptional<boolean>
	public declare deleted_at: CreationOptional<Date | null>
}

SlugModel.init(
	{
		id_slugs: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		url_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'slugs',
		schema: 'Min-URL',
		sequelize,
		timestamps: false,
	},
)
