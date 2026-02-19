
@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

:: 🌟 M-Lab Desktop Organizer (Batch Version)
:: 確実に動く、最強のワンファイル版。

echo ==================================================
echo   M-Lab Desktop Organizer - Cleaning Start! 🧹
echo ==================================================
echo.

:: 1. デスクトップの場所を探す
set "desktopPath=%USERPROFILE%\OneDrive\デスクトップ"
if not exist "%desktopPath%" (
    set "desktopPath=%USERPROFILE%\OneDrive\Desktop"
)
if not exist "%desktopPath%" (
    set "desktopPath=%USERPROFILE%\Desktop"
)

echo [TARGET] %desktopPath%
if not exist "%desktopPath%" (
    echo [ERROR] Desktop folder not found!
    echo.
    pause
    exit /b
)

:: 2. 整理用フォルダを作る
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
    set "todayStr=%%a-%%b-%%c_Sorted"
)
:: 日付形式が環境によって違う場合の対策（シンプルに YYYY-MM-DD 固定に挑戦せず、Sorted_Date とする）
set "todayFolder=%desktopPath%\Sorted_Files_%date:~0,4%-%date:~5,2%-%date:~8,2%"

if not exist "%todayFolder%" (
    mkdir "%todayFolder%"
    echo [CREATE] %todayFolder%
)

:: 3. ファイルを移動する（拡張子ごとにループ）

:: 画像 (Images)
if not exist "%todayFolder%\Images" mkdir "%todayFolder%\Images"
move "%desktopPath%\*.jpg" "%todayFolder%\Images" >nul 2>&1 && echo [MOVE] *.jpg to Images
move "%desktopPath%\*.png" "%todayFolder%\Images" >nul 2>&1 && echo [MOVE] *.png to Images
move "%desktopPath%\*.bmp" "%todayFolder%\Images" >nul 2>&1 && echo [MOVE] *.bmp to Images

:: 書類 (Documents)
if not exist "%todayFolder%\Documents" mkdir "%todayFolder%\Documents"
move "%desktopPath%\*.pdf" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.pdf to Documents
move "%desktopPath%\*.docx" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.docx to Documents
move "%desktopPath%\*.doc" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.doc to Documents
move "%desktopPath%\*.txt" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.txt to Documents
move "%desktopPath%\*.pptx" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.pptx to Documents
move "%desktopPath%\*.md" "%todayFolder%\Documents" >nul 2>&1 && echo [MOVE] *.md to Documents

:: 表計算 (Excel)
if not exist "%todayFolder%\Spreadsheets" mkdir "%todayFolder%\Spreadsheets"
move "%desktopPath%\*.xlsx" "%todayFolder%\Spreadsheets" >nul 2>&1 && echo [MOVE] *.xlsx to Spreadsheets
move "%desktopPath%\*.xls" "%todayFolder%\Spreadsheets" >nul 2>&1 && echo [MOVE] *.xls to Spreadsheets
move "%desktopPath%\*.csv" "%todayFolder%\Spreadsheets" >nul 2>&1 && echo [MOVE] *.csv to Spreadsheets

:: その他 (Archives/Media)
if not exist "%todayFolder%\Archives" mkdir "%todayFolder%\Archives"
move "%desktopPath%\*.zip" "%todayFolder%\Archives" >nul 2>&1 && echo [MOVE] *.zip to Archives
move "%desktopPath%\*.mp4" "%todayFolder%\Archives" >nul 2>&1 && echo [MOVE] *.mp4 to Archives

echo.
echo ==================================================
echo   Done! Your desktop is clean. ✨
echo ==================================================
echo.
pause
