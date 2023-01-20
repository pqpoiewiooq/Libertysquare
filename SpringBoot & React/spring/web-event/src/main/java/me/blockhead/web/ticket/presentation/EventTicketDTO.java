package me.blockhead.web.ticket.presentation;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.blockhead.web.ticket.domain.EventTicket;
import me.blockhead.web.ticket.domain.EventTicketType;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EventTicketDTO {
	private long id;
	private EventTicketType type;
	private String name;
	private String description;
	private int price;

	private Integer quantity;
	private Integer stock;
	private int purchaseLimit;
	private Integer personnel;

	private LocalDateTime startDateTime;
	private LocalDateTime endDateTime;
	private LocalDateTime refundDeadline;

//    @QueryProjection
//    public EventTicketDTO(long id, EventTicketType type, String name, String description, int price, Integer quantity, Integer stock, int purchaseLimit, Integer personnel, LocalDateTime startDateTime, LocalDateTime endDateTime, LocalDateTime refundDeadline) {
//    	this.id = id;
//    	this.type = type;
//    	this.name = name;
//    	this.description = description;
//    	this.price = price;
//    	this.quantity = quantity;
//    	this.stock = stock;
//    	this.purchaseLimit = purchaseLimit;
//    	if(isHi) {
//    		personnel = entity.getQuantity() - entity.getStock();
//    	} else {
//    		this.quantity = entity.getQuantity();
//    		this.stock = entity.getStock();
//    	}
//    }

	public EventTicketDTO(EventTicket ticket) {
		this.id = ticket.getId();
		this.type = ticket.getType();
		this.name = ticket.getName();
		this.description = ticket.getDescription();
		this.price = ticket.getPrice();

		if (ticket.isHideStock()) {
			personnel = ticket.getQuantity() - ticket.getStock();
		} else {
			this.quantity = ticket.getQuantity();
			this.stock = ticket.getStock();
		}
		this.purchaseLimit = ticket.getPurchaseLimit();
		this.startDateTime = ticket.getStartDateTime();
		this.endDateTime = ticket.getEndDateTime();
		this.refundDeadline = ticket.getRefundDeadline();
	}

	public static class EventTicketDTOBuilder {
		public EventTicketDTOBuilder personnel(EventTicket ticket) {
			this.personnel = ticket.getQuantity() - ticket.getStock();
			return this;
		}
	}
}