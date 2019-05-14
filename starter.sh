#!/bin/bash

# should be run with admin privileges

cd database
sudo bash mongo.sh
cd ..
sudo npm install
sudo npm test
sudo npm --prefix client install
sudo npm --prefix client run-script build
sudo npm start