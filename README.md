# 양말트럭 재고관리

배포된 앱: https://kotaehyeon.github.io/sock-truck-inventory/

## 최초 설정 (기기별 1회)
1. GitHub에서 Settings → Developer settings → Personal access tokens (fine-grained) 에서 이 저장소에 대한 **Contents: Read and write** 권한을 가진 토큰 발급
2. 위 배포 URL 접속 → 비밀번호(기본값은 `js/config.js`의 `APP_PASSWORD`, 설정 화면에서 변경 가능)로 잠금 해제
3. 설정 화면에서 토큰 입력 후 저장

`js/config.js`의 `GITHUB_OWNER`/`APP_PASSWORD`는 이미 실제 값으로 설정되어 있습니다. 비밀번호는 앱 안 설정 화면에서도 바꿀 수 있습니다(브라우저별로 저장되므로 기기마다 다시 설정해야 할 수 있음).

## 주의
- 이 저장소는 공개(public) 저장소입니다. 비밀번호 게이트는 URL을 모르는 사람의 접근을 막는 용도일 뿐, `data/*.json` 파일은 저장소 URL을 아는 사람에게 그대로 노출됩니다.
- 재고/발주 데이터를 완전히 비공개로 하려면 비공개 저장소 + Vercel/Netlify 조합으로 전환이 필요합니다 (현재 설계 범위 밖).

## 로컬 테스트
```bash
npm test
python3 -m http.server 8080
```
