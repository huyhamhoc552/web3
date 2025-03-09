// Kết nối với Ganache
const web3 = new Web3('http://127.0.0.1:7545');

let todoList;

async function loadContract() {
  try {
    const todoListData = await $.getJSON('TodoList.json');
    const contractABI = todoListData.abi;
    const networkId = "5777";
    const contractAddress = todoListData.networks[networkId]?.address;

    if (!contractAddress) {
      console.error(`Contract not deployed on network ${networkId}`);
      return false;
    }

    todoList = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract ABI:", contractABI);
    console.log("Contract Address:", contractAddress);
    return true;
  } catch (error) {
    console.error("Lỗi tải contract:", error);
    return false;
  }
}


async function loadAccounts() {
  try {
    web3.eth.getAccounts().then(acc => {
      accounts = acc;
      console.log("Tài khoản mặc định:", accounts[0]);
      return accounts
  });
  } catch (error) {
    console.error("Lỗi lấy tài khoản:", error);
    return null;
  }
}

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

window.onload = async () => {
  const contractLoaded = await loadContract();
  const accountsLoaded = await loadAccounts();
  if (contractLoaded) {
    await loadTasks();
  }
};