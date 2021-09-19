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
import sys
import requests
# from bs4 import BeautifulSoup as bs

url = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2021_Gazetteer/2021_gaz_place_01.txt"
raw = requests.get(url)

coordinates = []

for line in raw.iter_lines():
    fields = line.decode().strip().split("	")
    seat = fields[3].strip()
    for suf in [" city", " town", " CDP"]:
        seat = seat.removesuffix(suf)
    coordinates.append({
    # print({
        "seat": seat,
        "lat": str(fields[10]),
        "long": str(fields[11]),
    })


def getCoordinates(seat):
    """Get the county seat coordinates."""
    for county in coordinates:
        if county["seat"] == seat:
            return [county['long'], county['lat']]


# Load the county dataset.
data = []
with open(sys.argv[1], "r") as f:
    data = json.load(f)

# Merge the seat and establishment dates into the data.
merged = []
for obj in data:
    obj["seatLocation"]["coordinates"] = getCoordinates(obj["seat"])
    merged.append(obj)

print(json.dumps(merged, indent=2))
