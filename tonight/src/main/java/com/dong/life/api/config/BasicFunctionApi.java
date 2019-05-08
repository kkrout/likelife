package com.dong.life.api.config;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dong.life.document.BasicFunctionDocument;
import com.dong.life.document.BasicFunctionItemDocument;
import com.dong.life.document.MenuDocument;
import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/config/basicfunc")
public class BasicFunctionApi {


    @Autowired
    MongoTemplate mongoTemplate;

    //获取功能
    @RequestMapping("get/{docId}")
    public BasicFunctionDocument getFunc(@PathVariable("docId")String docId){
        BasicFunctionDocument docInfo = mongoTemplate.findById(docId, BasicFunctionDocument.class);
        return docInfo;
    }

    @RequestMapping("list/{docId}")
    public List getList(@PathVariable("docId")String docId, @RequestBody JSONObject param){

        BasicFunctionDocument docInfo = mongoTemplate.findById(docId, BasicFunctionDocument.class);

        String docName = docInfo.getDocName();
        //字段列表
        Map<String,BasicFunctionItemDocument> structsMap = new HashMap();
        for(BasicFunctionItemDocument docItem:docInfo.getItems()){
            structsMap.put(docItem.getFiled(),docItem);
        }

        Set<String> fieldSet = structsMap.keySet();

        List<Document> all = mongoTemplate.findAll(Document.class, docName);
        for(Document doc:all){
            String id = doc.get("_id").toString();
            doc.put("_id",id);
        }
        return all;
    }

    @RequestMapping("add")
    public void addBasicFunction(@RequestBody BasicFunctionDocument document){
        //添加item
        mongoTemplate.insertAll(document.getItems());
        mongoTemplate.insert(document);
    }

}
