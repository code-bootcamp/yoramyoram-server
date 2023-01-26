# TEAM LOGO

<div align="center">
<img src="https://user-images.githubusercontent.com/114714566/212859073-86cb8fb4-f9d5-4630-8cf8-aa6fa107039b.png" />
</div>



# 서비스 기획의도

📌  최근 매장 내 빨대 없애기, 편의점 비닐봉투 사용금지 등 많은 기업들도 환경보호에 관심을 가지면서 

요즘 우리의 가장 큰 관심사 중 하나는 ‘쓰레기 줄이기’입니다.

저희 ‘요람요람🌎’ 도 이런 시대의 흐름에 발맞춰 쓰레기를 최소화하자는 ‘Zero-Waste’ 운동을 소비자들에게 알리고 

이를 개개인의 생활로까지 이끌어낼 수 있도록 하자는 취지를 가지고 있습니다.

팀명인 ‘요람요람’은 관용어 중에 처음부터 끝까지를 의미하는 ‘요람부터 무덤까지’라는 어구를 착안해 

한번 사용한 상품들을 버리는 것이 아니라 다시 다음 생산의 재료로 쓰는 ‘요람 to 요람’ 시스템을 만들자는 의미입니다.

저희 서비스에서는 서울지역의 제로웨이스팅 상점들을 소개시켜주고, 

제로웨이스팅 상품들을 온라인에서도 거래할 수 있는 온라인 샵을 마련함으로써 소비자들의 제로웨이스팅 생활화를 도모하고자 합니다.

<br><br>

# 팀원 소개

<img width="1154" alt="스크린샷 2023-01-17 오후 6 23 04" src="https://user-images.githubusercontent.com/114714566/212860285-5c187191-7d6e-4fc9-949d-67ca06c04f78.png">

<br><br>

# 기술 스택

<img width="1154" alt="스크린샷 2023-01-17 오후 6 23 28" src="https://user-images.githubusercontent.com/114714566/212859981-99d21754-286b-4e15-8fcf-0110058da6f5.png">

<br><br>

# ERD

<img width="1155" alt="스크린샷 2023-01-17 오후 6 23 46" src="https://user-images.githubusercontent.com/114714566/212860123-58963954-6467-4450-8e35-6ce55a9faf26.png">

<br><br>

# API DOCS

<img width="952" alt="스크린샷 2023-01-17 오후 6 31 37" src="https://user-images.githubusercontent.com/114714566/212861655-c96514a5-2105-4e05-8d9f-4c30296e7356.png">

<br><br>

# 서버 폴더구조

```
 ┣ 📂.vscode
 ┃ ┗ 📜settings.json
 ┣ 📂frontend
 ┃ ┗ 📜payment.html
 ┣ 📂src
 ┃ ┣ 📂apis
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜auth-service.interface.ts
 ┃ ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┃ ┣ 📜auth.resolver.ts
 ┃ ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┃ ┣ 📂comments
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-comment.input.ts
 ┃ ┃ ┃ ┃ ┗ 📜update-comment.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜comment.entity.ts
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜comments-service.interface.ts
 ┃ ┃ ┃ ┣ 📜comments.module.ts
 ┃ ┃ ┃ ┣ 📜comments.resolver.ts
 ┃ ┃ ┃ ┗ 📜comments.service.ts
 ┃ ┃ ┣ 📂iamport
 ┃ ┃ ┃ ┗ 📜iamport.service.ts
 ┃ ┃ ┣ 📂payment
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜payment.entity.ts
 ┃ ┃ ┃ ┣ 📂interface
 ┃ ┃ ┃ ┃ ┗ 📜payment.interface.ts
 ┃ ┃ ┃ ┣ 📜payment.module.ts
 ┃ ┃ ┃ ┣ 📜payment.resolver.ts
 ┃ ┃ ┃ ┗ 📜payment.service.ts
 ┃ ┃ ┣ 📂phone
 ┃ ┃ ┃ ┣ 📜phone.module.ts
 ┃ ┃ ┃ ┣ 📜phone.resolver.ts
 ┃ ┃ ┃ ┗ 📜phone.service.ts
 ┃ ┃ ┣ 📂productDetailImages
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜productsDetailImages-service.interface.ts
 ┃ ┃ ┃ ┣ 📜productsDetailImages.module.ts
 ┃ ┃ ┃ ┣ 📜productsDetailImages.resolver.ts
 ┃ ┃ ┃ ┗ 📜productsDetailImages.service.ts
 ┃ ┃ ┣ 📂productimages
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜productsImages-service.interface.ts
 ┃ ┃ ┃ ┣ 📜productsImages.module.ts
 ┃ ┃ ┃ ┣ 📜productsImages.resolver.ts
 ┃ ┃ ┃ ┗ 📜productsImages.service.ts
 ┃ ┃ ┣ 📂products
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-product.input.ts
 ┃ ┃ ┃ ┃ ┗ 📜update-product.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜product.entity.ts
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜products-service.interface.ts
 ┃ ┃ ┃ ┣ 📜product.module.ts
 ┃ ┃ ┃ ┣ 📜product.resolver.ts
 ┃ ┃ ┃ ┗ 📜product.service.ts
 ┃ ┃ ┣ 📂productsCart
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜createProductCart.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜productCart.entity.ts
 ┃ ┃ ┃ ┣ 📜productCart.module.ts
 ┃ ┃ ┃ ┣ 📜productCart.resolver.ts
 ┃ ┃ ┃ ┗ 📜productCart.service.ts
 ┃ ┃ ┣ 📂productsCatrgories
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜productCategory.entity.ts
 ┃ ┃ ┃ ┣ 📂interface
 ┃ ┃ ┃ ┃ ┗ 📜products-categories-service.interface.ts
 ┃ ┃ ┃ ┣ 📜productsCategories.module.ts
 ┃ ┃ ┃ ┣ 📜productsCategories.resolver.ts
 ┃ ┃ ┃ ┗ 📜productsCategories.service.ts
 ┃ ┃ ┣ 📂productsWishlists
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-productwishlist.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜productWishlist.entity.ts
 ┃ ┃ ┃ ┣ 📜productWishlist.module.ts
 ┃ ┃ ┃ ┣ 📜productWishlist.resolver.ts
 ┃ ┃ ┃ ┗ 📜productWishlist.service.ts
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-user.input.ts
 ┃ ┃ ┃ ┃ ┗ 📜update-user.input.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜users-service.interface.ts
 ┃ ┃ ┃ ┣ 📜user.module.ts
 ┃ ┃ ┃ ┣ 📜user.resolver.ts
 ┃ ┃ ┃ ┗ 📜user.service.ts
 ┃ ┣ 📂commons
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📜gql-auth.guard.ts
 ┃ ┃ ┃ ┣ 📜jwt-access.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-admin.strategy.ts
 ┃ ┃ ┃ ┣ 📜jwt-refresh.strategy.ts
 ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┗ 📜http-exception.filter.ts
 ┃ ┃ ┣ 📂graphql
 ┃ ┃ ┃ ┗ 📜schema.gql
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜context.ts
 ┃ ┣ 📜app.controller.ts
 ┃ ┣ 📜app.module.ts
 ┃ ┗ 📜main.ts
 ┣ 📂test
 ┃ ┣ 📜app.e2e-spec.ts
 ┃ ┗ 📜jest-e2e.json
 ┣ 📜.dockerignore
 ┣ 📜.env.docker
 ┣ 📜.eslintrc.js
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜cloudbuild.yaml
 ┣ 📜docker-compose.prod.yaml
 ┣ 📜docker-compose.yaml
 ┣ 📜Dockerfile
 ┣ 📜Dockerfile.prod
 ┣ 📜gcp-file-storage.json
 ┣ 📜nest-cli.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜tsconfig.build.json
 ┣ 📜tsconfig.json
 ┗ 📜yarn.lock

```

<br><br>

# .env

```

# DB INFO on DOCKER
DATABASE_TYPE
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_DATABASE

# TOKEN SECRET
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL

NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
NAVER_CALLBACK_URL

KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
KAKAO_CALLBACK_URL

IAMPORT_KEY
IAMPORT_SECRET


```
