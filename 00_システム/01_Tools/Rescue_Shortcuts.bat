
@echo off
chcp 65001 > nul
setlocal

echo ---------------------------------------------------
echo   M-Lab Shortcut Rescue Team 🚑
echo   迷子のショートカットを探して救出します！
echo ---------------------------------------------------
echo.

set "userDesktop=%USERPROFILE%\OneDrive\デスクトップ"
if not exist "%userDesktop%" set "userDesktop=%USERPROFILE%\Desktop"

set "sortFolder=%userDesktop%\00_M-Lab_Sorted"
set "publicSortFolder=C:\Users\Public\Desktop\00_M-Lab_Sorted"

echo [SEARCH] Checking folders...
echo.

:: 1. 自分のSortフォルダの中を確認
if exist "%sortFolder%\Shortcuts\*.lnk" (
    echo [FOUND] %sortFolder%\Shortcuts にショートカットを発見！
    echo 救出（デスクトップに戻す）しますか？
    pause
    move /Y "%sortFolder%\Shortcuts\*.lnk" "%userDesktop%"
    move /Y "%sortFolder%\Shortcuts\*.url" "%userDesktop%"
    echo [RESTORED] デスクトップに戻しました！
    goto :End
)

:: 2. パブリックのSortフォルダの中を確認（ここが怪しい！）
if exist "%publicSortFolder%\Shortcuts\*.lnk" (
    echo [FOUND] %publicSortFolder%\Shortcuts にショートカットを発見！
    echo 救出（デスクトップに戻す）しますか？
    pause
    move /Y "%publicSortFolder%\Shortcuts\*.lnk" "%userDesktop%"
    move /Y "%publicSortFolder%\Shortcuts\*.url" "%userDesktop%"
    echo [RESTORED] デスクトップに戻しました！
    goto :End
)

:: 3. そもそも移動してない？
echo [NOT FOUND] 移動先のフォルダには見つかりませんでした。
echo もしかして、まだデスクトップ（画面上）に残っていませんか？
if exist "%userDesktop%\*.lnk" (
    echo [CHECK] デスクトップにはまだショートカットがあります！
) else (
    echo [WARNING] デスクトップにもありません... 本当に消えた！？
)

:End
echo.
echo Press any key to close...
pause
