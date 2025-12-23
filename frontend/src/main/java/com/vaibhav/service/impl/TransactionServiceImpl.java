package com.vaibhav.service.impl;

import com.vaibhav.model.Order;
import com.vaibhav.model.Seller;
import com.vaibhav.model.Transaction;
import com.vaibhav.repository.SellerRepository;
import com.vaibhav.repository.TransactionRepository;
import com.vaibhav.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private  final TransactionRepository transactionRepository;
    private  final SellerRepository sellerRepository;
    @Override
    public Transaction createTransaction(Order order) {
        Seller seller = sellerRepository.findById(order.getSellerId()).get();
        Transaction transaction = new Transaction();
        transaction.setSeller(seller);
        transaction.setCustomer(order.getUser());
        transaction.setOrder(order);


        return transactionRepository.save(transaction);

    }



    @Override
    public List<Transaction> getTransactionsBySellerId(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());
    }

    @Override
    public List<Transaction> getAllTransaction() {
        return transactionRepository.findAll();
    }
}
