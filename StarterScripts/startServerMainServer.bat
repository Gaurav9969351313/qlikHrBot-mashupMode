cls 
@echo off

start startRedisServer.bat
start startAdminPanel.bat

cd ..
cd server
npm run start
