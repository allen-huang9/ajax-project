
var $background = document.querySelector('.background-config');
var $dataView = document.querySelectorAll('div[data-view]');

var $homePageServantRoster = document.querySelector('.servant-roster-button');
var $homePageDmgCalculator = document.querySelector('.np-dmg-button');

var $openNewRosterModalButton = document.querySelector('.new-roster-button');
var $newRosterModalForm = document.querySelector('.new-roster-modal');
var $createNewRosterForm = document.querySelector('.modal-form > form');
var $rosterModalInput = document.querySelector('.roster-name');
var $listDisplay = document.querySelector('.list-display-container');

var $openServantInsertModalButton = document.querySelector('.open-servant-insert-modal-button');
var $servantInsertModal = document.querySelector('.insert-servant-modal');
var $insertServantForm = document.querySelector('.servant-form-modal > form');
var $returnedServantListModal = document.querySelector('.servant-list-modal');

var $listContentDisplayContainer = document.querySelector('.list-content-display-container');
var $returnedServantOptions = document.querySelector('.player-choices > form');
var $toMaterialTableButton = document.querySelector('.material-table-button');

var $menuButton = document.querySelectorAll('.menu-button-icon');
var $rosterListsBackButton = document.querySelector('.roster-lists-back-button');

var currentRoster = null;

$homePageServantRoster.addEventListener('click', function (e) {
  viewSwap('servant-lists');
  appendRosterList();
  $background.className = 'list-bg background-config';
});

$homePageDmgCalculator.addEventListener('click', function (e) {
  viewSwap('calculator');
});

$openNewRosterModalButton.addEventListener('click', function (e) {
  $newRosterModalForm.className = 'new-roster-modal';
});

$toMaterialTableButton.addEventListener('click', function (e) {
  viewSwap('materials-table');
});

var existingRosterList = localStorage.getItem('fgo-rosters');
if (existingRosterList) {
  data = JSON.parse(existingRosterList);
}

window.addEventListener('beforeunload', function (e) {
  var dataJson = JSON.stringify(data);
  localStorage.setItem('fgo-rosters', dataJson);
  // localStorage.clear();
});

$createNewRosterForm.addEventListener('submit', function (e) {

  e.preventDefault();
  var roster = new Roster($rosterModalInput.value);
  data.rosterLists.push(roster);
  $newRosterModalForm.className += ' hide';

  $createNewRosterForm.reset();

  appendRosterList();
});

for (var j = 0; j < $menuButton.length; j++) {
  $menuButton[j].addEventListener('click', returnToHomepage);
}

$rosterListsBackButton.addEventListener('click', returnToHomepage);

function appendRosterList() {
  $listDisplay = document.querySelector('.list-display-container');
  if ($listDisplay.hasChildNodes()) {
    var $childNode = document.querySelector('.list-container');
    $listDisplay.removeChild($childNode);
  }

  buildRosterListView(data.rosterLists);

  var $viewListContentButton = document.querySelectorAll('.view-list-content-button');
  var $deleteListButtons = document.querySelectorAll('.delete-list-button');
  for (var i = 0; i < $deleteListButtons.length; i++) {
    $deleteListButtons[i].addEventListener('click', function (e) {
      data.rosterLists.splice(e.target.parentNode.getAttribute('id'), 1);
      appendRosterList();
    });

    $viewListContentButton[i].addEventListener('click', function (e) {

      viewSwap('servant-list-content');
      currentRoster = data.rosterLists[e.target.parentNode.getAttribute('id')];
      $listContentDisplayContainer = document.querySelector('.list-content-display-container');
      if ($listContentDisplayContainer.hasChildNodes()) {
        var $listContentView = document.querySelector('.display');
        $listContentDisplayContainer.removeChild($listContentView);
      }
      buildListContentView(currentRoster);
    });
  }
}

$openServantInsertModalButton.addEventListener('click', function (e) {
  $servantInsertModal.className = 'insert-servant-modal';
});

var tempServantsArray = null;
$insertServantForm.addEventListener('submit', function (e) {

  e.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.atlasacademy.io/nice/' + $insertServantForm.elements.region.value + '/servant/search/?name=' + $insertServantForm.elements['servant-name'].value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    tempServantsArray = xhr.response;

    $returnedServantOptions = document.querySelector('.player-choices > form');
    if ($returnedServantOptions.hasChildNodes()) {
      var $formChildNode = document.querySelector('returned-servants');
      $returnedServantOptions.removeChild($formChildNode);
    }
    buildServantChoice(xhr.response);

  });
  xhr.send();

  $returnedServantListModal.className = 'servant-list-modal';
  $servantInsertModal.className = 'insert-servant-modal hide';
});

$returnedServantOptions.addEventListener('submit', function (e) {
  e.preventDefault();
  currentRoster.list.push(tempServantsArray[$returnedServantOptions.elements['correct-servant'].value]);

  $listContentDisplayContainer = document.querySelector('.list-content-display-container');
  if ($listContentDisplayContainer.hasChildNodes()) {
    var $listContentView = document.querySelector('.display');
    $listContentDisplayContainer.removeChild($listContentView);
  }
  buildListContentView(currentRoster);

  $returnedServantListModal.className = 'servant-list-modal hide';

});

function Roster(name) {
  this.name = name;
  this.list = [];
}

function buildRosterListView(array) {

  var $containerDiv = document.createElement('div');
  $containerDiv.setAttribute('class', 'list-container');

  for (var i = 0; i < array.length; i++) {

    var $rosterListRow = document.createElement('div');
    $rosterListRow.setAttribute('class', 'roster-list-row');

    var $rowColumn1 = document.createElement('div');
    $rowColumn1.setAttribute('class', 'column-half color-white');

    var $rCol1P = document.createElement('p');
    $rCol1P.setAttribute('class', 'character-list');
    $rCol1P.textContent = array[i].name;

    var $rowColumn2 = document.createElement('div');
    $rowColumn2.setAttribute('class', 'column-half display-flex flex-jf-center flex-ai-center');
    $rowColumn2.setAttribute('id', '' + i);

    var $rowCol2ViewButton = document.createElement('div');
    $rowCol2ViewButton.setAttribute('class', 'view-list-content-button');
    $rowCol2ViewButton.textContent = 'View';

    var $rowCol2DeleteButton = document.createElement('div');
    $rowCol2DeleteButton.setAttribute('class', 'delete-list-button');
    $rowCol2DeleteButton.textContent = 'Delete';

    $rowColumn1.appendChild($rCol1P);

    $rowColumn2.appendChild($rowCol2ViewButton);
    $rowColumn2.appendChild($rowCol2DeleteButton);

    $rosterListRow.appendChild($rowColumn1);
    $rosterListRow.appendChild($rowColumn2);

    $containerDiv.appendChild($rosterListRow);
  }

  $listDisplay.appendChild($containerDiv);
}

function buildServantChoice(array) {

  var $returnedServants = document.createElement('div');
  $returnedServants.setAttribute('class', 'returned-servants');

  for (var i = 0; i < array.length; i++) {

    var $optionStyling = document.createElement('div');
    $optionStyling.setAttribute('class', 'display-flex flex-ai-center image-margin');

    var $servantImage = document.createElement('img');
    $servantImage.setAttribute('src', array[i].extraAssets.faces.ascension['4']);
    $servantImage.setAttribute('class', 'servant-image');

    var $servantLabel = document.createElement('label');
    var $servantLabelTextNode = document.createTextNode(array[i].name);

    var $servantRadioButton = document.createElement('input');
    $servantRadioButton.setAttribute('type', 'radio');
    $servantRadioButton.setAttribute('required', 'required');
    $servantRadioButton.setAttribute('name', 'correct-servant');
    $servantRadioButton.setAttribute('value', i);

    $servantLabel.appendChild($servantRadioButton);
    $servantLabel.appendChild($servantLabelTextNode);

    $optionStyling.appendChild($servantImage);
    $optionStyling.appendChild($servantLabel);

    $returnedServants.appendChild($optionStyling);
    $returnedServantOptions.appendChild($returnedServants);

  }

  var $servantSubmitButtonContainer = document.createElement('div');
  $servantSubmitButtonContainer.setAttribute('class', 'insert-servant-button-container');

  var $servantSubmitButton = document.createElement('input');
  $servantSubmitButton.setAttribute('type', 'submit');
  $servantSubmitButton.setAttribute('class', 'roster-button');
  $servantSubmitButton.setAttribute('value', 'Add');

  $servantSubmitButtonContainer.appendChild($servantSubmitButton);

  $returnedServants.appendChild($servantSubmitButtonContainer);
  $returnedServantOptions.appendChild($returnedServants);
}

function buildListContentView(rosterObject) {
  var $display = document.createElement('div');
  $display.setAttribute('class', 'display list-content-view-config');

  var $listNameStyling = document.createElement('div');
  $listNameStyling.setAttribute('class', 'list-content-row color-white flex-jc-center');

  var $listName = document.createElement('h2');
  $listName.textContent = rosterObject.name;

  $listNameStyling.appendChild($listName);

  $display.appendChild($listNameStyling);

  for (var i = 0; i < rosterObject.list.length; i++) {
    var $servantRow = document.createElement('div');
    $servantRow.setAttribute('class', 'list-content-row image-margin');

    var $servantName = document.createElement('div');
    $servantName.setAttribute('class', 'column-half');

    var $imageContainer = document.createElement('div');
    $imageContainer.setAttribute('class', 'color-white display-flex flex-ai-center pad-left');

    var $servantImage = document.createElement('img');
    $servantImage.setAttribute('src', rosterObject.list[i].extraAssets.faces.ascension['4']);
    $servantImage.setAttribute('class', 'servant-image');

    var $servantNameTextContainer = document.createElement('div');
    $servantNameTextContainer.setAttribute('class', 'servant-name-width');
    var $servantNameText = document.createTextNode(rosterObject.list[i].name);

    var $servantViewDeleteButtons = document.createElement('div');
    $servantViewDeleteButtons.setAttribute('class', 'column-half display-flex flex-ai-center');

    var $servantViewButton = document.createElement('div');
    $servantViewButton.setAttribute('class', 'servant-info-button');
    $servantViewButton.textContent = 'View';

    var $servantDeleteButton = document.createElement('div');
    $servantDeleteButton.setAttribute('class', 'delete-servant-button');
    $servantDeleteButton.textContent = 'Delete';

    $servantViewDeleteButtons.appendChild($servantViewButton);
    $servantViewDeleteButtons.appendChild($servantDeleteButton);

    $imageContainer.appendChild($servantImage);
    $servantNameTextContainer.appendChild($servantNameText);

    $imageContainer.appendChild($servantNameTextContainer);

    $servantName.appendChild($imageContainer);

    $servantRow.appendChild($servantName);
    $servantRow.appendChild($servantViewDeleteButtons);

    $display.appendChild($servantRow);
  }

  $listContentDisplayContainer.appendChild($display);
}

function viewSwap(view) {
  for (var i = 0; i < $dataView.length; i++) {
    if ($dataView[i].getAttribute('data-view') !== view) {
      $dataView[i].className = 'hide';
    } else {
      $dataView[i].className = 'show';
    }
  }
}

function returnToHomepage() {
  viewSwap('homepage');
  $background.className = 'homepage-bg background-config';
}
