
@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ---------------------------------------------------
echo   FUMIKO Rescue Team: Ultimate Search 🕵️‍♂️
echo   消えたショートカット（Google Chromeなど）を
echo   PC全体から本気で探します！
echo ---------------------------------------------------
echo.
echo [SEARCHING] 検索中... 時間がかかる場合があります...
echo.

:: 1. ユーザーフォルダ全体から「Google Chrome.lnk」を探す
dir /s /b "%USERPROFILE%\Google Chrome.lnk" > found_shortcuts.txt 2>nul
dir /s /b "%USERPROFILE%\Microsoft Edge.lnk" >> found_shortcuts.txt 2>nul
dir /s /b "C:\Users\Public\Desktop\*.lnk" >> found_shortcuts.txt 2>nul

echo [RESULT] Found Shortcuts:
echo ---------------------------------------------------
type found_shortcuts.txt
echo ---------------------------------------------------
echo.

set /p OpenFolder="見つかったフォルダを開きますか？ (Y/N): "
if /i "%OpenFolder%"=="Y" (
    for /f "delims=" %%i in (found_shortcuts.txt) do (
        echo Opening folder for: %%i
        explorer /select,"%%i"
        goto :End
    )
)

:End
echo.
echo Press any key to close...
pause
del found_shortcuts.txt
