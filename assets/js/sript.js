var taskIdCounter = 0

var tasksToDoEl = document.querySelector("#tasks-to-do")
var formEl = document.querySelector("#task-form")
var pageContentEL = document.querySelector("#page-content")
var taskInProgressEl = document.querySelector("#tasks-in-progress")
var taskCompletedEl = document.querySelector("#tasks-completed")

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.querySelector("h3.task-name").textContent = taskName
    taskSelected.querySelector("span.task-type").textContent = taskType

    alert("Task Updated!")
    formEl.removeAttribute("data.task.id")
    document.querySelector("#save-task").textContent = "Add Task"
}

var taskFormHandler = function () {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value

    var isEdit = formEl.hasAttribute("data-task-id")

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id")
        completeEditTask(taskNameInput, taskTypeInput, taskId)
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        }

        createTaskEl(taskDataObj)
    }

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!")
        return false
    }

    formEl.reset()
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

var taskButtonHandler = function(event) {
    console.log(event.target)
    var targetEl = event.target

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id")
        editTask(taskId)
    }

    if (event.target.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id")
        deleteTask(taskId)
    }
}

var editTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    var taskName = taskSelected.querySelector("h3.task-name").textContent
    console.log(taskName)
    var taskType = taskSelected.querySelector("span.task-type").textContent
    console.log(taskType)
    document.querySelector("#save-task").textContent = "Save Task"
    formEl.setAttribute("data-task-id", taskId)
}

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove()
}

var taskStatusChangeHandler = function (event) {
    var taskId = event.target.getAttribute("data-task-id")
    var statusValue = event.target.value.toLowerCase()
    var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']")

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected)
    }
    else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected)
    }
    else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected)
    }
}

pageContentEL.addEventListener("click", taskButtonHandler)

formEl.addEventListener("submit", taskFormHandler)

pageContentEL.addEventListener("change", taskStatusChangeHandler)