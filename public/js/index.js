// OBJECT HTML
const burger = document.querySelector('.burger');
const menuNavbar = document.querySelector('.menu-navbar');
const navbar = document.querySelector('.nav');
const tutup = document.querySelector('.tutup');

const btnPesan = document.querySelector('.btn-pesan');
const btn_beli = document.getElementsByClassName('belikan');
const sub_total = document.querySelector('.sub-total');
const tombol_cart = document.querySelector('.tombol-cart');
const cariInput = document.querySelector('.input');

// FIELD UNTUK MEMBELI
const namaField = document.querySelector('input[name="nama"]');
const teleponField = document.querySelector('input[name="telepon"]');
const alamatField = document.querySelector('textarea[name="alamat"]');

// TOMBOL MODAL BUAT MEMESAN
const pesan_modal = document.querySelector('.pesan-modal');

// EVENT SECTION
burger.addEventListener('click', showMenu);
tutup.addEventListener('click', function() {
  menuNavbar.style.display = 'none';

  navbar.classList.remove('showMenu');
});
namaField.addEventListener('input', beliCasing);
teleponField.addEventListener('input', beliCasing);
alamatField.addEventListener('input', beliCasing);
tombol_cart.addEventListener('click', cartItem);

for (let i = 0; i < btn_beli.length; i++) {
  const tombol = btn_beli[i];
  tombol.addEventListener('click', tambahItem);
}

window.onscroll = function() {
  navbarShow();
};

cariInput.addEventListener('input', cariCasing);

// FUNCTION FOR EVENT SECTION
function navbarShow() {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    sub_total.classList.add('sub-total');
    sub_total.classList.add('slideUp');
  } else {
    sub_total.classList.remove('sub-total');
    sub_total.classList.remove('slideUp');
  }
}

function cartItem(e) {
  const tombol = e.target;
  const sub_total = tombol.parentElement.parentElement;
  const div_total = sub_total.querySelectorAll('.total-div div.case');
  for (let i = 0; i < div_total.length; i++) {
    const case_div = div_total[i];
    const title = case_div.getElementsByClassName('title')[0].textContent;
    const quantity = case_div.getElementsByClassName('quantity')[0].value;
    modalBarang(title, quantity);
  }
}

function modalBarang(title, quantity) {
  const divElement = document.createElement('div');
  const pepega_modal = document.querySelector('.pepega-modal');
  const contentPepega = `
  <div class="modal-pepega">
    <ul>
      <li class="title-barang">${title}</li>
      <li class="jumlah-barang">${quantity}</li>
    </ul>
</div>  
  `;
  divElement.innerHTML = contentPepega;
  pepega_modal.append(divElement);
}

function beliCasing() {
  const modal_pepega = document.querySelectorAll(
    '.pepega-modal div.modal-pepega'
  );
  let titleArr = [];
  let quantityArr = [];
  modal_pepega.forEach(e => {
    const title = e.getElementsByClassName('title-barang')[0].textContent;
    const quantity = e.getElementsByClassName('jumlah-barang')[0].textContent;
    titleArr.push(title);
    quantityArr.push(quantity);
    const api = encodeURI(
      `https://api.whatsapp.com/send?phone=6281295072198&text=Nama : ${
        namaField.value
      }\nNo Telepon/WhatsApp : ${teleponField.value}\nAlamat : ${
        alamatField.value
      }\nIngin Memesan :\n${titleArr.join('\n')}, sejumlah (${quantityArr.join(
        ', '
      )})`
    );
    pesan_modal.setAttribute('href', api);
  });
}

function tambahItem(e) {
  const tombol = e.target;
  const casing = tombol.parentElement.parentElement;
  const title = casing.getElementsByClassName('title-casing')[0].textContent;
  const price = casing.getElementsByClassName('price')[0].textContent;
  pesanan(title, price);
  updateHarga();
}

function pesanan(title, price) {
  const row = document.createElement('div');
  const total_div = document.querySelector('.total-div');
  const titleBarang = total_div.querySelectorAll('div.case ul .title');
  for (let i = 0; i < titleBarang.length; i++) {
    if (titleBarang[i].textContent === title) {
      return alert('Barang Sudah ada!');
    }
  }
  const totalContent = `
  <div class='case'>
    <ul>
        <li class='title'>${title}</li>
        <li class='harga'>${price}</li>
        <li><input type="number" class="quantity" value="1"></li>
    </ul>
    <button class='btn btn-danger remove-cart'>Hapus</button>
  </div>
  `;
  row.innerHTML = totalContent;
  total_div.append(row);
  row
    .getElementsByClassName('quantity')[0]
    .addEventListener('change', updateQuantity);
  row
    .getElementsByClassName('remove-cart')[0]
    .addEventListener('click', removeFromCart);
}

function updateQuantity(e) {
  const quantity = e.target;
  if (isNaN(quantity.value) || quantity.value <= 0) {
    quantity.value = 1;
  }
  updateHarga();
}

function removeFromCart(e) {
  const tombol = e.target;
  const casing = tombol.parentElement.parentElement;
  casing.remove();
  updateHarga();
}

function cariCasing(e) {
  const inputan = e.target.value.toString();
  const barang = document.querySelectorAll('.casing');
  barang.forEach(item => {
    const title = item.querySelectorAll('.title-casing');
    for (let i = 0; i < title.length; i++) {
      const realTitle = title[i].textContent;
      if (
        realTitle.toLowerCase().includes(inputan) ||
        realTitle.toUpperCase().includes(inputan)
      ) {
        item.classList.remove('removeCasing');
      } else {
        item.classList.add('removeCasing');
      }
    }
  });
}

function updateHarga() {
  const divTotal = document.getElementsByClassName('total-div')[0];
  const divRowTotal = divTotal.getElementsByClassName('case');
  let total = 0;
  for (let i = 0; i < divRowTotal.length; i++) {
    const barang = divRowTotal[i];
    const harga = barang.getElementsByClassName('harga')[0];
    const quantity = barang.getElementsByClassName('quantity')[0];
    const realHarga = parseFloat(harga.textContent.replace('Rp', ''));
    const jumlah = quantity.value;
    total = total + realHarga * jumlah;
  }
  total = Math.round(total * 1000) / 1000;
  total = total.toLocaleString('id', 'ID');
  document.querySelector('.total-harga').textContent = `Rp${total}`;
}

function showMenu() {
  menuNavbar.style.display = 'block';
  navbar.classList.add('showMenu');
}
