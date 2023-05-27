# Cách lấy danh sách điểm

### Bước 1:
Truy cập vào trang [đăng nhập](https://daotao.vku.udn.vn/sv) của VKU

<img src="https://i.ibb.co/hmghpT6/image.png" alt="image" border="0">

### Bước 2:
Sau khi đăng nhập thành công, truy cập vào trang [điểm](https://daotao.vku.udn.vn/sv/diem) của VKU

<img src="https://i.ibb.co/CzBqD45/image.png" alt="image" border="0">

### Bước 3:

#### Mở chế độ `Developer Tools` của trình duyệt
   
Các cách mở `Developer Tools`:
- Bấm tổ hợp phím `F12` hoặc `Fn + F12`(nếu thiết bị cần thêm phím `Fn`) trên bàn phím
- Trên trình duyệt Chrome, Edge, Opera, Vivaldi, Brave, Coc Coc, Yandex, Firefox ...: Nhấn tổ hợp phím `Ctrl + Shift + I` hoặc `F12`
- Trên trình duyệt Safari: Nhấn tổ hợp phím `Option + Command + I`
- Hoặc có thể click chuột phải vào trang web 
  - Nếu sử dụng ngôn ngữ tiếng Anh: Chọn `Inspect` hoặc `Inspect Element`
  - Nếu sử dụng ngôn ngữ tiếng Việt: Chọn `Kiểm tra` hoặc `Kiểm tra phần tử`

Sau khi mở `Developer Tools` thành công, chọn tab `Console` để tiến hành thực hiện các bước tiếp theo

<img src="https://i.ibb.co/QCzyV7y/image.png" alt="image" border="0">

### Bước 4: Tải xuống file điểm

Copy đoạn mã sau và dán vào `Console` rồi nhấn `Enter` để thực hiện

<i  class="text-danger" > Chúng tôi cam kết 100% không thu thập dữ liệu người dùng. Đoạn code này mục đích chỉ lấy thông tin điểm của người dùng ở phía frontend và không can thiệp vào hệ thống của trường. </i>

```javascript
function decodeHtmlEntities(text) {
    const entities = [
        ['amp', '&'],
        ['apos', "'"],
        ['lt', '<'],
        ['gt', '>'],
        ['quot', '"'],
    ];
    for (let i = 0; i < entities.length; i++) {
        text = text.replace(new RegExp(`&${entities[i][0]};`, 'g'), entities[i][1]);
    }
    return text;
}
let table = document.getElementsByTagName('table');
let tableScore = table[1];
let elementScores = tableScore.getElementsByClassName('pointer');
let scoreAll = [];
for (let tr of elementScores) {
    let score = {};
    let tdList = tr.getElementsByTagName('td');

    score.id = tdList[0] ? tdList[0].innerHTML : '';
    if (score.id !== '') {
        score.id = parseInt(score.id);
    }
    // Remove unnecessary span tag in the "name" field
    let nameField = tdList[1] ? tdList[1].innerHTML : '';
    score.name = nameField.replace(/<[^>]+>/g, '').trim();
    // xoá tất cả các ký tự đặc biệt
    score.name = decodeHtmlEntities(nameField.replace(/<[^>]+>/g, '').replace('!!', '')).trim();

    if (score.name === '') {
        continue;
    }
    score.countTC = tdList[2] ? tdList[2].innerHTML : '';
    if (score.countTC !== '') {
        score.countTC = parseInt(score.countTC);
    }
    score.countLH = tdList[3] ? tdList[3].innerHTML : '';
    if (score.countLH !== '') {
        score.countLH = parseInt(score.countLH);
    }
    score.scoreCC = tdList[4] ? tdList[4].innerHTML.trim() : '';
    if (score.scoreCC !== '') {
        score.scoreCC = parseFloat(score.scoreCC);
    }
    score.scoreBT = tdList[5] ? tdList[5].innerHTML : '';
    if (score.scoreBT !== '') {
        score.scoreBT = parseFloat(score.scoreBT);
    }
    score.scoreGK = tdList[6] ? tdList[6].innerHTML : '';
    if (score.scoreGK !== '') {
        score.scoreGK = parseFloat(score.scoreGK);
    }
    score.scoreCK = tdList[7] ? tdList[7].innerHTML : '';
    if (score.scoreCK !== '') {
        score.scoreCK = parseFloat(score.scoreCK);
    }
    // Extract values from <b> tags in scoreT10 and scoreCh fields
    let scoreT10Field = tdList[8] ? tdList[8].innerHTML : '';
    let scoreT10Match = scoreT10Field.match(/<b>(.*?)<\/b>/);
    score.scoreT10 = scoreT10Match ? scoreT10Match[1] : '';
    if (score.scoreT10 !== '') {
        score.scoreT10 = parseFloat(score.scoreT10);
    }
    let scoreChField = tdList[9] ? tdList[9].innerHTML : '';
    let scoreChMatch = scoreChField.match(/<b[^>]*>(.*?)<\/b>/);
    score.scoreCh = scoreChMatch ? scoreChMatch[1] : '';
    scoreAll.push(score);
}
let duplicate = {};
scoreAll.forEach((score) => {
    if (!duplicate[score.name]) {
        duplicate[score.name] = score;
    } else {
        if (score.scoreT10 > duplicate[score.name].scoreT10) {
            duplicate[score.name] = score;
        }
    }
});
scoreAll = Object.values(duplicate);
let dataDownload = {
    scoreAll,
};
let json = JSON.stringify(dataDownload);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'diem.json';
link.click();
URL.revokeObjectURL(url);
link.remove();
```
<img src="https://i.ibb.co/j9tcg4b/image.png" alt="image" border="0">

Sau khi thực hiện xong, file điểm sẽ được tải xuống máy tính của bạn với tên là `diem.json`
### Bước 5: Tải dữ liệu điểm lên hệ thống

Trở lại trang chủ của [VKU SCORE](https://nam077.github.io/vku-score-v2)      
Bấm vào nút `Chọn file` và chọn file `diem.json` vừa tải xuống ở bước trên hoăc kéo thả file `diem.json` vào ô chọn file

<img src="https://i.ibb.co/3mYVvnn/image.png" alt="image" border="0">

Sau khi xong dữ liệu điểm sẽ được hiển thị trên trang web.

<img src="https://i.ibb.co/m9f2XQB/image.png" alt="image" border="0">

# Cách sử dụng VKU SCORE

## Xem điểm sau khi cải thiện

Ở giao diện chính của [VKU SCORE](https://nam077.github.io/vku-score-v2), bạn có thể xem điểm sau khi cải thiện bằng cách
đổi các điểm ở mỗi hàng ở cột `Thay đổi` 

<img src="https://i.ibb.co/YBPvycv/image.png" alt="image" border="0">

Sau khi thay đổi giá trị thì hệ thống sẽ tự động tính toán điểm của bạn và hiển thị `GPA Mới`

<img src="https://i.ibb.co/4p5L0y8/image.png" alt="image" border="0">       

## Gợi ý đánh giá học phần

Ở giao diện chính của [VKU SCORE](https://nam077.github.io/vku-score-v2) bạn có thể xem gợi ý đánh giá học phần bằng cách nhấn vào nút `Gợi ý cải thiện học phần` 
ở góc dưới bên phải của trang web.
 
<img src="https://i.ibb.co/qkr8nXD/image.png" alt="image" border="0">

Công cụ này sẽ dựa trên dữ liệu điểm của bạn sau đó tự động tính toán các thế mạnh của bạn và đưa ra gợi ý đánh giá học phần. 

Sau khi đã tính toán xong một `Popup` sẽ hiện ra. Với một bảng là dữ liệu các học phần gợi ý cải thiện. Được hiển thị theo độ ưu tiên từ trên xuống dưới.

<img src="https://i.ibb.co/0tgFhf2/image.png" alt="image" border="0">

Bạn cũng có thể thay đổi các giá trị điểm của các học phần ở cột `Thay đổi` để xem điểm của bạn sẽ thay đổi như thế nào khi bạn cải thiện điểm của các học phần đó.

<img src="https://i.ibb.co/GJVzFNd/image.png" alt="image" border="0">

# Tiện ích bổ sung cho VKU SCORE

## Hướng dẫn sử dụng

Truy cập vào <a href=https://daotao.vku.udn.vn/sv>https://daotao.vku.udn.vn/sv/</a>

Sau đó tiến hành đăng nhập tài khoản vào

Truy cập vào <a href="https://daotao.vku.udn.vn/sv/diem">https://daotao.vku.udn.vn/sv/diem</a>

Ở tab hiện tại đang truy cập đến `https://daotao.vku.udn.vn/sv/diem` Ấn `F12` hoặc chuột phải vào trang rồi click vào `Inspect Element` để vào Development tool của trình duyệt.

### Đánh giá lớp học phần
Mở file <a href=https://github.com/Nam077/VKU_ToolAuto_Danh_Gia_Hoc_Phan/blob/master/toolDanhGiaLopHocPhan.js>`toolDanhGiaLopHocPhan.js`</a> sau đó copy nội dung. Quay trở lại trình duyệt ở DevTool bấm vào mục Console sau đó dán nội dụng vào. Tiến hành nhấn nút `Enter` để tool tiến hành quét các học phần, sau đó  sẽ tự động đánh giá các học phần chưa đánh giá.

### Đánh giá sự cần thiết của học phần
Mở file <a href=https://github.com/Nam077/VKU_ToolAuto_Danh_Gia_Hoc_Phan/blob/master/toolDanhGiaSuCanThiet.js>`toolDanhGiaSuCanThiet.js`</a>sau đó copy nội dung. Quay trở lại trình duyệt ở DevTool bấm vào mục Console sau đó dán nội dụng vào. Tiến hành nhấn nút `Enter` để tool tiến hành quét các học phần, sau đó  sẽ tự động đánh giá các học phần chưa đánh giá.

 => Lưu ý mọi người không được spam quá nhiều lần tránh việc web trường quá tải, xin cảm ơn



                                