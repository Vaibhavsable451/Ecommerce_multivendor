# Fix curly quotes in TypeScript files
$files = Get-ChildItem -Path "src" -Include *.ts,*.tsx -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace curly single quotes with straight quotes
    $content = $content -replace [char]0x2018, [char]0x0027  # ' to '
    $content = $content -replace [char]0x2019, [char]0x0027  # ' to '
    
    # Replace curly double quotes with straight quotes
    $content = $content -replace [char]0x201C, [char]0x0022  # " to "
    $content = $content -replace [char]0x201D, [char]0x0022  # " to "
    
    if ($content -ne $originalContent) {
        Write-Host "Fixing quotes in: $($file.FullName)"
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "Done fixing quotes!"
