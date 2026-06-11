package com.home.backend.config;

import com.home.backend.domain.Menu;
import com.home.backend.domain.MenuType;
import com.home.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final MenuRepository menuRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (menuRepository.count() > 0) {
            log.info("[DataInitializer] 이미 DB 데이터가 존재하여 삽입을 생략합니다.");
            return;
        }

        List<Menu> menus = List.of(
            // 한식
            Menu.builder().category("한식").subCategory("찌개/국").menuName("제육볶음").menuType(MenuType.ALL).deliveryPrice(9000).minOrder(12000).ingredientCost(4800).defaultCookMin(35).kitPrice(12500).build(),
            Menu.builder().category("한식").subCategory("찌개/국").menuName("된장찌개").menuType(MenuType.ALL).deliveryPrice(7000).minOrder(10000).ingredientCost(3200).defaultCookMin(30).kitPrice(9800).build(),
            Menu.builder().category("한식").subCategory("찌개/국").menuName("김치찌개").menuType(MenuType.ALL).deliveryPrice(7500).minOrder(10000).ingredientCost(2800).defaultCookMin(30).kitPrice(10500).build(),
            Menu.builder().category("한식").subCategory("덮밥").menuName("비빔밥").menuType(MenuType.ALL).deliveryPrice(8500).minOrder(10000).ingredientCost(3500).defaultCookMin(25).kitPrice(11000).build(),

            //일식
            Menu.builder().category("일식").subCategory("덮밥").menuName("카레라이스").menuType(MenuType.ALL).deliveryPrice(8000).minOrder(10000).ingredientCost(3000).defaultCookMin(25).kitPrice(9500).build(),
            Menu.builder().category("일식").subCategory("덮밥").menuName("연어덮밥").menuType(MenuType.ALL).deliveryPrice(13000).minOrder(15000).ingredientCost(6500).defaultCookMin(20).kitPrice(14500).build(),
            Menu.builder().category("일식").subCategory("찌개/국").menuName("미소된장국").menuType(MenuType.ALL).deliveryPrice(6000).minOrder(8000).ingredientCost(1500).defaultCookMin(20).kitPrice(7500).build(),
            Menu.builder().category("일식").subCategory("면").menuName("라멘").menuType(MenuType.NO_COOKING).deliveryPrice(11000).minOrder(12000).kitPrice(8900).build(),

            // 양식
            Menu.builder().category("양식").subCategory("파스타").menuName("토마토 파스타").menuType(MenuType.ALL).deliveryPrice(11000).minOrder(12000).ingredientCost(4200).defaultCookMin(30).kitPrice(12000).build(),
            Menu.builder().category("양식").subCategory("파스타").menuName("크림 파스타").menuType(MenuType.ALL).deliveryPrice(12500).minOrder(13000).ingredientCost(4800).defaultCookMin(30).kitPrice(13500).build(),
            Menu.builder().category("양식").subCategory("리조또").menuName("리조또").menuType(MenuType.ALL).deliveryPrice(13000).minOrder(15000).ingredientCost(5000).defaultCookMin(30).kitPrice(14000).build(),
            Menu.builder().category("양식").subCategory("샐러드").menuName("샐러드").menuType(MenuType.ALL).deliveryPrice(9000).minOrder(10000).ingredientCost(3500).defaultCookMin(15).kitPrice(10000).build(),
            Menu.builder().category("양식").subCategory("스테이크").menuName("스테이크").menuType(MenuType.NO_COOKING).deliveryPrice(28000).minOrder(30000).kitPrice(22000).build(),

            // 치킨 전 품목
            Menu.builder().category("프랜차이즈").subCategory("BBQ").menuName("황금올리브").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("BBQ").menuName("황올 반 + 양념 반").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(26000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("BBQ").menuName("자메이카 통다리구이").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(26000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("처갓집").menuName("슈프림").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("처갓집").menuName("후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(22000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("처갓집").menuName("치즈슈프림").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("처갓집").menuName("허니올리고당야채양념").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(24000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("자담치킨").menuName("맵슐랭").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("자담치킨").menuName("후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("자담치킨").menuName("양념").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("자담치킨").menuName("핫후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(24000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("네네치킨").menuName("후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(22000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("네네치킨").menuName("스노윙").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("네네치킨").menuName("매콤 치즈 스노윙").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("네네치킨").menuName("쇼킹핫").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("네네치킨").menuName("양념치킨").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("BHC").menuName("뿌링클").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("BHC").menuName("맛쵸킹").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("BHC").menuName("핫후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23000).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("굽네치킨").menuName("고추바사삭").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(21900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("굽네치킨").menuName("굽네 오리지널").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(19900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("굽네치킨").menuName("볼케이노").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(21900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("후참잘").menuName("후라이드").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("후참잘").menuName("양념").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(19000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("후참잘").menuName("간장").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(19000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("지코바").menuName("순살 양념구이").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23500).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("지코바").menuName("순살 소금구이").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(23500).minOrder(16000).build(),
            // 피자 전 품목
            Menu.builder().category("프랜차이즈").subCategory("반올림피자").menuName("콤비네이션").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("반올림피자").menuName("페페로니").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("반올림피자").menuName("반올림고구마").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(22900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("반올림피자").menuName("치즈후라이").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(22900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("도미노피자").menuName("포테이토").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(27900).minOrder(19000).build(),
            Menu.builder().category("프랜차이즈").subCategory("도미노피자").menuName("리얼불고기").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(29900).minOrder(19000).build(),
            Menu.builder().category("프랜차이즈").subCategory("도미노피자").menuName("슈퍼디럭스").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(28900).minOrder(19000).build(),
            Menu.builder().category("프랜차이즈").subCategory("도미노피자").menuName("베이컨체더치즈").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(27900).minOrder(19000).build(),
            Menu.builder().category("프랜차이즈").subCategory("백보이피자").menuName("오마이갓 페페로니").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(17900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("백보이피자").menuName("달달구리 꿀통고구마").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("백보이피자").menuName("더블체다불고기").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(20900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("백보이피자").menuName("치즈 피자").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(17900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("백보이피자").menuName("체다 콘치즈").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18900).minOrder(16000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("불고기").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(21900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("고구마").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(20900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("수퍼수프림").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(21900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("달콤 호구마").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(21900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("페페로니").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(20900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("달 피자").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("피자에땅").menuName("크림치즈포테이토").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25900).minOrder(15000).build(),

            // 분식 전 품목
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전 떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(4500).minOrder(12000).kitPrice(3900).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전 순대").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(4500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("치즈떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(6500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("튀김오뎅 5개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2000).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("로제떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(6500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("마라로제떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(7500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("야채튀김 2개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2800).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("고추튀김 2개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2800).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("모둠튀김").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(5200).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("잡채말이 3개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2000).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("김말이 3개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2000).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("치즈스틱 3개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2000).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("납작만두 5개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2200).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("해쉬브라운 2개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2800).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전김밥").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(3500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전치즈김밥").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(4500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("참치마요컵밥").menuType(MenuType.ALL).deliveryPrice(4500).minOrder(12000).ingredientCost(1500).defaultCookMin(10).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("스팸마요컵밥").menuType(MenuType.ALL).deliveryPrice(4500).minOrder(12000).ingredientCost(1600).defaultCookMin(10).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("치킨마요컵밥").menuType(MenuType.ALL).deliveryPrice(4500).minOrder(12000).ingredientCost(1700).defaultCookMin(10).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전 1인세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9700).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("신전떡볶이").menuName("신전 전체세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(14500).minOrder(14500).build(),
            
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("동대문 엽기떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(14000).minOrder(14000).kitPrice(11000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 로제떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(16000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 마라떡볶이").menuType(MenuType.NO_COOKING).deliveryPrice(16000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 실속세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(17500).minOrder(17500).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 베스트세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(20000).minOrder(20000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 스페셜세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(25000).minOrder(25000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 참치마요밥").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(3500).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 주먹김밥").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(2000).minOrder(14000).build(),
            Menu.builder().category("프랜차이즈").subCategory("엽기떡볶이").menuName("엽떡 꿔바로우 5개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(5900).minOrder(14000).build(),

            // 패스트푸드 전 품목
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("전주비빔라이스버거세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10900).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("리아 새우 베이컨 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9900).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("리아 불고기 베이컨 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9900).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("더블 클래식치즈버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10900).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("더블 치킨버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9700).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("더블 데리버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9000).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("더블 한우불고기버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(16600).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("한우불고기버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(12600).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("모짜렐라인더버거베이컨세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11700).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("핫크리스피치킨버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10000).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("치킨버거세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(8400).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("롯데리아").menuName("데리버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(7700).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("징거더블다운통다리세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(12100).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("치즈징거통다리세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10700).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("징거BLT세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10600).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("징거타워세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10400).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("칠리징거통다리세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10300).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("클래식징거통다리세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10000).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("징거세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9400).minOrder(13000).build(),
            Menu.builder().category("프랜차이즈").subCategory("KFC").menuName("트위스터세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(7700).minOrder(13000).build(),
            
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("싸이버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("딥치즈싸이버거세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10000).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("언빌리버블버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10800).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("화이트갈릭버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9800).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("화이트갈릭싸이버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(10100).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("딥치즈버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9700).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("휠레버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(9300).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("불고기버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(8500).minOrder(12000).build(),
            Menu.builder().category("프랜차이즈").subCategory("맘스터치").menuName("통새우버거 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(8400).minOrder(12000).build(),
            
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("통새우와퍼세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("몬스터와퍼 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(12800).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("콰트로치즈와퍼 세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11900).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("치즈와퍼세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11700).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("갈릭불고기와퍼세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11400).minOrder(15000).build(),
            Menu.builder().category("프랜차이즈").subCategory("버거킹").menuName("와퍼세트").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(11100).minOrder(15000).build(),

            // 일식 초밥 전 품목
            Menu.builder().category("일식").subCategory("초밥").menuName("연어초밥 10p").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(15000).minOrder(15000).build(),
            Menu.builder().category("일식").subCategory("초밥").menuName("연어초밥 12p").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(17000).minOrder(15000).build(),
            Menu.builder().category("일식").subCategory("초밥").menuName("모둠초밥 10p").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(13000).minOrder(15000).build(),
            Menu.builder().category("일식").subCategory("초밥").menuName("모둠초밥 12p").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(15000).minOrder(15000).build(),
            Menu.builder().category("일식").subCategory("초밥").menuName("광어초밥").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(17000).minOrder(17000).build(),

            // 중식 전 품목
            Menu.builder().category("중식").subCategory("면").menuName("짜장면").menuType(MenuType.ALL).deliveryPrice(7000).minOrder(10000).kitPrice(5500).ingredientCost(3500).defaultCookMin(20).build(),
            Menu.builder().category("중식").subCategory("면").menuName("짬뽕").menuType(MenuType.ALL).deliveryPrice(8000).minOrder(10000).kitPrice(6000).ingredientCost(4000).defaultCookMin(25).build(),
            Menu.builder().category("중식").subCategory("면").menuName("해물짬뽕 / 불짬뽕").menuType(MenuType.ALL).deliveryPrice(9000).minOrder(12000).ingredientCost(4500).defaultCookMin(25).build(),
            Menu.builder().category("중식").subCategory("면").menuName("차돌박이짬뽕").menuType(MenuType.ALL).deliveryPrice(10000).minOrder(12000).ingredientCost(5000).defaultCookMin(25).build(),
            Menu.builder().category("중식").subCategory("면").menuName("간짜장").menuType(MenuType.ALL).deliveryPrice(8000).minOrder(10000).ingredientCost(4000).defaultCookMin(25).build(),
            Menu.builder().category("중식").subCategory("볶음밥").menuName("볶음밥").menuType(MenuType.ALL).deliveryPrice(8000).minOrder(10000).ingredientCost(2000).defaultCookMin(15).build(),
            Menu.builder().category("중식").subCategory("요리").menuName("탕수육").menuType(MenuType.NO_COOKING).deliveryPrice(15000).minOrder(15000).build(),
            Menu.builder().category("중식").subCategory("요리").menuName("깐풍기").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(30000).minOrder(21000).build(),
            Menu.builder().category("중식").subCategory("요리").menuName("군만두 8개").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(5500).minOrder(10000).build(),

            // 보쌈/족발 전 품목
            Menu.builder().category("한식").subCategory("족발").menuName("전통 족발").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(30000).minOrder(25000).build(),
            Menu.builder().category("한식").subCategory("족발").menuName("불족발").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(33000).minOrder(25000).build(),
            Menu.builder().category("한식").subCategory("족발").menuName("마늘족발").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(33000).minOrder(25000).build(),
            Menu.builder().category("한식").subCategory("보쌈").menuName("1인 보쌈도시락").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(18900).minOrder(15000).build(),
            Menu.builder().category("한식").subCategory("보쌈").menuName("명품 보쌈").menuType(MenuType.DELIVERY_ONLY).deliveryPrice(30900).minOrder(25000).build()
        );

        menuRepository.saveAll(menus);
        log.info("[DataInitializer] 배민 데이터 총 {}건 누락 없이 업로드 완료!", menus.size());
    }
}