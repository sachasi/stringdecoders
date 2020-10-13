@ECHO OFF
copy %~1.js %~1.cleaned.js
prettier --write %~1.cleaned.js
