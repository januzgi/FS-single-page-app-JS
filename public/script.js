window.onload = () => {
  createForm();
}; // yleisesti käytössä oleva eventti

// nuolifunktio tekee ns invocation patternin eli
// this osoittaa tähän parenttiin
createForm = () => {
  // this pystyy bindaamaan osoittamaan mihin haluaa
  const anchor = document.getElementById('anchor');
  let centeringDiv = document.createElement('div');

  let shoppingForm = document.createElement('form');
  centeringDiv.setAttribute('class', 'col-xs-1');
  centeringDiv.setAttribute('align', 'center');

  // item type input
  let typeInput = document.createElement('input');
  typeInput.setAttribute('type', 'text');
  typeInput.setAttribute('value', '');
  typeInput.setAttribute('name', 'typeInput');
  typeInput.setAttribute('id', 'typeInput');
  // innerHTML on todella hidas tapa luoda mitään

  // labeli inputille
  let typeInputLabel = document.createElement('label');
  typeInputLabel.setAttribute('for', 'typeInput');
  let typeInputText = document.createTextNode('Type:');
  typeInputLabel.appendChild(typeInputText);

  // count input
  let countInput = document.createElement('input');
  countInput.setAttribute('type', 'number');
  countInput.setAttribute('value', '');
  countInput.setAttribute('name', 'countInput');
  countInput.setAttribute('id', 'countInput');
  // innerHTML on todella hidas tapa luoda mitään

  // labeli inputille
  let countInputLabel = document.createElement('label');
  countInputLabel.setAttribute('for', 'countInput');
  let countInputText = document.createTextNode('Count:');
  countInputLabel.appendChild(countInputText);

  // item type input
  let priceInput = document.createElement('input');
  priceInput.setAttribute('type', 'number');
  priceInput.setAttribute('value', '');
  priceInput.setAttribute('name', 'priceInput');
  priceInput.setAttribute('id', 'priceInput');
  // innerHTML on todella hidas tapa luoda mitään

  // labeli inputille
  let priceInputLabel = document.createElement('label');
  priceInputLabel.setAttribute('for', 'typeInput3');
  let priceInputText = document.createTextNode('Price:');
  priceInputLabel.appendChild(priceInputText);

  // submit button
  let submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'Add');
  submit.setAttribute('class', 'btn btn-Primary');

  let br = document.createElement('br');

  // laitetaa tavarat domiin
  shoppingForm.appendChild(typeInputLabel);
  shoppingForm.appendChild(typeInput);
  shoppingForm.appendChild(br);

  shoppingForm.appendChild(countInputLabel);
  shoppingForm.appendChild(countInput);
  shoppingForm.appendChild(br.cloneNode());

  shoppingForm.appendChild(priceInputLabel);
  shoppingForm.appendChild(priceInput);
  shoppingForm.appendChild(br.cloneNode());

  shoppingForm.appendChild(submit);
  shoppingForm.addEventListener('submit', (event) => {
    event.preventDefault(); // me halutaan ladata vain dataa, ei applikaatiota uudestaan
    addToList();
  });

  centeringDiv.appendChild(shoppingForm); // formi keskelle
  anchor.appendChild(centeringDiv);
};

// Lisääminen
addToList = () => {
  let type = document.getElementById('typeInput').value;
  let count = document.getElementById('countInput').value;
  let price = document.getElementById('priceInput').value;

  let item = {
    type: type,
    count: count,
    price: price,
  };

  let request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
    // tää pitää stringifyida, muuten lähtee objekti
    // jota ei vastaanotto ymmärrä
  };

  // jokainen kutsu netin yli tekee yhden asian
  // voi tietysti valita, että yhdessä kutsussa tapahtuu useampi asia
  // hyvii puolia esim, että samanaikaiset muutokset näkyvät
  // toisaalta yks nettikutsu enemmän
  fetch('/api/shopping', request)
    .then((response) => {
      if (response.status === 200) {
        console.log('Add to list success!');
      } else {
        console.log('Add to list failed: ', response.status);
      }
    })
    .catch((error) => {
      // 400 ei mee tänne tässä Fetch API kirjastossa
      console.log(error);
    });
};
