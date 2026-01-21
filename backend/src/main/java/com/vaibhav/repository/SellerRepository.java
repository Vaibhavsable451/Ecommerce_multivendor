package com.vaibhav.repository;

import com.vaibhav.domain.AccountStatus;
import com.vaibhav.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository  extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);
    List<Seller> findByAccountStatus(AccountStatus Status);
}
