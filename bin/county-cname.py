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

fn = sys.argv[1]

with open(fn, "r") as f:
    fips = json.load(f)

data = []

for county in fips:
    data.append({
        "name": str(county["name"]),
        "cname": str(county["name"]),
        "fips": str(county["fips"]),
    })

print(json.dumps(data, indent=2))
