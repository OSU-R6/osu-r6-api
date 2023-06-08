#!/bin/bash

# Create MySQL Docker Container
docker run --name osu-r6-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d -v /Users/krist/Documents/WebDev/osu-r6-api/init/sql/:/docker-entrypoint-initdb.d --restart unless-stopped mysql

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