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
'use strict';




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










    /*
    * PROPRIEDADES PRIVADAS
    */





    /**
    * [SetDragElement]
    * Guarda propriedades relativas aos eventos de drag-and-drop.
    *
    * @private
    *
    * @type {Object}
    */
    var _drag = {
        /**
        * Objeto que está sendo arrastado.
        *
        * @type {Node}
        */
        element: null,
        /**
        * Armazena os limites para o posicionamento de um elemento.
        *
        * @type {Node}
        */
        limit: null,
        /**
        * Evento que ocorrerá enquanto o objeto estiver sendo arrastado.
        *
        * @type {Function}
        */
        onActive: null,
        /**
        * Posição inicial do eixo Y ao iniciar a mover.
        *
        * @type {Float}
        */
        iniY: null,
        /**
        * Correção do eixo X.
        *
        * @type {Float}
        */
        iniX: null,
        /**
        * Posição "top" inicial do objeto ao iniciar a mover.
        *
        * @type {Float}
        */
        iniT: null,
        /**
        * Posição "left" inicial do objeto ao iniciar a mover.
        *
        * @type {Float}
        */
        iniL: null
    };










    /**
    * [SetResizeElement]
    * Guarda propriedades relativas aos eventos de resize.
    *
    * @private
    *
    * @type {Object}
    */
    var _resize = {
        /**
        * Objeto que está sendo redimensionado.
        *
        * @type {Node}
        */
        element: null,
        /**
        * Armazena os limites para o redimensionamento de um elemento.
        *
        * @type {Node}
        */
        limit: null,
        /**
        * Evento que ocorrerá enquanto o objeto estiver sendo redimensionado.
        *
        * @type {Function}
        */
        onActive: null,
        /**
        * Direção na qual o objeto está sendo redimensionado.
        *
        * @type {String}
        */
        direction: null,
        /**
        * Posição inicial do eixo Y ao iniciar o redimensionamento.
        *
        * @type {Float}
        */
        iniY: null,
        /**
        * Posição inicial do eixo X ao iniciar o redimensionamento.
        *
        * @type {Float}
        */
        iniX: null,
        /**
        * Altura inicial do objeto ao iniciar o redimensionamento.
        *
        * @type {Float}
        */
        iniH: null,
        /**
        * Largura inicial do objeto ao iniciar o redimensionamento.
        *
        * @type {Float}
        */
        iniW: null
    };




















    /*
    * MÉTODOS PRIVADOS
    */


    /**
    * [SetDragElement]
    * Aciona evento Mousemove ao clicar em um elemento que permite ser arrastado.
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _dragOnMouseDown = function (e) {
        e.stopPropagation();
        var o = e.target;


        // Procura por elementos especialmente marcados...
        var t = o;
        var l = null;
        while (t.tagName.toLowerCase() != 'html') {
            // Identifica o elemento que será movido.
            if (t.hasAttribute('data-ccw-drag')) { o = t; }

            // Identifica se há um limite para o elemento a ser movido
            if (t.hasAttribute('data-ccw-drag-limit')) { l = t; }

            t = t.parentNode;
        }



        // Armazena as referencias de valores iniciais
        _drag.iniY = e.clientY;
        _drag.iniX = e.clientX;
        _drag.iniT = parseInt(o.style.top.replace('px', ''), 10);
        _drag.iniL = parseInt(o.style.left.replace('px', ''), 10);



        // Existindo um elemento que demarque os limites dentro dos quais
        // o objeto a ser movido pode ir...
        if (l != null) {

            // Resgata largura e altura do node que demarca o limite
            // para a ação "drag".
            var lH = parseInt(l.style.height.replace('px', ''), 10);
            var lW = parseInt(l.style.width.replace('px', ''), 10);


            // Verifica a posição relativa do node que está sendo movido.
            var y = parseInt(o.style.top.replace('px', ''), 10);
            var x = parseInt(o.style.left.replace('px', ''), 10);


            // Resgata largura e altura do objeto que está sendo movido.
            var w = parseInt(o.style.width.replace('px', ''), 10);
            var h = parseInt(o.style.height.replace('px', ''), 10);


            var minY = e.clientY - y;
            var maxY = lH - (h - minY);
            var minX = e.clientX - x;
            var maxX = lW - (w - minX);
            var lminY = 0;
            var lmaxY = maxY;
            var lminX = 0;
            var lmaxX = maxX;


            // Armazena os valores dos limites
            _drag.limit = {
                // A coordenada mínima que o ponteiro do mouse deve estar para que o movimento seja 
                // transferido para o objeto é:
                minY: minY,
                maxY: maxY,
                minX: minX,
                maxX: maxX,

                // Limiareas máximos e mínimos
                lminY: 0,
                lmaxY: maxY - minY,
                lminX: 0,
                lmaxX: maxX - minX
            };
        }



        // Verifica se há um evento a ser disparado em conjunto com estes
        if (o.hasAttribute('data-ccw-drag-onactive')) {
            _drag.onActive = o.getAttribute('data-ccw-drag-onactive');
        }



        // Impede a seleção do conteúdo da div que está sendo alterada
        var bd = document.body.style;
        var pfx = ['', 'Moz', 'Webkit', 'ms', 'O'];
        for (var it in pfx) {
            bd[pfx[it] + 'UserSelect'] = 'none';
        }

        _drag.element = o;
        _dom.SetEvent(window, 'mousemove', _moveElemOnMouseMove);
    };
    /**
    * [SetDragElement]
    * Move elemento clicado junto ao movimento do mouse.
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _moveElemOnMouseMove = function (e) {
        var nT = (_drag.iniT + (e.clientY - _drag.iniY));
        var nL = (_drag.iniL + (e.clientX - _drag.iniX));
        var setT = (_drag.limit == null || (e.clientY > _drag.limit.minY && e.clientY < _drag.limit.maxY));
        var setL = (_drag.limit == null || (e.clientX > _drag.limit.minX && e.clientX < _drag.limit.maxX));


        // Verifica se deve setar o limiar da posição Y
        if (_drag.limit != null && setT == false) {
            if (e.clientY < _drag.limit.minY) { nT = _drag.limit.lminY; setT = true; }
            if (e.clientY > _drag.limit.maxY) { nT = _drag.limit.lmaxY; setT = true; }
        }

        // Verifica se deve setar o limiar da posição X
        if (_drag.limit != null && setL == false) {
            if (e.clientX < _drag.limit.minX) { nL = _drag.limit.lminX; setL = true; }
            if (e.clientX > _drag.limit.maxX) { nL = _drag.limit.lmaxX; setL = true; }
        }

        if (setT) { _drag.element.style.top = nT + 'px'; }
        if (setL) { _drag.element.style.left = nL + 'px'; }


        if (_drag.onActive != null) {
            window[_drag.onActive](e);
        }
    };
    /**
    * [SetDragElement]
    * Remove o evento de arrastar elementos ao soltar o botão do mouse.
    *
    * @private
    */
    var _stopDragOnMouseUp = function () {
        _dom.RemoveEvent(window, 'mousemove', _moveElemOnMouseMove);


        _drag.element = null;
        _drag.limit = null;
        _drag.onActive = null;
        _drag.iniY = null;
        _drag.iniX = null;


        // Permite novamente a seleção do conteúdo
        var bd = document.body.style;
        var pfx = ['', 'Moz', 'Webkit', 'ms', 'O'];
        for (var it in pfx) {
            bd[pfx[it] + 'UserSelect'] = 'auto';
        }
    };




















    /**
    * [SetResizeElement]
    * Aciona evento Mousemove ao clicar em um elemento que permite ser redimensionado.
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeOnMouseDown = function (e) {
        e.stopPropagation();
        var o = e.target;


        // Procura por elementos especialmente marcados...
        var t = o;
        var l = null;
        while (t.tagName.toLowerCase() != 'html') {
            // Identifica o elemento que será redimensionado.
            if (t.hasAttribute('data-ccw-resize')) { o = t; }

            // Identifica se há um limite para o elemento a ser redimensionado
            if (t.hasAttribute('data-ccw-resize-limit')) { l = t; }

            t = t.parentNode;
        }



        // Armazena as referencias de valores iniciais
        _resize.direction = e.target.getAttribute('data-ccw-resize-pointer');
        _resize.iniY = e.clientY;
        _resize.iniX = e.clientX;
        _resize.iniT = parseInt(o.style.top.replace('px', ''), 10);
        _resize.iniL = parseInt(o.style.left.replace('px', ''), 10);
        _resize.iniH = parseInt(o.style.height.replace('px', ''), 10);
        _resize.iniW = parseInt(o.style.width.replace('px', ''), 10);



        // Existindo um elemento que demarque os limites dentro dos quais
        // o objeto a ser redimensionado pode ir...
        if (l != null) {

            // Resgata largura e altura do node que demarca o limite
            // para a ação "resize".
            var lH = parseInt(l.style.height.replace('px', ''), 10);
            var lW = parseInt(l.style.width.replace('px', ''), 10);


            // Resgata as posições absolutas do node que demarca
            // o limite para a ação "resize"
            var lY = CodeCraft.Interface.GetScrollY(l);
            var lX = CodeCraft.Interface.GetScrollX(l);


            // Armazena os valores dos limites
            _resize.limit = {
                minY: lY,
                maxY: lY + lH,
                minX: lX,
                maxX: lX + lW
            };
        }



        // Verifica se há um evento a ser disparado em conjunto com estes
        if (o.hasAttribute('data-ccw-resize-onactive')) {
            _resize.onActive = o.getAttribute('data-ccw-resize-onactive');
        }



        // Impede a seleção do conteúdo da div que está sendo alterada
        var bd = document.body.style;
        var pfx = ['', 'Moz', 'Webkit', 'ms', 'O'];
        for (var it in pfx) {
            bd[pfx[it] + 'UserSelect'] = 'none';
        }

        _resize.element = o;
        _dom.SetEvent(window, 'mousemove', _resizeOnMouseMove);
        _dom.SetEvent(window, 'mouseup', _stopResizeOnMouseUp);
    };
    /**
    * [SetResizeElement]
    * Redimensiona o elemento na direção "n" (vertical-top).
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeToDirection_N = function (e) {
        if (e.clientY > 0 && (_resize.limit == null || (e.clientY > _resize.limit.minY))) {
            var difY = (e.clientY - _resize.iniY);
            var difH = 0;

            // Se a posição Y do mouse é menor que a posição inicial...
            // o quadro deve aumentar
            if (e.clientY < _resize.iniY) {
                difH = (difY < 0) ? difY * -1 : difY;
            }
            // Senão, se a posição Y do mouse é maior que a posição inicial...
            // o quadro deve diminuir
            else {
                difH = (difY > 0) ? difY * -1 : difY;
            }


            var nTop = _resize.iniT + difY;
            var nHei = _resize.iniH + difH;


            if (nHei >= 0 && nTop >= 0) {
                _resize.element.style.top = nTop + 'px';
                _resize.element.style.height = nHei + 'px';
            }
        }
    };
    /**
    * [SetResizeElement]
    * Redimensiona o elemento na direção "w" (horizontal-left).
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeToDirection_W = function (e) {
        if (e.clientX > 0 && (_resize.limit == null || (e.clientX > _resize.limit.minX))) {
            var difX = (e.clientX - _resize.iniX);
            var difW = 0;

            // Se a posição Y do mouse é menor que a posição inicial...
            // o quadro deve aumentar
            if (e.clientX < _resize.iniX) {
                difW = (difX < 0) ? difX * -1 : difX;
            }
            // Senão, se a posição Y do mouse é maior que a posição inicial...
            // o quadro deve diminuir
            else {
                difW = (difX > 0) ? difX * -1 : difX;
            }

            var nLef = _resize.iniL + difX;
            var nWid = _resize.iniW + difW;

            if (nWid >= 0 && nLef >= 0) {
                _resize.element.style.left = nLef + 'px';
                _resize.element.style.width = nWid + 'px';
            }
        }
    };
    /**
    * [SetResizeElement]
    * Redimensiona o elemento na direção "s" (vertical-bottom).
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeToDirection_S = function (e) {
        if (_resize.limit == null || (e.clientY <= _resize.limit.maxY)) {
            _resize.element.style.height = (_resize.iniH + (e.clientY - _resize.iniY)) + 'px';
        }
    };
    /**
    * [SetResizeElement]
    * Redimensiona o elemento na direção "e" (horizontal-right).
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeToDirection_E = function (e) {
        if (_resize.limit == null || (e.clientX <= _resize.limit.maxX)) {
            _resize.element.style.width = (_resize.iniW + (e.clientX - _resize.iniX)) + 'px';
        }
    };
    /**
    * [SetResizeElement]
    * Redimensiona o elemento clicado junto ao movimento do mouse.
    *
    * @private
    *
    * @param {Event}                e                   Evento que disparou o evento.
    */
    var _resizeOnMouseMove = function (e) {

        // Calcula as dimensões conforme o ponteiro que foi pressionado 
        switch (_resize.direction) {
            case 'nw':
                _resizeToDirection_N(e);
                _resizeToDirection_W(e);
                break;

            case 'ne':
                _resizeToDirection_N(e);
                _resizeToDirection_E(e);
                break;

            case 'sw':
                _resizeToDirection_S(e);
                _resizeToDirection_W(e);
                break;

            case 'se':
                _resizeToDirection_S(e);
                _resizeToDirection_E(e);
                break;

            case 'n':
                _resizeToDirection_N(e);
                break;

            case 's':
                _resizeToDirection_S(e);
                break;

            case 'w':
                _resizeToDirection_W(e);
                break;

            case 'e':
                _resizeToDirection_E(e);
                break;
        }


        if (_resize.onActive != null) {
            window[_resize.onActive](e);
        }
    };
    /**
    * [SetResizeElement]
    * Remove o evento de redimensionar elementos ao soltar o botão do mouse.
    *
    * @private
    */
    var _stopResizeOnMouseUp = function () {
        _dom.RemoveEvent(window, 'mousemove', _resizeOnMouseMove);

        _resize.element = null;
        _resize.onActive = null;
        _resize.direction = null;
        _resize.iniY = null;
        _resize.iniX = null;
        _resize.iniH = null;
        _resize.iniW = null;


        // Permite novamente a seleção do conteúdo
        var bd = document.body.style;
        var pfx = ['', 'Moz', 'Webkit', 'ms', 'O'];
        for (var it in pfx) {
            bd[pfx[it] + 'UserSelect'] = 'auto';
        }
    };















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var _public = this.Control = {
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
            var scrSt = (window.scrollY) ? window.scrollY :
                    (document.documentElement.scrollTop) ? document.documentElement.scrollTop :
                     document.body.scrollTop;

            var dist = o.offsetTop - scrSt;
            var dur = 500;
            var time = 0;
            var int = 10;


            var easeInOut = function (t, b, c, d) {
                var p1 = c / 2;
                var p2 = 1 - Math.cos(Math.PI * t / d);
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
        * <div data-ccw-drag="true">
        *     <div data-ccw-drag-pointer></div>
        * </div>
        */
        SetDragElement: function () {
            var drags = _dom.Get('[data-ccw-drag="true"]');

            // Apenas se houver algum node movel
            if (drags != null) {
                _dom.SetEvent(window, 'mouseup', _stopDragOnMouseUp);

                for (var it in drags) {
                    var d = drags[it];
                    var p = _dom.Get('[data-ccw-drag-pointer]', d);
                    var o = (p !== null) ? p[0] : d;

                    _dom.SetEvent(o, 'mousedown', _dragOnMouseDown);
                }
            }
        },





        /**
        * Permite que elementos marcados possam ser livremente redimensionados.
        *
        * @function SetResizeElement
        *
        * @memberof CodeCraft.Interface
        *
        * @example Exemplo de elemento marcado para ser redimensionado.
        * <div data-ccw-resize="" style="width: 150px; height: 150px; top: 150px; left: 150px;">
        * </div>
        *
        * CSS
        * [data-ccw-resize] {
        *     border: 1px dashed #000;
        *     position: absolute;
        *                
        *     background-color: #FFF;
        * }
        * [data-ccw-resize-pointer] {
        *     width: 6px;
        *     height: 6px;
        *     background-color: #FFF;
        *     border: 1px solid #000;
        *     position: absolute;
        * }
        * [data-ccw-resize-pointer="nw"] { left: -3px; top: -3px; cursor: nw-resize; }
        * [data-ccw-resize-pointer="ne"] { top: -3px; right: -3px; cursor: ne-resize; }
        * [data-ccw-resize-pointer="sw"] { bottom: -3px; left: -3px; cursor: sw-resize; }
        * [data-ccw-resize-pointer="se"] { bottom: -3px; right: -3px; cursor: se-resize; }
        * [data-ccw-resize-pointer="n"] { top: -3px; left: 50%; cursor: n-resize; }
        * [data-ccw-resize-pointer="s"] { bottom: -3px; left: 50%; cursor: s-resize; }
        * [data-ccw-resize-pointer="w"] { left: -3px; top:calc(50% - 3px); cursor: w-resize; }
        * [data-ccw-resize-pointer="e"] { right: -3px; top:calc(50% - 3px); cursor: e-resize; }
        */
        SetResizeElement: function () {
            var resizes = _dom.Get('[data-ccw-resize]');

            if (resizes != null) {
                _dom.SetEvent(window, 'mouseup', _stopResizeOnMouseUp);


                // Para cada item marcado como redimensionável...
                for (var it in resizes) {
                    var tgt = resizes[it];
                    var pointers = _dom.Get('[data-ccw-resize-pointer]', tgt);


                    // Caso os ponteiros não tenham sido definidos no corpo do HTML, 
                    // cria-os dinamicamente.
                    if (pointers == null) {
                        var p = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];

                        for (var ii in p) {
                            var nDiv = document.createElement('div');
                            nDiv.setAttribute('data-ccw-resize-pointer', p[ii]);
                            tgt.appendChild(nDiv);
                        }

                        pointers = _dom.Get('[data-ccw-resize-pointer]', tgt);
                    }



                    // Seta os eventos para redimensionar o elemento
                    for (var ii in pointers) {
                        _dom.SetEvent(pointers[ii], 'mousedown', _resizeOnMouseDown);
                    }
                }

            }
        }
    };


    return _public;
});