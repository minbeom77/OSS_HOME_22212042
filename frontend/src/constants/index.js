export const COLORS = {
  primary: "#BA7517",
  primaryDark: "#8E5912",
  primaryLight: "#F7E6D0",
  teal: "#4A7047",
  tealLight: "#E9F0E8",
  coral: "#D85A30",
  coralLight: "#FAECE7",
  amber: "#D4A373",
  amberLight: "#FAEDCD",
  gray50: "#FCF9F2",
  gray200: "#E9E4D9",
  gray400: "#B0A996",
  text: "#3D3A33",
  textMuted: "#7A7466",
};

export const SHADOWS = {
  trendy: "0 10px 25px rgba(0, 0, 0, 0.05)",
};

export const MIN_WAGE = 10320;

export const TOOLS = [
  { id: "frypan", label: "프라이팬", icon: "🍳", cost: 150 },
  { id: "pot", label: "냄비", icon: "🍲", cost: 200 },
  { id: "airfryer", label: "에어프라이어", icon: "💨", cost: 400 },
  { id: "spoon", label: "조리도구 세트", icon: "🥄", cost: 50 },
];

export const CAT_ICONS = {
  한식: "🍚",
  일식: "🍣",
  중식: "🥢",
  양식: "🍝",
  프랜차이즈: "⏱️",
};

export const MENU_DATA = {
  한식: {
    "찌개/국/덮밥": [
      { name: "제육볶음", type: "ALL", deliveryPrice: 9000, minOrder: 12000, ingredientCost: 3500, cookMin: 15 },
      { name: "된장찌개", type: "ALL", deliveryPrice: 7000, minOrder: 12000, ingredientCost: 2500, cookMin: 20 },
      { name: "김치찌개", type: "ALL", deliveryPrice: 7500, minOrder: 12000, ingredientCost: 2500, cookMin: 20 },
      { name: "비빔밥", type: "ALL", deliveryPrice: 8500, minOrder: 12000, ingredientCost: 3000, cookMin: 15 },
    ],
    "족발": [
      { name: "전통 족발", type: "DELIVERY_ONLY", deliveryPrice: 30000, minOrder: 25000, hasPortion: true },
      { name: "불족발", type: "DELIVERY_ONLY", deliveryPrice: 33000, minOrder: 25000, hasPortion: true },
      { name: "마늘족발", type: "DELIVERY_ONLY", deliveryPrice: 33000, minOrder: 25000, hasPortion: true }
    ],
    "보쌈": [
      { name: "1인 보쌈도시락", type: "DELIVERY_ONLY", deliveryPrice: 18900, minOrder: 15000 },
      { name: "명품 보쌈", type: "DELIVERY_ONLY", deliveryPrice: 30900, minOrder: 15000, hasPortion: true }
    ]
  },
  일식: {
    "식사류": [
      { name: "카레라이스", type: "ALL", deliveryPrice: 8000, minOrder: 15000, ingredientCost: 2000, cookMin: 15 },
      { name: "연어덮밥", type: "ALL", deliveryPrice: 13000, minOrder: 15000, ingredientCost: 6000, cookMin: 10 },
      { name: "미소된장국", type: "ALL", deliveryPrice: 6000, minOrder: 15000, ingredientCost: 1500, cookMin: 10 },
      { name: "라멘", type: "NO_COOKING", deliveryPrice: 11000, minOrder: 15000, kitPrice: 8000, cookMin: 10 }
    ],
    "초밥": {
      "연어초밥": [
        { name: "연어초밥 10p", type: "DELIVERY_ONLY", deliveryPrice: 15000, minOrder: 15000 },
        { name: "연어초밥 12p", type: "DELIVERY_ONLY", deliveryPrice: 17000, minOrder: 15000 }
      ],
      "모둠초밥": [
        { name: "모둠초밥 10p", type: "DELIVERY_ONLY", deliveryPrice: 13000, minOrder: 15000 },
        { name: "모둠초밥 12p", type: "DELIVERY_ONLY", deliveryPrice: 15000, minOrder: 15000 }
      ],
      "광어초밥": [
        { name: "광어초밥 10p", type: "DELIVERY_ONLY", deliveryPrice: 15000, minOrder: 15000 },
        { name: "광어초밥 12p", type: "DELIVERY_ONLY", deliveryPrice: 17000, minOrder: 15000 }
      ]
    }
  },
  중식: {

    "식사": [
      { name: "짜장면", type: "ALL", deliveryPrice: 7000, minOrder: 10000, hasNoodleOpt: true, ingredientCost: 2500, cookMin: 12 },
      { name: "짬뽕", type: "ALL", deliveryPrice: 8000, minOrder: 10000, hasNoodleOpt: true, ingredientCost: 3000, cookMin: 15 },
      { name: "해물짬뽕 / 불짬뽕", type: "ALL", deliveryPrice: 9000, minOrder: 10000, hasNoodleOpt: true, ingredientCost: 3500, cookMin: 15 },
      { name: "차돌박이짬뽕", type: "ALL", deliveryPrice: 10000, minOrder: 10000, hasNoodleOpt: true, ingredientCost: 4000, cookMin: 15 },
      { name: "간짜장", type: "ALL", deliveryPrice: 8000, minOrder: 10000, hasNoodleOpt: true, ingredientCost: 3000, cookMin: 12 },
      { name: "볶음밥", type: "ALL", deliveryPrice: 8000, minOrder: 10000, ingredientCost: 2000, cookMin: 10 }
    ],

    "요리": [
      { name: "깐풍기", type: "DELIVERY_ONLY", deliveryPrice: 30000, minOrder: 10000 },
      { name: "군만두 8개", type: "DELIVERY_ONLY", deliveryPrice: 5500, minOrder: 10000 },
      { name: "탕수육", type: "NO_COOKING", deliveryPrice: 15000, minOrder: 10000, hasPortion: true, kitPrice: 10000, cookMin: 15 }
    ]
  },
  양식: {
    "스파게티/기타": [
      { name: "토마토 파스타", type: "ALL", deliveryPrice: 11000, minOrder: 10000, ingredientCost: 3000, cookMin: 12 },
      { name: "크림 파스타", type: "ALL", deliveryPrice: 12500, minOrder: 10000, ingredientCost: 3500, cookMin: 12 },
      { name: "리조또", type: "ALL", deliveryPrice: 13000, minOrder: 10000, ingredientCost: 4000, cookMin: 15 },
      { name: "샐러드", type: "ALL", deliveryPrice: 9000, minOrder: 10000, ingredientCost: 2500, cookMin: 5 },
      { name: "스테이크", type: "NO_COOKING", deliveryPrice: 28000, minOrder: 10000, kitPrice: 18000, cookMin: 15 }
    ]
  },
  프랜차이즈: {
    치킨: {
      BBQ: [
        { name: "황금올리브", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "황올 반 + 양념 반", type: "DELIVERY_ONLY", deliveryPrice: 26000, minOrder: 16000, hasChickenOpt: true },
        { name: "자메이카 통다리구이", type: "DELIVERY_ONLY", deliveryPrice: 26000, minOrder: 16000 }
      ],
      처갓집: [
        { name: "슈프림", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "후라이드", type: "DELIVERY_ONLY", deliveryPrice: 22000, minOrder: 16000, hasChickenOpt: true },
        { name: "치즈슈프림", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "허니올리고당야채양념", type: "DELIVERY_ONLY", deliveryPrice: 24000, minOrder: 16000, hasChickenOpt: true }
        
      ],
      자담치킨: [
        { name: "맵슐랭", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 22000, hasChickenOpt: true },
        { name: "후라이드", type: "DELIVERY_ONLY", deliveryPrice: 23000, minOrder: 22000, hasChickenOpt: true },
        { name: "양념", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 22000, hasChickenOpt: true },
        { name: "핫후라이드", type: "DELIVERY_ONLY", deliveryPrice: 24000, minOrder: 22000, hasChickenOpt: true }
      ],
      네네치킨: [
        { name: "후라이드", type: "DELIVERY_ONLY", deliveryPrice: 22000, minOrder: 16000, hasChickenOpt: true },
        { name: "스노윙", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "매콤 치즈 스노윙", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "쇼킹핫", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true },
        { name: "양념치킨", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 16000, hasChickenOpt: true }
      ],
      BHC: [
        { name: "뿌링클", type: "DELIVERY_ONLY", deliveryPrice: 23000, minOrder: 16000, hasChickenOpt: true },
        { name: "맛쵸킹", type: "DELIVERY_ONLY", deliveryPrice: 23000, minOrder: 16000, hasChickenOpt: true },
        { name: "핫후라이드", type: "DELIVERY_ONLY", deliveryPrice: 23000, minOrder: 16000, hasChickenOpt: true }
      ],
      굽네치킨: [
        { name: "고추바사삭", type: "DELIVERY_ONLY", deliveryPrice: 21900, minOrder: 16000, hasChickenOpt: true },
        { name: "굽네 오리지널", type: "DELIVERY_ONLY", deliveryPrice: 19900, minOrder: 16000, hasChickenOpt: true },
        { name: "볼케이노", type: "DELIVERY_ONLY", deliveryPrice: 21900, minOrder: 16000, hasChickenOpt: true }
      ],
      후참잘: [
        { name: "후라이드", type: "DELIVERY_ONLY", deliveryPrice: 18000, minOrder: 14000, hasChickenOpt: true },
        { name: "양념", type: "DELIVERY_ONLY", deliveryPrice: 19000, minOrder: 14000, hasChickenOpt: true },
        { name: "간장", type: "DELIVERY_ONLY", deliveryPrice: 19000, minOrder: 14000, hasChickenOpt: true }
      ],
      지코바: [
        { name: "순살 양념구이", type: "DELIVERY_ONLY", deliveryPrice: 23500, minOrder: 16000 },
        { name: "순살 소금구이", type: "DELIVERY_ONLY", deliveryPrice: 23500, minOrder: 16000 }
      ]
    },
    피자: {
      반올림피자: [
        { name: "콤비네이션", type: "DELIVERY_ONLY", deliveryPrice: 18900, minOrder: 15000, hasPizzaOpt: true },
        { name: "페페로니", type: "DELIVERY_ONLY", deliveryPrice: 18900, minOrder: 15000, hasPizzaOpt: true },
        { name: "반올림고구마", type: "DELIVERY_ONLY", deliveryPrice: 22900, minOrder: 15000, hasPizzaOpt: true },
        { name: "치즈후라이", type: "DELIVERY_ONLY", deliveryPrice: 22900, minOrder: 15000, hasPizzaOpt: true }
      ],
      도미노피자: [
        { name: "포테이토", type: "DELIVERY_ONLY", deliveryPrice: 27900, minOrder: 19000 },
        { name: "리얼불고기", type: "DELIVERY_ONLY", deliveryPrice: 29900, minOrder: 19000 },
        { name: "슈퍼디럭스", type: "DELIVERY_ONLY", deliveryPrice: 28900, minOrder: 19000 },
        { name: "베이컨체더치즈", type: "DELIVERY_ONLY", deliveryPrice: 27900, minOrder: 19000 }
      ],
      백보이피자: [
        { name: "오마이갓 페페로니", type: "DELIVERY_ONLY", deliveryPrice: 17900, minOrder: 16000, hasPizzaOpt: true },
        { name: "달달구리 꿀통고구마", type: "DELIVERY_ONLY", deliveryPrice: 18900, minOrder: 16000, hasPizzaOpt: true },
        { name: "더블체다불고기", type: "DELIVERY_ONLY", deliveryPrice: 20900, minOrder: 16000, hasPizzaOpt: true },
        { name: "치즈 피자", type: "DELIVERY_ONLY", deliveryPrice: 17900, minOrder: 16000, hasPizzaOpt: true },
        { name: "체다 콘치즈", type: "DELIVERY_ONLY", deliveryPrice: 18900, minOrder: 16000, hasPizzaOpt: true }
      ],
      피자에땅: [
        { name: "불고기", type: "DELIVERY_ONLY", deliveryPrice: 21900, minOrder: 15000, hasPizzaOpt: true },
        { name: "고구마", type: "DELIVERY_ONLY", deliveryPrice: 20900, minOrder: 15000, hasPizzaOpt: true },
        { name: "수퍼수프림", type: "DELIVERY_ONLY", deliveryPrice: 21900, minOrder: 15000, hasPizzaOpt: true },
        { name: "달콤 호구마", type: "DELIVERY_ONLY", deliveryPrice: 21900, minOrder: 15000, hasPizzaOpt: true },
        { name: "페페로니", type: "DELIVERY_ONLY", deliveryPrice: 20900, minOrder: 15000, hasPizzaOpt: true },
        { name: "달 피자", type: "DELIVERY_ONLY", deliveryPrice: 25900, minOrder: 15000, hasPizzaOpt: true },
        { name: "크림치즈포테이토", type: "DELIVERY_ONLY", deliveryPrice: 25900, minOrder: 15000, hasPizzaOpt: true }
      ]
    },
    분식: {
      
      신전떡볶이: [
        { name: "신전 떡볶이", type: "ALL", deliveryPrice: 4500, minOrder: 14000, kitPrice: 3900, cookMin: 10 },
        { name: "신전 순대", type: "DELIVERY_ONLY", deliveryPrice: 4500, minOrder: 14000 },
        { name: "치즈떡볶이", type: "ALL", deliveryPrice: 6500, minOrder: 14000, kitPrice: 5500, cookMin: 12 },
        { name: "튀김오뎅 5개", type: "DELIVERY_ONLY", deliveryPrice: 2000, minOrder: 14000 },
        { name: "로제떡볶이", type: "ALL", deliveryPrice: 6500, minOrder: 14000, kitPrice: 5500, cookMin: 12 },
        { name: "마라로제떡볶이", type: "ALL", deliveryPrice: 7500, minOrder: 14000, kitPrice: 6500, cookMin: 15 },
        { name: "야채튀김 2개", type: "DELIVERY_ONLY", deliveryPrice: 2800, minOrder: 14000 },
        { name: "고추튀김 2개", type: "DELIVERY_ONLY", deliveryPrice: 2800, minOrder: 14000 },
        { name: "모둠튀김", type: "DELIVERY_ONLY", deliveryPrice: 5200, minOrder: 14000 },
        { name: "잡채말이 3개", type: "DELIVERY_ONLY", deliveryPrice: 2000, minOrder: 14000 },
        { name: "김말이 3개", type: "DELIVERY_ONLY", deliveryPrice: 2000, minOrder: 14000 },
        { name: "치즈스틱 3개", type: "DELIVERY_ONLY", deliveryPrice: 2000, minOrder: 14000 },
        { name: "납작만두 5개", type: "DELIVERY_ONLY", deliveryPrice: 2200, minOrder: 14000 },
        { name: "해쉬브라운 2개", type: "DELIVERY_ONLY", deliveryPrice: 2800, minOrder: 14000 },
        { name: "신전김밥", type: "DELIVERY_ONLY", deliveryPrice: 3500, minOrder: 14000 },
        { name: "신전치즈김밥", type: "DELIVERY_ONLY", deliveryPrice: 4500, minOrder: 14000 },
        { name: "참치마요컵밥", type: "ALL", deliveryPrice: 4500, minOrder: 14000, ingredientCost: 1500, cookMin: 10 },
        { name: "스팸마요컵밥", type: "ALL", deliveryPrice: 4500, minOrder: 14000, ingredientCost: 1600, cookMin: 10 },
        { name: "치킨마요컵밥", type: "ALL", deliveryPrice: 4500, minOrder: 14000, ingredientCost: 1700, cookMin: 10 },
        { name: "신전 1인세트", type: "DELIVERY_ONLY", deliveryPrice: 9700, minOrder: 14000 },
        { name: "신전 전체세트", type: "DELIVERY_ONLY", deliveryPrice: 14500, minOrder: 14500 }
      ],
      엽기떡볶이: [
        { name: "동대문 엽기떡볶이", type: "NO_COOKING", deliveryPrice: 14000, minOrder: 14000, kitPrice: 11000, cookMin: 15 },
        { name: "엽떡 로제떡볶이", type: "ALL", deliveryPrice: 16000, minOrder: 14000, kitPrice: 12500, cookMin: 15 },
        { name: "엽떡 마라떡볶이", type: "ALL", deliveryPrice: 16000, minOrder: 14000, kitPrice: 13000, cookMin: 18 },
        { name: "엽떡 실속세트", type: "DELIVERY_ONLY", deliveryPrice: 17500, minOrder: 14000 },
        { name: "엽떡 베스트세트", type: "DELIVERY_ONLY", deliveryPrice: 20000, minOrder: 14000 },
        { name: "엽떡 스페셜세트", type: "DELIVERY_ONLY", deliveryPrice: 25000, minOrder: 14000 },
        { name: "엽떡 참치마요밥", type: "DELIVERY_ONLY", deliveryPrice: 3500, minOrder: 14000 },
        { name: "엽떡 주먹김밥", type: "DELIVERY_ONLY", deliveryPrice: 2000, minOrder: 14000 },
        { name: "엽떡 꿔바로우 5개", type: "DELIVERY_ONLY", deliveryPrice: 5900, minOrder: 14000 }
      ]
    },
    패스트푸드: {
      롯데리아: [
        { name: "전주비빔라이스버거세트", type: "DELIVERY_ONLY", deliveryPrice: 10900, minOrder: 13000 },
        { name: "리아 새우 베이컨 세트", type: "DELIVERY_ONLY", deliveryPrice: 9900, minOrder: 13000 },
        { name: "리아 불고기 베이컨 세트", type: "DELIVERY_ONLY", deliveryPrice: 9900, minOrder: 13000 },
        { name: "더블 클래식치즈버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 10900, minOrder: 13000 },
        { name: "더블 치킨버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9700, minOrder: 13000 },
        { name: "더블 데리버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9000, minOrder: 13000 },
        { name: "더블 한우불고기버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 16600, minOrder: 13000 },
        { name: "한우불고기버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 12600, minOrder: 13000 },
        { name: "모짜렐라인더버거베이컨세트", type: "DELIVERY_ONLY", deliveryPrice: 11700, minOrder: 13000 },
        { name: "핫크리스피치킨버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 10000, minOrder: 13000 },
        { name: "치킨버거세트", type: "DELIVERY_ONLY", deliveryPrice: 8400, minOrder: 13000 },
        { name: "데리버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 7700, minOrder: 13000 }
      ],
      KFC: [
        { name: "징거더블다운통다리세트", type: "DELIVERY_ONLY", deliveryPrice: 12100, minOrder: 13000 },
        { name: "치즈징거통다리세트", type: "DELIVERY_ONLY", deliveryPrice: 10700, minOrder: 13000 },
        { name: "징거BLT세트", type: "DELIVERY_ONLY", deliveryPrice: 10600, minOrder: 13000 },
        { name: "징거타워세트", type: "DELIVERY_ONLY", deliveryPrice: 10400, minOrder: 13000 },
        { name: "칠리징거통다리세트", type: "DELIVERY_ONLY", deliveryPrice: 10300, minOrder: 13000 },
        { name: "클래식징거통다리세트", type: "DELIVERY_ONLY", deliveryPrice: 10000, minOrder: 13000 },
        { name: "징거세트", type: "DELIVERY_ONLY", deliveryPrice: 9400, minOrder: 13000 },
        { name: "트위스터세트", type: "DELIVERY_ONLY", deliveryPrice: 7700, minOrder: 13000 }
      ],
      맘스터치: [
        { name: "싸이버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9500, minOrder: 12000 },
        { name: "딥치즈싸이버거세트", type: "DELIVERY_ONLY", deliveryPrice: 10000, minOrder: 12000 },
        { name: "언빌리버블버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 10800, minOrder: 12000 },
        { name: "화이트갈릭버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9800, minOrder: 12000 },
        { name: "화이트갈릭싸이버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 10100, minOrder: 12000 },
        { name: "딥치즈버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9700, minOrder: 12000 },
        { name: "휠레버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 9300, minOrder: 12000 },
        { name: "불고기버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 8500, minOrder: 12000 },
        { name: "통새우버거 세트", type: "DELIVERY_ONLY", deliveryPrice: 8400, minOrder: 12000 }
      ],
      버거킹: [
        { name: "통새우와퍼세트", type: "DELIVERY_ONLY", deliveryPrice: 11900, minOrder: 15000 },
        { name: "몬스터와퍼 세트", type: "DELIVERY_ONLY", deliveryPrice: 12800, minOrder: 15000 },
        { name: "콰트로치즈와퍼 세트", type: "DELIVERY_ONLY", deliveryPrice: 11900, minOrder: 15000 },
        { name: "치즈와퍼세트", type: "DELIVERY_ONLY", deliveryPrice: 11700, minOrder: 15000 },
        { name: "갈릭불고기와퍼세트", type: "DELIVERY_ONLY", deliveryPrice: 11400, minOrder: 15000 },
        { name: "와퍼세트", type: "DELIVERY_ONLY", deliveryPrice: 11100, minOrder: 15000 }
      ]
    }
  }
};