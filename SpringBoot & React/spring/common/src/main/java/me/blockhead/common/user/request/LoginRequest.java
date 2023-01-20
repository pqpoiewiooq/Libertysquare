package me.blockhead.common.user.request;

import javax.validation.constraints.NotBlank;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.common.annotation.validation.Password;
import me.blockhead.common.annotation.validation.PhoneNumber;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class LoginRequest {
    @NotBlank
    @PhoneNumber
    private String id;
    
    @Password
    private String pw;
}
