window.addEventListener("load",()=>{const e=()=>{var e=document.body.style;e.width="100%",e.overflow="hidden",btf.animateIn(document.getElementById("search-mask"),"to_show 0.5s"),btf.animateIn(document.querySelector("#algolia-search .search-dialog"),"titleScale 0.5s"),setTimeout(()=>{document.querySelector("#algolia-search .ais-SearchBox-input").focus()},100),document.addEventListener("keydown",function e(t){"Escape"===t.code&&(a(),document.removeEventListener("keydown",e))})},a=()=>{var e=document.body.style;e.width="",e.overflow="",btf.animateOut(document.querySelector("#algolia-search .search-dialog"),"search_close .5s"),btf.animateOut(document.getElementById("search-mask"),"to_hide 0.5s")},t=()=>{document.querySelector("#search-button > .search").addEventListener("click",e)};const i=e=>{if(""===e)return"";var t=e.indexOf("<mark>");let a=t-30,i=t+120,n="",s="";return a<=0?(a=0,i=140):n="...",i>e.length?i=e.length:s="...",n+e.substring(a,i)+s};var n=GLOBAL_CONFIG.algolia;if(!(n.appId&&n.apiKey&&n.indexName))return console.error("Algolia setting is invalid!");var n=instantsearch({indexName:n.indexName,searchClient:algoliasearch(n.appId,n.apiKey),searchFunction(e){e.state.query&&e.search()}}),s=instantsearch.widgets.configure({hitsPerPage:5}),l=instantsearch.widgets.searchBox({container:"#algolia-search-input",showReset:!1,showSubmit:!1,placeholder:GLOBAL_CONFIG.algolia.languages.input_placeholder,showLoadingIndicator:!0}),o=instantsearch.widgets.hits({container:"#algolia-hits",templates:{item(e){var t=e.permalink||GLOBAL_CONFIG.root+e.path,e=e._highlightResult,a=e.contentStripTruncate?i(e.contentStripTruncate.value):e.contentStrip?i(e.contentStrip.value):e.content?i(e.content.value):"";return`
          <a href="${t}" class="algolia-hit-item-link">
          ${e.title.value||"no-title"}
          </a>
          <p class="algolia-hit-item-content">${a}</p>`},empty:function(e){return'<div id="algolia-hits-empty">'+GLOBAL_CONFIG.algolia.languages.hits_empty.replace(/\$\{query}/,e.query)+"</div>"}}}),r=instantsearch.widgets.stats({container:"#algolia-info > .algolia-stats",templates:{text:function(e){return"<hr>"+GLOBAL_CONFIG.algolia.languages.hits_stats.replace(/\$\{hits}/,e.nbHits).replace(/\$\{time}/,e.processingTimeMS)}}}),c=instantsearch.widgets.poweredBy({container:"#algolia-info > .algolia-poweredBy"}),d=instantsearch.widgets.pagination({container:"#algolia-pagination",totalPages:5,templates:{first:'<i class="fas fa-angle-double-left"></i>',last:'<i class="fas fa-angle-double-right"></i>',previous:'<i class="fas fa-angle-left"></i>',next:'<i class="fas fa-angle-right"></i>'}});n.addWidgets([s,l,o,r,c,d]),n.start(),t(),document.getElementById("search-mask").addEventListener("click",a),document.querySelector("#algolia-search .search-close-button").addEventListener("click",a),window.addEventListener("pjax:complete",()=>{"block"===getComputedStyle(document.querySelector("#algolia-search .search-dialog")).display&&a(),t()}),window.pjax&&n.on("render",()=>{window.pjax.refresh(document.getElementById("algolia-hits"))})});