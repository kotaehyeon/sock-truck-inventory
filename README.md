# 양말트럭 재고관리

## 최초 설정
1. `js/config.js`의 `GITHUB_OWNER`를 본인 GitHub 사용자명으로, `APP_PASSWORD`를 원하는 비밀번호로 변경
2. GitHub에서 Settings → Developer settings → Personal access tokens (fine-grained) 에서 이 저장소에 대한 **Contents: Read and write** 권한을 가진 토큰 발급
3. 앱 접속 후 잠금 해제 → 설정 화면에서 토큰 입력 후 저장 (기기별로 1회씩 필요)

## 주의
- 이 저장소는 공개(public) 저장소입니다. 비밀번호 게이트는 URL을 모르는 사람의 접근을 막는 용도일 뿐, `data/*.json` 파일은 저장소 URL을 아는 사람에게 그대로 노출됩니다.
- 재고/발주 데이터를 완전히 비공개로 하려면 비공개 저장소 + Vercel/Netlify 조합으로 전환이 필요합니다 (현재 설계 범위 밖).

## 로컬 테스트
```bash
npm test
python3 -m http.server 8080
```
