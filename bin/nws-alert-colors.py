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


def update_alert_colors(data):
    """Load the alert colors."""
    c = MongoClient("mongodb://localhost:27017/")
    db = c["albtn"]
    coll = db["nwsalertcolors"]
    coll.delete_many({})
    coll.insert_many(data)


def get_alert_colors():
    """Get and process the NWS alert polygon colors."""
    url = "https://www.weather.gov/help-map"
    raw = requests.get(url)
    soup = bs(raw.content, "html.parser")
    alerts = []

    table = soup.find("table", class_="colorLegend")
    # child needed table.tbody
    for row in table.tbody.find_all("tr"):
        details = row.find_all("td")
        alerts.append({
            "event": details[0].text.strip().lower(),
            "priority": int(details[1].text.strip()),
            "color": f"#{details[5].text.strip().lower()}",
        })

    return alerts


if __name__ == "__main__":
    update_alert_colors(get_alert_colors())
