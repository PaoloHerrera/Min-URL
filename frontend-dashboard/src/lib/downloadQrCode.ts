export const downloadQrCode = (title: string, id: string) => {
	// Check if the SVG element exists
	const svg = document.getElementById(id) as SVGSVGElement | null
	if (!svg) {
		console.error('SVG element not found.')
		return
	}

	// Create a copy of the SVG element
	const copySvg = svg.cloneNode(true) as SVGSVGElement
	copySvg.setAttribute('id', 'copySvg')
	document.body.appendChild(copySvg)

	//set height and width 250px
	copySvg.setAttribute('height', '250px')
	copySvg.setAttribute('width', '250px')

	// Get the SVG data as a string
	const svgString = new XMLSerializer().serializeToString(copySvg)

	// Create a canvas element
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
	if (!context) {
		console.error('Failed to get canvas context.')
		return
	}

	// Set canvas dimensions based on the SVG dimensions
	const bbox = copySvg.getBoundingClientRect()
	canvas.width = bbox.width
	canvas.height = bbox.height

	// Create an Image object
	const img = new Image()
	const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
	const url = URL.createObjectURL(svgBlob)

	img.onload = () => {
		// Draw the SVG onto the canvas
		context.drawImage(img, 0, 0)
		URL.revokeObjectURL(url)

		// Convert canvas to PNG data URL
		const pngData = canvas.toDataURL('image/png')

		// Create a link element and trigger the download
		const link = document.createElement('a')
		link.href = pngData
		link.download = title
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// Set the source of the image to the SVG blob URL
	img.src = url
	document.body.removeChild(copySvg)
}
