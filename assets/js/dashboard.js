document.addEventListener('DOMContentLoaded', function() {
    // Simular dados para o dashboard
    const totalProdutos = document.getElementById('totalProdutos');
    const totalClientes = document.getElementById('totalClientes');
    const pedidosPendentes = document.getElementById('pedidosPendentes');
    const tabelaUltimosPedidos = document.getElementById('tabelaUltimosPedidos').getElementsByTagName('tbody')[0];

    // Recuperar dados do localStorage
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');

    // Atualizar totais
    totalProdutos.textContent = produtos.length;
    totalClientes.textContent = clientes.length;
    pedidosPendentes.textContent = pedidos.filter(p => p.status === 'Pendente').length;

    // Mostrar últimos pedidos
    pedidos.slice(-5).reverse().forEach(pedido => {
        const linha = tabelaUltimosPedidos.insertRow();
        linha.innerHTML = `
            <td>${pedido.numero}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.data}</td>
            <td>${pedido.status}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="mostrarDetalhesPedido('${pedido.numero}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    });

    // Função para mostrar detalhes do pedido (será implementada com modal)
    window.mostrarDetalhesPedido = function(numeroPedido) {
        const pedido = pedidos.find(p => p.numero === numeroPedido);
        if (pedido) {
            const modalCorpo = document.getElementById('corpoModalPedido');
            modalCorpo.innerHTML = `
                <p><strong>Número do Pedido:</strong> ${pedido.numero}</p>
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Data:</strong> ${pedido.data}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <h5>Itens do Pedido:</h5>
                <ul>
                    ${pedido.itens.map(item => `<li>${item.produto} - Quantidade: ${item.quantidade}</li>`).join('')}
                </ul>
            `;
            
            // Mostrar modal
            const modalDetalhesPedido = new bootstrap.Modal(document.getElementById('modalDetalhesPedido'));
            modalDetalhesPedido.show();
        }
    };
});
