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
   xmlns:a="assets"
   xmlns:d="default"
   xmlns:U="com.spencernetdevelopment.xsl.Utils"
   xmlns:AM="com.spencernetdevelopment.AssetManager"
   xmlns:RM="com.spencernetdevelopment.RewriteManager"
   xmlns:fn="functions"
   exclude-result-prefixes="a d fn U AM RM"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:param name="xmlPagePath"/>
   <!-- something like /index.html -->
   <xsl:param name="domainRelativePagePath"/>
   <xsl:param name="enableRewrites" select="false()"/>
   <xsl:param name="AM"/>
   <xsl:param name="RM"/>

   <xsl:template name="HTML5Doctype">
      <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
   </xsl:template>

   <!-- reset -->
   <xsl:template match="*"></xsl:template>
   <xsl:template match="d:*"></xsl:template>

   <!-- Elements-->
   <xsl:template match="d:a"><a><xsl:apply-templates select="@*"/><xsl:apply-templates/></a></xsl:template>
   <xsl:template match="d:button"><button><xsl:apply-templates select="@*"/><xsl:apply-templates/></button></xsl:template>
   <xsl:template match="d:br"><br/></xsl:template>
   <xsl:template match="d:b"><b><xsl:apply-templates select="@*"/><xsl:apply-templates/></b></xsl:template>
   <xsl:template match="d:code"><code><xsl:apply-templates select="@*"/><xsl:apply-templates/></code></xsl:template>
   <xsl:template match="d:div"><div><xsl:apply-templates select="@*"/><xsl:apply-templates/></div></xsl:template>
   <xsl:template match="d:form"><form><xsl:apply-templates select="@*"/><xsl:apply-templates/></form></xsl:template>
   <xsl:template match="d:h1"><h1><xsl:apply-templates select="@*"/><xsl:apply-templates/></h1></xsl:template>
   <xsl:template match="d:h2"><h2><xsl:apply-templates select="@*"/><xsl:apply-templates/></h2></xsl:template>
   <xsl:template match="d:h3"><h3><xsl:apply-templates select="@*"/><xsl:apply-templates/></h3></xsl:template>
   <xsl:template match="d:h4"><h4><xsl:apply-templates select="@*"/><xsl:apply-templates/></h4></xsl:template>
   <xsl:template match="d:h5"><h5><xsl:apply-templates select="@*"/><xsl:apply-templates/></h5></xsl:template>
   <xsl:template match="d:i"><i><xsl:apply-templates select="@*"/><xsl:apply-templates/></i></xsl:template>
   <xsl:template match="d:img"><img><xsl:apply-templates select="@*"/></img></xsl:template>
   <xsl:template match="d:iframe"><iframe><xsl:apply-templates select="@*"/></iframe></xsl:template>
   <xsl:template match="d:input"><input><xsl:apply-templates select="@*"/><xsl:apply-templates/></input></xsl:template>
   <xsl:template match="d:label"><label><xsl:apply-templates select="@*"/><xsl:apply-templates/></label></xsl:template>
   <xsl:template match="d:li"><li><xsl:apply-templates select="@*"/><xsl:apply-templates/></li></xsl:template>
   <xsl:template match="d:link"><link><xsl:apply-templates select="@*"/></link></xsl:template>
   <xsl:template match="d:ol"><ol><xsl:apply-templates select="@*"/><xsl:apply-templates/></ol></xsl:template>
   <xsl:template match="d:p"><p><xsl:apply-templates select="@*"/><xsl:apply-templates/></p></xsl:template>
   <xsl:template match="d:script">
      <script>
         <xsl:apply-templates select="@*"/>
         <xsl:value-of select="AM:expandVariables($AM, .)"
                       disable-output-escaping="yes"/>
         <xsl:apply-templates select="a:include"/>
      </script>
   </xsl:template>
   <xsl:template match="d:style">
      <style>
         <xsl:apply-templates select="@*"/>
         <xsl:value-of select="AM:expandVariables($AM, .)"
                       disable-output-escaping="yes"/>
      </style>
   </xsl:template>
   <xsl:template match="d:span"><span><xsl:apply-templates select="@*"/><xsl:apply-templates/></span></xsl:template>
   <xsl:template match="d:strong"><strong><xsl:apply-templates select="@*"/><xsl:apply-templates/></strong></xsl:template>
   <xsl:template match="d:select"><select><xsl:apply-templates select="@*"/><xsl:apply-templates/></select></xsl:template>
   <xsl:template match="d:source"><source><xsl:apply-templates select="@*"/><xsl:apply-templates/></source></xsl:template>
   <xsl:template match="d:textarea"><textarea><xsl:apply-templates select="@*"/><xsl:apply-templates/></textarea></xsl:template>
   <xsl:template match="d:u"><u><xsl:apply-templates/></u></xsl:template>
   <xsl:template match="d:ul"><ul><xsl:apply-templates select="@*"/><xsl:apply-templates/></ul></xsl:template>
   <xsl:template match="d:video"><video><xsl:apply-templates select="@*"/><xsl:apply-templates/></video></xsl:template>

   <!-- pre element -->
   <xsl:template match="d:pre"><pre><xsl:apply-templates select="@*"/><xsl:apply-templates mode="pre"/></pre></xsl:template>
   <xsl:template match="d:pre[@preserve]"><xsl:copy-of select="."/></xsl:template>
   <xsl:template match="*" mode="pre">&lt;<xsl:value-of select="local-name()"/>&gt;<xsl:apply-templates mode="pre"/>&lt;<xsl:value-of select="local-name()"/>&gt;</xsl:template>
   <xsl:template match="text()" mode="pre">
      <xsl:value-of select="AM:expandVariables($AM, .)"/>
   </xsl:template>

   <!--ATTRIBUTES-->
   <xsl:template match="@*">
      <xsl:attribute name="{name(.)}">
         <xsl:value-of select="AM:expandVariables($AM,.)"/>
      </xsl:attribute>
   </xsl:template>

   <!-- text -->
   <xsl:template match="text()">
      <xsl:value-of select="AM:expandVariables($AM,U:normalizeSpace(.))"/>
   </xsl:template>

   <!-- head -->
   <xsl:template match="d:head" mode="head">
      <xsl:apply-templates/>
   </xsl:template>
   <xsl:template match="text()" mode="head">
   </xsl:template>

   <!-- seo -->
   <xsl:template match="text()" mode="seo">
   </xsl:template>
   <xsl:template match="d:seo" mode="seo">
      <xsl:apply-templates mode="seo"/>
   </xsl:template>
   <xsl:template match="d:title" mode="seo">
      <title>
         <xsl:value-of select="AM:expandVariables($AM,.)"/>
      </title>
   </xsl:template>
   <xsl:template match="d:description" mode="seo">
      <meta name="description">
         <xsl:attribute name="content">
            <xsl:value-of select="AM:expandVariables($AM, .)"/>
         </xsl:attribute>
      </meta>
   </xsl:template>
   <xsl:template match="d:keywords" mode="seo">
      <meta name="keywords">
         <xsl:attribute name="content">
            <xsl:value-of select="AM:expandVariables($AM, .)"/>
         </xsl:attribute>
      </meta>
   </xsl:template>
   <xsl:template match="d:seo/d:rewrites" mode="seo">
      <xsl:if test="count(*) > 0">
         <xsl:variable name="default">
            <xsl:choose>
               <xsl:when test="string(d:default) != ''">
                  <xsl:value-of select="d:default"/>
               </xsl:when>
               <xsl:otherwise>
                  <xsl:value-of select="$domainRelativePagePath"/>
               </xsl:otherwise>
            </xsl:choose>
         </xsl:variable>
         <link rel="canonical" href="{$default}"/>
      </xsl:if>
      <xsl:apply-templates mode="seo"/>
   </xsl:template>
   <xsl:template
      match="d:seo/d:rewrites/d:url|d:seo/d:rewrites/d:default"
      mode="seo"
   >
      <xsl:if test="$enableRewrites">
         <xsl:value-of select="RM:queueRewrite(
            $RM, $domainRelativePagePath, text()
         )"/>
      </xsl:if>
   </xsl:template>

   <xsl:template match="d:phrase">
      <xsl:apply-templates/>
   </xsl:template>

   <!-- misc -->
   <xsl:template name="Favicon">
      <xsl:variable name="path">images/favicon.png</xsl:variable>
      <xsl:value-of select="AM:transferImage($AM, $path)"/>
      <link rel="icon" type="image/png" href="{$assetPrefixInBrowser}/{$path}"/>
   </xsl:template>

</xsl:stylesheet>
