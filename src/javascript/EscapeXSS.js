function EscapeXSS(s){
      if(typeof(s)==='string'){
         return s.
            replace(/&(?![a-zA-Z]+;|#[0-9]+;)/g,'&amp;').
            replace(/"/g, '&#34;').
            replace(/'/g, '&#39;').
            replace(/&(?![a-zA-Z]+;|#[0-9]+;)/g, '&#96;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
      }
      return s;
}
