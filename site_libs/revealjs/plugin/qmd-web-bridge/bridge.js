/* qmd web preview bridge (reveal.js plugin).

   qmd web shows a project's published decks in its preview. A page cannot
   see into a frame from another site, so the deck itself says where it is:
   which deck and which slide, when it loads and when the reader moves. The
   editor then selects the same slide, or opens the deck a link led to.

   - It does nothing unless the deck is shown inside a frame, so readers who
     open the site normally run nothing of it.
   - It sends only the deck's path and slide index, and takes only "go to
     slide n" and "go back", so any page that frames the deck may use it.
   - qmd_editor's local server adds its own bridge to the decks it serves;
     this one then stands aside. So does a deck inside a peek window.

   Same messages as qmd_editor's static/js/preview-bridge.js (channel
   qmd-preview-v1), navigation part. Enable it in a project with
   `revealjs-plugins: [qmd-web]` in _quarto.yml or _metadata.yml. */
window.QmdWebBridge = function(){
  'use strict';
  const CHANNEL = 'qmd-preview-v1';
  const ARM_MS = 1000;

  function framed(){
    try{ return window.parent !== window; }catch(e){ return true; }
  }
  function start(deck){
    if(document.querySelector('script[data-qmd-preview-bridge]')) return;   // qmd_editor's
    if(new URLSearchParams(location.search).has('peek-embed')) return;       // a peek window
    const send = (type, detail = {}) => {
      window.parent.postMessage({channel: CHANNEL, type, ...detail}, '*');
    };
    const current = () => { try{ return deck.getIndices().h; }catch(e){ return undefined; } };

    /* Only the reader's own navigation may move the editor's selection: a
       goto from the editor, or reveal.js correcting itself on a broken deck,
       changes the slide too. Each input gesture arms one report; any other
       change is reported with user:false, which the editor ignores. */
    let armedUntil = 0;
    const arm = () => { armedUntil = Date.now() + ARM_MS; };
    ['keydown', 'pointerdown', 'click', 'touchstart', 'touchend', 'wheel'].forEach(type => {
      window.addEventListener(type, arm, {capture: true, passive: true});
    });
    function reportSlide(){
      const user = Date.now() <= armedUntil;
      armedUntil = 0;
      send('slide', {index: current(), user});
    }
    function gotoSlide(index){
      if(deck.isScrollView && deck.isScrollView()){
        document.querySelectorAll('.slides .scroll-page')[index]?.scrollIntoView({block: 'start'});
      }else{
        deck.slide(index);
      }
    }

    window.addEventListener('message', event => {
      if(event.source !== window.parent || event.data?.channel !== CHANNEL) return;
      if(event.data.type === 'goto' && Number.isInteger(event.data.index)){
        if(deck.isReady()) gotoSlide(event.data.index);
        else deck.on('ready', () => gotoSlide(event.data.index));
      }else if(event.data.type === 'back'){
        history.back();
      }
    });
    // The editor's focus-mode keys work while the preview has the focus
    window.addEventListener('keydown', event => {
      if(event.key === 'Enter' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey){
        event.preventDefault();
        event.stopPropagation();
        send('shortcut', {action: 'toggle-chrome'});
      }else if(event.key === 'Escape'){
        send('shortcut', {action: 'show-chrome'});
      }
    }, true);

    const announce = () => {
      send('document', {path: location.pathname, slide: current(), slides: deck.getHorizontalSlides().length});
      deck.on('slidechanged', reportSlide);
      send('slide', {index: current(), user: false});
    };
    if(deck.isReady()) announce();
    else deck.on('ready', announce);
  }

  return {
    id: 'qmd-web-bridge',
    init(deck){
      if(!framed()) return;
      // after parsing, when qmd_editor's injected bridge (end of body) is visible
      if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', () => start(deck), {once: true});
      }else{
        start(deck);
      }
    },
  };
};
