package com.vaibhav.repository;

import com.vaibhav.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository  extends JpaRepository<Coupon,Long> {

    Coupon findByCode(String code);
}
