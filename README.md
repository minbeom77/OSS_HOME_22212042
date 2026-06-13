# 🏠 H.O.M.E (Hidden Opportunity Meal Economics)

<p align="center">
  <img src="./HOME_logo.png" alt="HOME Project Logo" width="400"/>
</p>

> **배달 음식과 밀키트, 직접 조리의 기회비용을 실시간으로 비교 분석해주는 웹 서비스**
> 대학생, 자취생 및 1인 가구를 위해 식비와 가사 노동 시간(설거지, 조리 시간)을 최저임금 기준 기회비용으로 환산하여 최적의 식사 선택지를 제안합니다.

---

## 1. 프로젝트 개요
본 프로젝트는 사용자가 배달 음식을 주문할 때 발생하는 총비용(음식값, 배달팁, 최소주문금액 미달 분 부족 금액 포함)과 대체재인 밀키트, 직접 조리 시의 비용을 기회비용 관점에서 실시간으로 비교·분석해 주는 웹입니다. 

---

## 2. 개발 및 실행 환경 (Tech Stack)
* **Frontend:** HTML5, CSS3, JavaScript (ES6+), React, Vite
* **Backend:** Java 17, Spring Boot 3.x, Spring Security, Spring Data JPA
* **Database:** H2 Database
* **Build Tool:** Gradle

---

## 3-1. 배포된 링크 실행 방법 (Deployment)

인터넷이 연결된 환경이라면 아래의 상용 배포 링크를 통해 서버 구동 없이 즉시 서비스를 테스트할 수 있습니다.

* **Frontend (Vercel):** https://oss-home-22212042-b86i.vercel.app/
* **Backend (Render):** https://h-o-m-e.onrender.com

>  **타임아웃 방지 안내**
> 본 서비스의 백엔드는 Render 무료 플랜으로 운영 중이며, UptimeRobot을 활용해 10분 간격으로 API를 호출하여 서버 잠듦(Sleep) 현상을 방지하고 있습니다. 접속 시 딜레이 없이 쾌적하게 이용 가능합니다.

---

## 3-2. 원클릭 자동 실행 방법 (Windows 기준)

환경 변수 세팅이 완료되었다면 복잡한 터미널 명령어 입력 없이 파일 더블클릭만으로 프론트엔드와 백엔드를 동시에 구동할 수 있습니다.

1. 프로젝트 최상단 루트 폴더에 위치한 **`start.bat`** 파일을 더블클릭하여 실행합니다.
2. 스크립트가 실행되면 **프론트엔드 라이브러리(`node_modules`) 자동 설치, 백그라운드 Gradle 프로세스 초기화, 양쪽 개발 서버 구동**까지 단 한 번에 완전히 자동으로 진행됩니다.

---

## 3-3. 수동 실행 방법 (CLI / IntelliJ IDEA 기준)

### Backend (Spring Boot) 구동
1. IntelliJ IDEA를 실행하고 `File > Open`을 통해 `backend` 폴더를 선택하여 엽니다.
2. Gradle 의존성 다운로드가 완료될 때까지 대기한 후, 메인 클래스(`Application.java`)의 ▶ Run 버튼을 클릭합니다.
* **CLI 터미널 구동 시 (프로젝트 루트 경로):**
```bash
  cd backend
  ./gradlew --stop
  ./gradlew clean bootRun
