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

# Load the county canonical names.
cnames = []

with open(sys.argv[1], "r") as f:
    for line in f:
        (name, cname) = line.strip().split(",")
        cnames.append({
            "name": str(name),
            "cname": str(cname),
        })


def getCountyCanonicalName(name):
    """Get county canonical county name for provided name."""
    for county in cnames:
        if county["name"] == name:
            return county["cname"]


# Load the county dataset.
data = []
with open(sys.argv[2], "r") as f:
    data = json.load(f)

# Merge the codes into the data.
merged = []
for obj in data:
    obj["cname"] = getCountyCanonicalName(obj["name"])
    merged.append(obj)

print(json.dumps(merged, indent=2))
