/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, _Sequelize) {
		// 1. Eliminar vistas existentes por dependencias
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_top_qr_codes_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_top_links_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_devices_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_countries_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_last_7_days_clicks_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_cards_view CASCADE;',
		)

		// 2. Eliminar columnas obsoletas de urls
		await queryInterface.removeColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'password',
		)
		await queryInterface.removeColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'expired',
		)
		await queryInterface.removeColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'deleted',
		)
		await queryInterface.removeColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'expiration',
		)

		// 3. Crear nuevas vistas dinámicas basadas en timestamps (deleted_at, expired_at, expiration_date)

		// Vista principal de tarjetas (calculando links activos sin booleanos redundantes)
		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_cards_view AS
			SELECT
				u.user_id,
				COUNT(DISTINCT c.id_clicks) AS total_clicks,
				COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) THEN c.id_clicks END) AS today_clicks,
				CASE
					WHEN COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day' AND c.created_at < DATE_TRUNC('day', NOW()) THEN c.id_clicks END) = 0 THEN 0
					ELSE (COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) THEN c.id_clicks END)::FLOAT / COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day' AND c.created_at < DATE_TRUNC('day', NOW()) THEN c.id_clicks END)) * 100 - 100
				END AS today_clicks_variation,
				COUNT(DISTINCT CASE WHEN u.deleted_at IS NULL AND (u.expired_at IS NULL OR u.expired_at > NOW()) AND (u.expiration_date IS NULL OR u.expiration_date > NOW()) THEN u.id_urls END) AS active_links,
				CASE 
					WHEN COUNT(DISTINCT c.id_clicks) = 0 THEN 0
					ELSE (COUNT(DISTINCT cd.geolocations_id)::FLOAT / COUNT(DISTINCT c.id_clicks)) * 100
				END AS unique_clicks_percentage,
				CASE
					WHEN COUNT(DISTINCT cd.geolocations_id) = 0 
					OR COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day' AND c.created_at < DATE_TRUNC('day', NOW()) THEN c.id_clicks END) = 0 THEN 0
					ELSE (
						COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) AND cd.geolocations_id IS NOT NULL THEN c.id_clicks END)::FLOAT 
						/ COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day' AND c.created_at < DATE_TRUNC('day', NOW()) AND cd.geolocations_id IS NOT NULL THEN c.id_clicks END)
					) * 100 - 100
				END AS unique_clicks_variation
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
			WHERE u.deleted_at IS NULL
			GROUP BY u.user_id;
		`)

		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_last_7_days_clicks_view AS
			SELECT
				u.user_id,
				COUNT(DISTINCT c.id_clicks) AS total_clicks,
				TO_CHAR(DATE_TRUNC('day', c.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS click_day
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			WHERE u.deleted_at IS NULL 
				AND c.created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC') - INTERVAL '7 days'
				AND c.created_at < DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day'
			GROUP BY u.user_id, click_day
			ORDER BY total_clicks DESC;
		`)

		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_countries_view AS
			SELECT
				u.user_id,
				COUNT(DISTINCT c.id_clicks) AS total_clicks,
				g.country
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
			LEFT JOIN "min_url".geolocations g ON cd.geolocations_id = g.id_geolocations
			WHERE u.deleted_at IS NULL
			GROUP BY u.user_id, g.country
			ORDER BY total_clicks DESC;
		`)

		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_devices_view AS
			SELECT
				u.user_id,
				COUNT(DISTINCT c.id_clicks) AS total_clicks,
				cd.device_type
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
			WHERE u.deleted_at IS NULL
			GROUP BY u.user_id, cd.device_type
			ORDER BY total_clicks DESC;
		`)

		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_top_links_view AS
			SELECT
				u.user_id,
				u.id_urls,
				COUNT(DISTINCT c.id_clicks) AS total_clicks,
				u.title,
				u.long_url,
				s.slug,
				u.created_at
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			LEFT JOIN "min_url".slugs s ON u.id_urls = s.url_id
			WHERE u.deleted_at IS NULL AND u.purpose = 'direct'
			GROUP BY u.user_id, u.id_urls, u.title, u.long_url, s.slug, u.created_at
			ORDER BY total_clicks DESC;
		`)

		await queryInterface.sequelize.query(`
			CREATE VIEW "min_url".dashboard_top_qr_codes_view AS
			SELECT
				u.user_id,
				u.id_urls,
				COUNT(DISTINCT c.id_clicks) AS total_scans,
				u.title,
				u.long_url,
				s.slug,
				q.foreground_color,
				q.background_color,
				u.created_at
			FROM "min_url".urls u
			LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
			LEFT JOIN "min_url".slugs s ON u.id_urls = s.url_id
			LEFT JOIN "min_url".qr_codes q ON u.id_urls = q.url_id
			WHERE u.deleted_at IS NULL AND u.purpose = 'qr'
			GROUP BY u.user_id, u.id_urls, u.title, u.long_url, s.slug, q.foreground_color, q.background_color, u.created_at
			ORDER BY total_scans DESC;
		`)
	},

	async down(queryInterface, Sequelize) {
		// Reversión lógica completa por seguridad (devolver a estado anterior)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_top_qr_codes_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_top_links_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_devices_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_countries_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_last_7_days_clicks_view CASCADE;',
		)
		await queryInterface.sequelize.query(
			'DROP VIEW IF EXISTS "min_url".dashboard_cards_view CASCADE;',
		)

		// Añadir columnas de regreso
		await queryInterface.addColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'password',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		)
		await queryInterface.addColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'expired',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		)
		await queryInterface.addColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'deleted',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		)
		await queryInterface.addColumn(
			{ tableName: 'urls', schema: 'min_url' },
			'expiration',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		)

		// Recrear vistas usando las columnas restauradas (código original en init.sql)
		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_cards_view AS
        SELECT
          u.user_id,
          COUNT(DISTINCT c.id_clicks) AS total_clicks,
          COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) THEN c.id_clicks END) AS today_clicks,
          CASE
            WHEN COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
              AND c.created_at < DATE_TRUNC('day', NOW())
              THEN c.id_clicks END) = 0 THEN 0
            ELSE (COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW())
              THEN c.id_clicks END)::FLOAT / COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
              AND c.created_at < DATE_TRUNC('day', NOW())
              THEN c.id_clicks END)) * 100 - 100
          END AS today_clicks_variation,
          COUNT(DISTINCT CASE WHEN u.expired = false AND u.deleted = false THEN u.id_urls END) AS active_links,
          CASE 
            WHEN COUNT(DISTINCT c.id_clicks) = 0 THEN 0
            ELSE (COUNT(DISTINCT cd.geolocations_id)::FLOAT / COUNT(DISTINCT c.id_clicks)) * 100
          END AS unique_clicks_percentage,
          CASE
            WHEN COUNT(DISTINCT cd.geolocations_id) = 0 
            OR COUNT(DISTINCT CASE 
              WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
              AND c.created_at < DATE_TRUNC('day', NOW())
              THEN c.id_clicks 
            END) = 0 THEN 0
            ELSE (
              COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW())
              AND cd.geolocations_id IS NOT NULL
              THEN c.id_clicks END)::FLOAT 
              / COUNT(DISTINCT CASE 
                  WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
                  AND c.created_at < DATE_TRUNC('day', NOW()) 
                  AND cd.geolocations_id IS NOT NULL
                  THEN c.id_clicks END)) * 100 - 100
          END AS unique_clicks_variation
        FROM "min_url".urls u
        LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
        LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
        WHERE u.deleted = false
        GROUP BY u.user_id;
      `)

		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_last_7_days_clicks_view AS
        SELECT
          u.user_id,
          COUNT(DISTINCT c.id_clicks) AS total_clicks,
          TO_CHAR(DATE_TRUNC('day', c.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS click_day
        FROM "min_url".urls u
        LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
        WHERE u.deleted = false 
          AND c.created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC') - INTERVAL '7 days'
          AND c.created_at < DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day'
        GROUP BY u.user_id, click_day
        ORDER BY total_clicks DESC;
    `)

		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_countries_view AS
        SELECT
          u.user_id,
          COUNT(DISTINCT c.id_clicks) AS total_clicks,
          g.country
        FROM "min_url".urls u
        LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
        LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
        LEFT JOIN "min_url".geolocations g ON cd.geolocations_id = g.id_geolocations
        WHERE u.deleted = false
        GROUP BY u.user_id, g.country
        ORDER BY total_clicks DESC;
    `)

		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_devices_view AS
        SELECT
          u.user_id,
          COUNT(DISTINCT c.id_clicks) AS total_clicks,
          cd.device_type
          FROM "min_url".urls u
          LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
          LEFT JOIN "min_url".clicks_details cd ON c.id_clicks = cd.click_id
          WHERE u.deleted = false
          GROUP BY u.user_id, cd.device_type
          ORDER BY total_clicks DESC;
    `)

		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_top_links_view AS
      SELECT
        u.user_id,
        u.id_urls,
        COUNT(DISTINCT c.id_clicks) AS total_clicks,
        u.title,
        u.long_url,
        s.slug,
        u.created_at
      FROM "min_url".urls u
      LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
      LEFT JOIN "min_url".slugs s ON u.id_urls = s.url_id
      WHERE u.deleted = false AND u.purpose = 'direct'
      GROUP BY u.user_id, u.id_urls, u.title, u.long_url, s.slug, u.created_at
      ORDER BY total_clicks DESC;
    `)

		await queryInterface.sequelize.query(`
      CREATE VIEW "min_url".dashboard_top_qr_codes_view AS
      SELECT
        u.user_id,
        u.id_urls,
        COUNT(DISTINCT c.id_clicks) AS total_scans,
        u.title,
        u.long_url,
        s.slug,
        q.foreground_color,
        q.background_color,
        u.created_at
      FROM "min_url".urls u
      LEFT JOIN "min_url".clicks c ON u.id_urls = c.url_id
      LEFT JOIN "min_url".slugs s ON u.id_urls = s.url_id
      LEFT JOIN "min_url".qr_codes q ON u.id_urls = q.url_id
      WHERE u.deleted = false AND u.purpose = 'qr'
      GROUP BY u.user_id, u.id_urls, u.title, u.long_url, s.slug, q.foreground_color, q.background_color, u.created_at
      ORDER BY total_scans DESC;
    `)
	},
}
