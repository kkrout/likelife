package com.dong.life.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document("MenuDocument")
public class MenuDocument implements Comparable<MenuDocument> {

    @Id
    private String menuId;

    private String name;

    private String url;

    private String iconCls;

    private boolean root;

    private int sort;

    private int diy;

    private String funcId;

    private String template;

    private String script;

    @DBRef
    private List<MenuDocument> children;

    public MenuDocument(String name,String url,String iconCls){
        this.name=name;
        this.url=url;
        this.iconCls=iconCls;
    }

    @Override
    public int compareTo(MenuDocument o) {
        return o.getSort() - this.getSort();
    }
}
