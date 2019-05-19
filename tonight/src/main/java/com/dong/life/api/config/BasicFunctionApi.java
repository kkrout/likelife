package com.dong.life.api.config;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dong.life.constants.DocumentConstants;
import com.dong.life.document.BasicFunctionDocument;
import com.dong.life.document.BasicFunctionItemDocument;
import com.dong.life.document.MenuDocument;
import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.apache.commons.lang3.StringUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileDescriptor;
import java.util.*;

@RestController
@RequestMapping("/api/config/basicfunc")
public class BasicFunctionApi {


    @Autowired
    MongoTemplate mongoTemplate;


    @RequestMapping("page/{pageSize}/{pageNum}")
    public JSONObject page(@PathVariable("pageSize") long pageSize, @PathVariable("pageNum") long pageNum, @RequestBody JSONObject param) {

        String keyword = param.getString("keyword");
        Criteria criteria = StringUtils.isNotBlank(keyword) ? Criteria.where("docName").regex(".*" +keyword+ ".*") : new Criteria();
        long count = mongoTemplate.count(new Query(criteria), BasicFunctionDocument.class);


        //排除指定字段
        List<AggregationOperation> options = new ArrayList<>();
        options.add(Aggregation.match(criteria));
        options.add(Aggregation.project().andExclude("items"));
        options.add(Aggregation.skip( (pageNum-1)* pageSize ));
        options.add(Aggregation.limit(pageSize));

        AggregationResults<BasicFunctionDocument> aggregate = mongoTemplate.aggregate(Aggregation .newAggregation(options), BasicFunctionDocument.class,
                BasicFunctionDocument.class);
        List<BasicFunctionDocument> mappedResults = aggregate.getMappedResults();

        JSONObject pageResult = new JSONObject();
        pageResult.put("total",count);
        pageResult.put("list",mappedResults);

        return pageResult;
    }

    //获取功能
    @RequestMapping("get/{docId}")
    public BasicFunctionDocument getFunc(@PathVariable("docId") String docId) {
        BasicFunctionDocument docInfo = mongoTemplate.findById(docId, BasicFunctionDocument.class);
        return docInfo;
    }

    @RequestMapping("funcPage/{docId}/{pageSize}/{pageNum}")
    public JSONObject getList(@PathVariable("docId") String docId,@PathVariable("pageSize") long pageSize,
                        @PathVariable("pageNum") long pageNum, @RequestBody JSONObject param) {

        BasicFunctionDocument docInfo = mongoTemplate.findById(docId, BasicFunctionDocument.class);

        String docName = docInfo.getDocName();

        Criteria criteria = new Criteria();
        long count = mongoTemplate.count(new Query(criteria), Document.class,docName);

        List<AggregationOperation> options = new ArrayList<>();

        options.add(Aggregation.match(criteria));
        options.add(Aggregation.skip( (pageNum-1)* pageSize ));
        options.add(Aggregation.limit(pageSize));

        AggregationResults<Document> aggregate = mongoTemplate.aggregate(Aggregation .newAggregation(options),docName,Document.class);
        List<Document> mappedResults = aggregate.getMappedResults();
        for (Document doc : mappedResults) {
            String id = doc.get("_id").toString();
            doc.put("_id", id);
        }
        JSONObject pageResult = new JSONObject();
        pageResult.put("total",count);
        pageResult.put("list",mappedResults);

        return pageResult;
    }


    @RequestMapping("add")
    public String addBasicFunction(@RequestBody BasicFunctionDocument document) {
        document.setDocName(DocumentConstants.BASIC_FUNCTION_DOCUMENT_PACKAGE + document.getDocName());
        //添加item
        mongoTemplate.insertAll(document.getItems());
        mongoTemplate.insert(document);

        return document.getId();
    }

    @RequestMapping("update")
    public String updateBasicFunction(@RequestBody BasicFunctionDocument document) {
        BasicFunctionDocument dbdoc = mongoTemplate.findById(document.getId(), BasicFunctionDocument.class);
        List<BasicFunctionItemDocument> items = dbdoc.getItems();
        for (BasicFunctionItemDocument item : items) {
            mongoTemplate.remove(item);
        }
        //添加item
        mongoTemplate.insertAll(document.getItems());
        mongoTemplate.save(document);

        return document.getId();
    }

}
