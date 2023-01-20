package me.blockhead.firebase.fcm.message;

public class DefaultFCMJsonSerializer implements FCMJsonSerializer {

	@Override
	public String serialize(Message msg) {
		return null;
	}

	/**
	 * @deprecated Not supported by default
	 */
	@Override
	@Deprecated
	public Message deserialize(String json) {
		return null;
	}

}
