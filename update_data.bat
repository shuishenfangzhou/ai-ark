@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM AI方舟 - 数据自动更新脚本
REM 功能：自动抓取 GitHub Trending 数据 -> 合并 -> 提交 Git
REM ========================================

REM 配置
set "PROJECT_DIR=%~dp0"
set "LOG_DIR=%PROJECT_DIR%logs"
set "LOG_FILE=%LOG_DIR%\update_%date:~0,4%-%date:~5,2%-%date:~8,2%.log"
set "PYTHON_CMD=python"

REM 创建日志目录
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM 日志函数
echo [========================================] > "%LOG_FILE%"
echo [AI方舟] 数据自动更新脚本启动 >> "%LOG_FILE%"
echo [时间] %date% %time% >> "%LOG_FILE%"
echo [========================================] >> "%LOG_FILE%"

echo.
echo ========================================
echo   AI方舟 - 数据自动更新
echo ========================================
echo.

REM 1. 检查 Python
echo [1/5] 检查 Python 环境...
echo [1/5] 检查 Python 环境... >> "%LOG_FILE%"
%PYTHON_CMD% --version >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ Python 未找到
    echo [错误] Python 未找到 >> "%LOG_FILE%"
    pause
    exit /b 1
)
echo   ✅ Python 已就绪

REM 2. 进入项目目录
echo [2/5] 切换到项目目录...
echo [2/5] 切换到项目目录: %PROJECT_DIR% >> "%LOG_FILE%"
cd /d "%PROJECT_DIR%"

REM 3. 拉取最新代码（如果有远程更新）
echo [3/5] 拉取远程更新...
echo [3/5] 拉取远程更新 >> "%LOG_FILE%"
git fetch origin main >> "%LOG_FILE%" 2>&1
git merge origin/main --no-edit >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  合并远程更新时出现冲突，请手动处理
    echo [警告] 合并冲突 >> "%LOG_FILE%"
)

REM 4. 运行 GitHub 数据抓取
echo [4/5] 抓取 GitHub Trending 数据...
echo [4/5] 开始抓取 GitHub Trending >> "%LOG_FILE%"

echo   正在抓取 GitHub Trending...
%PYTHON_CMD% scraper/github_scraper_en.py >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  GitHub 抓取出错，继续尝试合并...
    echo [警告] GitHub 抓取出错 >> "%LOG_FILE%"
) else (
    echo   ✅ GitHub 数据抓取完成
)

REM 5. 合并数据
echo [5/5] 合并数据...
echo [5/5] 合并数据 >> "%LOG_FILE%"

%PYTHON_CMD% scraper/merge_github_data.py >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ 数据合并失败
    echo [错误] 数据合并失败 >> "%LOG_FILE%"
    goto ERROR
)
echo   ✅ 数据合并完成

REM 6. 检查数据是否有更新
echo.
echo [6/6] 检查更新状态...
echo [6/6] 检查更新状态 >> "%LOG_FILE%"

git status --porcelain >> "%LOG_FILE%" 2>&1
if exist "dist\toolsData.json" (
    for %%I in (dist\toolsData.json) do set "FILE_SIZE=%%~zI"
    echo   数据文件大小: %FILE_SIZE% bytes
    echo [数据] toolsData.json 大小: %FILE_SIZE% bytes >> "%LOG_FILE%"
)

REM 7. 提交并推送
echo.
echo [7/7] 提交并推送到远程...
echo [7/7] 提交并推送 >> "%LOG_FILE%"

git add -A
if errorlevel 1 (
    echo   ❌ Git add 失败
    echo [错误] Git add 失败 >> "%LOG_FILE%"
    goto ERROR
)

REM 生成提交消息
set "COMMIT_MSG=chore: 自动更新数据 %date:~0,4%-%date:~5,2%-%date:~8,2%"
echo   提交消息: %COMMIT_MSG%
echo [提交] %COMMIT_MSG% >> "%LOG_FILE%"

git commit -m "%COMMIT_MSG%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ⚠️  没有需要更新的内容或提交失败
    echo [信息] 无新提交 >> "%LOG_FILE%"
    goto SUCCESS
)

git push origin main >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo   ❌ Git push 失败
    echo [错误] Git push 失败 >> "%LOG_FILE%"
    goto ERROR
)

echo   ✅ 已推送到远程仓库

:SUCCESS
echo.
echo ========================================
echo   ✅ 数据更新完成！
echo ========================================
echo.
echo 下一步：1Panel 服务器会自动拉取最新代码
echo 日志文件: %LOG_FILE%
echo.

echo [完成] 数据更新成功 >> "%LOG_FILE%"
echo [时间] %date% %time% >> "%LOG_FILE%"
goto END

:ERROR
echo.
echo ========================================
echo   ❌ 更新过程中出现错误
echo ========================================
echo 请查看日志: %LOG_FILE%
echo.

echo [错误] 更新失败 >> "%LOG_FILE%"
echo [时间] %date% %time% >> "%LOG_FILE%"
pause
exit /b 1

:END
endlocal
exit /b 0
