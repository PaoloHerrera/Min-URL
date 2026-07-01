interface Geolocation {
	id_geolocations: string
}

export interface GeolocationsServices {
	getOrCreate(ip: string): Promise<Geolocation>
}
