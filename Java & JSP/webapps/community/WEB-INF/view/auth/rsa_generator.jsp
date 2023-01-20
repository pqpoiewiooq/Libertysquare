<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="servlet.util.ServletHelper"%>
<%@ page import="util.CryptoHelper"%>
<%@ page import="java.security.KeyPair"%>
<%@ page import="java.security.KeyFactory"%>
<%@ page import="java.security.spec.RSAPublicKeySpec"%>
<%
String modulus = null;
String exponent = null;
try {
    session.removeAttribute(CryptoHelper.PRIVATE_KEY);

    KeyPair keyPair = CryptoHelper.genRSAKeyPair();
    session.setAttribute(CryptoHelper.PRIVATE_KEY, keyPair.getPrivate());

    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    RSAPublicKeySpec publicSpec = keyFactory.getKeySpec(keyPair.getPublic(), RSAPublicKeySpec.class);
    modulus = publicSpec.getModulus().toString(16);
    exponent = publicSpec.getPublicExponent().toString(16);
} catch(Exception e) {
    ServletHelper.alert(response.getWriter(), "Key Pair Generation Failed", "/sign");
    return;
}
%>