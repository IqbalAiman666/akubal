// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// === Supabase MCP Connect ===
// Sudah diisi dengan URL & anon key sebenar user
const supabaseUrl = 'https://jvbmjzpkgtzlicghzwbp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Ym1qenBrZ3R6bGljZ2h6d2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjM1NjMsImV4cCI6MjA2NzA5OTU2M30.bO9X5CR9JMH7YhGG3wHiRJLn2fDxqVUYss48I-nUHF4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Contoh: Fetch data dari table 'brands' di Supabase
async function fetchBrandsFromSupabase() {
  let { data, error } = await supabase
    .from('brands')
    .select('*');
  if (error) {
    console.error('Supabase error:', error);
    return;
  }
  console.log('Data dari Supabase:', data);
  // Anda boleh render data ini ke page jika mahu
}
// fetchBrandsFromSupabase(); // Uncomment untuk test

// Fungsi untuk export data brands.json ke Supabase table 'brands'
async function exportBrandsToSupabase() {
  const res = await fetch('brands.json');
  const brands = await res.json();
  for (const brand of brands) {
    const { error } = await supabase.from('brands').insert([brand]);
    if (error) {
      console.error('Gagal insert:', brand.nama, error);
    } else {
      console.log('Berjaya insert:', brand.nama);
    }
  }
  alert('Export ke Supabase selesai! (Check console untuk status setiap brand)');
}
// Untuk guna: buka console dan panggil exportBrandsToSupabase();

// Papar data brand dari brands.json
fetch('brands.json')
  .then(res => res.json())
  .then(brands => {
    const list = document.getElementById('brands-list');
    if (!list) return;
    list.innerHTML = brands.map(brand => `
      <div class="brand-card">
        <h3>${brand.nama}</h3>
        <div class="brand-meta">Ditubuhkan: ${brand.tahun_ditubuhkan}</div>
        <div class="brand-meta">Founder: ${brand.founder}</div>
        <div class="brand-meta">HQ: ${brand.lokasi_HQ}</div>
        <a class="brand-instagram" href="${brand.instagram}" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><defs><linearGradient id="ig-mini" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#f58529"/><stop offset="0.5" stop-color="#dd2a7b"/><stop offset="1" stop-color="#515bd4"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ig-mini)"/><circle cx="16" cy="16" r="6" stroke="#fff" stroke-width="2" fill="none"/><circle cx="23.2" cy="8.8" r="1.2" fill="#fff"/></svg>
          Instagram
        </a>
      </div>
    `).join('');
  });

// === CRUD Customer LocalStorage ===
function getCustomers() {
  return JSON.parse(localStorage.getItem('customers') || '[]');
}
function saveCustomers(customers) {
  localStorage.setItem('customers', JSON.stringify(customers));
}
function renderCustomers() {
  const list = document.getElementById('customer-list');
  const customers = getCustomers();
  if (!list) return;
  if (customers.length === 0) {
    list.innerHTML = '<div style="opacity:.7">Tiada customer lagi.</div>';
    return;
  }
  list.innerHTML = customers.map((c, i) => `
    <div class="customer-card">
      <div class="customer-info">
        <div><b>${c.name}</b></div>
        <div>Email: ${c.email}</div>
        <div>Phone: ${c.phone}</div>
      </div>
      <div class="customer-actions">
        <button class="edit" onclick="editCustomer(${i})">Edit</button>
        <button class="delete" onclick="deleteCustomer(${i})">Padam</button>
      </div>
    </div>
  `).join('');
}
function addOrUpdateCustomer(e) {
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const email = document.getElementById('customer-email').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const id = document.getElementById('customer-id').value;
  let customers = getCustomers();
  if (id) {
    customers[id] = { name, email, phone };
  } else {
    customers.push({ name, email, phone });
  }
  saveCustomers(customers);
  document.getElementById('customer-form').reset();
  document.getElementById('customer-id').value = '';
  renderCustomers();
}
function editCustomer(i) {
  const customers = getCustomers();
  const c = customers[i];
  document.getElementById('customer-name').value = c.name;
  document.getElementById('customer-email').value = c.email;
  document.getElementById('customer-phone').value = c.phone;
  document.getElementById('customer-id').value = i;
}
function deleteCustomer(i) {
  let customers = getCustomers();
  if (!confirm('Padam customer ini?')) return;
  customers.splice(i, 1);
  saveCustomers(customers);
  renderCustomers();
}
document.getElementById('customer-form').addEventListener('submit', addOrUpdateCustomer);
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
renderCustomers(); 