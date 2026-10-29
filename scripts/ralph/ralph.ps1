<#
.SYNOPSIS
    Ralph - Autonomous AI coding agent loop for Claude Code and Antigravity.
.DESCRIPTION
    Runs fresh AI coding instances repeatedly until all PRD stories pass.
    Memory persists via git history, progress.txt, and prd.json.
.EXAMPLE
    npm run ralph
    npm run ralph:agy
    powershell -ExecutionPolicy Bypass -File scripts/ralph/ralph.ps1 5
    powershell -ExecutionPolicy Bypass -File scripts/ralph/ralph.ps1 --tool agy 10
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$ArgsList
)

$Tool = 'claude'
$MaxIterations = 10
$Prd = $null
$Prompt = $null

$i = 0
$raw = @()
if ($ArgsList) { $raw = $ArgsList }

while ($i -lt $raw.Count) {
    $item = $raw[$i]
    if ($item -in @('--help', '-h', '-help', 'help')) {
        Write-Host "Ralph - Autonomous AI coding agent loop" -ForegroundColor Cyan
        Write-Host "`nUsage:"
        Write-Host "  npm run ralph [max_iterations]"
        Write-Host "  powershell -ExecutionPolicy Bypass -File scripts/ralph/ralph.ps1 [--tool claude|agy|amp] [max_iterations]"
        Write-Host "`nOptions:"
        Write-Host "  --tool, -Tool       AI tool to run: 'claude' (default), 'agy', 'amp'"
        Write-Host "  --max, -Max         Max iterations to run (default: 10)"
        Write-Host "  --prd, -Prd         Path to custom prd.json"
        Write-Host "  --prompt, -Prompt   Path to custom prompt template"
        exit 0
    } elseif ($item -match '^--?tool=(.+)$') {
        $Tool = $matches[1]
    } elseif ($item -in @('--tool', '-tool', '-Tool') -and ($i + 1 -lt $raw.Count)) {
        $i++
        $Tool = $raw[$i]
    } elseif ($item -in @('--max', '-max', '-MaxIterations', '-n') -and ($i + 1 -lt $raw.Count)) {
        $i++
        $MaxIterations = [int]$raw[$i]
    } elseif ($item -in @('--prd', '-prd', '-Prd') -and ($i + 1 -lt $raw.Count)) {
        $i++
        $Prd = $raw[$i]
    } elseif ($item -in @('--prompt', '-prompt', '-Prompt') -and ($i + 1 -lt $raw.Count)) {
        $i++
        $Prompt = $raw[$i]
    } elseif ($item -match '^\d+$') {
        $MaxIterations = [int]$item
    }
    $i++
}

$Tool = $Tool.ToLower().TrimStart('-')
if ($Tool -notin @('claude', 'agy', 'amp')) {
    Write-Host "[ERROR] Invalid tool '$Tool'. Must be 'claude', 'agy', or 'amp'." -ForegroundColor Red
    exit 1
}

$ErrorActionPreference = 'Stop'
$ScriptHome = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptHome "..\..")

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  Ralph - Autonomous AI Agent Loop" -ForegroundColor Cyan
Write-Host "  Project:  $ProjectRoot" -ForegroundColor Cyan
Write-Host "  Engine:   $Tool | Max Iterations: $MaxIterations" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

# 1. Resolve PRD file
$prdPath = $null
if ($Prd -and (Test-Path $Prd)) {
    $prdPath = (Resolve-Path $Prd).Path
} elseif (Test-Path "$ProjectRoot\prd.json") {
    $prdPath = "$ProjectRoot\prd.json"
} elseif (Test-Path "$ScriptHome\prd.json") {
    $prdPath = "$ScriptHome\prd.json"
}

if (-not $prdPath -or -not (Test-Path $prdPath)) {
    Write-Host "`n[!] No prd.json found in project ($ProjectRoot)." -ForegroundColor Yellow
    Write-Host "To start a Ralph run:" -ForegroundColor White
    Write-Host "  1. Run '/prd' in Claude Code or Antigravity to create tasks/prd-[feature].md" -ForegroundColor Gray
    Write-Host "  2. Run '/ralph' to convert the PRD to prd.json" -ForegroundColor Gray
    Write-Host "  Or copy the example: Copy-Item '$ScriptHome\prd.json.example' '$ProjectRoot\prd.json'`n" -ForegroundColor Gray
    exit 1
}

$workingDir = Split-Path -Parent $prdPath
$progressFile = Join-Path $workingDir "progress.txt"
$lastBranchFile = Join-Path $workingDir ".last-branch"
$archiveDir = Join-Path $workingDir "archive"

# 2. Resolve Prompt template
$promptPath = $null
if ($Prompt -and (Test-Path $Prompt)) {
    $promptPath = (Resolve-Path $Prompt).Path
} elseif ($Tool -eq 'claude' -and (Test-Path "$ScriptHome\CLAUDE.md")) {
    $promptPath = "$ScriptHome\CLAUDE.md"
} elseif ($Tool -ne 'claude' -and (Test-Path "$ScriptHome\prompt.md")) {
    $promptPath = "$ScriptHome\prompt.md"
} elseif (Test-Path "$workingDir\CLAUDE.md" -and $Tool -eq 'claude') {
    $promptPath = "$workingDir\CLAUDE.md"
} else {
    $promptPath = "$workingDir\prompt.md"
}

Write-Host "PRD:      $prdPath" -ForegroundColor Gray
Write-Host "Prompt:   $promptPath" -ForegroundColor Gray
Write-Host "Progress: $progressFile`n" -ForegroundColor Gray

# 3. Read PRD and handle auto-archiving
try {
    $prdContent = Get-Content $prdPath -Raw | ConvertFrom-Json
} catch {
    Write-Host "[ERROR] Failed to parse JSON in $($prdPath): $_" -ForegroundColor Red
    exit 1
}

$currentBranch = $prdContent.branchName
$lastBranch = ""
if (Test-Path $lastBranchFile) {
    $lastBranch = (Get-Content $lastBranchFile -Raw).Trim()
}

if ($currentBranch -and $lastBranch -and ($currentBranch -ne $lastBranch)) {
    $dateStr = (Get-Date).ToString("yyyy-MM-dd")
    $folderName = $lastBranch -replace '^ralph/', ''
    $archiveFolder = Join-Path $archiveDir "$dateStr-$folderName"

    Write-Host "[*] Branch changed ($lastBranch -> $currentBranch). Archiving previous run..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $archiveFolder -Force | Out-Null
    if (Test-Path $prdPath) { Copy-Item $prdPath -Destination $archiveFolder -Force }
    if (Test-Path $progressFile) { Copy-Item $progressFile -Destination $archiveFolder -Force }
    Write-Host "    Archived to: $archiveFolder" -ForegroundColor Green

    @"
# Ralph Progress Log
Started: $(Get-Date)
Branch: $currentBranch
---
## Codebase Patterns
- Follow project conventions in AGENTS.md
---
"@ | Set-Content $progressFile -Encoding utf8
}

if ($currentBranch) {
    $currentBranch | Set-Content $lastBranchFile -Encoding utf8
}

if (-not (Test-Path $progressFile)) {
    @"
# Ralph Progress Log
Started: $(Get-Date)
Branch: $currentBranch
---
## Codebase Patterns
- Follow project conventions in AGENTS.md
---
"@ | Set-Content $progressFile -Encoding utf8
}

# 4. Check initial stories status
$stories = @($prdContent.userStories)
$pendingCount = ($stories | Where-Object { -not $_.passes }).Count
if ($pendingCount -eq 0 -and $stories.Count -gt 0) {
    Write-Host "[OK] All $($stories.Count) stories in prd.json are already marked as passes: true!" -ForegroundColor Green
    Write-Host "Ralph has nothing left to do." -ForegroundColor White
    exit 0
}

Write-Host "Found $($stories.Count) total stories ($pendingCount pending)`n" -ForegroundColor Cyan

# 5. Autonomous Loop
$completed = $false

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host "  Ralph Iteration $i of $MaxIterations [$Tool]" -ForegroundColor Yellow
    Write-Host "===============================================================" -ForegroundColor Yellow

    $output = ""
    $promptText = Get-Content $promptPath -Raw

    if ($Tool -eq 'claude') {
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "claude.cmd"
        if (-not (Get-Command "claude.cmd" -ErrorAction SilentlyContinue)) {
            $processInfo.FileName = "claude"
        }
        $processInfo.Arguments = "--dangerously-skip-permissions --print"
        $processInfo.RedirectStandardInput = $true
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.WorkingDirectory = $workingDir

        $proc = [System.Diagnostics.Process]::Start($processInfo)
        $proc.StandardInput.Write($promptText)
        $proc.StandardInput.Close()

        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
        $proc.WaitForExit()

        $output = "$stdout`n$stderr"
        Write-Host $output
    }
    elseif ($Tool -eq 'agy') {
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "agy"
        $processInfo.Arguments = "--dangerously-skip-permissions --print `"$($promptText -replace '`"', '\`"')`""
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.WorkingDirectory = $workingDir

        $proc = [System.Diagnostics.Process]::Start($processInfo)
        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
        $proc.WaitForExit()

        $output = "$stdout`n$stderr"
        Write-Host $output
    }
    elseif ($Tool -eq 'amp') {
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "amp"
        $processInfo.Arguments = "--dangerously-allow-all"
        $processInfo.RedirectStandardInput = $true
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.WorkingDirectory = $workingDir

        $proc = [System.Diagnostics.Process]::Start($processInfo)
        $proc.StandardInput.Write($promptText)
        $proc.StandardInput.Close()

        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
        $proc.WaitForExit()

        $output = "$stdout`n$stderr"
        Write-Host $output
    }

    if ($output -match "<promise>COMPLETE</promise>") {
        $completed = $true
        Write-Host "`n[SUCCESS] Ralph received <promise>COMPLETE</promise>!" -ForegroundColor Green
        Write-Host "Completed at iteration $i of $MaxIterations.`n" -ForegroundColor Green
        break
    }

    try {
        $currentPrd = Get-Content $prdPath -Raw | ConvertFrom-Json
        $remaining = @($currentPrd.userStories | Where-Object { -not $_.passes }).Count
        if ($remaining -eq 0) {
            $completed = $true
            Write-Host "`n[SUCCESS] All stories in prd.json now have passes: true!" -ForegroundColor Green
            Write-Host "Completed at iteration $i of $MaxIterations.`n" -ForegroundColor Green
            break
        } else {
            Write-Host "[*] Iteration $i complete. $remaining stories remaining..." -ForegroundColor Cyan
        }
    } catch {
        Write-Host "[!] Could not re-read prd.json: $_" -ForegroundColor DarkGray
    }

    Start-Sleep -Seconds 2
}

if ($completed) {
    Write-Host "Ralph run finished successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n[!] Ralph reached max iterations ($MaxIterations) without completing all tasks." -ForegroundColor Yellow
    Write-Host "Check $progressFile and git log for details." -ForegroundColor White
    exit 1
}
