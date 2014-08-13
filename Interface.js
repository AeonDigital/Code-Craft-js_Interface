/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module Interface
* @file Manipuladores de Interface.
*
* @requires BasicDOM
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/





// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };





/**
* Classe que provê métodos manipuladores de interface.
*
* @class Interface
*
* @memberof CodeCraft.Interface
*
* @static
*
* @type {Class}
*/
CodeCraft.Interface = new (function () {
    var _dom = CodeCraft.BasicDOM;







    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var public = this.Control = {
        /**
        * Aponta os links externos para abrirem em nova página.
        *
        * @function SetAnchorToNewPage
        *
        * @memberof CodeCraft.Interface
        *
        * @param {String[]}                         [ext]                               Array de extenções que devem ser abertas em nova página.
        */
        SetAnchorToNewPage: function (ext) {
            var ancs = document.getElementsByTagName('a');
            ext = (ext !== undefined) ? ext : [];

            for (var i = 0; i < ancs.length; i++) {
                var a = ancs[i];
                var href = a.href;
                var isNew = false;

                var dom = document.location.hostname;

                // Não encontrando o Site atual na URL a ser Verificada e tendo esta o protocolo 'http://'
                if (href.indexOf(dom) == -1 && (href.indexOf('http://') != -1 || href.indexOf('https://') != -1)) { isNew = true; }

                // Verifica se Arquivos com esta Extenção devem abrir em Outra tela
                for (var j = 0; j < ext.length; j++) {
                    if (href.indexOf('.' + ext.length[j]) != -1) { isNew = true; }
                }

                // Seta Link para Abrir em Outra Janela
                if (isNew) { a.target = '_blank'; }
            }
        },





        /**
        * Efeito de rolagem suave entre anchors dentro da mesma tela.
        *
        * @function ScrollToAnchor
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object}                           o                                   Objeto alvo até onde a rolagem será feita.
        */
        ScrollToAnchor: function (o) {
            scrSt = (window.scrollY) ? window.scrollY :
                    (document.documentElement.scrollTop) ? document.documentElement.scrollTop :
                     document.body.scrollTop;

            var dist = o.offsetTop - scrSt;
            var dur = 500;
            var time = 0;
            var int = 10;

            var easeInOut = function (t, b, c, d) {
                p1 = c / 2;
                p2 = 1 - Math.cos(Math.PI * t / d);
                return (p1 * p2 + b);
            };
            var scrollPage = function () {
                time += int;
                if (time < dur) { window.scrollTo(0, easeInOut(time, scrSt, dist, dur)); }
                else {
                    window.scrollTo(0, scrSt + dist);
                    clearInterval(sInt);
                }
            };

            // set interval
            clearInterval(sInt);
            var sInt = setInterval(scrollPage, int);
        },





        /**
        * Seta rolagem suave para os links(anchor) da tela.
        *
        * @function SetAnchorAnimation
        *
        * @memberof CodeCraft.Interface
        */
        SetAnchorAnimation: function () {
            var evt_AncScroll = function () {
                CodeCraft.Interface.ScrollToAnchor(document.getElementById((this.href.split('#')[1])));
            };

            var ancs = document.getElementsByTagName('a');

            // Para cada Anchor com ID setado
            for (var i = 0; i < ancs.length; i++) {
                var a = ancs[i];

                // Apenas se o atributo Href estiver setado e apontar pra uma ancora
                var h = (a.hasAttribute('href') ? a.href : null);
                if (h != null && h.indexOf('#') != -1) {
                    _dom.SetEvent(a, 'click', evt_AncScroll);
                }
            }
        },





        /**
        * Retorna a distancia em pixels que a rolagem está da margem esquerda da janela do navegador.
        *
        * @function GetScrollX
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object}                       [o]                                     Objeto cuja distancia será identificada.
        */
        GetScrollX: function (o) {
            o = (o === undefined) ? document.getElementsByTagName('body')[0] : o;

            var iR = 0;
            var n = o.tagName.toLowerCase();

            if (n == 'body') { iR = window.pageXOffset; }
            else {
                while (o) {
                    var osl = o.offsetLeft;
                    var sl = (o.tagName.toLowerCase() == 'body') ? 0 : o.scrollLeft;
                    var cl = o.clientLeft;

                    iR += (osl - sl + cl);
                    o = o.offsetParent;
                }
            }
            return iR;
        },





        /**
        * Retorna a distancia em pixels que a rolagem está da margem superior da janela do navegador.
        *
        * @function GetScrollY
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object}                       [o]                                     Objeto cuja distancia será identificada.
        */
        GetScrollY: function (o) {
            o = (o === undefined) ? document.getElementsByTagName('html')[0] : o;

            var iR = 0;
            var n = o.tagName.toLowerCase();

            if (n == 'html') { iR = window.pageYOffset; }
            else {
                while (o) {
                    var ost = o.offsetTop;
                    var st = (o.tagName.toLowerCase() == 'body') ? 0 : o.scrollTop;
                    var ct = o.clientTop;

                    iR += (ost - st + ct);
                    o = o.offsetParent;
                }
            }
            return iR;
        },





        /**
        * Posiciona os Nodes alvos em determinadas coordenadas x/y.
        *
        * @function AbsoluteCoords
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object[]}                     o                                       Elementos que serão reposicionados.
        * @param {Integer}                      x                                       Coordenada x (horizontal).
        * @param {Integer}                      y                                       Coordenada y (vertical).
        */
        AbsoluteCoords: function (o, x, y) {
            o = (o.constructor === Array) ? o : [o];

            for (var i = 0; i < o.length; i++) {
                var elem = o[i];

                // Primeiramente posiciona o elemento alvo nas coordenadas 0,0 
                elem.style.left = '0';
                elem.style.top = '0';

                // Calcula coordenada final
                x = (x - CodeCraft.Interface.GetScrollX(elem)) + 'px';
                y = (y - CodeCraft.Interface.GetScrollY(elem)) + 'px';

                // Aplica coordenadas nos eixos
                elem.style.left = x;
                elem.style.top = y;
            }
        },





        /**
        * Posiciona os Nodes selecionados ao centro do node Pai.
        * @desc Posiciona os Nodes selecionados ao centro do node Pai usando as propriedades CSS Top e Left.
        * Se "pn" não for informado, a referência é o objeto "parentNode" mais próximo de "o".
        *
        * @function AlignToCenter
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object[]}                     o                                       Objetos que serão posicionados.
        * @param {String}                       ax                                      Eixos que serão usados [x|y|xy].
        * @param {Object}                       [pn]                                    Objeto pai(parentNode) que será a referencia para o posicionamento.
        */
        AlignToCenter: function (o, ax, pn) {
            o = (o.constructor === Array) ? o : [o];

            // Para cada node selecionado
            for (var i = 0; i < o.length; i++) {
                var el = o[i];
                var nd = (pn === undefined) ? el.parentNode : pn;
                var nT = nd.tagName.toLowerCase();

                // Se for indicado que é para alinhar pelo eixo 'x'
                if (ax.indexOf('x') != -1) {
                    var pW = (nT == 'body' || nT == 'html') ? window.innerWidth : nd.offsetWidth;
                    el.style.left = Math.round((parseInt(pW) - parseInt(el.clientWidth)) / 2) + 'px';
                }
                // Se for indicado que é para alinhar pelo eixo 'y'
                if (ax.indexOf('y') != -1) {
                    var pH = (nT == 'body' || nT == 'html') ? window.innerHeight : nd.offsetHeight;
                    el.style.top = Math.round((parseInt(pH) - parseInt(el.clientHeight)) / 2) + 'px';
                }
            }
        },





        /**
        * Alinha o objeto alvo ao centro da janela do navegador do cliente.
        *
        * @function AlignToCenterScreen
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object[]}                     o                                       Objetos que serão posicionados.
        * @param {String}                       ax                                      Eixos que serão usados [x|y|xy].
        */
        AlignToCenterScreen: function (o, ax) {
            o = (o.constructor === Array) ? o : [o];
            var dc = document.getElementsByTagName('html')[0];

            // Resgata Largura da Janela do Navegador e posição XY da Rolagem
            var wX = window.innerWidth;
            var wH = window.innerHeight;
            var sX = CodeCraft.Interface.GetScrollX(dc);
            var sY = CodeCraft.Interface.GetScrollY(dc);

            // Para cada node selecionado
            for (var i = 0; i < o.length; i++) {
                var el = o[i];

                // Alinha pelo eixo X
                if (ax.indexOf('x') != -1) {
                    el.style.left = '0';
                    el.style.left = (((wX - el.offsetWidth) / 2) + sX - CodeCraft.Interface.GetScrollX(el)) + 'px';
                }
                // Alinha pelo eixo Y
                if (ax.indexOf('y') != -1) {
                    el.style.top = '0';
                    var finalY = (((wH - el.offsetHeight) / 2) + sY - CodeCraft.Interface.GetScrollY(el));
                    if (finalY < 0) { finalY = 0; }
                    el.style.top = finalY + 'px';
                }
            }
        },





        /**
        * Expande o node indicado por toda a area selecionada.
        *
        * @function ExtendNode
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Object[]}                     o                                       Objetos que serão redimensionados.
        * @param {Boolean}                      [a = false]                             Se "true" expandirá o node por todo o documento.
        */
        ExtendNode: function (o, a) {
            o = (o.constructor === Array) ? o : [o];

            // Para cada node selecionado
            for (var i = 0; i < o.length; i++) {
                var el = o[i];
                var pN, tW, tH;

                if (a === undefined || !a) {
                    pN = el.parentNode;
                    tW = pN.clientWidth;
                    tH = pN.clientHeight;
                }
                else if (a) {
                    // Valores de referencia
                    tW = window.innerWidth;
                    tH = window.innerHeight;
                }

                el.style.width = tW + 'px';
                el.style.height = tH + 'px';
            }
        },





        /**
        * Permite que elementos marcados possam ser livremente arrastados pela tela.
        *
        * @function SetDragElement
        *
        * @memberof CodeCraft.Interface
        *
        * @example Exemplo de elemento marcado para ser arrastado.
        * <div data-dragme="true"> ... </div>
        */
        SetDragElement: function () {
            var mElem = null;
            var cY = null; // Correção de Y
            var cX = null; // Correção de X
            var o = document.querySelectorAll('*[data-dragme="true"]');


            // Mantem apenas objetos HTML
            var drags = [];
            for (var i in o) {
                if (Object.prototype.toString.call(o[i]).substring(0, 12) == '[object HTML') { drags.push(o[i]); }
            }


            // Aciona evento Mousemove ao clicar em um elemento que permite ser arrastado
            CMD_DragOnMouseDown = function (e) {
                mElem = this;

                cY = e.clientY - parseInt(mElem.style.top.replace('px', ''), 10);
                cX = e.clientX - parseInt(mElem.style.left.replace('px', ''), 10);

                _dom.SetEvent(window, 'mousemove', CMD_MoveElemOnMouseMove);
            };

            // Remove o evento de arrastar elementos ao soltar o botão do mouse
            CMD_StopDragOnMouseUp = function () {
                _dom.RemoveEvent(window, 'mousemove', CMD_MoveElemOnMouseMove);
                mElem = null;
                cY = null;
                cX = null;
            };

            // Move elemento clicado junto ao movimento do mouse
            CMD_MoveElemOnMouseMove = function (e) {
                mElem.style.top = (e.clientY - cY) + 'px';
                mElem.style.left = (e.clientX - cX) + 'px';
            };

            // Apenas se houver algum node movel
            if (drags.length > 0) {
                _dom.SetEvent(window, 'mouseup', CMD_StopDragOnMouseUp);

                for (var i = 0; i < drags.length; i++) {
                    var elem = drags[i];
                    elem.style.position = 'absolute';
                    _dom.SetEvent(elem, 'mousedown', CMD_DragOnMouseDown);
                }
            }
        }
    };


    return public;
});