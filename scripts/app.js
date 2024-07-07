document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('products');

    const displayProduct = (product) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.setAttribute('data-id', product.id);

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>
        <button class="delete-button">&times;</button>
      `;

      productContainer.appendChild(productDiv);
    };

    // Fetch and display products from db.json
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => {
        data.forEach(product => displayProduct(product));
      })
      .catch(error => console.error('Error cargando los productos:', error));

    document.getElementById('product-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const price = document.getElementById('price').value;
      const imageInput = document.getElementById('image');
      const file = imageInput.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        const newProduct = { name, price, image: reader.result };

        fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
          displayProduct(data);
          console.log('Producto agregado:', data);
        })
        .catch(error => console.error('Error agregando producto:', error));
      };

      if (file) {
        reader.readAsDataURL(file);
      }

      this.reset();
    });

    productContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('delete-button')) {
        const productDiv = e.target.closest('.product');
        const productId = productDiv.getAttribute('data-id');

        fetch(`http://localhost:3000/products/${productId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            productDiv.remove();
            console.log('Producto eliminado');
          }
        })
        .catch(error => console.error('Error deleting product:', error));
      }
    });
});
