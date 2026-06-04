@echo off
setlocal enabledelayedexpansion
REM ============================================================
REM   deploy.bat  -  Publica starlinit.com con un solo comando
REM
REM   1) Compila el sitio (npm run build -> out\)
REM   2) Sincroniza out\ al repo de GitHub Pages (StarlinVilorio/portafolio)
REM   3) Hace commit y push  ->  starlinit.com se actualiza en ~1-2 min
REM
REM   Requisitos: Node.js, git, y haber hecho 'gh auth login' una vez.
REM ============================================================

REM Carpeta del script (fuente) y carpeta de publicacion (absoluta, sin "..")
set "SRC=%~dp0"
for %%I in ("%~dp0..") do set "PARENT=%%~fI"
set "DEPLOY=%PARENT%\portafolio_deploy"
set "REPO_URL=https://github.com/StarlinVilorio/portafolio.git"

REM Trabajar siempre desde la carpeta del proyecto
cd /d "%SRC%"

echo.
echo ====================================================
echo   Desplegando starlinit.com
echo ====================================================
echo.

REM --- 1) Build ---------------------------------------------------------------
echo [1/4] Compilando el sitio (npm run build)...
call npm run build
if errorlevel 1 goto :fail_build
if not exist "%SRC%out\index.html" goto :fail_build

REM --- 2) Clonar o actualizar el repo de Pages --------------------------------
echo.
echo [2/4] Preparando el repositorio de publicacion...
if not exist "%DEPLOY%\.git" (
    echo       Clonando %REPO_URL% ...
    git clone "%REPO_URL%" "%DEPLOY%"
    if errorlevel 1 goto :fail_clone
) else (
    git -C "%DEPLOY%" pull --ff-only
)
git -C "%DEPLOY%" config user.name  "Starlin Vilorio"
git -C "%DEPLOY%" config user.email "starlin.newtron@gmail.com"

REM --- 3) Sincronizar el build (preservando .git) -----------------------------
echo.
echo [3/4] Sincronizando archivos compilados...
robocopy "%SRC%out" "%DEPLOY%" /MIR /XD "%DEPLOY%\.git" /NFL /NDL /NJH /NJS /NP >nul
if %ERRORLEVEL% GEQ 8 goto :fail_copy

REM --- 4) Commit + push -------------------------------------------------------
echo.
echo [4/4] Publicando en GitHub Pages...
git -C "%DEPLOY%" add -A
git -C "%DEPLOY%" diff --cached --quiet
if errorlevel 1 (
    git -C "%DEPLOY%" commit -m "Deploy %DATE% %TIME%"
    git -C "%DEPLOY%" push
    if errorlevel 1 goto :fail_push
    echo.
    echo ====================================================
    echo   Publicado. starlinit.com se actualizara en 1-2 min.
    echo ====================================================
) else (
    echo.
    echo   No hay cambios que publicar ^(el sitio ya esta al dia^).
)
echo.
pause
exit /b 0

:fail_build
echo [ERROR] Fallo la compilacion. Revisa los errores arriba.
pause
exit /b 1
:fail_clone
echo [ERROR] No se pudo clonar el repositorio de publicacion.
pause
exit /b 1
:fail_copy
echo [ERROR] Fallo robocopy al sincronizar (codigo %ERRORLEVEL%).
pause
exit /b 1
:fail_push
echo [ERROR] Fallo el push a GitHub.
pause
exit /b 1
