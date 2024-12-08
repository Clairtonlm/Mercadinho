document.addEventListener('DOMContentLoaded', function() {
    const clienteForm = document.getElementById('clienteForm');
    const tabelaClientes = document.getElementById('tabelaClientes').getElementsByTagName('tbody')[0];
    
    // Carregar clientes do localStorage
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    // Aplicar máscaras nos campos de formulário
    Inputmask({
        'mask': '999.999.999-99', // Máscara de CPF
        'placeholder': ''
    }).mask('#cpf');

    Inputmask({
        'mask': '(99) 99999-9999', // Máscara de Telefone
        'placeholder': ''
    }).mask('#telefone');
    
    // Atualizar tabela de clientes
    function atualizarTabelaClientes() {
        // Limpar tabela atual
        tabelaClientes.innerHTML = '';

        // Adicionar cada cliente à tabela
        clientes.forEach((cliente, index) => {
            const linha = tabelaClientes.insertRow();
            linha.innerHTML = `
                <td>${cliente.nomeCliente}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.telefone}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarCliente(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removerCliente(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });

        // Salvar no localStorage
        localStorage.setItem('clientes', JSON.stringify(clientes));

        // Atualizar select de clientes na página de pedidos
        atualizarSelectClientesPedidos();
    }

    // Função para atualizar select de clientes na página de pedidos
    function atualizarSelectClientesPedidos() {
        // Tentar encontrar o select de clientes na página de pedidos
        const selectCliente = document.querySelector('#pedidos-page #cliente');
        
        if (selectCliente) {
            // Limpar opções anteriores
            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

            // Adicionar novos clientes
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.nomeCliente;
                option.textContent = cliente.nomeCliente;
                selectCliente.appendChild(option);
            });
        }
    }

    // Evento de submissão do formulário
    clienteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Capturar valores do formulário
        const nomeCliente = document.getElementById('nomeCliente').value;
        const cpf = document.getElementById('cpf').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const endereco = document.getElementById('endereco').value;

        // Verificar se o cliente já existe
        const clienteExistente = clientes.find(c => c.cpf === cpf);
        
        if (clienteExistente) {
            alert('Cliente com este CPF já cadastrado!');
            return;
        }

        // Criar objeto de cliente
        const cliente = {
            nomeCliente,
            cpf,
            telefone,
            email,
            endereco
        };

        // Adicionar ao array de clientes
        clientes.push(cliente);

        // Atualizar tabela de clientes
        atualizarTabelaClientes();

        // Limpar formulário
        clienteForm.reset();
    });

    // Função para editar cliente
    window.editarCliente = function(index) {
        const cliente = clientes[index];
        
        // Preencher formulário com dados do cliente
        document.getElementById('nomeCliente').value = cliente.nomeCliente;
        document.getElementById('cpf').value = cliente.cpf;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('email').value = cliente.email;
        document.getElementById('endereco').value = cliente.endereco;

        // Remover cliente original
        clientes.splice(index, 1);
        atualizarTabelaClientes();
    };

    // Função para remover cliente
    window.removerCliente = function(index) {
        // Confirmar exclusão
        if(confirm('Tem certeza que deseja remover este cliente?')) {
            clientes.splice(index, 1);
            atualizarTabelaClientes();
        }
    };

    // Inicializar tabela
    atualizarTabelaClientes();
});
