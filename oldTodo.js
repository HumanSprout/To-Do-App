"use strict";

var app = (function () {
    var todoCounter,
        todos,
        inputText = document.getElementById("inputText");
    if (localStorage.getItem("localCounter") != undefined) { 
        todoCounter = Number(localStorage.getItem("localCounter"))
        todos = JSON.parse(localStorage.getItem("localTodos"));
        reorderElements(true);
    } else {
        console.log("no counter found or counter is 0")
        todoCounter = 0,
        todos = {};
    }
    // creates objects
    function createObject(todo_key, itemText) {
        todos[todo_key] = {};
        todos[todo_key].key = todo_key;
        todos[todo_key].priority = 0;
        todos[todo_key].todoText = itemText;
        todos[todo_key].completed = false;
        todos[todo_key].prevPriority = 0;
    }
    // sets priority value from select and assigns css class
    function setPriority(targetKey, todoPriority, reorder) {
        var targetSpan = document.getElementById('spanText_' + targetKey),
            targetLi = document.getElementById('listItem_' + targetKey);
        // changes priority of selected to-do to value from select
        switch (todoPriority) {
        case '-1':
            todos[targetKey].priority = todoPriority;
            targetSpan.className = "span_todo-text-completed";
            targetLi.className = "list-item_default";
            if (reorder === true) {
                reorderElements(false);
            }
            break;
        case '0':
            todos[targetKey].priority = todoPriority;
            targetSpan.className = "span_todo-text-default";
            targetLi.className = "list-item_default";
            if (reorder === true) {
                reorderElements(false);
            }
            break;
        case '1':
            todos[targetKey].priority = todoPriority;
            targetSpan.className = "span_todo-text-p1";
            targetLi.className = "list-item_todo-p1";
            if (reorder === true) {
                reorderElements(false);
            }
            break;
        case '2':
            todos[targetKey].priority = todoPriority;
            targetSpan.className = "span_todo-text-p2";
            targetLi.className = "list-item_todo-p2";
            if (reorder === true) {
                reorderElements(false);
            }
            break;
        case '3':
            todos[targetKey].priority = todoPriority;
            targetSpan.className = "span_todo-text-p3";
            targetLi.className = "list-item_todo-p3";
            if (reorder === true) {
                reorderElements(false);
            }
            break;
        default:
            alert("oops you bwoke it");
        }
        if (todos[targetKey].completed === true) {
            document.getElementById('select_' + targetKey).disabled = true;
        } else {
            document.getElementById('select_' + targetKey).disabled = false;
        }
    }
    // creates the DOM elements and assignes properties
    function createElements(todo_key, reorder) {
        // create elements
        var todoPriority,
            listItem = document.createElement("li"),
            delButton = document.createElement("button"),
            checkbox = document.createElement("input"),
            select = document.createElement("select"),
            selectOpt0 = document.createElement("option"),
            selectOpt1 = document.createElement("option"),
            selectOpt2 = document.createElement("option"),
            selectOpt3 = document.createElement("option"),
            spanText = document.createElement("span");
        // listItem properties
        listItem.dataset.key = todo_key;
        listItem.id = 'listItem_' + todo_key;
        // (priority level) select properties
        select.dataset.key = todo_key;
        select.className = "select";
        select.id = 'select_' + todo_key;
        selectOpt0.value = 0;
        selectOpt0.textContent = 0;
        selectOpt1.textContent = 1;
        selectOpt2.textContent = 2;
        selectOpt3.textContent = 3;
        // (delete) button properties
        delButton.dataset.key = todo_key;
        delButton.className = "button_delete";
        delButton.id = 'delButton_' + todo_key;
        // (completed) checkbox properties
        checkbox.dataset.key = todo_key;
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.id = 'checkbox_' + todo_key;
        // (to do text) span properties
        spanText.dataset.key = todo_key;
        spanText.id = 'spanText_' + todo_key;
        spanText.textContent = todos[todo_key].todoText;
        // append elements
        todoList.appendChild(listItem);
        listItem.appendChild(delButton);
        listItem.appendChild(checkbox);
        listItem.appendChild(select);
        select.appendChild(selectOpt0);
        select.appendChild(selectOpt1);
        select.appendChild(selectOpt2);
        select.appendChild(selectOpt3);
        listItem.appendChild(spanText);
        if (todos[todo_key].completed === true) {
            // checks checkbox is extant object is completed
            document.getElementById('checkbox_' + todo_key).checked = true;
        }
        // invoke setPriority to assign span and listItem classes
        todoPriority = todos[todo_key].priority.toString();
        console.log(reorder);
        setPriority(todo_key, todoPriority, reorder);
    }
    // sets completed property and assigns css class
    function setCompleted(targetKey, checked) {
        var todoPriority;
        if (todos[targetKey].completed === false && checked === true) {
            todos[targetKey].completed = true;
            todos[targetKey].prevPriority = todos[targetKey].priority;
            setPriority(targetKey, "-1", true);
        } else {
            if (todos[targetKey].completed === true && checked === false) {
                todos[targetKey].completed = false;
                todoPriority = todos[targetKey].prevPriority.toString();
                setPriority(targetKey, todoPriority, true);
            }
        }
    }
    // removes to-do objects
    function removeObject(targetKey) {
        delete todos[targetKey];
    }
    // removes DOM elements - pass reorder as true when reordering
    function removeElements(targetKey, reorder) {
        var element = document.getElementById('listItem_' + targetKey);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
            element.remove();
        }
        if (reorder === false) {
            removeObject(targetKey);
        }
    }
    // reorders DOM elements (priority / completed) , pass retrieve as true for localStorage calls
    function reorderElements(retrieve) {
        var i, todoByKey;
        // recreate DOM elements in order of priority (3, 2, 1, 0, -1)
        for (i = 3; i > -2; i--) {
            for (todoByKey in todos) {
                if (todos.hasOwnProperty(todoByKey) && todos[todoByKey].priority == i) {
                    if (retrieve === false) {
                        // remove elements, pass reorder argument as true to retain objects
                        removeElements(todoByKey, true);
                    }
                    // recreate elements, pass reorder argument as false to prevent infinite loop
                    createElements(todoByKey, false);
                    document.getElementById('select_' + todoByKey).value = todos[todoByKey].priority;
                }
            }
        }
    }
    // creates input field to edit to-do text
    function createEditInput (targetKey){
        document.getElementById('spanText_' + targetKey).remove();
        var inputEdit =  document.createElement("input");
        inputEdit.type = "text";
        inputEdit.Id = 'inputEdit_'+targetKey;
        inputEdit.className = "inputEdit";
        inputEdit.dataset.key = targetKey;
        inputEdit.value = todos[targetKey].todoText;
        document.getElementById('listItem_' + targetKey).appendChild(inputEdit);
        inputEdit.focus();
    }
    // removes input field and saves text post edits to object, creates new text span
    function createEditSpan (targetKey, e) {
        todos[targetKey].todoText = e.target.value;
        console.log(e.target.value);
        e.target.remove();
        var spanText = document.createElement("span");
        spanText.dataset.key = targetKey;
        spanText.id = 'spanText_' + targetKey;
        spanText.textContent = todos[targetKey].todoText;
        document.getElementById('listItem_' + targetKey).appendChild(spanText);
        setPriority(targetKey, todos[targetKey].priority, false);
    }
    // function execution triggered by pressing enter on inputText field
    inputText.onkeyup = function (event) {
        var todo_key,
            itemText = inputText.value;
        // if input text value is not undefined or one space, proceed on enter key
        if (undefined === itemText || itemText === "" || itemText === " ") {
            return false;
        }
        if (event.which === 13) {
            todoCounter += 1;
            todo_key = 'todo_' + todoCounter;
            createObject(todo_key, itemText);
            createElements(todo_key, false);
            document.getElementById("inputText").value = "";
        }
    };
    // delete button event listener on click
    document.getElementById("todoList").addEventListener("click", function (e) {
        if (e.target.className === "button_delete") {
            console.log("del button clicked " + e.target.dataset.key);
            removeElements(e.target.dataset.key, false);
        }
    });
    // check box event listener on click
    document.getElementById("todoList").addEventListener("click", function (e) {
        if (e.target.className === "checkbox") {
            console.log("checkbox clicked: " + e.target.dataset.key);
            setCompleted(e.target.dataset.key, e.target.checked);
        }
    });
    // select event listener on change
    document.getElementById("todoList").addEventListener("change", function (e) {
        if (e.target.className === "select") {
            console.log("select clicked: " + e.target.dataset.key);
            setPriority(e.target.dataset.key, e.target.value, true);
        }
    });
    // span event listener on double click
    document.getElementById("todoList").addEventListener("dblclick", function (e) {
        if (e.target.className != "span_todo-text-completed") {
            console.log("spanText clicked: " + e.target.dataset.key);
            createEditInput(e.target.dataset.key);
        }
    });
    // lose focus of input field on key press enter, focusout will bubble
    document.getElementById("todoList").addEventListener("keyup", function (e) {
        if (event.which === 13 && e.target.className === "inputEdit") {
            e.target.blur();
        }
    });
    // create edit span to update todo text
    document.getElementById("todoList").addEventListener("focusout", function (e) {
        if (e.target.className === "inputEdit") {
            createEditSpan(e.target.dataset.key, e);
        }
    });
    // automatigically saves counter val and todos {} to localStorage on window close / refresh
    window.addEventListener("unload", function (e) {
        localStorage.setItem('localTodos', JSON.stringify(todos));
        localStorage.setItem('localCounter', todoCounter);
    });
}());
