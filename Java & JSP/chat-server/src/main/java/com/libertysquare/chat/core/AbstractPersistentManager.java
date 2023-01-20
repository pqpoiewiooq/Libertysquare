package com.libertysquare.chat.core;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nullable;

import lombok.RequiredArgsConstructor;
import net.jodah.expiringmap.ExpirationPolicy;
import net.jodah.expiringmap.ExpiringMap;

@RequiredArgsConstructor
public abstract class AbstractPersistentManager<ID, PERSISTENT extends Persistent<ID>> {
	private ExpiringMap<ID, PERSISTENT> persistentMap = ExpiringMap.builder()
				.expiration(10, TimeUnit.MINUTES)
				.expirationPolicy(ExpirationPolicy.ACCESSED)
				.<ID, PERSISTENT>expirationListener((id, persistent) -> {
					savePersistent(persistent);
				})
				.build();
	
	@Nullable
	protected final PERSISTENT findPersistent(ID id) {
		return persistentMap.get(id);
	}
	
	/**
	 * 영속화되어있지 않으면 {@link #savePersistent(Persistent)}를 호출하여 영속화 진행
	 */
	@Nullable
	public final PERSISTENT find(ID id) {
		PERSISTENT value = findPersistent(id);
		if(value == null) {
			Optional<PERSISTENT> entry = loadPersistent(id);
			if(entry.isPresent()) persist(id, value);
		} else {
			persistentMap.resetExpiration(id);
		}
		
		return value;
	}
	
	/**
	 * 영속화된 경우 영속화된 객체와 바꾸고, 아닌 경우 저장하고 영속화
	 */
	protected final PERSISTENT save(PERSISTENT persistent) {
		persistent = savePersistent(persistent);
		persist(persistent);
		return persistent;
	}
	
	protected final void persist(ID id, PERSISTENT persistent) {
		if(id == null) return;
		persistentMap.put(id, persistent);
	}
	
	protected final void persist(PERSISTENT persistent) {
		persist(persistent.getId(), persistent);
	}
	
	protected final void persistAll(Iterable<PERSISTENT> persistents) {
		persistents.forEach(persistent -> {
			persist(persistent);
		});
	}

	protected abstract PERSISTENT savePersistent(PERSISTENT persistent);
	protected abstract Iterable<PERSISTENT> savePersistentAll(Iterable<PERSISTENT> persistents);
	protected abstract Optional<PERSISTENT> loadPersistent(ID id);
	
	protected void flush() {
		savePersistentAll(persistentMap.values());
	}
}
