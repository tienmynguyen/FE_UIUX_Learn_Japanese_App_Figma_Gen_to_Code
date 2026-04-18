import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOOK_COVER_URI = "https://www.figma.com/api/mcp/asset/f45447a4-5216-4be6-96d0-0be7ded04fc6";

const CONTENT_TEXT = `週末は、家族と公園へ行くだけではありません。私はよく友達とハノイの旧市街へ遊びに行きます。旧市街はとてもにぎやかで、古い建物がたくさんあります。私たちはそこで写真を撮ったり、有名な「フォー」を食べたりします。ハノイのフォーは世界で一番美味しいと思います。
Cuối tuần không chỉ dừng lại ở việc đi công viên cùng gia đình. Tôi thường cùng bạn bè lên khu Phố Cổ Hà Nội chơi. Phố Cổ lúc nào cũng nhộn nhịp với rất nhiều tòa nhà cổ kính. Chúng tôi chụp ảnh và cùng nhau ăn món "Phở" nổi tiếng. Tôi nghĩ Phở Hà Nội là món ăn ngon nhất trên thế giới.
最近、私は日本語をもっと一生懸命勉強しています。母が日本語の先生ですから、家でも時々母と日本語で話します。でも、母は厳しい先生になりますから、少し緊張します。私の夢は、いつか日本へ留学することです。日本の桜の花を自分の目で見たいです。そして、日本の古いお寺や現代的な秋葉原の街を歩いてみたいです。
Dạo gần đây, tôi đang học tiếng Nhật chăm chỉ hơn. Vì mẹ là giáo viên tiếng Nhật nên đôi khi ở nhà tôi cũng tập nói chuyện với mẹ bằng tiếng Nhật. Tuy nhiên, lúc đó mẹ trở thành một giáo viên khá nghiêm khắc khiến tôi có chút hồi hộp. Ước mơ của tôi là một ngày nào đó sẽ được đi du học Nhật Bản. Tôi muốn tận mắt ngắm nhìn hoa anh đào và dạo bước qua những ngôi đền cổ kính hay những con phố Akihabara hiện đại.
兄たちはいつも私を応援してくれます。上の兄は経済を勉強していて、下の兄はITを勉強しています。二人とも頭がいいです。時々、宿題が難しいとき、兄たちに教えてもらいます。その代わりに、私は兄たちのために美味しいお茶を淹れます。

私の家には小さな猫がいます。名前は「タマ」です。タマは白くて、とても可愛いです。私が勉強しているとき、タマはいつも机の上に来て、一緒に本を見ています。タマがいるから、私の家はもっと明るくなります。
Các anh trai luôn ủng hộ tôi hết mình. Anh cả học về kinh tế, còn anh thứ học về Công nghệ thông tin. Cả hai đều rất thông minh. Thỉnh thoảng khi gặp bài tập khó, các anh lại giảng giải cho tôi. Đổi lại, tôi thường pha những tách trà thật ngon cho các anh.

Nhà tôi còn có một chú mèo nhỏ tên là "Tama". Tama có bộ lông trắng muốt và rất đáng yêu. Mỗi khi tôi học bài, nó lại nhảy lên bàn và nhìn vào sách cùng tôi. Có Tama, ngôi nhà của tôi trở nên ấm áp và vui vẻ hơn hẳn.
将来、日本で働いて、いつか両親を日本へ招待したいです。それが私の目標です。毎日忙しいですが、家族や友達と一緒に過ごす時間は私にとって一番の宝物です。これからも、一日一日を大切にして、一生懸命頑張りたいと思います。
Trong tương lai, tôi muốn làm việc tại Nhật Bản và một ngày nào đó sẽ mời bố mẹ sang Nhật chơi. Đó chính là mục tiêu lớn nhất của tôi. Dù mỗi ngày đều bận rộn, nhưng thời gian ở bên gia đình và bạn bè là báu vật quý giá nhất đối với tôi. Từ giờ trở đi, tôi sẽ trân trọng từng ngày và cố gắng hết sức mình.`;

export default function BilingualReaderScreen() {
  const { isLightMode } = useThemeMode();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(16);

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-[#EFEFEF]" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className={`h-[52px] items-center justify-center border-b ${isLightMode ? "border-[#1E293B]" : "border-[#868686]"}`}>
        <AppText weight="bold" className={`text-[18px] ${isLightMode ? "text-black" : "text-white"}`}>
          Sách song ngữ Nhật - Việt
        </AppText>
      </View>

      <Pressable className="absolute left-4 top-11 z-20 h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>

      <View className={`mx-[21px] mt-[24px] rounded-[20px] px-[19px] pb-5 pt-[77px] ${isLightMode ? "bg-[#C2C7CE]" : "bg-[#303A51]"}`}>
        <Image source={{ uri: BOOK_COVER_URI }} className="absolute left-[137px] top-[6px] h-[84px] w-[75px] rounded-[10px]" />

        <View className="min-h-[94px] flex-row items-center rounded-[15px] bg-white px-5 py-3">
          <Ionicons name="information-circle-outline" size={24} color="#0B1220" />
          <View className="mx-4 flex-1 items-center">
            <AppText weight="bold" className="text-[18px] text-[#0F0F0F]">
              Một ngày của Yumi
            </AppText>
            <AppText className="text-[14px] text-[rgba(0,0,0,0.6)]">sách dành cho trình độ từ N5</AppText>
            <AppText weight="bold" className="text-[18px] text-black">
              {"<   CHƯƠNG 1   >"}
            </AppText>
          </View>
          <Pressable onPress={() => setShowSettingsPopup((v) => !v)}>
            <Feather name="menu" size={24} color="#0B1220" />
          </Pressable>
        </View>

        <View className="mt-[29px] max-h-[611px] min-h-[460px] rounded-[15px] bg-white px-4 py-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <AppText className="text-black" style={{ fontSize: readerFontSize, lineHeight: Math.round(readerFontSize * 1.6) }}>
              {CONTENT_TEXT}
            </AppText>
          </ScrollView>
        </View>
      </View>

      {showSettingsPopup && (
        <>
          <Pressable className="absolute inset-0" onPress={() => setShowSettingsPopup(false)} />
          <View
            className={`absolute right-[26px] top-[180px] w-[260px] rounded-[20px] px-[15px] py-[17px] ${
              isLightMode ? "bg-white border border-[#D1D5DB]" : "bg-[#303A51]"
            }`}
          >
            <View className={`items-center rounded-[15px] px-[29px] py-2 ${isLightMode ? "bg-[#F3F4F6]" : "bg-[#303A51]"}`}>
              <AppText weight="bold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                CÀI ĐẶT
              </AppText>
            </View>

            <View className={`mt-2 items-center gap-[17px] rounded-[15px] px-[7px] py-[13px] ${isLightMode ? "bg-[#F8FAFC]" : "bg-[#303A51]"}`}>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Cỡ chữ: {readerFontSize}</AppText>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
                    onPress={() => setReaderFontSize((prev) => Math.max(14, prev - 1))}
                  >
                    <Ionicons name="remove" size={12} color="#475569" />
                  </Pressable>
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
                    onPress={() => setReaderFontSize((prev) => Math.min(24, prev + 1))}
                  >
                    <Ionicons name="add" size={12} color="#475569" />
                  </Pressable>
                </View>
              </View>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Màu nền: Trắng</AppText>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </View>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Màu chữ: Đen</AppText>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
