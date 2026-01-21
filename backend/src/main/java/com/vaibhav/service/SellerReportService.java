package com.vaibhav.service;

import com.vaibhav.model.Seller;
import com.vaibhav.model.SellerReport;

public interface SellerReportService {

    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);

}
