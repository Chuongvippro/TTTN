// Chạy: node migrate_blog_posts.js
// Thêm 12 bài viết mới (cộng với 3 bài đã có = tổng 15 bài, 5 bài/trang)
require("dotenv").config();
const connection = require("./src/config/db");

async function seedPosts() {
  try {
    const conn = await connection.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    conn.release();
  } catch (err) {
    console.error("❌ Không kết nối được:", err.message);
    process.exit(1);
  }

  // Category IDs:
  // 1 = Chăm sóc chó | 2 = Chăm sóc mèo | 3 = Dinh dưỡng | 4 = Sức khỏe | 5 = Mẹo & Thủ thuật

  const posts = [
    {
      title: "Hành Trình Nhận Nuôi Thú Cưng: Khi Tình Yêu Thay Đổi Tất Cả",
      slug: "hanh-trinh-nhan-nuoi-thu-cung-" + Date.now(),
      summary:
        "Câu chuyện cảm động về những chú chó, mèo được nhận nuôi và cách chúng thay đổi cuộc sống của chủ nhân.",
      category_id: 1,
      content: `<p>Mỗi năm, hàng ngàn chú chó và mèo tại Việt Nam đang chờ đợi một mái ấm thực sự. Nhận nuôi thú cưng không chỉ là hành động nhân đạo — đó là khởi đầu của một tình bạn suốt đời.</p>

<h3>🐾 Khi "Boss" bước vào cuộc đời</h3>
<p>Chị Minh Anh (TP.HCM) kể lại: "Hôm đó tôi ghé qua trại cứu hộ chỉ định 'xem thôi'. Vậy mà chưa đầy 30 phút, tôi đã ký giấy nhận nuôi một chú Corgi bị bỏ rơi tên Lucky. Đó là quyết định tốt nhất cuộc đời tôi."</p>

<h3>Những lợi ích bất ngờ khi nhận nuôi</h3>
<p>Nghiên cứu cho thấy người nuôi thú cưng có mức độ stress thấp hơn 25%, ngủ ngon hơn và có xu hướng vận động nhiều hơn. Đặc biệt, thú cưng được nhận nuôi thường rất trung thành và biết ơn chủ nhân.</p>

<h3>Chuẩn bị trước khi nhận nuôi</h3>
<p>Trước khi đưa bé về nhà, bạn cần chuẩn bị:</p>
<ul>
  <li>Không gian riêng với nệm ngủ, bát ăn sạch sẽ</li>
  <li>Thức ăn phù hợp với độ tuổi và giống loài</li>
  <li>Lịch tiêm phòng và khám sức khỏe ban đầu</li>
  <li>Tâm lý kiên nhẫn — bé cần thời gian làm quen</li>
</ul>

<h3>Những ngày đầu cùng bé mới</h3>
<p>Tuần đầu tiên là quan trọng nhất. Cho bé không gian riêng, không ép tiếp xúc quá nhiều. Dùng giọng nói nhẹ nhàng, thưởng đồ ăn khi bé có hành vi tốt. Dần dần bé sẽ nhận ra đây là ngôi nhà của mình.</p>

<blockquote>"Thú cưng được nhận nuôi không chỉ được cứu — chính chúng cũng đang cứu chúng ta theo một cách khác." — Trích câu chuyện từ cộng đồng pet lover</blockquote>`,
    },
    {
      title: "Chế Độ Dinh Dưỡng Chuẩn Cho Chó Trưởng Thành",
      slug: "che-do-dinh-duong-cho-cho-truong-thanh-" + (Date.now() + 1),
      summary:
        "Hướng dẫn chi tiết về dinh dưỡng cho chó từ 1 tuổi trở lên — loại thức ăn, khẩu phần và những lưu ý quan trọng.",
      category_id: 3,
      content: `<p>Chế độ dinh dưỡng đúng cách là nền tảng để chú cún của bạn sống khỏe mạnh và hạnh phúc. Một bữa ăn cân bằng không chỉ cung cấp năng lượng mà còn hỗ trợ hệ miễn dịch, lông da và xương khớp.</p>

<h3>🦴 Các nhóm dinh dưỡng cần thiết</h3>
<p><strong>Protein (30-35%):</strong> Nguồn đạm từ thịt gà, bò, cá — là thành phần chủ yếu xây dựng cơ bắp và hệ miễn dịch cho chó.</p>
<p><strong>Chất béo (15-20%):</strong> Cung cấp năng lượng, hỗ trợ hấp thụ vitamin và giúp lông bóng mượt. Nguồn tốt: dầu cá hồi, mỡ gà.</p>
<p><strong>Carbohydrate (30-40%):</strong> Gạo trắng, khoai lang, yến mạch cung cấp năng lượng bền vững và hỗ trợ tiêu hóa.</p>
<p><strong>Chất xơ:</strong> Rau xanh luộc chín giúp đường ruột hoạt động tốt.</p>

<h3>Khẩu phần ăn theo cân nặng</h3>
<ul>
  <li>Chó dưới 5kg: 100–150g thức ăn khô/ngày, chia 2 bữa</li>
  <li>Chó 5–15kg: 200–350g/ngày</li>
  <li>Chó 15–30kg: 350–500g/ngày</li>
  <li>Chó trên 30kg: 500–700g/ngày</li>
</ul>

<h3>⚠️ Những thứ KHÔNG nên cho chó ăn</h3>
<p>Chocolate, nho, hành tỏi, xylitol, xương nấu chín — tất cả đều có thể gây ngộ độc nghiêm trọng. Tham khảo bài viết chuyên sâu của chúng tôi về thực phẩm độc hại với thú cưng.</p>

<h3>Lựa chọn thức ăn công nghiệp</h3>
<p>Các thương hiệu uy tín như Royal Canin, Hills Science Diet, Orijen cung cấp công thức dinh dưỡng cân bằng theo giống và độ tuổi. Luôn đọc nhãn thành phần và chọn loại có protein từ thịt thật là thành phần đầu tiên.</p>`,
    },
    {
      title: "Bí Quyết Chăm Sóc Lông Mèo Luôn Bóng Mượt",
      slug: "bi-quyet-cham-soc-long-meo-bong-muot-" + (Date.now() + 2),
      summary:
        "Từ chải lông đúng cách đến chọn sữa tắm phù hợp — tất cả bí quyết để bộ lông mèo luôn đẹp và khỏe.",
      category_id: 2,
      content: `<p>Bộ lông của mèo không chỉ là vẻ đẹp bên ngoài mà còn phản ánh sức khỏe tổng thể. Mèo khỏe mạnh có lông bóng mượt, không bị rụng nhiều và không có mùi khó chịu.</p>

<h3>🐱 Tần suất chải lông theo loại lông</h3>
<p><strong>Mèo lông ngắn</strong> (Anh lông ngắn, Scottish Fold): Chải 2-3 lần/tuần bằng lược mịn để loại bỏ lông chết.</p>
<p><strong>Mèo lông dài</strong> (Ba Tư, Maine Coon, Ragdoll): Chải hàng ngày để tránh lông bị rối và vón cục, đặc biệt vùng bụng và sau tai.</p>

<h3>Cách chải lông đúng kỹ thuật</h3>
<ul>
  <li>Bắt đầu từ đầu xuống đuôi, chải theo chiều lông mọc</li>
  <li>Dùng lược thưa trước để gỡ rối, sau đó lược mịn để làm mượt</li>
  <li>Chú ý vùng nách, bẹn — dễ bị rối nhất</li>
  <li>Kết thúc bằng khăn mềm ẩm lau nhẹ để lông bóng hơn</li>
</ul>

<h3>Tắm mèo đúng cách</h3>
<p>Không như chó, mèo không cần tắm thường xuyên — khoảng 1-2 tháng/lần là đủ. Chọn sữa tắm chuyên dụng cho mèo, không dùng sữa tắm người vì pH khác nhau có thể gây kích ứng da.</p>
<p>Nước tắm ở nhiệt độ 38-40°C (ấm vừa tay), tắm nhanh gọn trong 10-15 phút và sấy khô hoàn toàn để tránh cảm lạnh.</p>

<h3>Dinh dưỡng hỗ trợ lông đẹp</h3>
<p>Bổ sung omega-3 từ dầu cá hồi (2-3 giọt/ngày) giúp lông bóng mượt từ bên trong. Một số thức ăn hạt cao cấp đã tích hợp sẵn thành phần này.</p>`,
    },
    {
      title: "Lịch Tiêm Phòng Cho Chó Mèo: Đầy Đủ Từ A Đến Z",
      slug: "lich-tiem-phong-cho-cho-meo-" + (Date.now() + 3),
      summary:
        "Hướng dẫn lịch tiêm vaccine đầy đủ cho chó và mèo theo từng độ tuổi, giúp thú cưng khỏe mạnh suốt đời.",
      category_id: 4,
      content: `<p>Tiêm phòng là biện pháp phòng bệnh hiệu quả và tiết kiệm nhất cho thú cưng. Một mũi vaccine có thể bảo vệ bé hàng năm trời khỏi các bệnh nguy hiểm.</p>

<h3>💉 Lịch tiêm phòng cho CHÓ</h3>
<p><strong>6-8 tuần tuổi:</strong> Vaccine DHPPi (Distemper, Hepatitis, Parvo, Parainfluenza) — mũi đầu tiên cực kỳ quan trọng.</p>
<p><strong>10-12 tuần tuổi:</strong> DHPPi nhắc lại + Lepto (phòng bệnh Leptospirosis).</p>
<p><strong>14-16 tuần tuổi:</strong> DHPPi + Lepto nhắc lại + Dại (bắt buộc theo quy định).</p>
<p><strong>Hàng năm:</strong> Nhắc lại toàn bộ để duy trì miễn dịch.</p>

<h3>💉 Lịch tiêm phòng cho MÈO</h3>
<p><strong>8 tuần tuổi:</strong> Vaccine FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia).</p>
<p><strong>12 tuần tuổi:</strong> FVRCP nhắc lại + FeLV (Feline Leukemia Virus) nếu mèo ra ngoài.</p>
<p><strong>16 tuần tuổi:</strong> Vaccine Dại.</p>
<p><strong>Hàng năm:</strong> Nhắc lại đầy đủ.</p>

<h3>Lưu ý quan trọng trước và sau tiêm</h3>
<ul>
  <li>Chỉ tiêm khi thú cưng hoàn toàn khỏe mạnh, không bị sốt hay ốm</li>
  <li>Nhịn ăn nhẹ 2-3 giờ trước tiêm để tránh nôn mửa</li>
  <li>Theo dõi 30 phút tại phòng khám sau tiêm</li>
  <li>Hạn chế hoạt động mạnh trong 24 giờ sau tiêm</li>
  <li>Tái khám ngay nếu bé sốt cao, sưng chỗ tiêm hoặc bỏ ăn</li>
</ul>

<h3>Tẩy giun định kỳ đi kèm</h3>
<p>Song song với tiêm phòng, tẩy giun cho thú cưng 3 tháng/lần là cần thiết. Giun sán làm suy giảm hệ miễn dịch và ảnh hưởng đến hiệu quả của vaccine.</p>`,
    },
    {
      title: "10 Đồ Chơi Giúp Chó Mèo Vận Động Và Giảm Stress",
      slug: "do-choi-giup-cho-meo-van-dong-" + (Date.now() + 4),
      summary:
        "Danh sách đồ chơi tốt nhất giúp thú cưng vận động hàng ngày, tránh béo phì và giảm các hành vi phá phách.",
      category_id: 5,
      content: `<p>Thú cưng nuôi trong nhà thường thiếu vận động, dễ dẫn đến béo phì, trầm cảm và hành vi phá phách. Đồ chơi phù hợp là giải pháp đơn giản nhưng hiệu quả.</p>

<h3>🐶 Đồ chơi tốt nhất cho CHÓ</h3>
<p><strong>1. Bóng Kong nhồi đồ ăn:</strong> Nhét hạt khô hoặc peanut butter vào bóng cao su — bé có thể chơi cả tiếng đồng hồ. Kích thích trí não lẫn vận động.</p>
<p><strong>2. Dây kéo co:</strong> Trò chơi tương tác giữa chủ và cún, giúp bé vận động toàn thân và tăng gắn kết.</p>
<p><strong>3. Bóng đuổi:</strong> Đơn giản nhưng hiệu quả — ném và để bé đuổi theo. Phù hợp với chó năng động.</p>
<p><strong>4. Puzzle feeder:</strong> Khay ăn dạng câu đố — bé phải giải đố để lấy đồ ăn, kích thích trí tuệ.</p>
<p><strong>5. Đồ chơi phát âm thanh:</strong> Tạo sự kích thích và hứng thú cho chó, đặc biệt khi bạn vắng nhà.</p>

<h3>🐱 Đồ chơi tốt nhất cho MÈO</h3>
<p><strong>6. Cần câu lông vũ:</strong> Kích thích bản năng săn mồi — mèo nhà nào cũng mê. Chơi 10-15 phút/ngày rất tốt.</p>
<p><strong>7. Chuột điện tự động:</strong> Tự di chuyển ngẫu nhiên, giữ mèo hoạt động kể cả khi bạn không ở nhà.</p>
<p><strong>8. Cây cào móng + nhà leo trèo:</strong> Vừa cho mèo leo trèo, vừa bảo vệ đồ nội thất nhà bạn.</p>
<p><strong>9. Bóng nhỏ phát tiếng kêu:</strong> Mèo thích đập và lăn — để dưới sàn là bé tự chơi suốt.</p>
<p><strong>10. Đường hầm vải:</strong> Mèo thích chui vào không gian hẹp — đường hầm vải tạo môi trường vui chơi kích thích.</p>

<h3>Lưu ý an toàn khi chọn đồ chơi</h3>
<ul>
  <li>Không có bộ phận nhỏ dễ nuốt</li>
  <li>Chất liệu không độc, không sắc nhọn</li>
  <li>Phù hợp với kích thước của bé</li>
  <li>Thay đổi đồ chơi thường xuyên để bé không nhàm</li>
</ul>`,
    },
    {
      title: "10 Dấu Hiệu Chó Bị Ốm Cần Đưa Đi Bác Sĩ Ngay",
      slug: "dau-hieu-cho-bi-om-can-gap-bac-si-" + (Date.now() + 5),
      summary:
        "Chó không thể nói khi bị đau — nhận biết sớm các dấu hiệu bất thường có thể cứu sống thú cưng của bạn.",
      category_id: 4,
      content: `<p>Thú cưng không thể nói lên nỗi đau của mình. Là người chủ, bạn phải là "bác sĩ đầu tiên" của bé — biết nhận ra khi nào bé cần được chăm sóc y tế.</p>

<h3>🚨 10 dấu hiệu cần đến bác sĩ ngay</h3>

<p><strong>1. Bỏ ăn quá 24 giờ</strong><br>Chó khỏe mạnh rất ít khi bỏ bữa. Nếu bé không ăn quá một ngày kèm theo uể oải, cần kiểm tra ngay.</p>

<p><strong>2. Nôn mửa hoặc tiêu chảy liên tục</strong><br>1-2 lần có thể là do ăn phải thứ lạ. Nhưng nếu kéo dài hơn 12 giờ hoặc có máu trong chất nôn — đây là cấp cứu.</p>

<p><strong>3. Bụng căng phồng bất thường</strong><br>Đặc biệt nguy hiểm ở chó lớn — có thể là dấu hiệu xoắn dạ dày, đe dọa tính mạng trong vài giờ.</p>

<p><strong>4. Khó thở, thở nhanh bất thường</strong><br>Môi và lưỡi tím tái là dấu hiệu cấp cứu. Đưa đến phòng khám ngay lập tức.</p>

<p><strong>5. Co giật hoặc mất thăng bằng</strong><br>Có thể do động kinh, ngộ độc hoặc vấn đề thần kinh. Không tự xử lý tại nhà.</p>

<p><strong>6. Uống nước quá nhiều hoặc đi tiểu nhiều</strong><br>Dấu hiệu cảnh báo tiểu đường hoặc bệnh thận — cần xét nghiệm máu và nước tiểu.</p>

<p><strong>7. Chó liếm, gãi một chỗ liên tục</strong><br>Có thể là dị ứng, nhiễm nấm hoặc viêm da. Không được tự bôi kem người — có thể độc với chó.</p>

<p><strong>8. Mắt đỏ, chảy dịch, mờ đục</strong><br>Viêm kết mạc, đục thủy tinh thể hoặc tăng nhãn áp cần điều trị sớm để tránh mù lòa.</p>

<p><strong>9. Đi khập khiễng hoặc không chịu đứng dậy</strong><br>Chấn thương xương khớp hoặc viêm khớp — cần chụp X-quang để xác định.</p>

<p><strong>10. Sút cân nhanh không rõ nguyên nhân</strong><br>Giảm 10% cân nặng trong 1 tháng mà không thay đổi chế độ ăn là dấu hiệu của nhiều bệnh nghiêm trọng.</p>

<h3>Chuẩn bị tủ thuốc cơ bản cho thú cưng</h3>
<p>Nước muối sinh lý, gạc y tế, nhiệt kế hậu môn và số điện thoại phòng khám thú y gần nhà — những thứ này nên có sẵn trong nhà.</p>`,
    },
    {
      title: "Mèo Có Cần Tắm Không? Hướng Dẫn Tắm Mèo Đúng Cách",
      slug: "huong-dan-tam-meo-dung-cach-" + (Date.now() + 6),
      summary:
        "Sự thật về việc tắm mèo — khi nào cần, khi nào không, và cách tắm để cả bạn lẫn bé đều... sống sót!",
      category_id: 2,
      content: `<p>Khác với chó, mèo là động vật tự vệ sinh rất tốt. Chúng dành 30-50% thời gian thức để tự làm sạch bản thân. Vậy có cần tắm không?</p>

<h3>🐈 Khi nào MÈO cần được tắm?</h3>
<ul>
  <li>Bé dính bùn, dầu hoặc chất bẩn không thể tự làm sạch</li>
  <li>Điều trị bệnh ngoài da theo chỉ định bác sĩ</li>
  <li>Mèo bị béo phì hoặc già yếu không tự vệ sinh được</li>
  <li>Chuẩn bị cho triển lãm (show cat)</li>
  <li>Chủ bị dị ứng với lông mèo — tắm giúp giảm dị nguyên</li>
</ul>

<h3>Tần suất tắm lý tưởng</h3>
<p>Mèo lông ngắn trong nhà: 4-6 tuần/lần. Mèo lông dài: 3-4 tuần/lần. Không nên tắm quá thường xuyên vì làm mất dầu tự nhiên trên da mèo.</p>

<h3>Quy trình tắm mèo từng bước</h3>
<p><strong>Bước 1 — Chuẩn bị:</strong> Chải lông trước để gỡ rối. Cắt móng trước 1-2 ngày (không cắt ngay trước tắm). Chuẩn bị sẵn khăn bông, máy sấy tóc, sữa tắm mèo chuyên dụng.</p>

<p><strong>Bước 2 — Làm ướt lông:</strong> Dùng vòi hoa sen nhỏ, nước ấm 38-39°C. Tránh ướt vùng đầu, tai và mắt. Nói chuyện nhẹ nhàng với bé trong suốt quá trình.</p>

<p><strong>Bước 3 — Xà phòng hóa:</strong> Lấy lượng sữa tắm vừa đủ, massage nhẹ nhàng theo chiều lông. Chú ý vùng bụng, nách và sau tai — những nơi dễ bị bẩn nhất.</p>

<p><strong>Bước 4 — Xả sạch:</strong> Xả đến khi nước chảy ra hoàn toàn trong — không được để sót sữa tắm vì mèo sẽ liếm vào.</p>

<p><strong>Bước 5 — Sấy khô:</strong> Quan trọng nhất! Lau khô trước bằng 2-3 khăn bông, sau đó sấy ở nhiệt độ thấp cách da 20-30cm. Mèo bị ướt lâu dễ bị cảm.</p>

<h3>Mẹo để mèo bớt sợ tắm</h3>
<p>Cho mèo làm quen với âm thanh nước từ nhỏ. Luôn thưởng đồ ăn sau mỗi lần tắm để tạo liên kết tích cực. Tắm nhanh gọn trong 10-15 phút.</p>`,
    },
    {
      title: "Nuôi Chó Poodle: Tính Cách, Đặc Điểm Và Cách Chăm Sóc",
      slug: "nuoi-cho-poodle-cach-cham-soc-" + (Date.now() + 7),
      summary:
        "Chó Poodle thông minh, dễ huấn luyện và không rụng lông — lý do tại sao đây là giống chó được yêu thích nhất Việt Nam.",
      category_id: 1,
      content: `<p>Poodle đứng đầu bảng xếp hạng giống chó thông minh nhất thế giới (vị trí số 2 theo Stanley Coren). Tại Việt Nam, Poodle đang là giống chó cảnh được yêu thích nhất nhờ tính cách dễ thương và bộ lông xoăn đặc trưng.</p>

<h3>🐩 Đặc điểm nổi bật của Poodle</h3>
<p><strong>Kích thước:</strong> Có 3 loại — Standard (20-32kg), Miniature (5-9kg) và Toy (dưới 4kg). Toy Poodle phổ biến nhất tại Việt Nam.</p>
<p><strong>Lông:</strong> Xoăn dày, hầu như không rụng — lý tưởng cho người dị ứng với lông chó.</p>
<p><strong>Tuổi thọ:</strong> 12-15 năm — khá cao so với nhiều giống chó khác.</p>
<p><strong>Tính cách:</strong> Thân thiện, vui vẻ, cực kỳ thông minh và gắn bó với chủ.</p>

<h3>Chế độ ăn uống</h3>
<p>Toy Poodle cần 100-150g thức ăn khô/ngày chia 2-3 bữa. Chọn thức ăn dành riêng cho giống chó nhỏ (small breed) để đảm bảo hàm lượng canxi và phốt pho phù hợp với xương khớp nhỏ.</p>

<h3>Chăm sóc lông và vệ sinh</h3>
<p>Lông Poodle mọc liên tục nên cần cắt tỉa 6-8 tuần/lần. Chải lông hàng ngày để tránh rối. Tắm 2-3 tuần/lần với sữa tắm dành cho Poodle hoặc chó lông xoăn.</p>
<p>Đánh răng 2-3 lần/tuần vì Poodle dễ bị bệnh nha chu. Vệ sinh tai hàng tuần — tai rủ xuống của Poodle dễ tích tụ ẩm gây nhiễm nấm.</p>

<h3>Huấn luyện Poodle</h3>
<p>Nhờ IQ cao, Poodle học rất nhanh. Bắt đầu huấn luyện từ 8 tuần tuổi với các lệnh cơ bản: Ngồi, Nằm, Đứng, Lại đây. Dùng phương pháp thưởng — không phạt — cho kết quả tốt nhất với giống chó nhạy cảm này.</p>`,
    },
    {
      title: "Cách Huấn Luyện Chó Nghe Lời Từ Khi Còn Nhỏ",
      slug: "cach-huan-luyen-cho-nghe-loi-" + (Date.now() + 8),
      summary:
        "Phương pháp huấn luyện chó hiệu quả nhất — dựa trên khoa học hành vi, không cần roi vọt, chỉ cần kiên nhẫn và tình yêu.",
      category_id: 5,
      content: `<p>Một chú chó được huấn luyện tốt không chỉ ngoan hơn — bé còn hạnh phúc hơn, tự tin hơn và ít stress hơn. Huấn luyện là ngôn ngữ giao tiếp giữa bạn và bé.</p>

<h3>🎓 Nguyên tắc vàng khi huấn luyện</h3>
<p><strong>Nhất quán:</strong> Tất cả thành viên trong nhà phải dùng cùng một lệnh. Không được hôm nay cho lên sofa, hôm sau lại la mắng.</p>
<p><strong>Thưởng ngay lập tức:</strong> Khoảng thời gian giữa hành vi và phần thưởng phải dưới 3 giây để chó hiểu được kết nối.</p>
<p><strong>Buổi tập ngắn:</strong> 5-10 phút/lần, 2-3 lần/ngày — tốt hơn một buổi dài 30 phút.</p>
<p><strong>Kết thúc tích cực:</strong> Luôn kết thúc mỗi buổi tập bằng một thành công, dù nhỏ.</p>

<h3>5 lệnh cơ bản cần dạy đầu tiên</h3>
<p><strong>1. "Ngồi" (Sit):</strong> Lệnh dễ nhất, dạy đầu tiên. Cầm đồ ăn trên đầu bé, di chuyển về phía sau — bé sẽ tự ngồi xuống khi cố nhìn theo. Nói "Ngồi" đúng lúc đó và thưởng ngay.</p>

<p><strong>2. "Nằm" (Down):</strong> Từ tư thế ngồi, hạ đồ ăn xuống sàn — kéo về phía bạn. Bé sẽ tự nằm xuống để với tới.</p>

<p><strong>3. "Đứng yên" (Stay):</strong> Sau khi bé ngồi, giơ tay ra hiệu dừng, lùi từng bước nhỏ. Thưởng khi bé giữ nguyên vị trí.</p>

<p><strong>4. "Lại đây" (Come):</strong> Ngồi xuống ngang tầm mắt bé, gọi tên + "lại đây" với giọng vui vẻ. Đây là lệnh quan trọng nhất về an toàn.</p>

<p><strong>5. "Thả ra" (Leave it):</strong> Cực kỳ quan trọng để ngăn chó nhặt đồ độc hại. Đặt đồ ăn trên sàn, che tay lại khi bé tiến đến. Thưởng khi bé quay đi.</p>

<h3>Xử lý các hành vi xấu</h3>
<p>Không la hét, không đánh — chỉ cần phớt lờ hoàn toàn hành vi xấu và thưởng hành vi tốt. Chó sẽ tự học rằng hành vi nào mang lại kết quả tốt hơn.</p>`,
    },
    {
      title: "Câu Chuyện Cảm Động: Chú Chó Cứu Chủ Trong Đêm Lũ",
      slug: "cau-chuyen-cho-cuu-chu-trong-dem-lu-" + (Date.now() + 9),
      summary:
        "Câu chuyện có thật về tình bạn giữa người và chó — khi bản năng trung thành vượt qua mọi giới hạn.",
      category_id: 1,
      content: `<p>Đêm tháng 10/2023 tại Quảng Nam, mưa lũ tràn về bất ngờ. Anh Tuấn, 45 tuổi, đang ngủ thì bị Rex — chú chó lai 4 tuổi — liên tục cào và sủa inh ỏi...</p>

<h3>🌊 Đêm Rex cứu cả gia đình</h3>
<p>Anh Tuấn kể lại: "Lúc đó là 2 giờ sáng, Rex cứ sủa và cào cửa phòng tôi không ngừng. Tôi mở cửa ra thì thấy nước đã vào nhà đến mắt cá chân. Nếu không có Rex, cả nhà tôi có thể không kịp di tản."</p>

<p>Gia đình anh Tuấn cùng Rex đã kịp leo lên tầng 2 trước khi nước dâng ngập cả tầng 1. Câu chuyện được chia sẻ rộng rãi trên mạng xã hội, nhận về hàng triệu lượt cảm ơn.</p>

<h3>Bản năng đặc biệt của chó</h3>
<p>Khoa học đã chứng minh chó có thể phát hiện thay đổi về áp suất không khí, mùi đất ẩm và âm thanh tần số thấp mà tai người không nghe được — những dấu hiệu báo trước thiên tai.</p>

<p>Không chỉ thiên tai, chó còn được huấn luyện để phát hiện động kinh, hạ đường huyết, thậm chí một số loại ung thư giai đoạn sớm qua mùi cơ thể.</p>

<h3>Tình yêu không cần ngôn ngữ</h3>
<p>Câu chuyện của Rex chỉ là một trong hàng ngàn câu chuyện tương tự trên khắp thế giới — nơi những chú chó chứng minh rằng tình trung thành của chúng không cần bất kỳ ngôn ngữ nào để diễn đạt.</p>

<blockquote>"Chó không quan tâm bạn giàu hay nghèo, thành công hay thất bại. Với bé, bạn chỉ đơn giản là cả thế giới." — Khuyết danh</blockquote>

<h3>Chăm sóc để đáp lại tình yêu đó</h3>
<p>Khi một chú chó yêu bạn vô điều kiện như vậy, điều bạn có thể làm là chăm sóc bé thật tốt — đủ dinh dưỡng, đủ vận động, đủ tình yêu thương và kiểm tra sức khỏe định kỳ.</p>`,
    },
    {
      title: "Hướng Dẫn Vệ Sinh Tai Và Mắt Cho Thú Cưng Tại Nhà",
      slug: "ve-sinh-tai-mat-cho-thu-cung-tai-nha-" + (Date.now() + 10),
      summary:
        "Tai và mắt là hai bộ phận dễ bị nhiễm khuẩn nhất ở thú cưng — hướng dẫn chi tiết cách vệ sinh đúng và an toàn.",
      category_id: 5,
      content: `<p>Tai và mắt thú cưng cần được vệ sinh định kỳ để phòng ngừa viêm nhiễm. Đây là kỹ năng cơ bản mà mọi người nuôi thú cưng cần nắm vững.</p>

<h3>👂 Vệ sinh tai — Thực hiện 1 lần/tuần</h3>

<p><strong>Dụng cụ cần có:</strong> Dung dịch rửa tai chuyên dụng cho thú cưng, bông gòn sạch, đèn pin nhỏ.</p>

<p><strong>Nhận biết tai bình thường:</strong> Màu hồng nhạt, không có mùi, không có dịch tiết nhiều. Một ít ráy tai màu nâu nhạt là bình thường.</p>

<p><strong>Dấu hiệu cần xử lý:</strong> Bé hay lắc đầu, gãi tai, có mùi hôi từ tai, tai đỏ hoặc sưng, ráy tai màu đen hoặc vàng — đây có thể là nhiễm nấm hoặc viêm tai ngoài.</p>

<p><strong>Cách thực hiện:</strong></p>
<ol>
  <li>Giữ bé ngồi yên, dùng đèn pin kiểm tra ống tai</li>
  <li>Nhỏ vài giọt dung dịch rửa tai vào ống tai</li>
  <li>Massage nhẹ nhàng phần gốc tai 20-30 giây</li>
  <li>Để bé lắc đầu để chất bẩn trồi ra ngoài</li>
  <li>Dùng bông gòn lau sạch phần ngoài — không đưa sâu vào trong</li>
</ol>

<h3>👁️ Vệ sinh mắt — Thực hiện 2-3 lần/tuần</h3>

<p><strong>Dấu hiệu mắt khỏe mạnh:</strong> Tròng đen rõ ràng, lòng trắng không đỏ, không có dịch tiết nhiều, bé không dụi mắt.</p>

<p><strong>Cách vệ sinh:</strong></p>
<ol>
  <li>Dùng gạc mềm hoặc bông gòn thấm nước muối sinh lý</li>
  <li>Lau nhẹ nhàng từ trong ra ngoài (từ khóe mắt gần mũi ra phía đuôi mắt)</li>
  <li>Dùng miếng gạc mới cho mỗi mắt — không dùng chéo</li>
  <li>Không dùng nước máy hoặc nước mưa để rửa mắt</li>
</ol>

<p><strong>Khi nào cần gặp bác sĩ:</strong> Mắt đỏ kéo dài, dịch mắt màu vàng/xanh, mắt sưng phù, bé liên tục dụi mắt.</p>

<h3>Mẹo giúp thú cưng hợp tác</h3>
<p>Tập từ nhỏ, thưởng đồ ăn sau mỗi lần vệ sinh. Khi bé quen dần, việc vệ sinh tai mắt sẽ trở thành thói quen dễ dàng cho cả hai.</p>`,
    },
    {
      title: "Chọn Chuồng Và Nệm Ngủ Phù Hợp Cho Chó Mèo",
      slug: "chon-chuong-nem-ngu-cho-cho-meo-" + (Date.now() + 11),
      summary:
        "Hướng dẫn chọn không gian nghỉ ngơi lý tưởng cho thú cưng — đúng kích thước, chất liệu và vị trí đặt trong nhà.",
      category_id: 5,
      content: `<p>Thú cưng ngủ trung bình 12-16 tiếng mỗi ngày — vì vậy không gian nghỉ ngơi ảnh hưởng rất lớn đến sức khỏe và chất lượng cuộc sống của bé.</p>

<h3>🛏️ Tiêu chí chọn nệm ngủ cho CHÓ</h3>

<p><strong>Kích thước:</strong> Bé phải nằm duỗi thẳng thoải mái. Đo từ mũi đến gốc đuôi và cộng thêm 15-20cm. Không nên chọn quá nhỏ.</p>

<p><strong>Chất liệu lõi:</strong>
<ul>
  <li>Memory foam: Tốt nhất cho chó lớn và chó già có vấn đề xương khớp</li>
  <li>Bông polyester: Phù hợp chó nhỏ, mềm mại và nhẹ</li>
  <li>Cotton hữu cơ: An toàn cho chó hay nhai</li>
</ul>
</p>

<p><strong>Vỏ nệm:</strong> Phải tháo ra giặt được — vệ sinh ít nhất 2 tuần/lần để tránh vi khuẩn và ve bọ.</p>

<h3>Tiêu chí chọn nệm/nhà cho MÈO</h3>

<p>Mèo có tập tính ngủ theo nhiều tư thế khác nhau và thích không gian kín. Các lựa chọn:</p>
<ul>
  <li><strong>Hang mèo/nhà mèo có mái:</strong> Mèo cảm thấy an toàn trong không gian bán kín</li>
  <li><strong>Nệm tròn có thành cao:</strong> Mèo thích cuộn tròn — thành cao giúp bé cảm giác được bao bọc</li>
  <li><strong>Võng mèo gắn cửa sổ:</strong> Tận dụng ánh nắng mặt trời, mèo rất thích</li>
</ul>

<h3>Vị trí đặt không gian ngủ</h3>
<p><strong>Tránh:</strong> Lối đi, cạnh cửa ra vào có gió lùa, gần nguồn nhiệt trực tiếp.</p>
<p><strong>Nên đặt ở:</strong> Góc yên tĩnh, thoáng mát, không bị ánh đèn chiếu thẳng vào mặt bé khi ngủ. Độ cao vừa phải — không quá cao để tránh té.</p>

<h3>Giai đoạn tập làm quen</h3>
<p>Đặt đồ vật có mùi quen thuộc (áo cũ của bạn) vào nệm mới. Thưởng đồ ăn khi bé tự bước vào. Đừng ép — hãy để bé tự khám phá và quyết định.</p>`,
    },
  ];

  let successCount = 0;
  for (const post of posts) {
    try {
      await connection.query(
        `INSERT IGNORE INTO blog_posts (title, slug, summary, content, category_id, status)
         VALUES (?, ?, ?, ?, ?, 'published')`,
        [post.title, post.slug, post.summary, post.content, post.category_id],
      );
      console.log(`✅ Đã thêm: "${post.title.substring(0, 50)}..."`);
      successCount++;
    } catch (err) {
      console.error(
        `❌ Lỗi: "${post.title.substring(0, 40)}" — ${err.message}`,
      );
    }
  }

  console.log(
    `\n🎉 Hoàn tất! Đã thêm ${successCount}/${posts.length} bài viết mới.`,
  );
  console.log("📝 Tổng cộng 15 bài viết — 5 bài/trang x 3 trang.");
  process.exit(0);
}

seedPosts();
