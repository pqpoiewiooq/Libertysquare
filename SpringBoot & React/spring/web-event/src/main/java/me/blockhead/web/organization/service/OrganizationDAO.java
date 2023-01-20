package me.blockhead.web.organization.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class OrganizationDAO {
	//private EntityManager em;
	private JPAQueryFactory query;

	public OrganizationDAO(EntityManager em) {
		//this.em = em;
		this.query = new JPAQueryFactory(em);
	}

//	public Set<OrganizationDTO> getAffiliated(String memberAuthId) {
//		QMemberEntity member = QMemberEntity.memberEntity;
//		QOrganizationEntity organization = QOrganizationEntity.organizationEntity;
//		QOrganizerEntity organizer = QOrganizerEntity.organizerEntity;
//		
//		query.select(organization.id, organization.coverPath);
//
//		return null;
//	}

}
