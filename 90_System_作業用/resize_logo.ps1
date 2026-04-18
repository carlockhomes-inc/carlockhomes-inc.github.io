Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($args[0])
$w = [int]$args[1]
$h = [int]$args[2]
$newImg = new-object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($newImg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$ms = new-object System.IO.MemoryStream
$newImg.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
[Convert]::ToBase64String($ms.ToArray())
$img.Dispose()
$newImg.Dispose()
$ms.Dispose()
