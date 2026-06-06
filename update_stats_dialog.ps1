# Script interactivo para actualizar stats.json localmente
$ErrorActionPreference = "Stop"
chcp 65001 > $null

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath = Join-Path $scriptDir "stats.json"

if (-not (Test-Path $jsonPath)) {
    Write-Output "Error: No se encontró el archivo stats.json en la ruta del script."
    exit
}

# Cargar estadísticas actuales
$jsonContent = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json

Write-Output "=========================================================="
Write-Output "   ACTUALIZADOR LOCAL DE ESTADÍSTICAS - CAMPOS DE RAP     "
Write-Output "=========================================================="
Write-Output "Este script te permite actualizar las métricas de tu web."
Write-Output "Introduce el nuevo valor o presiona ENTER para mantener el actual.`n"

# 1. Instagram Followers
$igVal = Read-Host "Seguidores en Instagram (Actual: $($jsonContent.instagram_followers))"
if ($igVal.Trim() -ne "") { $jsonContent.instagram_followers = $igVal }

# 2. TikTok Followers
$ttVal = Read-Host "Seguidores en TikTok (Actual: $($jsonContent.tiktok_followers))"
if ($ttVal.Trim() -ne "") { $jsonContent.tiktok_followers = $ttVal }

# 3. Facebook Likes
$fbVal = Read-Host "Seguidores en Facebook (Actual: $($jsonContent.facebook_likes))"
if ($fbVal.Trim() -ne "") { $jsonContent.facebook_likes = $fbVal }

Write-Output "`n--- Métricas del Video 1: Gona ---"
$gViews = Read-Host "Visualizaciones (Actual: $($jsonContent.videos[0].views))"
if ($gViews.Trim() -ne "") { $jsonContent.videos[0].views = $gViews }
$gLikes = Read-Host "Me gusta (Actual: $($jsonContent.videos[0].likes))"
if ($gLikes.Trim() -ne "") { $jsonContent.videos[0].likes = $gLikes }
$gComments = Read-Host "Comentarios (Actual: $($jsonContent.videos[0].comments))"
if ($gComments.Trim() -ne "") { $jsonContent.videos[0].comments = $gComments }

Write-Output "`n--- Métricas del Video 2: La Sabia Escuela ---"
$sViews = Read-Host "Visualizaciones (Actual: $($jsonContent.videos[1].views))"
if ($sViews.Trim() -ne "") { $jsonContent.videos[1].views = $sViews }
$sLikes = Read-Host "Me gusta (Actual: $($jsonContent.videos[1].likes))"
if ($sLikes.Trim() -ne "") { $jsonContent.videos[1].likes = $sLikes }
$sComments = Read-Host "Comentarios (Actual: $($jsonContent.videos[1].comments))"
if ($sComments.Trim() -ne "") { $jsonContent.videos[1].comments = $sComments }

Write-Output "`n--- Métricas del Video 3: Rap I Am ---"
$rViews = Read-Host "Visualizaciones (Actual: $($jsonContent.videos[2].views))"
if ($rViews.Trim() -ne "") { $jsonContent.videos[2].views = $rViews }
$rLikes = Read-Host "Me gusta (Actual: $($jsonContent.videos[2].likes))"
if ($rLikes.Trim() -ne "") { $jsonContent.videos[2].likes = $rLikes }
$rComments = Read-Host "Comentarios (Actual: $($jsonContent.videos[2].comments))"
if ($rComments.Trim() -ne "") { $jsonContent.videos[2].comments = $rComments }

# Guardar cambios
$newJson = ConvertTo-Json $jsonContent -Depth 10
$newJson | Out-File -FilePath $jsonPath -Encoding utf8 -Force

Write-Output "`n=========================================================="
Write-Output "¡Estadísticas guardadas con éxito en stats.json!"
Write-Output "Si tu repositorio de GitHub está conectado a Netlify, tus"
Write-Output "cambios se publicarán automáticamente en tu web."
Write-Output "=========================================================="
