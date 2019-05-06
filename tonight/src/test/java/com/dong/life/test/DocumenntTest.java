package com.dong.life.test;

import com.alibaba.fastjson.JSON;
import com.dong.life.document.MenuDocument;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DocumenntTest {


    @Autowired
    MongoTemplate mongoTemplate;

    @Test
    public void test(){

        MenuDocument root = new MenuDocument("home","#home/home.html",null);

        List<MenuDocument> sublist = new ArrayList<>();
        sublist.add(new MenuDocument("home2","#home/home2.html",null));
        sublist.add(new MenuDocument("home3","#home/home3.html",null));
        sublist.add(new MenuDocument("home4","#home/home4.html",null));

        root.setChildren(sublist);

        mongoTemplate.insertAll(sublist);
        mongoTemplate.save(root);
    }


    @Test
    public void query(){
        Query q = new Query();
        Criteria criteria = new Criteria();
        criteria.and("menuId").is("5ccfd13c79faaa403029614e");
        q.addCriteria(criteria);
        List<MenuDocument> menuDocuments = mongoTemplate.find(q,MenuDocument.class);
        System.out.println(JSON.toJSON(menuDocuments));
    }

}
