const orders = {};

let nextId = 1;
let selectedId = null;
let editingId = null;

const addButton = document.getElementById('add-item');
const editButton = document.getElementById('edit-item');
const removeButton = document.getElementById('remove-item');

const modal = document.getElementById('form');
const orderForm = document.getElementById('order-form');
const formTitle = document.getElementById('form-title');
const formDescription = document.getElementById('form-description');
const submitButton = document.getElementById('submit-button');
const formError = document.getElementById('form-error');

const tableBody = document.getElementById('table-body');
const emptyState = document.getElementById('empty-state');
const recordCount = document.getElementById('record-count');
const selectedCount = document.getElementById('selected-count');

const nameInput = document.getElementById('order-name');
const identityInput = document.getElementById('order-identity');
const plateInput = document.getElementById('order-plate');
const typeInput = document.getElementById('order-type');
const kmInput = document.getElementById('order-km');

function renderTable() {
	let html = '';
	let count = 0;

	for (let id in orders) {
		const order = orders[id];

		let rowClass = '';
		if (order.id === selectedId) rowClass = 'selected';

		html += `
			<tr class="${rowClass}" onclick="selectOrder(${order.id})">
				<td>${order.name}</td>
				<td>${order.identityNumber}</td>
				<td><span class="plate">${order.plate}</span></td>
				<td>${order.carType}</td>
				<td>${order.kilometers} km</td>
			</tr>
		`;

		count++;
	}

	tableBody.innerHTML = html;
	recordCount.textContent = count;

	if (count === 0) emptyState.classList.remove('hidden');
	else emptyState.classList.add('hidden');

	if (selectedId === null) {
		selectedCount.textContent = '0 / 1';
		editButton.disabled = true;
		removeButton.disabled = true;
	} else {
		selectedCount.textContent = '1 / 1';
		editButton.disabled = false;
		removeButton.disabled = false;
	}
}

function selectOrder(id) {
	if (selectedId === id) selectedId = null;
	else selectedId = id;

	renderTable();
}

function openForm(order) {
	orderForm.reset();
	formError.textContent = '';

	if (order) {
		editingId = order.id;

		formTitle.textContent = 'Megrendelés módosítása';
		formDescription.textContent = 'Módosítsd az adatokat, majd mentsd el a változásokat.';
		submitButton.textContent = 'Változások mentése';

		nameInput.value = order.name;
		identityInput.value = order.identityNumber;
		plateInput.value = order.plate;
		typeInput.value = order.carType;
		kmInput.value = order.kilometers;
	} else {
		editingId = null;

		formTitle.textContent = 'Új megrendelés';
		formDescription.textContent = 'Add meg a megrendelő és a bérelt autó adatait.';
		submitButton.textContent = 'Megrendelés mentése';
	}

	modal.classList.add('open');
	nameInput.focus();
}

function closeForm() {
	modal.classList.remove('open');
	editingId = null;
}

function validate(data) {
	if (data.name === '' || data.identityNumber === '' || data.plate === '' || data.carType === '') {
		return 'Kérlek, tölts ki minden mezőt!';
	}

	if (!Number.isInteger(data.kilometers) || data.kilometers < 0) {
		return 'Adj meg egy érvényes kilométeróra-állást!';
	}

	for (let id in orders) {
		if (orders[id].identityNumber === data.identityNumber && orders[id].id !== editingId) {
			return 'Ezzel a személyigazolvány-számmal már létezik rekord!';
		}
	}

	return '';
}

orderForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const data = {
		name: nameInput.value.trim(),
		identityNumber: identityInput.value.trim().toUpperCase(),
		plate: plateInput.value.trim().toUpperCase(),
		carType: typeInput.value.trim(),
		kilometers: kmInput.valueAsNumber
	};

	const error = validate(data);

	if (error !== '') {
		formError.textContent = error;
		return;
	}

	if (editingId !== null) {
		data.id = editingId;
		orders[editingId] = data;
		selectedId = editingId;
	} else {
		data.id = nextId;
		orders[nextId] = data;
		selectedId = nextId;

		nextId++;
	}

	closeForm();
	renderTable();
});

addButton.addEventListener('click', () => {
	openForm(null);
});

editButton.addEventListener('click', () => {
	if (selectedId !== null) {
		openForm(orders[selectedId]);
	}
});

removeButton.addEventListener('click', () => {
	if (selectedId === null) {
		return;
	}

	const order = orders[selectedId];
	const confirmed = confirm('Biztosan törlöd ezt a megrendelést?\n\nMegrendelő: ' + order.name + '\nAutó: ' + order.carType + '\nRendszám: ' + order.plate);

	if (confirmed) {
		delete orders[selectedId];
		selectedId = null;
		renderTable();
	}
});

document.getElementById('close-form').addEventListener('click', closeForm);
document.getElementById('cancel-form').addEventListener('click', closeForm);

renderTable();
