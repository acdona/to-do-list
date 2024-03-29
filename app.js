const formAddTodo = document.querySelector('.form-add-todo')
const formSearch = document.querySelector('.form-search')
const todosContainer = document.querySelector('.todos-container')
const inputSearch = document.querySelector('.form-search input')

/* POPUP EDITAR */
const formPopup = document.querySelector('.form-popup')
const inputPopup = document.querySelector('#inputpopup')
const popup = document.querySelector('.popup-wrapper')
const closeButton = document.querySelector('.popup-close')

closeButton.addEventListener('click', () => {
	popup.style.display = 'none'
})

popup.addEventListener('click', event => {
	const classNameOfClickedElement = event.target.classList[0]
	const classNames = ['popup-close', 'popup-wrapper', 'popup-link']
	const shouldClosePopup = classNames.some(className =>
		className === classNameOfClickedElement)
	if (shouldClosePopup) {
		popup.style.display = 'none'
	}
})
/* FIM POPUP EDITAR */

const message = document.createElement('div')
formAddTodo.prepend(message)
message.classList.add("alert", "alert-danger", "message")
message.setAttribute("role", "alert")

const addTodo = inputValue => {
	if (inputValue.length) {

		const arrayLIs = Array.from(todosContainer.children).map(li => li.textContent.trim().toLowerCase())

		if (!arrayLIs.includes(inputValue.toLowerCase())) {
			todosContainer.innerHTML += `
			<li class="list-group-item d-flex justify-content-between align-items-center" data-todo="${inputValue}">
				<span>${inputValue}</span>
				<div align-items-right>
					<i class="far fa-eye" data-show="${inputValue}"></i>
					<i class="far fa-edit" data-edit="${inputValue}"></i>
					<i class="far fa-trash-alt" data-trash="${inputValue}"></i>
				</div>
			</li>
			`
			return false
		}

		message.style.display = "block"
		message.innerHTML = `<span>O to-do "${inputValue}" já existe na lista</span>`
		setTimeout('message.style.display = "none"', 2000)
	}
}

formAddTodo.addEventListener('submit', event => {
	event.preventDefault()
	const inputValue = event.target.add.value.trim()
	addTodo(inputValue)
	event.target.reset()
})

const todoEdit = clickedElement => {
	let editDataValue = clickedElement.dataset.edit
	let todo = document.querySelector(`[data-todo="${editDataValue}"]`)
	
	popup.style.display = 'block'
	inputPopup.value = editDataValue
	
	let newValue = inputPopup.value
	inputPopup.select()	

	const handleSubmit = event => {
		event.preventDefault()
		newValue = inputPopup.value
		if (newValue) {
			todo.dataset.todo = newValue
			todo.textContent = newValue
			todo.innerHTML = `
			<span>${newValue}</span>
			<div align-items-right>
			<i class="far fa-eye" data-show="${newValue}"></i>
			<i class="far fa-edit" data-edit="${newValue}"></i>
			<i class="far fa-trash-alt" data-trash="${newValue}"></i>
			</div>
			`  
			popup.style.display = 'none'
			formPopup.removeEventListener('submit', handleSubmit) // remover evento após submit
			
		}
	}
	
	formPopup.addEventListener('submit', handleSubmit)
}

const todoRemove = clickedElement => {
	const trashDataValue = clickedElement.dataset.trash
	const todo = document.querySelector(`[data-todo="${trashDataValue}"]`)
	if (trashDataValue) {
		todo.remove()
	}
}

// em implantação - construir modal só para mostrar o item
const todoShow = clickedElement => {
	let showDataValue = clickedElement.dataset.show
	let todo = document.querySelector(`[data-todo="${showDataValue}"]`)
	if (showDataValue) {
		popup.style.display = 'block'
		inputPopup.value = showDataValue
		inputPopup.select()
		console.log(todo)
		popup.style.display = 'none'
	}
}

todosContainer.addEventListener('click', event => {
	const clickedElement = event.target
	if (clickedElement.dataset.trash) {
		todoRemove(clickedElement)
	}
	if (clickedElement.dataset.edit) {
		todoEdit(clickedElement)
	}
	if (clickedElement.dataset.show) {
		todoShow(clickedElement)
	}
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

formSearch.addEventListener('submit', event => {
	event.preventDefault()
	return false
})

inputSearch.addEventListener('input', event => {
	const inputValue = event.target.value.trim().toLowerCase()
	const todos = Array.from(todosContainer.children)
	hideTodos(todos, inputValue)
	showTodos(todos, inputValue)
})
