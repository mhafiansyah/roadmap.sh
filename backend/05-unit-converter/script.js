const convertList = document.querySelectorAll('.list__converter-unit');
const convertFrom = document.getElementById('convertFrom');
const convertTo = document.getElementById('convertTo');
const convertButton = document.getElementById('converter__button');
const convertResult = document.getElementById('result');
const convertValue = document.getElementById('convertValue');

let currentType = 'length';
const units = {
    length: ['Kilometers', 'Meters', 'Centimeters', 'Millimeters', 'Inches', 'Feet', 'Yards', 'Miles'],
    weight: ['Kilograms', 'Grams', 'Milligrams', 'Ounces', 'Pounds'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};

function populateSelect(selectElement, unitList) {
    selectElement.innerHTML = '';
    unitList.forEach((unit) => {
        const option = document.createElement('option');
        option.value = unit.toLowerCase();
        option.textContent = unit;
        selectElement.append(option);
    });
}

function updateForm(type) {
    populateSelect(convertFrom, units[type]);
    populateSelect(convertTo, units[type]);

    // make the convertTo select default to the 2nd value of array
    if (convertTo.options.length > 1) {
        convertTo.selectedIndex = 1;
    }
}

updateForm(currentType);

convertList.forEach((list) => {
    list.addEventListener('click', (e) => {
        convertList.forEach(item => item.classList.remove('active'));
        list.classList.toggle('active');

		currentType = list.dataset.type;
		updateForm(currentType);
    })
})

convertButton.addEventListener('click', async (e) => {
	e.preventDefault();

	const value = parseFloat(convertValue.value);

	if (!value) {
		convertResult.textContent = 'Please enter a value.';
		return ;
	}

	const payload = {
		value,
		from: convertFrom.value,
		to: convertTo.value,
		category: currentType
	}

	try {
		const results = await fetch('http://localhost:3000/api/convert', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const data = await results.json();
		let resultText;
		if (data.result === undefined) {
			resultText = "Error";
		} else {
			resultText = `${value} ${convertFrom.value} = ${data.result} ${convertTo.value}`;
		}
		
		convertResult.textContent = resultText;
	} catch (error) {
		convertResult.textContent = 'Error Fetching conversion';
		console.error(error);
	}
});