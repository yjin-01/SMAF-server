# 📅 SMAF
### SMAF는 Schedule Management Assist Friend 의 약자로 일정 관리를 도와주는 Flatform 입니다.

기존에 많은 일정 관리 사이트가 있지만 실제로 사용해보면서 “사용 방법이 복잡하다.”, “가입하기 전에 사용해보지 못한다.” 같은 의견이 나왔고, <br>
“불편했던 부분을 개선하고 우리끼리 새로운 사이트를 만들어보자!”는 결론에 도착하여 기획 되었습니다.

따라서 SMAF는 회원 가입 전 메인 페이지에서 간단하게 사용 방식을 체험 할 수 있으며,

직관적인 UI 를 통하여 쉽게 사용이 가능한 장점을 가진 일정 관리 Flatform 입니다.


<br/>
<br/>

# 🛠 기술 스택
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://docs.nestjs.com/assets/logo-small.svg">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/ts-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/graphql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/mysql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/restapi-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/docker-icon.svg">
<img alt= "icon" wide="60" height="60" src ="https://techstack-generator.vercel.app/kubernetes-icon.svg">
</p>

<br/>
<br/>

# 👩🏻‍💻 기능 구현
- ### User API
  - User CRUD 구현 
  - bcrypt를 이용한 비밀번호 암호화
  - JWT(accessToken/refreshToken)기반 로그인 및 로그아웃 구현
  - 회원가입을 위한 SMS 전송 및 토큰 인증 로직 구현
  - 소셜 로그인 구현(구글/카카오/네이버)

- ### Image Upload
  -  graphql-upload라이브러리를 이용한 GCP-Bucket 이미지 업로드 로직 구현

- ### Project/ Participant / Schedule API
  - CRUD 구현
  - 초대 메일 전송 로직 구현


<br/>
<br/>

# 🔎 DB ERD
<img wide="100%"  src ="https://user-images.githubusercontent.com/92343369/172282632-a8ad05b8-b499-4f95-a241-7dbd7bf2f419.png">

<br/>
<br/>

# 📝 API 명세서
<img wide="100%"  src="https://user-images.githubusercontent.com/92343369/172294039-f20e62d7-d8a1-41d2-9700-2033f2757a8c.png">
<img wide="100%" src="https://user-images.githubusercontent.com/92343369/172294341-63bb8f1d-d666-4fa3-880f-b0021ed34ce0.png">
<img wide="100%" src="https://user-images.githubusercontent.com/92343369/172294418-30257c3f-db37-4107-8175-bbfc1238e9a4.png">


<br/>
<br/>


# ⚙️ .env 설정

```
IMPORTCORS
USECORS
CORSADDRES


SQLHOST
SQLHOSTPASSWORD

ACCESSKEY
REFRESHKEY

SMS_APP_KEY
SMS_X_SECRET_KEY
SMS_SENDER

EMAIL_APPKEY
EMAIL_SECRETKEY
EMAIL_SENDER

STORAGE_KEY_FILENAME
STORAGE_PROJECT_ID
STORAGE_BUCKET

GOOGLE_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACKURL

KAKAO_API_KEY=
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET=
KAKAO_CALLBACKURL

NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
NAVER_CALLBACKURL

REDIS_URL

```


