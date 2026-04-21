import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Modal,
  Linking, TextInput, Alert, Image, Platform
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as ImagePicker from 'expo-image-picker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zmukgjwdrorgprxzqlka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdWtnandkcm9yZ3ByeHpxbGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTM1NTcsImV4cCI6MjA5MDk2OTU1N30.wkvf9hPPoWfP6d9L-kF8p11V4yq0tKwngypwzcvuEzA'
)

const LANGS: any = {
  ko:{ flag:'🇰🇷', name:'한국어',
    search:'장소, 도시, 음식 검색...', open:'영업중', closed:'영업종료',
    hours:'운영시간', price:'입장료/가격', review:'리뷰', writeReview:'리뷰 작성',
    submit:'등록', saving:'저장', nav_explore:'탐색', nav_ai:'AI추천',
    nav_community:'커뮤니티', nav_me:'나', nav_feed:'피드',
    mau:'목표까지', featured:'인기 추천', all_list:'전체 목록', route:'길찾기',
    subway:'지하철', bus:'버스', taxi:'택시', walk:'도보',
    time:'시간', dist:'거리', fare:'요금', open_map:'Google Maps로 열기',
    region_select:'지역 선택', all_region:'전체',
    community_title:'여행자 커뮤니티', community_sub:'로컬 맛집·숨은 명소 공유',
    write_post:'글 쓰기', best:'베스트', latest:'최신',
    food_post:'맛집', spot_post:'명소', cafe_post:'카페', free_post:'자유',
    likes:'좋아요', comments:'댓글', reply:'답글', my_posts:'내 작성글',
    no_posts:'아직 작성한 글이 없어요',
    post_title:'제목', post_content:'내용을 자유롭게 작성해주세요...',
    post_city:'도시 (선택)', post_submit:'게시하기',
    add_photo:'사진 추가', translate:'번역하기', translating:'번역 중...',
    write_reply:'답글 달기...', reply_to:'에게 답글',
    cat_all:'✨ 전체', cat_food:'🍽 맛집', cat_korean:'🇰🇷 한식', cat_bbq:'🥩 BBQ',
    cat_seafood:'🦞 해산물', cat_street:'🥟 길거리', cat_dessert:'🍡 디저트',
    cat_spot:'🏛 관광지', cat_palace:'🏯 궁궐', cat_temple:'🛕 사찰',
    cat_nature:'🏞 자연', cat_beach:'🏖 해변', cat_kpop:'🎤 K-POP',
    cat_cafe:'☕ 카페', cat_hanok:'🏡 한옥카페', cat_rooftop:'🌇 루프탑', cat_tea:'🍵 찻집',
    cat_shopping:'🛍 쇼핑', cat_mall:'🏬 복합몰', cat_beauty:'💄 뷰티', cat_kpop_goods:'💿 K-POP굿즈',
    cat_activity:'🎯 액티비티', cat_cooking:'🍳 쿠킹', cat_spa:'♨️ 찜질방', cat_night:'🌙 나이트',
    grp_food:'🍽 맛집·음식', grp_spot:'🏛 관광지·문화', grp_cafe:'☕ 카페·음료',
    grp_shopping:'🛍 쇼핑', grp_activity:'🎯 액티비티·나이트',
  },
  en:{ flag:'🇺🇸', name:'English',
    search:'Search places, city, food...', open:'Open', closed:'Closed',
    hours:'Hours', price:'Price', review:'Reviews', writeReview:'Write Review',
    submit:'Post', saving:'Save', nav_explore:'Explore', nav_ai:'AI Pick',
    nav_community:'Community', nav_me:'Me', nav_feed:'Feed',
    mau:'Goal', featured:'Top Picks', all_list:'All Places', route:'Directions',
    subway:'Subway', bus:'Bus', taxi:'Taxi', walk:'Walk',
    time:'Time', dist:'Dist', fare:'Fare', open_map:'Open in Google Maps',
    region_select:'Select Region', all_region:'All',
    community_title:'Traveler Community', community_sub:'Share local gems & hidden spots',
    write_post:'Write Post', best:'Best', latest:'Latest',
    food_post:'Food', spot_post:'Sights', cafe_post:'Café', free_post:'Free',
    likes:'Likes', comments:'Comments', reply:'Reply', my_posts:'My Posts',
    no_posts:'No posts yet',
    post_title:'Title', post_content:'Share your travel experience...',
    post_city:'City (optional)', post_submit:'Post',
    add_photo:'Add Photo', translate:'Translate', translating:'Translating...',
    write_reply:'Write a reply...', reply_to:'Reply to',
    cat_all:'✨ All', cat_food:'🍽 Food', cat_korean:'🇰🇷 Korean', cat_bbq:'🥩 BBQ',
    cat_seafood:'🦞 Seafood', cat_street:'🥟 Street Food', cat_dessert:'🍡 Dessert',
    cat_spot:'🏛 Sights', cat_palace:'🏯 Palace', cat_temple:'🛕 Temple',
    cat_nature:'🏞 Nature', cat_beach:'🏖 Beach', cat_kpop:'🎤 K-POP',
    cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok Café', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Tea House',
    cat_shopping:'🛍 Shopping', cat_mall:'🏬 Mall', cat_beauty:'💄 Beauty', cat_kpop_goods:'💿 K-POP Goods',
    cat_activity:'🎯 Activity', cat_cooking:'🍳 Cooking', cat_spa:'♨️ Jjimjilbang', cat_night:'🌙 Nightlife',
    grp_food:'🍽 Food', grp_spot:'🏛 Sights', grp_cafe:'☕ Café',
    grp_shopping:'🛍 Shopping', grp_activity:'🎯 Activity & Night',
  },
  zh:{ flag:'🇨🇳', name:'中文',
    search:'搜索地点...', open:'营业中', closed:'已打烊',
    hours:'营业时间', price:'价格', review:'评价', writeReview:'撰写评价',
    submit:'发布', saving:'收藏', nav_explore:'探索', nav_ai:'AI推荐',
    nav_community:'社区', nav_me:'我', nav_feed:'动态',
    mau:'目标', featured:'热门推荐', all_list:'全部', route:'导航',
    subway:'地铁', bus:'公交', taxi:'出租车', walk:'步行',
    time:'时间', dist:'距离', fare:'费用', open_map:'在谷歌地图打开',
    region_select:'选择地区', all_region:'全部',
    community_title:'旅行者社区', community_sub:'分享本地美食和隐藏景点',
    write_post:'写帖子', best:'精华', latest:'最新',
    food_post:'美食', spot_post:'景点', cafe_post:'咖啡', free_post:'自由',
    likes:'推荐', comments:'评论', reply:'回复', my_posts:'我的帖子',
    no_posts:'暂无帖子',
    post_title:'标题', post_content:'分享您的旅行经历...',
    post_city:'城市（可选）', post_submit:'发布',
    add_photo:'添加图片', translate:'翻译', translating:'翻译中...',
    write_reply:'写回复...', reply_to:'回复',
    cat_all:'✨ 全部', cat_food:'🍽 美食', cat_korean:'🇰🇷 韩食', cat_bbq:'🥩 烤肉',
    cat_seafood:'🦞 海鲜', cat_street:'🥟 街头小吃', cat_dessert:'🍡 甜点',
    cat_spot:'🏛 景点', cat_palace:'🏯 宫殿', cat_temple:'🛕 寺庙',
    cat_nature:'🏞 自然', cat_beach:'🏖 海滩', cat_kpop:'🎤 K-POP',
    cat_cafe:'☕ 咖啡', cat_hanok:'🏡 韩屋咖啡', cat_rooftop:'🌇 屋顶咖啡', cat_tea:'🍵 茶馆',
    cat_shopping:'🛍 购物', cat_mall:'🏬 商场', cat_beauty:'💄 美妆', cat_kpop_goods:'💿 K-POP周边',
    cat_activity:'🎯 活动', cat_cooking:'🍳 烹饪课', cat_spa:'♨️ 汗蒸幕', cat_night:'🌙 夜生活',
    grp_food:'🍽 美食', grp_spot:'🏛 景点', grp_cafe:'☕ 咖啡',
    grp_shopping:'🛍 购物', grp_activity:'🎯 活动·夜生活',
  },
  ja:{ flag:'🇯🇵', name:'日本語',
    search:'スポット検索...', open:'営業中', closed:'閉店',
    hours:'営業時間', price:'料金', review:'レビュー', writeReview:'レビューを書く',
    submit:'投稿', saving:'保存', nav_explore:'探索', nav_ai:'AIおすすめ',
    nav_community:'コミュニティ', nav_me:'マイ', nav_feed:'フィード',
    mau:'目標まで', featured:'人気', all_list:'全スポット', route:'経路',
    subway:'地下鉄', bus:'バス', taxi:'タクシー', walk:'徒歩',
    time:'所要時間', dist:'距離', fare:'料金', open_map:'Googleマップで開く',
    region_select:'地域選択', all_region:'全て',
    community_title:'トラベラーコミュニティ', community_sub:'ローカルグルメ・穴場スポットをシェア',
    write_post:'投稿する', best:'ベスト', latest:'最新',
    food_post:'グルメ', spot_post:'観光地', cafe_post:'カフェ', free_post:'自由',
    likes:'いいね', comments:'コメント', reply:'返信', my_posts:'マイ投稿',
    no_posts:'まだ投稿がありません',
    post_title:'タイトル', post_content:'旅の体験をシェアしよう...',
    post_city:'都市（任意）', post_submit:'投稿する',
    add_photo:'写真追加', translate:'翻訳', translating:'翻訳中...',
    write_reply:'返信を書く...', reply_to:'への返信',
    cat_all:'✨ すべて', cat_food:'🍽 グルメ', cat_korean:'🇰🇷 韓食', cat_bbq:'🥩 焼肉',
    cat_seafood:'🦞 海鮮', cat_street:'🥟 屋台', cat_dessert:'🍡 スイーツ',
    cat_spot:'🏛 観光地', cat_palace:'🏯 宮殿', cat_temple:'🛕 寺院',
    cat_nature:'🏞 自然', cat_beach:'🏖 ビーチ', cat_kpop:'🎤 K-POP',
    cat_cafe:'☕ カフェ', cat_hanok:'🏡 韓屋カフェ', cat_rooftop:'🌇 ルーフトップ', cat_tea:'🍵 茶館',
    cat_shopping:'🛍 ショッピング', cat_mall:'🏬 モール', cat_beauty:'💄 コスメ', cat_kpop_goods:'💿 K-POPグッズ',
    cat_activity:'🎯 体験', cat_cooking:'🍳 料理教室', cat_spa:'♨️ チムジルバン', cat_night:'🌙 ナイトライフ',
    grp_food:'🍽 グルメ', grp_spot:'🏛 観光地', grp_cafe:'☕ カフェ',
    grp_shopping:'🛍 ショッピング', grp_activity:'🎯 体験・ナイト',
  },
  tw:{ flag:'🇹🇼', name:'繁體中文', search:'搜尋地點...', open:'營業中', closed:'已打烊', hours:'營業時間', price:'價格', review:'評價', writeReview:'撰寫評價', submit:'發布', saving:'收藏', nav_explore:'探索', nav_ai:'AI推薦', nav_community:'社群', nav_me:'我', nav_feed:'動態', mau:'目標', featured:'熱門', all_list:'全部', route:'導航', subway:'地鐵', bus:'公車', taxi:'計程車', walk:'步行', time:'時間', dist:'距離', fare:'費用', open_map:'在Google地圖開啟', region_select:'選擇地區', all_region:'全部', community_title:'旅行者社群', community_sub:'分享在地美食與隱藏景點', write_post:'寫文章', best:'精華', latest:'最新', food_post:'美食', spot_post:'景點', cafe_post:'咖啡', free_post:'自由', likes:'推薦', comments:'留言', reply:'回覆', my_posts:'我的文章', no_posts:'尚無文章', post_title:'標題', post_content:'分享旅行體驗...', post_city:'城市（選填）', post_submit:'發布', add_photo:'新增圖片', translate:'翻譯', translating:'翻譯中...', write_reply:'寫回覆...', reply_to:'回覆', cat_all:'✨ 全部', cat_food:'🍽 美食', cat_korean:'🇰🇷 韓食', cat_bbq:'🥩 烤肉', cat_seafood:'🦞 海鮮', cat_street:'🥟 街頭', cat_dessert:'🍡 甜點', cat_spot:'🏛 景點', cat_palace:'🏯 宮殿', cat_temple:'🛕 寺廟', cat_nature:'🏞 自然', cat_beach:'🏖 海灘', cat_kpop:'🎤 K-POP', cat_cafe:'☕ 咖啡', cat_hanok:'🏡 韓屋', cat_rooftop:'🌇 屋頂', cat_tea:'🍵 茶館', cat_shopping:'🛍 購物', cat_mall:'🏬 商場', cat_beauty:'💄 美妝', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 活動', cat_cooking:'🍳 烹飪', cat_spa:'♨️ 汗蒸', cat_night:'🌙 夜生活', grp_food:'🍽 美食', grp_spot:'🏛 景點', grp_cafe:'☕ 咖啡', grp_shopping:'🛍 購物', grp_activity:'🎯 活動',
  },
  th:{ flag:'🇹🇭', name:'ภาษาไทย', search:'ค้นหา...', open:'เปิด', closed:'ปิด', hours:'เวลา', price:'ราคา', review:'รีวิว', writeReview:'เขียนรีวิว', submit:'โพสต์', saving:'บันทึก', nav_explore:'สำรวจ', nav_ai:'AI', nav_community:'ชุมชน', nav_me:'ฉัน', nav_feed:'ฟีด', mau:'เป้าหมาย', featured:'แนะนำ', all_list:'ทั้งหมด', route:'เส้นทาง', subway:'รถไฟ', bus:'รถบัส', taxi:'แท็กซี่', walk:'เดิน', time:'เวลา', dist:'ระยะ', fare:'ค่าโดยสาร', open_map:'เปิด Google Maps', region_select:'เลือกภูมิภาค', all_region:'ทั้งหมด', community_title:'ชุมชนนักเดินทาง', community_sub:'แชร์ร้านอาหารและสถานที่ลับ', write_post:'เขียน', best:'ยอดนิยม', latest:'ล่าสุด', food_post:'อาหาร', spot_post:'สถานที่', cafe_post:'คาเฟ่', free_post:'ทั่วไป', likes:'ถูกใจ', comments:'ความเห็น', reply:'ตอบ', my_posts:'โพสต์ของฉัน', no_posts:'ยังไม่มีโพสต์', post_title:'หัวข้อ', post_content:'แชร์ประสบการณ์...', post_city:'เมือง', post_submit:'โพสต์', add_photo:'เพิ่มรูป', translate:'แปล', translating:'กำลังแปล...', write_reply:'เขียนคำตอบ...', reply_to:'ตอบ', cat_all:'✨ ทั้งหมด', cat_food:'🍽 อาหาร', cat_korean:'🇰🇷 เกาหลี', cat_bbq:'🥩 บาร์บีคิว', cat_seafood:'🦞 ทะเล', cat_street:'🥟 ริมทาง', cat_dessert:'🍡 ของหวาน', cat_spot:'🏛 ท่องเที่ยว', cat_palace:'🏯 วัง', cat_temple:'🛕 วัด', cat_nature:'🏞 ธรรมชาติ', cat_beach:'🏖 หาด', cat_kpop:'🎤 K-POP', cat_cafe:'☕ คาเฟ่', cat_hanok:'🏡 ฮันอก', cat_rooftop:'🌇 รูฟท็อป', cat_tea:'🍵 ชา', cat_shopping:'🛍 ช้อปปิ้ง', cat_mall:'🏬 ห้าง', cat_beauty:'💄 บิวตี้', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 กิจกรรม', cat_cooking:'🍳 ทำอาหาร', cat_spa:'♨️ สปา', cat_night:'🌙 กลางคืน', grp_food:'🍽 อาหาร', grp_spot:'🏛 ท่องเที่ยว', grp_cafe:'☕ คาเฟ่', grp_shopping:'🛍 ช้อปปิ้ง', grp_activity:'🎯 กิจกรรม',
  },
  vi:{ flag:'🇻🇳', name:'Tiếng Việt', search:'Tìm kiếm...', open:'Mở', closed:'Đóng', hours:'Giờ', price:'Giá', review:'Đánh giá', writeReview:'Viết đánh giá', submit:'Đăng', saving:'Lưu', nav_explore:'Khám phá', nav_ai:'AI', nav_community:'Cộng đồng', nav_me:'Tôi', nav_feed:'Bảng tin', mau:'Mục tiêu', featured:'Nổi bật', all_list:'Tất cả', route:'Đường', subway:'Tàu', bus:'Xe buýt', taxi:'Taxi', walk:'Đi bộ', time:'Thời gian', dist:'Khoảng cách', fare:'Giá vé', open_map:'Mở Google Maps', region_select:'Chọn vùng', all_region:'Tất cả', community_title:'Cộng đồng du khách', community_sub:'Chia sẻ quán ăn & điểm ẩn', write_post:'Viết', best:'Nổi bật', latest:'Mới', food_post:'Ẩm thực', spot_post:'Địa điểm', cafe_post:'Café', free_post:'Tự do', likes:'Thích', comments:'Bình luận', reply:'Trả lời', my_posts:'Bài của tôi', no_posts:'Chưa có bài', post_title:'Tiêu đề', post_content:'Chia sẻ trải nghiệm...', post_city:'Thành phố', post_submit:'Đăng', add_photo:'Thêm ảnh', translate:'Dịch', translating:'Đang dịch...', write_reply:'Viết trả lời...', reply_to:'Trả lời', cat_all:'✨ Tất cả', cat_food:'🍽 Ẩm thực', cat_korean:'🇰🇷 Hàn', cat_bbq:'🥩 Nướng', cat_seafood:'🦞 Hải sản', cat_street:'🥟 Đường phố', cat_dessert:'🍡 Tráng miệng', cat_spot:'🏛 Điểm đến', cat_palace:'🏯 Cung', cat_temple:'🛕 Chùa', cat_nature:'🏞 Thiên nhiên', cat_beach:'🏖 Biển', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Trà', cat_shopping:'🛍 Mua sắm', cat_mall:'🏬 Mall', cat_beauty:'💄 Làm đẹp', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Hoạt động', cat_cooking:'🍳 Nấu ăn', cat_spa:'♨️ Sauna', cat_night:'🌙 Đêm', grp_food:'🍽 Ẩm thực', grp_spot:'🏛 Địa điểm', grp_cafe:'☕ Café', grp_shopping:'🛍 Mua sắm', grp_activity:'🎯 Hoạt động',
  },
  id:{ flag:'🇮🇩', name:'Indonesia', search:'Cari...', open:'Buka', closed:'Tutup', hours:'Jam', price:'Harga', review:'Ulasan', writeReview:'Tulis ulasan', submit:'Posting', saving:'Simpan', nav_explore:'Jelajahi', nav_ai:'AI', nav_community:'Komunitas', nav_me:'Saya', nav_feed:'Umpan', mau:'Target', featured:'Populer', all_list:'Semua', route:'Rute', subway:'Subway', bus:'Bus', taxi:'Taksi', walk:'Jalan', time:'Waktu', dist:'Jarak', fare:'Tarif', open_map:'Buka Google Maps', region_select:'Pilih Wilayah', all_region:'Semua', community_title:'Komunitas Wisatawan', community_sub:'Berbagi kuliner & tempat tersembunyi', write_post:'Tulis', best:'Terbaik', latest:'Terbaru', food_post:'Kuliner', spot_post:'Wisata', cafe_post:'Kafe', free_post:'Bebas', likes:'Suka', comments:'Komentar', reply:'Balas', my_posts:'Post Saya', no_posts:'Belum ada post', post_title:'Judul', post_content:'Bagikan pengalaman...', post_city:'Kota', post_submit:'Posting', add_photo:'Tambah Foto', translate:'Terjemahkan', translating:'Menerjemahkan...', write_reply:'Tulis balasan...', reply_to:'Balas', cat_all:'✨ Semua', cat_food:'🍽 Kuliner', cat_korean:'🇰🇷 Korea', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Seafood', cat_street:'🥟 Kaki Lima', cat_dessert:'🍡 Dessert', cat_spot:'🏛 Wisata', cat_palace:'🏯 Istana', cat_temple:'🛕 Kuil', cat_nature:'🏞 Alam', cat_beach:'🏖 Pantai', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Kafe', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Teh', cat_shopping:'🛍 Belanja', cat_mall:'🏬 Mall', cat_beauty:'💄 Kecantikan', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Aktivitas', cat_cooking:'🍳 Memasak', cat_spa:'♨️ Sauna', cat_night:'🌙 Malam', grp_food:'🍽 Kuliner', grp_spot:'🏛 Wisata', grp_cafe:'☕ Kafe', grp_shopping:'🛍 Belanja', grp_activity:'🎯 Aktivitas',
  },
  ms:{ flag:'🇲🇾', name:'Melayu', search:'Cari...', open:'Buka', closed:'Tutup', hours:'Masa', price:'Harga', review:'Ulasan', writeReview:'Tulis ulasan', submit:'Hantar', saving:'Simpan', nav_explore:'Terokai', nav_ai:'AI', nav_community:'Komuniti', nav_me:'Saya', nav_feed:'Suapan', mau:'Sasaran', featured:'Popular', all_list:'Semua', route:'Laluan', subway:'Subway', bus:'Bas', taxi:'Teksi', walk:'Jalan', time:'Masa', dist:'Jarak', fare:'Tambang', open_map:'Buka Google Maps', region_select:'Pilih Wilayah', all_region:'Semua', community_title:'Komuniti Pengembara', community_sub:'Kongsi restoran & tempat tersembunyi', write_post:'Tulis', best:'Terbaik', latest:'Terbaru', food_post:'Makanan', spot_post:'Tarikan', cafe_post:'Kafe', free_post:'Bebas', likes:'Suka', comments:'Komen', reply:'Balas', my_posts:'Post Saya', no_posts:'Belum ada post', post_title:'Tajuk', post_content:'Kongsi pengalaman...', post_city:'Bandar', post_submit:'Hantar', add_photo:'Tambah Foto', translate:'Terjemah', translating:'Menterjemah...', write_reply:'Tulis balasan...', reply_to:'Balas', cat_all:'✨ Semua', cat_food:'🍽 Makanan', cat_korean:'🇰🇷 Korea', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Laut', cat_street:'🥟 Tepi Jalan', cat_dessert:'🍡 Pencuci Mulut', cat_spot:'🏛 Tarikan', cat_palace:'🏯 Istana', cat_temple:'🛕 Kuil', cat_nature:'🏞 Alam', cat_beach:'🏖 Pantai', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Kafe', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Teh', cat_shopping:'🛍 Beli-belah', cat_mall:'🏬 Mall', cat_beauty:'💄 Kecantikan', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Aktiviti', cat_cooking:'🍳 Masak', cat_spa:'♨️ Sauna', cat_night:'🌙 Malam', grp_food:'🍽 Makanan', grp_spot:'🏛 Tarikan', grp_cafe:'☕ Kafe', grp_shopping:'🛍 Belanja', grp_activity:'🎯 Aktiviti',
  },
  es:{ flag:'🇪🇸', name:'Español', search:'Buscar...', open:'Abierto', closed:'Cerrado', hours:'Horario', price:'Precio', review:'Reseñas', writeReview:'Escribir reseña', submit:'Publicar', saving:'Guardar', nav_explore:'Explorar', nav_ai:'IA', nav_community:'Comunidad', nav_me:'Yo', nav_feed:'Feed', mau:'Meta', featured:'Populares', all_list:'Todos', route:'Ruta', subway:'Metro', bus:'Bus', taxi:'Taxi', walk:'A pie', time:'Tiempo', dist:'Distancia', fare:'Tarifa', open_map:'Abrir Google Maps', region_select:'Seleccionar región', all_region:'Todo', community_title:'Comunidad de viajeros', community_sub:'Comparte restaurantes y lugares secretos', write_post:'Escribir', best:'Mejor', latest:'Reciente', food_post:'Comida', spot_post:'Lugares', cafe_post:'Café', free_post:'Libre', likes:'Me gusta', comments:'Comentarios', reply:'Responder', my_posts:'Mis posts', no_posts:'Sin posts', post_title:'Título', post_content:'Comparte tu experiencia...', post_city:'Ciudad', post_submit:'Publicar', add_photo:'Añadir foto', translate:'Traducir', translating:'Traduciendo...', write_reply:'Escribe una respuesta...', reply_to:'Responder a', cat_all:'✨ Todo', cat_food:'🍽 Comida', cat_korean:'🇰🇷 Coreano', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Mariscos', cat_street:'🥟 Calle', cat_dessert:'🍡 Postre', cat_spot:'🏛 Lugares', cat_palace:'🏯 Palacio', cat_temple:'🛕 Templo', cat_nature:'🏞 Naturaleza', cat_beach:'🏖 Playa', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Azotea', cat_tea:'🍵 Té', cat_shopping:'🛍 Compras', cat_mall:'🏬 Centro', cat_beauty:'💄 Belleza', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Actividad', cat_cooking:'🍳 Cocina', cat_spa:'♨️ Sauna', cat_night:'🌙 Noche', grp_food:'🍽 Comida', grp_spot:'🏛 Lugares', grp_cafe:'☕ Café', grp_shopping:'🛍 Compras', grp_activity:'🎯 Actividad',
  },
  fr:{ flag:'🇫🇷', name:'Français', search:'Chercher...', open:'Ouvert', closed:'Fermé', hours:'Horaires', price:'Prix', review:'Avis', writeReview:'Écrire un avis', submit:'Publier', saving:'Sauver', nav_explore:'Explorer', nav_ai:'IA', nav_community:'Communauté', nav_me:'Moi', nav_feed:'Fil', mau:'Objectif', featured:'Populaires', all_list:'Tous', route:'Itinéraire', subway:'Métro', bus:'Bus', taxi:'Taxi', walk:'À pied', time:'Durée', dist:'Distance', fare:'Tarif', open_map:'Ouvrir Google Maps', region_select:'Sélectionner région', all_region:'Tout', community_title:'Communauté de voyageurs', community_sub:'Partagez restaurants et lieux cachés', write_post:'Écrire', best:'Meilleur', latest:'Récent', food_post:'Cuisine', spot_post:'Sites', cafe_post:'Café', free_post:'Libre', likes:'J\'aime', comments:'Commentaires', reply:'Répondre', my_posts:'Mes posts', no_posts:'Pas de posts', post_title:'Titre', post_content:'Partagez votre expérience...', post_city:'Ville', post_submit:'Publier', add_photo:'Ajouter photo', translate:'Traduire', translating:'Traduction...', write_reply:'Écrire une réponse...', reply_to:'Répondre à', cat_all:'✨ Tout', cat_food:'🍽 Cuisine', cat_korean:'🇰🇷 Coréen', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Fruits de mer', cat_street:'🥟 Rue', cat_dessert:'🍡 Dessert', cat_spot:'🏛 Sites', cat_palace:'🏯 Palais', cat_temple:'🛕 Temple', cat_nature:'🏞 Nature', cat_beach:'🏖 Plage', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Thé', cat_shopping:'🛍 Shopping', cat_mall:'🏬 Centre', cat_beauty:'💄 Beauté', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Activité', cat_cooking:'🍳 Cuisine', cat_spa:'♨️ Sauna', cat_night:'🌙 Nuit', grp_food:'🍽 Cuisine', grp_spot:'🏛 Sites', grp_cafe:'☕ Café', grp_shopping:'🛍 Shopping', grp_activity:'🎯 Activité',
  },
  de:{ flag:'🇩🇪', name:'Deutsch', search:'Suchen...', open:'Geöffnet', closed:'Geschlossen', hours:'Öffnungszeiten', price:'Preis', review:'Bewertungen', writeReview:'Bewertung schreiben', submit:'Posten', saving:'Speichern', nav_explore:'Entdecken', nav_ai:'KI', nav_community:'Community', nav_me:'Ich', nav_feed:'Feed', mau:'Ziel', featured:'Beliebt', all_list:'Alle', route:'Route', subway:'U-Bahn', bus:'Bus', taxi:'Taxi', walk:'Zu Fuß', time:'Zeit', dist:'Entfernung', fare:'Preis', open_map:'In Google Maps öffnen', region_select:'Region wählen', all_region:'Alle', community_title:'Reisenden-Community', community_sub:'Lokale Geheimtipps teilen', write_post:'Schreiben', best:'Beste', latest:'Neueste', food_post:'Essen', spot_post:'Sehenswürdigkeiten', cafe_post:'Café', free_post:'Frei', likes:'Gefällt mir', comments:'Kommentare', reply:'Antworten', my_posts:'Meine Posts', no_posts:'Noch keine Posts', post_title:'Titel', post_content:'Teile deine Erfahrung...', post_city:'Stadt', post_submit:'Posten', add_photo:'Foto hinzufügen', translate:'Übersetzen', translating:'Übersetze...', write_reply:'Antwort schreiben...', reply_to:'Antwort an', cat_all:'✨ Alle', cat_food:'🍽 Essen', cat_korean:'🇰🇷 Koreanisch', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Meeresfrüchte', cat_street:'🥟 Straße', cat_dessert:'🍡 Dessert', cat_spot:'🏛 Sehenwürdigkeiten', cat_palace:'🏯 Palast', cat_temple:'🛕 Tempel', cat_nature:'🏞 Natur', cat_beach:'🏖 Strand', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Rooftop', cat_tea:'🍵 Tee', cat_shopping:'🛍 Shopping', cat_mall:'🏬 Mall', cat_beauty:'💄 Beauty', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Aktivität', cat_cooking:'🍳 Kochen', cat_spa:'♨️ Sauna', cat_night:'🌙 Nacht', grp_food:'🍽 Essen', grp_spot:'🏛 Sehenswürdigkeiten', grp_cafe:'☕ Café', grp_shopping:'🛍 Shopping', grp_activity:'🎯 Aktivität',
  },
  pt:{ flag:'🇧🇷', name:'Português', search:'Buscar...', open:'Aberto', closed:'Fechado', hours:'Horário', price:'Preço', review:'Avaliações', writeReview:'Escrever avaliação', submit:'Publicar', saving:'Salvar', nav_explore:'Explorar', nav_ai:'IA', nav_community:'Comunidade', nav_me:'Eu', nav_feed:'Feed', mau:'Meta', featured:'Populares', all_list:'Todos', route:'Rota', subway:'Metrô', bus:'Ônibus', taxi:'Táxi', walk:'A pé', time:'Tempo', dist:'Distância', fare:'Tarifa', open_map:'Abrir Google Maps', region_select:'Selecionar região', all_region:'Tudo', community_title:'Comunidade de viajantes', community_sub:'Compartilhe restaurantes e lugares escondidos', write_post:'Escrever', best:'Melhor', latest:'Recente', food_post:'Gastronomia', spot_post:'Pontos', cafe_post:'Café', free_post:'Livre', likes:'Curtir', comments:'Comentários', reply:'Responder', my_posts:'Meus posts', no_posts:'Sem posts', post_title:'Título', post_content:'Compartilhe sua experiência...', post_city:'Cidade', post_submit:'Publicar', add_photo:'Adicionar foto', translate:'Traduzir', translating:'Traduzindo...', write_reply:'Escrever resposta...', reply_to:'Responder a', cat_all:'✨ Tudo', cat_food:'🍽 Gastronomia', cat_korean:'🇰🇷 Coreano', cat_bbq:'🥩 Churrasco', cat_seafood:'🦞 Frutos do mar', cat_street:'🥟 Rua', cat_dessert:'🍡 Sobremesa', cat_spot:'🏛 Pontos', cat_palace:'🏯 Palácio', cat_temple:'🛕 Templo', cat_nature:'🏞 Natureza', cat_beach:'🏖 Praia', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Café', cat_hanok:'🏡 Hanok', cat_rooftop:'🌇 Cobertura', cat_tea:'🍵 Chá', cat_shopping:'🛍 Compras', cat_mall:'🏬 Shopping', cat_beauty:'💄 Beleza', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Atividade', cat_cooking:'🍳 Culinária', cat_spa:'♨️ Sauna', cat_night:'🌙 Noite', grp_food:'🍽 Gastronomia', grp_spot:'🏛 Pontos', grp_cafe:'☕ Café', grp_shopping:'🛍 Compras', grp_activity:'🎯 Atividade',
  },
  ru:{ flag:'🇷🇺', name:'Русский', search:'Поиск...', open:'Открыто', closed:'Закрыто', hours:'Часы', price:'Цена', review:'Отзывы', writeReview:'Написать отзыв', submit:'Опубликовать', saving:'Сохранить', nav_explore:'Исследовать', nav_ai:'ИИ', nav_community:'Сообщество', nav_me:'Я', nav_feed:'Лента', mau:'Цель', featured:'Популярное', all_list:'Все', route:'Маршрут', subway:'Метро', bus:'Автобус', taxi:'Такси', walk:'Пешком', time:'Время', dist:'Расстояние', fare:'Стоимость', open_map:'Открыть Google Maps', region_select:'Выбрать регион', all_region:'Все', community_title:'Сообщество путешественников', community_sub:'Делитесь местными ресторанами', write_post:'Написать', best:'Лучшее', latest:'Новое', food_post:'Еда', spot_post:'Места', cafe_post:'Кафе', free_post:'Свободно', likes:'Нравится', comments:'Комментарии', reply:'Ответить', my_posts:'Мои посты', no_posts:'Постов нет', post_title:'Заголовок', post_content:'Поделитесь опытом...', post_city:'Город', post_submit:'Опубликовать', add_photo:'Добавить фото', translate:'Перевести', translating:'Перевожу...', write_reply:'Написать ответ...', reply_to:'Ответ', cat_all:'✨ Все', cat_food:'🍽 Еда', cat_korean:'🇰🇷 Корейская', cat_bbq:'🥩 BBQ', cat_seafood:'🦞 Морепродукты', cat_street:'🥟 Улица', cat_dessert:'🍡 Десерт', cat_spot:'🏛 Места', cat_palace:'🏯 Дворец', cat_temple:'🛕 Храм', cat_nature:'🏞 Природа', cat_beach:'🏖 Пляж', cat_kpop:'🎤 K-POP', cat_cafe:'☕ Кафе', cat_hanok:'🏡 Ханок', cat_rooftop:'🌇 Крыша', cat_tea:'🍵 Чай', cat_shopping:'🛍 Шопинг', cat_mall:'🏬 Молл', cat_beauty:'💄 Красота', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 Активности', cat_cooking:'🍳 Кулинария', cat_spa:'♨️ Баня', cat_night:'🌙 Ночь', grp_food:'🍽 Еда', grp_spot:'🏛 Места', grp_cafe:'☕ Кафе', grp_shopping:'🛍 Шопинг', grp_activity:'🎯 Активности',
  },
  ar:{ flag:'🇸🇦', name:'العربية', search:'بحث...', open:'مفتوح', closed:'مغلق', hours:'ساعات', price:'السعر', review:'تقييمات', writeReview:'اكتب تقييماً', submit:'نشر', saving:'حفظ', nav_explore:'استكشف', nav_ai:'AI', nav_community:'المجتمع', nav_me:'أنا', nav_feed:'التغذية', mau:'الهدف', featured:'شعبي', all_list:'الكل', route:'اتجاهات', subway:'مترو', bus:'حافلة', taxi:'تاكسي', walk:'سيراً', time:'وقت', dist:'مسافة', fare:'أجرة', open_map:'فتح خرائط Google', region_select:'اختر المنطقة', all_region:'الكل', community_title:'مجتمع المسافرين', community_sub:'شارك المطاعم والأماكن المخفية', write_post:'كتابة', best:'الأفضل', latest:'الأحدث', food_post:'طعام', spot_post:'معالم', cafe_post:'مقهى', free_post:'حر', likes:'إعجاب', comments:'تعليقات', reply:'رد', my_posts:'منشوراتي', no_posts:'لا توجد منشورات', post_title:'عنوان', post_content:'شارك تجربتك...', post_city:'مدينة', post_submit:'نشر', add_photo:'إضافة صورة', translate:'ترجمة', translating:'جاري الترجمة...', write_reply:'اكتب رداً...', reply_to:'رداً على', cat_all:'✨ الكل', cat_food:'🍽 طعام', cat_korean:'🇰🇷 كوري', cat_bbq:'🥩 مشوي', cat_seafood:'🦞 بحري', cat_street:'🥟 شارع', cat_dessert:'🍡 حلويات', cat_spot:'🏛 معالم', cat_palace:'🏯 قصر', cat_temple:'🛕 معبد', cat_nature:'🏞 طبيعة', cat_beach:'🏖 شاطئ', cat_kpop:'🎤 K-POP', cat_cafe:'☕ مقهى', cat_hanok:'🏡 هانوك', cat_rooftop:'🌇 سطح', cat_tea:'🍵 شاي', cat_shopping:'🛍 تسوق', cat_mall:'🏬 مول', cat_beauty:'💄 جمال', cat_kpop_goods:'💿 K-POP', cat_activity:'🎯 أنشطة', cat_cooking:'🍳 طبخ', cat_spa:'♨️ سبا', cat_night:'🌙 ليل', grp_food:'🍽 طعام', grp_spot:'🏛 معالم', grp_cafe:'☕ مقهى', grp_shopping:'🛍 تسوق', grp_activity:'🎯 أنشطة',
  },
}

const REGION_DATA = [
  { id:'all', label:'전체', icon:'🇰🇷', districts:[] },
  { id:'서울', label:'서울 Seoul', icon:'🏙', districts:['강남/역삼/삼성','신사/청담/압구정','서초/교대/사당','잠실/송파/강동','을지로/명동/중구/동대문','서울역/이태원/용산','종로/인사동','홍대/합정/마포/서대문','여의도','영등포역','구로/신도림/금천','김포공항/염창/강서','건대입구/성수/왕십리','성북/강북/노원/도봉'] },
  { id:'부산', label:'부산 Busan', icon:'🌊', districts:['해운대/마린시티','광안리/수영','서면/부전','남포동/자갈치','동래/온천장','기장/일광','강서/사상','영도'] },
  { id:'제주', label:'제주 Jeju', icon:'🌋', districts:['제주시내','애월/한림','성산/표선','서귀포시내','중문/대포','한경/모슬포','조천/구좌'] },
  { id:'경기', label:'경기 Gyeonggi', icon:'🏘', districts:['수원 Suwon','성남/판교','용인 Yongin','고양/일산','안양/군포','화성/동탄','광명','파주 Paju','남양주'] },
  { id:'인천', label:'인천 Incheon', icon:'✈️', districts:['송도 Songdo','부평/계양','인천공항/영종도','강화도','중구/동구'] },
  { id:'강원', label:'강원 Gangwon', icon:'⛰', districts:['강릉 Gangneung','속초/고성','춘천 Chuncheon','원주 Wonju','평창/정선','태백/삼척'] },
  { id:'경상', label:'경상 Gyeongsang', icon:'🏯', districts:['대구 Daegu','경주 Gyeongju','포항 Pohang','안동 Andong','창원 Changwon','진주 Jinju','울산 Ulsan','거제/통영'] },
  { id:'전라', label:'전라 Jeolla', icon:'🌾', districts:['광주 Gwangju','전주 Jeonju','여수 Yeosu','순천 Suncheon','목포 Mokpo','군산 Gunsan','남원 Namwon'] },
  { id:'충청', label:'충청 Chungcheong', icon:'🌿', districts:['대전 Daejeon','청주 Cheongju','천안/아산','공주/부여','보령/태안','충주 Chungju'] },
]

const CAT_BG: any = { food:'#fff5f5', spot:'#f0f4ff', cafe:'#fff8f0', shopping:'#f0fff4', activity:'#f5f0ff' }
const ROUTES_DATA: any = {
  subway:{ time:'18분', dist:'3.2km', cost:'₩1,450', steps:[{n:1,t:'가까운 지하철역으로 이동',m:'도보 5분'},{n:2,t:'1호선 승차 → 목적지역 하차',m:'3정거장 8분'},{n:3,t:'2번 출구 직진 200m',m:'도보 3분'},{n:4,t:'목적지 도착 🎉',m:''}]},
  bus:{ time:'25분', dist:'3.5km', cost:'₩1,300', steps:[{n:1,t:'버스 정류장 이동',m:'3분'},{n:2,t:'273번 승차',m:'배차 10~15분'},{n:3,t:'목적지 정류장 하차',m:'18분'}]},
  taxi:{ time:'12분', dist:'3.2km', cost:'₩8,000~10,000', steps:[{n:1,t:'카카오택시 호출',m:'대기 2분'},{n:2,t:'탑승 후 목적지 입력',m:'기본요금 ₩4,800'},{n:3,t:'목적지 도착',m:'12분'}]},
  walk:{ time:'38분', dist:'2.8km', cost:'무료', steps:[{n:1,t:'북쪽 직진 500m',m:''},{n:2,t:'사거리 우회전',m:''},{n:3,t:'목적지 도착 🚶',m:''}]},
}
const AVATAR_COLORS = ['#C8102E','#1565C0','#1A7A4A','#8B5E3C','#6B21A8','#F5A623','#0D1B2A']
const getAvatarColor = (name: string) => AVATAR_COLORS[(name||'?').charCodeAt(0) % AVATAR_COLORS.length]

export default function App() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const meta1 = document.createElement('meta');
      meta1.name = 'naver-site-verification';
      meta1.content = 'ee52cf50bd4f8a34251bea1748cec479867ba183';
      document.head.appendChild(meta1);

      const meta2 = document.createElement('meta');
      meta2.name = 'google-site-verification';
      meta2.content = 'trxvl4ZzO6Q-ZUqIMdSYd9vbkKghuCgmqxb-gDeX36o';
      document.head.appendChild(meta2);
    }
  }, []);

  const exploreScrollRef = useRef<ScrollView>(null)
  const [lang, setLang] = useState('ko')
  const [tab, setTab] = useState('community')
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(REGION_DATA[0])
  const [selectedDistrict, setSelectedDistrict] = useState('전체')
  const [selectedCat, setSelectedCat] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [saved, setSaved] = useState<string[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewText, setReviewText] = useState('')
  const [reviewStar, setReviewStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postFilter, setPostFilter] = useState('latest')
  const [aiCategory, setAiCategory] = useState<string>('food')
  const [aiPlaces, setAiPlaces] = useState<any[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [bestTab, setBestTab] = useState<'best'|'daily'|'weekly'>('best')
  const [bestPosts, setBestPosts] = useState<any[]>([])
  const [dailyBest, setDailyBest] = useState<any[]>([])
  const [weeklyBest, setWeeklyBest] = useState<any[]>([])
  const [bestLoading, setBestLoading] = useState(false)
  const [communityBestTab, setCommunityBestTab] = useState<'best'|'daily'|'weekly'>('best')
  const [communityBestPosts, setCommunityBestPosts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [newPasswordSubmitting, setNewPasswordSubmitting] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'signup'|'verify'|'reset'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authNickname, setAuthNickname] = useState('')
  const [authError, setAuthError] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postCity, setPostCity] = useState('')
  const [postCategory, setPostCategory] = useState('free')
  const [postSubmitting, setPostSubmitting] = useState(false)
  const [postPhoto, setPostPhoto] = useState<string | null>(null)
  const [postPhotoUploading, setPostPhotoUploading] = useState(false)
  const [photoViewer, setPhotoViewer] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [postComments, setPostComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<any>(null)
  const [myPosts, setMyPosts] = useState<any[]>([])
  const [myReviewCount, setMyReviewCount] = useState(0)
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [editingReview, setEditingReview] = useState<any>(null)
  const [editReviewContent, setEditReviewContent] = useState('')
  const [editReviewRating, setEditReviewRating] = useState(5)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [routeTransport, setRouteTransport] = useState('subway')
  const [tempRegion, setTempRegion] = useState(REGION_DATA[0])
  const [translations, setTranslations] = useState<{[key:string]:string}>({})
  const [translating, setTranslating] = useState<{[key:string]:boolean}>({})
  const [editingPost, setEditingPost] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editCategory, setEditCategory] = useState('free')
  const [editPhoto, setEditPhoto] = useState<string | null>(null)
  const [editPhotoUploading, setEditPhotoUploading] = useState(false)
  const [userProfileModal, setUserProfileModal] = useState<{visible: boolean, userId: string, nickname: string}>({visible: false, userId: '', nickname: ''})
  const [nicknameMenu, setNicknameMenu] = useState<{visible:boolean, userId:string, nickname:string, x:number, y:number}>({visible:false, userId:'', nickname:'', x:0, y:0})
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [followStats, setFollowStats] = useState<{followers: number, following: number}>({followers: 0, following: 0})
  const [isFollowing, setIsFollowing] = useState(false)
  const [userBio, setUserBio] = useState<string>(user?.user_metadata?.bio || '')
  const [editingBio, setEditingBio] = useState(false)
  const [myPostsGrid, setMyPostsGrid] = useState<any[]>([])
  const [savedPlacesData, setSavedPlacesData] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPage, setShowAdminPage] = useState(false)
  const [placeReports, setPlaceReports] = useState<any[]>([])
  const [editingReport, setEditingReport] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingReport, setRejectingReport] = useState<any>(null)
  const [showPlaceReport, setShowPlaceReport] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [reportName, setReportName] = useState('')
  const [reportCategory, setReportCategory] = useState('맛집')
  const [reportCity, setReportCity] = useState('서울')
  const [reportAddress, setReportAddress] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportPhoto, setReportPhoto] = useState<string | null>(null)
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [myReports, setMyReports] = useState<any[]>([])
  const [showUserPosts, setShowUserPosts] = useState(false)
  const [userPostsList, setUserPostsList] = useState<any[]>([])
  const [userPostsTarget, setUserPostsTarget] = useState<{userId: string, nickname: string} | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageTarget, setMessageTarget] = useState<{userId: string, nickname: string} | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [messageSending, setMessageSending] = useState(false)
  const [showMyMessages, setShowMyMessages] = useState(false)
  const [myMessages, setMyMessages] = useState<any[]>([])
  const [showConversation, setShowConversation] = useState(false)
  const [conversationTarget, setConversationTarget] = useState<{userId: string, nickname: string, avatarUrl: string | null} | null>(null)
  const [conversationMessages, setConversationMessages] = useState<any[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [adminPlaces, setAdminPlaces] = useState<any[]>([])
  const [adminPlaceSearch, setAdminPlaceSearch] = useState('')
  const L = LANGS[lang] || LANGS['ko']
  
  const editDeleteTexts: any = {
    ko: { edit: '수정', delete: '삭제', deleteConfirm: '정말 삭제하시겠습니까?', deleting: '삭제 중...', editing: '수정 중...' },
    en: { edit: 'Edit', delete: 'Delete', deleteConfirm: 'Delete this post?', deleting: 'Deleting...', editing: 'Updating...' },
    zh: { edit: '編輯', delete: '刪除', deleteConfirm: '確定刪除？', deleting: '刪除中...', editing: '更新中...' },
    ja: { edit: '編集', delete: '削除', deleteConfirm: '削除しますか？', deleting: '削除中...', editing: '更新中...' },
    tw: { edit: '編輯', delete: '刪除', deleteConfirm: '確定刪除？', deleting: '刪除中...', editing: '更新中...' },
    th: { edit: 'แก้ไข', delete: 'ลบ', deleteConfirm: 'ลบโพสต์นี้?', deleting: 'กำลังลบ...', editing: 'กำลังอัปเดต...' },
    vi: { edit: 'Chỉnh sửa', delete: 'Xóa', deleteConfirm: 'Xóa bài này?', deleting: 'Đang xóa...', editing: 'Đang cập nhật...' },
    id: { edit: 'Edit', delete: 'Hapus', deleteConfirm: 'Apakah Anda ingin menghapus?', deleting: 'Menghapus...', editing: 'Memperbarui...' },
    ms: { edit: 'Edit', delete: 'Padam', deleteConfirm: 'Padam pos ini?', deleting: 'Memadamkan...', editing: 'Mengemaskini...' },
    es: { edit: 'Editar', delete: 'Eliminar', deleteConfirm: '¿Eliminar este post?', deleting: 'Eliminando...', editing: 'Actualizando...' },
    fr: { edit: 'Modifier', delete: 'Supprimer', deleteConfirm: 'Supprimer ce post?', deleting: 'Suppression...', editing: 'Mise à jour...' },
    de: { edit: 'Bearbeiten', delete: 'Löschen', deleteConfirm: 'Diesen Post löschen?', deleting: 'Wird gelöscht...', editing: 'Wird aktualisiert...' },
    pt: { edit: 'Editar', delete: 'Excluir', deleteConfirm: 'Excluir este post?', deleting: 'Excluindo...', editing: 'Atualizando...' },
    ru: { edit: 'Редактировать', delete: 'Удалить', deleteConfirm: 'Удалить этот пост?', deleting: 'Удаление...', editing: 'Обновление...' },
    ar: { edit: 'تحرير', delete: 'حذف', deleteConfirm: 'حذف هذا المنشور؟', deleting: 'جاري الحذف...', editing: 'جاري التحديث...' },
  }
  const editBtn = editDeleteTexts[lang] || editDeleteTexts['ko']

  const CATS = [
    {key:'all',    label:'✨ 전체',    color:'#0D1B2A'},
    {key:'food',   label:'🍽️ 맛집',    color:'#C8102E'},
    {key:'cafe',   label:'☕ 카페',    color:'#8B5E3C'},
    {key:'spot',   label:'📍 명소',    color:'#1565C0'},
    {key:'shopping',label:'🛍️ 쇼핑',  color:'#1A7A4A'},
    {key:'activity',label:'🎯 액티비티',color:'#6B21A8'},
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    supabase.auth.onAuthStateChange((event, session)=>{
      setUser(session?.user ?? null)
      if(event === 'PASSWORD_RECOVERY') {
        setShowNewPasswordModal(true)
      }
    })
  }, [])
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setProfileImage(user.user_metadata.avatar_url);
    }
    loadSavedPlaces();
    fetchNotifications();
    checkIsAdmin();
    fetchMyReports();
  }, [user])
  useEffect(() => { loadPlaces() }, [selectedRegion.id, selectedDistrict, selectedCat, searchText])
  useEffect(() => { if(tab==='community') loadPosts() }, [tab, postFilter])
  useEffect(() => { if(tab==='profile') { loadMyData(); loadSavedPlacesWithDetails(); fetchMyReports(); } }, [tab])
  useEffect(() => { loadBestPosts() }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {});
    }
  }, [])

  const openEditModal = (post:any) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditContent(post.content)
    setEditCity(post.city || '')
    setEditCategory(post.category)
    setEditPhoto(post.photo_url)
    setShowEditModal(true)
  }
  
  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingPost(null)
    setEditTitle('')
    setEditContent('')
    setEditCity('')
    setEditCategory('free')
    setEditPhoto(null)
  }
  
  async function updatePost() {
    if(!editTitle.trim()) { Alert.alert('','제목을 입력해주세요'); return }
    if(!editContent.trim()) { Alert.alert('','내용을 입력해주세요'); return }
    setPostSubmitting(true)
    const {error} = await supabase.from('posts').update({
      title:editTitle.trim(),
      content:editContent.trim(),
      city:editCity.trim()||null,
      category:editCategory,
      photo_url: editPhoto || null,
    }).eq('id',editingPost.id)
    if(!error) {
      closeEditModal()
      await loadPosts()
      await loadMyData()
      Alert.alert('✅','게시글이 수정되었습니다!')
    }
    setPostSubmitting(false)
  }

  async function deletePost(postId: string) {
    if (Platform.OS === 'web') {
      if (!window.confirm('정말 삭제하시겠습니까?')) return
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (error) {
        window.alert('삭제 실패: ' + error.message)
      } else {
        window.alert('삭제되었습니다')
        if (selectedPost?.id === postId) setSelectedPost(null)
        await loadPosts()
        await loadMyData()
      }
    } else {
      Alert.alert(
        '정말 삭제하시겠습니까?',
        '',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '삭제',
            style: 'destructive',
            onPress: async () => {
              const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)

              if (error) {
                Alert.alert('삭제 실패', error.message)
                console.error('삭제 에러:', error)
              } else {
                Alert.alert('삭제되었습니다', '')
                if (selectedPost?.id === postId) setSelectedPost(null)
                await loadPosts()
                await loadMyData()
              }
            }
          }
        ]
      )
    }
  }

  async function pickEditImage() {
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return
        setEditPhotoUploading(true)
        try {
          const fileName = `post_${Date.now()}.jpg`
          const { error } = await supabase.storage.from('community-photos').upload(fileName, file, { contentType: file.type, upsert: true })
          if (error) throw error
          const { data } = supabase.storage.from('community-photos').getPublicUrl(fileName)
          setEditPhoto(data.publicUrl)
        } catch(e) {
          window.alert('사진 업로드에 실패했습니다')
        }
        setEditPhotoUploading(false)
      }
      input.click()
      return
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(!perm.granted) { Alert.alert('','사진 접근 권한이 필요합니다'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect:[4,3], quality:0.7,
    })
    if(result.canceled) return
    const uri = result.assets[0].uri
    setEditPhotoUploading(true)
    try {
      const fileName = `post_${Date.now()}.jpg`
      const response = await fetch(uri)
      const blob = await response.blob()
      const {error} = await supabase.storage.from('community-photos').upload(fileName, blob, { contentType:'image/jpeg', upsert:true })
      if(error) throw error
      const {data} = supabase.storage.from('community-photos').getPublicUrl(fileName)
      setEditPhoto(data.publicUrl)
    } catch(e) {
      Alert.alert('오류','사진 업로드에 실패했습니다')
    }
    setEditPhotoUploading(false)
  }

  async function loadPlaces() {
    setLoading(true)
    let q = supabase.from('places').select('*')

    if (selectedRegion.id !== 'all') {
      if (selectedDistrict !== '전체') {
        q = q.eq('district', selectedDistrict)
      } else {
        q = q.eq('city', selectedRegion.id)
      }
    }

    if (selectedCat !== 'all') q = q.eq('category', selectedCat)
    if (searchText.trim()) q = q.ilike('name', `%${searchText}%`)

    const { data } = await q
    setPlaces(data || [])
    setLoading(false)
  }

  async function loadAiPlaces(cat: string) {
    setAiLoading(true)
    setAiCategory(cat)
    const {data} = await supabase
      .from('places')
      .select('*')
      .eq('category', cat)
      .order('rating', {ascending: false})
      .limit(10)
    setAiPlaces(data||[])
    setAiLoading(false)
  }

  const handleProfileImageUpload = async () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file || !user) return;
      const ext = file.name.split('.').pop();
      const filePath = `profiles/${user.id}`;
      const { error } = await supabase.storage.from('community-photos').upload(filePath, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from('community-photos').getPublicUrl(filePath);
        setProfileImage(data.publicUrl);
        await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        if (updatedUser) setUser(updatedUser);
        await supabase.from('posts').update({ avatar_url: data.publicUrl }).eq('user_id', user.id);
      }
    };
    input.click();
  };

  const handleReportPhotoUpload = async () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop();
      const filePath = `reports/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('community-photos').upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from('community-photos').getPublicUrl(filePath);
        setReportPhoto(data.publicUrl);
      }
    };
    input.click();
  };

  const handleReportSubmit = async () => {
    if (!reportName.trim()) { window.alert('장소명을 입력해주세요.'); return; }
    if (!reportAddress.trim()) { window.alert('주소를 입력해주세요.'); return; }
    setReportSubmitting(true);
    const { error } = await supabase.from('place_reports').insert({
      user_id: user?.id || null,
      user_name: user?.user_metadata?.nickname || '익명',
      name: reportName.trim(),
      category: reportCategory,
      city: reportCity,
      address: reportAddress.trim(),
      description: reportDescription.trim(),
      photo_url: reportPhoto || null,
      status: 'pending',
    });
    setReportSubmitting(false);
    if (!error) {
      const { data: adminData } = await supabase.from('admins').select('user_id');
      if (adminData) {
        for (const admin of adminData) {
          await supabase.from('notifications').insert({
            user_id: admin.user_id,
            type: 'comment',
            message: `📌 새 장소 제보: "${reportName.trim()}" (${reportCity} · ${reportCategory})`,
            from_user_name: user?.user_metadata?.nickname || '익명',
            from_avatar_url: user?.user_metadata?.avatar_url || null,
          });
        }
      }
      window.alert('장소 제보가 완료됐습니다! 검토 후 등록해드릴게요 😊');
      setShowPlaceReport(false);
      setReportName('');
      setReportCategory('맛집');
      setReportCity('서울');
      setReportAddress('');
      setReportDescription('');
      setReportPhoto(null);
    } else {
      window.alert('제보 중 오류가 발생했습니다.');
    }
  };

  const checkIsAdmin = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single();
    setIsAdmin(!!data);
  };

  const fetchPlaceReports = async () => {
    const { data, error } = await supabase
      .from('place_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPlaceReports(data);
    if (error) console.log('fetchPlaceReports error:', error);
  };

  const fetchMyReports = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('place_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setMyReports(data);
  };

  const fetchUserPosts = async (userId: string, nickname: string) => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) {
      setUserPostsList(data);
      setUserPostsTarget({ userId, nickname });
      setShowUserPosts(true);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) { window.alert('메시지를 입력해주세요.'); return; }
    if (!user || !messageTarget) return;
    setMessageSending(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: messageTarget.userId,
      sender_name: user.user_metadata?.nickname || '익명',
      sender_avatar_url: user.user_metadata?.avatar_url || null,
      content: messageContent.trim(),
    });
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: messageTarget.userId,
        type: 'message',
        message: `✉️ ${user.user_metadata?.nickname || '누군가'}님이 메시지를 보냈습니다: "${messageContent.trim().slice(0, 30)}${messageContent.trim().length > 30 ? '...' : ''}"`,
        from_user_name: user.user_metadata?.nickname || '익명',
        from_avatar_url: user.user_metadata?.avatar_url || null,
      });
      setMessageContent('');
      setShowMessageModal(false);
      window.alert('메시지를 전송했습니다!');
    } else {
      window.alert('전송 오류: ' + error.message);
    }
    setMessageSending(false);
  };

  const fetchMyMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    if (data) {
      const conversations: { [key: string]: any } = {};
      data.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherName = msg.sender_id === user.id ? msg.receiver_name || '상대방' : msg.sender_name;
        const otherAvatar = msg.sender_id === user.id ? msg.receiver_avatar_url : msg.sender_avatar_url;
        if (!conversations[otherId]) {
          conversations[otherId] = {
            userId: otherId,
            nickname: otherName,
            avatarUrl: otherAvatar,
            lastMessage: msg.content,
            lastTime: msg.created_at,
            unread: 0,
          };
        }
        if (msg.receiver_id === user.id && !msg.is_read) {
          conversations[otherId].unread++;
        }
      });
      setMyMessages(Object.values(conversations));
    }
  };

  const fetchConversation = async (targetUserId: string, targetNickname: string, targetAvatar: string | null) => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    if (data) {
      setConversationMessages(data);
      setConversationTarget({ userId: targetUserId, nickname: targetNickname, avatarUrl: targetAvatar });
      setShowConversation(true);
      await supabase.from('messages')
        .update({ is_read: true })
        .eq('sender_id', targetUserId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !user || !conversationTarget) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: conversationTarget.userId,
      sender_name: user.user_metadata?.nickname || '익명',
      sender_avatar_url: user.user_metadata?.avatar_url || null,
      content: replyContent.trim(),
    });
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: conversationTarget.userId,
        type: 'message',
        message: `✉️ ${user.user_metadata?.nickname || '누군가'}님이 메시지를 보냈습니다: "${replyContent.trim().slice(0, 30)}..."`,
        from_user_name: user.user_metadata?.nickname || '익명',
        from_avatar_url: user.user_metadata?.avatar_url || null,
      });
      setReplyContent('');
      fetchConversation(conversationTarget.userId, conversationTarget.nickname, conversationTarget.avatarUrl);
    }
  };

  const fetchAdminPlaces = async (keyword: string) => {
    if (!keyword.trim()) { setAdminPlaces([]); return; }
    const { data } = await supabase
      .from('places')
      .select('id, name, city, category, address')
      .ilike('name', `%${keyword}%`)
      .limit(20);
    if (data) setAdminPlaces(data);
  };

  const handleDeletePlace = async (placeId: string, placeName: string) => {
    if (!window.confirm(`"${placeName}" 장소를 삭제하시겠습니까?`)) return;

    const { error } = await supabase.from('places').delete().eq('id', placeId);

    if (!error) {
      const { data: updatedReports, error: updateError } = await supabase
        .from('place_reports')
        .update({ status: 'deleted' })
        .eq('name', placeName)
        .eq('status', 'approved')
        .select('user_id');

      console.log('updated reports:', updatedReports, updateError);

      if (updatedReports && updatedReports.length > 0) {
        for (const report of updatedReports) {
          if (report.user_id) {
            await supabase.from('notifications').insert({
              user_id: report.user_id,
              type: 'comment',
              message: `📌 "${placeName}" 장소가 관리자에 의해 삭제됐습니다.`,
              from_user_name: 'K컬처MAP 관리자',
              from_avatar_url: null,
            });
          }
        }
      }

      setAdminPlaces(prev => prev.filter(p => p.id !== placeId));
      window.alert('삭제됐습니다.');
    } else {
      window.alert('삭제 오류: ' + error.message);
    }
  };

  const handleApproveReport = async (report: any) => {
    if (!window.confirm(`"${report.name}" 장소를 등록하시겠습니까?`)) return;

    const { error } = await supabase.from('places').insert({
      name: report.name,
      name_en: report.name,
      city: report.city,
      district: report.city,
      category: report.category === '맛집' ? 'food' :
                report.category === '카페' ? 'cafe' :
                report.category === '명소' ? 'spot' :
                report.category === '쇼핑' ? 'shopping' : 'activity',
      address: report.address,
      photo_url: report.photo_url || null,
      rating: 0,
      emoji: report.category === '맛집' ? '🍽️' :
             report.category === '카페' ? '☕' :
             report.category === '명소' ? '📍' :
             report.category === '쇼핑' ? '🛍️' : '🎯',
      featured: false,
      is_open: true,
      lat: null,
      lng: null,
      reported_by: report.user_name || null,
    });

    if (!error) {
      await supabase.from('place_reports').update({ status: 'approved' }).eq('id', report.id);

      if (report.user_id) {
        await supabase.from('notifications').insert({
          user_id: report.user_id,
          type: 'comment',
          message: `📌 "${report.name}" 장소가 K컬처MAP에 등록됐습니다! 감사합니다 🎉`,
          from_user_name: 'K컬처MAP 관리자',
          from_avatar_url: null,
        });
      }

      setPlaceReports(prev => prev.map(r =>
        r.id === report.id ? { ...r, status: 'approved' } : r
      ));
      setMyReports(prev => prev.map(r =>
        r.id === report.id ? { ...r, status: 'approved' } : r
      ));
      window.alert('장소가 등록됐습니다!');
    } else {
      window.alert('오류: ' + error.message);
    }
  };

  const handleRejectReport = async () => {
    if (!rejectReason.trim()) { window.alert('반려 사유를 입력해주세요.'); return; }

    await supabase.from('place_reports').update({ status: 'rejected' }).eq('id', rejectingReport.id);

    if (rejectingReport.user_id) {
      await supabase.from('notifications').insert({
        user_id: rejectingReport.user_id,
        type: 'comment',
        message: `📌 "${rejectingReport.name}" 장소 제보가 반려됐습니다. 사유: ${rejectReason}`,
        from_user_name: 'K컬처MAP 관리자',
        from_avatar_url: null,
      });
    }

    setPlaceReports(prev => prev.map(r =>
      r.id === rejectingReport.id ? { ...r, status: 'rejected' } : r
    ));
    setMyReports(prev => prev.map(r =>
      r.id === rejectingReport.id ? { ...r, status: 'rejected' } : r
    ));

    setShowRejectModal(false);
    setRejectReason('');
    setRejectingReport(null);
    window.alert('반려 처리됐습니다.');
  };

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n:any) => !n.is_read).length);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setUnreadCount(0);
    setNotifications((prev:any[]) => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleSaveBio = async () => {
    await supabase.auth.updateUser({ data: { bio: userBio } });
    const { data: { user: updatedUser } } = await supabase.auth.getUser();
    if (updatedUser) setUser(updatedUser);
    setEditingBio(false);
  };

  const fetchFollowStats = async (userId: string) => {
    const [{ count: followers }, { count: following }] = await Promise.all([
      supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    ]);
    setFollowStats({ followers: followers || 0, following: following || 0 });
  };

  const checkIsFollowing = async (targetUserId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();
    setIsFollowing(!!data);
  };

  const handleFollowToggle = async (targetUserId: string) => {
    if (!user) { window.alert('로그인이 필요합니다.'); return; }
    if (isFollowing) {
      await supabase.from('user_follows').delete()
        .eq('follower_id', user.id).eq('following_id', targetUserId);
      setIsFollowing(false);
      setFollowStats(prev => ({ ...prev, followers: prev.followers - 1 }));
    } else {
      await supabase.from('user_follows').insert({ follower_id: user.id, following_id: targetUserId });
      setIsFollowing(true);
      setFollowStats(prev => ({ ...prev, followers: prev.followers + 1 }));
    }
  };

  const openUserProfile = async (userId: string, nickname: string) => {
    if (user && userId === user.id) return;
    setUserProfileModal({ visible: true, userId, nickname });
    await Promise.all([fetchFollowStats(userId), checkIsFollowing(userId)]);
  };

  async function loadBestPosts() {
    setBestLoading(true)
    const today = new Date()
    today.setHours(0,0,0,0)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate()-7)
    weekAgo.setHours(0,0,0,0)
    const {data:daily} = await supabase.from('posts').select('*, post_comments(count)')
      .gte('created_at', today.toISOString())
      .order('likes', {ascending:false})
      .limit(10)
    setDailyBest(daily||[])
    const {data:weekly} = await supabase.from('posts').select('*, post_comments(count)')
      .gte('created_at', weekAgo.toISOString())
      .order('likes', {ascending:false})
      .limit(10)
    setWeeklyBest(weekly||[])
    const {data:best} = await supabase.from('posts').select('*, post_comments(count)')
      .order('likes', {ascending:false})
      .limit(10)
    setBestPosts(best||[])
    setCommunityBestPosts(best||[])
    setBestLoading(false)
  }

  async function loadPosts() {
    setPostsLoading(true)
    let q=supabase.from('posts').select('*, post_comments(count)')
    q = postFilter==='best' ? q.order('likes',{ascending:false}) : q.order('created_at',{ascending:false})
    const {data}=await q
    console.log('posts data sample:', JSON.stringify(data?.[0]))
    setPosts(data||[]); setPostsLoading(false)
  }

  async function loadMyData() {
    const myName = user?.user_metadata?.nickname||'익명'
    const {data:p}=await supabase.from('posts').select('*').eq('user_name',myName).order('created_at',{ascending:false})
    setMyPosts(p||[])
    let r:any[] = []
    try {
      const { data, error } = await supabase.from('reviews').select('*, places(id, name, emoji)').eq('user_name',myName).order('created_at',{ascending:false})
      if (error) throw error
      r = data || []
    } catch(e) {
      console.warn('Review join failed, falling back to plain reviews', e)
      const { data, error } = await supabase.from('reviews').select('*').eq('user_name',myName).order('created_at',{ascending:false})
      if (error) console.error(error)
      r = data || []
    }
    setMyReviews(r)
    setMyReviewCount((r||[]).length)
  }

  async function loadReviews(id:string) {
    const {data}=await supabase.from('reviews').select('*').eq('place_id',id).order('created_at',{ascending:false})
    setReviews(data||[])
  }

  async function loadComments(postId:string) {
    const {data}=await supabase.from('post_comments').select('*').eq('post_id',postId).order('created_at',{ascending:true})
    setPostComments(data||[])
  }

  async function pickImage() {
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return
        setPostPhotoUploading(true)
        try {
          const fileName = `post_${Date.now()}.jpg`
          const { error } = await supabase.storage.from('community-photos').upload(fileName, file, { contentType: file.type, upsert: true })
          if (error) throw error
          const { data } = supabase.storage.from('community-photos').getPublicUrl(fileName)
          setPostPhoto(data.publicUrl)
        } catch(err: any) {
          console.log('upload error detail:', err?.message, err?.statusCode, JSON.stringify(err))
          window.alert('사진 업로드에 실패했습니다')
        }
        setPostPhotoUploading(false)
      }
      input.click()
      return
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(!perm.granted) { Alert.alert('','사진 접근 권한이 필요합니다'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect:[4,3], quality:0.7,
    })
    if(result.canceled) return
    const uri = result.assets[0].uri
    setPostPhotoUploading(true)
    try {
      const fileName = `post_${Date.now()}.jpg`
      const response = await fetch(uri)
      const blob = await response.blob()
      const {error} = await supabase.storage.from('community-photos').upload(fileName, blob, { contentType:'image/jpeg', upsert:true })
      if(error) throw error
      const {data} = supabase.storage.from('community-photos').getPublicUrl(fileName)
      setPostPhoto(data.publicUrl)
    } catch(e) {
      Alert.alert('오류','사진 업로드에 실패했습니다')
    }
    setPostPhotoUploading(false)
  }

  async function signIn() {
    setAuthSubmitting(true); setAuthError('')
    const {error} = await supabase.auth.signInWithPassword({email:authEmail, password:authPassword})
    if(error) setAuthError(error.message)
    else { setShowAuthModal(false); setAuthEmail(''); setAuthPassword('') }
    setAuthSubmitting(false)
  }

  async function signUp() {
    if(!authNickname.trim()) { setAuthError('닉네임을 입력해주세요'); return }
    setAuthSubmitting(true); setAuthError('')
    const {error} = await supabase.auth.signUp({
      email:authEmail, password:authPassword,
      options:{data:{nickname:authNickname}}
    })
    if(error) {
      if(error.message.includes('already registered') || error.message.includes('already been registered')) {
        setAuthError('이미 가입된 이메일입니다. 로그인을 시도해보세요.')
      } else {
        setAuthError(error.message)
      }
      setAuthSubmitting(false)
      return
    }
    setAuthError(''); setAuthMode('verify')
    setAuthSubmitting(false)
  }

  async function resetPassword() {
    if(!authEmail.trim()) { setAuthError('이메일을 입력해주세요'); return }
    setAuthSubmitting(true); setAuthError('')
    const {error} = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: 'https://www.kculture-map.com'
    })
    if(error) setAuthError(error.message)
    else { setAuthError(''); setAuthMode('verify') }
    setAuthSubmitting(false)
  }

  async function updatePassword() {
    if(newPassword.length < 6) { setNewPasswordError('비밀번호는 6자 이상이어야 합니다'); return }
    if(newPassword !== newPasswordConfirm) { setNewPasswordError('비밀번호가 일치하지 않습니다'); return }
    setNewPasswordSubmitting(true); setNewPasswordError('')
    const {error} = await supabase.auth.updateUser({password: newPassword})
    if(error) setNewPasswordError(error.message)
    else {
      window.alert('비밀번호가 변경되었습니다! 다시 로그인해주세요.')
      setShowNewPasswordModal(false)
      setNewPassword(''); setNewPasswordConfirm('')
      await supabase.auth.signOut()
      setShowAuthModal(true)
      setAuthMode('login')
      if(typeof window !== 'undefined') window.location.hash = ''
    }
    setNewPasswordSubmitting(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const getUserLevel = (postCount: number, reviewCount: number, followerCount: number) => {
    if (postCount >= 1000 && reviewCount >= 100 && followerCount >= 100) return { emoji: '👑', name: 'K컬처 레전드', level: 5 };
    if (postCount >= 500 && reviewCount >= 50) return { emoji: '🌟', name: 'K컬처 마스터', level: 4 };
    if (postCount >= 100 && reviewCount >= 50) return { emoji: '🏅', name: 'K컬처 러버', level: 3 };
    if (postCount >= 10) return { emoji: '🗺️', name: '탐험가', level: 2 };
    return { emoji: '✈️', name: '입문 여행자', level: 1 };
  };

  const getLevelProgress = (postCount: number, reviewCount: number, followerCount: number) => {
    const level = getUserLevel(postCount, reviewCount, followerCount).level;
    if (level === 1) return { current: postCount, target: 10, label: '게시글', percent: Math.min((postCount / 10) * 100, 100), nextLevel: '탐험가 🗺️' };
    if (level === 2) return { current: postCount, target: 100, label: '게시글', percent: Math.min((postCount / 100) * 100, 100), nextLevel: 'K컬처 러버 🏅' };
    if (level === 3) return { current: postCount, target: 500, label: '게시글', percent: Math.min((postCount / 500) * 100, 100), nextLevel: 'K컬처 마스터 🌟' };
    if (level === 4) return { current: postCount, target: 1000, label: '게시글', percent: Math.min((postCount / 1000) * 100, 100), nextLevel: 'K컬처 레전드 👑' };
    return { current: postCount, target: 1000, label: '게시글', percent: 100, nextLevel: '최고 레벨 달성! 👑' };
  };

  async function submitPost() {
    if(!user) { setShowAuthModal(true); return }
    if(!postTitle.trim()) { window.alert('제목을 입력해주세요'); return }
    if(!postContent.trim()) { window.alert('내용을 입력해주세요'); return }
    setPostSubmitting(true)
    const {error} = await supabase.from('posts').insert({
      user_id: user?.id, user_name: user?.user_metadata?.nickname||'익명', nation:'✍️', title:postTitle.trim(),
      content:postContent.trim(), city:postCity.trim()||null,
      category:postCategory, likes:0,
      photo_url: postPhoto || null,
      avatar_url: user?.user_metadata?.avatar_url || null,
      user_level_emoji: getUserLevel(myPosts.length, myReviews.length, followStats.followers).emoji,
    })
    if(!error) {
      setPostTitle(''); setPostContent(''); setPostCity(''); setPostCategory('free'); setPostPhoto(null)
      setShowWriteModal(false); await loadPosts()
      window.alert('게시글이 등록되었습니다!')
    }
    setPostSubmitting(false)
  }

  async function submitReview() {
    if(!user) { setShowAuthModal(true); return }
    if(reviewStar===0) { window.alert('별점을 선택해주세요'); return }
    if(!reviewText.trim()) { window.alert('내용을 입력해주세요'); return }
    setSubmitting(true)
    const {error} = await supabase.from('reviews').insert({ place_id:selectedPlace.id, user_name: user?.user_metadata?.nickname||'익명', rating:reviewStar, content:reviewText.trim() })
    if(!error) { setReviewText(''); setReviewStar(0); setMyReviewCount(c=>c+1); await loadReviews(selectedPlace.id); window.alert('등록 완료!') }
    setSubmitting(false)
  }

  async function submitComment() {
    if(!commentText.trim()) return
    const newComment = commentText.trim()
    await supabase.from('post_comments').insert({
      post_id:selectedPost.id, user_name: user?.user_metadata?.nickname||'익명', content:newComment,
      parent_id: replyTo?.id || null,
    })
    if (selectedPost && selectedPost.user_id && selectedPost.user_id !== user?.id) {
      await supabase.from('notifications').insert({
        user_id: selectedPost.user_id,
        type: 'comment',
        message: `${user?.user_metadata?.nickname || '누군가'}님이 댓글을 달았습니다: "${newComment.slice(0, 30)}${newComment.length > 30 ? '...' : ''}"`,
        post_id: selectedPost.id,
        from_user_name: user?.user_metadata?.nickname || '익명',
        from_avatar_url: user?.user_metadata?.avatar_url || null,
      });
    }
    setCommentText(''); setReplyTo(null)
    await loadComments(selectedPost.id)
  }

  async function likePost(post: any) {
    let identifier = user?.id
    if(!identifier) {
      let deviceId = localStorage.getItem('kculture_device_id')
      if(!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2,9) + '_' + Date.now()
        localStorage.setItem('kculture_device_id', deviceId)
      }
      identifier = deviceId
    }
    const {data:existing} = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_identifier', identifier)
      .single()
    if(existing) {
      window.alert('이미 좋아요한 게시글입니다!')
      return
    }
    await supabase.from('post_likes').insert({
      post_id: post.id,
      user_identifier: identifier
    })
    await supabase.from('posts').update({likes: post.likes + 1}).eq('id', post.id)
    if (post.user_id && post.user_id !== user?.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        type: 'like',
        message: `${user?.user_metadata?.nickname || '누군가'}님이 회원님의 게시글을 좋아합니다.`,
        post_id: post.id,
        from_user_name: user?.user_metadata?.nickname || '익명',
        from_avatar_url: user?.user_metadata?.avatar_url || null,
      });
    }
    await loadPosts()
  }

  const TRANSLATE_LANG_MAP: any = {
    ko:'ko', en:'en', zh:'zh', ja:'ja', tw:'zh', th:'th',
    vi:'vi', id:'id', ms:'ms', es:'es', fr:'fr', de:'de',
    pt:'pt', ru:'ru', ar:'ar',
  }

  async function translateText(id:string, text:string) {
    if(translations[id]) { setTranslations(t=>({...t,[id]:''})); return }
    setTranslating(t=>({...t,[id]:true}))
    try {
      const targetLang = TRANSLATE_LANG_MAP[lang] || 'ko'
      const res = await fetch('https://libretranslate.de/translate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text',
        }),
      })
      const data = await res.json()
      const translated = data.translatedText || ''
      if(!translated) throw new Error('translation failed')
      setTranslations(t=>({...t,[id]:translated}))
    } catch(e) {
      Alert.alert('','번역에 실패했습니다')
    }
    setTranslating(t=>({...t,[id]:false}))
  }

  const openDetail = (p:any) => { setSelectedPlace(p); loadReviews(p.id); setReviewText(''); setReviewStar(0) }
  const goHome = () => { 
    setTab('explore'); 
    setSelectedRegion(REGION_DATA[0]); 
    setSelectedDistrict('전체'); 
    setSelectedCat('all'); 
    setSearchText('');
    exploreScrollRef.current?.scrollTo({y:0, animated:true});
  }
  const loadSavedPlaces = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_places')
      .select('place_id')
      .eq('user_id', user.id);
    if (data) setSaved(data.map((d:any) => d.place_id));
  };

  const loadSavedPlacesWithDetails = async () => {
    if (!user) return;
    const { data: savedData } = await supabase
      .from('saved_places')
      .select('place_id')
      .eq('user_id', user.id);
    if (!savedData || savedData.length === 0) return;
    const placeIds = savedData.map((d:any) => d.place_id);
    const { data: placesData } = await supabase
      .from('places')
      .select('id, name, lat, lng, city, category, emoji, photo_url, reported_by')
      .in('id', placeIds);
    if (placesData) setSavedPlacesData(placesData);
  };

  const toggleSave = async (placeId: string) => {
    if (!user) { window.alert('로그인이 필요합니다.'); return; }
    const isSaved = saved.includes(placeId);
    if (isSaved) {
      await supabase.from('saved_places').delete()
        .eq('user_id', user.id).eq('place_id', placeId);
      setSaved((prev:string[]) => prev.filter(id => id !== placeId));
    } else {
      await supabase.from('saved_places').insert({ user_id: user.id, place_id: placeId });
      setSaved((prev:string[]) => [...prev, placeId]);
    }
  };
  const openGoogleMaps = (place:any) => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name+' '+place.address)}&travelmode=${routeTransport==='walk'?'walking':routeTransport==='taxi'?'driving':'transit'}`)
  const routeData = ROUTES_DATA[routeTransport]
  const regionLabel = selectedRegion.id==='all' ? `${selectedRegion.icon} 대한민국 전체` : `${selectedRegion.icon} ${selectedRegion.label}${selectedDistrict!=='전체'?' · '+selectedDistrict:''}`
  const timeAgo = (ts:string) => { const m=Math.floor((Date.now()-new Date(ts).getTime())/60000); return m<60?`${m}분 전`:m<1440?`${Math.floor(m/60)}시간 전`:`${Math.floor(m/1440)}일 전` }

  // 댓글 트리 구성
  const topComments = postComments.filter(c=>!c.parent_id)
  const getReplies = (parentId:string) => postComments.filter(c=>c.parent_id===parentId)

  return (
    <SafeAreaProvider>
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" backgroundColor="#0D1B2A" />
      <View style={s.container}>

        {/* 상단 바 */}
        <View style={s.topbar}>
          <TouchableOpacity onPress={goHome}><Text style={s.logo}>K<Text style={s.logoEm}>컬처</Text>MAP</Text></TouchableOpacity>
          <View style={s.searchBar}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput style={s.searchInput} placeholder={L.search} placeholderTextColor="rgba(255,255,255,0.4)" value={searchText} onChangeText={setSearchText} />
          </View>
          <TouchableOpacity style={s.langBtn} onPress={()=>setShowLangModal(true)}>
            <Text style={{fontSize:18}}>{LANGS[lang]?.flag||'🌐'}</Text>
          </TouchableOpacity>
        </View>

        {/* 탐색 탭 */}
        {tab==='explore' && (
          <View style={{flex:1}}>
            <TouchableOpacity style={s.regionBar} onPress={()=>{setTempRegion(selectedRegion);setShowRegionModal(true)}}>
              <Text style={s.regionBarText}>{regionLabel}</Text>
              <Text style={s.regionBarArrow}>▼</Text>
            </TouchableOpacity>
            <ScrollView ref={exploreScrollRef} style={{flex:1}} showsVerticalScrollIndicator={false} scrollsToTop={true} onScroll={(e)=>{if(typeof window!=='undefined'){(window as any).__lastScrollY=e.nativeEvent.contentOffset.y;}}} scrollEventThrottle={16}>
              <TouchableOpacity
                onPress={() => setShowPlaceReport(true)}
                style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'#fff8f0', borderWidth:1, borderColor:'#E8751A', borderRadius:12, padding:12, margin:16, marginBottom:8}}>
                <Text style={{fontSize:18}}>📌</Text>
                <Text style={{color:'#E8751A', fontWeight:'bold', fontSize:14}}>새로운 장소 제보하기</Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
                {CATS.map(cat=>(
                  <TouchableOpacity key={cat.key} onPress={()=>setSelectedCat(cat.key)} style={[s.catPill,selectedCat===cat.key&&{backgroundColor:cat.color,borderColor:cat.color}]}>
                    <Text style={[s.catPillText,selectedCat===cat.key&&s.catPillTextActive]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{backgroundColor:'#fff', marginBottom:8, paddingVertical:12}}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, marginBottom:10}}>
                  <Text style={{fontSize:15, fontWeight:'700', color:'#1a1a1a'}}>🏆 커뮤니티 베스트</Text>
                  <View style={{flexDirection:'row', gap:8}}>
                    <TouchableOpacity onPress={()=>setBestTab('best')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:bestTab==='best'?'#C8102E':'#f0f0f0'}}>
                      <Text style={{fontSize:12, color:bestTab==='best'?'#fff':'#666', fontWeight:'600'}}>🏆 베스트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setBestTab('daily')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:bestTab==='daily'?'#C8102E':'#f0f0f0'}}>
                      <Text style={{fontSize:12, color:bestTab==='daily'?'#fff':'#666', fontWeight:'600'}}>일일</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setBestTab('weekly')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:bestTab==='weekly'?'#C8102E':'#f0f0f0'}}>
                      <Text style={{fontSize:12, color:bestTab==='weekly'?'#fff':'#666', fontWeight:'600'}}>주간</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {bestLoading?<ActivityIndicator size="small" color="#C8102E" style={{padding:16}}/>:(
                  (bestTab==='best'?bestPosts:bestTab==='daily'?dailyBest:weeklyBest).length===0
                  ? <Text style={{textAlign:'center', color:'#aaa', fontSize:13, padding:16}}>아직 게시글이 없습니다</Text>
                  : (bestTab==='best'?bestPosts:bestTab==='daily'?dailyBest:weeklyBest).map((post:any, idx:number)=>(
                    <TouchableOpacity key={post.id} style={{flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:8, borderBottomWidth:idx<(bestTab==='best'?bestPosts:bestTab==='daily'?dailyBest:weeklyBest).length-1?1:0, borderBottomColor:'#f5f5f5'}}
                      onPress={()=>{setSelectedPost(post);loadComments(post.id)}}>
                      <Text style={{fontSize:16, fontWeight:'800', color:idx===0?'#F5A623':idx===1?'#888':idx===2?'#cd7f32':'#ccc', width:28}}>{idx+1}</Text>
                      <View style={{flex:1}}>
                        <Text style={{fontSize:13, fontWeight:'600', color:'#1a1a1a'}} numberOfLines={1}>{post.title}</Text>
                        <Text style={{fontSize:11, color:'#aaa', marginTop:2}}>{post.user_name} · 👍 {post.likes} · 💬 {post.post_comments?.[0]?.count??0}</Text>
                      </View>
                      {post.photo_url&&<img src={post.photo_url} style={{width:44, height:44, borderRadius:6, objectFit:'cover' as any, marginLeft:8}}/>}
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <View style={s.mapPlaceholder}>
                <Text style={{fontSize:26,marginBottom:6}}>🗺</Text>
                <Text style={{color:'#888',fontSize:12,marginBottom:8}}>{regionLabel}</Text>
                <TouchableOpacity style={s.mapOpenBtn} onPress={()=>Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(selectedRegion.id==='all'?'한국 관광지':selectedRegion.label)}`)}>
                  <Text style={s.mapOpenBtnText}>🗺 {L.open_map}</Text>
                </TouchableOpacity>
              </View>
              {loading ? <View style={s.center}><ActivityIndicator size="large" color="#C8102E"/></View> : (
                <View>
                  {places.filter(p=>p.featured).length>0&&<>
                    <Text style={s.secTitle}>🔥 {L.featured}</Text>
                    {places.filter(p=>p.featured).map((p:any)=>(
                      <TouchableOpacity key={p.id} style={s.featCard} onPress={()=>openDetail(p)}>
                        <View style={[s.cardImg,{backgroundColor:CAT_BG[p.category]||'#f5f0e8'}]}>
                          {p.photo_url ? (
                            <Image source={{uri: p.photo_url}} style={{width:'100%' as any, height:'100%' as any, borderTopLeftRadius:12, borderTopRightRadius:12}} resizeMode="cover" />
                          ) : (
                            <Text style={{fontSize:54}}>{p.emoji}</Text>
                          )}
                          <TouchableOpacity style={[s.heartBtn,saved.includes(p.id)&&s.heartSaved]} onPress={()=>toggleSave(p.id)}><Text style={{color:'#fff',fontSize:14}}>♥</Text></TouchableOpacity>
                        </View>
                        <View style={s.cardBody}>
                          <Text style={s.cardName}>{p.name}</Text>
                          {p.reported_by && <Text style={{fontSize:11, color:'#E8751A', marginBottom:2}}>📌 {p.reported_by} 제보</Text>}
                          <View style={s.cardMeta}><Text style={s.stars}>{'★'.repeat(Math.floor(p.rating))}</Text><Text style={s.metaText}> {p.rating}</Text><Text style={[s.metaText,{color:p.is_open?'#1A7A4A':'#C8102E'}]}>{' · '}{p.is_open?L.open:L.closed}</Text></View>
                          {(p.hours||p.price_range)&&<View style={s.chipRow}>{p.hours&&<View style={s.chipHours}><Text style={s.chipHoursText}>🕐 {p.hours}</Text></View>}{p.price_range&&<View style={s.chipPrice}><Text style={s.chipPriceText}>💰 {p.price_range}</Text></View>}</View>}
                          <Text style={s.cardAddr}>{p.address}{p.district?' · '+p.district:''}</Text>
                          <View style={s.cardActions}>
                            <TouchableOpacity style={s.btnRoute} onPress={()=>{setSelectedPlace(p);setShowRouteModal(true)}}><Text style={s.btnRouteText}>🗺 {L.route}</Text></TouchableOpacity>
                            <TouchableOpacity style={s.btnReview} onPress={()=>openDetail(p)}><Text style={s.btnReviewText}>💬 {L.review}</Text></TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>}
                  <Text style={s.secTitle}>📋 {L.all_list}</Text>
                  {places.length===0&&<Text style={s.emptyText}>해당 조건의 장소가 없습니다</Text>}
                  {places.filter(p=>!p.featured).map((p:any)=>(
                    <TouchableOpacity key={p.id} style={s.listCard} onPress={()=>openDetail(p)}>
                      <View style={[s.listThumb,{backgroundColor:CAT_BG[p.category]||'#f5f0e8', overflow:'hidden'}]}>
                        {p.photo_url ? (
                          <Image source={{uri: p.photo_url}} style={{width:56, height:56, borderRadius:10}} resizeMode="cover" />
                        ) : (
                          <Text style={{fontSize:26}}>{p.emoji}</Text>
                        )}
                      </View>
                      <View style={s.listInfo}>
                        <Text style={s.listName}>{p.name}</Text>
                        {p.reported_by && <Text style={{fontSize:11, color:'#E8751A', marginTop:2}}>📌 {p.reported_by} 제보</Text>}
                        <Text style={s.listAddr}>{p.address}{p.district?' · '+p.district:''}</Text>
                        <View style={s.tagRow}>
                          <View style={[s.tag,p.is_open?s.tagOpen:s.tagClosed]}><Text style={[s.tagText,{color:p.is_open?'#166534':'#991b1b'}]}>{p.is_open?L.open:L.closed}</Text></View>
                          {p.hours&&<View style={s.tag}><Text style={s.tagText}>{p.hours}</Text></View>}
                          {p.price_range&&<View style={s.tag}><Text style={s.tagText}>{p.price_range}</Text></View>}
                        </View>
                      </View>
                      <View style={s.listRight}>
                        <View style={s.ratingChip}><Text style={s.ratingChipText}>⭐{p.rating}</Text></View>
                        <TouchableOpacity onPress={()=>toggleSave(p.id)}><Text style={[s.heartSmall,saved.includes(p.id)&&s.heartSmallSaved]}>♥</Text></TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <View style={{height:20}}/>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* AI 탭 */}
        {tab==='ai'&&(
          <View style={{flex:1}}>
            <View style={{padding:16, paddingBottom:8}}>
              <Text style={{fontSize:20, fontWeight:'800', color:'#1a1a1a', marginBottom:4}}>✨ AI추천</Text>
              <Text style={{fontSize:13, color:'#888', marginBottom:16}}>카테고리를 선택하면 인기 장소를 추천해드려요</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>
                <View style={{flexDirection:'row', gap:8, paddingRight:16}}>
                  {[
                    {key:'food', label:'🍽️ 맛집'},
                    {key:'cafe', label:'☕ 카페'},
                    {key:'spot', label:'📍 명소'},
                    {key:'shopping', label:'🛍️ 쇼핑'},
                    {key:'activity', label:'🎯 액티비티'},
                  ].map(c=>(
                    <TouchableOpacity key={c.key}
                      onPress={()=>loadAiPlaces(c.key)}
                      style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20,
                        backgroundColor: aiCategory===c.key ? '#C8102E' : '#f0f0f0'}}>
                      <Text style={{color: aiCategory===c.key ? '#fff' : '#555', fontWeight:'600', fontSize:13}}>{c.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            {aiLoading ? (
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#C8102E"/>
                <Text style={{marginTop:12, color:'#888', fontSize:13}}>추천 장소를 불러오는 중...</Text>
              </View>
            ) : (
              <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} scrollsToTop={true} onScroll={(e)=>{if(typeof window!=='undefined'){(window as any).__lastScrollY=e.nativeEvent.contentOffset.y;}}} scrollEventThrottle={16}>
                <View style={{paddingHorizontal:16, paddingBottom:8}}>
                  <Text style={{fontSize:13, color:'#888'}}>⭐ 평점 높은 순 TOP {aiPlaces.length}</Text>
                </View>
                {aiPlaces.map((place:any, idx:number)=>(
                  <TouchableOpacity key={place.id}
                    style={{marginHorizontal:16, marginBottom:12, backgroundColor:'#fff',
                      borderRadius:12, padding:16, borderWidth:1, borderColor:'#f0f0f0',
                      shadowColor:'#000', shadowOpacity:0.04, shadowRadius:4}}
                    onPress={()=>openDetail(place)}>
                    <View style={{flexDirection:'row', alignItems:'center', gap:12}}>
                      <View style={{width:56, height:56, borderRadius:12, backgroundColor:'#f8f5f0',
                        justifyContent:'center', alignItems:'center', overflow:'hidden'}}>
                        {place.photo_url ? (
                          <Image source={{uri: place.photo_url}} style={{width:56, height:56, borderRadius:12}} resizeMode="cover" />
                        ) : (
                          <Text style={{fontSize:28}}>{place.emoji||'📍'}</Text>
                        )}
                      </View>
                      <View style={{flex:1}}>
                        <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
                          <Text style={{fontSize:13, fontWeight:'700', color:'#1a1a1a', flex:1}} numberOfLines={1}>{place.name}</Text>
                          <View style={{backgroundColor: idx===0?'#FFF3CD':idx===1?'#F0F0F0':idx===2?'#FDE8D8':'transparent',
                            paddingHorizontal:6, paddingVertical:2, borderRadius:8}}>
                            <Text style={{fontSize:10, fontWeight:'700', color: idx===0?'#F5A623':idx===1?'#888':idx===2?'#CD7F32':'transparent'}}>
                              {idx===0?'🥇':idx===1?'🥈':idx===2?'🥉':''}
                            </Text>
                          </View>
                        </View>
                        <Text style={{fontSize:11, color:'#888', marginTop:2}}>{place.city} · {place.district}</Text>
                        <View style={{flexDirection:'row', alignItems:'center', gap:4, marginTop:4}}>
                          <Text style={{fontSize:12, color:'#F5A623'}}>{'★'.repeat(Math.round(place.rating))}{'☆'.repeat(5-Math.round(place.rating))}</Text>
                          <Text style={{fontSize:11, color:'#888'}}>{place.rating}</Text>
                          {place.price_range&&<Text style={{fontSize:11, color:'#aaa', marginLeft:4}}>{place.price_range==='free'?'무료':place.price_range}</Text>}
                        </View>
                      </View>
                      <TouchableOpacity onPress={()=>toggleSave(place.id)} style={{padding:4}}>
                        <Text style={{fontSize:20}}>{saved.includes(place.id)?'❤️':'🤍'}</Text>
                      </TouchableOpacity>
                    </View>
                    {place.hours&&(
                      <View style={{marginTop:10, paddingTop:10, borderTopWidth:1, borderTopColor:'#f5f5f5',
                        flexDirection:'row', alignItems:'center', gap:6}}>
                        <Text style={{fontSize:11, color:'#888'}}>⏰ {place.hours}</Text>
                        {place.address&&<Text style={{fontSize:11, color:'#aaa', flex:1}} numberOfLines={1}>· {place.address}</Text>}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                <View style={{height:20}}/>
              </ScrollView>
            )}
          </View>
        )}

        {/* 커뮤니티 탭 */}
        {tab==='community'&&(
          <View style={{flex:1}}>
            <View style={s.communityHeader}>
              <View><Text style={s.communityTitle}>{L.community_title}</Text><Text style={s.communitySub}>{L.community_sub}</Text></View>
              <TouchableOpacity style={s.writeBtn} onPress={()=>setShowWriteModal(true)}><Text style={s.writeBtnText}>✏️ {L.write_post}</Text></TouchableOpacity>
            </View>
            <View style={{backgroundColor:'#fff', marginBottom:8, paddingVertical:12}}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, marginBottom:10}}>
                <Text style={{fontSize:15, fontWeight:'700', color:'#1a1a1a'}}>🏆 커뮤니티 베스트</Text>
                <View style={{flexDirection:'row', gap:8}}>
                  <TouchableOpacity onPress={()=>setCommunityBestTab('best')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:communityBestTab==='best'?'#C8102E':'#f0f0f0'}}>
                    <Text style={{fontSize:12, color:communityBestTab==='best'?'#fff':'#666', fontWeight:'600'}}>🏆 베스트</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setCommunityBestTab('daily')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:communityBestTab==='daily'?'#C8102E':'#f0f0f0'}}>
                    <Text style={{fontSize:12, color:communityBestTab==='daily'?'#fff':'#666', fontWeight:'600'}}>일일</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setCommunityBestTab('weekly')} style={{paddingHorizontal:12, paddingVertical:4, borderRadius:12, backgroundColor:communityBestTab==='weekly'?'#C8102E':'#f0f0f0'}}>
                    <Text style={{fontSize:12, color:communityBestTab==='weekly'?'#fff':'#666', fontWeight:'600'}}>주간</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {bestLoading?<ActivityIndicator size="small" color="#C8102E" style={{padding:16}}/>:(
                (communityBestTab==='best'?communityBestPosts:communityBestTab==='daily'?dailyBest:weeklyBest).length===0
                ? <Text style={{textAlign:'center', color:'#aaa', fontSize:13, padding:16}}>아직 게시글이 없습니다</Text>
                : (communityBestTab==='best'?communityBestPosts:communityBestTab==='daily'?dailyBest:weeklyBest).map((post:any, idx:number)=>(
                  <TouchableOpacity key={post.id} style={{flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:8, borderBottomWidth:idx<(communityBestTab==='best'?communityBestPosts:communityBestTab==='daily'?dailyBest:weeklyBest).length-1?1:0, borderBottomColor:'#f5f5f5'}}
                    onPress={()=>{setSelectedPost(post);loadComments(post.id)}}>
                    <Text style={{fontSize:16, fontWeight:'800', color:idx===0?'#F5A623':idx===1?'#888':idx===2?'#cd7f32':'#ccc', width:28}}>{idx+1}</Text>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:13, fontWeight:'600', color:'#1a1a1a'}} numberOfLines={1}>{post.title}</Text>
                      <Text style={{fontSize:11, color:'#aaa', marginTop:2}}>{post.user_name} · 👍 {post.likes} · 💬 {post.post_comments?.[0]?.count??0}</Text>
                    </View>
                    {post.photo_url&&<img src={post.photo_url} style={{width:44, height:44, borderRadius:6, objectFit:'cover' as any, marginLeft:8}}/>}
                  </TouchableOpacity>
                ))
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.postFilterRow}>
              {[{key:'latest',label:L.latest},{key:'best',label:`🏆 ${L.best}`},{key:'free',label:'자유'},{key:'food',label:'🍽️ 맛집'},{key:'spot',label:'📍 명소'},{key:'cafe',label:'☕ 카페'},{key:'activity',label:'🎯 액티비티'}].map(f=>(
                <TouchableOpacity key={f.key} style={[s.postFilterBtn,postFilter===f.key&&s.postFilterBtnActive]} onPress={()=>setPostFilter(f.key)}>
                  <Text style={[s.postFilterText,postFilter===f.key&&s.postFilterTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {postsLoading?<View style={s.center}><ActivityIndicator size="large" color="#C8102E"/></View>:(
              <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} scrollsToTop={true} onScroll={(e)=>{if(typeof window!=='undefined'){(window as any).__lastScrollY=e.nativeEvent.contentOffset.y;}}} scrollEventThrottle={16}>
                {posts.length===0&&<Text style={s.emptyText}>첫 번째 글을 작성해보세요!</Text>}
                {posts.filter(p=>postFilter==='latest'||postFilter==='best'?true:p.category===postFilter).map((post:any)=>{
                  const commentCount = post.post_comments?.[0]?.count ?? 0;
                  const displayCount = commentCount >= 100 ? '99+' : commentCount;
                  return (
                  <TouchableOpacity key={post.id} style={s.postCard} onPress={()=>{setSelectedPost(post);loadComments(post.id)}}>
                    {post.likes>=30&&<View style={s.bestBadge}><Text style={s.bestBadgeText}>🏆 BEST</Text></View>}
                    <View style={s.postHeader}>
                      {post.avatar_url ? (
                        <Image source={{uri: post.avatar_url}} style={{width:34, height:34, borderRadius:17}} />
                      ) : (
                        <View style={[s.postAvatar,{backgroundColor:getAvatarColor(post.user_name)}]}><Text style={s.postAvatarText}>{post.user_name[0]}</Text></View>
                      )}
                      <View style={{flex:1}}>
                        <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                          <TouchableOpacity
                            onPress={(e) => {
                              if (!post.user_id || post.user_id === user?.id) return;
                              setNicknameMenu({visible:true, userId:post.user_id, nickname:post.user_name, x:0, y:0});
                            }}
                            style={{cursor: 'pointer'} as any}>
                            <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
                              <Text style={{fontWeight:'bold', color:'#E8751A'}}>{post.user_name}</Text>
                              <Text style={{fontSize:12}}>{post.user_level_emoji || '✈️'}</Text>
                            </View>
                          </TouchableOpacity><Text style={s.postNation}>{post.nation}</Text>
                          {post.city&&<View style={s.postCityTag}><Text style={s.postCityTagText}>📍{post.city}</Text></View>}
                        </View>
                        <Text style={s.postTime}>{timeAgo(post.created_at)}</Text>
                      </View>
                    </View>
                    <Text style={s.postTitle}>{post.title}</Text>
                    {/* 미리보기 이미지 */}
                    {post.photo_url&&<img
                      src={post.photo_url}
                      style={{width:'100%', height:200, objectFit:'cover' as any, borderRadius:8, cursor:'pointer', marginTop:8, marginBottom:4, display:'block'}}
                      onClick={()=>setPhotoViewer(post.photo_url)}
                    />}
                    <Text style={s.postContent} numberOfLines={2}>{post.content}</Text>
                    <View style={s.postFooter}>
                      <TouchableOpacity style={s.likeBtn} onPress={()=>likePost(post)}><Text style={s.likeBtnText}>👍 {post.likes}</Text></TouchableOpacity>
                      <Text style={s.commentCount}>💬 {displayCount}</Text>
                      {/* 번역 버튼 */}
                      <TouchableOpacity style={s.translateBtn} onPress={()=>translateText(`post_${post.id}`,post.title+'\n'+post.content)}>
                        <Text style={s.translateBtnText}>{translating[`post_${post.id}`]?L.translating:`🌐 ${L.translate}`}</Text>
                      </TouchableOpacity>
                    </View>
                    {translations[`post_${post.id}`]&&<View style={s.translatedBox}><Text style={s.translatedText}>{translations[`post_${post.id}`]}</Text></View>}
                  </TouchableOpacity>
                  );})}
                <View style={{height:20}}/>
              </ScrollView>
            )}
          </View>
        )}

        {/* 나 탭 */}
        {tab==='profile'&&(
          <ScrollView style={{flex:1}} scrollsToTop={true} onScroll={(e)=>{if(typeof window!=='undefined'){(window as any).__lastScrollY=e.nativeEvent.contentOffset.y;}}} scrollEventThrottle={16}>
            {!user ? (
              <View style={{padding:40,alignItems:'center'}}>
                <Text style={{fontSize:40,marginBottom:16}}>👤</Text>
                <Text style={{fontSize:18,fontWeight:'700',marginBottom:8}}>로그인이 필요해요</Text>
                <Text style={{color:'#888',marginBottom:24,textAlign:'center'}}>로그인하고 여행 기록을 남겨보세요</Text>
                <TouchableOpacity style={{backgroundColor:'#C8102E',padding:16,borderRadius:10,width:'100%',alignItems:'center'}} onPress={()=>setShowAuthModal(true)}>
                  <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>로그인 / 회원가입</Text>
                </TouchableOpacity>
              </View>
            ) : (
            <>
            <View style={{flexDirection:'row', justifyContent:'flex-end', paddingHorizontal:16, paddingTop:12, backgroundColor:'#0D1B2A'}}>
              <TouchableOpacity onPress={() => { setShowNotifications(true); markAllRead(); }} style={{position:'relative', padding:6}}>
                <Text style={{fontSize:24}}>🔔</Text>
                {unreadCount > 0 && (
                  <View style={{position:'absolute', top:2, right:2, backgroundColor:'#C8102E', borderRadius:8, minWidth:16, height:16, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#fff', fontSize:10, fontWeight:'bold'}}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={s.profileHeader}>
              <TouchableOpacity onPress={handleProfileImageUpload} style={{alignItems:'center'}}>
                {profileImage ? (
                  <Image source={{uri: profileImage}} style={{width:80, height:80, borderRadius:40, borderWidth:2, borderColor:'#E8751A'}} />
                ) : (
                  <View style={{width:80, height:80, borderRadius:40, backgroundColor:'#E8751A', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'#fff'}}>
                    <Text style={{fontSize:36}}>✈️</Text>
                  </View>
                )}
                <Text style={{color:'#aaa', fontSize:11, marginTop:4}}>사진 변경</Text>
              </TouchableOpacity>
              <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
                <Text style={s.profileName}>{user?.user_metadata?.nickname||user?.email}</Text>
                <Text style={{fontSize:20}}>{getUserLevel(myPosts.length, myReviews.length, followStats.followers).emoji}</Text>
              </View>
              <Text style={{color:'#aaa', fontSize:13, marginTop:2}}>{getUserLevel(myPosts.length, myReviews.length, followStats.followers).name}</Text>
              {(() => {
                const progress = getLevelProgress(myPosts.length, myReviews.length, followStats.followers);
                const level = getUserLevel(myPosts.length, myReviews.length, followStats.followers).level;
                return (
                  <View style={{paddingHorizontal:24, marginTop:12, width:'100%'}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:4}}>
                      <Text style={{color:'#aaa', fontSize:11}}>
                        {level < 5 ? `다음 레벨: ${progress.nextLevel}` : '🎉 최고 레벨 달성!'}
                      </Text>
                      <Text style={{color:'#E8751A', fontSize:11, fontWeight:'bold'}}>
                        {level < 5 ? `${progress.current} / ${progress.target} ${progress.label}` : 'MAX'}
                      </Text>
                    </View>
                    <View style={{height:6, backgroundColor:'#333', borderRadius:3, overflow:'hidden'}}>
                      <View style={{
                        height:'100%' as any,
                        width:`${progress.percent}%` as any,
                        backgroundColor:'#E8751A',
                        borderRadius:3
                      }} />
                    </View>
                    {level < 5 && (
                      <Text style={{color:'#666', fontSize:10, marginTop:4, textAlign:'center'}}>
                        {progress.target - progress.current > 0
                          ? `${progress.target - progress.current}개 더 작성하면 레벨업!`
                          : '레벨업 조건 달성! 🎉'}
                      </Text>
                    )}
                  </View>
                );
              })()}
              {editingBio ? (
                <View style={{flexDirection:'row', alignItems:'center', gap:8, marginTop:8, paddingHorizontal:24}}>
                  <TextInput
                    value={userBio}
                    onChangeText={setUserBio}
                    placeholder="한줄 소개를 입력하세요"
                    placeholderTextColor="#aaa"
                    style={{flex:1, color:'#fff', borderBottomWidth:1, borderBottomColor:'#E8751A', paddingVertical:4, fontSize:14}}
                    maxLength={50}
                  />
                  <TouchableOpacity onPress={handleSaveBio}>
                    <Text style={{color:'#E8751A', fontWeight:'bold'}}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingBio(false)}>
                    <Text style={{color:'#aaa'}}>취소</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingBio(true)} style={{marginTop:8}}>
                  <Text style={{color:'#aaa', fontSize:13}}>
                    {user?.user_metadata?.bio || '+ 한줄 소개 추가'}
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{flexDirection:'row', gap:24, marginTop:8}}>
                <TouchableOpacity onPress={() => user && fetchFollowStats(user.id)}>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:16, color:'#fff'}}>{followStats.followers}</Text>
                  <Text style={{textAlign:'center', color:'#fff', fontSize:12}}>팔로워</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:16, color:'#fff'}}>{followStats.following}</Text>
                  <Text style={{textAlign:'center', color:'#fff', fontSize:12}}>팔로잉</Text>
                </TouchableOpacity>
              </View>
              {(()=>{const visitedCities=[...new Set(myPosts.map((p:any)=>p.city).filter(Boolean))];return visitedCities.length>0&&(
                <View style={{flexDirection:'row', flexWrap:'wrap', gap:6, paddingHorizontal:16, marginTop:8, justifyContent:'center'}}>
                  {visitedCities.map((city:any)=>(
                    <View key={city} style={{backgroundColor:'#E8751A', borderRadius:12, paddingHorizontal:10, paddingVertical:4}}>
                      <Text style={{color:'#fff', fontSize:12}}>📍 {city}</Text>
                    </View>
                  ))}
                </View>
              );})()}
              <View style={s.statRow}>
                <View style={s.statCell}><Text style={s.statVal}>{myReviewCount}</Text><Text style={s.statKey}>{L.review}</Text></View>
                <View style={s.statCell}><Text style={s.statVal}>{saved.length}</Text><Text style={s.statKey}>{L.saving}</Text></View>
                <View style={s.statCell}><Text style={s.statVal}>{myPosts.length}</Text><Text style={s.statKey}>{L.my_posts}</Text></View>
                <TouchableOpacity style={s.statCell} onPress={() => {}}>
                  <Text style={{color:'#E8751A', fontWeight:'bold', fontSize:16}}>{myReports.length}</Text>
                  <Text style={s.statKey}>제보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.statCell} onPress={() => { fetchMyMessages(); setShowMyMessages(true); }}>
                  <Text style={s.statVal}>✉️</Text><Text style={s.statKey}>메세지</Text>
                </TouchableOpacity>
              </View>
            </View>
            {(()=>{
              const mapHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([36.5, 127.5], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    var places = ${JSON.stringify(savedPlacesData.filter((p:any) => p.lat && p.lng))};
    places.forEach(function(place) {
      var marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindPopup(
        '<b>' + (place.emoji || '📍') + ' ' + place.name + '</b><br>' +
        place.city + ' · ' + place.category
      );
    });
  </script>
</body>
</html>`;
              return (
                <View style={{margin:16, backgroundColor:'#f5f5f5', borderRadius:16, overflow:'hidden'}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:16}}>
                    <Text style={{fontWeight:'bold', fontSize:15}}>🗺️ 내 여행 지도</Text>
                    <Text style={{color:'#E8751A', fontWeight:'bold', fontSize:13}}>
                      📍 {savedPlacesData.filter((p:any) => p.lat && p.lng).length}곳 저장됨
                    </Text>
                  </View>
                  {savedPlacesData.length === 0 ? (
                    <View style={{height:200, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{color:'#aaa'}}>저장한 장소가 없어요</Text>
                      <Text style={{color:'#aaa', fontSize:12, marginTop:4}}>탐색 탭에서 하트를 눌러보세요</Text>
                    </View>
                  ) : Platform.OS === 'web' ? (
                    <iframe
                      srcDoc={mapHtml}
                      style={{width:'100%', height:300, border:'none'} as any}
                      title="travel-map"
                    />
                  ) : (
                    <View style={{height:200, alignItems:'center', justifyContent:'center', backgroundColor:'#f0f0f0', borderRadius:12}}>
                      <Text style={{fontSize:40, marginBottom:8}}>🗺️</Text>
                      <Text style={{color:'#888', fontSize:14}}>저장한 장소: {savedPlacesData.length}곳</Text>
                      <Text style={{color:'#aaa', fontSize:12, marginTop:4}}>웹에서 지도를 확인하세요</Text>
                    </View>
                  )}
                  <View style={{padding:16, borderTopWidth:1, borderTopColor:'#eee'}}>
                    <Text style={{fontWeight:'bold', fontSize:13, marginBottom:8}}>저장한 장소</Text>
                    {savedPlacesData.slice(0,3).map((p:any) => (
                      <TouchableOpacity key={p.id} onPress={() => setSelectedPlace(p)}
                        style={{flexDirection:'row', alignItems:'center', gap:8, paddingVertical:6}}>
                        <Text style={{fontSize:18}}>{p.emoji || '📍'}</Text>
                        <View style={{flex:1}}>
                          <Text style={{fontWeight:'bold', fontSize:13}}>{p.name}</Text>
                          <Text style={{color:'#888', fontSize:11}}>{p.city}</Text>
                        </View>
                        <Text style={{color:'#E8751A', fontSize:12}}>›</Text>
                      </TouchableOpacity>
                    ))}
                    {savedPlacesData.length > 3 && (
                      <Text style={{color:'#E8751A', textAlign:'center', marginTop:8, fontSize:13}}>
                        +{savedPlacesData.length - 3}곳 더 보기
                      </Text>
                    )}
                  </View>
                </View>
              );
            })()}
            <View style={{padding:16}}>
              <Text style={s.sectionTitle}>✏️ {L.my_posts}</Text>
              {myPosts.filter((p:any)=>p.photo_url).length>0&&(
                <View style={{flexDirection:'row', flexWrap:'wrap', gap:2, marginBottom:16}}>
                  {myPosts.filter((p:any)=>p.photo_url).map((p:any)=>(
                    <TouchableOpacity key={p.id} style={{width:'32.5%', aspectRatio:1}}
                      onPress={()=>setSelectedPost(p)}>
                      <Image source={{uri:p.photo_url}} style={{width:'100%', height:'100%'}} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {myPosts.length===0?<Text style={s.emptyText}>{L.no_posts}</Text>:myPosts.filter((post:any)=>!post.photo_url).map((post:any)=>(
                <View key={post.id} style={s.myPostCard}>
                  <TouchableOpacity onPress={()=>{setSelectedPost(post);loadComments(post.id)}}>
                    {post.photo_url&&<Image source={{uri:post.photo_url}} style={s.myPostImg} resizeMode="cover"/>}
                    <Text style={s.myPostTitle}>{post.title}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}>
                      <Text style={s.myPostMeta}>{post.city||'전체'} · {timeAgo(post.created_at)}</Text>
                      <Text style={s.myPostLikes}>👍 {post.likes}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row',gap:8,marginTop:10,borderTopWidth:1,borderTopColor:'#eee',paddingTop:10}}>
                    <TouchableOpacity 
                      style={[s.myPostActionBtn,{flex:1,backgroundColor:'#f0f4ff'}]} 
                      onPress={()=>openEditModal(post)}
                      disabled={postSubmitting}
                    >
                      <Text style={{color:'#1565C0',fontWeight:'700',fontSize:12}}>✏️ 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[s.myPostActionBtn,{flex:1,backgroundColor:'#fff5f5'}]} 
                      onPress={()=>deletePost(post.id)}
                      disabled={postSubmitting}
                    >
                      {postSubmitting ? (
                        <ActivityIndicator size="small" color="#C8102E"/>
                      ) : (
                        <Text style={{color:'#C8102E',fontWeight:'700',fontSize:12}}>🗑 삭제</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <Text style={s.sectionTitle}>⭐ 내 리뷰</Text>
              {myReviews.length===0 ? <Text style={s.emptyText}>작성한 리뷰가 없습니다</Text> : myReviews.map((review:any)=>(
                <View key={review.id} style={s.myPostCard}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:6}}>
                    <Text style={{fontSize:20}}>{review.places?.emoji || '📍'}</Text>
                    <Text style={{fontWeight:'700',fontSize:14,color:'#1a1a1a',flex:1}}>{review.places?.name || '장소'}</Text>
                    <Text style={{color:'#f5a623',fontSize:13}}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</Text>
                  </View>
                  {editingReview?.id===review.id ? (
                    <View>
                      <View style={{flexDirection:'row',gap:8,marginBottom:10}}>
                        {[1,2,3,4,5].map(star=> (
                          <TouchableOpacity key={star} onPress={()=>setEditReviewRating(star)}>
                            <Text style={{fontSize:20,color: star<=editReviewRating ? '#f5a623' : '#ccc'}}>{'★'}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <TextInput
                        style={[s.input,s.textarea,{backgroundColor:'#fff'}]}
                        multiline
                        value={editReviewContent}
                        onChangeText={setEditReviewContent}
                        placeholder='리뷰 내용을 입력하세요'
                        placeholderTextColor='#bbb'
                      />
                      <View style={{flexDirection:'row',gap:8,marginTop:10}}>
                        <TouchableOpacity style={[s.myPostActionBtn,{flex:1,backgroundColor:'#f0f4ff'}]} onPress={async ()=>{
                          const { error } = await supabase.from('reviews').update({ rating:editReviewRating, content:editReviewContent }).eq('id',editingReview.id)
                          if (!error) {
                            await loadMyData()
                            setEditingReview(null)
                          } else {
                            Alert.alert('오류','리뷰 수정에 실패했습니다')
                          }
                        }}>
                          <Text style={{color:'#1565C0',fontWeight:'700',fontSize:12}}>💾 저장</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.myPostActionBtn,{flex:1,backgroundColor:'#fff5f5'}]} onPress={()=>{ setEditingReview(null) }}>
                          <Text style={{color:'#C8102E',fontWeight:'700',fontSize:12}}>✕ 취소</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={{fontSize:13,color:'#444',lineHeight:18}}>{review.content}</Text>
                      <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}>
                        <Text style={s.myPostMeta}>{timeAgo(review.created_at)}</Text>
                        <View style={{flexDirection:'row',gap:12}}>
                          <TouchableOpacity onPress={()=>{
                            setEditingReview(review)
                            setEditReviewContent(review.content)
                            setEditReviewRating(review.rating)
                          }}>
                            <Text style={{color:'#1565C0',fontSize:12}}>✏️ 수정</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            if(window.confirm('리뷰를 삭제하시겠습니까?')) {
                              supabase.from('reviews').delete().eq('id',review.id).then(()=>loadMyData())
                            }
                          }}>
                            <Text style={{color:'#C8102E',fontSize:12}}>🗑 삭제</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}
              {myReports.length > 0 && (
                <View style={{marginTop:24}}>
                  <Text style={{fontSize:16, fontWeight:'bold', marginBottom:12}}>📌 내 장소 제보</Text>
                  {myReports.map(report => (
                    <View key={report.id} style={{backgroundColor:'#fff', borderRadius:12, padding:16, marginBottom:8, borderWidth:1, borderColor:'#f0f0f0'}}>
                      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
                        <Text style={{fontWeight:'bold', fontSize:14}}>{report.name}</Text>
                        <View style={{backgroundColor: report.status === 'deleted' ? '#f5f5f5' : report.status === 'pending' ? '#fff8f0' : report.status === 'approved' ? '#f0fff0' : '#fff0f0', paddingHorizontal:8, paddingVertical:4, borderRadius:8}}>
                          <Text style={{fontSize:12, color: report.status === 'deleted' ? '#888' : report.status === 'pending' ? '#E8751A' : report.status === 'approved' ? '#2e7d32' : '#c62828'}}>
                            {report.status === 'deleted' ? '🗑️ 삭제됨' : report.status === 'pending' ? '⏳ 검토중' : report.status === 'approved' ? '✅ 등록완료' : '❌ 반려'}
                          </Text>
                        </View>
                      </View>
                      <Text style={{color:'#888', fontSize:12}}>{report.category} · {report.city}</Text>
                      <Text style={{color:'#aaa', fontSize:11, marginTop:4}}>{new Date(report.created_at).toLocaleDateString('ko-KR')}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={{padding:16, alignItems:'center', gap:8, marginTop:20, borderTopWidth:1, borderTopColor:'#eee'}}>
                <TouchableOpacity onPress={()=>setShowTermsModal(true)}>
                  <Text style={{fontSize:12, color:'#999', textDecorationLine:'underline'}}>이용약관</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setShowPrivacyModal(true)}>
                  <Text style={{fontSize:12, color:'#999', textDecorationLine:'underline'}}>개인정보처리방침</Text>
                </TouchableOpacity>
                <Text style={{fontSize:11, color:'#bbb', marginTop:4}}>© 2025 KcultureMAP. All rights reserved.</Text>
              </View>
            </View>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => { setShowAdminPage(true); fetchPlaceReports(); }}
                style={{backgroundColor:'#1a1a2e', padding:16, borderRadius:12, alignItems:'center', marginHorizontal:16, marginBottom:12, flexDirection:'row', justifyContent:'center', gap:8}}>
                <Text style={{fontSize:18}}>⚙️</Text>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:15}}>관리자 페이지</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={signOut} style={{margin:16,padding:12,borderWidth:1,borderColor:'#ddd',borderRadius:8,alignItems:'center'}}>
              <Text style={{color:'#888'}}>로그아웃</Text>
            </TouchableOpacity>
            </>
            )}
          </ScrollView>
        )}

        {/* 하단 탭바 */}
        <View style={[s.tabBar, {paddingBottom: Platform.OS === 'android' ? 16 : 0}]}>
          {[{key:'community',icon:'💬',label:L.nav_feed},{key:'explore',icon:'🗺',label:L.nav_explore},{key:'ai',icon:'✨',label:L.nav_ai},{key:'profile',icon:'👤',label:L.nav_me}].map(t=>(
            <TouchableOpacity key={t.key} style={s.tabBtn} onPress={()=>{setTab(t.key);if(t.key==='ai')loadAiPlaces('food')}}>
              <Text style={[s.tabIcon,tab===t.key&&s.tabIconActive]}>{t.icon}</Text>
              <Text style={[s.tabLabel,tab===t.key&&s.tabLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 글쓰기 모달 */}
        <Modal visible={showWriteModal} animationType="slide" onRequestClose={()=>setShowWriteModal(false)}>
          <SafeAreaView style={{flex:1,backgroundColor:'#F8F5F0'}}>
            <View style={s.writeModalHeader}>
              <TouchableOpacity onPress={()=>setShowWriteModal(false)}><Text style={{fontSize:20,color:'#666'}}>✕</Text></TouchableOpacity>
              <Text style={s.writeModalTitle}>✏️ {L.write_post}</Text>
              <TouchableOpacity onPress={submitPost} disabled={postSubmitting}><Text style={[s.writeModalSubmit,postSubmitting&&{opacity:0.5}]}>{L.post_submit}</Text></TouchableOpacity>
            </View>
            <ScrollView style={{padding:16}}>
              <View style={s.postCatRow}>
                {[{k:'free',label:'자유'},{k:'food',label:'🍽️ 맛집'},{k:'spot',label:'📍 명소'},{k:'cafe',label:'☕ 카페'},{k:'activity',label:'🎯 액티비티'}].map(c=>(
                  <TouchableOpacity key={c.k} style={[s.postCatBtn,postCategory===c.k&&s.postCatBtnActive]} onPress={()=>setPostCategory(c.k)}>
                    <Text style={[s.postCatText,postCategory===c.k&&s.postCatTextActive]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={s.postCatBtn} onPress={() => { setShowPlaceReport(true); setShowWriteModal(false); }}>
                  <Text style={s.postCatText}>📌 장소제보</Text>
                </TouchableOpacity>
              </View>
              <TextInput style={s.writeTitleInput} placeholder={L.post_title} value={postTitle} onChangeText={setPostTitle} placeholderTextColor="#bbb"/>
              <TextInput style={s.writeCityInput} placeholder={L.post_city} value={postCity} onChangeText={setPostCity} placeholderTextColor="#bbb"/>

              {/* 사진 추가 버튼 */}
              <TouchableOpacity style={s.addPhotoBtn} onPress={pickImage} disabled={postPhotoUploading}>
                {postPhotoUploading
                  ? <ActivityIndicator size="small" color="#C8102E"/>
                  : <Text style={s.addPhotoBtnText}>📷 {L.add_photo}</Text>
                }
              </TouchableOpacity>

              {/* 사진 미리보기 */}
              {postPhoto&&(
                <View style={{marginBottom:12,position:'relative'}}>
                  <Image source={{uri:postPhoto}} style={s.photoPreview} resizeMode="cover"/>
                  <TouchableOpacity style={s.removePhotoBtn} onPress={()=>setPostPhoto(null)}>
                    <Text style={{color:'#fff',fontSize:14,fontWeight:'700'}}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TextInput style={s.writeContentInput} placeholder={L.post_content} value={postContent} onChangeText={setPostContent} multiline placeholderTextColor="#bbb"/>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* 게시글 수정 모달 */}
        <Modal visible={showEditModal} animationType="slide" onRequestClose={closeEditModal}>
          <SafeAreaView style={{flex:1,backgroundColor:'#F8F5F0'}}>
            <View style={s.writeModalHeader}>
              <TouchableOpacity onPress={closeEditModal}><Text style={{fontSize:20,color:'#666'}}>✕</Text></TouchableOpacity>
              <Text style={s.writeModalTitle}>✏️ 게시글 수정</Text>
              <TouchableOpacity onPress={updatePost} disabled={postSubmitting}><Text style={[s.writeModalSubmit,postSubmitting&&{opacity:0.5}]}>{postSubmitting?editBtn.editing:'완료'}</Text></TouchableOpacity>
            </View>
            <ScrollView style={{padding:16}}>
              <View style={s.postCatRow}>
                {[{k:'free',label:'자유'},{k:'food',label:'🍽️ 맛집'},{k:'spot',label:'📍 명소'},{k:'cafe',label:'☕ 카페'},{k:'activity',label:'🎯 액티비티'}].map(c=>(
                  <TouchableOpacity key={c.k} style={[s.postCatBtn,editCategory===c.k&&s.postCatBtnActive]} onPress={()=>setEditCategory(c.k)}>
                    <Text style={[s.postCatText,editCategory===c.k&&s.postCatTextActive]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={s.writeTitleInput} placeholder={L.post_title} value={editTitle} onChangeText={setEditTitle} placeholderTextColor="#bbb"/>
              <TextInput style={s.writeCityInput} placeholder={L.post_city} value={editCity} onChangeText={setEditCity} placeholderTextColor="#bbb"/>

              {/* 사진 변경 버튼 */}
              <TouchableOpacity style={s.addPhotoBtn} onPress={pickEditImage} disabled={editPhotoUploading}>
                {editPhotoUploading
                  ? <ActivityIndicator size="small" color="#C8102E"/>
                  : <Text style={s.addPhotoBtnText}>📷 {L.add_photo}</Text>
                }
              </TouchableOpacity>

              {/* 사진 미리보기 */}
              {editPhoto&&(
                <View style={{marginBottom:12,position:'relative'}}>
                  <Image source={{uri:editPhoto}} style={s.photoPreview} resizeMode="cover"/>
                  <TouchableOpacity style={s.removePhotoBtn} onPress={()=>setEditPhoto(null)}>
                    <Text style={{color:'#fff',fontSize:14,fontWeight:'700'}}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TextInput style={s.writeContentInput} placeholder={L.post_content} value={editContent} onChangeText={setEditContent} multiline placeholderTextColor="#bbb"/>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* 게시글 상세 모달 */}
        <Modal visible={!!selectedPost} animationType="slide" onRequestClose={()=>{
          setSelectedPost(null)
          setReplyTo(null)
          setShowEditModal(false)
          setEditingPost(null)
        }}>
          {selectedPost&&(
            <SafeAreaView style={{flex:1,backgroundColor:'#F8F5F0'}}>
              <View style={s.writeModalHeader}>
                <TouchableOpacity onPress={()=>{
                  setSelectedPost(null)
                  setReplyTo(null)
                  setShowEditModal(false)
                  setEditingPost(null)
                }}><Text style={{fontSize:20,color:'#666'}}>←</Text></TouchableOpacity>
                <Text style={s.writeModalTitle}>{L.community_title}</Text>
                <View style={{width:24}}/>
              </View>
              <ScrollView style={{flex:1}}>
                <View style={s.postDetailCard}>
                  <View style={s.postHeader}>
                    {selectedPost.avatar_url ? (
                      <Image source={{uri: selectedPost.avatar_url}} style={{width:34, height:34, borderRadius:17}} />
                    ) : (
                      <View style={[s.postAvatar,{backgroundColor:getAvatarColor(selectedPost.user_name)}]}><Text style={s.postAvatarText}>{selectedPost.user_name[0]}</Text></View>
                    )}
                    <View>
                      <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                        <TouchableOpacity
                          onPress={() => selectedPost.user_id && selectedPost.user_id !== user?.id && setNicknameMenu({visible:true, userId:selectedPost.user_id, nickname:selectedPost.user_name, x:0, y:0})}
                          style={{cursor: 'pointer'} as any}>
                          <Text style={{fontWeight:'bold', color:'#E8751A'}}>{selectedPost.user_name}</Text>
                        </TouchableOpacity><Text style={s.postNation}>{selectedPost.nation}</Text>
                        {selectedPost.city&&<View style={s.postCityTag}><Text style={s.postCityTagText}>📍{selectedPost.city}</Text></View>}
                      </View>
                      <Text style={s.postTime}>{timeAgo(selectedPost.created_at)}</Text>
                    </View>
                  </View>
                  <Text style={s.postDetailTitle}>{selectedPost.title}</Text>
                  {/* 상세 이미지 */}
                  {selectedPost.photo_url&&<img
                    src={selectedPost.photo_url}
                    style={{width:'100%', height:240, objectFit:'cover' as any, borderRadius:8, cursor:'pointer', marginBottom:8, display:'block'}}
                    onClick={()=>setPhotoViewer(selectedPost.photo_url)}
                  />}
                  <Text style={s.postDetailContent}>{selectedPost.content}</Text>
                  <View style={{flexDirection:'row',gap:10,marginTop:12,flexWrap:'wrap'}}>
                    <TouchableOpacity style={s.likeBtn} onPress={()=>likePost(selectedPost)}><Text style={s.likeBtnText}>👍 {L.likes} {selectedPost.likes}</Text></TouchableOpacity>
                    <TouchableOpacity style={s.translateBtn} onPress={()=>translateText(`detail_${selectedPost.id}`,selectedPost.title+'\n'+selectedPost.content)}>
                      <Text style={s.translateBtnText}>{translating[`detail_${selectedPost.id}`]?L.translating:`🌐 ${L.translate}`}</Text>
                    </TouchableOpacity>
                    {(user?.id && user.id === selectedPost.user_id)&&(
                      <>
                        <TouchableOpacity 
                          style={[s.translateBtn,{backgroundColor:'#f0f4ff'}]} 
                          onPress={() => {
                            setSelectedPost(null)
                            openEditModal(selectedPost)
                          }}
                        >
                          <Text style={{color:'#1565C0',fontWeight:'600',fontSize:11}}>✏️ 수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[s.translateBtn,{backgroundColor:'#fff5f5'}]} 
                          onPress={()=>deletePost(selectedPost.id)}
                          disabled={postSubmitting}
                        >
                          {postSubmitting ? (
                            <ActivityIndicator size="small" color="#C8102E"/>
                          ) : (
                            <Text style={{color:'#C8102E',fontWeight:'600',fontSize:11}}>🗑 삭제</Text>
                          )}
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  {translations[`detail_${selectedPost.id}`]&&<View style={s.translatedBox}><Text style={s.translatedText}>{translations[`detail_${selectedPost.id}`]}</Text></View>}
                </View>

                {/* 댓글 + 대댓글 */}
                <View style={{padding:16}}>
                  <Text style={s.sectionTitle}>💬 {L.comments} {postComments.length}</Text>
                  {topComments.map((c:any)=>(
                    <View key={c.id}>
                      {/* 댓글 */}
                      <View style={s.commentCard}>
                        <View style={[s.commentAvatar,{backgroundColor:getAvatarColor(c.user_name)}]}><Text style={{color:'#fff',fontSize:11,fontWeight:'700'}}>{c.user_name[0]}</Text></View>
                        <View style={{flex:1}}>
                          <Text style={s.commentUser}>{c.user_name}</Text>
                          <Text style={s.commentContent}>{c.content}</Text>
                          <View style={{flexDirection:'row',gap:10,marginTop:4}}>
                            <Text style={s.commentTime}>{timeAgo(c.created_at)}</Text>
                            <TouchableOpacity onPress={()=>setReplyTo(c)}><Text style={s.replyBtn}>↩ {L.reply}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={()=>translateText(`comment_${c.id}`,c.content)}><Text style={s.replyBtn}>{translating[`comment_${c.id}`]?'...':'🌐'}</Text></TouchableOpacity>
                          </View>
                          {translations[`comment_${c.id}`]&&<View style={[s.translatedBox,{marginTop:4}]}><Text style={s.translatedText}>{translations[`comment_${c.id}`]}</Text></View>}
                        </View>
                      </View>
                      {/* 대댓글 */}
                      {getReplies(c.id).map((r:any)=>(
                        <View key={r.id} style={s.replyCard}>
                          <Text style={s.replyLine}>│</Text>
                          <View style={[s.commentAvatar,{backgroundColor:getAvatarColor(r.user_name),width:24,height:24,borderRadius:12}]}><Text style={{color:'#fff',fontSize:9,fontWeight:'700'}}>{r.user_name[0]}</Text></View>
                          <View style={{flex:1}}>
                            <Text style={s.commentUser}>{r.user_name}</Text>
                            <Text style={s.commentContent}>{r.content}</Text>
                            <View style={{flexDirection:'row',gap:10,marginTop:4}}>
                              <Text style={s.commentTime}>{timeAgo(r.created_at)}</Text>
                              <TouchableOpacity onPress={()=>translateText(`reply_${r.id}`,r.content)}><Text style={s.replyBtn}>{translating[`reply_${r.id}`]?'...':'🌐'}</Text></TouchableOpacity>
                            </View>
                            {translations[`reply_${r.id}`]&&<View style={[s.translatedBox,{marginTop:4}]}><Text style={s.translatedText}>{translations[`reply_${r.id}`]}</Text></View>}
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* 대댓글 표시 + 댓글 입력 */}
              {replyTo&&(
                <View style={s.replyToBar}>
                  <Text style={s.replyToText}>↩ {L.reply_to} {replyTo.user_name}</Text>
                  <TouchableOpacity onPress={()=>setReplyTo(null)}><Text style={{color:'#aaa',fontSize:16}}>✕</Text></TouchableOpacity>
                </View>
              )}
              <View style={s.commentInputRow}>
                <TextInput style={s.commentInput} placeholder={replyTo?L.write_reply:L.comments+'...'} value={commentText} onChangeText={setCommentText} placeholderTextColor="#bbb"/>
                <TouchableOpacity style={s.commentSubmitBtn} onPress={submitComment}>
                  <Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>↑</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}
        </Modal>

        {/* 지역 선택 모달 */}
        <Modal visible={showRegionModal} animationType="slide" onRequestClose={()=>setShowRegionModal(false)}>
          <SafeAreaView style={s.regionModalSafe}>
            <View style={s.regionModalHeader}>
              <TouchableOpacity onPress={()=>setShowRegionModal(false)}><Text style={s.regionModalClose}>✕</Text></TouchableOpacity>
              <Text style={s.regionModalTitle}>{L.region_select}</Text>
              <View style={{width:24}}/>
            </View>
            <View style={s.regionBody}>
              <ScrollView style={s.regionLeft} showsVerticalScrollIndicator={false}>
                {REGION_DATA.map(region=>(
                  <TouchableOpacity key={region.id} style={[s.regionLeftItem,tempRegion.id===region.id&&s.regionLeftItemActive]} onPress={()=>setTempRegion(region)}>
                    <Text style={[s.regionLeftText,tempRegion.id===region.id&&s.regionLeftTextActive]}>{region.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={s.regionRight} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={s.regionRightHeader} onPress={()=>{setSelectedRegion(tempRegion);setSelectedDistrict('전체');setShowRegionModal(false)}}>
                  <Text style={s.regionRightHeaderText}>{tempRegion.label} {L.all_region}</Text>
                  <Text style={s.regionRightArrow}>›</Text>
                </TouchableOpacity>
                {tempRegion.districts.map((d:string)=>(
                  <TouchableOpacity key={d} style={[s.regionRightItem,selectedDistrict===d&&selectedRegion.id===tempRegion.id&&s.regionRightItemActive]} onPress={()=>{setSelectedRegion(tempRegion);setSelectedDistrict(d);setShowRegionModal(false)}}>
                    <Text style={[s.regionRightText,selectedDistrict===d&&selectedRegion.id===tempRegion.id&&s.regionRightTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
                {tempRegion.id==='all'&&<Text style={s.regionAllDesc}>전국의 모든 장소를 탐색합니다</Text>}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* 언어 선택 모달 */}
        <Modal visible={showLangModal} transparent animationType="slide" onRequestClose={()=>setShowLangModal(false)}>
          <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={()=>setShowLangModal(false)}>
            <ScrollView style={s.langPanel} showsVerticalScrollIndicator={false}>
              <View style={s.langHandle}/>
              <Text style={s.langPanelTitle}>🌐 언어 선택 / Language</Text>
              {[{region:'동아시아 East Asia',codes:['ko','en','zh','ja','tw','th']},{region:'동남아시아 SE Asia',codes:['vi','id','ms']},{region:'서구권 Western',codes:['es','fr','de','pt','ru','ar']}].map(group=>(
                <View key={group.region}>
                  <Text style={s.langRegion}>{group.region}</Text>
                  <View style={s.langGrid}>
                    {group.codes.map(code=>LANGS[code]?(
                      <TouchableOpacity key={code} style={[s.langOpt,lang===code&&s.langOptActive]} onPress={()=>{setLang(code);setShowLangModal(false)}}>
                        <Text style={{fontSize:22}}>{LANGS[code].flag}</Text>
                        <Text style={[s.langOptName,lang===code&&{color:'#fff'}]}>{LANGS[code].name}</Text>
                      </TouchableOpacity>
                    ):null)}
                  </View>
                </View>
              ))}
              <View style={{height:30}}/>
            </ScrollView>
          </TouchableOpacity>
        </Modal>

        {/* 길찾기 모달 */}
        <Modal visible={showRouteModal} transparent animationType="slide" onRequestClose={()=>setShowRouteModal(false)}>
          <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={()=>setShowRouteModal(false)}>
            <View style={s.routePanel}>
              <View style={s.langHandle}/>
              <Text style={s.routeTitle}>🗺 {selectedPlace?.name}</Text>
              <Text style={s.routeSub}>{selectedPlace?.address}</Text>
              <View style={s.transportRow}>
                {(['subway','bus','taxi','walk'] as const).map(tr=>(
                  <TouchableOpacity key={tr} style={[s.trTab,routeTransport===tr&&s.trTabActive]} onPress={()=>setRouteTransport(tr)}>
                    <Text style={{fontSize:15}}>{tr==='subway'?'🚇':tr==='bus'?'🚌':tr==='taxi'?'🚕':'🚶'}</Text>
                    <Text style={[s.trTabText,routeTransport===tr&&s.trTabTextActive]}>{tr==='subway'?L.subway:tr==='bus'?L.bus:tr==='taxi'?L.taxi:L.walk}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={s.routeInfoRow}>
                <View style={s.routeInfoCell}><Text style={s.routeInfoVal}>{routeData.time}</Text><Text style={s.routeInfoKey}>{L.time}</Text></View>
                <View style={s.routeInfoCell}><Text style={s.routeInfoVal}>{routeData.dist}</Text><Text style={s.routeInfoKey}>{L.dist}</Text></View>
                <View style={s.routeInfoCell}><Text style={s.routeInfoVal}>{routeData.cost}</Text><Text style={s.routeInfoKey}>{L.fare}</Text></View>
              </View>
              {routeData.steps.map((st:any)=>(
                <View key={st.n} style={s.routeStep}>
                  <View style={s.stepNum}><Text style={{color:'#fff',fontSize:10,fontWeight:'700'}}>{st.n}</Text></View>
                  <View><Text style={s.stepText}>{st.t}</Text>{!!st.m&&<Text style={s.stepMeta}>{st.m}</Text>}</View>
                </View>
              ))}
              <TouchableOpacity style={s.openMapBtn} onPress={()=>{setShowRouteModal(false);if(selectedPlace)openGoogleMaps(selectedPlace)}}>
                <Text style={s.openMapBtnText}>{L.open_map}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 장소 상세 모달 */}
        <Modal visible={!!selectedPlace} animationType="slide" onRequestClose={()=>setSelectedPlace(null)}>
          {selectedPlace&&(
            <View style={s.detailContainer}>
              <View style={[s.detailImg,{backgroundColor:CAT_BG[selectedPlace.category]||'#f5f0e8'}]}>
                {selectedPlace.photo_url ? (
                  <TouchableOpacity
                    onPress={() => setFullscreenImage(selectedPlace.photo_url)}
                    style={{width:'100%' as any, height:200, borderRadius:12, overflow:'hidden', marginBottom:8}}>
                    <Image
                      source={{uri: selectedPlace.photo_url}}
                      style={{width:'100%' as any, height:'100%' as any}}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={{fontSize:76}}>{selectedPlace.emoji}</Text>
                )}
                <TouchableOpacity style={s.closeBtn} onPress={()=>setSelectedPlace(null)}><Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>✕</Text></TouchableOpacity>
                <TouchableOpacity style={[s.detailHeart,saved.includes(selectedPlace.id)&&s.heartSaved]} onPress={()=>toggleSave(selectedPlace.id)}><Text style={{color:'#fff',fontSize:18}}>♥</Text></TouchableOpacity>
              </View>
              <ScrollView style={s.detailBody}>
                <Text style={s.detailName}>{selectedPlace.name}</Text>
                <View style={s.detailMetaRow}>
                  <Text style={s.detailMeta}>⭐ {selectedPlace.rating} · {selectedPlace.city}</Text>
                  {selectedPlace.district&&<Text style={s.detailMeta}> · {selectedPlace.district}</Text>}
                  <Text style={[s.detailMeta,{color:selectedPlace.is_open?'#1A7A4A':'#C8102E',fontWeight:'600'}]}>{' · '}{selectedPlace.is_open?L.open:L.closed}</Text>
                </View>
                <View style={s.infoGrid}>
                  {selectedPlace.hours&&<View style={s.infoChip}><Text style={s.infoLabel}>🕐 {L.hours}</Text><Text style={s.infoVal}>{selectedPlace.hours}</Text></View>}
                  {selectedPlace.price_range&&<View style={s.infoChip}><Text style={s.infoLabel}>💰 {L.price}</Text><Text style={s.infoVal}>{selectedPlace.price_range}</Text></View>}
                  <View style={[s.infoChip,{width:'100%'}]}><Text style={s.infoLabel}>📍 주소</Text><Text style={s.infoVal}>{selectedPlace.address}</Text></View>
                </View>
                {selectedPlace.reported_by && (
                  <View style={{flexDirection:'row', alignItems:'center', gap:6, marginTop:8, padding:12, backgroundColor:'#fff8f0', borderRadius:8}}>
                    <Text style={{fontSize:14}}>📌</Text>
                    <Text style={{fontSize:13, color:'#E8751A'}}>
                      <Text style={{fontWeight:'bold'}}>{selectedPlace.reported_by}</Text>님이 제보한 장소
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={s.btnGmap} onPress={()=>openGoogleMaps(selectedPlace)}><Text style={s.btnGmapText}>🗺 {L.open_map}</Text></TouchableOpacity>
                <Text style={s.sectionTitle}>💬 {L.review} {reviews.length}개</Text>
                {reviews.length===0?<Text style={s.emptyReview}>첫 번째 리뷰를 남겨보세요!</Text>:reviews.map((r:any)=>(
                  <View key={r.id} style={s.reviewCard}>
                    <View style={s.reviewHeader}>
                      <View style={[s.reviewAvatar,{backgroundColor:getAvatarColor(r.user_name||'익명')}]}><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>{(r.user_name||'익명')[0]}</Text></View>
                      <View><Text style={s.reviewName}>{r.user_name||'익명'}</Text><Text style={s.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</Text></View>
                    </View>
                    <Text style={s.reviewContent}>{r.content}</Text>
                  </View>
                ))}
                <Text style={s.sectionTitle}>✏️ {L.writeReview}</Text>
                <View style={s.reviewForm}>
                  <Text style={s.starLabel}>별점</Text>
                  <View style={s.starRow}>{[1,2,3,4,5].map(st=><TouchableOpacity key={st} onPress={()=>setReviewStar(st)}><Text style={[s.star,st<=reviewStar&&s.starOn]}>★</Text></TouchableOpacity>)}</View>
                  <TextInput style={[s.input,s.textarea]} placeholder="솔직한 후기를 남겨주세요..." value={reviewText} onChangeText={setReviewText} multiline placeholderTextColor="#bbb"/>
                  <TouchableOpacity style={[s.submitBtn,submitting&&{opacity:0.6}]} onPress={submitReview} disabled={submitting}><Text style={s.submitBtnText}>{submitting?'등록 중...':L.submit}</Text></TouchableOpacity>
                </View>
                <View style={{height:40}}/>
              </ScrollView>
            </View>
          )}
        </Modal>
        <Modal visible={showPrivacyModal} animationType="slide" onRequestClose={()=>setShowPrivacyModal(false)}>
          <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row', alignItems:'center', padding:16, borderBottomWidth:1, borderBottomColor:'#eee'}}>
              <TouchableOpacity onPress={()=>setShowPrivacyModal(false)}>
                <Text style={{fontSize:16, color:'#C8102E'}}>✕ 닫기</Text>
              </TouchableOpacity>
              <Text style={{flex:1, textAlign:'center', fontWeight:'700', fontSize:16}}>개인정보처리방침</Text>
            </View>
            <ScrollView style={{flex:1, padding:20}}>
              <Text style={{fontSize:14, lineHeight:24, color:'#333'}}>
{`K컬처MAP 개인정보처리방침\n\n시행일: 2025년 1월 1일\n\n1. 수집하는 개인정보 항목\n- 서비스 이용 시 사용자가 직접 입력한 닉네임, 게시글, 댓글, 리뷰 내용\n- 사용자가 업로드한 사진\n- 서비스 이용 기록\n\n2. 개인정보 수집 및 이용 목적\n- 커뮤니티 서비스 제공\n- 여행지 리뷰 서비스 제공\n- 서비스 개선 및 신규 서비스 개발\n\n3. 개인정보 보유 및 이용 기간\n- 서비스 이용 기간 동안 보유\n- 사용자 요청 시 즉시 삭제\n\n4. 개인정보의 제3자 제공\n- 원칙적으로 외부에 제공하지 않습니다.\n- 법령에 의한 경우 예외적으로 제공될 수 있습니다.\n\n5. 개인정보 처리 위탁\n- Supabase (데이터 저장 및 관리)\n- Vercel (서비스 호스팅)\n\n6. 이용자의 권리\n- 개인정보 열람, 수정, 삭제 요청 가능\n- 아래 이메일로 문의하시기 바랍니다.\n\n7. 개인정보 보호책임자\n- 이메일: hellsong90@gmail.com\n\n8. 개인정보처리방침 변경\n- 변경 시 앱 내 공지를 통해 안내합니다.`}
              </Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
        <Modal visible={showTermsModal} animationType="slide" onRequestClose={()=>setShowTermsModal(false)}>
          <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row', alignItems:'center', padding:16, borderBottomWidth:1, borderBottomColor:'#eee'}}>
              <TouchableOpacity onPress={()=>setShowTermsModal(false)}>
                <Text style={{fontSize:16, color:'#C8102E'}}>✕ 닫기</Text>
              </TouchableOpacity>
              <Text style={{flex:1, textAlign:'center', fontWeight:'700', fontSize:16}}>이용약관</Text>
            </View>
            <ScrollView style={{flex:1, padding:20}}>
              <Text style={{fontSize:14, lineHeight:24, color:'#333'}}>
{`K컬처MAP 이용약관\n\n시행일: 2025년 1월 1일\n\n제1조 (목적)\n본 약관은 K컬처MAP(이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정합니다.\n\n제2조 (서비스 이용)\n- 서비스는 한국 여행 정보 제공 및 여행자 커뮤니티를 목적으로 합니다.\n- 누구나 무료로 이용할 수 있습니다.\n\n제3조 (이용자의 의무)\n- 타인의 명예를 훼손하는 게시물을 작성하지 않습니다.\n- 허위 정보를 게시하지 않습니다.\n- 저작권을 침해하는 콘텐츠를 업로드하지 않습니다.\n- 상업적 광고 및 스팸을 게시하지 않습니다.\n\n제4조 (게시물 관리)\n- 운영자는 부적절한 게시물을 사전 통보 없이 삭제할 수 있습니다.\n- 이용자는 본인이 작성한 게시물을 수정/삭제할 수 있습니다.\n\n제5조 (서비스 변경 및 중단)\n- 운영자는 서비스 내용을 변경하거나 중단할 수 있습니다.\n- 중단 시 사전에 공지합니다.\n\n제6조 (면책조항)\n- 이용자가 게시한 정보의 정확성에 대해 책임지지 않습니다.\n- 천재지변 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.\n\n제7조 (문의)\n- 이메일: hellsong90@gmail.com`}
              </Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
        <Modal visible={showAuthModal} animationType="slide" onRequestClose={()=>setShowAuthModal(false)}>
          <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:1,borderBottomColor:'#eee'}}>
              <TouchableOpacity onPress={()=>setShowAuthModal(false)}>
                <Text style={{fontSize:16,color:'#C8102E'}}>✕ 닫기</Text>
              </TouchableOpacity>
              <Text style={{flex:1,textAlign:'center',fontWeight:'700',fontSize:16}}>
                {authMode==='login'?'로그인':authMode==='signup'?'회원가입':authMode==='reset'?'비밀번호 재설정':'이메일 인증'}
              </Text>
            </View>
            {authMode==='verify' ? (
              <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:32}}>
                <Text style={{fontSize:48, marginBottom:16}}>📧</Text>
                <Text style={{fontSize:20, fontWeight:'700', marginBottom:12, textAlign:'center'}}>이메일을 확인해주세요!</Text>
                <Text style={{color:'#666', textAlign:'center', lineHeight:24, marginBottom:8}}>
                  {authEmail} 으로 메일을 보냈습니다.
                </Text>
                <Text style={{color:'#666', textAlign:'center', lineHeight:24, marginBottom:32}}>
                  인증 또는 비밀번호 재설정 링크가 발송되었습니다.{'\n'}
                  메일함에서 링크를 클릭해주세요.
                </Text>
                <TouchableOpacity style={{backgroundColor:'#C8102E', padding:16, borderRadius:10, width:'100%', alignItems:'center', marginBottom:12}} onPress={()=>setAuthMode('login')}>
                  <Text style={{color:'#fff', fontWeight:'700'}}>로그인 화면으로</Text>
                </TouchableOpacity>
                <Text style={{color:'#aaa', fontSize:12, textAlign:'center'}}>스팸함도 확인해보세요</Text>
              </View>
            ) : (
            <ScrollView style={{flex:1,padding:24}}>
              {authMode==='reset' ? (
                <>
                  <Text style={{fontSize:20,fontWeight:'700',textAlign:'center',marginBottom:8}}>비밀번호 재설정</Text>
                  <Text style={{color:'#888',textAlign:'center',marginBottom:24,fontSize:14}}>가입하신 이메일을 입력하면{'\n'}재설정 링크를 보내드립니다.</Text>
                  <TextInput
                    style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                    placeholder="이메일"
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#bbb"
                  />
                  {authError?<Text style={{color:'#C8102E',marginBottom:12,fontSize:13}}>{authError}</Text>:null}
                  <TouchableOpacity
                    style={{backgroundColor:'#C8102E',padding:16,borderRadius:10,alignItems:'center',marginBottom:16,opacity:authSubmitting?0.6:1}}
                    onPress={resetPassword}
                    disabled={authSubmitting}
                  >
                    <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>{authSubmitting?'전송 중...':'재설정 링크 보내기'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{setAuthMode('login');setAuthError('')}} style={{alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:14}}>로그인으로 돌아가기</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{fontSize:28,fontWeight:'900',color:'#0D1B2A',textAlign:'center',marginBottom:8}}>K<Text style={{color:'#F5A623'}}>컬처</Text>MAP</Text>
                  <Text style={{textAlign:'center',color:'#888',marginBottom:32,fontSize:14}}>한국 여행의 모든 것</Text>
                  {authMode==='signup'&&(
                    <TextInput
                      style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                      placeholder="닉네임 (커뮤니티에서 사용할 이름)"
                      value={authNickname}
                      onChangeText={setAuthNickname}
                      placeholderTextColor="#bbb"
                    />
                  )}
                  <TextInput
                    style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                    placeholder="이메일"
                    value={authEmail}
                    onChangeText={setAuthEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#bbb"
                  />
                  <TextInput
                    style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                    placeholder="비밀번호 (6자 이상)"
                    value={authPassword}
                    onChangeText={setAuthPassword}
                    secureTextEntry
                    placeholderTextColor="#bbb"
                  />
                  {authError?<Text style={{color:'#C8102E',marginBottom:12,fontSize:13}}>{authError}</Text>:null}
                  <TouchableOpacity
                    style={{backgroundColor:'#C8102E',padding:16,borderRadius:10,alignItems:'center',marginBottom:16,opacity:authSubmitting?0.6:1}}
                    onPress={authMode==='login'?signIn:signUp}
                    disabled={authSubmitting}
                  >
                    <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>
                      {authSubmitting?'처리 중...':(authMode==='login'?'로그인':'가입하기')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{setAuthMode(authMode==='login'?'signup':'login');setAuthError('')}} style={{alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:14}}>
                      {authMode==='login'?'계정이 없으신가요? 회원가입':'이미 계정이 있으신가요? 로그인'}
                    </Text>
                  </TouchableOpacity>
                  {authMode==='login'&&(
                    <TouchableOpacity onPress={()=>{setAuthMode('reset');setAuthError('')}} style={{alignItems:'center',marginTop:8}}>
                      <Text style={{color:'#aaa',fontSize:13}}>비밀번호를 잊으셨나요?</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
            )}
          </SafeAreaView>
        </Modal>
        <Modal visible={showNewPasswordModal} animationType="slide" onRequestClose={()=>setShowNewPasswordModal(false)}>
          <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:1,borderBottomColor:'#eee'}}>
              <Text style={{flex:1,textAlign:'center',fontWeight:'700',fontSize:16}}>새 비밀번호 설정</Text>
            </View>
            <View style={{flex:1,padding:24,justifyContent:'center'}}>
              <Text style={{fontSize:24,textAlign:'center',marginBottom:8}}>🔐</Text>
              <Text style={{fontSize:18,fontWeight:'700',textAlign:'center',marginBottom:24}}>새 비밀번호를 입력해주세요</Text>
              <TextInput
                style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                placeholder="새 비밀번호 (6자 이상)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#bbb"
              />
              <TextInput
                style={{borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:15,marginBottom:12}}
                placeholder="비밀번호 확인"
                value={newPasswordConfirm}
                onChangeText={setNewPasswordConfirm}
                secureTextEntry
                placeholderTextColor="#bbb"
              />
              {newPasswordError?<Text style={{color:'#C8102E',marginBottom:12,fontSize:13}}>{newPasswordError}</Text>:null}
              <TouchableOpacity
                style={{backgroundColor:'#C8102E',padding:16,borderRadius:10,alignItems:'center',opacity:newPasswordSubmitting?0.6:1}}
                onPress={updatePassword}
                disabled={newPasswordSubmitting}
              >
                <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>{newPasswordSubmitting?'변경 중...':'비밀번호 변경'}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
        <Modal visible={!!photoViewer} transparent={true} animationType="fade" onRequestClose={()=>setPhotoViewer(null)}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.95)', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{position:'absolute', top:20, right:20, zIndex:10, padding:10}} onPress={()=>setPhotoViewer(null)}>
              <Text style={{color:'white', fontSize:32, fontWeight:'bold'}}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width:'95%', height:'80%', justifyContent:'center', alignItems:'center'}} onPress={()=>setPhotoViewer(null)} activeOpacity={1}>
              <Image source={{uri:photoViewer||''}} style={{width:'100%', height:'100%'}} resizeMode="contain"/>
            </TouchableOpacity>
          </View>
        </Modal>

      </View>

      {userProfileModal.visible && (
        <Modal transparent animationType="slide" visible={userProfileModal.visible}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end'}}>
            <View style={{backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, padding:24}}>
              <TouchableOpacity onPress={() => setUserProfileModal({visible:false, userId:'', nickname:''})}
                style={{alignSelf:'flex-end', marginBottom:8}}>
                <Text style={{fontSize:18}}>✕</Text>
              </TouchableOpacity>
              <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginBottom:16}}>
                {userProfileModal.nickname}
              </Text>
              <View style={{flexDirection:'row', justifyContent:'center', gap:32, marginBottom:24}}>
                <View>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>{followStats.followers}</Text>
                  <Text style={{textAlign:'center', color:'#888'}}>팔로워</Text>
                </View>
                <View>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>{followStats.following}</Text>
                  <Text style={{textAlign:'center', color:'#888'}}>팔로잉</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleFollowToggle(userProfileModal.userId)}
                style={{backgroundColor: isFollowing ? '#ddd' : '#E8751A', padding:14, borderRadius:10, alignItems:'center'}}>
                <Text style={{color: isFollowing ? '#333' : '#fff', fontWeight:'bold', fontSize:16}}>
                  {isFollowing ? '언팔로우' : '팔로우'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {nicknameMenu.visible && (
        <Modal transparent animationType="fade" visible={nicknameMenu.visible}>
          <TouchableOpacity
            style={{flex:1, backgroundColor:'rgba(0,0,0,0.3)'}}
            onPress={() => setNicknameMenu({visible:false, userId:'', nickname:'', x:0, y:0})}>
            <View style={{position:'absolute', bottom:100, left:20, right:20, backgroundColor:'#fff', borderRadius:16, overflow:'hidden', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:10}}>
              <Text style={{padding:16, fontWeight:'bold', fontSize:16, borderBottomWidth:1, borderBottomColor:'#eee', textAlign:'center'}}>
                {nicknameMenu.nickname}
              </Text>
              <TouchableOpacity
                style={{padding:16, borderBottomWidth:1, borderBottomColor:'#eee', flexDirection:'row', alignItems:'center', gap:12}}
                onPress={() => {
                  setNicknameMenu({visible:false, userId:'', nickname:'', x:0, y:0});
                  openUserProfile(nicknameMenu.userId, nicknameMenu.nickname);
                }}>
                <Text style={{fontSize:18}}>👤</Text>
                <Text style={{fontSize:15}}>프로필 보기 / 팔로우</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding:16, borderBottomWidth:1, borderBottomColor:'#eee', flexDirection:'row', alignItems:'center', gap:12}}
                onPress={() => {
                  fetchUserPosts(nicknameMenu.userId, nicknameMenu.nickname);
                  setNicknameMenu({visible:false, userId:'', nickname:'', x:0, y:0});
                }}>
                <Text style={{fontSize:18}}>📝</Text>
                <Text style={{fontSize:15}}>게시글 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding:16, flexDirection:'row', alignItems:'center', gap:12}}
                onPress={() => {
                  setNicknameMenu({visible:false, userId:'', nickname:'', x:0, y:0});
                  if (!user) { window.alert('로그인이 필요합니다.'); return; }
                  setMessageTarget({userId: nicknameMenu.userId, nickname: nicknameMenu.nickname});
                  setShowMessageModal(true);
                }}>
                <Text style={{fontSize:18}}>✉️</Text>
                <Text style={{fontSize:15}}>메시지 보내기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showNotifications && (
        <Modal transparent animationType="slide" visible={showNotifications} onRequestClose={() => setShowNotifications(false)}>
          <TouchableOpacity style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}} activeOpacity={1} onPress={() => setShowNotifications(false)}>
            <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, maxHeight:'70%'}}>
              <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                  <Text style={{fontSize:18, fontWeight:'bold'}}>🔔 알림</Text>
                  <TouchableOpacity onPress={() => setShowNotifications(false)}>
                    <Text style={{fontSize:22, color:'#888'}}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{maxHeight:500}}>
                  {notifications.length === 0 ? (
                    <View style={{padding:40, alignItems:'center'}}>
                      <Text style={{fontSize:36, marginBottom:12}}>🔕</Text>
                      <Text style={{color:'#888', fontSize:15}}>새로운 알림이 없습니다</Text>
                    </View>
                  ) : notifications.map((n: any) => (
                    <TouchableOpacity key={n.id} style={{flexDirection:'row', alignItems:'center', padding:14, borderBottomWidth:1, borderBottomColor:'#f0f0f0', backgroundColor: n.is_read ? '#fff' : '#FFF5F0'}}
                      onPress={async () => {
                        setShowNotifications(false);
                        if (n.post_id) {
                          let post = posts.find((p: any) => String(p.id) === String(n.post_id));
                          if (!post) {
                            const { data } = await supabase
                              .from('posts')
                              .select('*, post_comments(count)')
                              .eq('id', n.post_id)
                              .single();
                            if (data) post = data;
                          }
                          if (post) setSelectedPost(post);
                        }
                      }}
                    >
                      {n.from_avatar_url ? (
                        <Image source={{uri: n.from_avatar_url}} style={{width:40, height:40, borderRadius:20, marginRight:12}} />
                      ) : (
                        <View style={{width:40, height:40, borderRadius:20, backgroundColor:'#E8751A', alignItems:'center', justifyContent:'center', marginRight:12}}>
                          <Text style={{fontSize:20}}>{n.type === 'like' ? '❤️' : '💬'}</Text>
                        </View>
                      )}
                      <View style={{flex:1}}>
                        <Text style={{fontSize:14, color:'#222'}}>{n.message}</Text>
                        <Text style={{fontSize:11, color:'#aaa', marginTop:2}}>{new Date(n.created_at).toLocaleString('ko-KR')}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showPlaceReport && (
        <Modal transparent animationType="slide" visible={showPlaceReport}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View style={{flex:1, backgroundColor:'#fff', marginTop:60, borderTopLeftRadius:20, borderTopRightRadius:20}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                <Text style={{fontSize:18, fontWeight:'bold'}}>📌 장소 제보하기</Text>
                <TouchableOpacity onPress={() => setShowPlaceReport(false)}>
                  <Text style={{fontSize:18}}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{padding:20}}>
                <Text style={{fontWeight:'bold', marginBottom:6}}>장소명 *</Text>
                <TextInput
                  value={reportName}
                  onChangeText={setReportName}
                  placeholder="장소명을 입력하세요"
                  style={{borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:16}}
                />

                <Text style={{fontWeight:'bold', marginBottom:6}}>카테고리 *</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16}}>
                  {['맛집','카페','명소','쇼핑','액티비티'].map(cat => (
                    <TouchableOpacity key={cat}
                      onPress={() => setReportCategory(cat)}
                      style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor: reportCategory === cat ? '#E8751A' : '#f0f0f0'}}>
                      <Text style={{color: reportCategory === cat ? '#fff' : '#333'}}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{fontWeight:'bold', marginBottom:6}}>지역 *</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16}}>
                  {['서울','부산','제주','강원','경상','전라','충청','경기','인천'].map(city => (
                    <TouchableOpacity key={city}
                      onPress={() => setReportCity(city)}
                      style={{paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor: reportCity === city ? '#E8751A' : '#f0f0f0'}}>
                      <Text style={{color: reportCity === city ? '#fff' : '#333'}}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{fontWeight:'bold', marginBottom:6}}>주소 *</Text>
                <TextInput
                  value={reportAddress}
                  onChangeText={setReportAddress}
                  placeholder="도로명 주소를 입력하세요"
                  style={{borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:16}}
                />

                <Text style={{fontWeight:'bold', marginBottom:6}}>설명 (선택)</Text>
                <TextInput
                  value={reportDescription}
                  onChangeText={setReportDescription}
                  placeholder="장소에 대한 설명을 입력하세요"
                  multiline
                  numberOfLines={4}
                  style={{borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:16, height:100, textAlignVertical:'top'}}
                />

                <TouchableOpacity
                  onPress={handleReportPhotoUpload}
                  style={{borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, alignItems:'center', marginBottom:16}}>
                  <Text style={{color:'#888'}}>📷 사진 추가 (선택)</Text>
                </TouchableOpacity>
                {reportPhoto && (
                  <Image source={{uri: reportPhoto}} style={{width:'100%' as any, height:200, borderRadius:8, marginBottom:16}} />
                )}

                <TouchableOpacity
                  onPress={handleReportSubmit}
                  disabled={reportSubmitting}
                  style={{backgroundColor:'#E8751A', padding:16, borderRadius:12, alignItems:'center', marginBottom:40}}>
                  <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>
                    {reportSubmitting ? '제보 중...' : '📌 장소 제보하기'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {showAdminPage && (
        <Modal transparent animationType="slide" visible={showAdminPage}>
          <View style={{flex:1, backgroundColor:'#f5f5f5'}}>
            <View style={{backgroundColor:'#1a1a2e', padding:20, paddingTop:60, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>⚙️ 관리자 페이지</Text>
              <TouchableOpacity onPress={() => setShowAdminPage(false)}>
                <Text style={{color:'#fff', fontSize:18}}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{flex:1}}>
              <View style={{margin:8, backgroundColor:'#fff', borderRadius:12, padding:16}}>
                <Text style={{fontWeight:'bold', fontSize:15, marginBottom:12}}>🏪 등록된 장소 관리</Text>
                <View style={{flexDirection:'row', gap:8, marginBottom:12}}>
                  <TextInput
                    value={adminPlaceSearch}
                    onChangeText={setAdminPlaceSearch}
                    placeholder="장소명 검색..."
                    style={{flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:10}}
                  />
                  <TouchableOpacity
                    onPress={() => fetchAdminPlaces(adminPlaceSearch)}
                    style={{backgroundColor:'#E8751A', paddingHorizontal:16, borderRadius:8, justifyContent:'center'}}>
                    <Text style={{color:'#fff', fontWeight:'bold'}}>검색</Text>
                  </TouchableOpacity>
                </View>
                {adminPlaces.map(place => (
                  <View key={place.id} style={{flexDirection:'row', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#f0f0f0'}}>
                    <View style={{flex:1}}>
                      <Text style={{fontWeight:'bold', fontSize:13}}>{place.name}</Text>
                      <Text style={{color:'#888', fontSize:11}}>{place.city} · {place.category}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeletePlace(place.id, place.name)}
                      style={{backgroundColor:'#fff0f0', paddingHorizontal:12, paddingVertical:6, borderRadius:8}}>
                      <Text style={{color:'#c62828', fontSize:12, fontWeight:'bold'}}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={{padding:16, fontWeight:'bold', fontSize:16}}>
                📌 장소 제보 목록 ({placeReports.length}건)
              </Text>

              {placeReports.length === 0 ? (
                <View style={{padding:40, alignItems:'center'}}>
                  <Text style={{color:'#aaa'}}>제보된 장소가 없습니다</Text>
                </View>
              ) : (
                placeReports.map(report => (
                  <View key={report.id} style={{backgroundColor:'#fff', margin:8, borderRadius:12, padding:16, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:4, opacity: report.status === 'pending' ? 1 : 0.6}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                      <Text style={{fontWeight:'bold', fontSize:15}}>{report.name}</Text>
                      <View style={{backgroundColor: report.status === 'pending' ? '#fff8f0' : report.status === 'approved' ? '#f0fff0' : '#fff0f0', paddingHorizontal:8, paddingVertical:4, borderRadius:8}}>
                        <Text style={{fontSize:12, color: report.status === 'pending' ? '#E8751A' : report.status === 'approved' ? '#2e7d32' : '#c62828'}}>
                          {report.status === 'pending' ? '⏳ 대기중' : report.status === 'approved' ? '✅ 승인' : '❌ 반려'}
                        </Text>
                      </View>
                    </View>

                    <Text style={{color:'#666', fontSize:13, marginBottom:4}}>📂 {report.category} · 📍 {report.city}</Text>
                    <Text style={{color:'#666', fontSize:13, marginBottom:4}}>🏠 {report.address}</Text>
                    {report.description ? <Text style={{color:'#888', fontSize:12, marginBottom:8}}>{report.description}</Text> : null}
                    <Text style={{color:'#aaa', fontSize:11, marginBottom:12}}>제보자: {report.user_name} · {new Date(report.created_at).toLocaleDateString('ko-KR')}</Text>

                    {report.photo_url && (
                      <Image source={{uri: report.photo_url}} style={{width:'100%' as any, height:150, borderRadius:8, marginBottom:12}} />
                    )}

                    {report.status === 'pending' && (
                      <View style={{flexDirection:'row', gap:8}}>
                        <TouchableOpacity
                          onPress={() => handleApproveReport(report)}
                          style={{flex:1, backgroundColor:'#E8751A', padding:12, borderRadius:8, alignItems:'center'}}>
                          <Text style={{color:'#fff', fontWeight:'bold'}}>✅ 승인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => { setRejectingReport(report); setShowRejectModal(true); }}
                          style={{flex:1, backgroundColor:'#f5f5f5', borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:8, alignItems:'center'}}>
                          <Text style={{color:'#c62828', fontWeight:'bold'}}>❌ 반려</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </Modal>
      )}

      {showRejectModal && (
        <Modal transparent animationType="fade" visible={showRejectModal}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', padding:24}}>
            <View style={{backgroundColor:'#fff', borderRadius:16, padding:24}}>
              <Text style={{fontWeight:'bold', fontSize:16, marginBottom:16}}>❌ 반려 사유 입력</Text>
              <Text style={{color:'#666', marginBottom:12}}>"{rejectingReport?.name}"</Text>
              <TextInput
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="반려 사유를 입력하세요 (예: 이미 등록된 장소입니다)"
                multiline
                numberOfLines={3}
                style={{borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:16, height:80, textAlignVertical:'top'}}
              />
              <View style={{flexDirection:'row', gap:8}}>
                <TouchableOpacity
                  onPress={() => { setShowRejectModal(false); setRejectReason(''); }}
                  style={{flex:1, backgroundColor:'#f5f5f5', padding:12, borderRadius:8, alignItems:'center'}}>
                  <Text style={{color:'#666'}}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRejectReport}
                  style={{flex:1, backgroundColor:'#c62828', padding:12, borderRadius:8, alignItems:'center'}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>반려 처리</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showUserPosts && (
        <Modal transparent animationType="slide" visible={showUserPosts}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View style={{flex:1, backgroundColor:'#fff', marginTop:60, borderTopLeftRadius:20, borderTopRightRadius:20}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                <Text style={{fontSize:18, fontWeight:'bold'}}>📝 {userPostsTarget?.nickname}님의 게시글</Text>
                <TouchableOpacity onPress={() => setShowUserPosts(false)}>
                  <Text style={{fontSize:18}}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {userPostsList.length === 0 ? (
                  <View style={{padding:40, alignItems:'center'}}>
                    <Text style={{color:'#aaa'}}>작성한 게시글이 없습니다</Text>
                  </View>
                ) : (
                  userPostsList.map(post => (
                    <TouchableOpacity
                      key={post.id}
                      style={{padding:16, borderBottomWidth:1, borderBottomColor:'#f0f0f0'}}
                      onPress={() => { setShowUserPosts(false); setSelectedPost(post); }}>
                      <Text style={{fontWeight:'bold', fontSize:14, marginBottom:4}}>{post.title}</Text>
                      <Text style={{color:'#888', fontSize:12}} numberOfLines={2}>{post.content}</Text>
                      <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:8}}>
                        <Text style={{color:'#aaa', fontSize:11}}>{post.city || '전체'} · {post.category}</Text>
                        <Text style={{color:'#aaa', fontSize:11}}>🔥 {post.likes}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {showMessageModal && (
        <Modal transparent animationType="slide" visible={showMessageModal}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end'}}>
            <View style={{backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, padding:24}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
                <Text style={{fontSize:16, fontWeight:'bold'}}>✉️ {messageTarget?.nickname}님께 메시지</Text>
                <TouchableOpacity onPress={() => { setShowMessageModal(false); setMessageContent(''); }}>
                  <Text style={{fontSize:18}}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={messageContent}
                onChangeText={setMessageContent}
                placeholder="메시지를 입력하세요..."
                multiline
                numberOfLines={4}
                style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:12, height:120, textAlignVertical:'top', marginBottom:16}}
                maxLength={500}
              />
              <Text style={{color:'#aaa', fontSize:11, textAlign:'right', marginBottom:12}}>{messageContent.length}/500</Text>
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={messageSending}
                style={{backgroundColor:'#E8751A', padding:14, borderRadius:12, alignItems:'center'}}>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>
                  {messageSending ? '전송 중...' : '✉️ 메시지 보내기'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showMyMessages && (
        <Modal transparent animationType="slide" visible={showMyMessages}>
          <View style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{backgroundColor:'#1a1a2e', padding:20, paddingTop:60, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>✉️ 메시지</Text>
              <TouchableOpacity onPress={() => setShowMyMessages(false)}>
                <Text style={{color:'#fff', fontSize:18}}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {myMessages.length === 0 ? (
                <View style={{padding:40, alignItems:'center'}}>
                  <Text style={{fontSize:40, marginBottom:12}}>✉️</Text>
                  <Text style={{color:'#aaa'}}>메시지가 없습니다</Text>
                </View>
              ) : (
                myMessages.map((conv: any) => (
                  <TouchableOpacity
                    key={conv.userId}
                    onPress={() => fetchConversation(conv.userId, conv.nickname, conv.avatarUrl)}
                    style={{flexDirection:'row', padding:16, borderBottomWidth:1, borderBottomColor:'#f0f0f0', alignItems:'center', gap:12}}>
                    {conv.avatarUrl ? (
                      <Image source={{uri: conv.avatarUrl}} style={{width:48, height:48, borderRadius:24}} />
                    ) : (
                      <View style={{width:48, height:48, borderRadius:24, backgroundColor:'#E8751A', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'#fff', fontWeight:'bold', fontSize:18}}>{conv.nickname?.[0]}</Text>
                      </View>
                    )}
                    <View style={{flex:1}}>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'bold', fontSize:15}}>{conv.nickname}</Text>
                        <Text style={{color:'#aaa', fontSize:11}}>{new Date(conv.lastTime).toLocaleDateString('ko-KR')}</Text>
                      </View>
                      <Text style={{color:'#888', fontSize:13, marginTop:2}} numberOfLines={1}>{conv.lastMessage}</Text>
                    </View>
                    {conv.unread > 0 && (
                      <View style={{backgroundColor:'#E8751A', borderRadius:10, minWidth:20, height:20, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'#fff', fontSize:11, fontWeight:'bold'}}>{conv.unread}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </Modal>
      )}

      {showConversation && conversationTarget && (
        <Modal transparent animationType="slide" visible={showConversation}>
          <View style={{flex:1, backgroundColor:'#f5f5f5'}}>
            <View style={{backgroundColor:'#1a1a2e', padding:20, paddingTop:60, flexDirection:'row', alignItems:'center', gap:12}}>
              <TouchableOpacity onPress={() => setShowConversation(false)}>
                <Text style={{color:'#fff', fontSize:18}}>←</Text>
              </TouchableOpacity>
              {conversationTarget.avatarUrl ? (
                <Image source={{uri: conversationTarget.avatarUrl}} style={{width:36, height:36, borderRadius:18}} />
              ) : (
                <View style={{width:36, height:36, borderRadius:18, backgroundColor:'#E8751A', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>{conversationTarget.nickname?.[0]}</Text>
                </View>
              )}
              <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>{conversationTarget.nickname}</Text>
            </View>

            <ScrollView style={{flex:1, padding:16}}>
              {conversationMessages.map(msg => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <View key={msg.id} style={{flexDirection:'row', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom:12}}>
                    <View style={{
                      maxWidth:'75%' as any,
                      backgroundColor: isMine ? '#E8751A' : '#fff',
                      borderRadius:16,
                      borderBottomRightRadius: isMine ? 4 : 16,
                      borderBottomLeftRadius: isMine ? 16 : 4,
                      padding:12,
                      shadowColor:'#000',
                      shadowOpacity:0.05,
                      shadowRadius:4,
                    }}>
                      <Text style={{color: isMine ? '#fff' : '#333', fontSize:14, lineHeight:20}}>{msg.content}</Text>
                      <Text style={{color: isMine ? 'rgba(255,255,255,0.7)' : '#aaa', fontSize:10, marginTop:4, textAlign: isMine ? 'right' : 'left'}}>
                        {new Date(msg.created_at).toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={{flexDirection:'row', padding:12, backgroundColor:'#fff', gap:8, alignItems:'flex-end'}}>
              <TextInput
                value={replyContent}
                onChangeText={setReplyContent}
                placeholder="메시지 입력..."
                multiline
                style={{flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:20, paddingHorizontal:16, paddingVertical:8, maxHeight:100, fontSize:14}}
              />
              <TouchableOpacity
                onPress={handleSendReply}
                style={{backgroundColor:'#E8751A', width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:'#fff', fontSize:18}}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {fullscreenImage && (
        <Modal transparent animationType="fade" visible={!!fullscreenImage}>
          <TouchableOpacity
            style={{flex:1, backgroundColor:'rgba(0,0,0,0.95)', justifyContent:'center', alignItems:'center'}}
            onPress={() => setFullscreenImage(null)}>
            <Image
              source={{uri: fullscreenImage}}
              style={{width:'100%' as any, height:'80%' as any}}
              resizeMode="contain"
            />
            <Text style={{color:'#fff', marginTop:16, opacity:0.6, fontSize:13}}>탭하면 닫힙니다</Text>
          </TouchableOpacity>
        </Modal>
      )}

    </SafeAreaView>
    </SafeAreaProvider>
  )
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#0D1B2A'},
  container:{flex:1,backgroundColor:'#F8F5F0'},
  topbar:{backgroundColor:'#0D1B2A',height:54,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
  logo:{fontSize:18,fontWeight:'900',color:'#fff',letterSpacing:2,flexShrink:0},
  logoEm:{color:'#F5A623'},
  searchBar:{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,255,255,0.13)',borderRadius:20,paddingHorizontal:12,height:34},
  searchIcon:{fontSize:12,marginRight:6,opacity:0.5},
  searchInput:{flex:1,color:'#fff',fontSize:12},
  langBtn:{backgroundColor:'rgba(255,255,255,0.12)',borderRadius:8,padding:6,borderWidth:1,borderColor:'rgba(255,255,255,0.2)'},
  regionBar:{backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#eee'},
  regionBarText:{fontSize:14,fontWeight:'600',color:'#0D1B2A'},
  regionBarArrow:{fontSize:11,color:'#aaa'},
  catSection:{backgroundColor:'#F8F5F0',paddingHorizontal:14,paddingTop:7,paddingBottom:3},
  catGroupLabel:{fontSize:9,fontWeight:'700',color:'#bbb',letterSpacing:0.5,marginBottom:5,textTransform:'uppercase' as const},
  catScroll:{flexGrow:0},
  catPill:{paddingHorizontal:12,paddingVertical:5,borderRadius:16,borderWidth:1.5,borderColor:'#ddd',backgroundColor:'#fff',marginRight:6},
  catPillText:{fontSize:11,fontWeight:'500',color:'#666'},
  catPillTextActive:{color:'#fff',fontWeight:'700'},
  mapPlaceholder:{margin:14,borderRadius:14,backgroundColor:'#fff',height:88,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#eee'},
  mapOpenBtn:{backgroundColor:'#0D1B2A',borderRadius:10,paddingHorizontal:16,paddingVertical:7},
  mapOpenBtnText:{color:'#fff',fontSize:12,fontWeight:'600'},
  secTitle:{fontSize:10,fontWeight:'700',color:'#aaa',letterSpacing:1,paddingHorizontal:14,paddingTop:12,paddingBottom:8,textTransform:'uppercase' as const},
  featCard:{backgroundColor:'#fff',borderRadius:16,marginHorizontal:14,marginBottom:12,overflow:'hidden'},
  cardImg:{height:148,alignItems:'center',justifyContent:'center',position:'relative'},
  heartBtn:{position:'absolute',bottom:10,right:10,width:30,height:30,borderRadius:15,backgroundColor:'rgba(0,0,0,0.3)',alignItems:'center',justifyContent:'center'},
  heartSaved:{backgroundColor:'#C8102E'},
  cardBody:{padding:13},
  cardName:{fontSize:16,fontWeight:'700',color:'#0D1B2A',marginBottom:4},
  cardMeta:{flexDirection:'row',alignItems:'center',marginBottom:5},
  stars:{color:'#F5A623',fontSize:12,letterSpacing:-1},
  metaText:{fontSize:12,color:'#888'},
  chipRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:5},
  chipHours:{backgroundColor:'#f0f4ff',borderRadius:8,paddingHorizontal:8,paddingVertical:3},
  chipHoursText:{fontSize:10,color:'#1565C0'},
  chipPrice:{backgroundColor:'#f0fff4',borderRadius:8,paddingHorizontal:8,paddingVertical:3},
  chipPriceText:{fontSize:10,color:'#1A7A4A'},
  cardAddr:{fontSize:11,color:'#bbb',marginBottom:10},
  cardActions:{flexDirection:'row',gap:8},
  btnRoute:{backgroundColor:'#0D1B2A',borderRadius:16,paddingHorizontal:14,paddingVertical:7},
  btnRouteText:{color:'#fff',fontSize:12,fontWeight:'500'},
  btnReview:{borderWidth:1.5,borderColor:'#0D1B2A',borderRadius:16,paddingHorizontal:14,paddingVertical:7},
  btnReviewText:{fontSize:12,fontWeight:'500',color:'#0D1B2A'},
  listCard:{flexDirection:'row',gap:10,backgroundColor:'#fff',borderRadius:12,padding:10,marginHorizontal:14,marginBottom:8,alignItems:'center'},
  listThumb:{width:58,height:58,borderRadius:10,alignItems:'center',justifyContent:'center',flexShrink:0},
  listInfo:{flex:1,minWidth:0},
  listName:{fontSize:13,fontWeight:'700',marginBottom:2,color:'#0D1B2A'},
  listAddr:{fontSize:10,color:'#aaa',marginBottom:4},
  tagRow:{flexDirection:'row',flexWrap:'wrap',gap:4},
  tag:{backgroundColor:'#f0ece3',borderRadius:7,paddingHorizontal:6,paddingVertical:2},
  tagOpen:{backgroundColor:'#e8f5e9'},
  tagClosed:{backgroundColor:'#fce4ec'},
  tagText:{fontSize:9,fontWeight:'500',color:'#666'},
  listRight:{alignItems:'flex-end',gap:5},
  ratingChip:{backgroundColor:'#F5A623',borderRadius:7,paddingHorizontal:7,paddingVertical:2},
  ratingChipText:{fontSize:11,fontWeight:'700',color:'#0D1B2A'},
  heartSmall:{fontSize:16,color:'#ddd'},
  heartSmallSaved:{color:'#C8102E'},
  center:{padding:40,alignItems:'center'},
  emptyText:{textAlign:'center',color:'#bbb',marginTop:40,fontSize:14,padding:20},
  tabBar:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:0.5,borderTopColor:'#eee',paddingBottom:8},
  tabBtn:{flex:1,alignItems:'center',paddingTop:10},
  tabIcon:{fontSize:20,marginBottom:2},
  tabIconActive:{},
  tabLabel:{fontSize:10,color:'#aaa',fontWeight:'500'},
  tabLabelActive:{color:'#C8102E',fontWeight:'700'},
  pageTitle:{fontSize:22,fontWeight:'700',color:'#0D1B2A',padding:16,paddingTop:20},
  aiContainer:{flex:1,padding:16},
  aiBox:{backgroundColor:'#0D1B2A',borderRadius:16,padding:18,marginBottom:14},
  aiTitle:{fontSize:15,fontWeight:'700',color:'#fff',marginBottom:6},
  aiDesc:{fontSize:12,color:'rgba(255,255,255,0.65)',lineHeight:20,marginBottom:14},
  aiChips:{flexDirection:'row',flexWrap:'wrap',gap:8},
  aiChip:{backgroundColor:'rgba(245,166,35,0.18)',borderWidth:1,borderColor:'rgba(245,166,35,0.35)',borderRadius:14,paddingHorizontal:12,paddingVertical:6},
  aiChipText:{color:'#F5A623',fontSize:12},
  aiSoon:{textAlign:'center',color:'#aaa',fontSize:13},
  communityHeader:{backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#eee'},
  communityTitle:{fontSize:15,fontWeight:'700',color:'#0D1B2A'},
  communitySub:{fontSize:11,color:'#aaa',marginTop:2},
  writeBtn:{backgroundColor:'#C8102E',borderRadius:20,paddingHorizontal:14,paddingVertical:7},
  writeBtnText:{color:'#fff',fontSize:12,fontWeight:'700'},
  postFilterRow:{flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee',paddingHorizontal:12,paddingVertical:6,flexGrow:0},
  postFilterBtn:{paddingHorizontal:12,paddingVertical:5,borderRadius:14,backgroundColor:'#f5f0e8',marginRight:6},
  postFilterBtnActive:{backgroundColor:'#C8102E'},
  postFilterText:{fontSize:11,color:'#666',fontWeight:'500'},
  postFilterTextActive:{color:'#fff',fontWeight:'700'},
  postCard:{backgroundColor:'#fff',borderRadius:14,marginHorizontal:14,marginTop:10,padding:14,position:'relative'},
  bestBadge:{position:'absolute',top:10,right:10,backgroundColor:'#F5A623',borderRadius:8,paddingHorizontal:8,paddingVertical:3},
  bestBadgeText:{fontSize:9,fontWeight:'700',color:'#0D1B2A'},
  postHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:10},
  postAvatar:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center'},
  postAvatarText:{color:'#fff',fontWeight:'700',fontSize:14},
  postUser:{fontSize:13,fontWeight:'700',color:'#0D1B2A'},
  postNation:{fontSize:14},
  postCityTag:{backgroundColor:'#f0f4ff',borderRadius:8,paddingHorizontal:6,paddingVertical:2},
  postCityTagText:{fontSize:10,color:'#1565C0'},
  postTime:{fontSize:11,color:'#bbb',marginTop:2},
  postTitle:{fontSize:15,fontWeight:'700',color:'#0D1B2A',marginBottom:6},
  postPreviewImg:{width:'100%',height:180,borderRadius:10,marginBottom:8},
  postContent:{fontSize:13,color:'#555',lineHeight:20,marginBottom:10},
  postFooter:{flexDirection:'row',alignItems:'center',gap:8,flexWrap:'wrap'},
  likeBtn:{backgroundColor:'#f0f4ff',borderRadius:16,paddingHorizontal:14,paddingVertical:6},
  likeBtnText:{fontSize:12,color:'#1565C0',fontWeight:'600'},
  commentCount:{fontSize:12,color:'#aaa'},
  translateBtn:{backgroundColor:'#f5f0e8',borderRadius:14,paddingHorizontal:12,paddingVertical:6},
  translateBtnText:{fontSize:11,color:'#8B5E3C',fontWeight:'600'},
  translatedBox:{backgroundColor:'#fff8f0',borderRadius:10,padding:10,marginTop:8,borderLeftWidth:3,borderLeftColor:'#F5A623'},
  translatedText:{fontSize:12,color:'#555',lineHeight:18},
  addPhotoBtn:{backgroundColor:'#f0f4ff',borderRadius:12,padding:12,alignItems:'center',marginBottom:12,borderWidth:1.5,borderColor:'#1565C0',borderStyle:'dashed'},
  addPhotoBtnText:{fontSize:13,color:'#1565C0',fontWeight:'600'},
  photoPreview:{width:'100%',height:200,borderRadius:12,marginBottom:4},
  removePhotoBtn:{position:'absolute',top:8,right:8,width:28,height:28,borderRadius:14,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center'},
  writeModalHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#eee',backgroundColor:'#fff'},
  writeModalTitle:{fontSize:15,fontWeight:'700',color:'#0D1B2A'},
  writeModalSubmit:{fontSize:14,fontWeight:'700',color:'#C8102E'},
  postCatRow:{flexDirection:'row',gap:8,marginBottom:14,flexWrap:'wrap'},
  postCatBtn:{paddingHorizontal:14,paddingVertical:7,borderRadius:16,borderWidth:1.5,borderColor:'#ddd',backgroundColor:'#fff'},
  postCatBtnActive:{backgroundColor:'#C8102E',borderColor:'#C8102E'},
  postCatText:{fontSize:12,color:'#666',fontWeight:'500'},
  postCatTextActive:{color:'#fff',fontWeight:'700'},
  writeTitleInput:{backgroundColor:'#fff',borderRadius:10,padding:14,fontSize:15,color:'#0D1B2A',marginBottom:10,borderWidth:1,borderColor:'#eee',fontWeight:'600'},
  writeCityInput:{backgroundColor:'#fff',borderRadius:10,padding:12,fontSize:13,color:'#0D1B2A',marginBottom:10,borderWidth:1,borderColor:'#eee'},
  writeContentInput:{backgroundColor:'#fff',borderRadius:10,padding:14,fontSize:14,color:'#0D1B2A',borderWidth:1,borderColor:'#eee',height:200,textAlignVertical:'top' as const},
  postDetailCard:{backgroundColor:'#fff',margin:14,borderRadius:14,padding:16},
  postDetailTitle:{fontSize:18,fontWeight:'700',color:'#0D1B2A',marginBottom:10},
  postDetailImg:{width:'100%',height:220,borderRadius:12,marginBottom:12},
  postDetailContent:{fontSize:14,color:'#444',lineHeight:22,marginBottom:16},
  commentCard:{flexDirection:'row',gap:10,backgroundColor:'#fff',borderRadius:12,padding:12,marginBottom:6},
  commentAvatar:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center',flexShrink:0},
  commentUser:{fontSize:12,fontWeight:'700',color:'#0D1B2A',marginBottom:3},
  commentContent:{fontSize:13,color:'#444',lineHeight:18},
  commentTime:{fontSize:10,color:'#bbb'},
  replyBtn:{fontSize:11,color:'#1565C0',fontWeight:'600'},
  replyCard:{flexDirection:'row',gap:8,paddingLeft:28,marginBottom:6,alignItems:'flex-start'},
  replyLine:{fontSize:16,color:'#ddd',marginRight:4,lineHeight:28},
  replyToBar:{backgroundColor:'#f0f4ff',paddingHorizontal:16,paddingVertical:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  replyToText:{fontSize:12,color:'#1565C0',fontWeight:'600'},
  commentInputRow:{flexDirection:'row',gap:8,padding:12,backgroundColor:'#fff',borderTopWidth:0.5,borderTopColor:'#eee'},
  commentInput:{flex:1,backgroundColor:'#F8F5F0',borderRadius:20,paddingHorizontal:14,paddingVertical:10,fontSize:13,color:'#0D1B2A',borderWidth:1,borderColor:'#eee'},
  commentSubmitBtn:{width:40,height:40,borderRadius:20,backgroundColor:'#C8102E',alignItems:'center',justifyContent:'center'},
  profileHeader:{backgroundColor:'#0D1B2A',padding:20,alignItems:'center'},
  profileAvatar:{width:66,height:66,borderRadius:33,backgroundColor:'rgba(255,255,255,0.12)',alignItems:'center',justifyContent:'center',marginBottom:10,borderWidth:2,borderColor:'#F5A623'},
  profileName:{fontSize:18,fontWeight:'700',color:'#fff',marginBottom:4},
  profileSub:{fontSize:12,color:'rgba(255,255,255,0.55)',marginBottom:16},
  statRow:{flexDirection:'row',backgroundColor:'rgba(255,255,255,0.08)',borderRadius:12,overflow:'hidden',width:'100%'},
  statCell:{flex:1,alignItems:'center',paddingVertical:12},
  statVal:{fontSize:16,fontWeight:'700',color:'#F5A623'},
  statKey:{fontSize:9,color:'rgba(255,255,255,0.55)',marginTop:2},
  myPostCard:{backgroundColor:'#fff',borderRadius:12,padding:14,marginBottom:8,overflow:'hidden'},
  myPostImg:{width:'100%',height:120,borderRadius:8,marginBottom:8},
  myPostTitle:{fontSize:14,fontWeight:'700',color:'#0D1B2A'},
  myPostMeta:{fontSize:11,color:'#aaa'},
  myPostLikes:{fontSize:11,color:'#1565C0',fontWeight:'600'},
  myPostActionBtn:{borderRadius:8,paddingVertical:8,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#eee'},
  sectionTitle:{fontSize:16,fontWeight:'700',color:'#0D1B2A',marginBottom:12},
  regionModalSafe:{flex:1,backgroundColor:'#fff'},
  regionModalHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#eee'},
  regionModalClose:{fontSize:20,color:'#666'},
  regionModalTitle:{fontSize:16,fontWeight:'700',color:'#0D1B2A'},
  regionBody:{flex:1,flexDirection:'row'},
  regionLeft:{width:110,backgroundColor:'#f5f5f5',borderRightWidth:1,borderRightColor:'#eee'},
  regionLeftItem:{paddingVertical:14,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:'#eee'},
  regionLeftItemActive:{backgroundColor:'#fff',borderLeftWidth:3,borderLeftColor:'#C8102E'},
  regionLeftText:{fontSize:12,color:'#888',textAlign:'center' as const},
  regionLeftTextActive:{color:'#C8102E',fontWeight:'700'},
  regionRight:{flex:1,backgroundColor:'#fff'},
  regionRightHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:16,borderBottomWidth:1,borderBottomColor:'#f0f0f0',backgroundColor:'#fafafa'},
  regionRightHeaderText:{fontSize:14,fontWeight:'700',color:'#0D1B2A'},
  regionRightArrow:{fontSize:18,color:'#aaa'},
  regionRightItem:{paddingHorizontal:20,paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#f5f5f5'},
  regionRightItemActive:{backgroundColor:'#fff5f5'},
  regionRightText:{fontSize:14,color:'#444'},
  regionRightTextActive:{color:'#C8102E',fontWeight:'700'},
  regionAllDesc:{padding:20,color:'#aaa',fontSize:13,textAlign:'center' as const},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.55)',justifyContent:'flex-end'},
  langPanel:{backgroundColor:'#F8F5F0',borderTopLeftRadius:22,borderTopRightRadius:22,padding:20,maxHeight:'85%'},
  langHandle:{width:38,height:4,backgroundColor:'#ddd',borderRadius:2,alignSelf:'center' as const,marginBottom:16},
  langPanelTitle:{fontSize:15,fontWeight:'700',color:'#0D1B2A',marginBottom:14},
  langRegion:{fontSize:10,fontWeight:'700',color:'#aaa',letterSpacing:0.5,marginBottom:8,marginTop:4,textTransform:'uppercase' as const},
  langGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:8},
  langOpt:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#e8e2d8',borderRadius:12,padding:10,alignItems:'center',minWidth:90},
  langOptActive:{backgroundColor:'#C8102E',borderColor:'#C8102E'},
  langOptName:{fontSize:11,fontWeight:'700',color:'#0D1B2A',marginTop:4},
  routePanel:{backgroundColor:'#F8F5F0',borderTopLeftRadius:22,borderTopRightRadius:22,padding:20,maxHeight:'80%'},
  routeTitle:{fontSize:17,fontWeight:'700',color:'#0D1B2A',marginBottom:3},
  routeSub:{fontSize:12,color:'#aaa',marginBottom:14},
  transportRow:{flexDirection:'row',gap:6,marginBottom:14},
  trTab:{flex:1,alignItems:'center',padding:9,borderRadius:10,borderWidth:1.5,borderColor:'#e0dbd2',backgroundColor:'#fff'},
  trTabActive:{backgroundColor:'#0D1B2A',borderColor:'#0D1B2A'},
  trTabText:{fontSize:10,color:'#666',marginTop:3},
  trTabTextActive:{color:'#fff'},
  routeInfoRow:{flexDirection:'row',backgroundColor:'#fff',borderRadius:11,padding:12,marginBottom:12},
  routeInfoCell:{flex:1,alignItems:'center'},
  routeInfoVal:{fontSize:15,fontWeight:'700',color:'#0D1B2A'},
  routeInfoKey:{fontSize:10,color:'#bbb',marginTop:2},
  routeStep:{flexDirection:'row',gap:9,paddingVertical:9,borderBottomWidth:1,borderBottomColor:'#f0ece4',alignItems:'flex-start'},
  stepNum:{width:22,height:22,backgroundColor:'#0D1B2A',borderRadius:11,alignItems:'center',justifyContent:'center'},
  stepText:{fontSize:13,color:'#444',lineHeight:20},
  stepMeta:{fontSize:11,color:'#aaa',marginTop:1},
  openMapBtn:{backgroundColor:'#1A7A4A',borderRadius:11,padding:14,alignItems:'center',marginTop:14},
  openMapBtnText:{color:'#fff',fontSize:14,fontWeight:'700'},
  detailContainer:{flex:1,backgroundColor:'#F8F5F0'},
  detailImg:{height:230,alignItems:'center',justifyContent:'center',position:'relative'},
  closeBtn:{position:'absolute',top:50,left:16,width:36,height:36,borderRadius:18,backgroundColor:'rgba(0,0,0,0.35)',alignItems:'center',justifyContent:'center'},
  detailHeart:{position:'absolute',top:50,right:16,width:36,height:36,borderRadius:18,backgroundColor:'rgba(0,0,0,0.35)',alignItems:'center',justifyContent:'center'},
  detailBody:{flex:1,padding:20},
  detailName:{fontSize:25,fontWeight:'700',color:'#0D1B2A',marginBottom:6},
  detailMetaRow:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',marginBottom:16},
  detailMeta:{fontSize:14,color:'#888'},
  infoGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:16},
  infoChip:{backgroundColor:'#fff',borderRadius:12,padding:13,width:'47%'},
  infoLabel:{fontSize:11,color:'#aaa',marginBottom:4},
  infoVal:{fontSize:14,fontWeight:'600',color:'#0D1B2A'},
  btnGmap:{backgroundColor:'#1A7A4A',borderRadius:14,padding:16,alignItems:'center',marginBottom:22},
  btnGmapText:{color:'#fff',fontSize:15,fontWeight:'700'},
  emptyReview:{color:'#bbb',fontSize:13,textAlign:'center',paddingVertical:20,marginBottom:16},
  reviewCard:{backgroundColor:'#fff',borderRadius:12,padding:14,marginBottom:10},
  reviewHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
  reviewAvatar:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center'},
  reviewName:{fontSize:13,fontWeight:'600',color:'#0D1B2A'},
  reviewStars:{fontSize:12,color:'#F5A623',marginTop:1},
  reviewContent:{fontSize:13,color:'#555',lineHeight:20},
  reviewForm:{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10},
  starLabel:{fontSize:12,color:'#aaa',marginBottom:8,fontWeight:'600'},
  starRow:{flexDirection:'row',gap:8,marginBottom:14},
  star:{fontSize:30,color:'#ddd'},
  starOn:{color:'#F5A623'},
  input:{backgroundColor:'#F8F5F0',borderRadius:10,padding:12,fontSize:14,color:'#0D1B2A',marginBottom:12,borderWidth:1,borderColor:'#eee'},
  textarea:{height:100,textAlignVertical:'top' as const},
  submitBtn:{backgroundColor:'#C8102E',borderRadius:12,padding:14,alignItems:'center',marginTop:4},
  submitBtnText:{color:'#fff',fontSize:15,fontWeight:'700'},
})