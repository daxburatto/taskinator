var taskIdCounter = 0

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

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!")
        return false
    }

    formEl.reset()

    createTaskEl(taskDataObj)
}

var createTaskEl = function (taskDataObj) {
    var listItemEL = document.createElement("li")
    listItemEL.className = "task-item"

    listItemEL.setAttribute("data-task-id", taskIdCounter)

    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info"
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"
    listItemEL.appendChild(taskInfoEl)

    var taskActionsEl = createTaskActions(taskIdCounter)
    listItemEL.appendChild(taskActionsEl)

    tasksToDoEl.appendChild(listItemEL)

    taskIdCounter++
}

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div")
    actionContainerEl.className = "task-actions"

    var editButtonEl = document.createElement("button")
    editButtonEl.textContent = "Edit"
    editButtonEl.className = "btn edit-btn"
    editButtonEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(editButtonEl)

    var deleteButtonEl = document.createElement("button")
    deleteButtonEl.textContent = "Delete"
    deleteButtonEl.className = "btn delete-btn"
    deleteButtonEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(deleteButtonEl)

    var statusSelectEl = document.createElement("select")
    statusSelectEl.className = "select-status"
    statusSelectEl.setAttribute("name", "status-change")
    statusSelectEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(statusSelectEl)

    var statusChoices = ["To Do", "In Progress", "Completed"]
    for (let i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option")
        statusOptionEl.textContent = statusChoices[i]
        statusOptionEl.setAttribute("value", statusChoices[i])

        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl
}

formEl.addEventListener("submit", taskFormHandler)