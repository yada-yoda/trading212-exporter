// Export investment table from https://live.trading212.com website
//
// The main purpose is to export symbol, quantity and price
//
// In order to use this code you need to make sure you have the followig colunms visible in trading 212 that is the default behaviour
//  - Instrumment
//  - Quantity
//  - Price
//
//  Please make sure "Position Number" column is not selected
//
//  Run this code in your Chrome Browser console to genereate the CSV
//

function getFirstMatchFrom(container, elementClassName) {
  var currentNode,
    ni = container.createNodeIterator(container.documentElement, NodeFilter.SHOW_ELEMENT);

  while (currentNode = ni.nextNode()) {
    var name = currentNode.className;
    if (name && typeof name == "string" && name.indexOf(elementClassName) > -1) {
      return currentNode;
    }
  }
}

function holdingsToCSV() {
  //let table = document.querySelectorAll("[data-dojo-attach-point='tableNode']")[0];
  
  let table = getFirstMatchFrom(document, 'table-body') // It looks for a table with class name equals 'table-body'
  let rows = [...table.childNodes];
  rows.shift(); //remove first element, just headers

  let getSymbol = c => {
    return c.innerText
      //.replace(/[\W|^\n]/, '')
      .trim()
      .split("\n")[0];
  }

  let getRowData = row => {
    let cells = [...row.childNodes];
    cells.pop(); //remove last element, it's just a chevron
    let isData = cells[0].tagName.toUpperCase() == "TD";

    return cells.map((c, i) => {
      // Symbol
      if (isData && i == 0) {
        return getSymbol(c);
      }
      
      // Quantity
      if (isData && i == 2) {
        return parseFloat(c.innerText).toFixed(4)
      }

      // Price
      if (isData && i == 3) {
        return parseFloat(c.innerText).toFixed(2)
      }
      return c.innerText.replace(",", "");
    }).join(", ");
  };

  let data = rows
    .map(getRowData)
    .map(function (x) {
      return x.replace(/\n/g, ',')
    });

  return data.join("\n");
}

// Export CSV to Chrome'ss browser console
console.log(holdingsToCSV());
