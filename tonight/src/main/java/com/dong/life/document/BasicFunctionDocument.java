package com.dong.life.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document("BasicFunctionDocument")
public class BasicFunctionDocument {

    @Id
    private String id;

    //文档名称
    private String docName;

    //功能名称
    private String funcName;

    @DBRef
    private List<BasicFunctionItemDocument> items;

}
