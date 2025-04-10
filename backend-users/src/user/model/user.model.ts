import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
} from 'sequelize-typescript'

@Table({ tableName: 'users', schema: 'Min-URL', underscored: true })
export class User extends Model<User> {
	@PrimaryKey
	@Column({ type: DataType.INTEGER, autoIncrement: true })
	declare idUsers: number

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: true,
	})
	declare googleId?: string

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: true,
	})
	declare githubId?: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare displayName?: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare givenName?: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare familyName?: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare email: string

	@Column({ type: DataType.STRING, allowNull: true })
	declare avatar?: string

	@Column({ type: DataType.INTEGER, defaultValue: 0 })
	declare shortUrlUsage: number

	@Column({ type: DataType.INTEGER, defaultValue: 50 })
	declare shortUrlAvailable: number

	@Column({ type: DataType.INTEGER, defaultValue: 0 })
	declare qrCodeUsage: number

	@Column({ type: DataType.INTEGER, defaultValue: 25 })
	declare qrCodeAvailable: number

	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	declare deleted: boolean

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
	})
	declare createdAt: Date

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
	})
	declare updatedAt: Date

	@Column({ type: DataType.DATE, allowNull: true })
	declare deletedAt?: Date
}
