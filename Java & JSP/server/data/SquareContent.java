package data;

import java.io.Serializable;

import com.google.gson.GsonBuilder;

public class SquareContent  implements Serializable{
	private static final long serialVersionUID = -8589380824910190710L;
	
    public long contentID = -1;

    public String title = " ";
    
    public String classification = " ";
    
    public String instruction = " ";
    
    public String supervisor = " ";
    
    public String contact = " ";
    
    public long date = 0;
    public String time_start = " ";
    public String time_end = " ";
    
    public String place = null;
    public String place_detail = null;
    
    public byte[] image;
    
    public byte[] ticketCode = null;
    
    public int like = 0;
    
    public long reporter = -1;
    
    public Object[] tag;
    
    public void trim() {
    	title = trim(title);
    	instruction = trim(instruction);
    	supervisor = trim(supervisor);
    	contact = trim(contact);
    	place = trim(place);
    }
    
    private String trim(String str) {
    	if(str == null) return "";
    	return str.replaceAll(" ", "&nbsp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br/>");
    	
    }
    
    public String[] getContacts() {
    	return contact.split("|");
    }
    
    public String toJson() {
    	return new GsonBuilder().create().toJson(this);
    }
    
    public static SquareContent fromJson(String json) {
    	return new GsonBuilder().create().fromJson(json, SquareContent.class);
    }
}