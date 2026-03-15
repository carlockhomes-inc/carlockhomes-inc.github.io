
@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ---------------------------------------------------
echo   M-Lab Desktop Cleaner (Ver.4 - Public Buster)
echo ---------------------------------------------------
echo.

:: 1. 整理先のフォルダを作成
:: （OneDrive上の自分専用の場所にまとめる）
set "targetDir=%USERPROFILE%\OneDrive\デスクトップ"
if not exist "%targetDir%" set "targetDir=%USERPROFILE%\Desktop"
set "sortFolder=%targetDir%\00_M-Lab_Sorted"

if not exist "%sortFolder%" (
    mkdir "%sortFolder%"
    echo [CREATE] %sortFolder%
)

:: 2. 自分専用のデスクトップをお掃除
echo.
echo [1/2] Cleaning USER Desktop...
set "userDesktop=%USERPROFILE%\OneDrive\デスクトップ"
if not exist "%userDesktop%" set "userDesktop=%USERPROFILE%\Desktop"

call :MoveFiles "%userDesktop%"

:: 3. パブリック（共通）デスクトップもお掃除
echo.
echo [2/2] Cleaning PUBLIC Desktop...
set "publicDesktop=C:\Users\Public\Desktop"

if exist "%publicDesktop%" (
    call :MoveFiles "%publicDesktop%"
) else (
    echo [SKIP] Public Desktop not found.
)

echo.
echo [SUCCESS] Total Wipeout finished! 🌪️
echo files moved to: %sortFolder%
echo.
echo Press any key to close...
pause
exit /b

:: --- ファイル移動用サブルーチン ---
:MoveFiles
set "src=%~1"

:: 画像
if not exist "%sortFolder%\Images" mkdir "%sortFolder%\Images"
move /Y "%src%\*.jpg" "%sortFolder%\Images" >nul 2>&1
move /Y "%src%\*.png" "%sortFolder%\Images" >nul 2>&1
move /Y "%src%\*.jpeg" "%sortFolder%\Images" >nul 2>&1
move /Y "%src%\*.bmp" "%sortFolder%\Images" >nul 2>&1

:: 書類
if not exist "%sortFolder%\Documents" mkdir "%sortFolder%\Documents"
move /Y "%src%\*.pdf" "%sortFolder%\Documents" >nul 2>&1
move /Y "%src%\*.docx" "%sortFolder%\Documents" >nul 2>&1
move /Y "%src%\*.doc" "%sortFolder%\Documents" >nul 2>&1
move /Y "%src%\*.txt" "%sortFolder%\Documents" >nul 2>&1
move /Y "%src%\*.md" "%sortFolder%\Documents" >nul 2>&1
move /Y "%src%\*.html" "%sortFolder%\Documents" >nul 2>&1

:: データ
if not exist "%sortFolder%\Excel" mkdir "%sortFolder%\Excel"
move /Y "%src%\*.xlsx" "%sortFolder%\Excel" >nul 2>&1
move /Y "%src%\*.csv" "%sortFolder%\Excel" >nul 2>&1

:: 簡易メディア
if not exist "%sortFolder%\Media" mkdir "%sortFolder%\Media"
move /Y "%src%\*.mp4" "%sortFolder%\Media" >nul 2>&1
move /Y "%src%\*.zoom" "%sortFolder%\Media" >nul 2>&1

:: 圧縮
if not exist "%sortFolder%\Archives" mkdir "%sortFolder%\Archives"
move /Y "%src%\*.zip" "%sortFolder%\Archives" >nul 2>&1

:: ショートカット・URL (ここが本命！)
if not exist "%sortFolder%\Shortcuts" mkdir "%sortFolder%\Shortcuts"
move /Y "%src%\*.lnk" "%sortFolder%\Shortcuts" >nul 2>&1
move /Y "%src%\*.url" "%sortFolder%\Shortcuts" >nul 2>&1

exit /b
