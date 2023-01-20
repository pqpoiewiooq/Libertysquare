package data;

public class Account {
	private Bank bank;
	private String number;
	private String holder;
	
	public Account(Bank bank, String number, String holder) {
		this.bank = bank;
		this.number = number;
		this.holder = holder;
	}
	
	public Bank getBank() {
		return this.bank;
	}
	
	public String getNumber() {
		return this.number;
	}
	
	public String getHolder() {
		return this.holder;
	}
	
	@Override
	public String toString() {
		return "[" + bank.toString() + "] [" + number + "] [" + holder + "]";
	}
}
