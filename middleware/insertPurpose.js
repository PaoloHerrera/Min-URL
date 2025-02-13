export const insertDirectPurpose = (req, res, next) => {
	req.purpose = 'direct'
	next()
}

export const insertQrPurpose = (req, res, next) => {
	req.purpose = 'qr'
	next()
}

export const insertApiPurpose = (req, res, next) => {
	req.purpose = 'api'
	next()
}
