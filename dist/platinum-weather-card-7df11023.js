/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t=function(e,i){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])},t(e,i)};function e(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function s(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(s.prototype=i.prototype,new s)}var i=function(){return i=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var o in e=arguments[i])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},i.apply(this,arguments)};function s(t,e,i,s){var o,n=arguments.length,a=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}function o(t){var e="function"==typeof Symbol&&Symbol.iterator,i=e&&t[e],s=0;if(i)return i.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&s>=t.length&&(t=void 0),{value:t&&t[s++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),r=new Map;class l{constructor(t,e){if(this._$cssResult$=!0,e!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=r.get(this.cssText);return n&&void 0===t&&(r.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const c=t=>new l("string"==typeof t?t:t+"",a),h=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new l(i,a)},d=(t,e)=>{n?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=window.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))},u=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return c(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var _;const g=window.trustedTypes,m=g?g.emptyScript:"",p=window.reactiveElementPolyfillSupport,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:f};class $ extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;null!==(e=this.l)&&void 0!==e||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Eh(i,e);void 0!==s&&(this._$Eu.set(s,i),t.push(s))})),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(u(t))}else void 0!==t&&e.push(u(t));return e}static _$Eh(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$Eg)&&void 0!==e?e:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$Eg)||void 0===e||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ES(t,e,i=y){var s,o;const n=this.constructor._$Eh(t,i);if(void 0!==n&&!0===i.reflect){const a=(null!==(o=null===(s=i.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==o?o:v.toAttribute)(e,i.type);this._$Ei=t,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$Ei=null}}_$AK(t,e){var i,s,o;const n=this.constructor,a=n._$Eu.get(t);if(void 0!==a&&this._$Ei!==a){const t=n.getPropertyOptions(a),r=t.converter,l=null!==(o=null!==(s=null===(i=r)||void 0===i?void 0:i.fromAttribute)&&void 0!==s?s:"function"==typeof r?r:null)&&void 0!==o?o:v.fromAttribute;this._$Ei=a,this[a]=l(e,t.type),this._$Ei=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||f)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,e)=>this[e]=t)),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$Eg)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,e)=>this._$ES(e,this[e],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var x;$.finalized=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:$}),(null!==(_=globalThis.reactiveElementVersions)&&void 0!==_?_:globalThis.reactiveElementVersions=[]).push("1.2.1");const b=globalThis.trustedTypes,w=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,S=`lit$${(Math.random()+"").slice(9)}$`,N="?"+S,A=`<${N}>`,E=document,O=(t="")=>E.createComment(t),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,k=/>/g,P=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,D=/'/g,F=/"/g,R=/^(?:script|style|textarea)$/i,U=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),z=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),H=new WeakMap,V=E.createTreeWalker(E,129,null,!1),j=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",a=C;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===C?"!--"===l[1]?a=L:void 0!==l[1]?a=k:void 0!==l[2]?(R.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=P):void 0!==l[3]&&(a=P):a===P?">"===l[0]?(a=null!=o?o:C,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?P:'"'===l[3]?F:D):a===F||a===D?a=P:a===L||a===k?a=C:(a=P,o=void 0);const d=a===P&&t[e+1].startsWith("/>")?" ":"";n+=a===C?i+A:c>=0?(s.push(r),i.slice(0,c)+"$lit$"+i.slice(c)+S+d):i+S+(-2===c?(s.push(void 0),e):d)}const r=n+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(r):r,s]};class I{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[l,c]=j(t,e);if(this.el=I.createElement(l,i),V.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=V.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(S)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(S),e=/([.?@])?(.*)/.exec(i);r.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?X:"@"===e[1]?Y:q})}else r.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(R.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=b?b.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),V.nextNode(),r.push({type:2,index:++o});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===N)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)r.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function B(t,e,i=t,s){var o,n,a,r;if(e===z)return e;let l=void 0!==s?null===(o=i._$Cl)||void 0===o?void 0:o[s]:i._$Cu;const c=M(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(a=(r=i)._$Cl)&&void 0!==a?a:r._$Cl=[])[s]=l:i._$Cu=l),void 0!==l&&(e=B(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);V.currentNode=o;let n=V.nextNode(),a=0,r=0,l=s[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new Z(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new Q(n,this,t)),this.v.push(e),l=s[++r]}a!==(null==l?void 0:l.index)&&(n=V.nextNode(),a++)}return o}m(t){let e=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,s){var o;this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cg=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=B(this,t,e),M(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==z&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):(t=>{var e;return T(t)||"function"==typeof(null===(e=t)||void 0===e?void 0:e[Symbol.iterator])})(t)?this.A(t):this.$(t)}M(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=t:this.S(E.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=I.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.m(i);else{const t=new K(o,this),e=t.p(this.options);t.m(i),this.S(e),this._$AH=t}}_$AC(t){let e=H.get(t.strings);return void 0===e&&H.set(t.strings,e=new I(t)),e}A(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Z(this.M(O()),this.M(O()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cg=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class q{constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=B(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==z,n&&(this._$AH=t);else{const s=t;let a,r;for(t=o[0],a=0;a<o.length-1;a++)r=B(this,s[i+a],e,a),r===z&&(r=this._$AH[a]),n||(n=!M(r)||r!==this._$AH[a]),r===W?t=W:t!==W&&(t+=(null!=r?r:"")+o[a+1]),this._$AH[a]=r}n&&!s&&this.k(t)}k(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends q{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===W?void 0:t}}const J=b?b.emptyScript:"";class X extends q{constructor(){super(...arguments),this.type=4}k(t){t&&t!==W?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class Y extends q{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=B(this,t,e,0))&&void 0!==i?i:W)===z)return;const s=this._$AH,o=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){B(this,t)}}const tt=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,it;null==tt||tt(I,Z),(null!==(x=globalThis.litHtmlVersions)&&void 0!==x?x:globalThis.litHtmlVersions=[]).push("2.1.2");class st extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let a=n._$litPart$;if(void 0===a){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=a=new Z(e.insertBefore(O(),t),t,void 0,null!=i?i:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return z}}st.finalized=!0,st._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:st});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:st}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){window.customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,at=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function rt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):at(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function lt(t){return rt({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=({finisher:t,descriptor:e})=>(i,s)=>{var o;if(void 0===s){const s=null!==(o=i.originalKey)&&void 0!==o?o:i.key,n=null!=e?{kind:"method",placement:"prototype",key:s,descriptor:e(i.key)}:{...i,key:s};return null!=t&&(n.finisher=function(e){t(e,s)}),n}{const o=i.constructor;void 0!==e&&Object.defineProperty(i,s,e(s)),null==t||t(o,s)}}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var ht;const dt=null!=(null===(ht=window.HTMLSlotElement)||void 0===ht?void 0:ht.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function ut(t){const{slot:e,selector:i}=null!=t?t:{};return ct({descriptor:s=>({get(){var s;const o="slot"+(e?`[name=${e}]`:":not([name])"),n=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(o),a=null!=n?dt(n,t):[];return i?a.filter((t=>t.matches(i))):a},enumerable:!0,configurable:!0})})}var _t,gt,mt=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"})};!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(_t||(_t={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gt||(gt={}));var pt=function(t){if(t.time_format===gt.language||t.time_format===gt.system){var e=t.time_format===gt.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===gt.am_pm},vt=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:pt(t)?"numeric":"2-digit",minute:"2-digit",hour12:pt(t)})},ft=function(t){return new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hour12:pt(t)})},yt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o};const $t=t=>t.locale||{language:t.language,number_format:_t.system};const xt=(t,e,i)=>{if("unknown"===e.state||"unavailable"===e.state)return t(`state.default.${e.state}`);if(e.attributes.unit_of_measurement)return`${e.state}${e.attributes.unit_of_measurement}`;const s=(o=e.entity_id).substr(0,o.indexOf("."));var o;if("input_datetime"===s){let t;if(!e.attributes.has_time)return t=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),function(t,e){return mt(e).format(t)}(t,i);if(!e.attributes.has_date){const s=new Date;return t=new Date(s.getFullYear(),s.getMonth(),s.getDay(),e.attributes.hour,e.attributes.minute),function(t,e){return ft(e).format(t)}(t,i)}return t=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),function(t,e){return vt(e).format(t)}(t,i)}return e.attributes.device_class&&t(`component.${s}.state.${e.attributes.device_class}.${e.state}`)||t(`component.${s}.state._.${e.state}`)||e.state};console.info("%c  PLATINUM-WEATHER-CARD  \n%c  Version 0.0.3          ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"platinum-weather-card",name:"Platinum Weather Card",description:"An fully customisable weather card with a GUI configuration"});let bt=class extends st{constructor(){super(...arguments),this._error=[]}static async getConfigElement(){return await import("./editor-3d6d6d87.js"),document.createElement("platinum-weather-card-editor")}static getStubConfig(){return{}}getCardSize(){console.info(`Tempate Test String:${xt(this.hass.localize,this.hass.states["sensor.template_test_string"],$t(this.hass))}`),console.info(`Tempate Test Number:${xt(this.hass.localize,this.hass.states["sensor.template_test_number"],$t(this.hass))}`),console.info("getCardSize");var t=16;t+=!0===this._config.show_section_title?56:0,t+=!1!==this._config.overview?162:0,t+=!1!==this._config.show_section_extended?58:0;const e=Math.ceil(t/50);return console.info(`CardHeight=${t} CardSize=${e}`),e}setConfig(t){if(!t)throw new Error("Invalid configuration");t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({name:"Weather"},t)}shouldUpdate(t){if(!this._config)return!1;const e=t.get("hass")||void 0;if(!e||e.themes!==this.hass.themes||e.locale!==this.hass.locale)return!0;if(!1===Object.keys(this._config).every((t=>null===t.match(/^entity_/)||e.states[this._config[t]]===this.hass.states[this._config[t]])))return!0;if(this._config.show_section_daily_forecast){const t=this._config.daily_forecast_days||5;for(const s of["entity_forecast_icon_1","entity_summary_1","entity_forecast_low_temp_1","entity_forecast_high_temp_1","entity_pop_1","entity_pos_1"])if(void 0!==this._config[s]){const o=this._config[s].match(/(\d+)(?!.*\d)/g);if(o)for(var i=1;i<t;i++){const t=this._config[s].replace(/(\d+)(?!.*\d)/g,Number(o)+i);if(e.states[t]!==this.hass.states[t])return!0}}}return t.has("config")}_checkForErrors(){this._error=[],Object.keys(this._config).forEach((t=>{null!==t.match(/^entity_/)&&void 0===this.hass.states[this._config[t]]&&this._error.push(`'${t}=${this._config[t]}' not found`)}));const t=this._config.daily_forecast_days||5;for(const i of["entity_forecast_icon_1","entity_summary_1","entity_forecast_low_temp_1","entity_forecast_high_temp_1","entity_pop_1","entity_pos_1"])if(void 0!==this._config[i]){const s=this._config[i].match(/(\d+)(?!.*\d)/g);if(s)for(var e=1;e<t;e++){const t=this._config[i].replace(/(\d+)(?!.*\d)/g,Number(s)+e);void 0===this.hass.states[t]&&this._error.push(`'${i}'+${e}=${t}' not found`)}else this._error.push(`'${i}=${this._config[i]}' value needs to have a number`)}return 0!==this._error.length}_renderTitleSection(){var t,e;if(!0!==(null===(t=this._config)||void 0===t?void 0:t.show_section_title)||void 0===this._config.text_card_title&&null==this._config.entity_update_time)return U``;if(this._config.entity_update_time&&this.hass.states[this._config.entity_update_time]&&void 0!==this.hass.states[this._config.entity_update_time].state){const t=new Date(this.hass.states[this._config.entity_update_time].state);switch(this.timeFormat){case"12hour":console.log(`Locale=${this.locale||navigator.language}`),e=t.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+t.toLocaleDateString(this.locale,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).replace(",","");break;case"24hour":e=t.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+t.toLocaleDateString(this.locale,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).replace(",","");break;case"system":e=t.toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" ","")+", "+t.toLocaleDateString(navigator.language).replace(",","")}}else e="---";return U`
      <div class="title-section section">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${e}</div>`:U``}
      </div>
    `}_renderOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const i=this._weatherIcon(this.currentConditions),s=new URL("icons/"+(this._config.option_static_icons?"static":"animated")+"/"+i+".svg",import.meta.url),o="unknown"!==i?"":`Unknown condition\n${this.currentConditions}`,n=U`<div class="big-icon"><img src="${s.href}" width="100%" height="100%" title="${o}"></div>`,a=U`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,r=U`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike} <span
            id="apparent-temp-text">${this.currentApparentTemperature}</span>
        </div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `,l=!0===this._config.show_separator?U`<hr class=line>`:"",c=this._config.entity_current_text&&this.hass.states[this._config.entity_current_text]?null!==(e=U`<div class="current-text">${this.hass.states[this._config.entity_current_text].state}</div>`)&&void 0!==e?e:U`<div class="current-text">---</div>`:U``;return U`
      <div class="overview-section section">
        <div class="overview-top">
          <div class="top-left">${n}</div>
          <div class="currentTemps">${a}${r}</div>
        </div>
        ${c}
        ${l}
      </div>
    `}_renderExtendedSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_extended))return U``;const e=this._config.entity_daily_summary||"";var i=[];if(void 0!==this.hass.states[e])if(!0===this._config.extended_use_attr){if(void 0!==this._config.extended_name_attr){const t=this._config.extended_name_attr.toLowerCase().split(".").reduce(((t,e)=>void 0!==t?t[e]:void 0),this.hass.states[e].attributes);void 0!==t&&i.push(U`${t}`)}}else void 0!==this.hass.states[e]&&i.push(U`${this.hass.states[e].state}`);return i.push(U`${this._config.entity_todays_uv_forecast&&this.hass.states[this._config.entity_todays_uv_forecast]&&"unknown"!==this.hass.states[this._config.entity_todays_uv_forecast].state?" "+this.hass.states[this._config.entity_todays_uv_forecast].state:""}`),i.push(U`${this._config.entity_todays_fire_danger&&this.hass.states[this._config.entity_todays_fire_danger]&&"unknown"!==this.hass.states[this._config.entity_todays_fire_danger].state?" "+this.hass.states[this._config.entity_todays_fire_danger].state:""}`),U`
      <div class="extended-section section">
        <div class="f-extended">
          ${i}
        </div>
      </div>
    `}_renderSlotsSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_slots))return U``;var e=!0===this._config.use_old_column_format?U`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list">${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}</ul>
          </li>
          <li>
            <ul class="slot-list">${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}</ul>
          </li>
        </ul>
      </div>
    `:U`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list">
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}
            </ul>
          </li>
          <li>
            <ul class="slot-list">
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}
            </ul>
          </li>
        </ul>
      </div>
    `;return U`
      <div class="slot-section section">${e}</div>
    `}_renderHorizontalDailyForecastSection(){const t=[],e=this._config.daily_forecast_days||5;for(var i=0;i<e;i++){const e=new Date;e.setDate(e.getDate()+i+1);var s=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const o=this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,n=new URL(("icons/"+(this._config.option_static_icons?"static":"animated")+"/"+(o&&this.hass.states[o]?this._weatherIcon(this.hass.states[o].state):"unknown")+".svg").replace("-night","-day"),import.meta.url),a=U`<i class="icon" style="background: none, url(${n.href}) no-repeat; background-size: contain;"></i><br>`,r=(s=!!this._config.entity_forecast_high_temp_1&&this._config.entity_forecast_high_temp_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_high_temp_1?this._config.entity_forecast_high_temp_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,l=(s=!!this._config.entity_forecast_low_temp_1&&this._config.entity_forecast_low_temp_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_low_temp_1?this._config.entity_forecast_low_temp_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,c=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,h=!0===this._config.old_daily_format?U`
          <div class="f-slot-horiz">
            <div class="highTemp">${r&&this.hass.states[r]?Math.round(Number(this.hass.states[r].state)):"---"}</div>
            <div>${c}</div>
          </div>
          <br>
          <div class="f-slot-horiz">
            <div class="lowTemp">${l&&this.hass.states[l]?Math.round(Number(this.hass.states[l].state)):"---"}</div>
            <div>${c}</div>
          </div>`:"highlow"===this._config.tempformat?U`
            <div class="f-slot-horiz">
              <div class="highTemp">${r&&this.hass.states[r]?Math.round(Number(this.hass.states[r].state)):"---"}</div>
              <div class="slash">/</div>
              <div class="lowTemp">${l&&this.hass.states[l]?Math.round(Number(this.hass.states[l].state)):"---"}</div>
              <div>${c}</div>
            </div>`:U`
            <div class="f-slot-horiz">
              <div class="lowTemp">${l&&this.hass.states[l]?Math.round(Number(this.hass.states[l].state)):"---"}</div>
              <div class="slash">/</div>
              <div class="highTemp">${r&&this.hass.states[r]?Math.round(Number(this.hass.states[r].state)):"---"}</div>
              <div>${c}</div>
            </div>`,d=(s=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,u=s?U`<br><div class="f-slot-horiz"><div class="pop">${d&&this.hass.states[d]?Math.round(Number(this.hass.states[d].state)):"---"}</div><div class="unit">%</div></div>`:"",_=(s=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,g=s?U`<br><div class="f-slot-horiz"><div class="pos">${_&&this.hass.states[_]?this.hass.states[_].state:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></div>`:"",m=(s=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,p=U`<div class="fcasttooltiptext" id="fcast-summary-${i}">${this._config.option_tooltips&&m?this.hass.states[m]?this.hass.states[m].state:"---":""}</div>`;t.push(U`
        <div class="day-horiz fcasttooltip">
          <span class="dayname">${e?e.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</span>
          <br>${a}
          ${h}
          ${u}
          ${g}
          ${p}
        </div>
      `)}return U`
      <div class="daily-forecast-horiz-section section">
        ${t}
      </div>
    `}_renderVerticalDailyForecastSection(){const t=[],e=this._config.daily_forecast_days||5;for(var i=0;i<e;i++){const e=new Date;e.setDate(e.getDate()+i+1);var s=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const n=s&&this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0;if(!n||void 0===this.hass.states[n]||"unknown"===this.hass.states[n].state)break;const a=new URL(("icons/"+(this._config.option_static_icons?"static":"animated")+"/"+(void 0!==this.hass.states[n]?this._weatherIcon(this.hass.states[n].state):"unknown")+".svg").replace("-night","-day"),import.meta.url),r=U`<i class="icon" style="background: none, url(${a.href}) no-repeat; background-size: contain;"></i><br>`,l=(s=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,c=s?U`
        <div class="f-summary-vert">${l&&this.hass.states[l]?this.hass.states[l].state:"---"}</div>`:"",h=(s=!!this._config.entity_forecast_high_temp_1&&this._config.entity_forecast_high_temp_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_high_temp_1?this._config.entity_forecast_high_temp_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,d=(s=!!this._config.entity_forecast_low_temp_1&&this._config.entity_forecast_low_temp_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_low_temp_1?this._config.entity_forecast_low_temp_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,u=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,_=d&&this.hass.states[d]?U`
        <div class="temp-label">Min: </div>
        <div class="low-temp">${Math.round(Number(this.hass.states[d].state))}</div>${u}`:U`---`,g=h&&this.hass.states[h]?U`
        <div class="temp-label">Max: </div>
        <div class="high-temp">${Math.round(Number(this.hass.states[h].state))}</div>${u}`:U`---`,m=U`
          <div class="f-slot-vert f-slot-minmax"><div class="day-vert-minmax">${_}</div><div class="day-vert-minmax">${g}</div></div>`,p=(s=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,v=s?U`
        <div class="f-slot-vert"><div class="f-label">Chance of rain </div>
        <div class="pop">${p&&this.hass.states[p]?Math.round(Number(this.hass.states[p].state)):"---"}</div><div class="unit">%</div></div>`:"",f=(s=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0,y=s?U`
        <div class="f-slot-vert"><div class="f-label">Possible rain </div>
        <div class="pos">${f&&this.hass.states[f]?this.hass.states[f].state:"---"}</div>
        <div class="unit">${this.getUOM("precipitation")}</div></div>`:"";s=!!(this._config.entity_extended_1&&i<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g);var o=U``;if(!0===this._config.option_daily_show_extended)if(!0===this._config.daily_extended_use_attr){const t=(s=!!this._config.entity_extended_1&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):this._config.entity_extended_1;if(t&&void 0!==this.hass.states[t]){const e=null==(s=!!(this._config.daily_extended_name_attr&&i<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.daily_extended_name_attr.match(/(\d+)(?!.*\d)/g))&&t&&this._config.daily_extended_name_attr?this.hass.states[t].attributes[this._config.daily_extended_name_attr]:s&&this._config.daily_extended_name_attr&&t?this._config.daily_extended_name_attr.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)).toLowerCase().split(".").reduce(((t,e)=>void 0!==t?t[e]:void 0),this.hass.states[t].attributes):void 0;o=e?U`<div class="f-extended">${e}</div>`:U``}}else{const t=s&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(s)+i)):void 0;o=s?U`<div class="f-extended">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>`:U``}t.push(U`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="dayname-vert">${e?e.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</div>
            ${c}
          </div>
          <div class="day-vert-middle">
            <div class="day-vert-dayicon">
              ${r}
            </div>
            <div class="day-vert-values">
              ${m}
            </div>
            <div class="day-vert-values">
              ${v}
              ${y}
            </div>
          </div>
          <div class="day-vert-bottom">
            ${o}
          </div>
        </div>
      `)}return U`
      <div class="daily-forecast-vert-section section">
        ${t}
      </div>
    `}_renderDailyForecastSection(){var t;return!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)?U``:"vertical"!==this._config.daily_forecast_layout?this._renderHorizontalDailyForecastSection():this._renderVerticalDailyForecastSection()}render(){const t=[];this._checkForErrors()&&t.push(this._showConfigWarning(this._error));const e=[];return this._config.section_order.forEach((t=>{switch(t){case"title":e.push(this._renderTitleSection());break;case"overview":e.push(this._renderOverviewSection());break;case"extended":e.push(this._renderExtendedSection());break;case"slots":e.push(this._renderSlotsSection());break;case"daily_forecast":e.push(this._renderDailyForecastSection())}})),t.push(U`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card">
        <div class="content">
          ${e}
        </div>
      </ha-card>
    `),U`${t}`}get slotL1(){return this.slotValue("l1",this._config.slot_l1)}get slotL2(){return this.slotValue("l2",this._config.slot_l2)}get slotL3(){return this.slotValue("l3",this._config.slot_l3)}get slotL4(){return this.slotValue("l4",this._config.slot_l4)}get slotL5(){return this.slotValue("l5",this._config.slot_l5)}get slotL6(){return this.slotValue("l6",this._config.slot_l6)}get slotL7(){return this.slotValue("l7",this._config.slot_l7)}get slotL8(){return this.slotValue("l8",this._config.slot_l8)}get slotR1(){return this.slotValue("r1",this._config.slot_r1)}get slotR2(){return this.slotValue("r2",this._config.slot_r2)}get slotR3(){return this.slotValue("r3",this._config.slot_r3)}get slotR4(){return this.slotValue("r4",this._config.slot_r4)}get slotR5(){return this.slotValue("r5",this._config.slot_r5)}get slotR6(){return this.slotValue("r6",this._config.slot_r6)}get slotR7(){return this.slotValue("r7",this._config.slot_r7)}get slotR8(){return this.slotValue("r8",this._config.slot_r8)}slotValue(t,e){switch(e){case"pop":return this.slotPop;case"popforecast":return this.slotPopForecast;case"possible_today":return this.slotPossibleToday;case"possible_tomorrow":return this.slotPossibleTomorrow;case"rainfall":return this.slotRainfall;case"humidity":return this.slotHumidity;case"pressure":return this.slotPressure;case"observed_max":return this.slotObservedMax;case"observed_min":return this.slotObservedMin;case"forecast_max":return this.slotForecastMax;case"forecast_min":return this.slotForecastMin;case"temp_next":return this.slotTempNext;case"temp_following":return this.slotTempFollowing;case"temp_maximums":return this.slotTempMaximums;case"temp_minimums":return this.slotTempMinimums;case"uv_summary":return this.slotUvSummary;case"fire_summary":return this.slotFireSummary;case"wind":return this.slotWind;case"wind_kt":return this.slotWindKt;case"visibility":return this.slotVisibility;case"sun_next":return this.slotSunNext;case"sun_following":return this.slotSunFollowing;case"custom1":return this.slotCustom1;case"custom2":return this.slotCustom2;case"custom3":return this.slotCustom3;case"custom4":return this.slotCustom4;case"empty":return this.slotEmpty;case"remove":return this.slotRemove}switch(t){case"l1":return this.slotForecastMax;case"l2":return this.slotForecastMin;case"l3":return this.slotWind;case"l4":return this.slotPressure;case"l5":return this.slotSunNext;case"l6":case"l7":case"l8":case"r6":case"r7":case"r8":return this.slotRemove;case"r1":return this.slotPopForecast;case"r2":return this.slotHumidity;case"r3":return this.slotUvSummary;case"r4":return this.slotFireSummary;case"r5":return this.slotSunFollowing}return this.slotEmpty}get slotEmpty(){return U`<li>&nbsp;</li>`}get slotRemove(){return U``}get slotPopForecast(){const t=this._config.entity_pop?Math.round(Number(this.hass.states[this._config.entity_pop].state)):"---",e="---"!==t?U`<div class="slot-text unit">%</div>`:U``,i=this._config.entity_possible_today?this.hass.states[this._config.entity_possible_today].state:"---",s="---"!==i?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${t}</div>${e}<div class="slot-text">&nbsp;-&nbsp;</div>
          <div class="slot-text pop-text-today">${i}</div>${s}
        </div>
      </li>
    `}get slotPop(){const t=this._config.entity_pop?Math.round(Number(this.hass.states[this._config.entity_pop].state)):"---",e="---"!==t?U`<div class="slot-text unit">%</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${t}</div>${e}<div class="slot-text"></div>
        </div>
      </li>
    `}get slotPossibleToday(){const t=this._config.entity_possible_today?this.hass.states[this._config.entity_possible_today].state:"---",e="---"!==t?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosToday}&nbsp;<div class="slot-text possible_today-text">${t}</div>${e}
        </div>
      </li>
    `}get slotPossibleTomorrow(){const t=this._config.entity_possible_tomorrow?this.hass.states[this._config.entity_possible_tomorrow].state:"---",e="---"!==t?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosTomorrow}&nbsp;<div class="slot-text possible_tomorrow-text">${t}</div>${e}
        </div>
      </li>
    `}get slotRainfall(){const t=this.currentRainfall,e="---"!==t?U`<div class="slot-text unit"></span>${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text rainfall-text">${t}</div>${e}
        </div>
      </li>
    `}get slotHumidity(){const t=this.currentHumidity,e="---"!==t?U`<div class="slot-text unit">%</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:water-percent"></ha-icon>
          </div>
          <div class="slot-text humidity-text">${t}</div>${e}
        </div>
      </li>`}get slotPressure(){const t="---"!==this.currentPressure?U`<div class="slot-text unit">${this._config.pressure_units?this._config.pressure_units:this.getUOM("air_pressure")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:gauge"></ha-icon>
          </div>
          <div class="slot-text pressure-text">${this.currentPressure}</div>${t}
        </div>
      </li>
    `}get slotObservedMax(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_observed_max?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${i}
        </div>
      </li>
    `}get slotObservedMin(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_observed_min?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${i}
        </div>
      </li>
    `}get slotForecastMax(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_forecast_max?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${e}</div>${i}
        </div>
      </li>
    `}get slotForecastMin(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_forecast_min?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${e}</div>${i}
        </div>
      </li>
    `}get slotTempNext(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_temp_next_label?this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_next?Number(this.hass.states[this._config.entity_temp_next].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_next_label?this.hass.states[this._config.entity_temp_next_label].state:"",o="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempFollowing(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_temp_following_label?this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_following?Number(this.hass.states[this._config.entity_temp_following].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_following_label?this.hass.states[this._config.entity_temp_following_label].state:"",o="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempMaximums(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_observed_max?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_max?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${s}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${s}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotTempMinimums(){const t=!0===this._config.option_today_decimals?1:0,e=this._config.entity_observed_min?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_min?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${s}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${s}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotUvSummary(){const t=this._config.entity_uv_alert_summary?"unknown"!==this.hass.states[this._config.entity_uv_alert_summary].state?this.hass.states[this._config.entity_uv_alert_summary].state:"n/a":"---";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-sunny"></ha-icon>
          </div>
          <div class="slot-text daytime-uv-text">${this.localeTextUVRating} ${t}</div>
        </div>
      </li>
    `}get slotFireSummary(){const t=this._config.entity_fire_danger_summary?"unknown"!==this.hass.states[this._config.entity_fire_danger_summary].state?this.hass.states[this._config.entity_fire_danger_summary].state:"n/a":"---";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text">${this.localeTextFireDanger} ${t}</div>
        </div>
      </li>`}get slotWind(){const t=this._config.entity_wind_speed&&this._config.option_show_beaufort?U`<div class="slot-text"></div>BFT: ${this.currentBeaufort} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">${this.getUOM("length")}/h</div>`,s=this._config.entity_wind_speed?U`<div class="slot-text">${this.currentWindSpeed}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust?U`<div class="slot-text">(Gust ${this.currentWindGust}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${s}${o}
        </div>
      </li>
    `}get slotWindKt(){const t=this._config.entity_wind_speed_kt&&this._config.option_show_beaufort?U`<div class="slot-text"></div>BFT: ${this.currentBeaufortKt} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">Kt</div>`,s=this._config.entity_wind_speed_kt?U`<div class="slot-text">${this.currentWindSpeedKt}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust_kt?U`<div class="slot-text">(Gust ${this.currentWindGustKt}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${s}${o}
        </div>
      </li>
    `}get slotVisibility(){const t=this.currentVisibility,e="---"!==t?this.getUOM("length"):"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon="mdi:weather-fog"></ha-icon>
        </div>
        <div class="slot-text visibility-text">${t}</div>
        <div class="slot-text unit"> ${e}
        </div>
      </li>
    `}get slotSunNext(){return this._config.entity_sun?this.sunSet.next:U``}get slotSunFollowing(){return this._config.entity_sun?this.sunSet.following:U``}get slotCustom1(){var t=this._config.custom1_icon?this._config.custom1_icon:"mdi:help-box",e=this._config.custom1_value?this.hass.states[this._config.custom1_value].state:"unknown",i=this._config.custom1_units?this._config.custom1_units:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        <div class="slot-text custom-1-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom2(){var t=this._config.custom2_icon?this._config.custom2_icon:"mdi:help-box",e=this._config.custom2_value?this.hass.states[this._config.custom2_value].state:"unknown",i=this._config.custom2_units?this._config.custom2_units:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        <div class="slot-text custom-2-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom3(){var t=this._config.custom3_icon?this._config.custom3_icon:"mdi:help-box",e=this._config.custom3_value?this.hass.states[this._config.custom3_value].state:"unknown",i=this._config.custom3_units?this._config.custom3_units:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        <div class="slot-text custom-3-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom4(){var t=this._config.custom4_icon?this._config.custom4_icon:"mdi:help-box",e=this._config.custom4_value?this.hass.states[this._config.custom4_value].state:"unknown",i=this._config.custom4_units?this._config.custom4_units:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        <div class="slot-text custom-4-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get currentConditions(){const t=this._config.entity_current_conditions;return t&&this.hass.states[t]?this.hass.states[t].state:"---"}get currentTemperature(){const t=this._config.entity_temperature;return t&&this.hass.states[t]?!0!==this._config.show_decimals?String(Math.round(Number(this.hass.states[t].state))):Number(this.hass.states[t].state).toLocaleString(this.locale):"---"}get currentApparentTemperature(){const t=this._config.entity_apparent_temp;return t&&this.hass.states[t]?!0!==this._config.show_decimals?String(Math.round(Number(this.hass.states[t].state))):Number(this.hass.states[t].state).toLocaleString(this.locale):"---"}get currentHumidity(){const t=this._config.entity_humidity;return t&&this.hass.states[t]?Number(this.hass.states[t].state).toLocaleString(this.locale):"---"}get currentRainfall(){const t=this._config.entity_rainfall;return t&&this.hass.states[t]?Number(this.hass.states[t].state).toLocaleString(this.locale):"---"}get currentPressure(){const t=this._config.entity_pressure;var e=this._config.option_pressure_decimals?Math.max(Math.min(this._config.option_pressure_decimals,3),0):0;return t&&this.hass.states[t]?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---"}get currentVisibility(){const t=this._config.entity_visibility;return t&&this.hass.states[t]?Number(this.hass.states[t].state).toLocaleString(this.locale):"---"}get currentWindBearing(){const t=this._config.entity_wind_bearing;return t&&this.hass.states[t]?isNaN(Number(this.hass.states[t].state))?this.hass.states[t].state:this.windDirections[Math.round(Number(this.hass.states[t].state)/360*16)]:"---"}get currentWindSpeed(){const t=this._config.entity_wind_speed;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get currentWindGust(){const t=this._config.entity_wind_gust;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get currentWindSpeedKt(){const t=this._config.entity_wind_speed_kt;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get currentWindGustKt(){const t=this._config.entity_wind_gust_kt;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get windDirections(){const t=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],e=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],i=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],s=["N","NNO","NO","ONO","O","OZO","ZO","ZZO","Z","ZZW","ZW","WZW","W","WNW","NW","NNW","N"],o=["צפון","צ-צ-מז","צפון מזרח","מז-צ-מז","מזרח","מז-ד-מז","דרום מזרח","ד-ד-מז","דרום","ד-ד-מע","דרום מערב","מע-ד-מע","מערב","מע-צ-מע","צפון מערב","צ-צ-מע","צפון"],n=["N","NNØ","NØ","ØNØ","Ø","ØSØ","SØ","SSØ","S","SSV","SV","VSV","V","VNV","NV","NNV","N"],a=["С","ССВ","СВ","ВСВ","В","ВЮВ","ЮВ","ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"];switch(this.locale){case"it":case"fr":return e;case"de":return i;case"nl":return s;case"he":return o;case"ru":return a;case"da":return n;default:return t}}get currentBeaufort(){const t=this._config.entity_wind_speed;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);switch(this.hass.states[t].attributes.unit_of_measurement){case"mph":return e>=73?"12":e>=64?"11":e>=55?"10":e>=47?"9":e>=39?"8":e>=32?"7":e>=25?"6":e>=19?"5":e>=13?"4":e>=8?"3":e>=4?"2":e>=1?"1":"0";case"m/s":return e>=32.7?"12":e>=28.5?"11":e>=24.5?"10":e>=20.8?"9":e>=17.2?"8":e>=13.9?"7":e>=10.8?"6":e>=8?"5":e>=5.5?"4":e>=3.4?"3":e>=1.6?"2":e>=.5?"1":"0";default:return e>=118?"12":e>=103?"11":e>=89?"10":e>=75?"9":e>=62?"8":e>=50?"7":e>=39?"6":e>=29?"5":e>=20?"4":e>=12?"3":e>=6?"2":e>=2?"1":"0"}}return"---"}get currentBeaufortKt(){const t=this._config.entity_wind_speed_kt;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);return e>=64?"12":e>=56?"11":e>=48?"10":e>=41?"9":e>=34?"8":e>=28?"7":e>=22?"6":e>=17?"5":e>=11?"4":e>=7?"3":e>=4?"2":e>=1?"1":"0"}return"---"}get sunSet(){var t,e;switch(this.timeFormat){case"12hour":t=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"",e=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"";break;case"24hour":t=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"",e=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"";break;case"system":t=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):"",e=this._config.entity_sun?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):""}var i=new Date;return i.setDate(i.getDate()+1),this._config.entity_sun?"above_horizon"==this.hass.states[this._config.entity_sun].state?(e=i.toLocaleDateString(this.locale,{weekday:"short"})+" "+e,{next:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${t}</div>
            </li>`,following:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${e}</div>
            </li>`,nextText:t,followingText:e,nextIcon:"mdi:weather-sunset-down",followingIcon:"mdi:weather-sunset-up"}):((new Date).getDate()!=new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()&&(e=i.toLocaleDateString(this.locale,{weekday:"short"})+" "+e,t=i.toLocaleDateString(this.locale,{weekday:"short"})+" "+t),{next:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${e}</div>
            </li>`,following:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${t}</div>
            </li>`,nextText:e,followingText:t,nextIcon:"mdi:weather-sunset-up",followingIcon:"mdi:weather-sunset-down"}):{next:U``,following:U``,nextText:"",followingText:"",nextIcon:"",followingIcon:""}}get timeFormat(){return this._config.option_time_format?this._config.option_time_format:"system"}_weatherIcon(t){switch(t){case"sunny":return this.iconSunny;case"clear":return this.iconClear;case"mostly-sunny":case"mostly_sunny":return this.iconMostlySunny;case"partly-cloudy":case"partly_cloudy":case"partlycloudy":return this.iconPartlyCloudy;case"cloudy":return this.iconCloudy;case"hazy":case"hazey":case"haze":return this.iconHazy;case"frost":return this.iconFrost;case"light-rain":case"light_rain":return this.iconLightRain;case"wind":case"windy":return this.iconWindy;case"fog":case"foggy":return this.iconFog;case"showers":case"shower":return this.iconShowers;case"rain":case"rainy":return this.iconRain;case"dust":case"dusty":return this.iconDust;case"snow":case"snowy":return this.iconSnow;case"snowy-rainy":case"snowy_rainy":case"snowyrainy":return this.iconSnowRain;case"storm":case"stormy":return this.iconStorm;case"light-showers":case"light-shower":case"light_showers":case"light_shower":return this.iconLightShowers;case"heavy-showers":case"heavy-shower":case"heavy_showers":case"heavy_shower":case"pouring":return this.iconHeavyShowers;case"tropical-cyclone":case"tropical_cyclone":case"tropicalcyclone":return this.iconCyclone;case"clear-day":case"clear_day":return this.iconClearDay;case"clear-night":case"clear_night":return this.iconClearNight;case"sleet":return this.iconSleet;case"partly-cloudy-day":case"partly_cloudy_day":return this.iconPartlyCloudyDay;case"partly-cloudy-night":case"partly_cloudy_night":return this.iconPartlyCloudyNight;case"hail":return this.iconHail;case"lightning":case"lightning-rainy":case"lightning_rainy":case"thunderstorm":return this.iconLightning;case"windy-variant":case"windy_variant":return this.iconWindyVariant}return"unknown"}get dayOrNight(){return this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?{below_horizon:"night",above_horizon:"day"}[this.hass.states[this._config.entity_sun].state]:"day"}get iconStyle(){return this._config.option_icon_set?this._config.option_icon_set:"old"}get iconSunny(){const t=this.iconStyle;return"old"===t?`${this.dayOrNight}`:`sunny-${this.dayOrNight}`}get iconClear(){const t=this.iconStyle;return"old"===t?`${this.dayOrNight}`:"hybrid"===t?`sunny-${this.dayOrNight}`:`clear-${this.dayOrNight}`}get iconMostlySunny(){this.iconStyle;return`fair-${this.dayOrNight}`}get iconPartlyCloudy(){const t=this.iconStyle;return"old"===t||"hybrid"===t?`cloudy-${this.dayOrNight}-3`:`partly-cloudy-${this.dayOrNight}`}get iconCloudy(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"cloudy-original":"cloudy"}get iconHazy(){const t=this.iconStyle;return"old"===t?`cloudy-${this.dayOrNight}-1`:"haze"}get iconFrost(){this.iconStyle;return`cloudy-${this.dayOrNight}-1`}get iconLightRain(){const t=this.iconStyle;return"old"===t?"rainy-1":`rainy-1-${this.dayOrNight}`}get iconWindy(){const t=this.iconStyle;return"old"===t?"cloudy-original":"wind"}get iconFog(){const t=this.iconStyle;return"old"===t?"cloudy-original":"fog"}get iconShowers(){const t=this.iconStyle;return"old"===t?"rainy-1":`rainy-1-${this.dayOrNight}`}get iconRain(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"rainy-5":"rain"}get iconDust(){const t=this.iconStyle;return"old"===t?`cloudy-${this.dayOrNight}-1`:"haze"}get iconSnow(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"snowy-6":"snow"}get iconSnowRain(){const t=this.iconStyle;return"old"===t?"snowy-6":"rain-and-snow-mix"}get iconStorm(){this.iconStyle;return"scattered-thunderstorms"}get iconLightShowers(){this.iconStyle;return"rainy-2"}get iconHeavyShowers(){this.iconStyle;return"rainy-6"}get iconCyclone(){this.iconStyle;return"tornado"}get iconClearDay(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"day":"clear-day"}get iconClearNight(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"night":"clear-night"}get iconSleet(){const t=this.iconStyle;return"old"===t?"rainy-2":"rain-and-sleet-mix"}get iconPartlyCloudyDay(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"cloudy-day-3":"partly-cloudy-day"}get iconPartlyCloudyNight(){const t=this.iconStyle;return"old"===t||"hybrid"===t?"cloudy-night-3":"partly-cloudy-night"}get iconHail(){this.iconStyle;return"rainy-7"}get iconLightning(){this.iconStyle;return"thunder"}get iconWindyVariant(){this.iconStyle;return`cloudy-${this.dayOrNight}-3`}get locale(){try{return Intl.NumberFormat(this._config.option_locale),this._config.option_locale}catch(t){return}}get localeTextFeelsLike(){switch(this.locale){case"it":return"Percepito";case"fr":return"Ressenti";case"de":return"Gefühlt";case"nl":return"Voelt als";case"pl":return"Odczuwalne";case"he":return"מרגיש כמו";case"da":return"Føles som";case"ru":return"Ощущается как";case"ua":return"Відчувається як";default:return"Feels like"}}get localeTextObservedMax(){return this.locale,"Observed Max"}get localeTextObservedMin(){return this.locale,"Observed Min"}get localeTextObsMax(){return this.locale,"Obs Max"}get localeTextObsMin(){return this.locale,"Obs Min"}get localeTextForecastMax(){switch(this.locale){case"it":return"Max oggi";case"fr":return"Max aujourd'hui";case"de":return"Max heute";case"nl":return"Max vandaag";case"pl":return"Najwyższa dziś";case"he":return"מקסימלי היום";case"da":return"Højeste i dag";case"ru":return"Макс сегодня";case"ua":return"Макс сьогодні";default:return"Forecast Max"}}get localeTextForecastMin(){switch(this.locale){case"it":return"Min oggi";case"fr":return"Min aujourd'hui";case"de":return"Min heute";case"nl":return"Min vandaag";case"pl":return"Najniższa dziś";case"he":return"דקות היום";case"da":return"Laveste i dag";case"ru":return"мин сегодня";case"ua":return"Мін сьогодні";default:return"Forecast Min"}}get localeTextPosToday(){switch(this.locale){case"it":return"Previsione";case"fr":return"Prévoir";case"de":return"Vorhersage";case"nl":return"Prognose";case"pl":return"Prognoza";case"he":return"תַחֲזִית";case"da":return"Vejrudsigt";case"ru":case"ua":return"Прогноз";default:return"Forecast"}}get localeTextPosTomorrow(){switch(this.locale){case"it":return"Prev per domani";case"fr":return"Prév demain";case"de":case"nl":return"Prog morgen";case"pl":return"Prog jutro";case"he":return"תחזית מחר";case"da":return"Prog i morgen";case"ru":case"ua":return"Прогноз на завтра";default:return"Fore Tom"}}get localeTextFore(){switch(this.locale){case"it":return"Prev";case"fr":return"Prév";case"de":case"nl":case"pl":case"da":return"Prog";case"he":return"תַחֲזִית";case"ru":case"ua":return"Прогноз";default:return"Fore"}}get localeTextUVRating(){switch(this.locale){default:return"UV";case"ru":case"ua":return"УФ"}}get localeTextFireDanger(){switch(this.locale){case"it":return"Fuoco";case"fr":return"Feu";case"de":return"Feuer";case"nl":case"da":return"Brand";case"pl":return"Ogień";case"he":return"אֵשׁ";case"ru":return"Огонь";case"ua":return"Вогонь";default:return"Fire"}}getUOM(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":return void 0!==this._config.entity_pressure&&void 0!==this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement?this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement:"km"===e?"hPa":"mbar";case"length":return e;case"precipitation":return"km"===e?"mm":"in";case"intensity":return"km"===e?"mm/h":"in/h";default:return this.hass.config.unit_system[t]||""}}_showConfigWarning(t){return U`
      <hui-warning>
        <div>Weather Card</div>
        ${t.map((t=>U`<div>${t}</div>`))}
      </hui-warning>
    `}_showWarning(t){return U`<hui-warning>${t}</hui-warning>`}_showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),U`${e}`}get styles(){const t=this._config.tooltip_bg_color||"rgb( 75,155,239)",e=this._config.tooltip_fg_color||"#fff",i=this._config.tooltip_border_color||"rgb(255,161,0)",s=this._config.tooltip_border_width||"1",o=this._config.tooltip_caret_size||"5",n=this._config.tooltip_width||"200",a=this._config.option_tooltips?"visible":"hidden",r=this._config.temp_font_weight||"300",l=this._config.temp_font_size||"4em",d=this._config.current_text_font_size||"1.5em",u=this._config.current_text_alignment||"center";return h`
      .card {
        padding: 8px 16px 8px 16px;
      }
      .content {
        align-items: center;
      }
      .card-header {
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
      .section {
        margin: -1px;
        border: 1px solid transparent;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .extended-section {
        padding-left: 8px;
        padding-right: 8px;
      }
      .updated {
        font-size: 0.9em;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .overview-top {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
      }
      .top-left {
        display: flex;
        flex-direction: column;
        height: 8em;
      }
      .big-icon {
        height: 140px;
        width: 140px;
        position: relative;
        left: -8px;
        top: -20px;
      }
      .currentTemps {
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        padding: 0px 10px;
      }
      .current-temp {
        display: table-row;
        margin-left: auto;
        padding: 4px 0px;
      }
      .temp {
        display:table-cell;
        font-weight: ${c(r)};
        font-size: ${c(l)};
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .unit-temp-big {
        display: table-cell;
        vertical-align: top;
        font-weight: ${c(r)};
        font-size: 1.5em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .apparent-temp {
        display: table-row;
        margin-left: auto;
        height: 24px;
      }
      .apparent {
        display: table-cell;
        color: var(--primary-text-color);
        font-weight: 300;
        position: relative;
        line-height: 24px;
      }
      .unit-temp-small {
        display: table-cell;
        vertical-align: top;
        font-size: 0.75em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 1em;
        padding-top: 6px;
      }
      .line {
        margin-top : 7px;
        margin-bottom: -9px;
        color: var(--primary-text-color);
      }
      .current-text {
        font-size: ${c(d)};
        text-align: ${c(u)};
        line-height: 1.2em;
      }
      .variations {
        display: flex;
        flex-flow: row wrap;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .slot-list-item-1 {
        min-width:50%;
        padding-right: 16px;
      }
      .slot-list {
        list-style: none;
        padding: 0;
      }
      .slot-list li {
        height:24px;
      }
      .variations-ugly {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .ha-icon {
        height: 24px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .unit {
        font-size: 0.8em;
      }
      .slot {
        display: table-row;
      }
      .slot-icon {
        display: table-cell;
        position: relative;
        height: 18px;
        padding-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .slot-text {
        display: table-cell;
        position: relative;
      }
      .daily-forecast-horiz-section {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        margin: 0 auto;
        clear: both;
      }
      .daily-forecast-horiz-section .day-horiz:nth-last-child(1) {
        border-right: none;
      }
      .day-horiz {
        flex: 1;
        float: left;
        text-align: center;
        color: var(--primary-text-color);
        border-right: .1em solid #d9d9d9;
        line-height: 24px;
        box-sizing: border-box;
      }
      .daily-forecast-vert-section {
        display: flex;
        flex-flow: column nowrap;
        margin: 0 auto;
        clear: both;
      }
      .day-vert {
        flex: 1;
        color: var(--primary-text-color);
        border-top: .1em solid #d9d9d9;
        line-height: 24px;
        box-sizing: border-box;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 8px;
      }
      .day-vert-top {
        display: flex;
        width: 100%;
      }
      .day-vert-middle {
        display: flex;
        float: left;
        width: 100%;
      }
      .day-vert-bottom {
        text-align: left;
        float: left;
      }
      .day-vert-dayicon {
        width: 40px;
        text-align: left;
        float: left;
        margin-bottom: -8px;
      }
      .day-vert-values {
        flex: 1;
        text-align: left;
        float: left;
        padding-left: 1em;
        padding-top: 0.5em;
      }
      .day-vert-minmax {
        width: 50%;
        display: table-cell;
        float: left;
      }
      .dayname {
        text-transform: uppercase;
      }
      .dayname-vert {
        min-width: 40px;
        max-width: 40px;
        text-transform: uppercase;
      }
      .icon {
        width: 50px;
        height: 50px;
        margin: auto;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }
      .f-slot-horiz {
        display: inline-table;
        overflow: hidden;
        height: 24px;
        font-weight: 300;
      }
      .f-summary-vert {
        padding-left: 1em;
        font-weight: 400;
      }
      .f-slot-vert {
        display: table;
        overflow: hidden;
        height: 24px;
        font-weight: 300;
      }
      .f-slot-minmax {
        width: 100%;
      }
      .f-extended {
        display: inline-table;
        font-size: 13px;
        font-weight: 300;
        padding-top: 8px;
        line-height:20px;
      }
      .extended-section .f-extended {
        padding-top: 0;
      }
      .highTemp {
        display: table-cell;
        font-weight: bold;
      }
      .lowTemp {
        display: table-cell;
        font-weight: 300;
      }
      .slash {
        padding-left: 2px;
        padding-right: 2px;
      }
      .high-temp {
        display: table-cell;
        font-weight: bold;
        width: 1.5em;
        text-align: right;
      }
      .low-temp {
        display: table-cell;
        font-weight: 300;
        width: 1.5em;
        text-align: right;
      }
      .temp-label {
        display: table-cell;
        font-weight: 300;
      }
      .f-label {
        display: table-cell;
        white-space: nowrap;
        padding-right: 0.2em;
      }
      .pop {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .pos {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
        white-space: nowrap;
      }
      .fcasttooltip {
        position: relative;
        display: inline-block;
      }
      .fcasttooltip .fcasttooltiptext {
        visibility: hidden;
        width: ${c(n)}px;
        background-color: ${c(t)};
        color: ${c(e)};
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: ${c(i)};
        border-width: ${c(s)}px;
        padding: 5px 0;
        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        bottom: 100%;
        left: 50%;
        -webkit-transform: translateX(-50%); /* Safari iOS */
        transform: translateX(-50%);
      }
      .fcasttooltip .fcasttooltiptext:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -${c(o)}px;
        border-width: ${c(o)}px;
        border-style: solid;
        border-color: ${c(i)} transparent transparent transparent;
      }
      .fcasttooltip:hover .fcasttooltiptext {
        visibility: ${c(a)};
      }
    `}};s([rt({attribute:!1})],bt.prototype,"hass",void 0),s([lt()],bt.prototype,"_config",void 0),bt=s([nt("platinum-weather-card")],bt);export{U as $,bt as W,e as _,i as a,s as b,z as c,o as d,rt as e,nt as f,d as i,ut as l,yt as n,ct as o,h as r,st as s,lt as t,W as w};
