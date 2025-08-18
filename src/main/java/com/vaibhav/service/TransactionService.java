package com.vaibhav.service;

import com.vaibhav.model.Order;
import com.vaibhav.model.Seller;
import com.vaibhav.model.Transaction;

import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Order order);


    List<Transaction> getTransactionsBySellerId(Seller seller);

    List<Transaction> getAllTransaction();
}

