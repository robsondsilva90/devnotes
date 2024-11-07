// 01 Seleção de Elementos ----------------------------------------------------------------------------------

// Seleção do container de notas
const noteContainer = document.querySelector("#note-container");

// Selção do conteudo da nota
const noteInput = document.querySelector("#note-content");

// Seleção do botão de criar uma nova nota
const addNoteBtn = document.querySelector(".add-note");

// Seleção do input de busca de notas
const searchInput = document.querySelector("#search-input");

// Seleção do botão de exportar em csv
const exportBtn = document.querySelector("#export-notes");

// Seleção de Elementos -------------------------------------------------------------------------------------

// Funções --------------------------------------------------------------------------------------------------

// Função que exibe as notas na tela
function showNotes() {
    // Função que limpa os dados na tela, necessário para atualização automática para o usuário
    cleanNotes();

    // Percorre a notas e armazena em um array
    getNotes().forEach((note) => {
        const noteElement = creatNote(note.id, note.content, note.fixed);

        // Adiciona o objeto no container de notas
        noteContainer.appendChild(noteElement);
    });
}

// Função que limpa os dados da tela
function cleanNotes() {
    noteContainer.replaceChildren([]);
}

// Função que cria a nota
function addNote() {
    const notes = getNotes();

    const noteObject = {
        // Gera um id aleatório para cada nota com a função generateId
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    };
    // Pega o valor da nova nota
    const noteElement = creatNote(noteObject.id, noteObject.content);

    // Adiciona no container de notas
    noteContainer.appendChild(noteElement);

    // Envia o objeto da nota para LocalStorage
    notes.push(noteObject);

    // Salva as notas no LocalStorage
    saveNotes(notes);

    // limpa o campo input das novas notas
    noteInput.value = "";
};

// Função que gera um ID aleatório.
function generateId() {
    return Math.floor(Math.random() * 5000);
}

// Função que cria os elementos da nova nota.
function creatNote(id, content, fixed) {

    // Criando a div
    const element = document.createElement("div");

    // Adicionando a classe
    element.classList.add("note");

    // Criando o elemento textarea
    const textarea = document.createElement("textarea");

    // Captura o valor do input e adiciona no elemento area
    textarea.value = content;

    // Adicionando um placeholder
    textarea.placeholder = "Adicione algum texto";

    // Adicionando o elemento textarea
    element.appendChild(textarea);

    // Criando o elemento de icone
    const pinIcon = document.createElement("i");

    // Adicionando a classe
    pinIcon.classList.add(...["bi", "bi-pin"]);

    // Adicionando o elemento 
    element.appendChild(pinIcon);

    // Criando mais um icone
    const deleteIcon = document.createElement("i");

    // Adicionando a classe
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);

    // Adicionando o elemento
    element.appendChild(deleteIcon);

    // Criando um novo icone
    const duplicateIcon = document.createElement("i");

    // Adicionando uma classe
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

    // Adicionando o elemento
    element.appendChild(duplicateIcon);

    // Condição de verificação da nota para a dicionar a classe
    if (fixed) {
        element.classList.add("fixed");
    }

    // Eventos do Elemento

    // Selecionao elemento testarea e adiciona o evento de tecla
    element.querySelector("textarea").addEventListener("keyup", (e) => {
        // Armazena o valor da textarea
        const noteContent = e.target.value
        // Executa a função de update da nota
        updateNote(id, noteContent);
    });

    // Seleciona o icone de fixar a nota e adiciona o evento de click
    element.querySelector(".bi-pin").addEventListener("click", () => {
        // Executa a função de fixar a nota
        toogleFixNote(id);
    });

    // Seleciona o icone de deletar a nota e adiciona o evento de click
    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        // Executa a função de deletar a nota
        deleteNote(id, element)
    });

    // Seleciona o icone de duplicar a nota e adiciona e evento de click
    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        // Executa a função de copiar a nota
        copyNote(id)
    });

    // Retorna o elemento
    return element;
}

// Função para fixar a nota
function toogleFixNote(id) {
    // Captura as notas
    const notes = getNotes();

    // Realiza um filtro nas notas verifica qual nota foi fixada e salva
    const targetNotes = notes.filter((note) => note.id === id)[0];

    // Verifica se esta fixa ou não e faz o oposto
    targetNotes.fixed = !targetNotes.fixed;

    // Salva as notas
    saveNotes(notes);

    // Exibe as notas na tela novamente depois que a função cleanNotes é executada para atualização das notas fixadas.
    showNotes();
}

// Função que deleta a nota
function deleteNote(id, element) {
    // Realiza o filtro das notas e verifica qual não está listada e salva
    const notes = getNotes().filter((note) => note.id !== id);
    // Salva as notas
    saveNotes(notes);
    // Remove o elemento da tela
    noteContainer.removeChild(element);
}

// Função que copia a nota
function copyNote(id) {
    // Caputura as notas
    const notes = getNotes();

    // Realiza um filtro nas notas e verifica a nota selecionada e salva como unico no array
    const targetNotes = notes.filter((note) => note.id === id)[0];

    // Cria o novo objeto
    const noteObject = {
        // Gera um novo ID para a nota mesmo que copiada
        id: generateId(),
        // Copia o conteudo da nota selecionada
        content: targetNotes.content,
        // Cria a nota sem estar fixada com false
        noteObject: false,
    };

    // Cria o elemento da nota
    const noteElement = creatNote(
        // Adiciona o novo ID
        noteObject.id,
        // Adiciona o conteudo
        noteObject.content,
        // Adiciona o paramentro de fixação
        noteObject.fixed,
    );

    // Adiciona o elemento
    noteContainer.appendChild(noteElement);

    // Envia o objeto da nota para LocalStorage
    notes.push(noteObject);

    // Salva as notas
    saveNotes(notes);
}

// Função que atualiza as notas
function updateNote(id, newContent) {
    // Captura todas as notas
    const notes = getNotes()

    // Realiza um filtro nas notas e verifica o id
    const targetNotes = notes.filter((note) => note.id === id)[0];

    // Salva o conteudo da nota
    targetNotes.content = newContent

    // Salva as notas
    saveNotes(notes);
}

// Função de exportar as notas
function exportData() {
    // Captura todas as notas
    const notes = getNotes()
    // Cria um novo objeto com as notas
    const csvString = [
        // Definindo o cabeçalho
        ["ID", "Notes", "Fixado?"],
        // Para cada objeto criado cria um novo array com as informações
        ...notes.map((note) => [note.id, note.content, note.fixed]),
        // Converte o array em string com e.join, join(",") para separa-las por virgúla e join("\n") para adiciona em cada linha
    ].map((e) => e.join(",")).join("\n");

    // Cria o elemento de link
    const element = document.createElement("a");

    // Cria o link para gerar o arquivo csv
    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    // Cria um elemento para realizar o download em nova aba
    element.target = "_blank";

    // Adiciona um nome no arquivo para download
    element.download = "notes.csv";

    // executa um click no elemento criado
    element.click();
}

// Funções --------------------------------------------------------------------------------------------------

// Local Storage --------------------------------------------------------------------------------------------

// Função que captura as notas do local storage
function getNotes() {
    // Captura notas salvas no LocalStorage converte em objeto javaScript com JSON.parse e caso não tenha notas captura um array vazio.
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    // Ordena as notas fixadas colocando elas em primeiras com .sort (a.fixed > b.fixed ? -1 : 1)
    const OrderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

    // Retorna a ordem realizada
    return OrderedNotes;
}

// Função de salvar as notas
function saveNotes(notes) {
    // Envia as notas para o LocalStorage e converte em string com JSON.string
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Função de pesquisar as notas
function searchNotes(search) {
    // Capturas todas as notas faz um filtro e salva o conteudo do input da pesquisa
    const searchResults = getNotes().filter((note) => note.content.includes(search)
    )

    // Valida se a pesquisa está preenchida
    if (search !== "") {
        // Executa a função cleaNotes
        cleanNotes()

        // Percorre as notas
        searchResults.forEach((note) => {
            // Aramazena o ID e o conteudo
            const noteElement = creatNote(note.id, note.content)
            // Adiciona o elemento no container de notas
            noteContainer.appendChild(noteElement)
        });

        return
    }

    // Executa novamente a função de limpar a tela para limpar a pesquisa
    cleanNotes()

    // Exibe novamente as notas
    showNotes()
}

// Local Storage --------------------------------------------------------------------------------------------

// Eventos --------------------------------------------------------------------------------------------------

// Adiciona um evento de click no botção de criar nota
addNoteBtn.addEventListener("click", () => addNote());

// Adiciona um evento de tecla no input de pesquisa e salva o valor
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    // Executa a função com o valor digitado como paramentro
    searchNotes(search);
});

// Adiciona um evento  de tecla 
noteInput.addEventListener("keydown", (e) => {
    // Verifica se a tecla enter foi pressionada
    if (e.key === "Enter") {
        // Executa a função de criar nota com a tecla enter
        addNote();
    }
});

// Adiciona um evento de click no botão de exportar em csv
exportBtn.addEventListener("click", () => {
    // Executa a função de exportar em csv
    exportData()
})

// Eventos --------------------------------------------------------------------------------------------------

// Função de Inicialização ----------------------------------------------------------------------------------

showNotes();

// Função de Inicialização ----------------------------------------------------------------------------------