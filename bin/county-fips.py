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

url = "https://www2.census.gov/geo/docs/reference/codes/files/st01_al_cou.txt"
raw = requests.get(url)
data = []

for line in raw.iter_lines():
    fields = line.decode().split(",")
    data.append({
        "name": fields[3].removesuffix(" County"),
        "fips": str(fields[1]) + str(fields[2]),
        "cname": "",
        "seat": {
            "name": "",
            "geoid": "",
            "location": {
                "type": "Point",
                "coordinates": [],
            },
        },
        "established": "",
        "code": "",
    })

print(json.dumps(data, indent=2))
