// Kết nối với Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Thay bằng ABI của hợp đồng của bạn (lấy từ file build/TodoList.json sau khi migrate)
const contractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "name": "content",
        "type": "string"
      },
      {
        "name": "completed",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8d977672"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "addTask",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x67238562"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "completeTask",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xe1e29558"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getTask",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1d65e77e"
  }
];

// Thay bằng địa chỉ hợp đồng sau khi migrate
const contractAddress = "0x5f60191bd8DB99Ad8a84961EE7783dF86B7e71B2"; // Ví dụ: "0x1234..."
const todoList = new web3.eth.Contract(contractABI, contractAddress);

// Lấy tài khoản từ Ganache (dùng tài khoản đầu tiên)
let accounts;
web3.eth.getAccounts().then(acc => {
    accounts = acc;
    console.log("Tài khoản mặc định:", accounts[0]);
});

// Hiển thị danh sách task
async function loadTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Xóa danh sách cũ

    // Đếm số task bằng cách gọi getTask cho đến khi lỗi
    let taskCount = 0;
    while (true) {
        try {
            const task = await todoList.methods.getTask(taskCount).call();
            const li = document.createElement("li");
            li.innerHTML = `<span class="${task[1] ? 'completed' : ''}">${task[0]}</span>
                            <button onclick="completeTask(${taskCount})">Hoàn thành</button>`;
            taskList.appendChild(li);
            taskCount++;
        } catch (error) {
            break; // Dừng khi không còn task
        }
    }
}

// Thêm task mới
async function addTask() {
    const taskInput = document.getElementById("taskInput").value;
    if (!taskInput) return alert("Vui lòng nhập công việc!");

    try {
        await todoList.methods.addTask(taskInput).send({ from: accounts[0] });
        document.getElementById("taskInput").value = ""; // Xóa input
        loadTasks(); // Cập nhật danh sách
    } catch (error) {
        console.error("Lỗi khi thêm task:", error);
    }
}

// Đánh dấu task hoàn thành
async function completeTask(index) {
    try {
        await todoList.methods.completeTask(index).send({ from: accounts[0] });
        loadTasks(); // Cập nhật danh sách
    } catch (error) {
        console.error("Lỗi khi hoàn thành task:", error);
    }
}

// Tải danh sách task khi trang được mở
window.onload = loadTasks;