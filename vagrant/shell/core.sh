#!/bin/bash

echo "Installing core things"
# Install core
apt-get update
# Install build tools
# apt-get install -y make g++ git curl vim libcairo2-dev libav-tools nfs-common portmap
apt-get install -y make git curl nfs-common build-essential
