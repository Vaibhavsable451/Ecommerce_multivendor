package com.vaibhav.service;

import com.vaibhav.model.Home;
import com.vaibhav.model.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);


}
