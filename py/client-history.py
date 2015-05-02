#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys, json
from datetime import datetime

# 1 client count per hour for last week
LAST_WEEK = 24*7
HISTORY_FILE = '/var/www/meshviewer/json/clienthistory.json'

# load current client history file
nodes = json.loads(''.join(sys.stdin))['nodes']
label = datetime.now().strftime("%a, %d.%m.%Y %H:00")

try:
    with open(HISTORY_FILE) as f:
        clients = json.load(f)
except IOError:
    # first run
    clients = {}

# unavailable nodes
for id in clients.keys():
    if id not in nodes.keys():
        clients[id].append((label, -1))

# get client count
for id, values in nodes.items():
    if id not in clients: clients[id] = []
    clients[id].append((label, values['statistics']['clients']))
    # ignore data older than 1 week
    if len(clients[id]) > LAST_WEEK: clients[id] = clients[id][-LAST_WEEK:]

# save client history file
with open(HISTORY_FILE, 'w') as f:
    json.dump(clients, f)
