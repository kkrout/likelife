package com.dong.life.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("BasicFunctionItemDocument")
public class BasicFunctionItemDocument {

    @Id
    private String id;

    private String field;

    private String displayName;

    private String type;

    private String typeName;

    private int len;

    private String defaultValue;

    private String remark;

    private String auto;

    private String autoName;

    private int required;

}
