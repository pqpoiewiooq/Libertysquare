package me.blockhead.web.organization.domain;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
	Optional<Organization> findByIdAndState(Long id, OrganizationState state);

	boolean existsByNameAndState(String name, OrganizationState state);
}
