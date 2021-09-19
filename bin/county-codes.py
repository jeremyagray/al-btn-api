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
# import requests

# The source is a PDF of a MS Word document.
# url = "https://arec.alabama.gov/arec/docs/forms/general/county-codes.pdf"

codes = []

# Load the county codes.
with open(sys.argv[1], "r") as f:
    for line in f:
        fields = line.strip().split(",")
        codes.append({
            "cname": str(fields[1]),
            "code": str(fields[0]),
        })


def getCountyCode(cname):
    """Get county code for provided canonical county name."""
    for county in codes:
        if county["cname"] == cname:
            return county["code"]


# Load the county dataset.
data = []
with open(sys.argv[2], "r") as f:
    data = json.load(f)

# Merge the codes into the data.
merged = []
for obj in data:
    obj["code"] = getCountyCode(obj["cname"])
    merged.append(obj)

print(json.dumps(merged, indent=2))
