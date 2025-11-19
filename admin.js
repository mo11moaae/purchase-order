let brands = JSON.parse(localStorage.getItem('brands')) || [];
let items = JSON.parse(localStorage.getItem('items')) || [];

function addBrand() {
  const name = document.getElementById('newBrand').value.trim();
  if (!name) return alert('Nama brand harus diisi!');
  if (!brands.includes(name)) {
    brands.push(name);
    localStorage.setItem('brands', JSON.stringify(brands));
    alert('Brand berhasil ditambahkan');
  }
}

function addItem() {
  const brand = document.getElementById('itemBrand').value.trim();
  const name = document.getElementById('itemName').value.trim();
  const code = document.getElementById('itemCode').value.trim();
  if (!brand || !name) return alert('Brand dan nama item harus diisi!');

  const item = { brand, name, code };
  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
  alert('Item berhasil ditambahkan');
}

function displayData() {
  const div = document.getElementById('dataDisplay');
  let html = '<h4>Daftar Brands:</h4><ul>';
  brands.forEach(b => html += `<li>${b}</li>`);
  html += '</ul><h4>Daftar Items:</h4><ul>';
  items.forEach(i => html += `<li>${i.brand} - ${i.name} (${i.code || 'no code'})</li>`);
  html += '</ul>';
  div.innerHTML = html;
}

displayData();