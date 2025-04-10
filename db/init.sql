-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.1.6
-- PostgreSQL version: 16.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: "Min-URL" | type: DATABASE --
-- DROP DATABASE IF EXISTS "Min-URL";

-- object: "Min-URL" | type: SCHEMA --
-- DROP SCHEMA IF EXISTS "Min-URL" CASCADE;
CREATE SCHEMA "Min-URL";
-- ddl-end --

-- object: "Min-URL".users | type: TABLE --
-- DROP TABLE IF EXISTS "Min-URL".users CASCADE;
CREATE TABLE "Min-URL".users (
	id_users UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	google_id varchar(255) UNIQUE,
	github_id varchar(255) UNIQUE,
	email varchar(255) NOT NULL UNIQUE,
	display_name varchar(255),
	given_name varchar(255),
	family_name varchar(255),
	avatar text,
	short_url_usage numeric NOT NULL DEFAULT 0,
	short_url_available numeric NOT NULL DEFAULT 50,
	qr_code_usage numeric NOT NULL DEFAULT 0,
	qr_code_available numeric NOT NULL DEFAULT 25,
	deleted boolean NOT NULL DEFAULT false,
	created_at timestamp with time zone NOT NULL DEFAULT NOW(),
	updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
	deleted_at timestamp with time zone
);

-- object: "Min-URL".users | type: TABLE --
-- DROP TABLE IF EXISTS "Min-URL".refresh_tokens CASCADE;
CREATE TABLE "Min-URL".refresh_tokens (
	id_refresh_tokens UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID,
 	refresh_token varchar(255) NOT NULL,
  expires_at timestamp with time zone NOT NULL,
	expired boolean NOT NULL DEFAULT false,
	created_at timestamp with time zone NOT NULL DEFAULT NOW(),
	updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
	expired_at timestamp with time zone,
	CONSTRAINT user_id_fk FOREIGN KEY (user_id)
		REFERENCES "Min-URL".users (id_users) ON DELETE CASCADE
);


CREATE TABLE "Min-URL".geolocations (
	id_geolocations UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	ip_address varchar(50) NOT NULL UNIQUE DEFAULT 'unknown',
	country varchar(10) DEFAULT 'unknown',
	region varchar(16) DEFAULT 'unknown',
	timezone varchar(255),
	city varchar(255) DEFAULT 'unknown',
	latitude varchar(255),
	longitude varchar(255),
	created_at timestamp with time zone NOT NULL DEFAULT NOW()
);


-- object: "Min-URL"."Purpose_enum" | type: TYPE --
-- DROP TYPE IF EXISTS "Min-URL"."Purpose_enum" CASCADE;
CREATE TYPE "Min-URL"."Purpose_enum" AS
ENUM ('direct','qr','api');

-- object: "Min-URL".urls | type: TABLE --
-- DROP TABLE IF EXISTS "Min-URL".urls CASCADE;
CREATE TABLE "Min-URL".urls (
	id_urls UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID,
	geolocations_id UUID,
	title varchar(100) NOT NULL,
	long_url text NOT NULL,
	purpose "Min-URL"."Purpose_enum" NOT NULL DEFAULT 'direct',
	password boolean NOT NULL DEFAULT false,
	password_hash varchar(128),
	expiration boolean NOT NULL DEFAULT false,
	expiration_date timestamp with time zone,
	expired boolean NOT NULL DEFAULT false,
	expired_at timestamp with time zone,
	deleted boolean NOT NULL DEFAULT false,
	created_at timestamp with time zone NOT NULL DEFAULT NOW(),
	updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
	deleted_at timestamp with time zone,
	CONSTRAINT user_id_fk FOREIGN KEY (user_id)
    REFERENCES "Min-URL".users (id_users) ON DELETE CASCADE,
	CONSTRAINT geolocations_id_fk FOREIGN KEY (geolocations_id)
    REFERENCES "Min-URL".geolocations (id_geolocations) ON DELETE CASCADE
);

CREATE TABLE "Min-URL".short_urls (
	id_short_urls UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	url_id UUID NOT NULL UNIQUE,
	slug varchar(16) NOT NULL UNIQUE,
	created_at timestamp with time zone NOT NULL DEFAULT NOW(),
	CONSTRAINT url_id_fk FOREIGN KEY (url_id) 
    REFERENCES "Min-URL".urls (id_urls) ON DELETE CASCADE
);

CREATE TABLE "Min-URL".qr_codes (
  id_qr_codes UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID NOT NULL UNIQUE,
	foreground_color varchar(7) NOT NULL,
	background_color varchar(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT url_id_fk FOREIGN KEY (url_id) 
    REFERENCES "Min-URL".urls (id_urls) ON DELETE CASCADE
);

CREATE TABLE "Min-URL".clicks (
  id_clicks UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT url_id_fk FOREIGN KEY (url_id) 
    REFERENCES "Min-URL".urls (id_urls) ON DELETE CASCADE
);

CREATE TABLE "Min-URL".clicks_details (
  id_clicks_details UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id UUID NOT NULL UNIQUE,
	geolocations_id UUID,
  user_agent TEXT,
	device_type varchar(255),
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT click_id_fk FOREIGN KEY (click_id) 
    REFERENCES "Min-URL".clicks (id_clicks) ON DELETE CASCADE,
	CONSTRAINT geolocations_id_fk FOREIGN KEY (geolocations_id)
    REFERENCES "Min-URL".geolocations (id_geolocations) ON DELETE CASCADE
);

CREATE INDEX short_url_slug_index ON "Min-URL".short_urls (slug);
CREATE INDEX url_title_index ON "Min-URL".urls (title);
CREATE INDEX url_long_url_index ON "Min-URL".urls (long_url);
CREATE INDEX url_user_id_index ON "Min-URL".urls (user_id);
CREATE INDEX url_geolocations_id_index ON "Min-URL".urls (geolocations_id);
CREATE INDEX qr_code_long_url_index ON "Min-URL".qr_codes (url_id);
CREATE INDEX click_long_url_index ON "Min-URL".clicks (url_id);
CREATE INDEX click_detail_click_index ON "Min-URL".clicks_details (click_id);
CREATE INDEX click_detail_geolocations_index ON "Min-URL".clicks_details (geolocations_id);


CREATE VIEW "Min-URL".dashboard_cards_view AS
SELECT
  u.user_id,

	-- Total clicks
  COUNT(DISTINCT c.id_clicks) AS total_clicks,
  
	-- Clicks de hoy
	COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) THEN c.id_clicks END) AS today_clicks,
	
	-- Porcentaje de variación de clicks de hoy con respecto a ayer
	CASE
		WHEN COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
			AND c.created_at < DATE_TRUNC('day', NOW())
			THEN c.id_clicks END) = 0 THEN 0
		ELSE (COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW())
			THEN c.id_clicks END)::FLOAT / COUNT(DISTINCT CASE WHEN c.created_at >= DATE_TRUNC('day', NOW()) - INTERVAL '1 day'
			AND c.created_at < DATE_TRUNC('day', NOW())
			THEN c.id_clicks END)) * 100 - 100
	END AS today_clicks_variation,

	-- Cantidad de links activos
  COUNT(DISTINCT CASE WHEN u.expired = false AND u.deleted = false THEN u.id_urls END) AS active_links,
  
	-- Porcentaje de clicks únicos
	CASE 
    WHEN COUNT(DISTINCT c.id_clicks) = 0 THEN 0
    ELSE (COUNT(DISTINCT cd.geolocations_id)::FLOAT / COUNT(DISTINCT c.id_clicks)) * 100
  END AS unique_clicks_percentage,

	-- Porcentaje de variación de clicks únicos de hoy con respecto a ayer
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

FROM "Min-URL".urls u
LEFT JOIN "Min-URL".clicks c ON u.id_urls = c.url_id
LEFT JOIN "Min-URL".clicks_details cd ON c.id_clicks = cd.click_id
WHERE u.deleted = false
GROUP BY u.user_id;

-- Vista para mostrar los países de uso
CREATE VIEW "Min-URL".dashboard_countries_view AS
SELECT
  u.user_id,
	COUNT(DISTINCT c.id_clicks) AS total_clicks,
	g.country
	FROM "Min-URL".urls u
	LEFT JOIN "Min-URL".clicks c ON u.id_urls = c.url_id
	LEFT JOIN "Min-URL".clicks_details cd ON c.id_clicks = cd.click_id
	LEFT JOIN "Min-URL".geolocations g ON cd.geolocations_id = g.id_geolocations
	WHERE u.deleted = false
	GROUP BY u.user_id, g.country
	ORDER BY total_clicks DESC;

-- Vista para mostrar los dispositivos más utilizados
CREATE VIEW "Min-URL".dashboard_devices_view AS
SELECT
  u.user_id,
	COUNT(DISTINCT c.id_clicks) AS total_clicks,
	cd.device_type
	FROM "Min-URL".urls u
	LEFT JOIN "Min-URL".clicks c ON u.id_urls = c.url_id
	LEFT JOIN "Min-URL".clicks_details cd ON c.id_clicks = cd.click_id
	WHERE u.deleted = false
	GROUP BY u.user_id, cd.device_type
	ORDER BY total_clicks DESC;

-- Vista para mostrar los Links más clickeados
CREATE VIEW "Min-URL".dashboard_top_links_view AS
SELECT
  u.user_id,
	COUNT(DISTINCT c.id_clicks) AS total_clicks,
  u.title,
  u.long_url,
	s.slug,
  u.created_at
FROM "Min-URL".urls u
LEFT JOIN "Min-URL".clicks c ON u.id_urls = c.url_id
LEFT JOIN "Min-URL".short_urls s ON u.id_urls = s.url_id
WHERE u.deleted = false AND u.purpose = 'direct'
GROUP BY u.user_id, u.title, u.long_url, s.slug, u.created_at
ORDER BY total_clicks DESC;

-- Vista para mostrar los QR Codes más se han escaneado
CREATE VIEW "Min-URL".dashboard_top_qr_codes_view AS
SELECT
  u.user_id,
	COUNT(DISTINCT c.id_clicks) AS total_scans,
  u.title,
  u.long_url,
	s.slug,
	q.foreground_color,
	q.background_color,
  u.created_at
FROM "Min-URL".urls u
LEFT JOIN "Min-URL".clicks c ON u.id_urls = c.url_id
LEFT JOIN "Min-URL".short_urls s ON u.id_urls = s.url_id
LEFT JOIN "Min-URL".qr_codes q ON u.id_urls = q.url_id
WHERE u.deleted = false AND u.purpose = 'qr'
GROUP BY u.user_id, u.title, u.long_url, s.slug, q.foreground_color, q.background_color, u.created_at
ORDER BY total_scans DESC;