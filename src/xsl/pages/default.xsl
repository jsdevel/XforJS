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
<!--
    Description:
      This is the default page for all xml pages.
-->
<xsl:stylesheet version="1.0"
   xmlns:d="default"
   xmlns:AM="com.spencernetdevelopment.AssetManager"
   xmlns:AR="com.spencernetdevelopment.AssetResolver"
   xmlns:saxon="http://icl.com/saxon"
   exclude-result-prefixes="d saxon AM AR"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >

   <xsl:import href="../utilities/HTML.xsl"/>
   <xsl:import href="../utilities/Resources.xsl"/>
   <xsl:import href="../utilities/Assets.xsl"/>

   <xsl:param name="enableDevMode"/>
   <xsl:param name="AM"/>
   <xsl:param name="AR"/>

   <xsl:output method="html" indent="no" saxon:omit-meta-tag="yes"/>

   <xsl:template match="/">
      <xsl:variable name="numberOfPages" select="count(//d:page)"/>

      <xsl:choose>
         <xsl:when test="$numberOfPages = 0">
            <xsl:message terminate="yes">
               There must be at least one page defined with xmlns="default".
            </xsl:message>
         </xsl:when>
         <xsl:when test="$numberOfPages &gt; 1">
            <xsl:message terminate="yes">
               Only one page may be defined.
            </xsl:message>
         </xsl:when>
         <xsl:when test="count(d:page) = 0">
            <xsl:message terminate="yes">
               page with xmlns="default" must be the root element.
            </xsl:message>
         </xsl:when>
         <xsl:otherwise>
            <xsl:apply-templates select="d:page"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>

   <xsl:template match="d:page">
      <xsl:call-template name="HTML5Doctype"/>
      <html class="no-js">
         <head>
            <meta charset="utf-8"/>
            <xsl:apply-templates select="d:seo" mode="defaultStylesheet"/>
            <xsl:apply-templates select="d:head" mode="defaultStylesheet"/>
         </head>
         <body>
            <xsl:apply-templates select="d:body" mode="defaultStylesheet"/>
            <xsl:if test="$enableDevMode">
               <xsl:variable name="path"
                             select="AR:getCleanJSPath($AR,
                                 'StaticPageUtils/CheckForChange'
                             )"/>
               <xsl:value-of select="AM:transferAsset($AM, $path)"/>
               <script src="{$assetPrefixInBrowser}/{$path}"/>
            </xsl:if>
         </body>
      </html>
   </xsl:template>

   <!-- These are here to allow for an override mechanism. -->
   <xsl:template match="d:seo" mode="defaultStylesheet">
      <xsl:apply-templates select="." mode="seo"/>
   </xsl:template>
   <xsl:template match="d:head" mode="defaultStylesheet">
      <xsl:apply-templates select="." mode="head"/>
   </xsl:template>
   <xsl:template match="d:body" mode="defaultStylesheet">
      <xsl:apply-templates/>
   </xsl:template>

</xsl:stylesheet>
