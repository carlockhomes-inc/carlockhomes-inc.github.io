[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'
$base = 'c:\Users\fmfmf\OneDrive\デスクトップ\AIプロダクト\2nd-Brain\04_アウトプット'

$targets = @{
    '00' = 'TMP_00_M-Lab_基本情報'
    '01' = 'TMP_01_アイデア・企画'
    '02' = 'TMP_02_SNS発信'
    '03' = 'TMP_03_Note'
    '04' = 'TMP_04_Instagram'
    '05' = 'TMP_05_メルマガ'
    '06' = 'TMP_06_音楽・MV制作'
    '07' = 'TMP_07_業務改善・クライアント'
    '08' = 'TMP_08_プライベート・日常'
    '09' = 'TMP_09_Kindle'
    '99' = 'TMP_99_画像・素材まとめ'
}

foreach ($t in $targets.Values) {
    New-Item -ItemType Directory -Force -Path (Join-Path $base $t) | Out-Null
}

function Move-Safe {
    param($src, $dst)
    $srcPath = Join-Path $base $src
    $dstPath = Join-Path $base $dst
    if (Test-Path $srcPath) {
        if ((Get-Item $srcPath) -is [System.IO.DirectoryInfo]) {
            Get-ChildItem -Path $srcPath -Force | ForEach-Object {
                try {
                    Move-Item -Path $_.FullName -Destination $dstPath -Force
                }
                catch {
                    Write-Host "FAIL to move $($_.FullName): $($_.Exception.Message)"
                }
            }
        }
        else {
            try {
                Move-Item -Path $srcPath -Destination $dstPath -Force
            }
            catch {
                Write-Host "FAIL to move $srcPath: $($_.Exception.Message)"
            }
        }
    }
}

Move-Safe '00_基本情報' $targets['00']
Move-Safe 'M-Lab_Official' $targets['00']
Move-Safe '20260212_M_Lab_Service_Menu_Draft.md' $targets['00']
Move-Safe '20260218_Video_Manual_Draft.md' $targets['00']
Move-Safe '20260219_M_Lab_NameCard_Concepts.md' $targets['00']
Move-Safe '20260219_M_Lab_Business_Card_Data.md' $targets['00']
Move-Safe '20260226_Freelance_Invoice_Guide.md' $targets['00']
Move-Safe '20260305_Instructor_Roadmap_M_Lab.md' $targets['00']
Move-Safe 'HowTo_Client_Room_お客様用ロビーの作り方.md' $targets['00']
Move-Safe 'HowTo_SecretBase_秘密基地の作り方.md' $targets['00']
Move-Safe 'Next_Project_Client_Room.md' $targets['00']

Move-Safe '00_Ideas' $targets['01']
Move-Safe '20260210_Business_Plan_Mamas_Secret_Base_事業計画書.md' $targets['01']
Move-Safe '20260210_Concept_Digital_Channeling_デジタルな巫女.md' $targets['01']
Move-Safe '20260210_Content_SecretBase_Resilience.md' $targets['01']
Move-Safe '20260210_Idea_Mamas_Secret_Base_母の相談室構想.md' $targets['01']
Move-Safe '20260210_Session_Log_Day1_FirstBrainへ.md' $targets['01']
Move-Safe '20260211_Content_SecretBase_Final.md' $targets['01']
Move-Safe '20260213_Idea_Modern_Kawaraban.md' $targets['01']
Move-Safe 'M_Lab_Business_Plan_Music.md' $targets['01']

Move-Safe 'SNS' $targets['02']
Move-Safe '01_Xポスト' $targets['02']
Move-Safe '20260217_SNS_Launch_Plan.md' $targets['02']
Move-Safe '20260217_CarLockHolmes_SNS_Launch.md' $targets['02']
Move-Safe '20260218_SNS_Visual_Plan.md' $targets['02']

Move-Safe '03_Note' $targets['03']
Move-Safe '01_Note_Articles' $targets['03']

Move-Safe '05_Instagram' $targets['04']
Move-Safe '02_Instagram_Posts' $targets['04']
Move-Safe '20260210_IG_Feed_Draft_Calendar_カレンダー投稿.md' $targets['04']
Move-Safe '20260210_IG_Story_Draft_Breakfast_インスタストーリー_朝食.md' $targets['04']

Move-Safe '00_メルマガ' $targets['05']
Move-Safe '02_メルマガ' $targets['05']

Move-Safe 'M-Lab_MV_Maker' $targets['06']
Move-Safe 'SUNOアップロード用' $targets['06']
Move-Safe '20260228_Song_Draft_Challengers.md' $targets['06']
Move-Safe '20260228_Song_Draft_Working_Pride.md' $targets['06']
Move-Safe '202603_Video_Project_Lock_Basic.md' $targets['06']

Move-Safe '10_Google講習会' $targets['07']
Move-Safe '20_会社への提案' $targets['07']
Move-Safe '20_在庫管理システム' $targets['07']
Move-Safe '30_業務改善提案' $targets['07']
Move-Safe '50_LP制作' $targets['07']
Move-Safe '95_事務マニュアル' $targets['07']
Move-Safe '20260212_Monetization_Strategy.md' $targets['07']
Move-Safe '20260213_Job_Application_Draft_LIFULL.md' $targets['07']
Move-Safe '20260218_Recruitment_Text_40s.md' $targets['07']
Move-Safe '20260219_LIFULL_Application_Final.md' $targets['07']
Move-Safe 'M_Lab_Global_Distribution_Guide.md' $targets['07']

Move-Safe '01_家族' $targets['08']
Move-Safe '90_料理・レシピ' $targets['08']
Move-Safe '20260210_Morning_Log_Breakfast_朝食ログ.md' $targets['08']
Move-Safe '20260217_6Hour_Challenge.md' $targets['08']
Move-Safe '20260219_Today_Schedule_Recovery.md' $targets['08']
Move-Safe '202602_Schedule_MLab.md' $targets['08']
Move-Safe '202602_Shift_and_MLab_Schedule.md' $targets['08']
Move-Safe '202603_March_Battle_Plan_Part1.md' $targets['08']
Move-Safe '202603_March_Survival_Plan.md' $targets['08']
Move-Safe '202603_March_Victory_Calendar.md' $targets['08']
Move-Safe '202603_Shift_Import_Part1.csv' $targets['08']
Move-Safe '2026_Combined_Shift_Import.csv' $targets['08']

Move-Safe '01_Kindle' $targets['09']

Move-Safe '99_Images' $targets['99']
Move-Safe '99_全画像まとめ' $targets['99']
Move-Safe '04_Note画像' $targets['99']
Move-Safe '02_X画像' $targets['99']

# Sweep any remaining .md down into 00_M-Lab_基本情報
Get-ChildItem -Path $base -File -Force | ForEach-Object {
    if ($_.Name -like "*.md") {
        try {
            Move-Item -Path $_.FullName -Destination (Join-Path $base $targets['00']) -Force
        }
        catch {}
    }
}

$oldDirs = @(
    '00_基本情報', 'M-Lab_Official', '00_Ideas', 'SNS', '01_Xポスト', '03_Note', '01_Note_Articles',
    '05_Instagram', '02_Instagram_Posts', '00_メルマガ', '02_メルマガ', 'M-Lab_MV_Maker', 'SUNOアップロード用',
    '10_Google講習会', '20_会社への提案', '20_在庫管理システム', '30_業務改善提案', '50_LP制作', '95_事務マニュアル',
    '01_家族', '90_料理・レシピ', '01_Kindle', '99_Images', '99_全画像まとめ', '04_Note画像', '02_X画像'
)

foreach ($dir in $oldDirs) {
    $dPath = Join-Path $base $dir
    if (Test-Path $dPath) {
        $c = (Get-ChildItem -Path $dPath -Recurse -File -Force).Count
        if ($c -eq 0) {
            Remove-Item -Path $dPath -Recurse -Force
        }
        else {
            Write-Host "WARNING: $dir is not empty ($c files remaining)"
        }
    }
}

Rename-Item -Path (Join-Path $base $targets['00']) -NewName '00_M-Lab_基本情報' -Force
Rename-Item -Path (Join-Path $base $targets['01']) -NewName '01_アイデア・企画' -Force
Rename-Item -Path (Join-Path $base $targets['02']) -NewName '02_SNS発信' -Force
Rename-Item -Path (Join-Path $base $targets['03']) -NewName '03_Note' -Force
Rename-Item -Path (Join-Path $base $targets['04']) -NewName '04_Instagram' -Force
Rename-Item -Path (Join-Path $base $targets['05']) -NewName '05_メルマガ' -Force
Rename-Item -Path (Join-Path $base $targets['06']) -NewName '06_音楽・MV制作' -Force
Rename-Item -Path (Join-Path $base $targets['07']) -NewName '07_業務改善・クライアント' -Force
Rename-Item -Path (Join-Path $base $targets['08']) -NewName '08_プライベート・日常' -Force
Rename-Item -Path (Join-Path $base $targets['09']) -NewName '09_Kindle' -Force
Rename-Item -Path (Join-Path $base $targets['99']) -NewName '99_画像・素材まとめ' -Force

$finalCount = (Get-ChildItem -Path $base -Recurse -File -Force).Count
Write-Host "Done. Final file count: $finalCount"
