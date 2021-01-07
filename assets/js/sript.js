var taskIdCounter = 0

var tasksToDoEl = document.querySelector("#tasks-to-do")
var formEl = document.querySelector("#task-form")
var pageContentEL = document.querySelector("#page-content")
var taskInProgressEl = document.querySelector("#tasks-in-progress")
var taskCompletedEl = document.querySelector("#tasks-completed")

// array to hold tasks for savedTasks
var tasks = []

var taskFormHandler = function (event) {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value

    // check if inputs are empty
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!")
        return false
    }

    // reset form fields for next to be entered
    document.querySelector("input[name='task-name']").value = ""
    document.querySelector("select[name='task-type']").selectedIndex = 0

    // check if task is new or being edited by checking data-task-id
    var isEdit = formEl.hasAttribute("data-task-id")

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id")
        completeEditTask(taskNameInput, taskTypeInput, taskId)
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        createTaskEl(taskDataObj)
    }
}

var createTaskEl = function (taskDataObj) {
    var listItemEL = document.createElement("li")
    listItemEL.className = "task-item"
    listItemEL.setAttribute("data-task-id", taskIdCounter)
    listItemEL.setAttribute("draggable", "true")
    
    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info"
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"
    listItemEL.appendChild(taskInfoEl)

    var taskActionsEl = createTaskActions(taskIdCounter)
    listItemEL.appendChild(taskActionsEl)

    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0
            tasksToDoEl.appendChild(listItemEL)
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-select']").selectedIndex = 1
            taskInProgressEl.appendChild(listItemEL)
            break
        case "completed":
            taskActionsEl.querySelector("select[name='status-select']").selectedIndex = 2
            taskCompletedEl.appendChild(listItemEL)
            break
        default:
            console.log("Something went wrong!")
    }

    // save task as an object with name, type, status, and id then push it into task array
    taskDataObj.id = taskIdCounter

    tasks.push(taskDataObj)

    // save tasks to localStorage
    saveTasks()

    // increase task counter for next unique task id
    taskIdCounter++
}

var createTaskActions = function (taskId) {
    // create container to hold elements
    var actionContainerEl = document.createElement("div")
    actionContainerEl.className = "task-actions"

    // create edit button
    var editButtonEl = document.createElement("button")
    editButtonEl.textContent = "Edit"
    editButtonEl.className = "btn edit-btn"
    editButtonEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(editButtonEl)

    // create delete button
    var deleteButtonEl = document.createElement("button")
    deleteButtonEl.textContent = "Delete"
    deleteButtonEl.className = "btn delete-btn"
    deleteButtonEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(deleteButtonEl)

    // create change status dropdown
    var statusSelectEl = document.createElement("select")
    statusSelectEl.className = "select-status"
    statusSelectEl.setAttribute("name", "status-change")
    statusSelectEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(statusSelectEl)

    // create status options
    var statusChoices = ["To Do", "In Progress", "Completed"]

    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option")
        statusOptionEl.textContent = statusChoices[i]
        statusOptionEl.setAttribute("value", statusChoices[i])

        // append to select
        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl
}

var completeEditTask = function(taskName, taskType, taskId) {
    // find task list with taskId value
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.querySelector("h3.task-name").textContent = taskName
    taskSelected.querySelector("span.task-type").textContent = taskType

    // set new values
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName
            tasks[i].type = taskType
        }
        
    }

    // save task to localStorage
    saveTasks()

    alert("Task Updated!")

    // remove data attribute from form
    formEl.removeAttribute("data.task.id")
    document.querySelector("#save-task").textContent = "Add Task"
}

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl)
        var taskId = targetEl.getAttribute("data-task-id")
        editTask(taskId)
    }   else if (event.target.matches(".delete-btn")) {
        console.log("delete", targetEl)
        var taskId = targetEl.getAttribute("data-task-id")
        deleteTask(taskId)
    }
}

var editTask = function (taskId) {
    console.log(taskId)
    // get task list element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent
    console.log(taskName)

    var taskType = taskSelected.querySelector("span.task-type").textContent
    console.log(taskType)
    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName
    document.querySelector("select[name='task-type']").value = taskType
    // set data attribute to the form with a value of the task's id
    formEl.setAttribute("data-task-id", taskId)
    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "save task"

}

var deleteTask = function (taskId) {
    console.log(taskId)
    // find task list element with taskId and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove()

    // create new array to hold updated list of tasks
    var updatedTaskArr = []

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match value of taskId, keep task and push to array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i])
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr

    saveTasks()
    alert("Task Deleted!")
}

var taskStatusChangeHandler = function (event) {
    console.log(event.target.value)

    // find task list item based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id")

    var statusValue = event.target.value.toLowerCase()

    // convert value to lower case
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
    // update task's in tasks array then save to localStorage for persistance
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            task[i].status = statusValue
        }
        
    }
    saveTasks()
}

var dragTaskHandler = function (event) {
    if (event.target.matches("li.task-item")) {
        var taskId = event.target.getAttribute("data-task-id")
        event.dataTransfer.setData("text/plain", taskId)
    }
    saveTasks()
}

var dropZoneDragHandler = function (event) {
    var taskListEl = event.target.closest(".task-list")
    if (taskListEl) {
        event.preventDefault()
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed")
    }
}

var dropTaskHandler = function (event) {
    event.preventDefault()
    var id = event.dataTransfer.getData("text/plain")
    var draggableElement = document.querySelector("[data-task-id='" + id + "']")
    var dropZoneEl = event.target.closest(".task-list")
    console.log(dropZoneEl)
    // set status of task based on drop zone id
    var statusType = dropZoneEl.id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']")

    // create variable to hold status
    var newStatus

    switch (statusType) {
        case "tasks-to-do":
            statusSelectEl.selectedIndex = 0
            break;
        case "tasks-in-progress":
            statusSelectEl.selectedIndex = 1
            break
        case "tasks-in-progress":
            statusSelectEl.selectedIndex = 2
            break
        default:
            console.log("Something went wrong!")
    }

    // loop through tasks array to find and update the updated task's status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase()
        }
    }

    // saveTasks
    saveTasks()

    dropZoneEl.removeAttribute("style")
    dropZoneEl.appendChild(draggableElement)

}

var dragLeaveHandler = function (event) {
    var taskListEl = event.target.closest(".task-list")
    if (taskListEl) {
        taskListEl.removeAttribute("style")
    }
}

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    console.log("tasks saved")
}

var loadTasks = function () {
    var savedTasks = localStorage.getItem("tasks")
    console.log(savedTasks)
    if (!savedTasks) {
        return false
    }
    console.log("Saved tasks found!")

    savedTasks = JSON.parse(savedTasks)

    console.log(tasks)

    for (let i = 0; i < savedTasks.length; i++) {
        console.log(savedTasks[i])
        createTaskEl(savedTasks[taskIdCounter])
        var listItemEL = document.createElement("li")
        listItemEL.className = "task-item"
        listItemEL.setAttribute("data-task-id", savedTasks[i].id)
        listItemEL.setAttribute("draggable", "true")
        console.log(listItemEL)

        var taskInfoEl = document.createElement("div")
        taskInfoEl.className = "task-info"
        taskInfoEl.innerHTML = "<h3 class= 'task-name'>" + savedTasks[i].name + "</h3><span class= 'task-type'>" + savedTasks[i].type + "</span>"
        taskInfoEl.appendChild(listItemEL)
        //create task variable called tasksActionsEl with a value of createTaskActions() with tasks[i].id as argument
        var taskActionsEl = createTaskActions(savedTasks[i].id)
        //append taskActionsEl to listItemEL
        taskActionsEl.appendChild(listItemEL)
        //use console.log(listItemEl)
        
        //use if to check if tasks[i].status is equal to to do
        switch (!savedTasks[i].status) {
            case "to do":
                //if yes use listItemEl.querySelector("select[name='status-change']").selectedIndex and set to = 0
                //append listItemEL to tasksToDoEl
                listItemEL.querySelector("select[name='status-change']").selectedIndex = 0
                listItemEL.appendChild(tasksToDoEl) 
                break;
            case "in progress":
                //if yes use listItemEl.querySelector("select[name='status-change'").selectedIndex
                //append listItemEl to taskInProgressEl
                listItemEL.querySelector("select[name='status-change']").selectedIndex = 1
                listItemEL.appendChild(taskInProgressEl)
                break
            case "completed":
                // if yes use listItemEl.querySelector("select[name='status-change'").selectedIndex and set it equal to 2
                //append listItemEL to tasksCompletedEl
                listItemEL.querySelector("select[name='status-change']").selectedIndex = 2
                listItemEL.appendChild(taskCompletedEl)
                break
            default:
                break
        }
        // Increase taskIdCounter by 1
        taskIdCounter++
        // add console.log(listItemEl)
        console.log(listItemEL)
    }
}

pageContentEL.addEventListener("click", taskButtonHandler)

formEl.addEventListener("submit", taskFormHandler)

pageContentEL.addEventListener("change", taskStatusChangeHandler)

pageContentEL.addEventListener("dragstart", dragTaskHandler)

pageContentEL.addEventListener("dragover", dropZoneDragHandler)

pageContentEL.addEventListener("dragleave", dragLeaveHandler)

pageContentEL.addEventListener("drop", dropTaskHandler)

loadTasks()








(function(){
    // Functions
    function buildQuiz(){
      // variable to store the HTML output
      const output = [];
  
      // for each question...
      myQuestions.forEach(
        (currentQuestion, questionNumber) => {
  
          // variable to store the list of possible answers
          const answers = [];
  
          // and for each available answer...
          for(letter in currentQuestion.answers){
  
            // ...add an HTML radio button
            answers.push(
              `<label>
                <input type="radio" name="question${questionNumber}" value="${letter}">
                ${letter} :
                ${currentQuestion.answers[letter]}
              </label>`
            );
          }
  
          // add this question and its answers to the output
          output.push(
            `<div class="slide">
              <div class="question"> ${currentQuestion.question} </div>
              <div class="answers"> ${answers.join("")} </div>
            </div>`
          );
        }
      );
  
      // finally combine our output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join('');
    }
  
    function showResults(){
  
      // gather answer containers from our quiz
      const answerContainers = quizContainer.querySelectorAll('.answers');
  
      // keep track of user's answers
      let numCorrect = 0;
  
      // for each question...
      myQuestions.forEach( (currentQuestion, questionNumber) => {
  
        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
  
        // if answer is correct
        if(userAnswer === currentQuestion.correctAnswer){
          // add to the number of correct answers
          numCorrect++;
  
          // color the answers green
          answerContainers[questionNumber].style.color = 'lightgreen';
        }
        // if answer is wrong or blank
        else{
          // color the answers red
          answerContainers[questionNumber].style.color = 'red';
        }
      });
  
      // show number of correct answers out of total
      resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
    }
  
    function showSlide(n) {
      slides[currentSlide].classList.remove('active-slide');
      slides[n].classList.add('active-slide');
      currentSlide = n;
      if(currentSlide === 0){
        previousButton.style.display = 'none';
      }
      else{
        previousButton.style.display = 'inline-block';
      }
      if(currentSlide === slides.length-1){
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
      }
      else{
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
      }
    }
  
    function showNextSlide() {
      showSlide(currentSlide + 1);
    }
  
    function showPreviousSlide() {
      showSlide(currentSlide - 1);
    }
  
    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const myQuestions = [
      {
        question: "Who invented JavaScript?",
        answers: {
          a: "Douglas Crockford",
          b: "Sheryl Sandberg",
          c: "Brendan Eich"
        },
        correctAnswer: "c"
      },
      {
        question: "Which one of these is a JavaScript package manager?",
        answers: {
          a: "Node.js",
          b: "TypeScript",
          c: "npm"
        },
        correctAnswer: "c"
      },
      {
        question: "Which tool can you use to ensure code quality?",
        answers: {
          a: "Angular",
          b: "jQuery",
          c: "RequireJS",
          d: "ESLint"
        },
        correctAnswer: "d"
      }
    ];
  
    // Kick things off
    buildQuiz();
  
    // Pagination
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
  
    // Show the first slide
    showSlide(currentSlide);
  
    // Event listeners
    submitButton.addEventListener('click', showResults);
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
  })();