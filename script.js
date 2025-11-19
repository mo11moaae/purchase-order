let items = JSON.parse(localStorage.getItem('items')) || [];
let brands = JSON.parse(localStorage.getItem('brands')) || [];
let selectedItems = [];

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('userBadge').textContent = localStorage.getItem('username') || 'User';
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
    if (!brand) return;

    const filtered = items.filter(item =>
      item.brand === brand &&
      (item.name.toLowerCase().includes(query) || (item.code && item.code.toLowerCase().includes(query)))
    );

    if (filtered.length === 0) {
      list.innerHTML = '<li style="padding:10px; color:#999; text-align:center;">Tidak ditemukan</li>';
      return;
    }

    filtered.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} (${item.code || 'no code'})`;
      li.style.padding = '12px';
      li.style.borderBottom = '1px solid #eee';
      li.style.cursor = 'pointer';
      li.style.backgroundColor = '#f9f9f9';
      li.style.margin = '2px 0';
      li.style.borderRadius = '8px';
      li.onclick = () => {
        addItem(item.name);
        itemSearch.value = '';
        list.innerHTML = '';
      };
      list.appendChild(li);
    });
  });
}

function addItem(name) {
  if (selectedItems.some(i => i.name === name)) return;
  const item = { name, qtyKarton: 0, qtyPcs: 0 };
  selectedItems.push(item);
  renderItems();
}

function renderItems() {
  const container = document.getElementById('itemContainer');
  container.innerHTML = '';
  if (selectedItems.length === 0) return;

  selectedItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <label>${item.name}</label>
      <div class="item-inputs">
        <input type="number" value="${item.qtyKarton}" onchange="updateQty(${index}, 'karton', this.value)" placeholder="Karton">
        <input type="number" value="${item.qtyPcs}" onchange="updateQty(${index}, 'pcs', this.value)" placeholder="PCS">
        <button type="button" class="item-remove" onclick="removeItem(${index})">X</button>
      </div>
    `;
    container.appendChild(card);
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
  if (!document.getElementById('namaToko').value || !document.getElementById('alamatToko').value) {
    alert('Nama toko dan alamat wajib diisi!');
    return;
  }
  if (selectedItems.length === 0) {
    alert('Tambahkan setidaknya satu item!');
    return;
  }

  let msg = "📄 PREVIEW PO:\n\n";
  msg += `📅 Tanggal: ${document.getElementById('tanggal').value}\n`;
  msg += `🏪 Nama Toko: ${document.getElementById('namaToko').value}\n`;
  msg += `📍 Alamat: ${document.getElementById('alamatToko').value}\n`;
  msg += `🏷️ Brand: ${document.getElementById('brandSelect').value}\n\n`;
  msg += "📦 ITEM:\n";
  selectedItems.forEach(item => {
    msg += `   • ${item.name}: ${item.qtyKarton} Karton, ${item.qtyPcs} PCS\n`;
  });
  msg += `\n💰 Diskon: ${[document.getElementById('diskon1').value, document.getElementById('diskon2').value, document.getElementById('diskon3').value, document.getElementById('diskon4').value].filter(d => d).join(", ") || "Tidak ada"}\n`;
  msg += `📝 Keterangan: ${document.getElementById('keterangan').value || "-"}`;
  alert(msg);
}

function submitPO() {
  if (!document.getElementById('namaToko').value || !document.getElementById('alamatToko').value) {
    alert('Nama toko dan alamat wajib diisi!');
    return;
  }
  if (selectedItems.length === 0) {
    alert('Tambahkan setidaknya satu item!');
    return;
  }

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

  alert('✅ PO berhasil dikirim!');
  selectedItems = [];
  renderItems();
  document.getElementById('namaToko').value = '';
  document.getElementById('alamatToko').value = '';
  document.getElementById('keterangan').value = '';
  document.getElementById('diskon1').value = '';
  document.getElementById('diskon2').value = '';
  document.getElementById('diskon3').value = '';
  document.getElementById('diskon4').value = '';
  document.getElementById('brandSelect').value = '';
  document.getElementById('itemSearch').value = '';
}