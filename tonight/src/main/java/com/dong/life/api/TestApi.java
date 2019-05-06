package com.dong.life.api;

import com.dong.life.document.TestDocument;
import com.mongodb.Mongo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestApi {

    @Autowired
    MongoTemplate mongotemplate;

    @RequestMapping("")
    public String test(){
        TestDocument doc = new TestDocument();
        doc.setName("Test");
        mongotemplate.save(doc);
        return "";
    }

}
