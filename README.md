 Code Craft - Interface
========================

> [Aeon Digital](http://www.aeondigital.com.br)
>
> rianna@aeondigital.com.br


**Code Craft** é um conjunto de soluções front-end e outras server-side para a construção de aplicações web.
Tais soluções aqui apresentadas são a minha forma de compartilhar com a `comunidade online` parte do que aprendi 
(e continuo aprendendo) nos foruns, sites, blogs, livros e etc. assim como na experiência adquirida no contato
direto com profissionais e estudantes que, como eu, amam o universo `Web Developer` e nunca se dão por satisfeitos 
com seu nível atual de conhecimento.


## C.C. - Interface

**Interface** é um conjunto de funcionalidades para manipulação visual de elementos HTML e também
de alteração de comportamentos.


### Comportamento de links e anchors.

* `SetAnchorToNewPage`      : Aponta os links externos para abrirem em nova página.
* `ScrollToAnchor`          : Efeito de rolagem suave entre anchors dentro da mesma tela
* `SetAnchorAnimation`      : Seta rolagem suave para os links(anchor) da tela.
* `SetAnchorPopup`          : Prepara os links configurados para abrirem seus destinos em janelas popup.


### Controladores de posição de elementos Html.

* `GetScrollX`              : Retorna a distancia em pixels que a rolagem está da margem esquerda da janela do navegador.
* `GetScrollY`              : Retorna a distancia em pixels que a rolagem está da margem superior da janela do navegador.
* `AbsoluteCoords`          : Posiciona os Nodes alvos em determinadas coordenadas x/y.
* `AlignToCenter`           : Posiciona os Nodes selecionados ao centro do node Pai.
* `AlignToCenterScreen`     : Alinha o objeto alvo ao centro da janela do navegador do cliente.
* `ExtendNode`              : Expande o node indicado por toda a area selecionada.
* `SetDragElement`          : Permite que elementos marcados possam ser livremente arrastados pela tela.
* `SetResizeElement`        : Permite que elementos marcados possam ser livremente redimensionados.
* `SetCropCanvas`           : Utilizando "SetDragElement" e "SetResizeElement" em conjunto cria um componente para "cropar".




**Importante**

Tenha em mente que em algumas vezes, neste e em outros projetos **Code Craft** optou-se de forma consciênte em 
não utilizar uma ou outra *regra de otimização* dos artefatos de software quando foi percebida uma maior vantagem para
a equipe de desenvolvimento em flexibilizar tal ponto do que extritamente seguir todas as regras de otimização.


### Compatibilidade

Não é intenção deste nem de outros projetos do conjunto de soluções **Code Craft** em manter 
compatibilidade com navegadores antigos (IE8<).


________________________________________________________________________________________________________________________



## Licença

Para este e outros projetos **Code Craft** é utilizada a [Licença GNUv3](LICENCE.md).
