let items = [];
let selectedItems = [];

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
  loadItems();
});

function loadItems() {
  // Simulasi data dari GSheet atau JSON
  items = [
    { brand: 'Brand A', name: 'Item A1' },
    { brand: 'Brand A', name: 'Item A2' },
    { brand: 'Brand B', name: 'Item B1' },
    { brand: 'Brand B', name: 'Item B2' }
  ];
  populateBrands();
}

function populateBrands() {
  const brands = [...new Set(items.map(item => item.brand))];
  const select = document.getElementById('brandSelect');
  brands.forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    select.appendChild(opt);
  });
}

document.getElementById('brandSelect').addEventListener('change', function () {
  const brand = this.value;
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  const filtered = items.filter(item => item.brand === brand);
  filtered.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.onclick = () => addItem(item.name);
    list.appendChild(li);
  });
});

function addItem(name) {
  if (selectedItems.some(i => i.name === name)) return;
  const item = {
    name: name,
    qtyKarton: 0,
    qtyPcs: 0
  };
  selectedItems.push(item);
  renderItems();
}

function renderItems() {
  const container = document.getElementById('itemContainer');
  container.innerHTML = '<h3>Item Pesanan:</h3>';
  selectedItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${item.name}</label>
      <input type="number" value="${item.qtyKarton}" onchange="updateQty(${index}, 'karton', this.value)" placeholder="Qty Karton">
      <input type="number" value="${item.qtyPcs}" onchange="updateQty(${index}, 'pcs', this.value)" placeholder="Qty PCS">
      <button type="button" onclick="removeItem(${index})">Hapus</button>
    `;
    container.appendChild(div);
  });
}

function updateQty(index, type, value) {
  if (type === 'karton') selectedItems[index].qtyKarton = parseInt(value) || 0;
  else if (type === 'pcs') selectedItems[index].qtyPcs = parseInt(value) || 0;
}

function removeItem(index) {
  selectedItems.splice(index, 1);
  renderItems();
}

function previewPO() {
  alert('Fitur preview akan ditampilkan di versi lengkap.');
}

function submitPO() {
  const data = {
    tanggal: document.getElementById('tanggal').value,
    namaToko: document.getElementById('namaToko').value,
    alamatToko: document.getElementById('alamatToko').value,
    diskon1: document.getElementById('diskon1').value,
    diskon2: document.getElementById('diskon2').value,
    diskon3: document.getElementById('diskon3').value,
    diskon4: document.getElementById('diskon4').value,
    keterangan: document.getElementById('keterangan').value,
    userType: 'sales'
  };

  selectedItems.forEach(item => {
    const payload = {
      ...data,
      brand: document.getElementById('brandSelect').value,
      item: item.name,
      qtyKarton: item.qtyKarton,
      qtyPcs: item.qtyPcs
    };
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  });

  alert('PO berhasil dikirim!');
  location.reload();
}