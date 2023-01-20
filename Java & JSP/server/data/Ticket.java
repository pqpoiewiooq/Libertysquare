package data;

import java.io.Serializable;

import com.google.gson.GsonBuilder;

public class Ticket implements Serializable{
	private static final long serialVersionUID = 8985592717292019944L;

	public static enum Type {
		FCFS, SELECTION
	}
	
	private Long id;
	private Type type; 
	private String name;
	private String desc;
	private Integer price;
	private Integer amount;
	private Integer curAmount;
	private Boolean isHide;
	private Integer purchaseLimit;
	private String startDate;
	private String endDate;
	private String refundDeadline;
	private int[] options;

	/* Setter */
	public void setID(Long id) {
		this.id = id;
	}
	
	public void setType(Type type) {
		this.type = type;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setDescription(String desc) {
		this.desc = desc;
	}
	
	public void setPrice(Integer price) {
		this.price = price;
	}
	
	public void setAmount(Integer amount) {
		this.amount = amount;
	}
	
	public void setCurrentAmount(Integer cur) {
		this.curAmount = cur;
	}
	
	public void setHide(Boolean isHide) {
		this.isHide = isHide;
	}
	
	public void setPurchaseLimit(Integer limit) {
		this.purchaseLimit = limit;
	}
	
	public void setStartDate(String date) {
		this.startDate = date;
	}
	
	public void setEndDate(String date) {
		this.endDate = date;
	}
	
	public void setRefundDeadline(String date) {
		this.refundDeadline = date;
	}
	
	public void setOptions(int[] options) {
		this.options = options;
	}
	
	/* Getter */
	public Long getID() {
		return this.id;
	}
	
	public Type getType() {
		return this.type;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getDescription() {
		return this.desc;
	}
	
	public Integer getPrice() {
		return this.price;
	}
	
	public String getPriceString() {
		if(this.price <= 0) return "무료";
		String str = this.price + "";
		return "₩" + str.replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
	}
	
	public Integer getAmount() {
		return this.amount;
	}
	
	public Integer getCurrentAmount() {
		return this.curAmount;
	}
	
	public Boolean isHide() {
		return this.isHide;
	}
	
	public Integer getPurchaseLimit() {
		return this.purchaseLimit;
	}
	
	public String getStartDate() {
		return this.startDate;
	}
	
	public String getEndDate() {
		return this.endDate;
	}
	
	public String getRefundDeadline() {
		return this.refundDeadline;
	}
	
	public int[] getOptions() {
		return this.options;
	}
	
	public static Ticket fromJson(String json) {
		return new GsonBuilder().create().fromJson(json, Ticket.class);
	}
}
