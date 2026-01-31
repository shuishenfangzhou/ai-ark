@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM AI方舟 - 数据自动更新脚本 (增强版)
REM 特性：支持手动确认、详细日志、错误恢复
REM ========================================

REM 配置
set "PROJECT_DIR=%~dp0"
set "LOG_DIR=%PROJECT_DIR%logs"
set "TODAY=%date:~0,4%-%date:~5,2%-%date:~8,2%"
set "LOG_FILE=%LOG_DIR%\update_%TODAY%.log"
set "PYTHON_CMD=python"

REM 颜色配置
color 0A

REM 创建日志目录
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 初始化日志
echo ========================================= > "%LOG_FILE%"
echo [AI方舟] 数据自动更新脚本 (增强版) >> "%LOG_FILE%"
echo [开始时间] %date% %time% >> "%LOG_FILE%"
echo [工作目录] %PROJECT_DIR% >> "%LOG_FILE%"
echo ========================================= >> "%LOG_FILE%"

cls
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║           AI方舟 - 数据自动更新脚本                 ║
echo ║         AI Tools Dashboard Auto-Updater             ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo   日期: %TODAY%
echo   时间: %time%
echo   日志: logs\update_%TODAY%.log
echo.

REM 步骤计数器
set "STEP=0"

REM ========================================
REM 步骤 1: 检查环境
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 检查 Python 环境...
echo [ %STEP% / 7 ] 检查 Python 环境 >> "%LOG_FILE%"

%PYTHON_CMD% --version >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo.
    echo   ❌ 错误: Python 未找到！
    echo   请安装 Python 3.8+ 并添加到 PATH
    echo [错误] Python 未找到 >> "%LOG_FILE%"
    pause
    exit /b 1
)
echo   ✅ Python 环境检查通过

REM ========================================
REM 步骤 2: 切换到项目目录
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 切换到项目目录...
echo [ %STEP% / 7 ] 切换到项目目录 >> "%LOG_FILE%"

cd /d "%PROJECT_DIR%"
if errorlevel 1 (
    echo   ❌ 无法切换到项目目录
    echo [错误] 目录切换失败 >> "%LOG_FILE%"
    pause
    exit /b 1
)
echo   ✅ 已切换到: %PROJECT_DIR%

REM ========================================
REM 步骤 3: 拉取远程更新
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 拉取远程仓库更新...
echo [ %STEP% / 7 ] 拉取远程更新 >> "%LOG_FILE%"

echo   正在执行 git pull...
git pull origin main >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  拉取时出现冲突或错误
    echo [警告] Git pull 失败 >> "%LOG_FILE%"
) else (
    echo   ✅ 远程更新已合并
)

REM ========================================
REM 步骤 4: 抓取 GitHub 数据
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 抓取 GitHub Trending 数据...
echo [ %STEP% / 7 ] 抓取 GitHub 数据 >> "%LOG_FILE%"

echo   正在执行 scraper/github_scraper_en.py...
%PYTHON_CMD% scraper/github_scraper_en.py >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  GitHub 抓取部分失败（可能网络问题）
    echo [警告] GitHub 抓取失败 >> "%LOG_FILE%"
) else (
    echo   ✅ GitHub 数据抓取完成
)

REM ========================================
REM 步骤 5: 合并数据
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 合并数据...
echo [ %STEP% / 7 ] 合并数据 >> "%LOG_FILE%"

echo   正在执行 scraper/merge_github_data.py...
%PYTHON_CMD% scraper/merge_github_data.py >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ 数据合并失败
    echo [错误] 数据合并失败 >> "%LOG_FILE%"
    pause
    exit /b 1
)
echo   ✅ 数据合并完成

REM ========================================
REM 步骤 6: 检查更新
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 检查更新内容...
echo [ %STEP% / 7 ] 检查更新 >> "%LOG_FILE%"

echo   正在检查 git 状态...
for /f "delims=" %%i in ('git status --porcelain ^| findstr /c:"toolsData.json"') do (
    set "UPDATED_FILE=%%i"
    goto FOUND_UPDATE
)
echo   未检测到数据更新
echo [信息] 无新数据更新 >> "%LOG_FILE%"
goto SKIP_COMMIT

:FOUND_UPDATE
echo   检测到数据文件更新！
echo [更新] 检测到数据变更 >> "%LOG_FILE%"

REM 显示文件信息
if exist "dist\toolsData.json" (
    for %%I in (dist\toolsData.json) do (
        echo   文件大小: %%~zI bytes
        echo [数据] toolsData.json 大小: %%~zI bytes >> "%LOG_FILE%"
    )
)

REM ========================================
REM 步骤 7: 提交并推送
REM ========================================
set /a STEP+=1
echo [ %STEP% / 7 ] 提交并推送到远程...
echo [ %STEP% / 7 ] 提交并推送 >> "%LOG_FILE%"

echo   正在添加文件...
git add -A >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ Git add 失败
    echo [错误] Git add 失败 >> "%LOG_FILE%"
    pause
    exit /b 1
)

REM 生成提交消息
set "COMMIT_MSG=chore: auto-update data %TODAY%"
echo   提交消息: %COMMIT_MSG%
echo [提交] %COMMIT_MSG% >> "%LOG_FILE%"

echo   正在提交...
git commit -m "%COMMIT_MSG%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  提交失败（可能没有变更）
    echo [信息] 无需提交 >> "%LOG_FILE%"
    goto SKIP_PUSH
)

echo   正在推送到远程...
git push origin main >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ 推送失败
    echo [错误] Git push 失败 >> "%LOG_FILE%"
    pause
    exit /b 1
)
echo   ✅ 已推送到远程仓库

:SKIP_PUSH

:SKIP_COMMIT

REM ========================================
REM 完成
REM ========================================
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║                    ✅ 完成！                        ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo   下一步操作:
echo   1. 1Panel 服务器会自动拉取最新代码
echo   2. 网站数据将在几分钟内更新
echo.
echo   日志文件: %LOG_FILE%
echo.

echo [完成] 脚本执行成功 >> "%LOG_FILE%"
echo [结束时间] %date% %time% >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

REM 自动打开日志文件（可选）
REM start "" "%LOG_FILE%"

pause
goto :EOF

:ERROR
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║                    ❌ 错误！                         ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo   更新过程中出现错误
echo   请查看日志文件获取详细信息
echo.
echo   日志: %LOG_FILE%
echo.

echo [严重错误] 脚本异常退出 >> "%LOG_FILE%"
echo [结束时间] %date% %time% >> "%LOG_FILE%"

pause
exit /b 1
