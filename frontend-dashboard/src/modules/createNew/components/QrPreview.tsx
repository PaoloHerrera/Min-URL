// biome-ignore lint/style/useNamingConvention: React-qr-code is not following the naming convention
import QRCode from 'react-qr-code'

export const QrPreview = ({
	id = 'qr-code',
	foregroundColor,
	backgroundColor,
	value = 'custom value',
	size = 130,
}: {
	id?: string
	foregroundColor: string
	backgroundColor: string
	value?: string
	size?: number
}) => {
	return (
		<div className="flex flex-col items-center justify-center shadow-md bg-white rounded-xl p-4">
			<QRCode
				id={id}
				value={value}
				size={size}
				bgColor={backgroundColor}
				fgColor={foregroundColor}
			/>
		</div>
	)
}
