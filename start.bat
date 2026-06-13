@echo off

title H.O.M.E Project One-Click Runner

echo ===================================================
echo  🏠 H.O.M.E 프로젝트 자동 실행 스크립트를 가동합니다.
echo ===================================================

:: 1. 프론트엔드 의존성 체크 및 실행 (새 창으로 분리)

echo ▶ [Frontend] 패키지 확인 및 개발 서버를 구동합니다...

cd frontend

if not exist node_modules (

    echo [Frontend] node_modules가 없어 패키지를 먼저 설치합니다...

    call npm install

)

start cmd /k "title Frontend Server && npm run dev"

:: 2. 백엔드 그레이들 캐시 정리 후 실행

cd ..

echo ▶ [Backend] Gradle 캐시 청소 후 서버를 가동합니다...

cd backend

echo [Backend] 백그라운드 그레이들 프로세스를 초기화합니다...

call ./gradlew --stop

echo [Backend] clean bootRun 빌드를 시작합니다...

call ./gradlew clean bootRun



pause
