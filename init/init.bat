@echo off

REM Create MySQL Docker Container
set "current_dir=%CD%"
docker run --name osu-r6-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d -v "%current_dir%\sql:/docker-entrypoint-initdb.d" --restart unless-stopped mysql

REM Populate Clip and Profile Image Data
set "sourceDirectory1=%~dp0player-clips"
set "sourceDirectory2=%~dp0profile-images"
set "destinationDirectory1=..\api\uploads\player-clips"
set "destinationDirectory2=..\api\uploads\profile-images"

xcopy /E /I "%sourceDirectory1%" "%destinationDirectory1%"
xcopy /E /I "%sourceDirectory2%" "%destinationDirectory2%"

if %errorlevel% equ 0 (
  echo Directory copied successfully.
) else (
  echo Failed to copy directory.
)