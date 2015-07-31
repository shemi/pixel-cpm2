#!/bin/bash

# Install Node.js
echo "Installing Node.js"
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs
