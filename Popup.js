/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module Popup
* @file Classe Popup.
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/







// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };
if(typeof(CodeCraft.Interface) === 'undefined') { CodeCraft.Interface = {}; }





/**
* Adiciona um novo método em CodeCraft.Interface para lidar com Popups.
*
* @class Interface
*
* @memberof CodeCraft.Interface
*
* @static
*
* @type {Class}
*/
(function () {





    /** 
    * Instâncias para manipulação de popups.
    *
    * @class Popup
    *
    * @memberof CodeCraft.Interface
    *
    * @type {Class}
    *
    * @property {Function}                      Dimension                           Permite definir as dimensões do Popup.
    * @property {Function}                      Position                            Define a Posição do Popup na Tela.
    * @property {Function}                      Open                                Executa a abertura do Popup.
    */





    var nMethods = {
        /**
        * Gera uma instância "Popup".
        *
        * @constructs
        *
        * @memberof CodeCraft.Interface.Popup
        *
        * @param {String}                           url                                 Url da página a ser aberta.
        * @param {String}                           pName                               Nome de controle do popup.
        * @param {Boolean}                          [scroll = false]                    Indica se roladem deve ou não estar habilitada.
        * @param {Boolean}                          [resize = true]                     Indica se a janela deve poder ser redimensionada.
        */
        Popup : function (url, pName, scroll, resize) {




            /**
            * URL que será aberta.
            *
            * @type {String}
            *
            * @memberof Popup
            *
            * @private
            */
            var _url = url;

            /**
            * Identificador do popup.
            *
            * @type {String}
            *
            * @memberof Popup
            *
            * @private
            */
            var _pName = pName;

            /**
            * Se "true" indica que a rolagem está habilitada.
            *
            * @type {String}
            *
            * @memberof Popup
            *
            * @private
            */
            var _srll = (scroll == undefined) ? 'yes' : scroll;

            /**
            * Se "false" indica que não será possível redimensionar a janela.
            *
            * @type {String}
            *
            * @memberof Popup
            *
            * @private
            */
            var _rsze = (resize == undefined) ? 'yes' : resize;





            /**
            * Altura total em pixels da tela do usuário.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _sH = screen.height;

            /**
            * Largura total em pixels da tela do usuário.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _sW = screen.width;

            /**
            * Altura do popup.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _h = parseInt(_sH / 2);

            /**
            * Largura do popup.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _w = parseInt(_sW / 2);

            /**
            * Posição em pixels que o popup deve aparecer em relação ao topo da tela do usuário.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _t = parseInt((_sH - _h) / 2);

            /**
            * Posição em pixels que o popup deve aparecer em relação a margem esquerda da tela do usuário.
            *
            * @type {Integer}
            *
            * @memberof Popup
            *
            * @private
            */
            var _l = parseInt((_sW - _w) / 2);





            /**
            * Se "true", o popup será dimensionado para o tamanho total da tela do usuário.
            *
            * @type {Boolean}
            *
            * @memberof Popup
            *
            * @private
            */
            var _max = false;

            /**
            * Se "true" indica que o popup será posicionado no centro da tela do usuário.
            *
            * @type {Boolean}
            *
            * @memberof Popup
            *
            * @private
            */
            var _cen = true;





            /**
            * Verifica valores de Posicionamento e dimenções conforme atributos setados.
            * 
            * @function CheckAttributes
            *
            * @memberof Popup
            *
            * @private
            */
            var CheckAttributes = function () {
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
                CheckAttributes();
                window.open(_url, _pName, ('width=' + _w + ', height=' + _h + ', ' + 'top=' + _t + ', left=' + _l + ', ' + 'scrollbars=' + _srll + ', resizable=' + _rsze));
            };

        },



        /**
        * Automatiza a abertura de popups a partir da configuração do atributo "data-popup" nos links.
        * Procura pelos links(anchor) cujo atributo "data-popup" esteja setado e adiciona
        * nos mesmos um evento onclick para abrir seu respectivo link em um popup.
        * 
        * @function AutoOpenPopup
        *
        * @memberof CodeCraft.Interface.Popup
        *
        * @example Exemplo de configuração de um "a".
        * <a href="http://www.aeondigital.com.br" 
        *    data-popup="NomeDaJanela,Scroll,Resize,Width,Heigth">Abre popup</a>
        *
        * Scroll        {String}            Aceita apenas yes|no
        * Resize        {String}            Aceita apenas yes|no
        * [Width]       {Integer}           Largura do popup em px.
        * [Heigth]      {Integer}           Altura do popup em px.
        */
        AutoOpenPopup : function () {
            var ancs = document.getElementsByTagName('a');

            for (var i = 0; i < ancs.length; i++) {
                var a = ancs[i];

                if (a.hasAttribute('data-popup')) {
                    var evt_OpenPopup = function (e) {
                        var url = this.href;
                        var cfg = this.getAttribute('data-popup').split(',');

                        var pop = 'InsidePopup=true';
                        url += (url.indexOf('?') == -1) ? '?' + pop : '&' + pop;

                        var oPop = new CodeCraft.Interface.Popup(url, cfg[0], cfg[1], cfg[2]);
                        if (cfg.length == 5) {
                            oPop.Dimension(false, cfg[3], cfg[4]);
                        }

                        oPop.Position(true, 0, 0);
                        setTimeout(function () { oPop.Open(); }, 10);

                        e.preventDefault();
                    };

                    a.addEventListener('click', evt_OpenPopup, false);
                }
            }
        }

    };





    // Adiciona métodos locais aos métodos do objeto Interface
    for (var it in nMethods) { CodeCraft.Interface[it] = nMethods[it]; }
})();