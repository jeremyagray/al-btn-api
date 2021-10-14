#!/usr/bin/env python
#
# ******************************************************************************
#
# al-btn-api, Alabama data API
#
# Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
#
# All rights reserved.
#
# ******************************************************************************

import json
import requests
from bs4 import BeautifulSoup as bs
from pymongo import MongoClient


def update_state_centroids(data):
    """Load the state centroids."""
    c = MongoClient("mongodb://localhost:27017/")
    db = c["albtn"]
    coll = db["stateboundaries"]
    pass


def get_state_centroids():
    """Get and process the state and territory centroids."""
    url = "https://en.wikipedia.org/wiki/List_of_geographic_centers_of_the_United_States"
    raw = requests.get(url)
    soup = bs(raw.content, "html.parser")
    centroids = {
        "type": "FeatureCollection",
        "name": "US States and Territories Centroids",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::4269"
            }
        },
        "features": [
        ]
    }

    tables = soup.find_all("table", class_="wikitable sortable")
    for table in tables:
        # states table caption:  Updated geographic centers of the
        # states of the United States and the District of Columbia
        if "Updated geographic centers of the states" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    centroids["features"].append({
                        "type": "Feature",
                        "properties": {
                            "state": cells[0].text.strip(),
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                float(cells[2].find("span", class_="geo").text.strip().split(";")[1].strip()),
                                float(cells[2].find("span", class_="geo").text.strip().split(";")[0].strip()),
                            ]
                        }
                    })

        # territories table caption: Geographic centers of the
        # U.S. territories
        if "Geographic centers of the U.S. territories" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    if cells[3].find("span", class_="geo"):
                        coord = cells[3].find("span", class_="geo").text.strip()

                        centroids["features"].append({
                            "type": "Feature",
                            "properties": {
                                "state": cells[0].text.strip(),
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    float(coord.split(";")[1].strip()),
                                    float(coord.split(";")[0].strip()),
                                ]
                            }
                        })

    return centroids


if __name__ == "__main__":
    # update_state_centroids(get_state_centroids())
    print(json.dumps(get_state_centroids(), indent=2))
