var tasksToDoEl = document.querySelector("#tasks-to-do")
var formEl = document.querySelector("#task-form")

var taskFormHandler = function () {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value

    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }

    createTaskEl(taskDataObj)
}

var createTaskEl = function (taskDataObj) {
    var listItemEL = document.createElement("li")
    listItemEL.className = "task-item"

    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info"
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"

    listItemEL.appendChild(taskInfoEl)

    tasksToDoEl.appendChild(listItemEL)
}

formEl.addEventListener("submit", taskFormHandler)