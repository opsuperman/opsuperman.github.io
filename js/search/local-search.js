class LocalSearch{constructor({path:e="",unescape:t=!1,top_n_per_article:n=1}){this.path=e,this.unescape=t,this.top_n_per_article=n,this.isfetched=!1,this.datas=null}getIndexByWord(e,s,a=!1){const i=[],o=new Set;return a||(s=s.toLowerCase()),e.forEach(t=>{this.unescape&&((e=document.createElement("div")).innerText=t,t=e.innerHTML);var e,n=t.length;if(0!==n){let e=0;var r;for(a||(t=t.toLowerCase());-1<(r=s.indexOf(t,e));)i.push({position:r,word:t}),o.add(t),e=r+n}}),i.sort((e,t)=>e.position!==t.position?e.position-t.position:t.word.length-e.word.length),[i,o]}mergeIntoSlice(e,t,n){var r;let{position:s,word:a}=n[0];for(var i=[],o=new Set;s+a.length<=t&&0!==n.length;){o.add(a),i.push({position:s,length:a.length});var l=s+a.length;for(n.shift();0!==n.length&&(r=n[0],s=r.position,a=r.word,l>s);)n.shift()}return{hits:i,start:e,end:t,count:o.size}}highlightKeyword(e,t){let n="",r=t.start;for(var{position:s,length:a}of t.hits)n+=e.substring(r,s),r=s+a,n+=`<mark class="search-keyword">${e.substr(s,a)}</mark>`;return n+=e.substring(r,t.end)}getResultItems(u){const g=[];return this.datas.forEach(({title:n,content:r,url:s})=>{var[a,i]=this.getIndexByWord(u,n),[o,l]=this.getIndexByWord(u,r),i=new Set([...i,...l]).size,l=a.length+o.length;if(0!==l){var h=[];0!==a.length&&h.push(this.mergeIntoSlice(0,n.length,a));let e=[];for(;0!==o.length;){var c=o[0]["position"],d=Math.max(0,c-20),c=Math.min(r.length,c+100);e.push(this.mergeIntoSlice(d,c,o))}e.sort((e,t)=>e.count!==t.count?t.count-e.count:e.hits.length!==t.hits.length?t.hits.length-e.hits.length:e.start-t.start);a=parseInt(this.top_n_per_article,10);0<=a&&(e=e.slice(0,a));let t="";(s=new URL(s,location.origin)).searchParams.append("highlight",u.join(" ")),t+=0!==h.length?`<div class="local-search-hit-item"><a href="${s.href}"><span class="search-result-title">${this.highlightKeyword(n,h[0])}</span>`:`<div class="local-search-hit-item"><a href="${s.href}"><span class="search-result-title">${n}</span>`,e.forEach(e=>{t+=`<p class="search-result">${this.highlightKeyword(r,e)}...</p></a>`}),t+="</div>",g.push({item:t,id:g.length,hitCount:l,includedCount:i})}}),g}fetchData(){const t=!this.path.endsWith("json");fetch(this.path).then(e=>e.text()).then(e=>{this.isfetched=!0,this.datas=t?[...(new DOMParser).parseFromString(e,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,content:e.querySelector("content").textContent,url:e.querySelector("url").textContent})):JSON.parse(e),this.datas=this.datas.filter(e=>e.title).map(e=>(e.title=e.title.trim(),e.content=e.content?e.content.trim().replace(/<[^>]+>/g,""):"",e.url=decodeURIComponent(e.url).replace(/\/{2,}/g,"/"),e)),window.dispatchEvent(new Event("search:loaded"))})}highlightText(t,e,n){var r=t.nodeValue;let s=e.start;var a,i,o=[];for({position:a,length:i}of e.hits){var l=document.createTextNode(r.substring(s,a)),h=(s=a+i,document.createElement("mark"));h.className=n,h.appendChild(document.createTextNode(r.substr(a,i))),o.push(l,h)}t.nodeValue=r.substring(s,e.end),o.forEach(e=>{t.parentNode.insertBefore(e,t)})}highlightSearchWords(e){var t=new URL(location.href).searchParams.get("highlight");const n=t?t.split(" "):[];if(n.length&&e){for(var r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null),s=[];r.nextNode();)r.currentNode.parentNode.matches("button, select, textarea, .mermaid")||s.push(r.currentNode);s.forEach(e=>{var[t]=this.getIndexByWord(n,e.nodeValue);t.length&&(t=this.mergeIntoSlice(0,e.nodeValue.length,t),this.highlightText(e,t,"search-keyword"))})}}}window.addEventListener("load",()=>{const{path:e,top_n_per_article:t,unescape:n,languages:s}=GLOBAL_CONFIG.localSearch,a=new LocalSearch({path:e,top_n_per_article:t,unescape:n}),i=document.querySelector("#local-search-input input"),o=document.getElementById("local-search-stats-wrap"),l=document.getElementById("loading-status"),h=!e.endsWith("json"),r=()=>{if(a.isfetched){let e=i.value.trim().toLowerCase();""!==(e=h?e.replace(/</g,"&lt;").replace(/>/g,"&gt;"):e)&&(l.innerHTML='<i class="fas fa-spinner fa-pulse"></i>');var n=e.split(/[-\s]+/),r=document.getElementById("local-search-results");let t=[];0<e.length&&(t=a.getResultItems(n)),1===n.length&&""===n[0]?(r.textContent="",o.textContent=""):0===t.length?(r.textContent="",(n=document.createElement("div")).className="search-result-stats",n.textContent=s.hits_empty.replace(/\$\{query}/,e),o.innerHTML=n.outerHTML):(t.sort((e,t)=>e.includedCount!==t.includedCount?t.includedCount-e.includedCount:e.hitCount!==t.hitCount?t.hitCount-e.hitCount:t.id-e.id),n=s.hits_stats.replace(/\$\{hits}/,t.length),r.innerHTML=`<div class="search-result-list">${t.map(e=>e.item).join("")}</div>`,o.innerHTML=`<hr><div class="search-result-stats">${n}</div>`,window.pjax&&window.pjax.refresh(r)),l.textContent=""}};let c=!1;const d=document.getElementById("search-mask"),u=document.querySelector("#local-search .search-dialog"),g=()=>{window.innerWidth<768&&u.style.setProperty("--search-height",window.innerHeight+"px")},p=()=>{var e=document.body.style;e.width="100%",e.overflow="hidden",btf.animateIn(d,"to_show 0.5s"),btf.animateIn(u,"titleScale 0.5s"),setTimeout(()=>{i.focus()},300),c||(a.isfetched||a.fetchData(),i.addEventListener("input",r),c=!0),document.addEventListener("keydown",function e(t){"Escape"===t.code&&(m(),document.removeEventListener("keydown",e))}),g(),window.addEventListener("resize",g)},m=()=>{var e=document.body.style;e.width="",e.overflow="",btf.animateOut(u,"search_close .5s"),btf.animateOut(d,"to_hide 0.5s"),window.removeEventListener("resize",g)},f=()=>{btf.addEventListenerPjax(document.querySelector("#search-button > .search"),"click",p)};window.addEventListener("search:loaded",()=>{var e=document.getElementById("loading-database");e.nextElementSibling.style.display="block",e.remove()}),f(),document.querySelector("#local-search .search-close-button").addEventListener("click",m),d.addEventListener("click",m),GLOBAL_CONFIG.localSearch.preload&&a.fetchData(),a.highlightSearchWords(document.getElementById("article-container")),window.addEventListener("pjax:complete",()=>{btf.isHidden(d)||m(),a.highlightSearchWords(document.getElementById("article-container")),f()})});