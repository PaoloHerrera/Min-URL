import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
} from 'sequelize-typescript'

@Table({ tableName: 'refresh_tokens', schema: 'Min-URL', underscored: true })
export class RefreshToken extends Model<RefreshToken> {
	@PrimaryKey
	@Column({ type: DataType.STRING, allowNull: false })
	declare userId: string

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: true,
	})
	declare refreshToken?: string

	@Column({ type: DataType.DATE, allowNull: false })
	declare expiresAt: Date

	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	declare expired: boolean

	@Column({ type: DataType.DATE, allowNull: false })
	declare createdAt: Date

	@Column({ type: DataType.DATE, allowNull: false })
	declare updatedAt: Date

	@Column({ type: DataType.DATE, allowNull: true })
	declare expiredAt?: Date
}
