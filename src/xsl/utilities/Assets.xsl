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
   xmlns:string="java.lang.String"
   xmlns:GAT="com.spencernetdevelopment.GroupedAssetTransaction"
   xmlns:AM="com.spencernetdevelopment.AssetManager"
   xmlns:AR="com.spencernetdevelopment.AssetResolver"
   xmlns:GATM="com.spencernetdevelopment.GroupedAssetTransactionManager"
   xmlns:LV="com.spencernetdevelopment.LinkValidator"
   xmlns:U="com.spencernetdevelopment.xsl.Utils"
   exclude-result-prefixes="a d string GAT U AM AR GATM LV"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:param name="assetPrefixInBrowser"/>
   <xsl:param name="xmlPagePath"/>
   <xsl:param name="AM"/>
   <xsl:param name="AR"/>
   <xsl:param name="GATM"/>
   <xsl:param name="LV"/>

   <xsl:template match="a:*">
      <xsl:message terminate="yes">
   Unknown asset element 'a:<xsl:value-of select="local-name(.)"/>'.
   The following attributes were found on this element:
         <xsl:for-each select="@*">
            <xsl:value-of select="concat(local-name(.), '=', .)"/>
         </xsl:for-each>
      </xsl:message>
   </xsl:template>

   <xsl:template match="a:css[@src]">
      <xsl:variable name="src"
                    select="AM:expandVariables($AM, @src)"/>
      <xsl:value-of select="AM:transferCSS($AM,
            $src,
            @compress
         )"/>
      <link href="{$assetPrefixInBrowser}/{AR:getCSSPath($AR, $src)}"
            rel="stylesheet" type="text/css"
      >
         <xsl:apply-templates select="@*[
            local-name() != 'rel' and
            local-name() != 'type' and
            local-name() != 'href' and
            local-name() != 'compress' and
            local-name() != 'src'
         ]"/>
      </link>
   </xsl:template>

   <xsl:template match="a:externalLink[@src]">
      <xsl:variable name="src"
                    select="AM:expandVariables($AM, @src)"/>
      <xsl:value-of select="LV:validateExternalURL($LV, $src)"/>

      <a href="{$src}">
         <xsl:apply-templates select="@*[
            local-name() != 'href' and
            local-name() != 'src' and
            local-name() != 'name'
         ]"/>
         <xsl:choose>
            <xsl:when test="count(node()) = 0 and not(@name)">
               <xsl:value-of select="$src"/>
            </xsl:when>
            <xsl:when test="@name and count(node()) = 0">
               <xsl:value-of select="@name"/>
            </xsl:when>
            <xsl:otherwise>
               <xsl:apply-templates select="node()"/>
            </xsl:otherwise>
         </xsl:choose>
      </a>
   </xsl:template>

   <xsl:template match="a:group[@type = 'js' or @type = 'css']">
      <xsl:variable name="transaction" select="GATM:startTransaction($GATM,
            @type,
            @compress
         )"/>
      <xsl:for-each select="d:url">
         <xsl:value-of select="GAT:addURL(
            $transaction,
            AM:expandVariables($AM, text())
         )"/>
      </xsl:for-each>
      <xsl:variable name="identifier" select="GAT:getIdentifier($transaction)"/>

      <xsl:choose>
         <xsl:when test="@type = 'css'">
            <xsl:variable name="cssPath"
                          select="AR:getCSSPath($AR, $identifier)"/>
            <link href="{$assetPrefixInBrowser}/{$cssPath}" rel="stylesheet"
                  type="text/css"
            >
               <xsl:apply-templates select="@*[
                  local-name() != 'rel' and
                  local-name() != 'type' and
                  local-name() != 'href' and
                  local-name() != 'compress' and
                  local-name() != 'src'
               ]"/>
            </link>
         </xsl:when>
         <xsl:otherwise>
            <xsl:variable name="jsPath"
                          select="AR:getJSPath($AR, $identifier)"/>
            <script src="{$assetPrefixInBrowser}/{$jsPath}"
                    type="text/javascript"
            >
               <xsl:apply-templates select="@*[
                     local-name() != 'src' and
                     local-name() != 'type' and
                     local-name() != 'compress'
                  ]"/>
            </script>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>

   <xsl:template match="a:image[@src]">
      <xsl:variable name="src"
                    select="AM:expandVariables($AM, @src)"/>
      <xsl:variable name="path" select="AR:getImagePath($AR, $src)"/>
      <xsl:value-of select="AM:transferImage($AM,
         AR:getCleanImagePath($AR, $src)
      )"/>
      <img src="{$assetPrefixInBrowser}/{$path}">
         <xsl:apply-templates select="@*[local-name() != 'src']"/>
      </img>
   </xsl:template>

   <xsl:template match="a:include[@asset]">
      <xsl:variable name="asset"
                    select="AM:expandVariables($AM, @asset)"/>
      <xsl:value-of select="string(AM:getAsset($AM, $asset))"
                    disable-output-escaping="yes"/>
   </xsl:template>

   <xsl:template match="a:js[@src]">
      <xsl:variable name="src"
                    select="AM:expandVariables($AM, @src)"/>
      <xsl:value-of select="AM:transferJS($AM,
         $src,
         @compress
      )"/>
      <script src="{$assetPrefixInBrowser}/{AR:getJSPath($AR, $src)}">
         <xsl:apply-templates
            select="@*[local-name() != 'src' and local-name() != 'compress']"/>
      </script>
   </xsl:template>

   <xsl:template match="a:pageLink[@src]">
      <xsl:variable name="src"
                    select="AM:expandVariables($AM, @src)"/>
      <xsl:variable name="class"
                    select="AM:expandVariables($AM, @class)"/>
      <xsl:variable name="name"
                    select="AM:expandVariables($AM, @name)"/>
      <xsl:value-of select="LV:validatePageReference($LV, $src)"/>
      <xsl:variable name="referencedPageDocument"
                    select="document(AR:getPagePath($AR, $src))/d:page"/>
      <xsl:variable name="rewritePath">
         <xsl:variable name="default"
                       select="$referencedPageDocument/d:seo/d:rewrites/d:default/text()"/>
         <xsl:if test="string($default) != ''">
            <xsl:value-of select="AM:expandVariables($AM, $default)"/>
         </xsl:if>
      </xsl:variable>

      <xsl:if test="@frag">
         <xsl:value-of select="LV:validateFragmentReference(
            $LV,
            $src,
            AM:expandVariables($AM, @frag)
         )"/>
      </xsl:if>

      <xsl:variable name="frag">
         <xsl:if test="@frag">
            <xsl:value-of select="concat(
               '#',
               AM:expandVariables($AM, @frag)
            )"/>
         </xsl:if>
      </xsl:variable>

      <a>
         <xsl:apply-templates select="@*[
            local-name() != 'class' and
            local-name() != 'frag' and
            local-name() != 'href' and
            local-name() != 'src' and
            local-name() != 'name'
         ]"/>
         <xsl:attribute name="href">
            <xsl:choose>
               <xsl:when
                  test="string($rewritePath) != ''">
                  <xsl:value-of select="concat(
                        $assetPrefixInBrowser,
                        AR:getNormalizedRewritePath($AR, $rewritePath)
                     )"/>
               </xsl:when>
               <xsl:otherwise>
                  <xsl:value-of select="concat(
                        $assetPrefixInBrowser,
                        '/',
                        string:replaceAll($src, '%', '%25'),
                        '.html'
                     )"/>
               </xsl:otherwise>
            </xsl:choose>
            <xsl:value-of select="$frag"/>
         </xsl:attribute>
         <xsl:variable name="isCurrentPage"
                       select="string:endsWith(
                           $xmlPagePath,
                           concat($src,'.xml'))
                        "/>
         <xsl:if test="@class or $isCurrentPage">
            <xsl:attribute name="class">
               <xsl:if test="@class">
                  <xsl:value-of select="$class"/>
               </xsl:if>
               <xsl:if test="$isCurrentPage"> selected</xsl:if>
            </xsl:attribute>
         </xsl:if>
         <xsl:choose>
            <xsl:when test="count(node()) = 0 and not(@name)">
               <xsl:value-of select="string:replaceAll($src, '%2F', '/')"/>
            </xsl:when>
            <xsl:when test="@name and count(node()) = 0">
               <xsl:value-of select="$name"/>
            </xsl:when>
            <xsl:otherwise>
               <xsl:apply-templates select="node()"/>
            </xsl:otherwise>
         </xsl:choose>
      </a>
   </xsl:template>

   <xsl:template match="a:phrase">
      <xsl:apply-templates/>
   </xsl:template>

   <xsl:template match="a:script[@src]">
      <script>
         <xsl:value-of select="AM:getJS($AM,
            AM:expandVariables($AM, @src),
            @compress
         )" disable-output-escaping="yes"/>
      </script>
   </xsl:template>

   <xsl:template match="a:style[@src]">
      <style type="text/css">
         <xsl:value-of select="AM:getCSS($AM,
            AM:expandVariables($AM, @src),
            @compress
         )" disable-output-escaping="yes"/>
      </style>
   </xsl:template>

   <xsl:template match="a:transfer[@src]">
      <xsl:value-of select="AM:transferAsset($AM,
         AM:expandVariables($AM, @src)
      )"/>
   </xsl:template>

   <!-- views -->
   <xsl:template match="a:view">
      <xsl:variable name="viewPath" select="AR:getViewPath(
         $AR,
         AM:expandVariables($AM, text())
      )"/>
      <xsl:apply-templates select="document($viewPath)/d:view"/>
   </xsl:template>

   <xsl:template match="d:view">
      <xsl:apply-templates/>
   </xsl:template>

</xsl:stylesheet>
