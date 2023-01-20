package me.blockhead.firebase.fcm.message;

public interface FCMJsonSerializer {
	public String serialize(Message msg);
	public Message deserialize(String json);
}
