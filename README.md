# SmartLockr 🛡️

## 🎯 Visão Geral

O **SmartLockr** é um sistema de controle de acesso para laboratórios baseado em IoT. Este projeto apresenta um dashboard web interativo para monitorar e gerenciar o acesso a múltiplos laboratórios utilizando tecnologia RFID e comunicação com um dispositivo ESP32. O sistema permite o cadastro de professores, associação de tags RFID, agendamento de aulas e acompanhamento das atividades em tempo real.

## ✨ Funcionalidades Principais

* 🚪 **Controle de Acesso:** Interface para trancar e destrancar laboratórios remotamente (via ESP32).
* 👨‍🏫 **Gerenciamento de Professores:** Cadastro de professores com nome, ID RFID único e matérias associadas.
* 🏷️ **Gestão de Tags RFID:** Registro e visualização de todas as tags RFID cadastradas no sistema.
* 🏢 **Múltiplos Laboratórios:** Suporte para o gerenciamento individual do estado de até 10 laboratórios.
* 🗓️ **Agendamento de Aulas:**
    * Criação de um cronograma de aulas detalhado por dia da semana, turno, horário, laboratório, disciplina e professor responsável.
    * Visualização clara do cronograma na página de atividades.
* 📊 **Log de Atividades:** Registro de eventos importantes como acessos aos laboratórios, cadastro/exclusão de professores e alterações no estado das fechaduras.
* 📈 **Contador de Acessos:** Monitoramento do número de acessos realizados no dia.
* 🌐 **Interface Web:** Dashboard responsivo construído com HTML, CSS (Bootstrap) e JavaScript para fácil interação e visualização.
* 💾 **Persistência de Dados:** Utilização do `localStorage` do navegador para salvar as configurações, cadastros e agendamentos.

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * HTML5
    * CSS3 (com Bootstrap 5 e Bootstrap Icons)
    * JavaScript (ES6+)
* **Hardware (Comunicação):**
    * ESP32 (endereço IP configurado: `192.168.178.110`) - *O código para o ESP32 não está neste repositório.*
* **Armazenamento Local:**
    * Browser `localStorage`
* **Desenvolvimento:**
    * `live-server`

## 🚀 Como Executar (Frontend)

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/SmartLockr.git](https://github.com/seu-usuario/smart-room-guardian.git)
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd SmartLockr
    ```
3.  Se você tiver o `live-server` instalado globalmente via npm, pode iniciar o projeto com:
    ```bash
    live-server
    ```
    Ou simplesmente abra o arquivo `index.html` diretamente no seu navegador.

    *(Nota: Para a funcionalidade completa de controle da fechadura, um ESP32 configurado e rodando o código apropriado na rede local é necessário.)*

## 🔮 Próximos Passos / Ideias Futuras (Opcional)

* [ ] Implementar autenticação de usuário para acesso ao dashboard.
* [ ] Migrar o armazenamento de dados do `localStorage` para um backend com banco de dados (ex: Node.js + MongoDB/PostgreSQL).
* [ ] Adicionar notificações em tempo real.
* [ ] Desenvolver o código para o microcontrolador ESP32.


---
