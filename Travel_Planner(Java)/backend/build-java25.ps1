$ErrorActionPreference = 'Stop'

$backend = $PSScriptRoot
$sourceRoot = Join-Path $backend 'src'
$output = Join-Path $backend 'bin'
$libraries = Join-Path $backend 'lib\*'

New-Item -ItemType Directory -Force -Path $output | Out-Null
$sources = Get-ChildItem -Path $sourceRoot -Filter '*.java' -Recurse |
    Select-Object -ExpandProperty FullName

if (-not $sources) {
    throw "No Java sources found under $sourceRoot"
}

& javac --release 25 -cp $libraries -d $output $sources
if ($LASTEXITCODE -ne 0) {
    throw "Java compilation failed with exit code $LASTEXITCODE"
}

& java -cp "$output;$libraries" bharatyatra.main.AllPhasesTestSuite
if ($LASTEXITCODE -ne 0) {
    throw "Verification suite failed with exit code $LASTEXITCODE"
}
