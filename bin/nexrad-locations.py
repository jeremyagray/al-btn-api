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


def process_latitude(cell):
    """Return the latitude from a cell."""
    lat = cell.strip().split("/")[0].strip()
    return float(
        int(
            str(lat[0]) + str(lat[1]),
        )
        + int(
            str(lat[2]) + str(lat[3]),
        ) / 60
        + int(
            str(lat[4]) + str(lat[5]),
        ) / 3600
    )


def process_longitude(cell):
    """Return the longitude from a cell."""
    long = cell.strip().split("/")[1]
    long = long.strip()

    if len(long) == 8:
        sign = 1
        long = long[:7]
    else:
        sign = -1

    if long[0] == "0":
        deg = int(
            str(long[1]) + str(long[2]),
        )
    else:
        deg = int(
            str(long[0]) + str(long[1]) + str(long[2]),
        )

    return sign * float(
        deg
        + int(
            str(long[3]) + str(long[4]),
        ) / 60
        + int(
            str(long[5]) + str(long[6]),
        ) / 3600
    )


def update_locations(data):
    """Load the NEXRAD locations."""
    c = MongoClient("mongodb://localhost:27017/")
    db = c["albtn"]
    coll = db["nexrad"]
    coll.delete_many({})
    coll.insert_many(data)


def get_locations():
    """Get and process the NEXRAD locations."""
    url = "https://apollo.nvu.vsc.edu/classes/remote/lecture_notes/radar/88d/88D_locations.html"
    raw = requests.get(url)
    soup = bs(raw.content, "html.parser")
    radars = []

    table = soup.find("table")
    rows = table.find_all("tr")
    for row in rows[1:]:
        cells = row.find_all("td")
        if len(cells[2].text.strip().split(',')[1].strip()) == 2:
            radars.append(
                {
                    "type": "Feature",
                    "properties": {
                        "wban": cells[0].text.strip(),
                        "station": cells[1].text.strip().upper(),
                        "location": cells[2].text.strip().split(',')[0].strip(),
                        "usps": cells[2].text.strip().split(',')[1].strip().upper(),
                        "elevation": cells[4].text.strip(),
                        "towerHeight": cells[5].text.strip(),
                        "radarType": "wsr88d",
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            process_longitude(cells[3].text),
                            process_latitude(cells[3].text),
                        ],
                    },
                }
            )

    return radars


if __name__ == "__main__":
    # update_locations(get_locations())
    print(json.dumps(get_locations(), indent=2))
