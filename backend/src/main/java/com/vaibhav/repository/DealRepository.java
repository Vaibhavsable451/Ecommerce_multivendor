package com.vaibhav.repository;

import com.vaibhav.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DealRepository  extends JpaRepository<Deal,Long> {
}
