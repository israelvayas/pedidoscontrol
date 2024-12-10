document.addEventListener('DOMContentLoaded', function() {
  const orderForm = document.getElementById('orderForm');
  const ordersList = document.getElementById('orders');
  const totalPending = document.getElementById('totalPending');
  const totalPaid = document.getElementById('totalPaid');
  const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

  // Cargar pedidos desde el almacenamiento local
  let orders = JSON.parse(localStorage.getItem('orders')) || [];

  // Función para actualizar los totales
  function updateTotals() {
    let pending = 0;
    let paid = 0;
    orders.forEach(order => {
      if (order.paid) {
        paid += order.value;
      } else {
        pending += order.value;
      }
    });
    totalPending.textContent = pending.toFixed(2);
    totalPaid.textContent = paid.toFixed(2);
  }

  // Función para renderizar los pedidos en la tabla
  function renderOrders() {
    ordersTable.innerHTML = '';
    orders.forEach((order, index) => {
      const row = ordersTable.insertRow();
      row.classList.toggle('completed', order.paid);

      row.innerHTML = `
        <td>${order.client}</td>
        <td>${order.description}</td>
        <td>$${order.value.toFixed(2)}</td>
        <td>${order.deliveryDate}</td>
        <td><input type="checkbox" ${order.paid ? 'checked' : ''} onclick="togglePaid(${index})"></td>
        <td><button onclick="deleteOrder(${index})">Eliminar</button></td>
      `;
    });
    updateTotals();
  }

  // Función para agregar un nuevo pedido
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const description = document.getElementById('description').value;
    const value = parseFloat(document.getElementById('value').value);
    const deliveryDate = document.getElementById('deliveryDate').value;

    if (clientName && description && value && deliveryDate) {
      const newOrder = {
        client: clientName,
        description: description,
        value: value,
        paid: false,
        deliveryDate: deliveryDate
      };

      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      renderOrders();

      // Limpiar el formulario
      orderForm.reset();
    }
  });

  // Función para marcar como pagado
  window.togglePaid = function(index) {
    orders[index].paid = !orders[index].paid;
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
  };

  // Función para eliminar un pedido
  window.deleteOrder = function(index) {
    if (confirm('¿Estás seguro que deseas eliminar este pedido?')) {
      orders.splice(index, 1);
      localStorage.setItem('orders', JSON.stringify(orders));
      renderOrders();
    }
  };

  // Renderizar los pedidos cargados
  renderOrders();
});
