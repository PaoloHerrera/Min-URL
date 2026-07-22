import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

const swaggerYamlFile = fs.readFileSync(
	path.join(__dirname, './adapters/primary/http/swagger.yaml'),
	'utf8',
)

export const swaggerDocument = YAML.parse(swaggerYamlFile)
