#!/bin/bash

python ./src/scripts/getPointsCodeforces.py | tr "\'" "\""  >  src/json/final201802.json