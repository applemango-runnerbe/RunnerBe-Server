## ✨ERD

[aquerytool 링크](https://aquerytool.com/aquerymain/index/?rurl=e5d20677-5c8a-4c70-a285-85b0c89572bd&)

Password : a2ia76

<aquerttool 기간만료시 열람불가, 이후 이미지로 대체>

## 💻API Specification

[API 명세서 링크](https://docs.google.com/spreadsheets/d/1K3yR4ns25_ptuY9xEEvGObWE6k3PbYcziaaI26p9M7A/edit?usp=sharing)

## 📁Structure
앞에 (*)이 붙어있는 파일(or 폴더)은 추가적인 과정 이후에 생성된다.
```
├── config
│ ├── baseResponseStatus.js
│ ├── database.js
│ ├── express.js
│ ├── jwtMiddleware.js
│ ├── secret.js
│ ├── winston.js
├── * log
├── * node_modules
├── src
│ ├── app
│ │ ├── User
│ │ │ ├── userDao.js
│ │ │ ├── userController.js
│ │ │ ├── userProvider.js
│ │ │ ├── userService.js
│ │ │ ├── userRoute.js
│ │ ├── Running
│ │ │ ├── runningDao.js
│ │ │ ├── runningController.js
│ │ │ ├── runningProvider.js
│ │ │ ├── runningService.js
│ │ │ ├── runningRoute.js
│ │ ├── Posting
│ │ │ ├── postingDao.js
│ │ │ ├── postingController.js
│ │ │ ├── postingProvider.js
│ │ │ ├── postingService.js
│ │ │ ├── postingRoute.js
│ │ ├── Message
│ │ │ ├── messageDao.js
│ │ │ ├── messageController.js
│ │ │ ├── messageProvider.js
│ │ │ ├── messageService.js
│ │ │ ├── messageRoute.js

├── .gitignore
├── index.js
├── * package-lock.json
├── package.json
└── README.md
```
## ✨License
MIT License
