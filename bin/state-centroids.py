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

import argparse
import json

import requests
from bs4 import BeautifulSoup as bs
from pymongo import MongoClient
from thefuzz import process
from thefuzz import fuzz


def update_state_centroids(
    data,
    conn="mongodb://localhost:27017/",
    dbname="albtn",
):
    """Load the state centroids."""
    c = MongoClient(conn)
    db = c[dbname]
    coll = db["stateboundaries"]

    states = coll.find(
        {},
        ["name"],
    )

    state_names = []
    for state in states:
        state_names.append(state["name"])

    for doc in data["features"]:
        state = process.extractOne(
            doc["properties"]["state"],
            state_names,
            scorer=fuzz.token_set_ratio,
        )[0]
        coll.update_one(
            {"name": state},
            {"$set": {"centroid": doc["geometry"]}},
        )

    return


def get_state_centroids(
    url="https://en.wikipedia.org/wiki/List_of_geographic_centers_of_the_United_States",
):
    """Get and process the state and territory centroids."""
    raw = requests.get(url)
    soup = bs(raw.content, "html.parser")
    centroids = {
        "type": "FeatureCollection",
        "name": "US States and Territories Centroids",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4269"}},
        "features": [],
    }

    tables = soup.find_all("table", class_="wikitable sortable")
    for table in tables:
        # states table caption:  Updated geographic centers of the
        # states of the United States and the District of Columbia
        if "Updated geographic centers of the states" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    centroids["features"].append(
                        {
                            "type": "Feature",
                            "properties": {
                                "state": cells[0].text.strip(),
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    float(
                                        cells[2]
                                        .find("span", class_="geo")
                                        .text.strip()
                                        .split(";")[1]
                                        .strip()
                                    ),
                                    float(
                                        cells[2]
                                        .find("span", class_="geo")
                                        .text.strip()
                                        .split(";")[0]
                                        .strip()
                                    ),
                                ],
                            },
                        }
                    )

        # territories table caption: Geographic centers of the
        # U.S. territories
        if "Geographic centers of the U.S. territories" in table.caption.text.strip():
            for row in table.tbody.find_all("tr"):
                cells = row.find_all("td")
                if len(cells):
                    if cells[3].find("span", class_="geo"):
                        coord = cells[3].find("span", class_="geo").text.strip()

                        centroids["features"].append(
                            {
                                "type": "Feature",
                                "properties": {
                                    "state": cells[0].text.strip(),
                                    "geoid": "",
                                    "usps": "",
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                        float(coord.split(";")[1].strip()),
                                        float(coord.split(";")[0].strip()),
                                    ],
                                },
                            }
                        )

    return centroids


def load_data(args):
    """Load centroid data."""
    if args.file:
        with open(args.file, "r") as f:
            return json.load(f)
    else:
        return get_state_centroids(args.url)


def _create_argument_parser():
    """Create an argparse argument parser."""
    parser = argparse.ArgumentParser(
        description="""\
al-btn-api, Alabama data API
""",
    )

    parser.add_argument(
        "-f",
        "--file",
        dest="file",
        type=str,
        default="",
        # nargs=1,
        help="Local data file.",
    )

    parser.add_argument(
        "-p",
        "--print",
        dest="print",
        default=False,
        action="store_true",
        help="Print data to be uploaded, as valid JSON, without uploading the data.",
    )

    # MongoDB name.
    parser.add_argument(
        "-d",
        "--database",
        dest="database",
        type=str,
        default="albtn",
        nargs=1,
        help="MongoDB database name.",
    )

    # MongoDB connection string.
    parser.add_argument(
        "-c",
        "--connection",
        dest="connection",
        type=str,
        default="mongodb://localhost:27017/",
        nargs=1,
        help="MongoDB connection string.",
    )

    # url to slurp
    parser.add_argument(
        "-u",
        "--url",
        dest="url",
        type=str,
        default="https://en.wikipedia.org/wiki/List_of_geographic_centers_of_the_United_States",
        nargs=1,
        help="Source URL containing centroid estimate data.",
    )

    return parser


if __name__ == "__main__":

    # Get and parse cli arguments.
    args = _create_argument_parser().parse_args()

    # Fetch and load data.
    data = load_data(args)

    # Print or update data.
    if args.print:
        print(json.dumps(data, indent=2))
    else:
        update_state_centroids(data, args.connection, args.database)
