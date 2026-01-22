@echo off
setlocal

set "OUTPUT=%~1"
set "FROM=%~2"
set "TO=%~3"

set "ARGS=ef migrations script --project "LgymApi.Infrastructure" --startup-project "LgymApi.Api""

if not "%FROM%"=="" set "ARGS=%ARGS% --from %FROM%"
if not "%TO%"=="" set "ARGS=%ARGS% --to %TO%"
if not "%OUTPUT%"=="" set "ARGS=%ARGS% --output %OUTPUT%"

dotnet %ARGS%
if errorlevel 1 exit /b %errorlevel%

endlocal
