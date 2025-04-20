@echo off
title Build Staging File
@echo run vite staging
call npm run staging
@echo build done
IF EXIST ../_cloud_production/build.zip DEL /F ../_cloud_production/staging_chs_cloud_front_end.zip
@echo Compress build output
powershell -Command "& {Compress-Archive -LiteralPath 'httpd.conf','Dockerfile','docker-compose.yml','build' -DestinationPath ../_cloud_production/staging_chs_cloud_front_end.zip -Force}"
@echo Compress done
@echo Build has complete