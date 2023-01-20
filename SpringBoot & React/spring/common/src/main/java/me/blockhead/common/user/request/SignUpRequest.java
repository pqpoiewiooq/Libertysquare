package me.blockhead.common.user.request;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.common.annotation.validation.Password;
import me.blockhead.common.annotation.validation.PhoneNumber;
import me.blockhead.common.constant.TemporalConfig;
import me.blockhead.common.user.domain.National;
import me.blockhead.common.user.domain.User;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class SignUpRequest {
    @NotBlank
    @PhoneNumber
    private String id;

    @Password
    private String pw;
    
    @NotBlank
    @Size(max = User.Limit.NAME)
    private String name;

    @NotNull
    @JsonFormat(pattern = TemporalConfig.DATE_FORMAT)
	private LocalDate birth;

    @NotBlank
    @Size(max = User.Limit.GENDER)
	private String gender;

    @NotNull
	private National national;

    @NotBlank
    @Size(max = User.Limit.DI)
	private String di;

    @NotBlank
    @Size(max = User.Limit.MOBILE_CORP)
	private String mobileCorp;
	
    @Size(max = User.Limit.FCM_TOKEN)
	private String fcmToken;
}
