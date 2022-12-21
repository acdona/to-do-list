const formAddTodo = document.querySelector('.form-add-todo')
const todosContainer = document.querySelector('.todos-container')
const inputSearch = document.querySelector('.form-search input')

const message = document.createElement('div')
formAddTodo.prepend(message)
message.classList.add("alert", "alert-danger", "message")
message.setAttribute("role", "alert")

const addTodo = inputValue => {
	const arrayLIs = Array.from(todosContainer.children)
		.map(li => li.textContent.trim())
	if (inputValue.length && arrayLIs.includes(inputValue)) {
		message.style.display = "block"
		message.innerHTML = `<span>O to-do "${inputValue}" já existe na lista</span>`
		setTimeout('message.style.display = "none"', 2000)
		return
	}
	todosContainer.innerHTML += `
	<li class="list-group-item d-flex justify-content-between align-items-center" data-todo="${inputValue}">
		<span>${inputValue}</span>
		<div align-items-right>
			<i class="far fa-edit" data-edit="${inputValue}"></i>
			<i class="far fa-trash-alt" data-trash="${inputValue}"></i>
		</div>
	</li>
	`
}

formAddTodo.addEventListener('submit', event => {
	event.preventDefault()
	const inputValue = event.target.add.value.trim()
	addTodo(inputValue)
	event.target.reset()
})

const todoEdit = clickedElement => {
	const editDataValue = clickedElement.dataset.edit
	const todo = document.querySelector(`[data-todo="${editDataValue}"]`)
	if (editDataValue) {
		console.log(`editar: ${editDataValue}`)
	}
}

const todoRemove = clickedElement => {
	const trashDataValue = clickedElement.dataset.trash
	const todo = document.querySelector(`[data-todo="${trashDataValue}"]`)
	if (trashDataValue) {
		todo.remove()
	}
}

todosContainer.addEventListener('click', event => {
	const clickedElement = event.target
	todoRemove(clickedElement)
})

const filterTodos = (todos, inputValue, returnMatchedTodos) => todos
	.filter(todo => {
		const matchedTodos = todo.textContent.toLowerCase().includes(inputValue)
		return returnMatchedTodos ? matchedTodos : !matchedTodos
	})

const manipulateClasses = (todos, classToAdd, classToRemove) => {
	todos.forEach(todo => {
		todo.classList.remove(classToRemove)
		todo.classList.add(classToAdd)
	})
}

const hideTodos = (todos, inputValue) => {
	const todosToHide = filterTodos(todos, inputValue, false)
	manipulateClasses(todosToHide, 'hidden', 'd-flex')
}

const showTodos = (todos, inputValue) => {
	const todosToShow = filterTodos(todos, inputValue, true)
	manipulateClasses(todosToShow, 'd-flex', 'hidden')
}

inputSearch.addEventListener('input', event => {
	const inputValue = event.target.value.trim().toLowerCase()
	const todos = Array.from(todosContainer.children)
	hideTodos(todos, inputValue)
	showTodos(todos, inputValue)
})
