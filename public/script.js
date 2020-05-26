window.onload = () => {
  createForm();
  getShoppingList();
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

  let tableAnchor = document.createElement('div');
  tableAnchor.setAttribute('id', 'tableAnchor');
  anchor.appendChild(tableAnchor);
};

populateTable = (data) => {
  let tableAnchor = document.getElementById('tableAnchor');
  let table = document.getElementById('table');
  if (table) {
    tableAnchor.removeChild(table); // poistetaan edelliset
  }

  let newTable = document.createElement('table');
  newTable.setAttribute('id', 'table');
  newTable.setAttribute('class', 'table');

  // header
  let header = document.createElement('tHead');
  let headerRow = document.createElement('tr');

  let typeHeader = document.createElement('th');
  let typeHeaderText = document.createTextNode('Type');
  typeHeader.appendChild(typeHeaderText);

  let countHeader = document.createElement('th');
  let countHeaderText = document.createTextNode('Count');
  countHeader.appendChild(countHeaderText);

  let priceHeader = document.createElement('th');
  let priceHeaderText = document.createTextNode('Price');
  priceHeader.appendChild(priceHeaderText);

  let removeHeader = document.createElement('th');
  let removeHeaderText = document.createTextNode('Buy');
  removeHeader.appendChild(removeHeaderText);

  headerRow.appendChild(typeHeader);
  headerRow.appendChild(countHeader);
  headerRow.appendChild(priceHeader);
  headerRow.appendChild(removeHeader);

  header.appendChild(headerRow);
  newTable.appendChild(header);

  // table body
  let body = document.createElement('tBody');
  // Käydään lista läpi ja joka elementille rivi tableen
  // sitten käydään objekti läpi avainperusteisesti
  for (let i = 0; i < data.length; i++) {
    let tableRow = document.createElement('tr');
    for (key in data[i]) {
      if (key === 'id') continue;
      let column = document.createElement('td');
      let info = document.createTextNode(data[i][key]);
      column.appendChild(info);
      tableRow.appendChild(column);
    }
    // Lisätään "Buy" nappi
    let removeColumn = document.createElement('td');
    let removeButton = document.createElement('button');
    let removeText = document.createTextNode('Buy this');
    removeButton.appendChild(removeText);
    removeButton.setAttribute('name', data[i].id);
    removeButton.setAttribute('class', 'btn btn-success');
    removeButton.addEventListener('click', (event) => {
      removeFromList(event.target.name);
    });
    removeColumn.appendChild(removeButton);
    tableRow.appendChild(removeColumn);

    body.appendChild(tableRow);
  }
  newTable.appendChild(body);
  tableAnchor.appendChild(newTable);
};

// Ostaminen eli poistaminen
removeFromList = (id) => {
  let request = {
    method: 'DELETE',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  };

  fetch('/api/shopping/' + id, request)
    .then((response) => {
      if (response.ok) {
        console.log(id + ' item id delete success!');
        getShoppingList();
      } else {
        console.log('Remove from list failed: ', response.status);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Hakeminen
getShoppingList = () => {
  let request = {
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  };

  fetch('/api/shopping', request)
    .then((response) => {
      if (response.ok) {
        // jos json on useita megoja niin
        // tehdään sen parsetus siksi async jotta ohjelma ei jummaa
        response
          .json()
          .then((data) => {
            populateTable(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
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
        getShoppingList();
      } else {
        console.log('Add to list failed: ', response.status);
      }
    })
    .catch((error) => {
      // 400 ei mee tänne tässä Fetch API kirjastossa
      console.log(error);
    });
};
