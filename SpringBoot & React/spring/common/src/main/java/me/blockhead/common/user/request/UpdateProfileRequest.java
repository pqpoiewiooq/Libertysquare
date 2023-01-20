package me.blockhead.common.user.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.common.user.domain.User;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class UpdateProfileRequest {
	@URL
    private String profilePath;
	
	@NotBlank
    @Size(max = User.Limit.NICKNAME)
    private String nickname;
}
