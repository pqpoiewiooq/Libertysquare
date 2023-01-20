package me.blockhead.payment.service;

import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.blockhead.payment.config.PaymentConfig;
import me.blockhead.payment.data.PaymentData;

@Service
@RequiredArgsConstructor
public class PaymentDataService {
	private final PaymentConfig paymentConfig;

	private static final Set<PaymentData> waiting = Collections.synchronizedSet(new LinkedHashSet<>());

	public PaymentData find(UUID payer) {
		long ctime = System.currentTimeMillis();
		PaymentData result = null;

		Iterator<PaymentData> it = waiting.iterator();
		while (it.hasNext()) {
			PaymentData data = it.next();
			if ((ctime - data.getRequestTime()) > paymentConfig.getTimeout()) {
				it.remove();
			} else if (data.getPayer().equals(payer)) {
				result = data;
			}
		}
		return result;
	}

	public void add(PaymentData data) {
		waiting.add(data);
	}

	public void remove(UUID payer) {
		waiting.remove(find(payer));
	}

}
