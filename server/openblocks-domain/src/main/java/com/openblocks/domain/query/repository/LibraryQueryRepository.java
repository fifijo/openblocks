package com.openblocks.domain.query.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.openblocks.domain.query.model.LibraryQuery;

import reactor.core.publisher.Flux;

@Repository
public interface LibraryQueryRepository extends ReactiveMongoRepository<LibraryQuery, String> {

    Flux<LibraryQuery> findByOrganizationId(String organizationId);
}
