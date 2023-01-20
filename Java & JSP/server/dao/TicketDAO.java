package dao;

import java.sql.ResultSet;

import data.Ticket;
import database.ResultSetSequence;
import database.Table;
import database.query.DeleteQuery;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;

public class TicketDAO extends DefaultDAO<Ticket> {
	protected TicketDAO() {
		super(Table.TICKET);
	}

	@Override
	public synchronized long insert(Ticket ticket) {
		InsertQuery query = QueryFactory.insert(getTable())
				.add(null)
				.add(ticket.getType().name())
				.add(ticket.getName())
				.add(ticket.getDescription())
				.add(ticket.getPrice())
				.add(ticket.getAmount())
				.add(ticket.isHide())
				.add(ticket.getPurchaseLimit())
				.add(ticket.getStartDate())
				.add(ticket.getEndDate())
				.add(ticket.getRefundDeadline())
				.addToJson(ticket.getOptions())
				.add(null);
		
		return executeInsert(query);
	}

	protected static Ticket parse(ResultSet rs) {
		return parse(new ResultSetSequence(rs));
	}
	
	protected static Ticket parse(ResultSetSequence sequence) {
		try {
			Ticket ticket = new Ticket();

			ticket.setID(sequence.nextLong());
			ticket.setType(sequence.nextFrom(Ticket.Type::valueOf));
			ticket.setName(sequence.nextString());
			ticket.setDescription(sequence.nextString());
			ticket.setPrice(sequence.nextInt());
			ticket.setAmount(sequence.nextInt());
			ticket.setHide(sequence.nextBoolean());
			ticket.setPurchaseLimit(sequence.nextInt());
			ticket.setStartDate(sequence.nextString());
			ticket.setEndDate(sequence.nextString());
			ticket.setRefundDeadline(sequence.nextString());
			ticket.setOptions(sequence.nextFromJson(int[].class));
			sequence.jump(1);//gen_time
			ticket.setCurrentAmount(ticket.getAmount() - sequence.nextInt());
			
			return ticket;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public Ticket get(long ticketID) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("*, (SELECT count(*) FROM attendant WHERE ticket_id=ticket.id AND attendant.state != 'REFUND')")
				.eq("id", ticketID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	@Override
	public boolean update(Ticket ticket) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("name", ticket.getName())
				.set("description", ticket.getDescription())
				.set("price", ticket.getPrice())
				.set("amount", ticket.getAmount())
				.set("hide_flag", ticket.isHide())
				.set("purchase_limit", ticket.getPurchaseLimit())
				.set("start_date", ticket.getStartDate())
				.set("end_date", ticket.getEndDate())
				.set("refund_deadline", ticket.getRefundDeadline())
				.eq("id", ticket.getID());
		
		return executeUpdate(query);
	}
	
	@Override
	public boolean delete(long ticketID) {
		DeleteQuery query = QueryFactory.delete(getTable())
				.eq("id", ticketID);
		
		return executeUpdate(query);
	}
}
