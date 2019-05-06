package com.dong.life.document;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("TestDocument")
public class TestDocument {

    private String name;

}
