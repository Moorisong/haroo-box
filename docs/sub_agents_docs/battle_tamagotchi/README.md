# 📖 전투 다마고치 서브 에이전트 문서 목차 (Index)

본 디렉토리는 전투 다마고치 구현을 담당하는 AI 서브 에이전트가 각 모듈별 상세 스펙과 규칙을 참고하여 토큰 사용량을 최소화하며 작업할 수 있도록 개별 분리된 설계 가이드 문서들을 포함합니다.

---

## 📂 문서 구성 리스트

각 문서의 링크를 참조하여 세부적인 사양을 확인하십시오.

1.  **[01_interaction_and_stats.md](file:///docs/sub_agents_docs/battle_tamagotchi/01_interaction_and_stats.md)**
    *   기본 스탯 규칙 (행복도, 배고픔, 청결도, 용기)
    *   시간 경과에 따른 스탯 감소 및 오프라인 복원 공식
    *   기본 상호작용 (쓰다듬기, 박수치기, 책 읽어주기, 간식 주기)
    *   배고픔 수치에 따른 조르기 상태 및 대사 매핑

2.  **[02_minigames_and_walk.md](file:///docs/sub_agents_docs/battle_tamagotchi/02_minigames_and_walk.md)**
    *   산책 확률 및 보상 (획득 가능한 꽃 액세서리 확률)
    *   목욕 거부 조건 및 "비누 던지기" 미니게임 상세 스펙
    *   장애물 달리기 (횡스크롤 러너) 조작 방식 및 시간대별 스탯 보상 기준

3.  **[03_battle_system.md](file:///docs/sub_agents_docs/battle_tamagotchi/03_battle_system.md)**
    *   비동기 PvP 전투 매칭 및 24시간 제한 룰
    *   6대 전투 스킬 및 30% 확률 용기 버프 메커니즘
    *   전투력 계산 공식 및 등급별 승리 확률 테이블
    *   비굴하게 도망치기 발생 조건 및 50% 성공률 도망 결과 판정

4.  **[04_titles_and_rankings.md](file:///docs/sub_agents_docs/battle_tamagotchi/04_titles_and_rankings.md)**
    *   🐣 개체 대표 칭호 획득 스펙 (30종)
    *   🏰 가문 칭호 해금 세대 스펙
    *   4대 랭킹 정렬 방식 (최강 전사, 겁쟁이, 행복왕, 칭호왕) 및 공동 순위 처리

5.  **[05_pixel_character_system.md](file:///docs/sub_agents_docs/battle_tamagotchi/05_pixel_character_system.md)**
    *   2D 픽셀 그래픽스 표준 (48x48)
    *   4대 종족(귀염상, 기괴상, 평범상, 개성상) 분류
    *   레이어 조합 방식 (본체 + 표정 + 꽃 + 모자) 및 30,000가지 외형 변이 경우의 수

6.  **[06_death_and_family.md](file:///docs/sub_agents_docs/battle_tamagotchi/06_death_and_family.md)**
    *   스탯 0 도달 시 72시간 유예 사망 메커니즘
    *   가문 묘지 데이터 보존 스키마
    *   결혼, 후계자 맞이 및 세대 계승 흐름
    *   은퇴 조상 대상 자연사(나이별 확률) 및 사고사(랜덤 이벤트) 판정

7.  **[07_plaza_and_social.md](file:///docs/sub_agents_docs/battle_tamagotchi/07_plaza_and_social.md)**
    *   광장 조회 우선순위 노출 룰 (10마리 매칭)
    *   정확한 이름 매칭 검색 로직
    *   오늘의 외치기 작성 제한 및 매일 자정 TTL 데이터 초기화 정책

8.  **[08_pages_and_ui_ux.md](file:///docs/sub_agents_docs/battle_tamagotchi/08_pages_and_ui_ux.md)**
    *   9대 라우트별 주요 화면 구성 요소 명세
    *   캐릭터 스토리 중심 UI 설계 및 행동 제한 상태 시각화 가이드
