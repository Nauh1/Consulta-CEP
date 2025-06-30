document.addEventListener("DOMContentLoaded", () => {
    const cep = document.getElementById("cep");

    cep.addEventListener("input", () => {
        let cepValue = cep.value.replace(/\D/g, '');

        if (cepValue.length === 8) {
            fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        console.alert("CEP não encontrado")
                    } else {
                        document.getElementById('logradouro').value = data.logradouro;
                        document.getElementById('complemento').value = data.complemento || '';
                        document.getElementById('bairro').value = data.bairro;

                        document.getElementById('localidade').value = data.localidade;
                        document.getElementById('uf').value = data.uf;
                    }
                })
                .catch(error => {
                    console.error('Erro ao consultar o CEP:', error);
                    alert('Erro ao consultar o CEP');
                });
        }
    });
});
