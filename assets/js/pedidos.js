document.addEventListener('DOMContentLoaded', function() {
    const pedidoForm = document.getElementById('pedidoForm');
    const selectCliente = document.getElementById('cliente');
    const selectProduto = document.getElementById('produto');
    const tabelaPedidos = document.getElementById('tabelaPedidos').getElementsByTagName('tbody')[0];
    
    // Função para carregar dados do localStorage
    function carregarDadosLocalStorage() {
        return {
            clientes: JSON.parse(localStorage.getItem('clientes') || '[]'),
            produtos: JSON.parse(localStorage.getItem('produtos') || '[]'),
            pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]')
        };
    }

    // Dados iniciais
    let { clientes, produtos, pedidos } = carregarDadosLocalStorage();
    
    // Função para popular select de clientes
    function popularSelectClientes() {
        // Limpar select atual
        selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

        // Recarregar clientes do localStorage
        clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

        // Preencher select de clientes
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.nomeCliente;
            option.textContent = cliente.nomeCliente;
            selectCliente.appendChild(option);
        });

        console.log('Clientes carregados:', clientes.length);
    }

    // Função para popular select de produtos
    function popularSelectProdutos() {
        // Limpar select atual
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';

        // Recarregar produtos do localStorage
        produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

        // Preencher select de produtos
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.nomeProduto;
            option.textContent = `${produto.nomeProduto} - R$ ${produto.valorUnitario.toFixed(2)}`;
            selectProduto.appendChild(option);
        });

        console.log('Produtos carregados:', produtos.length);
    }

    // Popular selects na inicialização
    popularSelectClientes();
    popularSelectProdutos();

    // Escutar mudanças no localStorage para atualizar clientes e produtos
    window.addEventListener('storage', function(event) {
        if (event.key === 'clientes') {
            popularSelectClientes();
        }
        if (event.key === 'produtos') {
            popularSelectProdutos();
        }
    });

    // Adicionar listener para verificar localStorage periodicamente
    setInterval(() => {
        const dadosAtualizados = carregarDadosLocalStorage();
        
        if (dadosAtualizados.clientes.length !== clientes.length) {
            clientes = dadosAtualizados.clientes;
            popularSelectClientes();
        }

        if (dadosAtualizados.produtos.length !== produtos.length) {
            produtos = dadosAtualizados.produtos;
            popularSelectProdutos();
        }
    }, 1000); // Verificar a cada 1 segundo
    
    // Atualizar tabela de pedidos
    function atualizarTabelaPedidos() {
        // Limpar tabela atual
        tabelaPedidos.innerHTML = '';

        // Adicionar cada pedido à tabela
        pedidos.forEach((pedido, index) => {
            const linha = tabelaPedidos.insertRow();
            linha.innerHTML = `
                <td>${pedido.numero}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.data}</td>
                <td>${pedido.status}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalhes(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="mudarStatus(${index})">
                        <i class="fas fa-sync"></i>
                    </button>
                </td>
            `;
        });

        // Salvar no localStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    // Evento de submissão do formulário
    pedidoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Capturar valores do formulário
        const cliente = selectCliente.value;
        const produto = selectProduto.value;
        const quantidade = document.getElementById('quantidade').value;
        const observacoes = document.getElementById('observacoes').value;

        // Validar campos
        if (!cliente || !produto || !quantidade) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        // Gerar número de pedido único
        const numeroPedido = `PED-${new Date().getTime()}`;

        // Criar objeto de pedido
        const pedido = {
            numero: numeroPedido,
            cliente,
            data: new Date().toLocaleDateString(),
            status: 'Pendente',
            itens: [{
                produto,
                quantidade: parseInt(quantidade)
            }],
            observacoes
        };

        // Adicionar ao array de pedidos
        pedidos.push(pedido);

        // Atualizar tabela de pedidos
        atualizarTabelaPedidos();

        // Limpar formulário
        pedidoForm.reset();

        // Recarregar clientes e produtos
        popularSelectClientes();
        popularSelectProdutos();
    });

    // Função para ver detalhes do pedido
    window.verDetalhes = function(index) {
        const pedido = pedidos[index];
        alert(`
            Número do Pedido: ${pedido.numero}
            Cliente: ${pedido.cliente}
            Data: ${pedido.data}
            Status: ${pedido.status}
            Observações: ${pedido.observacoes}

            Itens:
            ${pedido.itens.map(item => `${item.produto} - Quantidade: ${item.quantidade}`).join('\n')}
        `);
    };

    // Função para mudar status do pedido
    window.mudarStatus = function(index) {
        const pedido = pedidos[index];
        const novosStatus = ['Pendente', 'Em Preparação', 'Pronto para Entrega', 'Entregue'];
        
        const statusAtualIndex = novosStatus.indexOf(pedido.status);
        pedido.status = novosStatus[(statusAtualIndex + 1) % novosStatus.length];
        
        atualizarTabelaPedidos();
    };

    // Inicializar tabela
    atualizarTabelaPedidos();
});
