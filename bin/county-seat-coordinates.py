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

url = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2021_Gazetteer/2021_gaz_place_01.txt"
raw = requests.get(url)

coordinates = []

for line in raw.iter_lines():
    fields = line.decode().strip().split("	")
    name = fields[3].strip()
    for suf in [" city", " town", " CDP"]:
        name = name.removesuffix(suf)
    coordinates.append({
        "name": name,
        "geoid": str(fields[1]),
        "lat": str(fields[10]),
        "long": str(fields[11]),
    })


def getCoordinates(city):
    """Get the city coordinates."""
    for place in coordinates:
        if place["name"] == city:
            return [place['long'], place['lat']]


def getID(city):
    """Get the city GEOID."""
    for place in coordinates:
        if place["name"] == city:
            return place['geoid']


# Load the county dataset.
data = []
with open(sys.argv[1], "r") as f:
    data = json.load(f)

# Merge the seat and establishment dates into the data.
merged = []
for obj in data:
    obj["seat"]["location"]["coordinates"] = getCoordinates(obj["seat"]["name"])
    obj["seat"]["geoid"] = getID(obj["seat"]["name"])
    merged.append(obj)

print(json.dumps(merged, indent=2))
