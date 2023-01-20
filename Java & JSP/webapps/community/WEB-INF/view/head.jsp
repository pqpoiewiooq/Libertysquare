<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String uri = (String) request.getAttribute("uri");
if(uri == null) uri = request.getRequestURI();
String _url = request.getScheme() + "://" +  "flattop.kr" /*request.getServerName()*/ + uri;

String _title = request.getParameter("title");
if(_title == null) _title = "FLATTOP";
String _desc = request.getParameter("desc");
if(_desc == null) _desc = "국내 최대 커뮤니티 포털, 인터넷 트랜드의 중심을 꿈꾸는 플랫탑입니다.";
String _image = request.getParameter("image");
if(_image == null) _image = "https://ls2020.cafe24.com/img/flattop/og.png";

String _icon = request.getParameter("icon");
if(_icon == null) _icon = "https://ls2020.cafe24.com/img/flattop/favicon.ico";
%>

<meta charset="utf-8">

<!-- OpenGraph -->
<meta property="og:url" content="<%= _url %>">
<meta property="og:title" content="<%= _title %>">  
<meta property="og:type" content="website">
<meta property="og:description" content="<%= _desc %>">
<meta property="og:image" content="<%= _image %>">
<meta property="og:site_name" content="FLATTOP">

<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">

<title><%= _title %></title>

<link rel="shortcut icon" type="image/x-icon" href="<%= _icon %>" />
<link rel="icon" type="image/x-icon" href="<%= _icon %>">

<!-- css -->
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/common.css">

<!-- js -->
<script type="text/javascript" src="https://ls2020.cafe24.com/js/common.js"></script>