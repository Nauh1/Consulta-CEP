document.addEventListener("DOMContentLoaded", () => {
    const cep = document.getElementById("cep");
    const nome = document.getElementById("nome");
    const salvar = document.getElementById("save");
    let cepValue = '';
    let data = null;
    let nomeSave = null;

    const armazenado = localStorage.getItem("armazem");
    let armazem = armazenado ? JSON.parse(armazenado) : [];
    
    const obterRegiao = (uf) => {
        const regioes = {
            "AC": "Norte", "AL": "Nordeste", "AP": "Norte", "AM": "Norte", "BA": "Nordeste", "CE": "Nordeste",
            "DF": "Centro-Oeste", "ES": "Sudeste", "GO": "Centro-Oeste", "MA": "Nordeste", "MT": "Centro-Oeste",
            "MS": "Centro-Oeste", "MG": "Sudeste", "PA": "Norte", "PB": "Nordeste", "PR": "Sul", "PE": "Nordeste",
            "PI": "Nordeste", "RJ": "Sudeste", "RN": "Nordeste", "RS": "Sul", "RO": "Norte", "RR": "Norte",
            "SC": "Sul", "SP": "Sudeste", "SE": "Nordeste", "TO": "Norte"
        };
        return regioes[uf] || 'Desconhecida';
    };
    const obterDDD = (uf) => {
        const ddds = {
            "AC": "68", "AL": "82", "AP": "96", "AM": "92", "BA": "71", "CE": "85",
            "DF": "61", "ES": "27", "GO": "62", "MA": "98", "MT": "65", "MS": "67",
            "MG": "31", "PA": "91", "PB": "83", "PR": "41", "PE": "81", "PI": "86",
            "RJ": "21", "RN": "84", "RS": "51", "RO": "69", "RR": "95", "SC": "48",
            "SP": "11", "SE": "79", "TO": "63"
        };
        return ddds[uf] || 'Desconhecido';
    };

    cep.addEventListener("input", () => {
        cepValue = cep.value.replace(/\D/g, '');

        if (cepValue.length === 8) {
            fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.erro) {
                        alert("CEP não encontrado");
                        data = null;
                    } else {
                        data = responseData;
                        document.getElementById('logradouro').value = data.logradouro;
                        document.getElementById('complemento').value = data.complemento || '';
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('localidade').value = data.localidade;
                        document.getElementById('uf').value = data.uf;

                        document.getElementById('regiao').value = obterRegiao(data.uf);
                        document.getElementById('ddd').value = obterDDD(data.uf);
                        document.getElementById('unidade').value = "";
                    }
                })
                .catch(error => {
                    console.error('Erro ao consultar o CEP:', error);
                    alert('Erro ao consultar o CEP');
                    data = null;
                });
        }
    });

    nome.addEventListener("input", () => {
        nomeSave = nome.value;
    })

    salvar.addEventListener("click", () => {
        if (data) {
            armazem.push("Nome: " + nomeSave + ",\n" +
                cepValue + ",\n" +
                (data.logradouro || "Logradouro não encontrado") + ",\n" +
                (data.complemento || "Complemento não encontrado") + ",\n" +
                (data.bairro || "Bairro não encontrado") + ",\n" +
                (data.localidade || "Localidade não encontrada") + ",\n" +
                (data.uf || "UF não encontrada") + ",\n" +
                obterRegiao(data.uf) + ",\n" +
                obterDDD(data.uf) + ",\n"
            );
            alert("Dados salvos!")
            localStorage.setItem("armazem", JSON.stringify(armazem));
        }
    });


    const btnListar = document.getElementById("listar");
    const listaArmazem = document.getElementById("lista-armazem");

    btnListar.addEventListener("click", () => {
        listaArmazem.innerHTML = "";

        armazem.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `Registro ${index + 1}:\n` + item;
            listaArmazem.appendChild(li);
        });
    });


});
