pragma solidity ^0.5.0;

contract TodoList {
    struct Task {
        string content;
        bool completed;
    }

    Task[] public tasks;

    function addTask(string memory _content) public {
        tasks.push(Task(_content, false));
    }

    function completeTask(uint _index) public {
        tasks[_index].completed = true;
    }

    function getTask(uint _index) public view returns (string memory, bool) {
        return (tasks[_index].content, tasks[_index].completed);
    }
}