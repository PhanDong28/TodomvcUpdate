const input = document.getElementById('input')
const list = document.getElementById('list')
const title = document.getElementById('title')
const checkboxlist = document.getElementById('checkbox')
const remove = document.getElementById('close')

input.addEventListener('keyup',(event) => {                     //tao 1 sự kiện nhập từ bàn phím 1 phím
    if (event.key === 'Enter' || event.keycode ===13) {         //gán event key của sự kiện bằng phím Enter hoặc keycode là 13
        const inputList = document.createElement('li');         // tạo một phần tử HTML mới với tên là li
        const newTodo = document.createTextNode(input.value);   // tạo một văn bản với nội dung được chỉ định, nội dung được lấy theo giá trị của phần từ input
        const checkbox = document.createElement('span');
        checkbox.classList.add('bx', 'bx-square', 'cursor-pointer');
        checkbox.addEventListener('click', () => {              //tạo 1 sự kiện để  người đung click vào đối tượng checkbox
            if (checkbox.classList.contains('bx-square')) {     //kiểm tra xem checkbox đã có lớp bx-square hay chưa. Nếu có, nghĩa là checkbox đang ở trạng thái chưa được chọn.
                checkbox.classList.replace('bx-square', 'bx-check-square'); //nếu có lớp bx-square sử dụng replace để thay thế lớp đó thành bx-check-square
            } else {
                checkbox.classList.replace('bx-check-square', 'bx-square'); //nếu không có lớp bx-square (nghĩa là nó đã có lớp bx-check-square, tức là đã được chọn) sử dụng phương thức replace() để đổi lớp bx-check-square thành bx-square.               
            }
        });
        const removeBtn = document.createElement('span');                                  //tạo một el span mới 
        removeBtn.classList.add('bx', 'bx-x', 'bx-md', 'cursor-pointer', 'float-right','hover:visible');   // add để thêm vào phần tử span vừa tạo 1 lớp css
        removeBtn.addEventListener('click', () => {                                        // Thêm một sự kiện click khi bấm vào thẻ
            inputList.remove();                                                            // khi bấm vào sẽ sử dụng phương thức remove của đối tượng input list để xóa phần từ li
        });
        inputList.appendChild(checkbox);            //thêm phần từ checkbox vào phần tử li
        inputList.appendChild(newTodo);             //thêm đoạn văn tạo ra từ chuỗi văn bản nhập vào vào phần từ li 
        inputList.appendChild(removeBtn);           //Thêm thẻ span tạo ra vào phần tử li
        inputList.classList.add('li', 'border-b-[2px]', 'border-solid', 'px-[60px]', 'py-[16px]', 'bor-border', 'float');    //thêm cho phần tử li một số lớp css
        list.append(inputList);   //thêm phân tử li vừa tạo vào ds
        input.value = '';         //xóa nội dung được nhập vào sau khi người dùng thêm 1 ds mới 
    }
})
