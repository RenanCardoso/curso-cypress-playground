describe("Visitando Playground", () => {
  beforeEach(() => {
    //Congelando o relógio do navegador com Cypress
    const now = new Date(2024, 3, 15); // Os meses iniciam no índice 0, ou seja, 3 é equivalente ao mês de Abril
    cy.clock(now);

    cy.visit(
      "https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html"
    );
  });

  //Clicando em elementos
  it("Clicar no botão Subscribe", () => {
    cy.contains("button", "Subscribe").click();
    cy.get(".success").should("be.visible");
  });

  //Escrever menu nome e validar se o texto exibido é igual ao meu nome que foi preenchido
  it("Digitando em campos", () => {
    let nome = "Renan Cardoso";
    cy.get("#signature-textarea").should("be.visible").type(nome);
    cy.get("#signature").should("have.text", nome);
  });

  //Experimente criando um teste que digite o seu nome no segundo campo “Sign here” e marque a caixa de seleção “Show signature's preview”. Certifique-se de que o preview da assinatura seja exibido.
  it("Marcando e desmarcando caixas de seleção", () => {
    let nome = "Renan Cardoso";
    cy.get("#signature-textarea-with-checkbox").should("be.visible").type(nome);
    cy.get("#signature-checkbox").as("checkboxes").check();
  });

  //Experimente criando um teste que marca os radio buttons On e Off. Certifique-se de que o texto correto seja exibido dependendo de qual radio button estiver marcado.
  it("Marcando inputs do tipo radio", () => {
    cy.get("#off").check();
    cy.get("#on-off")
      .should("have.text", "OFF")
      .should("have.css", "color", "rgb(255, 0, 0)");

    cy.get("#on").check();
    cy.get("#on-off")
      .should("have.text", "ON")
      .should("have.css", "color", "rgb(0, 128, 0)");
  });

  //Experimente criando um teste que selecione um dos tipos disponíveis (Basic, Standard ou VIP) e certifique-se de que o tipo correto seja exibido.
  it("Selecionando opções em campos de seleção suspensa", () => {
    cy.get("#selection-type").select("Standard");
    cy.get("#select-selection > strong").should("have.text", "STANDARD");
  });

  //Experimente criando um teste que seleciona algumas frutas e certifique-se de que as frutas corretas sejam exibidas.
  it("Selecionando múltiplas opções em campos do tipo select", () => {
    cy.get("#fruit").select(["Apple", "Banana"]);
    cy.get("#fruits-paragraph > strong").should("have.text", "apple, banana");
  });

  //Experimente criando um teste que seleciona um arquivo e certifique-se de que o nome correto do arquivo seja exibido.
  it("Testando o upload de arquivos", () => {
    cy.get('input[type="file"]').selectFile("./cypress/fixtures/example.json");
    cy.get("#file > strong").should("have.text", "example.json");
  });

  //Experimente criando um teste que intercepte a requisição acionada ao clicar no botão Get TODO. Clique no botão e aguarde a requisição acontecer. Além disso, certifique-se de que uma lista seja exibida quando a requisição retornar.
  it("Interceptando e aguardando requisições que ocorrem à nível de rede", () => {
    cy.intercept("GET", "**/todos/1").as("getTodo");
    cy.contains("button", "Get TODO").click(); // Isso iria disparar a requisição definida acima.
    cy.wait("@getTodo");

    cy.contains("ul li", "TODO ID: 1").should("be.visible");
  });

  //Experimente criando um teste que intercepte a requisição acionada ao clicar no botão Get TODO, mas desta vez, use uma fixture como resposta da requisição. Clique no botão e aguarde a requisição acontecer. Além disso, certifique-se de que uma lista seja exibida com os mesmos dados do arquivo de fixture.
  it("Fixtures randômicas? Sim, é possível!", () => {
    cy.generateFixtureTodo();

    cy.intercept("GET", "**/todos/1", { fixture: "todo-dynamic" }).as(
      "getTodo"
    );
    cy.contains("button", "Get TODO").click(); // Isso iria disparar a requisição definida acima.
    cy.wait("@getTodo");
  });

  //Experimente criando um teste que intercepte a requisição acionada ao clicar no botão Get TODO, mas desta vez, simule uma falha de API. Clique no botão e aguarde a requisição acontecer. Além disso, certifique-se de que um elemento de fallback seja exibido.
  it("Simulando uma falha na API", () => {
    cy.intercept("GET", "**/todos/1", { statusCode: 500 }).as("serverFailure");
    cy.contains("button", "Get TODO").click(); // Isso iria disparar a requisição definida acima.

    cy.wait("@serverFailure")
      .its("response.statusCode")
      .should("be.equal", 500);

    cy.get("#intercept > .error")
      .should("be.visible")
      .should(
        "have.text",
        "Oops, something went wrong. Refresh the page and try again."
      );
  });

  //Experimente criando um teste que intercepte a requisição acionada ao clicar no botão Get TODO, mas desta vez, simule uma falha na rede. Clique no botão e aguarde a requisição acontecer. Além disso, certifique-se de que um elemento de fallback seja exibido.
  it("Simulando uma falha na rede", () => {
    cy.intercept("GET", "**/todos/1", { forceNetworkError: true }).as(
      "networkError"
    );
    cy.contains("button", "Get TODO").click(); // Isso iria disparar a requisição definida acima.

    cy.get("#intercept > .error")
      .should("be.visible")
      .should(
        "have.text",
        "Oops, something went wrong. Check your internet connection, refresh the page, and try again."
      );
  });

  //Experimente criando um teste que faça uma requisição do tip GET para o endpoint https://jsonplaceholder.typicode.com/todos/1 e certifique-se de que o código de status retornado seja 200.
  it("Criando um simples teste de API com Cypress", () => {
    cy.request("GET", "https://jsonplaceholder.typicode.com/todos/1")
      .its("status")
      .should("be.equal", 200);
  });

  //Experimente criando um teste que seleciona um nível invocando seu valor e acionando a mudança. Certifique-se de que o nível correto seja exibido.
  it("Lidando com inputs do tipo range", () => {
    cy.get('input[type="range"]').invoke("val", 5).trigger("change");
    cy.get("#level-paragraph > strong").should("have.text", "5");
  });

  //Experimente criando um teste que digita uma data e tira o foco do campo de data. Certifique-se de que a data correta seja exibida.
  it("Lidando com inputs do tipo date", () => {
    cy.get('input[type="date"]').type("2024-01-16").blur();
    cy.get("#date-paragraph > strong").should("have.text", "2024-01-16");
  });

  //Experimente criando um teste que digita no campo de senha com base em dados confidenciais provenientes do arquivo cypress.env.json. Marque e desmarque a caixa de seleção "Show password" e certifique-se de que a senha seja exibida e depois mascarada.
  it("Protegendo dados sensíveis com Cypress", () => {
    cy.get("#show-password-checkbox").check();
    cy.get("#password").type(Cypress.env("user_password"));
    cy.get("#show-password-checkbox").uncheck();
  });

  //Experimente criando um teste que digita no campo de senha com base em dados confidenciais provenientes do arquivo cypress.env.json. Certifique-se de não registrar os dados confidenciais nos logs de comando do Cypress. Marque e desmarque a caixa de seleção "Show password" e certifique-se de que a senha seja exibida e depois mascarada.
  it("Aprendendo como NÃO vazar dados sensíveis no log de comandos do Cypress", () => {
    cy.get("#show-password-checkbox").check();
    cy.get("#password").type(Cypress.env("user_password"), { log: false });
    cy.get("#show-password-checkbox").uncheck();
  });

  //Experimente criando um teste que conte o número de animais (Animals) e certifique-se de que seja 5.
  it("Contando itens com Cypress", () => {
    cy.get("ul li").should("have.length", 5);
  });

  //Experimente criar um teste que verifique a data exibida. Certifique-se de congelar o relógio do navegador atualizando o código no hook beforeEach.
  it("Congelando o relógio do navegador com Cypress", () => {
    cy.get("#date-section-paragraph > strong")
      .should("be.visible")
      .should("have.text", "2024-04-15");
  });

  // Experimente criar um teste que copia o código Your code is:, digita-o e clica no botão Submit. Certifique-se de que uma mensagem de sucesso seja exibida.
  // Além disso, veja o que acontece quando o código errado é digitado. Certifique-se de criar um teste para isso também, verificando que uma mensagem de erro é exibida.
  it("Usando dados gerados pela aplicação como entrada para os testes", () => {
    cy.get("#timestamp").then((element) => {
      const value = element[0].innerText;
      cy.get("#code").type(value);
    });
    cy.get("form > button").click();
    cy.get(".success").should("be.visible");

    cy.get("#code").type("1");
    cy.get("form > button").click();
    cy.get(".error").should("be.visible");
  });

  //Experimente criando um teste que clica no link "Download a text file". Certifique-se de ler o conteúdo do arquivo para verificar se está correto.
  it("Testando a leitura de arquivos com Cypress", () => {
    cy.contains("a", "Download a text file").click();

    cy.readFile("cypress/downloads/example.txt").should(
      "include",
      "Hello, World!"
    );
  });
});
