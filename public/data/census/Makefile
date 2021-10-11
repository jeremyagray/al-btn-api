# ******************************************************************************
#
# al-btn-api, the Alabama:  By the Numbers API.
#
# SPDX-License-Identifier: MIT
#
# Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
#
# ******************************************************************************

20m_archive_url = https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_all_20m.zip
5m_archive_url = https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_all_5m.zip

ogr2ogr = /usr/bin/ogr2ogr

.phony: 5m 20m all

all: 5m 20m
5m: nation-5m-geo.json state-5m-geo.json county-5m-geo.json
20m: nation-20m-geo.json state-20m-geo.json county-20m-geo.json

shapefiles/cb_2020_us_all_5m.zip:
	mkdir -p $(@D)
	wget $(5m_archive_url) -O $(@)

shapefiles/cb_2020_us_%_5m.zip: shapefiles/cb_2020_us_all_5m.zip
	cd $(<D) && unzip -o $(<F)
	chmod -R go-rwx $(<D)

shapefiles/cb_2020_us_%_5m.shp: shapefiles/cb_2020_us_%_5m.zip
	cd $(<D) && unzip -o $(<F)
	chmod -R go-rwx $(<D)

%-5m-geo.json: shapefiles/cb_2020_us_%_5m.shp
	$(ogr2ogr) -f geojson $(@) $(<)

shapefiles/cb_2020_us_all_20m.zip:
	mkdir -p $(@D)
	wget $(20m_archive_url) -O $(@)

shapefiles/cb_2020_us_%_20m.zip: shapefiles/cb_2020_us_all_20m.zip
	cd $(<D) && unzip -o $(<F)
	chmod -R go-rwx $(<D)

shapefiles/cb_2020_us_%_20m.shp: shapefiles/cb_2020_us_%_20m.zip
	cd $(<D) && unzip -o $(<F)
	chmod -R go-rwx $(<D)

%-20m-geo.json: shapefiles/cb_2020_us_%_20m.shp
	$(ogr2ogr) -f geojson $(@) $(<)
