#!/bin/bash

# Create MySQL Docker Container
current_dir=$(pwd)
docker run --name osu-db -p 3305:3306 -e MYSQL_ROOT_PASSWORD=password -d -v "${current_dir}/sql:/docker-entrypoint-initdb.d" mysql

# Populate Clip and Profile Image Data
sourceDirectory1="$(dirname "$0")/player-clips"
sourceDirectory2="$(dirname "$0")/profile-images"
destinationDirectory1="../api/uploads/player-clips"
destinationDirectory2="../api/uploads/profile-images"

cp -R "$sourceDirectory1" "$destinationDirectory1"
cp -R "$sourceDirectory2" "$destinationDirectory2"

if [ $? -eq 0 ]; then
  echo "Directory copied successfully."
else
  echo "Failed to copy directory."
fi