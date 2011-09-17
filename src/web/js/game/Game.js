/*
Game.js
Game module, handles sections of game.
*/

define(["order!lib/Three",
        "order!lib/ThreeExtras",
        "game/sections/launcher/Launcher"],
function() {
    var shared = require('utils/Shared'),
        launcher = require('game/sections/launcher/Launcher'),
        domElement = shared.gameContainer,
        renderer, renderTarget, sections, sectionNames, currentSection, paused = true;
    
    /*===================================================
    
    internal init
    
    =====================================================*/
    
    // init three 
    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x000000, clearAlpha: 0 } );
    renderer.setSize( shared.screenWidth, shared.screenHeight );
    renderer.sortObjects = false;
    renderer.autoClear = false;
    
    // render target
    renderTarget = new THREE.WebGLRenderTarget( shared.screenWidth, shared.screenHeight );
    //renderTarget.minFilter = THREE.LinearFilter;
    //renderTarget.magFilter = THREE.NearestFilter;
    
    // add to game dom element
    domElement.append( renderer.domElement );
    
    // store sections
    sections = {
        launcher : launcher
    };
    sectionNames = ['launcher'];
    
    // share
    shared.renderer = renderer;
    shared.renderTarget = renderTarget;
    
    // resize listener
    shared.signals.windowresized.add(resize);
    
    /*===================================================
    
    external init
    
    =====================================================*/

    function init() {
        var i, l;
        
        // init each section
        for (i = 0, l = sectionNames.length; i < l; i += 1) {
            sections[sectionNames[i]].init();
        }
        
        // set initial section
        set_section(sections.launcher);
        
        start_updating();
        
    }
    
    /*===================================================
    
    functions
    
    =====================================================*/

    function set_section ( section ) {
        // hide current section
        if (typeof currentSection !== 'undefined') {
            currentSection.hide();
        }
        
        // show new section
        section.show();
        
        // store new as current
        currentSection = section;
    }
    
    function start_updating () {
        if (paused === true) {
            paused = false;
            update();
        }
    }
    
    function stop_updating () {
        paused = true;
    }
    
    function update () {
        if (paused === false) {
            window.requestAnimFrame( update );
            
            if (typeof currentSection !== 'undefined') {
                currentSection.update();
            }
        }
    }
    
    function resize( W, H ) {
        // resize game container
        domElement.width(W).height(H);
        
        // resize three
        renderer.setSize( W, H );
        renderTarget.width = W;
        renderTarget.height = H;
    }

    // return something to define module
    return {
        init: init,
        start_updating: start_updating,
        stop_updating: stop_updating,
        domElement: domElement,
        paused: function () { return paused; }
    };
});