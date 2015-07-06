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
    * Objeto que traz informações sobre as coordenadas e dimensões de um objeto.
    * 
    * @type {InterfaceData}
    *
    * @property {Integer}               Y                           Coordenada Y do elemento com relação à margem superior do display.
    * @property {Integer}               X                           Coordenada X do elemento com relação à margem esquerda do display.
    * @property {Integer}               icY                         Coordenada inicial do cursor no eixo Y.
    * @property {Integer}               icX                         Coordenada inicial do cursor no eixo X.
    * @property {Integer}               T                           Valor da propriedade "top" do elemento.
    * @property {Integer}               L                           Valor da propriedade "left" do elemento.
    * @property {Integer}               H                           Valor da propriedade "height" do elemento.
    * @property {Integer}               W                           Valor da propriedade "width" do elemento.
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
        * Traz informações completas sobre as coordenadas do elemento.
        *
        * @type {InterfaceData}
        */
        idata: null,

        /**
        * Indica se o elemento que está sendo movido faz parte de um componente "crop".
        *
        * @type {Boolean}
        */
        crop: false
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
        * Traz informações completas sobre as coordenadas do elemento que está sendo redimensionado.
        *
        * @type {InterfaceData}
        */
        idata: null,
        /**
        * Traz informações completas sobre as coordenadas do elemento que limita o movimento.
        *
        * @type {InterfaceData}
        */
        ldata: null,
        /**
        * Razão que deve ser respeitada ao redimensionar o objeto.
        *
        * @type {Object}
        */
        ratio: null,

        /**
        * Indica se o elemento que está sendo redimensionado faz parte de um componente "crop".
        *
        * @type {Boolean}
        */
        crop: false
    };




















    /*
    * MÉTODOS PRIVADOS
    */




    /** 
    * Habilita ou desabilita a possibilidade de selecionar conteúdo da página.
    *
    * @private
    *
    * @param {Boolean}              a                   Indica se é para ativar ou desativar a seleção.
    */
    var _bodyContentSelection = function (a) {

        var set = (a) ? 'auto' : 'none';
        var bd = document.body.style;
        var pfx = ['', 'Moz', 'Webkit', 'ms', 'O'];
        for (var it in pfx) {
            bd[pfx[it] + 'UserSelect'] = set;
        }

    };




















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

            // Identifica se o resize faz parte de um componente "crop"
            if (t.hasAttribute('data-ccw-crop-canvas')) { _drag.crop = true; }


            t = t.parentNode;
        }



        // Armazena as referencias de valores iniciais
        _drag.element = o;
        _drag.idata = _public.GetInterfaceData(o, e);
        _drag.limit = { 'axis': null };



        // Existindo um elemento que demarque os limites dentro dos quais
        // o objeto a ser movido pode ir...
        if (l != null) {
            var i = _drag.idata;

            // Resgata largura e altura do node que demarca o limite
            // para a ação "drag".
            var lH = parseInt(l.style.height.replace('px', ''), 10);
            var lW = parseInt(l.style.width.replace('px', ''), 10);


            var minY = i.icY - i.T;
            var maxY = lH - (i.H - minY);
            var minX = i.icX - i.L;
            var maxX = lW - (i.W - minX);


            // Armazena os valores dos limites
            _drag.limit = {
                'axis': {
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
                }
            };
        }



        // Verifica se há um evento a ser disparado em conjunto com estes
        if (o.hasAttribute('data-ccw-drag-onactive')) {
            _drag.onActive = o.getAttribute('data-ccw-drag-onactive');
            var onActive = null;


            // Se é um evento global...
            if (_drag.onActive.indexOf('.') == -1) {
                onActive = window[_drag.onActive];
            }
            // senão...
            else {
                var split = _drag.onActive.split('.');
                onActive = window[split[0]];

                // "engatilha" o evento que deve ser disparado...
                for (var i = 1; i < split.length; i++) {
                    onActive = onActive[split[i]];
                }
            }

            _drag.onActive = onActive;
        }



        _bodyContentSelection(false);
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
        var i = _drag.idata;
        var l = _drag.limit.axis;


        var nT = (i.T + (e.clientY - i.icY));
        var nL = (i.L + (e.clientX - i.icX));
        var setT = (l == null || (e.clientY > l.minY && e.clientY < l.maxY));
        var setL = (l == null || (e.clientX > l.minX && e.clientX < l.maxX));


        // Verifica se deve setar o limiar da posição Y
        if (l != null && setT == false) {
            if (e.clientY < l.minY) { nT = l.lminY; setT = true; }
            if (e.clientY > l.maxY) { nT = l.lmaxY; setT = true; }
        }

        // Verifica se deve setar o limiar da posição X
        if (l != null && setL == false) {
            if (e.clientX < l.minX) { nL = l.lminX; setL = true; }
            if (e.clientX > l.maxX) { nL = l.lmaxX; setL = true; }
        }

        if (setT) { _drag.element.style.top = nT + 'px'; }
        if (setL) { _drag.element.style.left = nL + 'px'; }


        if (_drag.onActive != null) {
            _drag.onActive(e);
        }
        if (_drag.crop) {
            _cropOnChangeResize(_drag);
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
        _drag.idata = null;
        _drag.crop = false;


        _bodyContentSelection(true);
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

            // Identifica se o resize faz parte de um componente "crop"
            if (t.hasAttribute('data-ccw-crop-canvas')) { _resize.crop = true; }


            t = t.parentNode;
        }



        // Armazena as referencias de valores iniciais
        _resize.element = o;
        _resize.direction = e.target.getAttribute('data-ccw-resize-pointer');
        _resize.idata = _public.GetInterfaceData(o, e);
        _resize.limit = { 'axis': null, 'dim': null };



        // Existindo um elemento que demarque os limites dentro dos quais
        // o objeto a ser redimensionado pode ir...
        if (l != null) {
            _resize.ldata = _public.GetInterfaceData(l);

            var i = _resize.idata;
            var ld = _resize.ldata;


            _resize.limit = {
                'axis': {
                    minY: ld.Y,
                    maxY: ld.Y + ld.H,
                    minX: ld.X,
                    maxX: ld.X + ld.W
                },
                'dim': {
                    // Verifica as dimensões máximas que podem ser definidas em cada direção.
                    maxW: ld.W,
                    maxH: ld.H,
                    minW: 1,
                    minH: 1,
                    maxW_e: ld.W + ld.X - i.X + 1,
                    maxW_w: i.X + i.W - ld.X - 1,
                    maxH_n: i.Y - ld.Y + i.H - 1,
                    maxH_s: ld.H - i.T
                }
            };
        }



        //
        // Verifica configurações especiais como:
        //
        // [data-ccw-resize-max]    "(maxW)px (maxH)px"     Define os valores máximos que o elemento pode vir a ter.
        // [data-ccw-resize-min]    "(maxW)px (maxH)px"     Define os valores mínimos que o elemento pode vir a ter.
        //
        if (o.hasAttribute('data-ccw-resize-max')) {
            var dim = o.getAttribute('data-ccw-resize-max').split(' ');
            if (dim.length == 2) {
                _resize.limit.dim.maxW = parseInt(dim[0].replace('px', ''));
                _resize.limit.dim.maxH = parseInt(dim[1].replace('px', ''));
            }
        }
        if (o.hasAttribute('data-ccw-resize-min')) {
            var dim = o.getAttribute('data-ccw-resize-min').split(' ');
            if (dim.length == 2) {
                _resize.limit.dim.minW = parseInt(dim[0].replace('px', ''));
                _resize.limit.dim.minH = parseInt(dim[1].replace('px', ''));
            }
        }
        if (o.hasAttribute('data-ccw-resize-ratio')) {
            var r = o.getAttribute('data-ccw-resize-ratio').split(':');
            if (r.length == 2) {
                _resize.ratio = { W: r[0], H: r[1] };
            }
        }



        // Verifica se há um evento a ser disparado em conjunto com estes
        if (o.hasAttribute('data-ccw-resize-onactive')) {
            _resize.onActive = o.getAttribute('data-ccw-resize-onactive');
            var onActive = null;


            // Se é um evento global...
            if (_resize.onActive.indexOf('.') == -1) {
                onActive = window[_resize.onActive];
            }
            // senão...
            else {
                var split = _resize.onActive.split('.');
                onActive = window[split[0]];

                // "engatilha" o evento que deve ser disparado...
                for (var i = 1; i < split.length; i++) {
                    onActive = onActive[split[i]];
                }
            }

            _resize.onActive = onActive;
        }



        _bodyContentSelection(false);
        _dom.SetEvent(window, 'mousemove', _resizeOnMouseMove);
        _dom.SetEvent(window, 'mouseup', _stopResizeOnMouseUp);
    };
    /**
    * [SetResizeElement]
    * Recalcula os valores para "W" e "H" do objeto que está sendo redimensionado.
    * a partir da dimensão passada.
    *
    * @private
    *
    * @param {Object}               d                   Objeto da dimensão fixa para o calculo.
    */
    var _resizeCalcRatio = function (d) {

        if (_resize.ratio != null) {

            // Se foi definido um valor para "W", calcula "H"
            if (d.W !== undefined) {
                var nH = (d.W / _resize.ratio.W) * _resize.ratio.H;
                _resize.element.style.height = nH + 'px';
            }
            // Senão, se foi definido um valor para "H", calcula o "W"
            else if (d.H !== undefined) {
                var nW = (d.H / _resize.ratio.H) * _resize.ratio.W;
                _resize.element.style.width = nW + 'px';
            }

        }
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
        var la = _resize.limit.axis;
        var ld = _resize.limit.dim;
        var nT = null;
        var nH = null;



        if (e.clientY > 0 && (la == null || (e.clientY > la.minY))) {
            var i = _resize.idata;

            var difY = (e.clientY - i.icY);
            var difH = 0;

            // Se a posição Y do mouse é menor que a posição inicial...
            // o quadro deve aumentar
            if (e.clientY < i.icY) {
                difH = (difY < 0) ? difY * -1 : difY;
            }
            // Senão, se a posição Y do mouse é maior que a posição inicial...
            // o quadro deve diminuir
            else {
                difH = (difY > 0) ? difY * -1 : difY;
            }


            var nTop = i.T + difY;
            var nHei = i.H + difH;


            if (nHei >= 0 && nTop >= 0) {
                nT = nTop;
                nH = nHei;
            }
        }
        // Verifica se extrapolou o limite
        else {
            if (la != null && (e.clientY < _resize.ldata.Y)) {
                nT = 0;
                nH = ld.maxH_n;
            }
        }



        // Encontrando valores para serem setados...
        if (nT != null && nH != null) {
            // Se há um limites para "H"...
            var sT = true;
            if (ld != null) {
                if (nH > ld.maxH) { nH = ld.maxH; sT = false; }
                else if (nH < ld.minH) { nH = ld.minH; sT = false; }
            }





            _resize.element.style.height = nH + 'px';
            if (sT) {
                _resize.element.style.top = nT + 'px';
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
        var la = _resize.limit.axis;
        var ld = _resize.limit.dim;
        var nL = null;
        var nW = null;



        if (e.clientX > 0 && (la == null || (e.clientX > la.minX))) {
            var i = _resize.idata;

            var difX = (e.clientX - i.icX);
            var difW = 0;

            // Se a posição Y do mouse é menor que a posição inicial...
            // o quadro deve aumentar
            if (e.clientX < i.icX) {
                difW = (difX < 0) ? difX * -1 : difX;
            }
            // Senão, se a posição Y do mouse é maior que a posição inicial...
            // o quadro deve diminuir
            else {
                difW = (difX > 0) ? difX * -1 : difX;
            }

            var nLef = i.L + difX;
            var nWid = i.W + difW;

            if (nWid >= 0 && nLef >= 0) {
                nL = nLef;
                nW = nWid;
            }
        }
        // Verifica se extrapolou o limite
        else {
            if (la != null && (e.clientX < _resize.ldata.X)) {
                nL = 0;
                nW = ld.maxW_w;
            }
        }



        // Encontrando valores para serem setados...
        if (nL != null && nW != null) {
            // Se há um limites para "W"...
            var sL = true;
            if (ld != null) {
                if (nW > ld.maxW) { nW = ld.maxW; sL = false; }
                else if (nW < ld.minW) { nW = ld.minW; sL = false; }
            }


            _resize.element.style.width = nW + 'px';
            if (sL) {
                _resize.element.style.left = nL + 'px';
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
        var i = _resize.idata;
        var la = _resize.limit.axis;
        var ld = _resize.limit.dim;
        var nH = null;


        // Se não há limites "X-Y" definidos, ou se os mesmos não foram extrapolados...
        if (la == null || (e.clientY <= la.maxY)) {
            nH = (i.H + (e.clientY - i.icY));
        }
        // Verifica se extrapolou o limite...
        else if (la != null && (e.clientY > la.maxY)) {
            nH = ld.maxH_s;
        }

        // Apenas se foi possível calcular o novo "H"
        if (nH != null) {
            // Se há um limites para "H"...
            if (ld != null) {
                if (nH > ld.maxH) { nH = ld.maxH; }
                else if (nH < ld.minH) { nH = ld.minH; }
            }

            _resize.element.style.height = nH + 'px';
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
        var i = _resize.idata;
        var la = _resize.limit.axis;
        var ld = _resize.limit.dim;
        var nW = null;


        // Se não há limites "X-Y" definidos, ou se os mesmos não foram extrapolados...
        if (la == null || (e.clientX <= la.maxX)) {
            nW = (i.W + (e.clientX - i.icX));
        }
        // Verifica se extrapolou o limite...
        else if (la != null && (e.clientX > la.maxX)) {
            nW = ld.maxW_e;
        }

        // Apenas se foi possível calcular o novo "W"
        if (nW != null) {
            // Se há um limites para "W"...
            if (ld != null) {
                if (nW > ld.maxW) { nW = ld.maxW; }
                else if (nW < ld.minW) { nW = ld.minW; }
            }

            _resize.element.style.width = nW + 'px';
            _resizeCalcRatio({ W: nW });
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
            _resize.onActive(e);
        }
        if (_resize.crop) {
            _cropOnChangeResize(_resize);
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
        _resize.idata = null;
        _resize.ldata = null;
        _resize.ratio = null;
        _resize.crop = false;


        _bodyContentSelection(true);
    };




















    /**
    * [SetCropCanvas]
    * Prepara os elementos do painel de recorte de imagens.
    *
    * @private
    *
    * @param {Node}                 cropCanvas          Node do crop-canvas.
    */
    var _cropInitiElements = function (cropCanvas) {
        var cropImage = _dom.Get('[data-ccw-crop-img]', cropCanvas)[0];
        var cropResize = _dom.Get('[data-ccw-resize]', cropCanvas)[0];


        // Ajusta o tamanho do canvas conforme o tamanho da imagem no display
        cropCanvas.style.width = cropImage.offsetWidth + 'px';
        cropCanvas.style.height = cropImage.offsetHeight + 'px';


        cropResize.style.backgroundImage = 'url("' + cropImage.src + '")';
        cropResize.style.backgroundRepeat = 'no-repeat';
        cropResize.style.backgroundSize = cropCanvas.style.width + ' ' + cropCanvas.style.height;
        cropResize.style.backgroundPosition = '-' + cropResize.style.left + ' -' + cropResize.style.top;
    };
    /**
    * [SetCropCanvas]
    * Ajusta o background da imagem ao espaço do componente "crop".
    *
    * @private
    *
    * @param {Object}               o                   Objeto "_drag" ou "_resize".
    */
    var _cropOnChangeResize = function (o) {
        var s = o.element.style;
        var nL = parseInt(s.left.replace('px', ''), 10);
        var nT = parseInt(s.top.replace('px', ''), 10);

        s.backgroundPosition = '-' + nL + 'px -' + nT + 'px';
    };




















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var _public = this.Control = {
        /**
        * Retorna um objeto "InterfaceData" com os dados do elemento alvo.
        * Propriedades que não estejam setadas, serão iniciadas.
        *
        * @function GetCoordenates
        *
        * @memberof CodeCraft.Interface
        *
        * @param {Node}                             o                                   Objeto alvo.
        * @param {Event}                            [e]                                 Evento que disparou o evento.
        *
        * @return {InterfaceData}
        */
        GetInterfaceData: function (o, e) {
            if (o.style.top == '') { o.style.top = '0px'; }
            if (o.style.left == '') { o.style.left = '0px'; }
            if (o.style.height == '') { o.style.height = parseInt(o.offsetHeight, 10) + 'px'; }
            if (o.style.width == '') { o.style.width = parseInt(o.offsetWidth, 10) + 'px'; }


            return {
                Y: _public.GetScrollY(o),
                X: _public.GetScrollX(o),
                icY: (e !== undefined) ? e.clientY : null,
                icX: (e !== undefined) ? e.clientX : null,
                T: parseInt(o.style.top.replace('px', '')),
                L: parseInt(o.style.left.replace('px', '')),
                H: parseInt(o.style.height.replace('px', '')),
                W: parseInt(o.style.width.replace('px', ''))
            };
        },





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
        * <div data-ccw-resize="" style="width: 150px; height: 150px; top: 150px; left: 150px;"></div>
        *
        *
        * CSS
        * body {margin: 0; padding: 0;}
        * [data-ccw-resize] {
        *     position: absolute;
        *     z-index: 2;
        * 
        *     border: 1px dashed #000;
        *     box-sizing: border-box;
        * 
        *     background-color: #FFF;
        * }
        * [data-ccw-resize-limit] {
        *     overflow: hidden;
        * }
        * [data-ccw-resize-pointer] {
        *     width: 8px;
        *     height: 8px;
        * 
        *     position: absolute;
        *     z-index: 2;
        *                 
        *     border: 1px solid #000;
        *     box-sizing: border-box;
        *                 
        *     background-color: #FFF;
        * }
        * [data-ccw-resize-pointer="nw"] { left: -4px; top: -4px; cursor: nw-resize; }
        * [data-ccw-resize-pointer="ne"] { top: -4px; right: -4px; cursor: ne-resize; }
        * [data-ccw-resize-pointer="sw"] { bottom: -4px; left: -4px; cursor: sw-resize; }
        * [data-ccw-resize-pointer="se"] { bottom: -4px; right: -4px; cursor: se-resize; }
        * [data-ccw-resize-pointer="n"] { top: -4px; left:calc(50% - 4px); cursor: n-resize; }
        * [data-ccw-resize-pointer="s"] { bottom: -4px; left:calc(50% - 4px); cursor: s-resize; }
        * [data-ccw-resize-pointer="w"] { left: -4px; top:calc(50% - 4px); cursor: w-resize; }
        * [data-ccw-resize-pointer="e"] { right: -4px; top:calc(50% - 4px); cursor: e-resize; }
        *             
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="nw"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="ne"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="sw"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="n"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="s"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="w"],
        * [data-ccw-resize-ratio] [data-ccw-resize-pointer="e"] {display: none;}
        * 
        */
        SetResizeElement: function () {
            var resizes = _dom.Get('[data-ccw-resize]');

            if (resizes != null) {
                _dom.SetEvent(window, 'mouseup', _stopResizeOnMouseUp);


                // Para cada item marcado como redimensionável...
                for (var it in resizes) {
                    var tgt = resizes[it];
                    var pointers = _dom.Get('[data-ccw-resize-pointer]', tgt);


                    // Estando o redimensionamento marcado como "fixo"...
                    if (tgt.hasAttribute('data-ccw-resize-fix')) {
                        var dim = tgt.getAttribute('data-ccw-resize-fix').split(' ');
                        if (dim.length == 2) {
                            tgt.style.width = dim[0];
                            tgt.style.height = dim[1];
                        }
                    }
                    else {

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
        },





        /**
        * Utilizando os eventos "SetDragElement" e "SetResizeElement" cria um painel onde
        * uma imagem possa ser "recortada".
        * Este método limita-se a gerar a interface para o recorte da imagem. O corte real
        * deve ser feito por recursos server-side.
        *
        * @function SetCropCanvas
        *
        * @memberof CodeCraft.Interface
        *
        * CSS
        * [data-ccw-crop-canvas] {overflow: hidden; text-align: center; margin: 0 auto;}
        * [data-ccw-crop-img] {
        *     max-width: 100%;
        *     max-height: 100%;
        * 
        *     position: absolute;
        *     top: 0;
        *     left: 0;
        *     z-index: 1;
        *
        *     box-sizing: border-box;
        * }
        * [data-ccw-crop-shadow] {
        *     width: 100%;
        *     height: 100%;
        *                 
        *     position: relative;
        *     z-index: 1;
        * 
        *     background-color: #000;
        *     opacity: .6;
        * }
        * 
        */
        SetCropCanvas: function () {
            var crops = _dom.Get('[data-ccw-crop-canvas]');

            // Apenas se houver algum node de crop
            if (crops != null) {
                for (var it in crops) {
                    _cropInitiElements(crops[it]);
                }
            }

            _public.SetDragElement();
            _public.SetResizeElement();
        },




















        /**
        * Gera uma instância "Popup".
        *
        * @constructs
        *
        * @memberof CodeCraft.Interface
        *
        * @param {String}                       url                                     Url da página a ser aberta.
        * @param {String}                       pName                                   Nome de controle do popup.
        * @param {Boolean}                      [scroll = false]                        Indica se roladem deve ou não estar habilitada.
        * @param {Boolean}                      [resize = true]                         Indica se a janela deve poder ser redimensionada.
        */
        Popup: function (url, pName, scroll, resize) {


            // URL que será aberta.
            var _url = url;
            // Identificador do popup.
            var _pName = pName;
            // Se "true" indica que a rolagem está habilitada.
            var _srll = (scroll == undefined) ? 'yes' : scroll;
            // Se "false" indica que não será possível redimensionar a janela.
            var _rsze = (resize == undefined) ? 'yes' : resize;


            // Altura total em pixels da tela do usuário.
            var _sH = screen.height;
            // Largura total em pixels da tela do usuário.
            var _sW = screen.width;


            // Altura do popup.
            var _h = parseInt(_sH / 2);
            // Largura do popup.
            var _w = parseInt(_sW / 2);


            // Posição em pixels que o popup deve aparecer em relação ao topo da tela do usuário.
            var _t = parseInt((_sH - _h) / 2);
            // Posição em pixels que o popup deve aparecer em relação a margem esquerda da tela do usuário.
            var _l = parseInt((_sW - _w) / 2);


            // Se "true", o popup será dimensionado para o tamanho total da tela do usuário.
            var _max = false;
            // Se "true" indica que o popup será posicionado no centro da tela do usuário.
            var _cen = true;



            /**
            * Verifica valores de Posicionamento e dimenções conforme atributos setados.
            * 
            * @function _checkAttributes
            *
            * @memberof Popup
            *
            * @private
            */
            var _checkAttributes = function () {
                if (_max) {
                    _h = _sH;
                    _w = _sW;
                }
                if (_cen) {
                    _t = parseInt((_sH - _h) / 2);
                    _l = parseInt((_sW - _w) / 2);
                }
            };





            /**
            * Permite definir as dimensões do Popup.
            * 
            * @function Dimension
            *
            * @memberof Popup
            *
            * @param {Boolean}                      max                             Use "true" para definir que o popup deve ocupar todo tamanho da tela.
            * @param {Integer}                      [w]                             Tamanho em px da largura do popup.
            * @param {Integer}                      [h]                             Tamanho em px da altura do popup.
            */
            this.Dimension = function (max, w, h) {
                _max = max;
                _w = w;
                _h = h;
            };

            /**
            * Define a Posição do Popup na Tela.
            * 
            * @function Position
            *
            * @memberof Popup
            *
            * @param {Boolean}                      isCenter                        Use "true" para definir que o popup deve surgir centralizado.
            * @param {Integer}                      [t]                             Distancia em px que o popup deve estar do topo da tela.
            * @param {Integer}                      [l]                             Distancia em px que o popup deve estar da margem esquerda da tela.
            */
            this.Position = function (isCenter, t, l) {
                _cen = isCenter;
                _t = t;
                _l = l;
            };

            /**
            * Executa a abertura do Popup.
            * 
            * @function Open
            *
            * @memberof Popup
            */
            this.Open = function () {
                _checkAttributes();
                window.open(_url, _pName, ('width=' + _w + ', height=' + _h + ', ' + 'top=' + _t + ', left=' + _l + ', ' + 'scrollbars=' + _srll + ', resizable=' + _rsze));
            };

        },





        /**
        * Automatiza a abertura de popups a partir da configuração do atributo "[data-ccw-popup]" nos links.
        * Procura pelos links(anchor) cujo atributo [data-ccw-popup] esteja setado e adiciona
        * nos mesmos um evento onclick para abrir seu respectivo link em um popup.
        * 
        * @function SetAnchorPopup
        *
        * @memberof CodeCraft.Interface
        *
        * @example Exemplo de configuração de um "a".
        * <a href="http://www.aeondigital.com.br" 
        *    data-ccw-popup="NomeDaJanela,Scroll,Resize,Width,Heigth">Abre popup</a>
        *
        * Scroll        {String}            Aceita apenas yes|no
        * Resize        {String}            Aceita apenas yes|no
        * [Width]       {Integer}           Largura do popup em px.
        * [Heigth]      {Integer}           Altura do popup em px.
        */
        SetAnchorPopup: function () {

            // Evento que será disparado quando o link for clicado
            var _popupOpenWindow = function (e) {
                e.preventDefault();

                var url = this.href;
                var cfg = this.getAttribute('data-ccw-popup').split(',');

                var pop = 'InsidePopup=true';
                url += (url.indexOf('?') == -1) ? '?' + pop : '&' + pop;

                var oPop = new CodeCraft.Interface.Popup(url, cfg[0], cfg[1], cfg[2]);
                if (cfg.length == 5) {
                    oPop.Dimension(false, cfg[3], cfg[4]);
                }

                oPop.Position(true, 0, 0);
                setTimeout(function () { oPop.Open(); }, 10);
            };


            var ancs = document.getElementsByTagName('a');

            // Para cada Anchor com ID setado
            for (var i = 0; i < ancs.length; i++) {
                var a = ancs[i];

                if (a.hasAttribute('data-ccw-popup')) {
                    a.addEventListener('click', _popupOpenWindow, false);
                }
            }
        }

    };


    return _public;
});