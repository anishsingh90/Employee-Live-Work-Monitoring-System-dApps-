// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskAssignment {
    // Structure to define a Task
    struct Task {
        uint256 id;
        string description;
        address assignedTo;
        uint256 deadline;
        bool isCompleted;
        uint256[] activityLog; // Array to store activity IDs
    }

    // Structure to define an Activity
    struct Activity {
        uint256 taskId;
        uint256 timestamp;
        string activityType;
    }

    // Mapping to store tasks by their ID
    mapping(uint256 => Task) public tasks;

    // Mapping to store activities by their ID
    mapping(uint256 => Activity) public activities;

    // Counters for task and activity IDs
    uint256 private taskIdCounter;
    uint256 private activityIdCounter;

    // Event emitted when a new task is created
    event TaskCreated(
        uint256 taskId,
        string description,
        address assignedTo,
        uint256 deadline
    );

    // Event emitted when a task is completed
    event TaskCompleted(uint256 taskId);

    // Event emitted when an activity is logged
    event ActivityLogged(
        uint256 activityId,
        uint256 taskId,
        string activityType,
        uint256 timestamp
    );

    // Function to create a new task
    function createTask(
        string memory _description,
        address _assignedTo,
        uint256 _deadline
    ) public {
        taskIdCounter++;
        tasks[taskIdCounter] = Task({
            id: taskIdCounter,
            description: _description,
            assignedTo: _assignedTo,
            deadline: _deadline,
            isCompleted: false,
            activityLog: new uint256[](0) // Initialize as an empty array
        });

        emit TaskCreated(taskIdCounter, _description, _assignedTo, _deadline);
    }

    // Function to complete a task
    function completeTask(uint256 _taskId) public {
        require(
            tasks[_taskId].assignedTo == msg.sender,
            "Only the assigned employee can complete this task"
        );
        tasks[_taskId].isCompleted = true;

        emit TaskCompleted(_taskId);
    }

    // Function to log an activity
    function logActivity(uint256 _taskId, string memory _activityType) public {
        require(
            tasks[_taskId].assignedTo == msg.sender,
            "Only the assigned employee can log activities for this task"
        );

        activityIdCounter++;
        activities[activityIdCounter] = Activity({
            taskId: _taskId,
            timestamp: block.timestamp,
            activityType: _activityType
        });

        tasks[_taskId].activityLog.push(activityIdCounter);

        emit ActivityLogged(
            activityIdCounter,
            _taskId,
            _activityType,
            block.timestamp
        );
    }

    // Function to get task details
    function getTaskDetails(uint256 _taskId) public view returns (Task memory) {
        return tasks[_taskId];
    }

    // Function to get activity details
    function getActivityDetails(
        uint256 _activityId
    ) public view returns (Activity memory) {
        return activities[_activityId];
    }
}
