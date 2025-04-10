import { createQrCode } from '../models/QrCodeModel.js'

export const createQrForUrl = async ({
	urlId,
	foregroundColor = '#000000',
	backgroundColor = '#FFFFFF',
}) => {
	return await createQrCode({
		url_id: urlId,
		foreground_color: foregroundColor,
		background_color: backgroundColor,
	})
}
