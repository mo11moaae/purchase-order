const users = {
  admin: 'admin123',
  sales1: 'sales123',
  sales2: 'sales123',
  sales3: 'sales123',
  sales4: 'sales123',
  sales5: 'sales123',
  sales6: 'sales123',
  sales7: 'sales123',
  sales8: 'sales123',
  sales9: 'sales123',
  sales10: 'sales123',
  sales11: 'sales123',
  sales12: 'sales123',
  sales13: 'sales123',
  sales14: 'sales123',
  sales15: 'sales123'
};

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.remove(), 3000);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  if (users[username] && users[username] === password) {
    localStorage.setItem('userType', username === 'admin' ? 'admin' : 'sales');
    localStorage.setItem('username', username);
    showToast('Login berhasil!');
    window.location.href = 'index.html';
  } else {
    errorDiv.textContent = 'Username atau password salah!';
    showToast('Login gagal!');
  }
});