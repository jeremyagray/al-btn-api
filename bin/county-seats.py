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
from bs4 import BeautifulSoup as bs

url = "https://archives.alabama.gov/counties/"
raw = requests.get(url)
soup = bs(raw.content, "html.parser")
seats = []

content = soup.find("div", id="content")
# child needed div.center.table.tbody
for row in content.div.center.table.tbody.find_all("tr"):
    details = row.find_all("td")
    seats.append({
        "name": details[0].text.strip(),
        "established": details[1].text.strip(),
        "seat": details[3].text.strip(),
    })


def getSeat(name):
    """Get the county seat."""
    for county in seats:
        if county["name"] == name:
            return county["seat"]


def getEstablished(name):
    """Get the county establishment date."""
    for county in seats:
        if county["name"] == name:
            return county["established"]


# Load the county dataset.
data = []
with open(sys.argv[1], "r") as f:
    data = json.load(f)

# Merge the seat and establishment dates into the data.
merged = []
for obj in data:
    obj["seat"]["name"] = getSeat(obj["name"])
    obj["established"] = getEstablished(obj["name"])
    merged.append(obj)

print(json.dumps(merged, indent=2))
