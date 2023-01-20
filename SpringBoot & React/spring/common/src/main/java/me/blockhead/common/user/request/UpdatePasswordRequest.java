package me.blockhead.common.user.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.common.annotation.validation.Password;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class UpdatePasswordRequest {
	@Password
    private String currentPw;
	
	@Password
    private String newPw;
}