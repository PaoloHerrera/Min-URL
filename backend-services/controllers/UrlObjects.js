export const createUrlObject = (req, slug) => ({
	long_url: req.body.originalUrl,
	slug,
	purpose: req.purpose,
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

export const createLogUrlObject = (req, url) => ({
	url_id: url.dataValues.id_urls,
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

export const extractGeoData = (geo) => ({
	country: geo.country,
	region: geo.region,
	timezone: geo.timezone,
	city: geo.city,
	latitude: geo.ll[0],
	longitude: geo.ll[1],
})
