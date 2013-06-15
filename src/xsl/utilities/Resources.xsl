<?xml version="1.0" encoding="UTF-8"?>
<!--
   Copyright 2012 Joseph Spencer.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->
<xsl:stylesheet version="1.0"
                xmlns:p="phrases"
                xmlns:d="default"
                xmlns:AR="com.spencernetdevelopment.AssetResolver"
                xmlns:file="java.io.File"
                exclude-result-prefixes="p d AR file"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:param name="AR"/>

   <xsl:template match="p:*">
      <xsl:variable name="phrasesPath"
                    select="AR:getResourcePath($AR, 'phrases')"/>
      <xsl:variable name="id" select="local-name()"/>
      <xsl:variable name="phrase" select="document(
         $phrasesPath
      )/d:phrases/d:phrase[@id=$id]"/>
      <xsl:choose>
         <xsl:when test="string($phrase) = ''">
            <xsl:message>
phrases.xml:  Couldn't find phrase with id: <xsl:value-of select="$id"/>
            </xsl:message>
         </xsl:when>
         <xsl:otherwise>
            <xsl:apply-templates select="$phrase"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>

</xsl:stylesheet>
