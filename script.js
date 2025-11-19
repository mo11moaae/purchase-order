let items = JSON.parse(localStorage.getItem('items')) || [];
let brands = JSON.parse(localStorage.getItem('brands')) || [];
let selectedItems = [];

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
  populateBrands();
  setupSearch();
});

function populateBrands() {
  const select = document.getElementById('brandSelect');
  select.innerHTML = '<option value="">-- Pilih Brand --</option>';
  brands.forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    select.appendChild(opt);
  });
}

function setupSearch() {
  const brandSearch = document.getElementById('brandSearch');
  brandSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const select = document.getElementById('brandSelect');
    select.innerHTML = '<option value="">-- Pilih Brand --</option>';
    brands.filter(b => b.toLowerCase().includes(query)).forEach(brand => {
      const opt = document.createElement('option');
      opt.value = brand;
      opt.textContent = brand;
      select.appendChild(opt);
    });
  });

  const itemSearch = document.getElementById('itemSearch');
  itemSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const brand = document.getElementById('brandSelect').value;
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    const filtered = items.filter(item => 
      item.brand === brand && 
      (item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query))
    );
    filtered.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} (${item.code || 'no code'})`;
      li.onclick = () => addItem(item.name);
      list.appendChild(li);
    });
  });
}

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
    userType: localStorage.getItem('userType'),
    username: localStorage.getItem('username')
  };

  selectedItems.forEach(item => {
    const payload = {
      ...data,
      brand: document.getElementById('brandSelect').value,
      item: item.name,
      qtyKarton: item.qtyKarton,
      qtyPcs: item.qtyPcs
    };
    fetch(GSCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => console.log('PO terkirim'));
  });

  alert('PO berhasil dikirim!');
  location.reload();
}
