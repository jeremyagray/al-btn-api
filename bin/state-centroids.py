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
    centroids = []

    tables = soup.find_all("table", class_="wikitable sortable")
    for table in tables:
        # states table caption:  Updated geographic centers of the
        # states of the United States and the District of Columbia
        if "Updated geographic centers of the states" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    centroids.append({
                        "state": cells[0].text.strip(),
                        "latitude": float(cells[2].find("span", class_="geo").text.strip().split(";")[0].strip()),
                        "longitude": float(cells[2].find("span", class_="geo").text.strip().split(";")[1].strip()),
                    })

        # territories table caption:  Geographic centers of the U.S. territories
        if "Geographic centers of the U.S. territories" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    if cells[3].find("span", class_="geo"):
                        coord = cells[3].find("span", class_="geo").text.strip()

                        centroids.append({
                            "state": cells[0].text.strip(),
                            "latitude": float(coord.split(";")[0].strip()),
                            "longitude": float(coord.split(";")[1].strip()),
                        })

    return centroids


if __name__ == "__main__":
    print(json.dumps(get_state_centroids(), indent=2))
