package me.blockhead.common.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * {@link <a href="https://github.com/JianChoi-Kor/Login">reference page</a>}
 */
@Builder
@Getter
@AllArgsConstructor
public class JWToken {
    private String accessToken;
    private String refreshToken;
    private String grantType;
    private Long refreshTokenExpirationTime;
}