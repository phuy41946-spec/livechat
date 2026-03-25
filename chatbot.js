// Main menu options - reusable
const MAIN_MENU_OPTIONS = [
  { text: "CẢNH BÁO GIẢ MẠO🚨", next: "canh_bao" },
  { text: "Nạp/Rút 💰", next: "nap_rut" },
  { text: "Tài khoản 🏃", next: "tai_khoan" },
  { text: "Tải game 🎮", next: "tai_game" },
  { text: "Lỗi OTP 🔢", next: "loi_otp" },
  { text: "Báo lỗi game 🚧", next: "bao_loi_game" },
  { text: "Lỗi vé cược 🚫", next: "loi_ve_cuoc" },
  { text: "Hoàn trả 2% ⚽", next: "hoan_tra" },
  { text: "Code tân thủ 🎁", next: "code_tan_thu" },
  { text: "Cách Nạp/Rút 💲", next: "cach_nap_rut" }
];

const GOODBYE_MSG = "Dạ cảm ơn anh đã liên hệ đến cổng game, nếu anh không cần hỗ trợ gì thêm, em xin phép kết thúc phiên hỗ trợ tại đây. Khi gặp vấn đề cần hỗ trợ, anh vui lòng liên hệ qua một trong các cổng thông tin sau:\n\nLivechat\nCập nhật tin tức tại kênh telegram: https://t.me/HitClubChinhHang\n\nLưu ý: Để đảm bảo an toàn trong quá trình chơi, anh vui lòng tải ứng dụng game về điện thoại tại trang: hitclub.sc\nChúc anh chơi game gặp nhiều may mắn ạ!";

const ASK_MORE = "Dạ anh cần hỗ trợ thông tin gì khác không ạ?";
const ASK_INFO = "Dạ anh vui lòng cung cấp tên hiển thị và số điện thoại kích hoạt giúp em ạ.";
const ASK_INFO_CHECK = "Dạ anh vui lòng cung cấp tên hiển thị và số điện thoại kích hoạt trong game để em kiểm tra cho anh ạ.";
const ASK_TICKET_IMG = "Dạ anh vui lòng cho em xin hình ảnh vé cược bị lỗi ạ.";

const chatbotScenario = {
  // ===== ROOT =====
  "start": {
    message: "Chào mừng {name} đến với Cổng Game Bài - Thể Thao đẳng cấp nhất thị trường với hệ thống Nạp - Rút siêu nhanh chóng và ổn định, mang đến cho quý khách những trải nghiệm tốt nhất khi tham gia.\nQuý khách vui lòng chọn vấn đề cần hỗ trợ bên dưới:",
    options: MAIN_MENU_OPTIONS
  },

  // ===== CẢNH BÁO GIẢ MẠO =====
  "canh_bao": {
    message: "⚠️ CẢNH BÁO LỪA ĐẢO\nHiện nay có rất nhiều website giả mạo thương hiệu HITCLUB để lừa đảo, cướp tiền người chơi. Quý khách lưu ý:\n➡️ Chỉ truy cập: hitclub.sc tuyệt đối KHÔNG đăng nhập những trang web giả mạo tìm kiếm được trên google.\n➡️ Kích hoạt eAuthenticator và số điện thoại ngay sau khi đăng ký.\n➡️ Tham gia kênh Telegram chính thức để nhận tin tức mới nhất tại: https://t.me/hitclubchinhhang\n➡️ Liên hệ với bộ phận CSKH của chúng tôi qua 𝗟𝗶𝘃𝗲𝗰𝗵𝗮𝘁\n🛡HITCLUB luôn bảo vệ Quý khách! Hãy là người chơi game thông thái nhất! 👍",
    options: []
  },

  // ===== NẠP/RÚT =====
  "nap_rut": {
    message: "Dạ anh cần hỗ trợ lệnh nạp hay rút ạ?",
    options: [
      { text: "Nạp", next: "nap" },
      { text: "Rút", next: "rut" }
    ]
  },
  "nap": {
    message: "Dạ lệnh nạp của anh gặp vấn đề gì cần bên em hỗ trợ ạ?",
    options: [
      { text: "Nạp lâu", next: "nap_lau" },
      { text: "Lệnh nạp bị từ chối", next: "nap_tu_choi" },
      { text: "Nạp thẻ cào lỗi", next: "nap_the_loi" }
    ]
  },
  "nap_lau": {
    message: "Dạ anh nạp sang bên em bằng hình thức nào ạ?",
    options: [
      { text: "Nạp Nhanh", next: "agent_transfer" },
      { text: "Nạp ngân hàng", next: "agent_transfer" },
      { text: "Nạp P2P", next: "agent_transfer" },
      { text: "Nạp tiền ảo", next: "agent_transfer" },
      { text: "Nạp ví điện tử", next: "agent_transfer" }
    ]
  },
  "nap_tu_choi": {
    message: "Dạ anh chuyển tiền sang bên em lúc mấy giờ ạ?\n(Vui lòng gõ câu trả lời theo định dạng 24h. Ví dụ: 0h, 15h, 23h, ...).",
    options: []
  },
  "nap_the_loi": {
    message: ASK_INFO,
    options: []
  },
  "rut": {
    message: "Dạ lệnh rút của anh gặp vấn đề gì ạ?",
    options: [
      { text: "Rút lâu", next: "rut_lau" },
      { text: "Lệnh bị hủy", next: "rut_lenh_huy" },
      { text: "Xác minh chính chủ", next: "rut_xac_minh" },
      { text: "Hủy lệnh rút", next: "rut_huy_lenh" },
      { text: "Rút tiền nổ hũ", next: "rut_no_hu" },
      { text: "Đổi thưởng thẻ cào", next: "rut_doi_the" }
    ]
  },
  "rut_lau": {
    message: ASK_INFO_CHECK,
    options: []
  },
  "rut_lenh_huy": {
    message: ASK_INFO_CHECK,
    options: []
  },
  "rut_xac_minh": {
    message: ASK_INFO_CHECK,
    options: []
  },
  "rut_huy_lenh": {
    message: "Dạ anh vui lòng cung cấp số tài khoản và họ tên chủ tài khoản ngân hàng đang rút về giúp em ạ.",
    options: []
  },
  "rut_no_hu": {
    message: "Dạ anh đang chơi game trên App hay Web ạ?",
    options: []
  },
  "rut_doi_the": {
    message: ASK_INFO,
    options: []
  },

  // ===== TÀI KHOẢN =====
  "tai_khoan": {
    message: "Dạ tài khoản của anh gặp vấn đề gì ạ?",
    options: [
      { text: "Tài khoản bị khóa", next: "tk_bi_khoa" },
      { text: "Quên mật khẩu", next: "tk_quen_mk" },
      { text: "Đăng ký tài khoản", next: "tk_dang_ky" },
      { text: "HD Kích hoạt SĐT", next: "tk_kich_hoat" },
      { text: "Liên hệ Hotline", next: "tk_hotline" },
      { text: "Vấn đề khác", next: "tk_van_de_khac" }
    ]
  },
  "tk_bi_khoa": {
    message: ASK_INFO,
    options: []
  },
  "tk_quen_mk": {
    message: ASK_INFO,
    options: []
  },
  "tk_dang_ky": {
    messages: [
      "Dạ em gửi anh các bước đăng ký tài khoản: \n\nBước 1: Đầu tiên anh Nhấp vào mục ĐĂNG KÝ\nBước 2: Điền Tên Đăng Nhập (viết liền không dấu), điền Mật Khẩu và Xác Nhận Mật Khẩu sau đó bấm vào ĐĂNG KÝ \nBước 3: Điền Tên Hiển Thị\n\nSau khi hoàn tất các bước ở trên hệ thống sẽ kích hoạt tài khoản của anh chỉ trong vài giây và sau đó anh có thể tham gia trải nghiệm game rồi ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "tk_kich_hoat": {
    messages: [
      "Dạ anh có thể vào ảnh đại diện trên game, chọn mục kích hoạt số điện thoại. Sau đó điền số điện thoại anh muốn kích hoạt và chọn nút kích hoạt.\nHệ thống sẽ gửi cho anh một SMS văn bản trong đó có dãy 6 số OTP nhưng không liên tục nhau => Anh lấy mã đó và vào game điền lại để kích hoạt ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "tk_hotline": {
    message: "Dạ anh vui lòng liên hệ Hotline qua số: 1900-xxxx hoặc chat trực tiếp trên Livechat để được hỗ trợ nhanh nhất ạ.",
    options: []
  },
  "tk_van_de_khac": {
    message: "Dạ tài khoản của anh gặp vấn đề gì cần em hỗ trợ ạ?",
    options: []
  },

  // ===== TẢI GAME =====
  "tai_game": {
    messages: [
      "Quý khách vui lòng cài đặt 1.1.1.1 để luôn truy cập được HIT.CLUB",
      "Để tham gia cổng game HITLCUB, quý khách có thể tải game về điện thoại tại: hitclub.sc hoặc chơi trực tiếp trên website bằng cách bấm vào \"CHƠI NHANH BẢN WEB\"."
    ],
    message: "Để tham gia cổng game HITLCUB, quý khách có thể tải game về điện thoại tại: hitclub.sc hoặc chơi trực tiếp trên website bằng cách bấm vào \"CHƠI NHANH BẢN WEB\".",
    options: []
  },

  // ===== LỖI OTP =====
  "loi_otp": {
    message: ASK_INFO,
    options: []
  },

  // ===== BÁO LỖI GAME =====
  "bao_loi_game": {
    message: ASK_INFO,
    options: []
  },

  // ===== LỖI VÉ CƯỢC =====
  "loi_ve_cuoc": {
    message: "Dạ anh chơi game gì bị lỗi thanh toán vé cược ạ?",
    options: [
      { text: "Tài xỉu", next: "vc_tai_xiu" },
      { text: "Tài Xỉu Live", next: "vc_tai_xiu_live" },
      { text: "Xóc đĩa", next: "vc_xoc_dia" },
      { text: "Xóc Đĩa Live", next: "vc_xoc_dia_live" },
      { text: "Game bài", next: "vc_game_bai" },
      { text: "Slot", next: "vc_slot" },
      { text: "Lô đề", next: "vc_lo_de" },
      { text: "Thể thao", next: "vc_the_thao" },
      { text: "Game Khác", next: "vc_game_khac" }
    ]
  },
  "vc_tai_xiu": { message: ASK_TICKET_IMG, options: [] },
  "vc_tai_xiu_live": { message: ASK_TICKET_IMG, options: [] },
  "vc_xoc_dia": { message: ASK_TICKET_IMG, options: [] },
  "vc_xoc_dia_live": { message: ASK_TICKET_IMG, options: [] },
  "vc_game_bai": { message: ASK_TICKET_IMG, options: [] },
  "vc_slot": { message: ASK_TICKET_IMG, options: [] },
  "vc_lo_de": { message: ASK_TICKET_IMG, options: [] },
  "vc_the_thao": {
    message: "Dạ vé cược thể thao của anh là chơi trên sảnh nào của bên em ạ?",
    options: [
      { text: "E-SPORTS", next: "agent_transfer" },
      { text: "K-SPORTS", next: "agent_transfer" },
      { text: "BTI-SPORTS", next: "agent_transfer" }
    ]
  },
  "vc_game_khac": { message: ASK_TICKET_IMG, options: [] },

  // ===== HOÀN TRẢ 2% =====
  "hoan_tra": {
    messages: [
      "Dạ từ ngày 15/06/2024, cổng game bên em có chương trình hoàn trả 2% dành cho các vé cược thể thao K-Sport với thông tin cụ thể như sau ạ:\n‎\n\nHoàn trả không giới hạn 2% tiền thua mỗi vé cược.\nÁp dụng cho tất cả các trận đấu.\nHoàn trả ngay khi có kết quả.",
      "Lưu ý: Chương trình hoàn trả 2% của vé cược thể thao K-Sport sẽ không áp dụng trong các trường hợp sau ạ:\n‎\n\nVé cược 2 bên, cược hoà, cược bị huỷ, cược vô hiệu.\nVé cược tỷ lệ DEC odds < 1.5; MY odds < 0.5; HK odds < 0.5; INDO odds < (-2) và US odds < (-200).",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },

  // ===== CODE TÂN THỦ =====
  "code_tan_thu": {
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },

  // ===== CÁCH NẠP/RÚT =====
  "cach_nap_rut": {
    message: "Dạ anh vui lòng chọn hình thức nạp/rút cần em hướng dẫn ạ.",
    options: [
      { text: "Nạp Ngân hàng", next: "hd_nap_nh" },
      { text: "Nạp Nhanh", next: "hd_nap_nhanh" },
      { text: "Nạp P2P", next: "hd_nap_p2p" },
      { text: "Nạp Tiền ảo", next: "hd_nap_tien_ao" },
      { text: "Nạp Viettel Pay", next: "hd_nap_viettel" },
      { text: "Nạp Momo", next: "hd_nap_momo" },
      { text: "Nạp ZaloPay", next: "hd_nap_zalo" },
      { text: "Nạp Thẻ cào", next: "hd_nap_the_cao" },
      { text: "Rút Ngân hàng", next: "hd_rut_nh" },
      { text: "Rút P2P", next: "hd_rut_p2p" },
      { text: "Rút Tiền ảo", next: "hd_rut_tien_ao" },
      { text: "Rút Thẻ cào", next: "hd_rut_the_cao" }
    ]
  },
  "hd_nap_nh": {
    messages: [
      "Dạ anh vui lòng thao tác theo các bước sau ạ:\n\nBước 1: Vào mục Nạp tiền -> Ngân hàng -> Nhấp chọn ngân hàng muốn chuyển để lấy số tài khoản và tên chủ tài khoản ngân hàng nhận bên em.\nBước 2: Đăng nhập vào tài khoản ngân hàng của anh -> Thực hiện chuyển tiền vào ngân hàng bên em. Anh cũng có thể ra ATM để chuyển trực tiếp hoặc ra quầy giao dịch của Ngân hàng nạp tiền mặt cũng được.\nBước 3: Sau khi chuyển khoản thành công, anh vào lại mục Nạp tiền, điền đầy đủ thông tin, bấm Nạp tiền và chờ ít phút để hệ thống xử lý giao dịch ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_nhanh": {
    messages: [
      "Dạ anh có thể nạp tiền rất nhanh bằng hình thức Nạp Nhanh. Để nạp tiền qua hình thức này, anh thao tác như sau:\n\nBước 1: Chọn Nạp tiền => Chọn NẠP NHANH => Chọn Nhà cung cấp => Nhập số tiền anh muốn chuyển.\nBước 2: Sao chép Nội Dung Chuyển Khoản bên góc phải (bấm chữ \"Copy\").\nBước 3: Đăng nhập vào ứng dụng ngân hàng, thực hiện thao tác chuyển tiền theo 2 cách: => Cách 1: Sao chép số tài khoản ngân hàng nhận, kiểm tra chính xác họ và tên => Dán mã \"Nội Dung Chuyển Khoản\" vào phần nội dung chuyển tiền => Cách 2: Quét mã QR bên góc phải màn hình => Nhập số tiền muốn chuyển\nBước 4: Sau khi thao tác chuyển tiền thành công, anh chờ hệ thống cập nhật tiền tự động vào tài khoản game ạ. LƯU Ý:\nMột mã giao dịch chỉ sử dụng 1 lần.\nGiao dịch sẽ bị huỷ nếu chuyển sai số tiền đã nhập.\nNạp tối thiểu 10,000 và nhỏ hơn 299,000,000\nMỗi mã giao dịch có thời hạn 30 phút.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_p2p": {
    messages: [
      "Dạ cổng game bên em có lên hình thức nạp tiền mới là Nạp P2P, với hình thức nạp này anh vui lòng \"Chọn số tiền\" anh muốn giao dịch, bấm \"Nạp Nhanh\" và vui lòng quét mã QR đã hiển thị sẵn, hoàn thành thao tác chuyển tiền. Sau khi chuyển khoản thành công anh vui lòng bấm \"ĐÃ CHUYỂN TIỀN\". Tải hình ảnh lên và chọn \"Xác Nhận\" sau đó chờ người bán xác nhận giao dịch. Lưu ý: - Mỗi mã code có thời hạn sử dụng tối đa là 10 phút. - Số tiền chuyển khoản phải chính xác với số tiền anh chọn trên trang ạ. - Điền đầy đủ và đúng nội dung \"MÃ GIAO DỊCH\".",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_tien_ao": {
    messages: [
      "Dạ anh có thể nạp tiền nhanh bằng hình thức TIỀN ẢO với thao tác như sau:\nBước 1:\n• Chọn NẠP TIỀN → TIỀN ẢO\n• Chọn loại tiền ảo để nạp\n• Copy địa chỉ ví trên trang cung cấp\nBước 2:\n• Chuyển đúng loại tiền ảo vào địa chỉ ví được cấp trên trang\n• Hệ thống sẽ lập tức xử lý giao dịch của anh ngay ạ\n‎\nLƯU Ý:\n• Tỷ giá chỉ mang tính tham khảo\n• Bên em không chịu trách nhiệm cho việc chuyển sai loại tiền ảo ạ",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_viettel": {
    messages: [
      "Dạ hiện tại bên em vừa cập nhật thêm hình thức nạp tiền nhanh qua ví Viettel Pay. Để nạp tiền qua hình thức này, anh thao tác như sau:\n\nBước 1: Bấm vào mục Nạp tiền => Chọn mục Ví điện tử => Chọn biểu tượng ViettelPay và điền vào số tiền cần chuyển.\nBước 2: Lấy thông tin số điện thoại hệ thống hiển thị => Bấm copy nội dung chuyển khoản. \nBước 3: Đăng nhập vào tài khoản ViettelPay của anh và chuyển tiền với nội dung chuyển khoản hiển thị tại trang. Ngoài ra, anh có thể chuyển khoản bằng cách quét mã QR code có sẵn trên trang (khi đó anh chỉ cần nhập số tiền muốn chuyển ạ).\nBước 4: Sau khi thao tác chuyển tiền thành công, anh chờ hệ thống cập nhật tiền vào tài khoản game ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_momo": {
    messages: [
      "Dạ cổng game bên em có lên hình thức nạp tiền Momo, với hình thức nạp này anh vui lòng chọn Ví điện tử -> Momo, nhập số tiền anh muốn giao dịch, bấm \"LẤY THÔNG TIN\" và vui lòng quét mã QR đã hiển thị sẵn, hoàn thành thao tác chuyển tiền.\nSau khi chuyển khoản thành công, hệ thống sẽ cập nhật tiền vào game ngay cho anh ạ.\nLưu ý: \n\nMỗi mã code có thời hạn sử dụng tối đa là 10 phút.\nMột mã code chỉ sử dụng 1 lần.\nSố tiền chuyển khoản phải chính xác với số tiền anh đã nhập trên trang ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_zalo": {
    messages: [
      "Dạ cổng game bên em có lên hình thức nạp tiền Zalo Pay, với hình thức nạp này anh vui lòng chọn Ví điện tử -> Zalo Pay, nhập số tiền anh muốn giao dịch, bấm \"LẤY THÔNG TIN\" và vui lòng quét mã QR đã hiển thị sẵn, hoàn thành thao tác chuyển tiền.\nSau khi chuyển khoản thành công, hệ thống sẽ cập nhật tiền vào game ngay cho anh ạ.\nLưu ý: \n\nMỗi mã code có thời hạn sử dụng tối đa là 10 phút.\nMột mã code chỉ sử dụng 1 lần.\nSố tiền chuyển khoản phải chính xác với số tiền anh đã nhập trên trang ạ.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_nap_the_cao": {
    messages: [
      "Dạ anh vào mục Nạp tiền -> Thẻ cào -> Chọn nhà mạng -> Chọn chính xác mệnh giá thẻ -> Điền số seri -> Điền mã thẻ -> Nhấp vào nút Nạp tiền để xác nhận. Tiền sẽ tự động cập nhật vào tài khoản Game của anh ạ.\nAnh lưu ý, trường hợp chọn sai mệnh giá bên em sẽ không hỗ trợ giải quyết vì thẻ cào do cổng nhà mạng xử lý ạ.",
      "Dạ hiện tại tỷ lệ quy đổi bên em tùy thuộc theo nhà mạng như sau ạ:\n\nViettel: 84%\nVinaphone: 86%\nMobiFone: 85%\nZing: 86%\nGarena: 85%\nVcoin: 85%",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_rut_nh": {
    messages: [
      "Dạ để rút tiền bằng hình thức ngân hàng, anh thực hiện theo các bước sau ạ:\n\nBước 1: Vào mục Rút tiền -> Ngân hàng.\nBước 2: Chọn ngân hàng muốn rút tiền về.\nBước 3: Điền chính xác số tài khoản và tên chủ tài khoản ngân hàng chính chủ của anh.\nBước 4: Điền số tiền muốn rút (Đầy đủ số 0 và tối thiểu 400.000).\nBước 5: Nhấn vào nút Rút tiền và chờ hệ thống xử lý.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_rut_p2p": {
    messages: [
      "Dạ cổng game bên em có lên hình thức rút tiền mới là Rút P2P, với hình thức rút này anh vui lòng \"Chọn số tiền\" anh muốn giao dịch, bấm \"Rút Nhanh\" và vui lòng điền thông tin ngân hàng của anh sau đó chọn \"Xác nhận\" => chờ người mua thanh toán tiền. Sau khi trạng thái cập nhật người mua đã thanh toán vui lòng kiểm tra số dư tài khoản ngân hàng và chọn \"Đã nhận tiền\" => Xác nhận 1 lần nữa \" Đã nhận tiền\" ạ. Lưu ý: Chỉ bấm xác nhận \"Đã nhận tiền\" khi số dư tài khoản ngân hàng đã được cộng tiền.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_rut_tien_ao": {
    messages: [
      "Dạ để rút tiền qua TIỀN ẢO USDT, anh thực hiện theo các bước sau ạ:\n\nBước 1: Vào mục RÚT TIỀN và chọn TIỀN ẢO.\nBước 2: Điền địa chỉ ví của anh và Số tiền rút (Anh vui lòng kiểm tra lại đúng địa chỉ ví rút của anh).\nBước 3: Chọn rút tiền và chờ hệ thống xử lý.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },
  "hd_rut_the_cao": {
    messages: [
      "Dạ để rút tiền về Thẻ cào, anh vui lòng thực hiện theo các bước sau ạ:\n\nBước 1: Vào mục RÚT TIỀN và chọn Thẻ Cào.\nBước 2: Chọn loại thẻ (Viettel, Vinaphone, MobiFone, VietnamMobile) phù hợp.\nBước 3: Chọn mệnh giá thẻ tương ứng số tiền cần rút.\nBước 4: Xác nhận ở Nút Đổi Thẻ và chờ hệ thống xử lý.",
      ASK_MORE
    ],
    message: ASK_MORE,
    options: [
      { text: "Có", next: "ask_more_co" },
      { text: "Không", next: "ask_more_khong" }
    ]
  },

  // ===== SHARED NODES =====
  "ask_more_co": {
    message: ASK_MORE,
    options: MAIN_MENU_OPTIONS
  },
  "ask_more_khong": {
    message: GOODBYE_MSG,
    options: [],
    closeChat: true
  },
  "agent_transfer": {
    message: "Dạ anh vui lòng cung cấp tên hiển thị và số điện thoại kích hoạt trong game để em kiểm tra cho anh ạ.",
    options: []
  }
};

module.exports = chatbotScenario;
