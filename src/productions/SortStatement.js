/**
 * @constructor
 * @extends {Production}
 * @param {Output} safeArrayOutput
 * @param {ProductionContext} context
 */
function SortStatement(
   safeArrayOutput,
   context
){
   var sortParameters = new Output();
   context.getParams().
   put(js_sortSafeArray,
      context.javascript.getJSSortSafeArray()
   );

   /**
    * @type {boolean}
    */
   var hasContextSelector=false;
   /**
    * @type {boolean}
    */
   var hasSortDirection=false;

   /**
    * @param {CharWrapper} characters
    * @param {ProductionContext} context
    */
   this.execute=function(characters, context){

      characters.removeSpace();

      if(!hasContextSelector){
         hasContextSelector=true;
         /**
          * @type {Output}
          */
         var contextSelectorOutput = new Output();

         safeArrayOutput.
            prepend(js_sortSafeArray+"(").
            append(sortParameters).
            append(")");
         sortParameters.
            add(",function("+js_context+", "+js_name+"){return ").
            add(contextSelectorOutput).
            add("}");
         context.addProduction(new ContextSelector(contextSelectorOutput, true));
         return;
      } else {
         if(!hasSortDirection){
            var sortDirection = characters.match(SORT_DIRECTION);
            if(sortDirection){
               hasSortDirection=true;

               var direction = sortDirection[1];
               characters.shift(direction.length);
               var directionCode=0;
               var promoteNum = false;
               var casePreference = 0;
               var caseSensitivity=0;

               switch(direction){
               case "|asc":directionCode=0;break;
               case "|desc":directionCode=1;break;
               case "|rand":directionCode=2;break;
               }

               var sortModifiers = characters.match(SORT_MODIFIERS);
               if(sortModifiers){
                  if(directionCode===2){
                     throw "Modifiers are not allowed after |rand";
                  }
                  var modifiers = sortModifiers[1];
                  characters.shift(modifiers.length);

                  if(modifiers.indexOf("i") > -1){
                     caseSensitivity=1;
                     if(/i[^i]*?i/i.test(modifiers)){
                        throw "'i' may only appear once in sort options.";
                     }
                  }
                  promoteNum=modifiers.indexOf("n") > -1;
                  if(promoteNum && /n[^n]*?n/i.test(modifiers)){
                     throw "'n' may only appear once in sort options.";
                  }
                  if(modifiers.indexOf("c") > -1){
                     casePreference = 1;
                  } else if (modifiers.indexOf("C") > -1){
                     casePreference = 2;
                  }
                  if(casePreference){
                     if(/c[^c]*?c/i.test(modifiers)){
                        throw "Only one of 'c' or 'C' may appear in sort options.";
                     }
                  }
               }

               sortParameters.
                  add(
                     ","+
                     directionCode+
                     ","+
                     (promoteNum?1:0)+
                     ","+
                     casePreference+
                     ","+
                     caseSensitivity
                  );
            } else {
               throw "Sort direction must be one of '|asc', '|desc' or '|rand'.";
            }
         }

         if(!hasSortDirection){
            throw "One of '|asc', '|desc' or '|rand' is required.";
         }

         if(characters.charAt(0) === '}'){
            characters.shift(1);
            context.removeProduction();
            return;
         }
      }
      throw "Invalid Character.";
   };
}
extend(SortStatement, Production);
/**
 * @const
 * @type {string}
 */
SortStatement.prototype.name="SortStatement";
