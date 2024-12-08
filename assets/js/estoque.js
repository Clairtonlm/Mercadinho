document.addEventListener('DOMContentLoaded', function() {
    const produtoForm = document.getElementById('produtoForm');
    const tabelaEstoque = document.getElementById('tabelaEstoque').getElementsByTagName('tbody')[0];
    
    // Carregar produtos do localStorage
    let estoque = JSON.parse(localStorage.getItem('produtos')) || [];
    
    // Atualizar tabela de estoque
    function atualizarTabelaEstoque() {
        // Limpar tabela atual
        tabelaEstoque.innerHTML = '';

        // Adicionar cada produto à tabela
        estoque.forEach((produto, index) => {
            const linha = tabelaEstoque.insertRow();
            linha.innerHTML = `
                <td>${produto.categoria}</td>
                <td>${produto.nomeProduto}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${parseFloat(produto.valorUnitario).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarProduto(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removerProduto(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });

        // Salvar no localStorage
        localStorage.setItem('produtos', JSON.stringify(estoque));
    }

    // Evento de submissão do formulário
    produtoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Capturar valores do formulário
        const categoria = document.getElementById('categoria').value;
        const nomeProduto = document.getElementById('nomeProduto').value;
        const codigoBarra = document.getElementById('codigoBarra').value;
        const quantidade = document.getElementById('quantidade').value;
        const valorUnitario = document.getElementById('valorUnitario').value;

        // Criar objeto de produto
        const produto = {
            categoria,
            nomeProduto,
            codigoBarra,
            quantidade: parseInt(quantidade),
            valorUnitario: parseFloat(valorUnitario)
        };

        // Adicionar ao estoque
        estoque.push(produto);

        // Atualizar tabela de estoque
        atualizarTabelaEstoque();

        // Limpar formulário
        produtoForm.reset();
    });

    // Função para editar produto
    window.editarProduto = function(index) {
        const produto = estoque[index];
        
        // Preencher formulário com dados do produto
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('nomeProduto').value = produto.nomeProduto;
        document.getElementById('codigoBarra').value = produto.codigoBarra;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('valorUnitario').value = produto.valorUnitario;

        // Remover produto original
        estoque.splice(index, 1);
        atualizarTabelaEstoque();
    };

    // Função para remover produto
    window.removerProduto = function(index) {
        // Confirmar exclusão
        if(confirm('Tem certeza que deseja remover este produto?')) {
            estoque.splice(index, 1);
            atualizarTabelaEstoque();
        }
    };

    // Inicializar tabela
    atualizarTabelaEstoque();
});
