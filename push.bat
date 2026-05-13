@echo off
set GIT=C:\Program Files\Git\bin\git.exe
echo [TESTE] Rodando validacao de build antes de subir...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process; npm run build"
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Build falhou! O push foi cancelado para evitar erros no Vercel.
    exit /b %ERRORLEVEL%
)
echo [SUCESSO] Build validado! Iniciando upload para o GitHub...
"%GIT%" add .
"%GIT%" commit -m "Fix: dependencias corrigidas e build validado"
"%GIT%" push origin main
echo [OK] Projeto enviado com sucesso!
